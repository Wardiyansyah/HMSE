import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
})

async function testOpenAI() {
  try {
    console.log("Testing OpenAI API connection...")

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful educational AI assistant for Indonesian students.",
        },
        {
          role: "user",
          content: "Jelaskan konsep fotosintesis secara singkat",
        },
      ],
      model: "gpt-4o-mini",
      max_tokens: 150,
    })

    console.log("✅ OpenAI API working!")
    console.log("Response:", completion.choices[0].message.content)

    return true
  } catch (error) {
    console.error("❌ OpenAI API Error:", error.message)

    if (error.code === "invalid_api_key") {
      console.log("🔑 Please check your API key in environment variables")
    } else if (error.code === "insufficient_quota") {
      console.log("💰 Please add billing information to your OpenAI account")
    } else if (error.code === "rate_limit_exceeded") {
      console.log("⚡ Rate limit exceeded, please try again later")
    }

    return false
  }
}

testOpenAI()
