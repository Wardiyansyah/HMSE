'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useAppStore } from '@/lib/store';
import { Brain, Home, Sparkles, MessageCircle, BarChart3, BookOpen, Users, Settings, Menu, ChevronDown, User } from 'lucide-react';
import { logoutAndRedirect } from '@/lib/logout';

export function NavigationHeaderGuest() {
  const { user } = useAppStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userguest = {
    name: 'Pengunjung',
    email: 'example@gmail.com',
    role: 'guest',
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left Side - Logo + Navigation Dropdown */}
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="p-2 rounded-lg">
                <img src="..\logo\insanAI.png" alt="insanAI-Logo" className="h-14 w-14" />
              </div>
              <div className="hidden sm:block">
                <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">InsanAI</h2>
                <p className="text-xs text-gray-600">AI Education Platform</p>
              </div>
            </Link>
          </div>

          {/* Right Side - User Profile */}
          <div className="flex items-center space-x-3">
            {/* User Info - Hidden on small screens */}
            <div className="hidden lg:block text-right">
              <p className="text-sm font-medium">{userguest?.name}</p>
              <Badge variant="secondary" className="text-xs">
                {user?.role === 'student' ? 'Siswa' : userguest?.role}
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
                {/* <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{userguest?.name}</p>
                    <p className="text-xs text-gray-500">{userguest?.email}</p>
                    <Badge variant="secondary" className="text-xs w-fit">
                      {user?.role === 'student' ? 'Siswa' : userguest?.role}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator /> */}

                <DropdownMenuItem>
                  <button onClick={() => logoutAndRedirect('/login')} className="w-full text-left flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Masuk</span>
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            {/* <div className="md:hidden"> */}
            {/* <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}> */}
            {/* <SheetTrigger asChild>
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
                  <div className="mt-6 space-y-4"> */}
            {/* User Info */}
            {/* <div className="bg-gray-50 p-4 rounded-lg">
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
                    </div> */}

            {/* Settings */}
            {/* <div className="border-t pt-4">
                      <Link href="/settings" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="p-1.5 bg-white rounded-md shadow-sm">
                          <Settings className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">Pengaturan</div>
                          <div className="text-xs text-gray-500">Kelola profil dan preferensi</div>
                        </div>
                      </Link>
                    </div> */}
            {/* </div>
                </SheetContent> */}
            {/* </Sheet> */}
            {/* </div> */}
          </div>
        </div>
      </div>
    </header>
  );
}
