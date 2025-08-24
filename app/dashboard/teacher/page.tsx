'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Calendar, TrendingUp, Plus, FileText, Clock, CheckCircle, AlertCircle, GraduationCap, Award, Bell, Settings, LogOut } from 'lucide-react';
import { getCurrentUser, getTeacherAssignments, clearUserSession } from '@/lib/auth-helpers';
import { NavigationHeader } from '@/components/navigation-header-teacher';
interface Assignment {
  id: string;
  title: string;
  description?: string;
  due_date: string;
  status: 'draft' | 'published' | 'closed';
  max_score: number;
  created_at: string;
  subjects?: {
    nama_mata_pelajaran: string;
    kode_mata_pelajaran: string;
  };
  classes?: {
    nama_kelas: string;
  };
}

interface DashboardStats {
  totalAssignments: number;
  activeAssignments: number;
  totalStudents: number;
  averageGrade: number;
}

interface TeacherUser {
  id: string;
  full_name: string;
  role: string;
}

export default function TeacherDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<TeacherUser | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalAssignments: 0,
    activeAssignments: 0,
    totalStudents: 0,
    averageGrade: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        setError('User not found or inactive');
        router.push('/login');
        return;
      }

      if (currentUser.role !== 'teacher') {
        setError('Access denied. Teacher role required.');
        router.push('/dashboard');
        return;
      }

      setUser(currentUser);

      // Get teacher assignments
      const { assignments: teacherAssignments, error: assignmentsError } = await getTeacherAssignments(currentUser.id);

      if (assignmentsError) {
        console.error('Assignments error:', assignmentsError);
        // Don't fail completely, just show empty assignments
        setAssignments([]);
      } else {
        setAssignments(teacherAssignments || []);
      }

      // Calculate stats
      const totalAssignments = teacherAssignments?.length || 0;
      const activeAssignments = teacherAssignments?.filter((a) => a.status === 'published').length || 0;

      setStats({
        totalAssignments,
        activeAssignments,
        totalStudents: 25, // Mock data for now
        averageGrade: 85.5, // Mock data for now
      });
    } catch (err) {
      console.error('Dashboard error:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearUserSession();
    router.push('/login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="h-4 w-4" />;
      case 'draft':
        return <Clock className="h-4 w-4" />;
      case 'closed':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      <NavigationHeader />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAssignments}</div>
                <p className="text-xs text-muted-foreground">All time assignments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeAssignments}</div>
                <p className="text-xs text-muted-foreground">Currently published</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalStudents}</div>
                <p className="text-xs text-muted-foreground">Across all classes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageGrade}%</div>
                <p className="text-xs text-muted-foreground">Class performance</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="assignments" className="space-y-6">
            <TabsList>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="grades">Grades</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
            </TabsList>

            <TabsContent value="assignments" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">My Assignments</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Assignment
                </Button>
              </div>

              <div className="grid gap-6">
                {assignments.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <FileText className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
                      <p className="text-gray-600 text-center mb-4">Create your first assignment to get started with managing student work.</p>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Assignment
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  assignments.map((assignment) => (
                    <Card key={assignment.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {getStatusIcon(assignment.status)}
                              {assignment.title}
                            </CardTitle>
                            <CardDescription>
                              {assignment.subjects?.nama_mata_pelajaran} • {assignment.classes?.nama_kelas}
                            </CardDescription>
                          </div>
                          <Badge className={getStatusColor(assignment.status)}>{assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4">{assignment.description || 'No description provided'}</p>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
                          <span>Max Score: {assignment.max_score}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="grades" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Grade Management</h2>
                <Button variant="outline">
                  <Award className="h-4 w-4 mr-2" />
                  Export Grades
                </Button>
              </div>

              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Award className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Grade Management</h3>
                  <p className="text-gray-600 text-center mb-4">View and manage student grades for all your assignments.</p>
                  <Button variant="outline">View All Grades</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="students" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">My Students</h2>
                <Button variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  View All Students
                </Button>
              </div>

              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Student Management</h3>
                  <p className="text-gray-600 text-center mb-4">View student profiles, track progress, and manage class rosters.</p>
                  <Button variant="outline">View Students</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Teaching Schedule</h2>
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Full Calendar
                </Button>
              </div>

              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Schedule Management</h3>
                  <p className="text-gray-600 text-center mb-4">View your teaching schedule, upcoming classes, and important dates.</p>
                  <Button variant="outline">View Schedule</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
