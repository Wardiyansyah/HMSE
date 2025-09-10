import { NextResponse } from "next/server";
import PptxGenJS from "pptxgenjs";

export async function POST(req: Request) {
  const { content } = await req.json();

  const pptx = new PptxGenJS();

  // cover
  let cover = pptx.addSlide();
  cover.addText(content.title || "Judul", { x:1, y:2, fontSize:32, bold:true });

  // isi
  if (content.slides) {
    content.slides.forEach((slide: any) => {
      let s = pptx.addSlide();
      s.addText(slide.title, { x:0.5, y:0.5, fontSize:28, bold:true });
      slide.bulletPoints?.forEach((point: string, i: number) => {
        s.addText(`• ${point}`, { x:1, y:1.5 + i*0.5, fontSize:18 });
      });
    });
  }

  // closing
  let closing = pptx.addSlide();
  closing.addText("Terima kasih 🙏", { x:2, y:2.5, fontSize:30, bold:true });

  const buffer = await pptx.write("nodebuffer");

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "Content-Disposition": `attachment; filename="${content.title || "Presentasi"}.pptx"`
    }
  });
}
