'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/lib/store';
import { useTheme } from '@/lib/theme-context';
import { useLanguage } from '@/lib/language-context';
import { NavigationHeader } from '@/components/navigation-header-student';
import { Settings, User, Bell, Shield, Palette, Globe, Brain, Download, Trash2, Camera, Save, RefreshCw, Sun, Moon, Monitor } from 'lucide-react';

export default function SettingsPage() {
  const { user, updateUserPreferences } = useAppStore();
  const { theme, setTheme, actualTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'student',
  });

  const handleSaveProfile = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const handlePreferenceChange = (key: string, value: any) => {
    updateUserPreferences({ [key]: value });
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    handlePreferenceChange('theme', newTheme);
  };

  const handleLanguageChange = (newLanguage: 'id' | 'en') => {
    setLanguage(newLanguage);
    handlePreferenceChange('language', newLanguage);
  };

  const getThemeIcon = (themeValue: string) => {
    switch (themeValue) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      case 'system':
        return <Monitor className="h-4 w-4" />;
      default:
        return <Sun className="h-4 w-4" />;
    }
  };

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
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
            <Settings className="h-6 w-6 md:h-8 md:w-8 mr-2 md:mr-3 text-blue-600" />
            {t('settings.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">{t('settings.subtitle')}</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-5">
            <TabsTrigger value="profile">{t('settings.profile')}</TabsTrigger>
            <TabsTrigger value="preferences">{t('settings.preferences')}</TabsTrigger>
            <TabsTrigger value="notifications">{t('settings.notifications')}</TabsTrigger>
            <TabsTrigger value="ai-settings" className="hidden md:inline-flex">
              {t('settings.ai-settings')}
            </TabsTrigger>
            <TabsTrigger value="data" className="hidden md:inline-flex">
              {t('settings.data')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <User className="h-5 w-5" />
                  <span>{t('settings.profile-info')}</span>
                </CardTitle>
                <CardDescription className="text-sm">{t('settings.profile.subtitle')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src="/placeholder.svg?height=96&width=96" />
                      <AvatarFallback className="text-2xl">
                        {user?.name
                          ?.split(' ')
                          .map((n) => n[0])
                          .join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <Button size="icon" className="absolute -bottom-2 -right-2 rounded-full">
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 text-center sm:text-left">
                    <h3 className="text-xl font-semibold">{user?.name}</h3>
                    <Badge variant="secondary" className="capitalize">
                      {getRoleLabel(user?.role || 'student')}
                    </Badge>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('settings.full-name')}</Label>
                    <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('settings.email')}</Label>
                    <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">{t('settings.role')}</Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value as any })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">{t('common.student')}</SelectItem>
                        <SelectItem value="teacher">{t('common.teacher')}</SelectItem>
                        <SelectItem value="professional">{t('common.professional')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Removed Phone Number field */}
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <Button onClick={handleSaveProfile} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        {t('settings.saving')}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {t('settings.save-changes')}
                      </>
                    )}
                  </Button>
                  <Button variant="outline">{t('settings.cancel')}</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Palette className="h-5 w-5" />
                    <span>{t('settings.appearance')}</span>
                  </CardTitle>
                  <CardDescription className="text-sm">{t('settings.appearance.subtitle')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>{t('settings.theme')}</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t('settings.theme.subtitle')}</p>
                    </div>
                    <Select value={theme} onValueChange={handleThemeChange}>
                      <SelectTrigger className="w-32">
                        <SelectValue>
                          <div className="flex items-center space-x-2">
                            {getThemeIcon(theme)}
                            <span>
                              {theme === 'light' && t('settings.theme.light')}
                              {theme === 'dark' && t('settings.theme.dark')}
                              {theme === 'system' && t('settings.theme.system')}
                            </span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="flex items-center space-x-2">
                            <Sun className="h-4 w-4" />
                            <span>{t('settings.theme.light')}</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center space-x-2">
                            <Moon className="h-4 w-4" />
                            <span>{t('settings.theme.dark')}</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="system">
                          <div className="flex items-center space-x-2">
                            <Monitor className="h-4 w-4" />
                            <span>{t('settings.theme.system')}</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Theme Preview */}
                  <div className="mt-4 p-4 border dark:border-gray-700 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                    <h4 className="font-semibold mb-2">{t('common.preview')}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{actualTheme === 'dark' ? t('common.dark-mode-active') : t('common.light-mode-active')}</p>
                    <div className="mt-2 flex space-x-2">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <div className="w-4 h-4 bg-purple-500 rounded"></div>
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Globe className="h-5 w-5" />
                    <span>{t("settings.language-region")}</span>
                  </CardTitle>
                  <CardDescription className="text-sm">{t("settings.language-region.subtitle")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>{t("settings.language")}</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{t("settings.language.subtitle")}</p>
                    </div>
                    <Select value={language} onValueChange={handleLanguageChange}>
                      <SelectTrigger className="w-32">
                        <SelectValue>
                          <span>
                            {language === "id" && t("settings.language.id")}
                            {language === "en" && t("settings.language.en")}
                          </span>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="id">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">🇮🇩</span>
                            <span>{t("settings.language.id")}</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="en">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">🇺🇸</span>
                            <span>{t("settings.language.en")}</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div> */}

              {/* Language Preview */}
              {/* <div className="mt-4 p-4 border dark:border-gray-700 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
                    <h4 className="font-semibold mb-2">
                      {language === "id" ? t("common.language-preview") : t("common.language-preview")}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {language === "id" ? t("common.id-interface-description") : t("common.en-interface-description")}
                    </p>
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {language === "id"
                        ? t("common.changes-applied-automatically")
                        : t("common.changes-applied-automatically")}
                    </div>
                  </div>
                </CardContent> */}
              {/* </Card> */}
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Bell className="h-5 w-5" />
                  <span>{t('settings.notifications')}</span>
                </CardTitle>
                <CardDescription className="text-sm">Kelola notifikasi yang ingin Anda terima</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Notifikasi Push</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Terima notifikasi di perangkat Anda</p>
                  </div>
                  <Switch checked={user?.preferences.notifications} onCheckedChange={(checked) => handlePreferenceChange('notifications', checked)} />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Jenis Notifikasi</h4>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Tugas Baru</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Notifikasi saat ada tugas atau materi baru</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Pengingat Belajar</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Pengingat untuk melanjutkan pembelajaran</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Pencapaian</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Notifikasi saat mencapai milestone</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Diskusi</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Balasan dan mention dalam diskusi</p>
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
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Brain className="h-5 w-5" />
                  <span>Pengaturan AI</span>
                </CardTitle>
                <CardDescription className="text-sm">Konfigurasi fitur AI dan pembelajaran adaptif</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>AI Assistant</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Aktifkan bantuan AI untuk pembelajaran</p>
                  </div>
                  <Switch checked={user?.preferences.aiAssistance} onCheckedChange={(checked) => handlePreferenceChange('aiAssistance', checked)} />
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
                      <p className="text-sm text-gray-600 dark:text-gray-400">AI otomatis membuat konten pembelajaran</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Smart Recommendations</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Rekomendasi materi berdasarkan performa</p>
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
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Shield className="h-5 w-5" />
                    <span>Privasi & Keamanan</span>
                  </CardTitle>
                  <CardDescription className="text-sm">Kelola data dan privasi Anda</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Profil Publik</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Tampilkan profil di komunitas</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Analitik Pembelajaran</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Izinkan analisis data pembelajaran</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Berbagi Progress</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Bagikan pencapaian dengan guru/orang tua</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg">
                    <Download className="h-5 w-5" />
                    <span>Data Management</span>
                  </CardTitle>
                  <CardDescription className="text-sm">Kelola data pembelajaran Anda</CardDescription>
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

                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-700">
                    <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">Zona Bahaya</h4>
                    <p className="text-sm text-red-700 dark:text-red-400 mb-3">Tindakan ini tidak dapat dibatalkan. Pastikan Anda sudah backup data.</p>
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
  );
}
