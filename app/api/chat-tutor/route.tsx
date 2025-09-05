import { OpenAI } from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const message = formData.get("message") as string;
    const image = formData.get("image") as File | null;
    const systemContent = `Kamu adalah asisten pembelajaran cerdas untuk siswa Indonesia bernama Insan AI (Intelligent Assistant of Insan Pembangunan). 
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

          Selalu berikan jawaban yang komprehensif namun mudah dipahami sesuai level siswa.`

    const lowerMsg = (message || "").toLowerCase();
    const isImprove =
      lowerMsg.includes("lebih bagus") ||
      lowerMsg.includes("edit") ||
      lowerMsg.includes("ubah") ||
      lowerMsg.includes("perbaiki");

    // ==== 1. Kalau ada gambar ====
    if (image) {
      if (isImprove) {
        // --- Step 1: Analisis gambar user ---
        const arrayBuffer = await image.arrayBuffer();
        const base64Image = Buffer.from(arrayBuffer).toString("base64");

        const analysis = await openai.chat.completions.create({
          model: "gpt-5",
          messages: [
            {
              role: "system",
              content:
                "Deskripsikan isi gambar dengan detail singkat (misalnya objek, warna dominan, gaya, isi teks). Jangan menulis terlalu panjang.",
            },
            {
              role: "user",
              content: [
                {
                  type: "image_url",
                  image_url: { url: `data:${image.type};base64,${base64Image}` },
                },
              ],
            },
          ],
        });

        const description = analysis.choices[0].message.content || "";

        // --- Step 2: Gabungkan deskripsi dengan prompt user ---
        const finalPrompt = `${description}. ${message}. Buat versi yang lebih berkualitas namun tetap sesuai isi gambar.`;        

        // --- Step 3: Generate gambar baru ---
        const genImage = await openai.images.generate({
          model: "gpt-image-1",
          prompt: finalPrompt,
          size: "auto",
        });

        return new Response(
          JSON.stringify({
            reply: "Ini hasil gambar yang sudah diperbaiki.",
            imageUrl: genImage.data?.[0]?.url ?? null,
          }),
          { headers: { "Content-Type": "application/json" } }
        );
      } else {
        // --- Analisis gambar (jawab teks saja) ---
        const arrayBuffer = await image.arrayBuffer();
        const base64Image = Buffer.from(arrayBuffer).toString("base64");

        const messages: any[] = [
          {
            role: "system",
            content: systemContent,
          },
          {
            role: "user",
            content: [
              { type: "text", text: message || "Tolong analisis gambar ini" },
              {
                type: "image_url",
                image_url: { url: `data:${image.type};base64,${base64Image}` },
              },
            ],
          },
        ];

        const response = await openai.chat.completions.create({
          model: "gpt-5",
          messages,
        });

        return new Response(
          JSON.stringify({ reply: response.choices[0].message.content }),
          { headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // ==== 2. Kalau tidak ada gambar ====
    if (lowerMsg.includes("gambar")) {
      const genImage = await openai.images.generate({
        model: "dall-e-3",
        prompt: message,
        size: "1024x1024",
      });

      return new Response(
        JSON.stringify({
          reply: "Berikut gambar sesuai permintaanmu.",
          imageUrl: genImage.data?.[0]?.url ?? null,
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // ==== 3. Default → teks biasa ====
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: systemContent },
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
      JSON.stringify({
        reply:
          "Maaf, terjadi kesalahan saat memproses permintaan. Silakan coba lagi nanti.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
