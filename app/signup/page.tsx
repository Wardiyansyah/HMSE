'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, GraduationCap, AlertCircle, CheckCircle } from 'lucide-react';
import { signUp, getAllClasses, type SignupData } from '@/lib/auth-helpers';

interface Class {
  id: string;
  nama_kelas: string;
  tingkat: number;
  jenjang: 'SD' | 'SMP' | 'SMA';
  jurusan?: string;
  wali_kelas_id?: string;
  tahun_ajaran: string;
  kapasitas: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [classes, setClasses] = useState<Class[]>([]);
  const [formData, setFormData] = useState<SignupData>({
    username: '',
    password: '',
    nama: '',
    kelas: '',
    role: 'student',
    nisn: '',
    no_hp: '',
    email: '',
  });

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      setLoadingClasses(true);
      const { classes: classData, error: classError } = await getAllClasses();

      if (classError) {
        console.error('Error loading classes:', classError);
        setError('Gagal memuat data kelas: ' + classError);
        return;
      }

      setClasses(classData);
    } catch (err) {
      console.error('Unexpected error loading classes:', err);
      setError('Terjadi kesalahan saat memuat data kelas');
    } finally {
      setLoadingClasses(false);
    }
  };

  const handleInputChange = (field: keyof SignupData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear errors when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      if (!formData.username || !formData.password || !formData.nama || !formData.kelas) {
        setError('Mohon lengkapi semua field yang wajib diisi');
        return;
      }

      if (formData.password.length < 6) {
        setError('Password minimal 6 karakter');
        return;
      }

      if (formData.role === 'student' && !formData.nisn) {
        setError('NISN wajib diisi untuk siswa');
        return;
      }

      console.log('Submitting signup data:', { ...formData, password: '[HIDDEN]' });

      const result = await signUp(formData);

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.success) {
        setSuccess(result.message || 'Akun berhasil dibuat! Silakan login.');
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Terjadi kesalahan saat mendaftar. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Group classes by level for better organization
  const groupedClasses = classes.reduce((acc, cls) => {
    const key = cls.jenjang;
    if (!acc[key]) acc[key] = [];
    acc[key].push(cls);
    return acc;
  }, {} as Record<string, Class[]>);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <GraduationCap className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Daftar Akun Baru</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sudah punya akun?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Login di sini
            </Link>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informasi Akun</CardTitle>
            <CardDescription>Lengkapi data diri Anda untuk membuat akun</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div>
                  <Label htmlFor="role">Role *</Label>
                  <Select value={formData.role} onValueChange={(value: 'student' | 'teacher' | 'admin') => handleInputChange('role', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Siswa</SelectItem>
                      <SelectItem value="teacher">Guru</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="username">Username *</Label>
                  <Input id="username" type="text" value={formData.username} onChange={(e) => handleInputChange('username', e.target.value)} placeholder="Masukkan username" required />
                </div>

                <div>
                  <Label htmlFor="password">Password *</Label>
                  <Input id="password" type="password" value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} placeholder="Minimal 6 karakter" required />
                </div>

                <div>
                  <Label htmlFor="nama">Nama Lengkap *</Label>
                  <Input id="nama" type="text" value={formData.nama} onChange={(e) => handleInputChange('nama', e.target.value)} placeholder="Masukkan nama lengkap" required />
                </div>

                <div>
                  <Label htmlFor="kelas">{formData.role === 'student' ? 'Kelas *' : formData.role === 'teacher' ? 'Mata Pelajaran' : 'Divisi'}</Label>
                  {formData.role === 'student' ? (
                    loadingClasses ? (
                      <div className="flex items-center justify-center p-4 border rounded-md">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span className="text-sm text-gray-600">Memuat data kelas...</span>
                      </div>
                    ) : (
                      <Select value={formData.kelas} onValueChange={(value) => handleInputChange('kelas', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kelas" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(groupedClasses).map(([jenjang, classList]) => (
                            <div key={jenjang}>
                              <div className="px-2 py-1 text-sm font-medium text-gray-500 bg-gray-100">{jenjang}</div>
                              {classList.map((cls) => (
                                <SelectItem key={cls.id} value={cls.nama_kelas}>
                                  {cls.nama_kelas} - Tingkat {cls.tingkat}
                                </SelectItem>
                              ))}
                            </div>
                          ))}
                        </SelectContent>
                      </Select>
                    )
                  ) : (
                    <Input
                      id="kelas"
                      type="text"
                      value={formData.kelas}
                      onChange={(e) => handleInputChange('kelas', e.target.value)}
                      placeholder={formData.role === 'teacher' ? 'Contoh: Matematika, Bahasa Indonesia' : 'Contoh: Akademik, Keuangan'}
                    />
                  )}
                </div>

                {formData.role === 'student' && (
                  <div>
                    <Label htmlFor="nisn">NISN *</Label>
                    <Input id="nisn" type="text" value={formData.nisn} onChange={(e) => handleInputChange('nisn', e.target.value)} placeholder="Nomor Induk Siswa Nasional" required />
                  </div>
                )}

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="email@example.com" />
                </div>

                <div>
                  <Label htmlFor="no_hp">No. HP *</Label>
                  <Input id="no_hp" type="tel" value={formData.no_hp} onChange={(e) => handleInputChange('no_hp', e.target.value)} placeholder="08xxxxxxxxxx" required />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading || loadingClasses}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mendaftar...
                  </>
                ) : (
                  'Daftar'
                )}
              </Button>

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  Dengan mendaftar, Anda menyetujui{' '}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                    Syarat & Ketentuan
                  </Link>{' '}
                  dan{' '}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                    Kebijakan Privasi
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
