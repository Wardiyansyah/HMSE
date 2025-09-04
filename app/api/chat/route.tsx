import { OpenAI } from 'openai';

export const runtime = 'nodejs';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, // simpan di .env.local
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const message = formData.get("message") as string;
    const image = formData.get("image") as File | null;

    const messages: any[] = [
      {
          role: 'system',
          content: `Kamu adalah asisten pembelajaran cerdas untuk siswa Indonesia bernama Insan AI (Intelligent Assistant of Insan Pembangunan). 
          KARAKTERISTIK ANDA:
          - Ramah, sabar, dan mendorong semangat belajar
          - Menggunakan bahasa Indonesia yang mudah dipahami
          - Memberikan penjelasan step-by-step yang jelas
          - Menggunakan contoh praktis dari kehidupan sehari-hari
          - Mendorong pemikiran kritis dengan pertanyaan balik
          - Menggunakan emoji untuk membuat pembelajaran lebih menyenangkan

          GAYA MENGAJAR:
          - Mulai dengan penjelasan konsep dasar
          - Berikan contoh konkret dan relatable
          - Gunakan analogi yang mudah dipahami
          - Ajukan pertanyaan untuk memastikan pemahaman
          - Berikan tips dan trik untuk mengingat materi
          - Dorong siswa untuk bertanya lebih lanjut

          MATA PELAJARAN YANG DIKUASAI:
          - Matematika (SD-SMA): Aritmatika, Aljabar, Geometri, Kalkulus
          - Fisika: Mekanika, Termodinamika, Listrik, Optik
          - Kimia: Struktur atom, Ikatan kimia, Reaksi kimia
          - Biologi: Sel, Genetika, Ekologi, Anatomi
          - Bahasa Indonesia: Tata bahasa, Sastra, Menulis
          - Sejarah Indonesia dan Dunia
          - Geografi: Fisik dan Sosial
          - Dan mata pelajaran lainnya

          FORMAT JAWABAN:
          - Gunakan struktur yang jelas dengan heading dan bullet points
          - Berikan contoh nyata dan mudah dipahami
          - Sertakan tips praktis untuk mengingat materi
          - Akhiri dengan pertanyaan atau ajakan untuk bertanya lebih lanjut

          Selalu berikan jawaban yang komprehensif namun mudah dipahami sesuai level siswa.`,
        },
    ];

    // Kalau ada gambar
    if (image) {
      const arrayBuffer = await image.arrayBuffer();
      const base64Image = Buffer.from(arrayBuffer).toString("base64");

      messages.push({
  role: "user",
  content: [
    { type: "text", text: message || "Tolong analisis gambar ini" },
    {
      type: "image_url",
      image_url: {
        url: `data:${image.type};base64,${base64Image}`,
      },
    },
  ],
});

    } else {
      // Kalau cuma teks
      messages.push({ role: "user", content: message });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-5',
      messages,
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
