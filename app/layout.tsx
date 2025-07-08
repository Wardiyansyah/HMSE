import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Brain, Home, Sparkles, MessageCircle, BarChart3, BookOpen, Users, Settings } from "lucide-react"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EduGenAI - Generative AI untuk Pendidikan Berkelanjutan",
  description:
    "Platform pembelajaran AI yang menghadirkan pengalaman belajar personal dan adaptif untuk semua kalangan",
    generator: 'v0.dev'
}

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "AI Content Generator",
    url: "/content-generator",
    icon: Sparkles,
  },
  {
    title: "Virtual Tutor",
    url: "/virtual-tutor",
    icon: MessageCircle,
  },
  {
    title: "Learning Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Perpustakaan",
    url: "/library",
    icon: BookOpen,
  },
  {
    title: "Komunitas",
    url: "/community",
    icon: Users,
  },
]

function AppSidebar() {
  return (
    <Sidebar>
      <Link href="/">
        <SidebarHeader>
          <div className="flex items-center space-x-2 px-2 py-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EduGenAI
              </h2>
              <p className="text-xs text-gray-600">AI Education Platform</p>
            </div>
          </div>
        </SidebarHeader>
      </Link>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/settings">
                <Settings />
                <span>Pengaturan</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className="light" style={{ colorScheme: "light" }}>
      <body className={inter.className}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light" 
          enableSystem 
          disableTransitionOnChange
        >
          <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}