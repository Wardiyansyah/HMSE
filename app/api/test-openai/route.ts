import { type NextRequest, NextResponse } from "next/server"
import { testApiKey } from "@/lib/openai-config"

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json()

    if (!apiKey) {
      return NextResponse.json({ success: false, error: "API key is required" }, { status: 400 })
    }

    const result = await testApiKey(apiKey)

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("API test error:", error)
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 })
  }
}
