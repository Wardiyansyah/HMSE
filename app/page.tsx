"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppStore } from "@/lib/store"
import { NavigationHeader } from "@/components/navigation-header"
import Link from "next/link"
import {
  BookOpen,
  Brain,
  MessageCircle,
  BarChart3,
  Users,
  GraduationCap,
  Sparkles,
  TrendingUp,
  Clock,
  Award,
  Play,
  FileText,
  Mic,
  ChevronRight,
  Target,
  Zap,
} from "lucide-react"

export default function EduGenAIDashboard() {
  const { user, learningProgress, startSession } = useAppStore()

  const recommendations = {
    teacher: [
      {
        title: "Cara Mengajar Matematika dengan Gamifikasi",
        type: "Course",
        duration: "2 jam",
        level: "Intermediate",
        icon: <GraduationCap className="h-4 w-4" />,
        url: "/content-generator",
      },
      {
        title: "AI Tools untuk Pembuatan Konten Edukatif",
        type: "Workshop",
        duration: "1.5 jam",
        level: "Advanced",
        icon: <Brain className="h-4 w-4" />,
        url: "/content-generator",
      },
    ],
    student: [
      {
        title: "Persiapan UTBK Adaptif - Matematika",
        type: "Learning Path",
        duration: "4 minggu",
        level: "Advanced",
        icon: <BookOpen className="h-4 w-4" />,
        url: "/virtual-tutor",
      },
      {
        title: "Fisika Dasar: Hukum Newton Interaktif",
        type: "Module",
        duration: "45 menit",
        level: "Beginner",
        icon: <Play className="h-4 w-4" />,
        url: "/virtual-tutor",
      },
    ],
    professional: [
      {
        title: "Digital Marketing Strategy 2024",
        type: "Certification",
        duration: "6 jam",
        level: "Professional",
        icon: <Award className="h-4 w-4" />,
        url: "/content-generator",
      },
      {
        title: "Leadership in Digital Age",
        type: "Course",
        duration: "3 jam",
        level: "Executive",
        icon: <Users className="h-4 w-4" />,
        url: "/content-generator",
      },
    ],
  }

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
  }

  const currentUserRole = user?.role || "student"
  const currentRecommendations = recommendations[currentUserRole] || recommendations.student
  const currentStats = learningStats[currentUserRole] || learningStats.student

  useEffect(() => {
    startSession("Dashboard", "Overview")
  }, [startSession])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <NavigationHeader />

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Selamat datang kembali, {user?.name}! 👋
              </h2>
              <p className="text-gray-600 text-sm md:text-base">
                {currentUserRole === "student" &&
                  "Mari lanjutkan perjalanan belajarmu dengan rekomendasi yang dipersonalisasi"}
                {currentUserRole === "teacher" && "Buat konten edukatif yang menarik dengan bantuan AI"}
                {currentUserRole === "professional" && "Tingkatkan skill profesionalmu dengan pembelajaran adaptif"}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          {currentUserRole === "student" && (
            <>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-gray-600">Kursus Selesai</p>
                      <p className="text-xl md:text-2xl font-bold text-blue-600">{currentStats.completedCourses}</p>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +2 minggu ini
                      </p>
                    </div>
                    <div className="p-2 md:p-3 bg-blue-100 rounded-full">
                      <BookOpen className="h-4 w-4 md:h-6 md:w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-gray-600">Streak Belajar</p>
                      <p className="text-xl md:text-2xl font-bold text-green-600">{currentStats.currentStreak} hari</p>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <Target className="h-3 w-3 mr-1" />
                        Target: 30 hari
                      </p>
                    </div>
                    <div className="p-2 md:p-3 bg-green-100 rounded-full">
                      <TrendingUp className="h-4 w-4 md:h-6 md:w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-gray-600">Total Jam</p>
                      <p className="text-xl md:text-2xl font-bold text-purple-600">{currentStats.totalHours}</p>
                      <p className="text-xs text-purple-600 flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        Bulan ini
                      </p>
                    </div>
                    <div className="p-2 md:p-3 bg-purple-100 rounded-full">
                      <Clock className="h-4 w-4 md:h-6 md:w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-gray-600">Pencapaian</p>
                      <p className="text-xl md:text-2xl font-bold text-orange-600">{currentStats.achievements}</p>
                      <p className="text-xs text-orange-600 flex items-center mt-1">
                        <Award className="h-3 w-3 mr-1" />
                        Badge earned
                      </p>
                    </div>
                    <div className="p-2 md:p-3 bg-orange-100 rounded-full">
                      <Award className="h-4 w-4 md:h-6 md:w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {currentUserRole === "teacher" && (
            <>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-gray-600">Konten Dibuat</p>
                      <p className="text-xl md:text-2xl font-bold text-blue-600">{currentStats.contentCreated}</p>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +5 minggu ini
                      </p>
                    </div>
                    <div className="p-2 md:p-3 bg-blue-100 rounded-full">
                      <FileText className="h-4 w-4 md:h-6 md:w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-gray-600">Siswa Terbantu</p>
                      <p className="text-xl md:text-2xl font-bold text-green-600">{currentStats.studentsHelped}</p>
                      <p className="text-xs text-green-600 flex items-center mt-1">
                        <Users className="h-3 w-3 mr-1" />
                        Aktif bulan ini
                      </p>
                    </div>
                    <div className="p-2 md:p-3 bg-green-100 rounded-full">
                      <Users className="h-4 w-4 md:h-6 md:w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-gray-600">Rating Rata-rata</p>
                      <p className="text-xl md:text-2xl font-bold text-purple-600">{currentStats.avgRating}/5</p>
                      <p className="text-xs text-purple-600 flex items-center mt-1">
                        <Award className="h-3 w-3 mr-1" />
                        Excellent
                      </p>
                    </div>
                    <div className="p-2 md:p-3 bg-purple-100 rounded-full">
                      <Award className="h-4 w-4 md:h-6 md:w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs md:text-sm font-medium text-gray-600">Jam Mengajar</p>
                      <p className="text-xl md:text-2xl font-bold text-orange-600">{currentStats.totalHours}</p>
                      <p className="text-xs text-orange-600 flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        Total semester
                      </p>
                    </div>
                    <div className="p-2 md:p-3 bg-orange-100 rounded-full">
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
                  <span>Rekomendasi Dipersonalisasi</span>
                </CardTitle>
                <CardDescription className="text-sm md:text-base">
                  Berdasarkan minat, level kompetensi, dan riwayat belajar Anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentRecommendations.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center justify-between p-3 md:flex-row p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">{item.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm md:text-base">{item.title}</h4>
                          <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-600">
                            <Badge variant="secondary">{item.type}</Badge>
                            <span>•</span>
                            <span>{item.duration}</span>
                            <span>•</span>
                            <Badge variant="outline">{item.level}</Badge>
                          </div>
                        </div>
                      </div>
                      <Link href={item.url}>
                        <Button size="sm" className="px-16 mt-2 md:px-2">
                          Mulai
                          <ChevronRight className="h-4 w-4 ml-1" />
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
                <CardTitle className="text-lg md:text-xl">Fitur Utama EduGenAI</CardTitle>
                <CardDescription className="text-sm md:text-base">
                  Jelajahi kemampuan AI untuk meningkatkan pengalaman belajar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="content-generator" className="w-full">
                  <TabsList className="grid h-full w-full grid-cols-2 lg:grid-cols-4">
                    <TabsTrigger value="content-generator" className="text-xs">
                      AI Generator
                    </TabsTrigger>
                    <TabsTrigger value="adaptive-learning" className="text-xs">
                      Adaptive Path
                    </TabsTrigger>
                    <TabsTrigger value="assessment" className="text-xs">
                      Assessment
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="text-xs">
                      Analytics
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="content-generator" className="space-y-4">
                    <div className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Brain className="h-4 w-4 mr-2 text-blue-600" />
                        AI Content Generator
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">Buat materi ajar otomatis sesuai kurikulum dengan AI</p>
                      <div className="bg-white p-3 rounded border text-sm">
                        <strong>Contoh:</strong> Input "Fotosintesis" → AI generate PPT, video pendek, dan 10 soal
                        pilihan ganda
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
                    <div className="p-4 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                        Adaptive Learning Path
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Jalur belajar dinamis yang menyesuaikan dengan performa
                      </p>
                      <div className="bg-white p-3 rounded border text-sm">
                        <strong>Contoh:</strong> Salah trigonometri → sistem turunkan level + rekomendasikan video
                        tutorial
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
                    <div className="p-4 border rounded-lg bg-gradient-to-r from-purple-50 to-violet-50">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Mic className="h-4 w-4 mr-2 text-purple-600" />
                        Automated Assessment
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">AI analisis jawaban esai/lisan dengan NLP</p>
                      <div className="bg-white p-3 rounded border text-sm">
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
                    <div className="p-4 border rounded-lg bg-gradient-to-r from-orange-50 to-red-50">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <BarChart3 className="h-4 w-4 mr-2 text-orange-600" />
                        Learning Analytics
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">Dashboard untuk memantau perkembangan belajar</p>
                      <div className="bg-white p-3 rounded border text-sm">
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
                  <span>Virtual Tutor AI</span>
                </CardTitle>
                <CardDescription className="text-sm">Asisten AI 24/7 siap membantu</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-sm">
                      <strong>Siswa:</strong> "Apa itu hukum Newton?"
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <p className="text-sm">
                      <strong>AI Tutor:</strong> "Hukum Newton terdiri dari 3 hukum dasar tentang gerak. Mari saya
                      jelaskan dengan animasi interaktif..."
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
                <CardTitle className="text-lg">Progress Belajar</CardTitle>
                <CardDescription className="text-sm">Pantau kemajuan pembelajaran Anda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {learningProgress.map((subject, index) => (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{subject.subject}</span>
                      <span>{subject.progress}%</span>
                    </div>
                    <Progress value={subject.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/content-generator">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Brain className="h-4 w-4 mr-2" />
                    Generate Konten Baru
                  </Button>
                </Link>
                <Link href="/analytics">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Lihat Analytics
                  </Button>
                </Link>
                <Link href="/virtual-tutor">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Award className="h-4 w-4 mr-2" />
                    Ambil Quiz
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Users className="h-4 w-4 mr-2" />
                  Bergabung Diskusi
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
