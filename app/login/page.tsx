"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Brain, LogIn, Loader2 } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { supabase } from "@/lib/supabase" // Import the client-side Supabase client

export default function LoginPage() {
  const [username, setUsername] = useState("") // Changed from email to username
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const setUser = useAppStore((state) => state.setUser)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Query the 'users' table directly for username and password
      // WARNING: Storing plain text passwords is insecure.
      // In a real application, you should hash passwords and verify them securely.
      const { data: userData, error: loginError } = await supabase
        .from("users")
        .select("id, username, nama, role") // Select necessary fields
        .eq("username", username)
        .eq("password", password) // Direct comparison (insecure for production)
        .single()

      if (loginError || !userData) {
        setError("Username atau password salah.")
        return
      }

      // If login is successful, set the user state in Zustand
      setUser({
        id: userData.id,
        name: userData.nama || userData.username, // Use 'nama' as display name, fallback to username
        email: userData.username, // Map username to email for consistency with existing User interface
        role: userData.role || "student", // Default to student if role is null
        avatar: "/placeholder.svg?height=96&width=96", // Placeholder avatar
        preferences: {
          language: "id",
          theme: "light",
          notifications: true,
          aiAssistance: true,
        },
      })

      router.push("/dashboard") // Redirect to dashboard on successful login
    } catch (err: any) {
      console.error("Login error:", err)
      setError("Terjadi kesalahan tak terduga. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg">
              <Brain className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Selamat Datang Kembali!</CardTitle>
          <CardDescription className="text-gray-600">Masuk ke akun Anda untuk melanjutkan pembelajaran</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="username">Username</Label> {/* Label changed to Username */}
              <Input
                id="username"
                type="text" // Type changed to text
                placeholder="Masukkan username Anda"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memuat...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Masuk
                </>
              )}
            </Button>
          </form>
          {/* Removed the "Daftar Sekarang" link */}
        </CardContent>
      </Card>
    </div>
  )
}
