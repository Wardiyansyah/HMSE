"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, Key, ExternalLink } from "lucide-react"

interface ApiKeyCheckerProps {
  onApiKeyValid?: (isValid: boolean) => void
}

export function ApiKeyChecker({ onApiKeyValid }: ApiKeyCheckerProps) {
  const [apiKey, setApiKey] = useState("")
  const [isChecking, setIsChecking] = useState(false)
  const [status, setStatus] = useState<"idle" | "valid" | "invalid" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    // Check if API key exists in environment
    const envApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
    if (envApiKey && envApiKey !== "your-api-key-here") {
      setApiKey(envApiKey)
      checkApiKey(envApiKey)
    }
  }, [])

  const checkApiKey = async (keyToCheck: string = apiKey) => {
    if (!keyToCheck || !keyToCheck.startsWith("sk-")) {
      setStatus("invalid")
      setErrorMessage("API key harus dimulai dengan 'sk-'")
      onApiKeyValid?.(false)
      return
    }

    setIsChecking(true)
    setStatus("idle")
    setErrorMessage("")

    try {
      const response = await fetch("/api/test-openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey: keyToCheck }),
      })

      const result = await response.json()

      if (result.success) {
        setStatus("valid")
        onApiKeyValid?.(true)
      } else {
        setStatus("invalid")
        setErrorMessage(result.error || "API key tidak valid")
        onApiKeyValid?.(false)
      }
    } catch (error) {
      setStatus("error")
      setErrorMessage("Gagal menguji API key")
      onApiKeyValid?.(false)
    } finally {
      setIsChecking(false)
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case "valid":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "invalid":
        return <XCircle className="h-5 w-5 text-red-600" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      default:
        return <Key className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusBadge = () => {
    switch (status) {
      case "valid":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">Aktif</Badge>
      case "invalid":
        return <Badge variant="destructive">Tidak Valid</Badge>
      case "error":
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
          >
            Error
          </Badge>
        )
      default:
        return <Badge variant="outline">Belum Diuji</Badge>
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {getStatusIcon()}
          <span>OpenAI API Configuration</span>
          {getStatusBadge()}
        </CardTitle>
        <CardDescription>Konfigurasi API key OpenAI untuk mengaktifkan fitur AI pada platform EduGenAI</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-key">OpenAI API Key</Label>
          <div className="flex space-x-2">
            <Input
              id="api-key"
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="font-mono"
            />
            <Button onClick={() => checkApiKey()} disabled={isChecking || !apiKey} variant="outline">
              {isChecking ? "Mengecek..." : "Test"}
            </Button>
          </div>
        </div>

        {status === "valid" && (
          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-300">
              ✅ API key valid! Fitur AI sudah aktif dan siap digunakan.
            </AlertDescription>
          </Alert>
        )}

        {(status === "invalid" || status === "error") && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage || "Terjadi kesalahan saat menguji API key"}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3 pt-4 border-t">
          <h4 className="font-medium text-sm">Cara Mendapatkan OpenAI API Key:</h4>
          <ol className="text-sm text-gray-600 dark:text-gray-400 space-y-2 list-decimal list-inside">
            <li>
              Kunjungi{" "}
              <Button variant="link" className="p-0 h-auto text-blue-600" asChild>
                <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">
                  platform.openai.com/api-keys <ExternalLink className="h-3 w-3 inline ml-1" />
                </a>
              </Button>
            </li>
            <li>Login atau daftar akun OpenAI</li>
            <li>Klik "Create new secret key"</li>
            <li>Copy API key yang dimulai dengan "sk-"</li>
            <li>Paste ke field di atas dan klik "Test"</li>
          </ol>

          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Penting:</strong> Anda perlu menambahkan metode pembayaran di OpenAI untuk menggunakan API.
              Minimum deposit biasanya $5. Kunjungi{" "}
              <Button variant="link" className="p-0 h-auto text-blue-600" asChild>
                <a href="https://platform.openai.com/account/billing" target="_blank" rel="noopener noreferrer">
                  billing settings <ExternalLink className="h-3 w-3 inline ml-1" />
                </a>
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  )
}
