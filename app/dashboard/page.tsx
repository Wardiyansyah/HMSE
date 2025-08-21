'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppStore } from '@/lib/store';
import { NavigationHeader } from '@/components/navigation-header';
import { useLanguage } from '@/lib/language-context';
import Link from 'next/link';
import { BookOpen, Brain, MessageCircle, BarChart3, Users, GraduationCap, Sparkles, TrendingUp, Clock, Award, Play, FileText, Mic, ChevronRight, Target, Zap } from 'lucide-react';

export default function EduGenAIDashboard() {
  const { user, learningProgress, startSession } = useAppStore();
  const { t } = useLanguage();

  const recommendations = {
    teacher: [
      {
        title: 'Cara Mengajar Matematika dengan Gamifikasi',
        type: 'Course',
        duration: '2 jam',
        level: t('common.intermediate'),
        icon: <GraduationCap className="h-4 w-4" />,
        url: '/content-generator',
      },
      {
        title: 'AI Tools untuk Pembuatan Konten Edukatif',
        type: 'Workshop',
        duration: '1.5 jam',
        level: t('common.advanced'),
        icon: <Brain className="h-4 w-4" />,
        url: '/content-generator',
      },
    ],
    student: [
      {
        title: 'Persiapan UTBK Adaptif - Matematika',
        type: 'Learning Path',
        duration: '4 minggu',
        level: t('common.advanced'),
        icon: <BookOpen className="h-4 w-4" />,
        url: '/virtual-tutor',
      },
      {
        title: 'Fisika Dasar: Hukum Newton Interaktif',
        type: 'Module',
        duration: '45 menit',
        level: t('common.beginner'),
        icon: <Play className="h-4 w-4" />,
        url: '/virtual-tutor',
      },
    ],
    professional: [
      {
        title: 'Digital Marketing Strategy 2024',
        type: 'Certification',
        duration: '6 jam',
        level: t('common.professional'),
        icon: <Award className="h-4 w-4" />,
        url: '/content-generator',
      },
      {
        title: 'Leadership in Digital Age',
        type: 'Course',
        duration: '3 jam',
        level: 'Executive', // This is a specific term, not in common.professional
        icon: <Users className="h-4 w-4" />,
        url: '/content-generator',
      },
    ],
  };

  const learningStats = {
    student: {
      completedCourses: 12,
      currentStreak: 7,
      totalHours: 45,
      achievements: 8,
    },
    teacher: {
      contentCreated: 25,
      studentsHelped: 150,
      avgRating: 4.8,
      totalHours: 120,
    },
    professional: {
      certificationsEarned: 5,
      skillsImproved: 12,
      networkConnections: 89,
      totalHours: 78,
    },
  };

  const currentUserRole = user?.role || 'student';
  const currentRecommendations = recommendations[currentUserRole] || recommendations.student;
  const currentStats = learningStats[currentUserRole] || learningStats.student;

  useEffect(() => {
    startSession('Dashboard', 'Overview');
  }, [startSession]);

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'student':
        return t('common.student');
      case 'teacher':
        return t('common.teacher');
      case 'professional':
        return t('common.professional');
      default:
        return role;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      <NavigationHeader />

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {t('dashboard.welcome')}, {user?.name}! 👋
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                {currentUserRole === 'student' && t('dashboard.student.subtitle')}
                {currentUserRole === 'teacher' && t('dashboard.teacher.subtitle')}
                {currentUserRole === 'professional' && t('dashboard.professional.subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          {currentUserRole === 'student' && (
            <>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">{t('dashboard.completed-courses')}</p>
                      <p className="text-xl md:text-2xl font-bold text-blue-600">{currentStats.completedCourses}</p>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +2 {t('common.this-week')}
                      </p>
                    </div>
                    <div className="p-2 md:p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                      <BookOpen className="h-4 w-4 md:h-6 md:w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">{t('dashboard.learning-streak')}</p>
                      <p className="text-xl md:text-2xl font-bold text-green-600">{currentStats.currentStreak} hari</p>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <Target className="h-3 w-3 mr-1" />
                        Target: 30 hari
                      </p>
                    </div>
                    <div className="p-2 md:p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                      <TrendingUp className="h-4 w-4 md:h-6 md:w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">{t('dashboard.total-hours')}</p>
                      <p className="text-xl md:text-2xl font-bold text-purple-600">{currentStats.totalHours}</p>
                      <p className="text-xs text-purple-600 flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        Bulan ini
                      </p>
                    </div>
                    <div className="p-2 md:p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                      <Clock className="h-4 w-4 md:h-6 md:w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">{t('dashboard.achievements')}</p>
                      <p className="text-xl md:text-2xl font-bold text-orange-600">{currentStats.achievements}</p>
                      <p className="text-xs text-orange-600 flex items-center mt-1">
                        <Award className="h-3 w-3 mr-1" />
                        Badge earned
                      </p>
                    </div>
                    <div className="p-2 md:p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                      <Award className="h-4 w-4 md:h-6 md:w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {currentUserRole === 'teacher' && (
            <>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">{t('dashboard.content-created')}</p>
                      <p className="text-xl md:text-2xl font-bold text-blue-600">{currentStats.contentCreated}</p>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +5 {t('common.this-week')}
                      </p>
                    </div>
                    <div className="p-2 md:p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                      <FileText className="h-4 w-4 md:h-6 md:w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">{t('dashboard.students-helped')}</p>
                      <p className="text-xl md:text-2xl font-bold text-green-600">{currentStats.studentsHelped}</p>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <Users className="h-3 w-3 mr-1" />
                        Aktif bulan ini
                      </p>
                    </div>
                    <div className="p-2 md:p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                      <Users className="h-4 w-4 md:h-6 md:w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">{t('dashboard.avg-rating')}</p>
                      <p className="text-xl md:text-2xl font-bold text-purple-600">{currentStats.avgRating}/5</p>
                      <p className="text-xs text-purple-600 flex items-center mt-1">
                        <Award className="h-3 w-3 mr-1" />
                        Excellent
                      </p>
                    </div>
                    <div className="p-2 md:p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                      <Award className="h-4 w-4 md:h-6 md:w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">{t('dashboard.teaching-hours')}</p>
                      <p className="text-xl md:text-2xl font-bold text-orange-600">{currentStats.totalHours}</p>
                      <p className="text-xs text-orange-600 flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        Total semester
                      </p>
                    </div>
                    <div className="p-2 md:p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                      <Clock className="h-4 w-4 md:h-6 md:w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Column - Recommendations & Features */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personalized Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  <span>{t('dashboard.personalized-recommendations')}</span>
                </CardTitle>
                <CardDescription className="text-sm md:text-base">{t('dashboard.recommendations.subtitle')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentRecommendations.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 md:p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">{item.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm md:text-base">{item.title}</h4>
                          <div className="flex flex-col items-start space-x-2 text-xs md:text-sm sm:flex-row sm:items-center text-gray-600 dark:text-gray-400">
                            <Badge variant="secondary">{item.type}</Badge>
                            <span className="hidden sm:block">•</span>
                            <span className="py-1">{item.duration}</span>
                            <span className="hidden sm:block">•</span>
                            <Badge variant="outline">{item.level}</Badge>
                          </div>
                        </div>
                      </div>
                      <Link href={item.url}>
                        <Button size="sm">
                          {t('common.start')}
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Core Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg md:text-xl">{t('dashboard.core-features')}</CardTitle>
                <CardDescription className="text-sm md:text-base">{t('dashboard.features.subtitle')}</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="content-generator" className="w-full">
                  <TabsList className="grid w-full h-full grid-cols-2 lg:grid-cols-4">
                    <TabsTrigger value="content-generator" className="text-xs">
                      {t('nav.content-generator')}
                    </TabsTrigger>
                    <TabsTrigger value="adaptive-learning" className="text-xs">
                      Adaptive Path
                    </TabsTrigger>
                    <TabsTrigger value="assessment" className="text-xs">
                      Assessment
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="text-xs">
                      {t('nav.analytics')}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="content-generator" className="space-y-4">
                    <div className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Brain className="h-4 w-4 mr-2 text-blue-600" />
                        {t('nav.content-generator')}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Buat materi ajar otomatis sesuai kurikulum dengan AI</p>
                      <div className="bg-white dark:bg-card p-3 rounded border dark:border-gray-700 text-sm">
                        <strong>Contoh:</strong> Input "Fotosintesis" → AI generate PPT, video pendek, dan 10 soal pilihan ganda
                      </div>
                      <Link href="/content-generator">
                        <Button className="mt-3" size="sm">
                          <Zap className="h-4 w-4 mr-2" />
                          Coba Sekarang
                        </Button>
                      </Link>
                    </div>
                  </TabsContent>

                  <TabsContent value="adaptive-learning" className="space-y-4">
                    <div className="p-4 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                        Adaptive Learning Path
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Jalur belajar dinamis yang menyesuaikan dengan performa</p>
                      <div className="bg-white dark:bg-card p-3 rounded border dark:border-gray-700 text-sm">
                        <strong>Contoh:</strong> Salah trigonometri → sistem turunkan level + rekomendasikan video tutorial
                      </div>
                      <Link href="/virtual-tutor">
                        <Button className="mt-3" size="sm">
                          <Target className="h-4 w-4 mr-2" />
                          Lihat Path Saya
                        </Button>
                      </Link>
                    </div>
                  </TabsContent>

                  <TabsContent value="assessment" className="space-y-4">
                    <div className="p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Mic className="h-4 w-4 mr-2 text-purple-600" />
                        Automated Assessment
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">AI analisis jawaban esai/lisan dengan NLP</p>
                      <div className="bg-white dark:bg-card p-3 rounded border dark:border-gray-700 text-sm">
                        <strong>Contoh:</strong> Rekam jawaban sejarah → AI beri nilai + feedback tertulis
                      </div>
                      <Link href="/virtual-tutor">
                        <Button className="mt-3" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          Mulai Assessment
                        </Button>
                      </Link>
                    </div>
                  </TabsContent>

                  <TabsContent value="analytics" className="space-y-4">
                    <div className="p-4 border rounded-lg bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <BarChart3 className="h-4 w-4 mr-2 text-orange-600" />
                        {t('nav.analytics')}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Dashboard untuk memantau perkembangan belajar</p>
                      <div className="bg-white dark:bg-card p-3 rounded border dark:border-gray-700 text-sm">
                        <strong>Contoh:</strong> Grafik area lemah siswa: "Aljabar perlu lebih banyak latihan"
                      </div>
                      <Link href="/analytics">
                        <Button className="mt-3" size="sm">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Buka Analytics
                        </Button>
                      </Link>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Virtual Tutor & Progress */}
          <div className="space-y-6">
            {/* Virtual Tutor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <MessageCircle className="h-5 w-5 text-blue-500" />
                  <span>{t('dashboard.virtual-tutor')}</span>
                </CardTitle>
                <CardDescription className="text-sm">{t('dashboard.tutor.subtitle')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                    <p className="text-sm">
                      <strong>Siswa:</strong> "Apa itu hukum Newton?"
                    </p>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
                    <p className="text-sm">
                      <strong>AI Tutor:</strong> "Hukum Newton terdiri dari 3 hukum dasar tentang gerak. Mari saya jelaskan dengan animasi interaktif..."
                    </p>
                  </div>
                  <Link href="/virtual-tutor">
                    <Button className="w-full">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat dengan AI Tutor
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Learning Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('dashboard.learning-progress')}</CardTitle>
                <CardDescription className="text-sm">{t('dashboard.progress.subtitle')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {learningProgress.map((subject, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t(`subject.${subject.subject.toLowerCase()}`)}</span>
                      <span>{subject.progress}%</span>
                    </div>
                    <Progress value={subject.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions - Simplified */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('dashboard.quick-actions')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/content-generator">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Brain className="h-4 w-4 mr-2" />
                    {t('content-generator.generate')}
                  </Button>
                </Link>
                <Link href="/analytics">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    {t('common.open')} {t('nav.analytics')}
                  </Button>
                </Link>
                <Link href="/virtual-tutor">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {t('dashboard.virtual-tutor')}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
