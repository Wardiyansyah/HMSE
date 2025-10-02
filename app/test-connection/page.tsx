"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, AlertCircle, Database, Users } from "lucide-react"
import { supabase, testSupabaseConnection, checkTableExists } from "@/lib/supabase"
import { signInWithCredentials } from "@/lib/auth-helpers"

interface TestResult {
  name: string
  status: "success" | "error" | "warning"
  message: string
  details?: string
}

export default function TestConnectionPage() {
  const [results, setResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(false)

  const runAllTests = async () => {
    setLoading(true)
    const testResults: TestResult[] = []

    // Test 1: Environment Variables
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (supabaseUrl && supabaseKey) {
        testResults.push({
          name: "Environment Variables",
          status: "success",
          message: "All environment variables found",
          details: `URL: ${supabaseUrl.substring(0, 30)}...`,
        })
      } else {
        testResults.push({
          name: "Environment Variables",
          status: "error",
          message: "Missing environment variables",
          details: `URL: ${supabaseUrl || "missing"}, Key: ${supabaseKey ? "present" : "missing"}`,
        })
      }
    } catch (error) {
      testResults.push({
        name: "Environment Variables",
        status: "error",
        message: "Error checking environment variables",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    }

    // Test 2: Supabase Client Connection
    try {
      const connectionTest = await testSupabaseConnection()
      if (connectionTest.success) {
        testResults.push({
          name: "Supabase Client",
          status: "success",
          message: "Supabase client connected successfully",
        })
      } else {
        testResults.push({
          name: "Supabase Client",
          status: "error",
          message: "Supabase client connection failed",
          details: connectionTest.error,
        })
      }
    } catch (error) {
      testResults.push({
        name: "Supabase Client",
        status: "error",
        message: "Supabase client connection failed",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    }

    // Test 3: Database Tables
    const tables = ["users", "classes", "subjects", "assignments", "grades"]
    const tableResults: string[] = []

    for (const table of tables) {
      try {
        const { exists, error } = await checkTableExists(table)
        if (exists) {
          tableResults.push(`${table}: ✅ OK`)
        } else {
          tableResults.push(`${table}: ❌ ${error || "Not found"}`)
        }
      } catch (error) {
        tableResults.push(`${table}: ❌ Error checking table`)
      }
    }

    const failedTables = tableResults.filter((result) => result.includes("❌"))
    if (failedTables.length === 0) {
      testResults.push({
        name: "Database Tables",
        status: "success",
        message: "All tables exist and accessible",
        details: tableResults.join("\n"),
      })
    } else {
      testResults.push({
        name: "Database Tables",
        status: "error",
        message: `${failedTables.length} tables have issues`,
        details: tableResults.join("\n"),
      })
    }

    // Test 4: Sample Data
    try {
      const { data: users, error: usersError } = await supabase.from("users").select("count").limit(1)
      const { data: classes, error: classesError } = await supabase.from("classes").select("count").limit(1)

      const usersStatus = usersError ? `Users error: ${usersError.message}` : "OK"
      const classesStatus = classesError ? `Classes error: ${classesError.message}` : "OK"

      if (!usersError && !classesError) {
        testResults.push({
          name: "Sample Data",
          status: "success",
          message: "Sample data accessible",
          details: `${usersStatus}, ${classesStatus}`,
        })
      } else {
        testResults.push({
          name: "Sample Data",
          status: "error",
          message: "Cannot check sample data",
          details: `${usersStatus}, ${classesStatus}`,
        })
      }
    } catch (error) {
      testResults.push({
        name: "Sample Data",
        status: "error",
        message: "Error checking sample data",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    }

    // Test 5: Authentication
    try {
      const authTest = await signInWithCredentials({
        username: "admin",
        password: "password123",
      })

      if (authTest.success && authTest.user) {
        testResults.push({
          name: "Authentication Test",
          status: "success",
          message: "Authentication working correctly",
          details: `Logged in as: ${authTest.user.nama} (${authTest.user.role})`,
        })
      } else {
        testResults.push({
          name: "Authentication Test",
          status: "error",
          message: "Authentication test failed",
          details: authTest.error || "Unknown authentication error",
        })
      }
    } catch (error) {
      testResults.push({
        name: "Authentication Test",
        status: "error",
        message: "Authentication test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      })
    }

    setResults(testResults)
    setLoading(false)
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
    }
  }

  const getStatusBadge = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Success</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800">Error</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Database Connection Test</h1>
          <p className="text-gray-600">Diagnosa koneksi database dan sistem HMS</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-6 w-6" />
              Diagnostik Sistem
            </CardTitle>
            <CardDescription>
              Klik tombol di bawah untuk menjalankan semua tes koneksi database dan sistem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={runAllTests} disabled={loading} className="w-full" size="lg">
              {loading ? "Menjalankan Tes..." : "Jalankan Semua Tes"}
            </Button>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <div className="space-y-4">
            {results.map((result, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.status)}
                      <h3 className="text-lg font-semibold">{result.name}</h3>
                    </div>
                    {getStatusBadge(result.status)}
                  </div>
                  <p className="text-gray-600 mb-2">{result.message}</p>
                  {result.details && (
                    <div className="bg-gray-50 p-3 rounded-md">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">{result.details}</pre>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Separator className="my-8" />

        {/* Troubleshooting Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Panduan Troubleshooting</CardTitle>
            <CardDescription>Langkah-langkah untuk mengatasi masalah yang ditemukan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border-l-4 border-red-500 bg-red-50">
              <h4 className="font-semibold text-red-800 mb-2">❌ Jika Environment Variables Error:</h4>
              <ul className="text-red-700 text-sm space-y-1">
                <li>• Buat file .env.local di root project</li>
                <li>• Tambahkan variabel Supabase dari dashboard project Anda</li>
                <li>• Restart development server (npm run dev)</li>
              </ul>
            </div>

            <div className="p-4 border-l-4 border-red-500 bg-red-50">
              <h4 className="font-semibold text-red-800 mb-2">❌ Jika Database Tables Error:</h4>
              <ul className="text-red-700 text-sm space-y-1">
                <li>• Buka Supabase SQL Editor</li>
                <li>• Jalankan script: scripts/017-fix-database-issues.sql</li>
                <li>• Pastikan semua script berhasil dieksekusi</li>
              </ul>
            </div>

            <div className="p-4 border-l-4 border-green-500 bg-green-50">
              <h4 className="font-semibold text-green-800 mb-2">✅ Jika Semua Tes Berhasil:</h4>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• Sistem siap digunakan!</li>
                <li>• Login dengan akun demo: admin / password123</li>
                <li>• Akses dashboard siswa: siswa1 / password123</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              Akun Demo
            </CardTitle>
            <CardDescription>Akun untuk testing sistem setelah database setup</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">👨‍💼 Admin</h4>
                <p className="text-sm text-gray-600">Username: admin</p>
                <p className="text-sm text-gray-600">Password: password123</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">👨‍🏫 Guru</h4>
                <p className="text-sm text-gray-600">Username: guru1</p>
                <p className="text-sm text-gray-600">Password: password123</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">👨‍🎓 Siswa</h4>
                <p className="text-sm text-gray-600">Username: siswa1</p>
                <p className="text-sm text-gray-600">Password: password123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
