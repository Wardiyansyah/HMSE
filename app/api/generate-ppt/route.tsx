import { NextResponse } from "next/server";
import PptxGenJS from "pptxgenjs";

// ambil gambar dari DALL·E dan convert ke base64
async function fetchBase64Image(prompt: string, apiKey: string): Promise<string | null> {
  try {
    const resp = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt,
        size: "1024x1024",
        quality: "standard",
        n: 1,
      }),
    });

    if (!resp.ok) {
      console.error("❌ Gagal request DALL·E:", await resp.text());
      return null;
    }

    const data = await resp.json();
    const imgUrl = data.data[0].url;

    const imgResp = await fetch(imgUrl);
    const buffer = await imgResp.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    return `data:image/png;base64,${base64}`;
  } catch (err) {
    console.error("💥 Error fetchBase64Image:", err);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const { content, apiKey } = await req.json();
    const pptx = new PptxGenJS();

    // 🎨 Cover
    let cover = pptx.addSlide();
    cover.background = { color: "1F497D" };
    cover.addText(content.title || "Judul Presentasi", {
      x: 1,
      y: 2,
      fontSize: 40,
      bold: true,
      color: "FFFFFF",
    });
    cover.addText(content.description || "", {
      x: 1,
      y: 3.5,
      fontSize: 20,
      color: "D9E1F2",
    });

    // 🎨 Isi slides
    const bgColors = ["FFFFFF", "F2F2F2", "EAF3FF"];
    if (content.slides) {
      for (let i = 0; i < content.slides.length; i++) {
        const slideData = content.slides[i];
        let s = pptx.addSlide();
        s.background = { color: bgColors[i % bgColors.length] };

        // Title
        s.addText(slideData.title, {
          x: 0.5,
          y: 0.5,
          w: 8.5,
          h: 0.8,
          fontSize: 28,
          bold: true,
          color: "1F497D",
          align: "center",
        });

        // Bullet points
        slideData.bulletPoints?.forEach((point: string, idx: number) => {
          s.addText(`• ${point}`, {
            x: 0.5,
            y: 0 + idx * 0.6,
            w: 5.0,
            h: 4.5,
            fontSize: 18,
            color: "333333",
          });
        });

        // Gambar dari DALL·E
        if (apiKey) {
          const imgPrompt = `Ilustrasi edukatif sederhana tentang ${slideData.title}, gaya flat design minimalis`;
          const base64Image = await fetchBase64Image(imgPrompt, apiKey);
          if (base64Image) {
            s.addImage({
              data: base64Image,
              x: 6.0,
              y: 1.5,
              w: 3.5,   
              h: 3.5,   
            });
          }
        }
      }
    }

    // 🎨 Closing
    let closing = pptx.addSlide();
    closing.background = { color: "1F497D" };
    closing.addText("Terima kasih 🙏", {
      x: 2,
      y: 2.5,
      fontSize: 32,
      bold: true,
      color: "FFFFFF",
    });

    const buffer = await pptx.write("nodebuffer");
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename="${content.title || "Presentasi"}.pptx"`,
      },
    });
  } catch (err: any) {
    console.error("💥 ERROR generate-ppt:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
