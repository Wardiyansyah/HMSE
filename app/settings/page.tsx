"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAppStore } from "@/lib/store"
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Brain,
  Download,
  Trash2,
  Camera,
  Save,
  RefreshCw,
} from "lucide-react"

export default function SettingsPage() {
  const { user, updateUserPreferences } = useAppStore()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "student",
  })

  const handleSaveProfile = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const handlePreferenceChange = (key: string, value: any) => {
    updateUserPreferences({ [key]: value })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Settings className="h-8 w-8 mr-3 text-blue-600" />
            Pengaturan
          </h1>
          <p className="text-gray-600">Kelola profil, preferensi, dan pengaturan akun Anda</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="preferences">Preferensi</TabsTrigger>
            <TabsTrigger value="notifications">Notifikasi</TabsTrigger>
            <TabsTrigger value="ai-settings">AI Settings</TabsTrigger>
            <TabsTrigger value="data">Data & Privasi</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Informasi Profil</span>
                </CardTitle>
                <CardDescription>Kelola informasi dasar akun Anda</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src="/placeholder.svg?height=96&width=96" />
                      <AvatarFallback className="text-2xl">
                        {user?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <Button size="icon" className="absolute -bottom-2 -right-2 rounded-full">
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{user?.name}</h3>
                    <Badge variant="secondary" className="capitalize">
                      {user?.role === "student" ? "Siswa" : user?.role === "teacher" ? "Guru" : "Profesional"}
                    </Badge>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Peran</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => setFormData({ ...formData, role: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Siswa</SelectItem>
                        <SelectItem value="teacher">Guru</SelectItem>
                        <SelectItem value="professional">Profesional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon</Label>
                    <Input id="phone" placeholder="+62 812 3456 7890" />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button onClick={handleSaveProfile} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Simpan Perubahan
                      </>
                    )}
                  </Button>
                  <Button variant="outline">Batal</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Palette className="h-5 w-5" />
                    <span>Tampilan</span>
                  </CardTitle>
                  <CardDescription>Sesuaikan tampilan aplikasi</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Tema</Label>
                      <p className="text-sm text-gray-600">Pilih tema yang Anda sukai</p>
                    </div>
                    <Select
                      value={user?.preferences.theme}
                      onValueChange={(value) => handlePreferenceChange("theme", value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Terang</SelectItem>
                        <SelectItem value="dark">Gelap</SelectItem>
                        <SelectItem value="system">Sistem</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5" />
                    <span>Bahasa & Region</span>
                  </CardTitle>
                  <CardDescription>Pengaturan bahasa dan lokasi</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Bahasa</Label>
                      <p className="text-sm text-gray-600">Bahasa antarmuka aplikasi</p>
                    </div>
                    <Select
                      value={user?.preferences.language}
                      onValueChange={(value) => handlePreferenceChange("language", value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="id">Indonesia</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Pengaturan Notifikasi</span>
                </CardTitle>
                <CardDescription>Kelola notifikasi yang ingin Anda terima</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifikasi Push</Label>
                    <p className="text-sm text-gray-600">Terima notifikasi di perangkat Anda</p>
                  </div>
                  <Switch
                    checked={user?.preferences.notifications}
                    onCheckedChange={(checked) => handlePreferenceChange("notifications", checked)}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Jenis Notifikasi</h4>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Tugas Baru</Label>
                      <p className="text-sm text-gray-600">Notifikasi saat ada tugas atau materi baru</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Pengingat Belajar</Label>
                      <p className="text-sm text-gray-600">Pengingat untuk melanjutkan pembelajaran</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Pencapaian</Label>
                      <p className="text-sm text-gray-600">Notifikasi saat mencapai milestone</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Diskusi</Label>
                      <p className="text-sm text-gray-600">Balasan dan mention dalam diskusi</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>Pengaturan AI</span>
                </CardTitle>
                <CardDescription>Konfigurasi fitur AI dan pembelajaran adaptif</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>AI Assistant</Label>
                    <p className="text-sm text-gray-600">Aktifkan bantuan AI untuk pembelajaran</p>
                  </div>
                  <Switch
                    checked={user?.preferences.aiAssistance}
                    onCheckedChange={(checked) => handlePreferenceChange("aiAssistance", checked)}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Preferensi AI</h4>

                  <div className="space-y-2">
                    <Label>Level Bantuan AI</Label>
                    <Select defaultValue="adaptive">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minimal">Minimal - Hanya saat diminta</SelectItem>
                        <SelectItem value="adaptive">Adaptif - Sesuai kebutuhan</SelectItem>
                        <SelectItem value="proactive">Proaktif - Bantuan maksimal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Gaya Pembelajaran</Label>
                    <Select defaultValue="visual">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="visual">Visual - Gambar dan diagram</SelectItem>
                        <SelectItem value="auditory">Auditori - Audio dan penjelasan</SelectItem>
                        <SelectItem value="kinesthetic">Kinestetik - Praktik dan simulasi</SelectItem>
                        <SelectItem value="mixed">Campuran - Semua metode</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-Generate Content</Label>
                      <p className="text-sm text-gray-600">AI otomatis membuat konten pembelajaran</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Smart Recommendations</Label>
                      <p className="text-sm text-gray-600">Rekomendasi materi berdasarkan performa</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Privasi & Keamanan</span>
                  </CardTitle>
                  <CardDescription>Kelola data dan privasi Anda</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Profil Publik</Label>
                      <p className="text-sm text-gray-600">Tampilkan profil di komunitas</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Analitik Pembelajaran</Label>
                      <p className="text-sm text-gray-600">Izinkan analisis data pembelajaran</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Berbagi Progress</Label>
                      <p className="text-sm text-gray-600">Bagikan pencapaian dengan guru/orang tua</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Download className="h-5 w-5" />
                    <span>Data Management</span>
                  </CardTitle>
                  <CardDescription>Kelola data pembelajaran Anda</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data Pembelajaran
                  </Button>

                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset Progress
                  </Button>

                  <Separator />

                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-2">Zona Bahaya</h4>
                    <p className="text-sm text-red-700 mb-3">
                      Tindakan ini tidak dapat dibatalkan. Pastikan Anda sudah backup data.
                    </p>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Hapus Akun
                    </Button>
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
