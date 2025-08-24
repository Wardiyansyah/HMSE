'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NavigationHeader } from '@/components/navigation-header-student';
import { useLanguage } from '@/lib/language-context';
import { BarChart3, TrendingUp, TrendingDown, Users, BookOpen, Clock, Award, AlertTriangle, CheckCircle, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export default function LearningAnalytics() {
  const { t } = useLanguage();

  const performanceData = [
    { month: t('common.jan'), matematika: 75, fisika: 68, kimia: 82, biologi: 79 },
    { month: t('common.feb'), matematika: 78, fisika: 72, kimia: 85, biologi: 81 },
    { month: t('common.mar'), matematika: 82, fisika: 75, kimia: 88, biologi: 84 },
    { month: t('common.apr'), matematika: 85, fisika: 78, kimia: 90, biologi: 87 },
    { month: t('common.may'), matematika: 88, fisika: 82, kimia: 92, biologi: 89 },
    { month: t('common.jun'), matematika: 90, fisika: 85, kimia: 94, biologi: 91 },
  ];

  const subjectDistribution = [
    { name: t('subject.matematika'), value: 30, color: '#3B82F6' },
    { name: t('subject.fisika'), value: 25, color: '#10B981' },
    { name: t('subject.kimia'), value: 20, color: '#F59E0B' },
    { name: t('subject.biologi'), value: 15, color: '#EF4444' },
    { name: t('common.others'), value: 10, color: '#8B5CF6' },
  ];

  const weeklyActivity = [
    { day: t('common.mon'), hours: 2.5 },
    { day: t('common.tue'), hours: 3.2 },
    { day: t('common.wed'), hours: 1.8 },
    { day: t('common.thu'), hours: 4.1 },
    { day: t('common.fri'), hours: 2.9 },
    { day: t('common.sat'), hours: 5.2 },
    { day: t('common.sun'), hours: 3.7 },
  ];

  const studentProgress = [
    { name: 'Ahmad Rizki', matematika: 92, fisika: 88, kimia: 95, status: 'excellent' },
    { name: 'Siti Nurhaliza', matematika: 85, fisika: 82, kimia: 89, status: 'good' },
    { name: 'Budi Santoso', matematika: 78, fisika: 75, kimia: 80, status: 'average' },
    { name: 'Dewi Lestari', matematika: 65, fisika: 62, kimia: 68, status: 'needs_attention' },
    { name: 'Eko Prasetyo', matematika: 58, fisika: 55, kimia: 60, status: 'needs_attention' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'good':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'average':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'needs_attention':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'good':
        return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'average':
        return <Target className="h-4 w-4 text-yellow-600" />;
      case 'needs_attention':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Target className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      <NavigationHeader />

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
            <BarChart3 className="h-6 w-6 md:h-8 md:w-8 mr-2 md:mr-3 text-blue-600" />
            {t('analytics.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">{t('analytics.subtitle')}</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">{t('analytics.total-students')}</p>
                  <p className="text-xl md:text-2xl font-bold text-blue-600">156</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% {t('common.from-last-month')}
                  </p>
                </div>
                <Users className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">{t('analytics.avg-score')}</p>
                  <p className="text-xl md:text-2xl font-bold text-green-600">84.2</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +3.5 {t('common.points')}
                  </p>
                </div>
                <Award className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">{t('analytics.learning-hours')}</p>
                  <p className="text-xl md:text-2xl font-bold text-purple-600">1,247</p>
                  <p className="text-xs text-red-600 flex items-center mt-1">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    -5% {t('common.this-week')}
                  </p>
                </div>
                <Clock className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">{t('analytics.completed-materials')}</p>
                  <p className="text-xl md:text-2xl font-bold text-orange-600">89%</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +7% {t('common.target-achieved')}
                  </p>
                </div>
                <BookOpen className="h-6 w-6 md:h-8 md:w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="performance">{t('analytics.performance')}</TabsTrigger>
            <TabsTrigger value="subjects">{t('analytics.subjects')}</TabsTrigger>
            <TabsTrigger value="students">{t('analytics.students')}</TabsTrigger>
            <TabsTrigger value="insights">{t('analytics.insights')}</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('analytics.performance-trend')}</CardTitle>
                  <CardDescription className="text-sm">{t('analytics.performance-trend-description')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                      <XAxis dataKey="month" className="text-gray-600 dark:text-gray-400" />
                      <YAxis domain={[60, 100]} className="text-gray-600 dark:text-gray-400" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: 'var(--radius)',
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Line type="monotone" dataKey="matematika" stroke="#3B82F6" strokeWidth={2} name={t('subject.matematika')} />
                      <Line type="monotone" dataKey="fisika" stroke="#10B981" strokeWidth={2} name={t('subject.fisika')} />
                      <Line type="monotone" dataKey="kimia" stroke="#F59E0B" strokeWidth={2} name={t('subject.kimia')} />
                      <Line type="monotone" dataKey="biologi" stroke="#EF4444" strokeWidth={2} name={t('subject.biologi')} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('analytics.weekly-activity')}</CardTitle>
                  <CardDescription className="text-sm">{t('analytics.weekly-activity-description')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weeklyActivity}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                      <XAxis dataKey="day" className="text-gray-600 dark:text-gray-400" />
                      <YAxis className="text-gray-600 dark:text-gray-400" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: 'var(--radius)',
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <Bar dataKey="hours" fill="#8B5CF6" name={t('common.hours')} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="subjects" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('analytics.time-distribution')}</CardTitle>
                  <CardDescription className="text-sm">{t('analytics.time-distribution-description')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={subjectDistribution} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {subjectDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          borderColor: 'hsl(var(--border))',
                          borderRadius: 'var(--radius)',
                        }}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                        itemStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('analytics.areas-of-attention')}</CardTitle>
                  <CardDescription className="text-sm">{t('analytics.areas-of-attention-description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <h4 className="font-semibold text-red-800 dark:text-red-300">
                        {t('subject.aljabar')} - {t('common.needs-more-practice')}
                      </h4>
                    </div>
                    <p className="text-sm text-red-700 dark:text-red-400">
                      23% {t('common.students-struggle-linear-equations')}. {t('common.recommend-tutorial-videos')}.
                    </p>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="h-5 w-5 text-yellow-600" />
                      <h4 className="font-semibold text-yellow-800 dark:text-yellow-300">
                        {t('subject.fisika')} - {t('common.momentum')}
                      </h4>
                    </div>
                    <p className="text-sm text-yellow-700 dark:text-yellow-400">
                      {t('common.momentum-concept-needs-visuals')}. {t('common.use-interactive-simulations')}.
                    </p>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold text-green-800 dark:text-green-300">
                        {t('subject.kimia')} - {t('common.excellent')}
                      </h4>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-400">
                      {t('common.organic-chemistry-performance-increased')}. {t('common.maintain-current-method')}.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('analytics.individual-student-performance')}</CardTitle>
                <CardDescription className="text-sm">{t('analytics.individual-student-performance-description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentProgress.map((student, index) => (
                    <div key={index} className="border dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <span className="font-semibold text-gray-600 dark:text-gray-300">
                              {student.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold">{student.name}</h4>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(student.status)}
                              <Badge className={getStatusColor(student.status)}>
                                {student.status === 'excellent' && t('common.excellent')}
                                {student.status === 'good' && t('common.good')}
                                {student.status === 'average' && t('common.average')}
                                {student.status === 'needs_attention' && t('common.needs-attention')}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{Math.round((student.matematika + student.fisika + student.kimia) / 3)}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{t('common.average')}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{t('subject.matematika')}</span>
                            <span>{student.matematika}</span>
                          </div>
                          <Progress value={student.matematika} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{t('subject.fisika')}</span>
                            <span>{student.fisika}</span>
                          </div>
                          <Progress value={student.fisika} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{t('subject.kimia')}</span>
                            <span>{student.kimia}</span>
                          </div>
                          <Progress value={student.kimia} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <span>{t('analytics.ai-insights-predictions')}</span>
                  </CardTitle>
                  <CardDescription className="text-sm">{t('analytics.ai-insights-predictions-description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">📈 {t('common.positive-trend')}</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      {t('common.math-performance-increased')}. {t('common.gamification-effective')}.
                    </p>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">⚠️ {t('common.risk-prediction')}</h4>
                    <p className="text-sm text-orange-700 dark:text-orange-400">
                      5 {t('common.students-at-risk')}. {t('common.recommend-tutoring-sessions')}.
                    </p>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">💡 {t('common.recommendation')}</h4>
                    <p className="text-sm text-green-700 dark:text-green-400">
                      {t('common.implement-more-virtual-practicums')}. {t('common.engagement-rate-increased')}.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('analytics.learning-optimization')}</CardTitle>
                  <CardDescription className="text-sm">{t('analytics.learning-optimization-description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-blue-600">1</span>
                      </div>
                      <div>
                        <h5 className="font-medium">{t('common.personalize-content')}</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('common.adjust-difficulty-based-on-performance')}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-green-600">2</span>
                      </div>
                      <div>
                        <h5 className="font-medium">{t('common.optimal-time')}</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('common.schedule-difficult-material')}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-purple-600">3</span>
                      </div>
                      <div>
                        <h5 className="font-medium">{t('common.interactive-methods')}</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('common.increase-simulation-gamification')}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-yellow-600">4</span>
                      </div>
                      <div>
                        <h5 className="font-medium">{t('common.real-time-feedback')}</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('common.implement-auto-feedback')}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
