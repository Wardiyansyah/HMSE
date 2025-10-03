import { NextResponse } from "next/server";
import OpenAI from "openai";
import { VertexAI } from "@google-cloud/vertexai";
import { addClickPoints } from '@/lib/insanai-points';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
});

function cleanJSONResponse(responseText: string) {
  return responseText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

export async function POST(req: Request) {
  try {
    const { topic, subject, level, profileId } = await req.json();

    // Step 1: Generate script dengan GPT
    const gptRes = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Anda adalah AI penulis naskah video pembelajaran.
Buatkan script video dengan format JSON agar bisa digunakan generator video.
Gunakan bahasa Indonesia yang jelas.`,
        },
        {
          role: "user",
          content: `Buatkan naskah video pembelajaran tentang "${topic}" 
untuk mata pelajaran ${subject} tingkat ${level}. 

Format JSON:
{
  "title": "Judul Video",
  "scenes": [
    {
      "sceneNumber": 1,
      "text": "Narasi untuk adegan",
      "visual": "Deskripsi visual adegan"
    }
  ]
}

Aturan:
- Maksimal 5 scene
- Narasi 1-2 kalimat per scene
- Visual harus sederhana (misalnya: "guru menjelaskan di papan tulis", "animasi angka bergerak")`,
        },
      ],
    });

    const rawScript = gptRes.choices[0]?.message?.content || "{}";
    const cleanScript = cleanJSONResponse(rawScript);

    let scriptJson: any;
    try {
      scriptJson = JSON.parse(cleanScript);
    } catch {
      scriptJson = { title: "Video Pembelajaran", scenes: [] };
    }

    // Step 2: Gabungkan scene jadi prompt untuk Veo-3
    const veoPrompt = scriptJson.scenes
      .map(
        (s: any) =>
          `Scene ${s.sceneNumber}: ${s.visual}. Narasi: ${s.text}`
      )
      .join("\n");

    // Step 3: Generate video dengan Vertex AI (Veo-3)
    const vertex = new VertexAI({
      project: process.env.PROJECT_ID!,
      location: process.env.LOCATION!,
    });

    const model = vertex.preview.getGenerativeModel({ model: "veo-3.0-generate-001" });

    const veoRes = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: veoPrompt }] }],
      generationConfig: {
        responseMimeType: "video/mp4",
      },
    });

    // Ambil URL atau inline video
    const videoUrl =
      (veoRes.response as any)?.candidates?.[0]?.content?.parts?.[0]?.fileData
        ?.fileUri ||
      (veoRes.response as any)?.candidates?.[0]?.content?.parts?.[0]?.inlineData
        ?.data ||
      null;

    // Step 4: Return ke frontend
    // Award points for video generation
    if (profileId) {
      try { await addClickPoints(profileId, 5); } catch (e) { console.error('points error', e); }
    }

    return NextResponse.json({
      script: scriptJson,
      videoUrl,
    });
  } catch (error: any) {
    console.error("Error generate video:", error);
    return NextResponse.json(
      { error: error.message || "Gagal membuat video" },
      { status: 500 }
    );
  }
}
