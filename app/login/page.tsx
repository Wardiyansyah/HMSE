'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, GraduationCap, AlertCircle, CheckCircle } from 'lucide-react';
import { signInWithCredentials, saveUserSession, type LoginData } from '@/lib/auth-helpers';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<LoginData>({
    username: '',
    password: '',
  });

  const handleInputChange = (field: keyof LoginData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear messages when user starts typing
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
      if (!formData.username || !formData.password) {
        setError('Username dan password wajib diisi');
        return;
      }

      console.log('Attempting login for username:', formData.username);

      const result = await signInWithCredentials(formData);

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.success && result.user) {
        setSuccess(result.message || 'Login berhasil!');

        // Save user session
        saveUserSession(result.user);

        // Redirect based on role
        setTimeout(() => {
          switch (result.user?.role) {
            case 'student':
              router.push('/dashboard/student');
              break;
            case 'teacher':
              router.push('/dashboard/teacher');
              break;
            case 'admin':
              router.push('/dashboard/admin');
              break;
            default:
              router.push('/dashboard');
          }
        }, 1000);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Terjadi kesalahan saat login. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <GraduationCap className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Masuk ke Akun Anda</h2>
          <div className="mt-2 text-sm text-gray-600">
            Belum punya akun?
            <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              Daftar di sini
            </Link>
            <p className="text-gray-400">sementara</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Masukkan username dan password Anda</CardDescription>
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
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" type="text" value={formData.username} onChange={(e) => handleInputChange('username', e.target.value)} placeholder="Masukkan username" required autoComplete="username" />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} placeholder="Masukkan password" required autoComplete="current-password" />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Masuk...
                  </>
                ) : (
                  'Masuk'
                )}
              </Button>

              <div className="text-center">
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                  Lupa password?
                </Link>
              </div>
            </form>

            {/* Demo Accounts */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Akun Demo:</h3>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Siswa:</span>
                  <span className="font-mono">jamal / password123</span>
                </div>
                <div className="flex justify-between">
                  <span>Guru:</span>
                  <span className="font-mono">samsudin / password123</span>
                </div>
                <div className="flex justify-between">
                  <span>Admin:</span>
                  <span className="font-mono">dalam pengembangan</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
