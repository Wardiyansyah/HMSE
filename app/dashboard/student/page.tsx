'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookOpen, Calendar, FileText, GraduationCap, Loader2, Plus, TrendingUp, Users, AlertCircle, Edit, Eye } from 'lucide-react';
import { getCurrentUser, clearUserSession } from '@/lib/auth-helpers';
import { supabase } from '@/lib/supabase';

interface Assignment {
  id: string;
  title: string;
  description: string;
  subject_id: string;
  class_id: string;
  teacher_id: string;
  due_date: string;
  max_score: number;
  status: 'draft' | 'published' | 'closed';
  created_at: string;
  updated_at: string;
  subjects?: { nama_mata_pelajaran: string; kode_mata_pelajaran: string };
  classes?: { nama_kelas: string };
}

interface Grade {
  id: string;
  student_id: string;
  assignment_id: string;
  subject_id: string;
  teacher_id: string;
  score: number;
  max_score: number;
  grade_type: 'assignment' | 'quiz' | 'exam' | 'project';
  comments: string;
  graded_at: string;
  created_at: string;
  updated_at: string;
  subjects?: { nama_mata_pelajaran: string; kode_mata_pelajaran: string };
  assignments?: { title: string };
  students?: { user_id: string; profiles?: { full_name: string } };
}

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

