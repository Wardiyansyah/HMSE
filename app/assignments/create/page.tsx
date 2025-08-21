'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ArrowLeft, CalendarIcon, FileText, Loader2, Save, Send, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { getCurrentUser, getUserProfile } from '@/lib/auth-helpers';
import { supabase } from '@/lib/supabase';
import type { Class, Subject } from '@/lib/supabase';

interface FormData {
  title: string;
  description: string;
  subjectId: string;
  classId: string;
  dueDate: Date | undefined;
  maxScore: number;
  status: 'draft' | 'published';
}

export default function CreateAssignmentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [classes, setClasses] = useState<Class[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teacherId, setTeacherId] = useState('');

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    subjectId: '',
    classId: '',
    dueDate: undefined,
    maxScore: 100,
    status: 'draft',
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      // Get current user
      const { user, error: userError } = await getCurrentUser();
      if (userError || !user) {
        router.push('/login');
        return;
      }

      // Get user profile
      const profile = await getUserProfile(user.id);
      if (!profile || profile.role !== 'teacher') {
        router.push('/login');
        return;
      }

      // Get teacher data
      const { data: teacherData } = await supabase.from('teachers').select('*').eq('user_id', user.id).single();

      if (!teacherData) {
        setError('Data guru tidak ditemukan');
        return;
      }

      setTeacherId(teacherData.id);

      // Load classes taught by this teacher
      const { data: classesData } = await supabase.from('classes').select('*').eq('teacher_id', teacherData.id).eq('status', 'active').order('name');

      // Load all subjects
      const { data: subjectsData } = await supabase.from('subjects').select('*').order('name');

      setClasses(classesData || []);
      setSubjects(subjectsData || []);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Judul tugas harus diisi');
      return false;
    }

    if (!formData.subjectId) {
      setError('Mata pelajaran harus dipilih');
      return false;
    }

    if (!formData.classId) {
      setError('Kelas harus dipilih');
      return false;
    }

    if (formData.maxScore <= 0) {
      setError('Nilai maksimal harus lebih dari 0');
      return false;
    }

    return true;
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!validateForm()) return;

    setSubmitting(true);
    setError('');

    try {
      const assignmentData = {
        title: formData.title,
        description: formData.description || null,
        subject_id: formData.subjectId,
        class_id: formData.classId,
        teacher_id: teacherId,
        due_date: formData.dueDate ? formData.dueDate.toISOString() : null,
        max_score: formData.maxScore,
        status: status,
      };

      const { data, error } = await supabase.from('assignments').insert([assignmentData]).select().single();

      if (error) {
        setError('Gagal menyimpan tugas: ' + error.message);
        return;
      }

      setSuccess(status === 'draft' ? 'Tugas berhasil disimpan sebagai draft' : 'Tugas berhasil dipublikasi');

      // Redirect after success
      setTimeout(() => {
        router.push('/dashboard/teacher');
      }, 2000);
    } catch (err) {
      console.error('Error creating assignment:', err);
      setError('Terjadi kesalahan saat menyimpan tugas');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button variant="ghost" onClick={() => router.back()} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
            <div className="flex items-center space-x-4">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Buat Tugas Baru</h1>
                <p className="text-gray-600">Buat dan kelola tugas untuk siswa</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Tugas</CardTitle>
            <CardDescription>Isi detail tugas yang akan diberikan kepada siswa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Tugas *</Label>
                <Input id="title" placeholder="Masukkan judul tugas" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} disabled={submitting} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxScore">Nilai Maksimal</Label>
                <Input id="maxScore" type="number" min="1" placeholder="100" value={formData.maxScore} onChange={(e) => handleInputChange('maxScore', Number.parseInt(e.target.value) || 100)} disabled={submitting} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi Tugas</Label>
              <Textarea id="description" placeholder="Masukkan deskripsi tugas (opsional)" value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} disabled={submitting} rows={4} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Mata Pelajaran *</Label>
                <Select value={formData.subjectId} onValueChange={(value) => handleInputChange('subjectId', value)} disabled={submitting}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih mata pelajaran" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name} ({subject.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Kelas *</Label>
                <Select value={formData.classId} onValueChange={(value) => handleInputChange('classId', value)} disabled={submitting}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name} - Tingkat {cls.grade_level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tanggal Deadline (Opsional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent" disabled={submitting}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dueDate ? format(formData.dueDate, 'PPP', { locale: id }) : <span>Pilih tanggal deadline</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={formData.dueDate} onSelect={(date) => handleInputChange('dueDate', date)} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button onClick={() => handleSubmit('draft')} variant="outline" disabled={submitting} className="flex-1">
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Simpan sebagai Draft
              </Button>

              <Button onClick={() => handleSubmit('published')} disabled={submitting} className="flex-1">
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Publikasi Tugas
              </Button>
            </div>

            <div className="text-sm text-gray-500">
              <p>* Field yang wajib diisi</p>
              <p>
                <strong>Draft:</strong> Tugas disimpan tapi belum terlihat oleh siswa
              </p>
              <p>
                <strong>Publikasi:</strong> Tugas langsung terlihat dan dapat dikerjakan oleh siswa
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
