"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Clock,
  Award,
  AlertTriangle,
  CheckCircle,
  Target,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export default function LearningAnalytics() {
  const performanceData = [
    { month: "Jan", matematika: 75, fisika: 68, kimia: 82, biologi: 79 },
    { month: "Feb", matematika: 78, fisika: 72, kimia: 85, biologi: 81 },
    { month: "Mar", matematika: 82, fisika: 75, kimia: 88, biologi: 84 },
    { month: "Apr", matematika: 85, fisika: 78, kimia: 90, biologi: 87 },
    { month: "May", matematika: 88, fisika: 82, kimia: 92, biologi: 89 },
    { month: "Jun", matematika: 90, fisika: 85, kimia: 94, biologi: 91 },
  ]

  const subjectDistribution = [
    { name: "Matematika", value: 30, color: "#3B82F6" },
    { name: "Fisika", value: 25, color: "#10B981" },
    { name: "Kimia", value: 20, color: "#F59E0B" },
    { name: "Biologi", value: 15, color: "#EF4444" },
    { name: "Lainnya", value: 10, color: "#8B5CF6" },
  ]

  const weeklyActivity = [
    { day: "Sen", hours: 2.5 },
    { day: "Sel", hours: 3.2 },
    { day: "Rab", hours: 1.8 },
    { day: "Kam", hours: 4.1 },
    { day: "Jum", hours: 2.9 },
    { day: "Sab", hours: 5.2 },
    { day: "Min", hours: 3.7 },
  ]

  const studentProgress = [
    { name: "Ahmad Rizki", matematika: 92, fisika: 88, kimia: 95, status: "excellent" },
    { name: "Siti Nurhaliza", matematika: 85, fisika: 82, kimia: 89, status: "good" },
    { name: "Budi Santoso", matematika: 78, fisika: 75, kimia: 80, status: "average" },
    { name: "Dewi Lestari", matematika: 65, fisika: 62, kimia: 68, status: "needs_attention" },
    { name: "Eko Prasetyo", matematika: 58, fisika: 55, kimia: 60, status: "needs_attention" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-800"
      case "good":
        return "bg-blue-100 text-blue-800"
      case "average":
        return "bg-yellow-100 text-yellow-800"
      case "needs_attention":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "good":
        return <TrendingUp className="h-4 w-4 text-blue-600" />
      case "average":
        return <Target className="h-4 w-4 text-yellow-600" />
      case "needs_attention":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Target className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <BarChart3 className="h-8 w-8 mr-3 text-blue-600" />
            Learning Analytics
          </h1>
          <p className="text-gray-600">Dashboard komprehensif untuk memantau perkembangan dan performa pembelajaran</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Siswa</p>
                  <p className="text-2xl font-bold text-blue-600">156</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% dari bulan lalu
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rata-rata Nilai</p>
                  <p className="text-2xl font-bold text-green-600">84.2</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +3.5 poin
                  </p>
                </div>
                <Award className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Jam Belajar</p>
                  <p className="text-2xl font-bold text-purple-600">1,247</p>
                  <p className="text-xs text-red-600 flex items-center mt-1">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    -5% minggu ini
                  </p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Materi Selesai</p>
                  <p className="text-2xl font-bold text-orange-600">89%</p>
                  <p className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +7% target tercapai
                  </p>
                </div>
                <BookOpen className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance">Performa</TabsTrigger>
            <TabsTrigger value="subjects">Mata Pelajaran</TabsTrigger>
            <TabsTrigger value="students">Siswa</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tren Performa 6 Bulan Terakhir</CardTitle>
                  <CardDescription>Perkembangan nilai rata-rata per mata pelajaran</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[60, 100]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="matematika" stroke="#3B82F6" strokeWidth={2} />
                      <Line type="monotone" dataKey="fisika" stroke="#10B981" strokeWidth={2} />
                      <Line type="monotone" dataKey="kimia" stroke="#F59E0B" strokeWidth={2} />
                      <Line type="monotone" dataKey="biologi" stroke="#EF4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Aktivitas Belajar Mingguan</CardTitle>
                  <CardDescription>Jam belajar per hari dalam seminggu</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weeklyActivity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="hours" fill="#8B5CF6" />
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
                  <CardTitle>Distribusi Waktu Belajar</CardTitle>
                  <CardDescription>Persentase waktu yang dihabiskan per mata pelajaran</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={subjectDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {subjectDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Area yang Perlu Perhatian</CardTitle>
                  <CardDescription>Rekomendasi AI berdasarkan analisis performa</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <h4 className="font-semibold text-red-800">Aljabar - Perlu Latihan Lebih</h4>
                    </div>
                    <p className="text-sm text-red-700">
                      23% siswa mengalami kesulitan dengan konsep persamaan linear. Rekomendasikan video tutorial dan
                      latihan tambahan.
                    </p>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="h-5 w-5 text-yellow-600" />
                      <h4 className="font-semibold text-yellow-800">Fisika - Momentum</h4>
                    </div>
                    <p className="text-sm text-yellow-700">
                      Konsep momentum dan impuls perlu penjelasan visual lebih banyak. Gunakan simulasi interaktif.
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold text-green-800">Kimia - Sangat Baik</h4>
                    </div>
                    <p className="text-sm text-green-700">
                      Performa kimia organik meningkat 15%. Pertahankan metode pembelajaran saat ini.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performa Individual Siswa</CardTitle>
                <CardDescription>Monitoring progress dan identifikasi siswa yang membutuhkan bantuan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studentProgress.map((student, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="font-semibold text-gray-600">
                              {student.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold">{student.name}</h4>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(student.status)}
                              <Badge className={getStatusColor(student.status)}>
                                {student.status === "excellent" && "Sangat Baik"}
                                {student.status === "good" && "Baik"}
                                {student.status === "average" && "Rata-rata"}
                                {student.status === "needs_attention" && "Perlu Perhatian"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {Math.round((student.matematika + student.fisika + student.kimia) / 3)}
                          </div>
                          <div className="text-sm text-gray-500">Rata-rata</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Matematika</span>
                            <span>{student.matematika}</span>
                          </div>
                          <Progress value={student.matematika} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Fisika</span>
                            <span>{student.fisika}</span>
                          </div>
                          <Progress value={student.fisika} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Kimia</span>
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
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <span>AI Insights & Prediksi</span>
                  </CardTitle>
                  <CardDescription>Analisis mendalam dan rekomendasi berbasis AI</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">📈 Tren Positif</h4>
                    <p className="text-sm text-blue-700">
                      Performa matematika meningkat 12% dalam 3 bulan terakhir. Metode gamifikasi terbukti efektif untuk
                      topik aljabar.
                    </p>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">⚠️ Prediksi Risiko</h4>
                    <p className="text-sm text-orange-700">
                      5 siswa berisiko tidak mencapai target semester. Rekomendasikan sesi tutoring tambahan dalam 2
                      minggu ke depan.
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">💡 Rekomendasi</h4>
                    <p className="text-sm text-green-700">
                      Implementasikan lebih banyak praktikum virtual untuk fisika. Engagement rate meningkat 34% dengan
                      metode ini.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Optimasi Pembelajaran</CardTitle>
                  <CardDescription>Saran untuk meningkatkan efektivitas pembelajaran</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-blue-600">1</span>
                      </div>
                      <div>
                        <h5 className="font-medium">Personalisasi Konten</h5>
                        <p className="text-sm text-gray-600">
                          Sesuaikan tingkat kesulitan berdasarkan performa individual siswa
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-green-600">2</span>
                      </div>
                      <div>
                        <h5 className="font-medium">Waktu Optimal</h5>
                        <p className="text-sm text-gray-600">
                          Jadwalkan materi sulit pada jam 09:00-11:00 untuk hasil terbaik
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-purple-600">3</span>
                      </div>
                      <div>
                        <h5 className="font-medium">Metode Interaktif</h5>
                        <p className="text-sm text-gray-600">
                          Tingkatkan penggunaan simulasi dan gamifikasi untuk engagement
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-yellow-600">4</span>
                      </div>
                      <div>
                        <h5 className="font-medium">Feedback Real-time</h5>
                        <p className="text-sm text-gray-600">
                          Implementasikan sistem feedback otomatis untuk koreksi cepat
                        </p>
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
  )
}
