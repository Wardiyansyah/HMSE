import { OpenAI } from "openai";

export const runtime = "nodejs";
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: "Kamu adalah chatbot ramah bernama Insan AI." },
        { role: "user", content: message },
      ],
    });

    return new Response(
      JSON.stringify({ reply: response.choices[0].message.content }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Chatbot Error:", error);
    return new Response(
      JSON.stringify({ reply: "Terjadi kesalahan. Coba lagi nanti." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
