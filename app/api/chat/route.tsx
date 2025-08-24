import { OpenAI } from 'openai';

export const runtime = 'nodejs';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, // simpan di .env.local
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await openai.chat.completions.create({
      model: 'gpt-5',
      messages: [{ role: 'user', content: message }],
    });

    return new Response(JSON.stringify({ reply: response.choices[0].message.content }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Chatbot Error:', error);

    return new Response(
      JSON.stringify({
        reply: 'Maaf, terjadi kesalahan saat memproses permintaan. Silakan coba lagi nanti.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