interface Subject {
  id: string;
  nama_mata_pelajaran: string;
  kode_mata_pelajaran: string;
  jenjang: 'SD' | 'SMP' | 'SMA';
  tingkat: number[];
  jurusan?: string;
  sks: number;
  deskripsi?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

interface Student {
  id: string;
  user_id: string;
  student_id: string;
  class_id: string;
  status: 'active' | 'inactive' | 'graduated';
  enrollment_date: string;
  created_at: string;
  updated_at: string;
  profiles?: { full_name: string; email: string };
}

interface Teacher {
  id: string;
  user_id: string;
  employee_id: string;
  specialization: string;
  status: 'active' | 'inactive';
  hire_date: string;
  created_at: string;
  updated_at: string;
}

interface DashboardData {
  assignments: Assignment[];
  grades: Grade[];
  classes: Class[];
  subjects: Subject[];
  students: Student[];
  teacher: Teacher | null;
}

export default function TeacherDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<DashboardData>({
    assignments: [],
    grades: [],
    classes: [],
    subjects: [],
    students: [],
    teacher: null,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Get current user
      const { user: currentUser, error: userError } = await getCurrentUser();
      if (userError || !currentUser) {
        console.error('User error:', userError);
        router.push('/login');
        return;
      }

      if (currentUser.role !== 'teacher') {
        setError('Akses ditolak. Anda bukan guru.');
        return;
      }

      setUser(currentUser);

      // Get or create teacher profile
      let { data: teacherData, error: teacherError } = await supabase.from('teachers').select('*').eq('user_id', currentUser.id).single();

      if (teacherError && teacherError.code === 'PGRST116') {
        // Teacher profile doesn't exist, create one
        console.log('Creating teacher profile for user:', currentUser.id);
        const { data: newTeacher, error: createError } = await supabase
          .from('teachers')
          .insert({
            user_id: currentUser.id,
            employee_id: `T${Date.now()}`, // Generate temporary employee ID
            specialization: 'Umum',
            status: 'active',
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating teacher profile:', createError);
          setError('Gagal membuat profil guru: ' + createError.message);
          return;
        }

        teacherData = newTeacher;
      } else if (teacherError) {
        console.error('Error fetching teacher profile:', teacherError);
        setError('Gagal memuat profil guru: ' + teacherError.message);
        return;
      }

      if (!teacherData) {
        setError('Data guru tidak ditemukan');
        return;
      }

      // Load assignments created by this teacher
      const { data: assignments, error: assignmentsError } = await supabase
        .from('assignments')
        .select(
          `
          *,
          subjects (nama_mata_pelajaran, kode_mata_pelajaran),
          classes (nama_kelas)
        `
        )
        .eq('teacher_id', teacherData.id)
        .order('created_at', { ascending: false });

      if (assignmentsError) {
        console.error('Error loading assignments:', assignmentsError);
      }

      // Load all classes (teacher can potentially teach any class)
      const { data: classes, error: classesError } = await supabase.from('classes').select('*').eq('status', 'active').order('nama_kelas');

      if (classesError) {
        console.error('Error loading classes:', classesError);
      }

      // Load all subjects
      const { data: subjects, error: subjectsError } = await supabase.from('subjects').select('*').eq('status', 'active').order('nama_mata_pelajaran');

      if (subjectsError) {
        console.error('Error loading subjects:', subjectsError);
      }

      // Load students from all classes (for now)
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select(
          `
          *,
          profiles:users!students_user_id_fkey (full_name, email)
        `
        )
        .eq('status', 'active');

      if (studentsError) {
        console.error('Error loading students:', studentsError);
      }

      // Load grades given by this teacher
      const { data: grades, error: gradesError } = await supabase
        .from('grades')
        .select(
          `
          *,
          subjects (nama_mata_pelajaran, kode_mata_pelajaran),
          assignments (title),
          students (
            user_id,
            profiles:users!students_user_id_fkey (full_name)
          )
        `
        )
        .eq('teacher_id', teacherData.id)
        .order('graded_at', { ascending: false });

      if (gradesError) {
        console.error('Error loading grades:', gradesError);
      }

      setData({
        assignments: assignments || [],
        grades: grades || [],
        classes: classes || [],
        subjects: subjects || [],
        students: students || [],
        teacher: teacherData,
      });
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError('Gagal memuat data dashboard: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    clearUserSession();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const draftAssignments = data.assignments.filter((a) => a.status === 'draft');
  const publishedAssignments = data.assignments.filter((a) => a.status === 'published');
  const totalStudents = data.students.length;
  const averageGrade = data.grades.length > 0 ? data.grades.reduce((sum, grade) => sum + (grade.score / grade.max_score) * 100, 0) / data.grades.length : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Guru</h1>
                <p className="text-gray-600">Selamat datang, {user?.nama}</p>
                {data.teacher && (
                  <p className="text-sm text-gray-500">
                    ID Pegawai: {data.teacher.employee_id} | Spesialisasi: {data.teacher.specialization}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/assignments/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Buat Tugas Baru
                </Button>
              </Link>
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Tugas</p>
                  <p className="text-2xl font-bold text-gray-900">{data.assignments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Siswa</p>
                  <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Mata Pelajaran</p>
                  <p className="text-2xl font-bold text-gray-900">{data.subjects.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rata-rata Nilai</p>
                  <p className="text-2xl font-bold text-gray-900">{averageGrade.toFixed(1)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="assignments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="assignments">Tugas</TabsTrigger>
            <TabsTrigger value="classes">Kelas</TabsTrigger>
            <TabsTrigger value="students">Siswa</TabsTrigger>
            <TabsTrigger value="grades">Nilai</TabsTrigger>
          </TabsList>

          <TabsContent value="assignments" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Draft Tugas</CardTitle>
                  <CardDescription>Tugas yang belum dipublikasi</CardDescription>
                </CardHeader>
                <CardContent>
                  {draftAssignments.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Tidak ada draft tugas</p>
                      <Link href="/assignments/create">
                        <Button className="mt-4" size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Buat Tugas Baru
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {draftAssignments.map((assignment) => (
                        <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-medium">{assignment.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>
                            <div className="flex items-center mt-2 space-x-2">
                              <Badge variant="secondary">Draft</Badge>
                              {assignment.subjects && <Badge variant="outline">{assignment.subjects.nama_mata_pelajaran}</Badge>}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tugas Aktif</CardTitle>
                  <CardDescription>Tugas yang sudah dipublikasi</CardDescription>
                </CardHeader>
                <CardContent>
                  {publishedAssignments.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Tidak ada tugas aktif</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {publishedAssignments.slice(0, 5).map((assignment) => (
                        <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-medium">{assignment.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{assignment.description}</p>
                            <div className="flex items-center mt-2 space-x-2">
                              <Badge variant="default">Aktif</Badge>
                              {assignment.subjects && <Badge variant="outline">{assignment.subjects.nama_mata_pelajaran}</Badge>}
                              {assignment.due_date && (
                                <div className="flex items-center text-sm text-gray-500">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {new Date(assignment.due_date).toLocaleDateString('id-ID')}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="classes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Daftar Kelas</CardTitle>
                <CardDescription>Semua kelas yang tersedia di sekolah</CardDescription>
              </CardHeader>
              <CardContent>
                {data.classes.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Tidak ada data kelas</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.classes.map((cls) => (
                      <div key={cls.id} className="p-4 border rounded-lg">
                        <h3 className="font-medium">{cls.nama_kelas}</h3>
                        <p className="text-sm text-gray-600">Tingkat: {cls.tingkat}</p>
                        <p className="text-sm text-gray-600">Jenjang: {cls.jenjang}</p>
                        <p className="text-sm text-gray-600">Tahun Ajaran: {cls.tahun_ajaran}</p>
                        <p className="text-sm text-gray-600">Kapasitas: {cls.kapasitas}</p>
                        <div className="flex items-center justify-between mt-4">
                          <Badge variant={cls.status === 'active' ? 'default' : 'secondary'}>{cls.status === 'active' ? 'Aktif' : 'Tidak Aktif'}</Badge>
                          <Button size="sm" variant="outline">
                            Kelola
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Daftar Siswa</CardTitle>
                <CardDescription>Semua siswa yang terdaftar</CardDescription>
              </CardHeader>
              <CardContent>
                {data.students.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Belum ada siswa</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data.students.slice(0, 10).map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium">{student.profiles?.full_name || 'Nama tidak tersedia'}</h3>
                          <p className="text-sm text-gray-600">ID Siswa: {student.student_id}</p>
                          <p className="text-sm text-gray-600">Email: {student.profiles?.email || 'Email tidak tersedia'}</p>
                          <Badge variant={student.status === 'active' ? 'default' : 'secondary'} className="mt-2">
                            {student.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grades" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Nilai Terbaru</CardTitle>
                <CardDescription>Nilai yang telah Anda berikan</CardDescription>
              </CardHeader>
              <CardContent>
                {data.grades.length === 0 ? (
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Belum ada nilai yang diberikan</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data.grades.slice(0, 10).map((grade) => (
                      <div key={grade.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium">{grade.assignments?.title || grade.subjects?.nama_mata_pelajaran}</h3>
                          <p className="text-sm text-gray-600">Siswa: {grade.students?.profiles?.full_name || 'Nama tidak tersedia'}</p>
                          <div className="flex items-center mt-2 space-x-4">
                            {grade.subjects && <Badge variant="outline">{grade.subjects.nama_mata_pelajaran}</Badge>}
                            <Badge variant="outline">{grade.grade_type}</Badge>
                          </div>
                          {grade.comments && <p className="text-sm text-gray-600 mt-2">{grade.comments}</p>}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            {grade.score}/{grade.max_score}
                          </div>
                          <div className="text-sm text-gray-500">{((grade.score / grade.max_score) * 100).toFixed(1)}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
