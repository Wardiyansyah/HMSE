'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useAppStore } from '@/lib/store';
import { Brain, Home, Sparkles, MessageCircle, BarChart3, BookOpen, Users, Settings, Menu, ChevronDown, User, LogOut } from 'lucide-react';
import { getCurrentUser, getUserProfile } from '@/lib/auth-helpers';
import { logoutAndRedirect } from '@/lib/logout';
import { supabase } from '@/lib/supabase';

const menuItems = [
  {
    title: 'Dashboard',
    url: '/dashboard/teacher',
    icon: Home,
    description: 'Halaman utama dan overview',
  },
  {
    title: 'AI Content Generator',
    url: '/content-generator',
    icon: Sparkles,
    description: 'Buat materi pembelajaran dengan AI',
  },
  {
    title: 'Virtual Tutor',
    url: '/virtual-tutor/teacher',
    icon: MessageCircle,
    description: 'Chat dengan AI tutor 24/7',
  },
  {
    title: 'Learning Analytics',
    url: '/analytics',
    icon: BarChart3,
    description: 'Analisis perkembangan belajar',
  },
  {
    title: 'Materi Pembelajaran',
    url: '/library/teacher',
    icon: BookOpen,
    description: 'Koleksi materi pembelajaran',
  },
  {
    title: 'Grup Belajar',
    url: '/community/teacher',
    icon: Users,
    description: 'Diskusi dan berbagi pengalaman',
  },
];

export function NavigationHeader() {
  const pathname = usePathname();
  const { user } = useAppStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentPage = menuItems.find((item) => item.url === pathname);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-800 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left Side - Logo + Navigation Dropdown */}
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <Link href="/dashboard/teacher" className="flex items-center space-x-2">
              <div className="p-2 rounded-lg">
                <img src="..\logo\insanAI.png" alt="insanAI-Logo" className="h-14 w-14" />
              </div>
              <div className="hidden sm:block">
                <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">InsanAI</h2>
                <p className="text-xs text-gray-600">AI Education Platform</p>
              </div>
            </Link>

            {/* Desktop Navigation Dropdown */}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 h-10">
                    {currentPage?.icon && <currentPage.icon className="h-4 w-4" />}
                    <span className="font-medium">{currentPage?.title || 'Menu'}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-72">
                  <DropdownMenuLabel className="text-sm font-semibold">Menu Navigasi</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {menuItems.map((item) => (
                    <DropdownMenuItem key={item.title} asChild>
                      <Link href={item.url} className="flex items-start space-x-3 p-3 cursor-pointer">
                        <div className="p-1.5 bg-gray-100 rounded-md">
                          <item.icon className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{item.title}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings/teacher" className="flex items-center space-x-3 p-3 cursor-pointer">
                      <div className="p-1.5 bg-gray-100 rounded-md">
                        <Settings className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">Pengaturan</div>
                        <div className="text-xs text-gray-500 mt-0.5">Kelola profil dan preferensi</div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Right Side - User Profile */}
          <div className="flex items-center space-x-3">
            {/* User Info - Hidden on small screens */}
            <div className="hidden lg:block text-right">
              <p className="text-sm font-medium">{user?.name}</p>
              <Badge variant="secondary" className="text-x2xl">
                Teacher Dashboard
              </Badge>
            </div>

            {/* User Avatar Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-blue-200">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      {user?.name
                        ?.split(' ')
                        .map((n) => n[0])
                        .join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <button onClick={() => logoutAndRedirect('/')} className="w-full text-left flex items-center space-x-2">
                    <LogOut className="h-4 w-4" />
                    <span>Keluar</span>
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader>
                    <SheetTitle className="flex items-center space-x-2">
                      <Brain className="h-5 w-5 text-blue-600" />
                      <span>EduGenAI</span>
                    </SheetTitle>
                    <SheetDescription>Menu navigasi dan pengaturan</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {/* User Info */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="/placeholder.svg?height=48&width=48" />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            {user?.name
                              ?.split(' ')
                              .map((n) => n[0])
                              .join('') || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user?.name}</p>
                          <p className="text-sm text-gray-600">{user?.email}</p>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {user?.role === 'student' ? 'Siswa' : user?.role === 'teacher' ? 'Guru' : 'Profesional'}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Menu */}
                    <div>
                      <h3 className="font-semibold mb-3">Menu Utama</h3>
                      <div className="space-y-2">
                        {menuItems.map((item) => (
                          <Link
                            key={item.title}
                            href={item.url}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${pathname === item.url ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                          >
                            <div className="p-1.5 bg-white rounded-md shadow-sm">
                              <item.icon className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-medium">{item.title}</div>
                              <div className="text-xs text-gray-500">{item.description}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Settings */}
                    <div className="border-t pt-4">
                      <Link href="/settings/teacher" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="p-1.5 bg-white rounded-md shadow-sm">
                          <Settings className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">Pengaturan</div>
                          <div className="text-xs text-gray-500">Kelola profil dan preferensi</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
