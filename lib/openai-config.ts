import OpenAI from "openai"

// Initialize OpenAI client
export const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "",
  dangerouslyAllowBrowser: true, // Only for client-side usage in Next.js
})

// Check if API key is configured
export const isApiKeyConfigured = (): boolean => {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
  return !!(apiKey && apiKey !== "your-api-key-here" && apiKey.startsWith("sk-"))
}

// Test API key validity
export const testApiKey = async (apiKey?: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const client = new OpenAI({
      apiKey: apiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    })

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: 'You are a helpful assistant. Respond with just "OK" to confirm the API is working.',
        },
        {
          role: "user",
          content: "Test",
        },
      ],
      max_tokens: 5,
    })

    if (response.choices[0]?.message?.content) {
      return { success: true }
    } else {
      return { success: false, error: "No response from API" }
    }
  } catch (error: any) {
    let errorMessage = "Unknown error"

    if (error.code === "invalid_api_key") {
      errorMessage = "API key tidak valid"
    } else if (error.code === "insufficient_quota") {
      errorMessage = "Quota tidak mencukupi. Silakan tambahkan billing di OpenAI"
    } else if (error.code === "rate_limit_exceeded") {
      errorMessage = "Rate limit terlampaui. Coba lagi nanti"
    } else if (error.message) {
      errorMessage = error.message
    }

    return { success: false, error: errorMessage }
  }
}

// Generate educational content using OpenAI
export const generateEducationalContent = async (
  prompt: string,
  type: "explanation" | "quiz" | "presentation" | "summary" = "explanation",
): Promise<string> => {
  if (!isApiKeyConfigured()) {
    throw new Error("OpenAI API key belum dikonfigurasi")
  }

  const systemPrompts = {
    explanation:
      "Anda adalah tutor AI yang ahli dalam pendidikan Indonesia. Berikan penjelasan yang mudah dipahami, step-by-step, dan sesuai dengan kurikulum Indonesia.",
    quiz: "Anda adalah pembuat soal yang ahli. Buat soal-soal berkualitas dengan pilihan ganda dan penjelasan jawaban yang sesuai kurikulum Indonesia.",
    presentation:
      "Anda adalah ahli pembuatan materi presentasi pendidikan. Buat outline presentasi yang terstruktur dan menarik untuk siswa Indonesia.",
    summary:
      "Anda adalah ahli merangkum materi pendidikan. Buat ringkasan yang komprehensif namun mudah dipahami sesuai kurikulum Indonesia.",
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompts[type],
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    })

    return response.choices[0]?.message?.content || "Tidak ada respons dari AI"
  } catch (error: any) {
    console.error("Error generating content:", error)
    throw new Error(`Gagal generate konten: ${error.message}`)
  }
}

// Stream educational content (for real-time responses)
export const streamEducationalContent = async (
  prompt: string,
  onChunk: (chunk: string) => void,
  type: "explanation" | "quiz" | "presentation" | "summary" = "explanation",
): Promise<void> => {
  if (!isApiKeyConfigured()) {
    throw new Error("OpenAI API key belum dikonfigurasi")
  }

  const systemPrompts = {
    explanation:
      "Anda adalah tutor AI yang ahli dalam pendidikan Indonesia. Berikan penjelasan yang mudah dipahami, step-by-step, dan sesuai dengan kurikulum Indonesia.",
    quiz: "Anda adalah pembuat soal yang ahli. Buat soal-soal berkualitas dengan pilihan ganda dan penjelasan jawaban yang sesuai kurikulum Indonesia.",
    presentation:
      "Anda adalah ahli pembuatan materi presentasi pendidikan. Buat outline presentasi yang terstruktur dan menarik untuk siswa Indonesia.",
    summary:
      "Anda adalah ahli merangkum materi pendidikan. Buat ringkasan yang komprehensif namun mudah dipahami sesuai kurikulum Indonesia.",
  }

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompts[type],
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
      stream: true,
    })

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || ""
      if (content) {
        onChunk(content)
      }
    }
  } catch (error: any) {
    console.error("Error streaming content:", error)
    throw new Error(`Gagal stream konten: ${error.message}`)
  }
}
