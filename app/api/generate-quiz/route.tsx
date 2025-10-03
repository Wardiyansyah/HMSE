import { NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import { addClickPoints } from '@/lib/insanai-points';

// Helper untuk tulis teks panjang dengan auto wrap + page break
function addWrappedText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  pageHeight: number
) {
  const split = doc.splitTextToSize(text, maxWidth);

  split.forEach((line: string) => {
    if (y > pageHeight - 20) {
      doc.addPage();
      y = 20; // reset margin atas
    }
    doc.text(line, x, y);
    y += lineHeight;
  });

  return y;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, profileId } = body;

    const doc = new jsPDF();
    let y = 20;

    doc.setFont("helvetica", "normal");

    // Judul
    doc.setFontSize(16);
    y = addWrappedText(doc, content.title || "Kuis Pembelajaran", 20, y, 170, 8, 280);
    y += 6;

    // Deskripsi
    doc.setFontSize(12);
    if (content.description) {
      y = addWrappedText(doc, content.description, 20, y, 170, 6, 280);
      y += 6;
    }

    // Soal
    content.questions.forEach((q: any, idx: number) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(12);

      // Pertanyaan
      y = addWrappedText(doc, `${q.number}. ${q.question}`, 20, y, 170, 6, 280);
      y += 2;

      // === Multiple Choice ===
      if (q.type === "multiple_choice" && q.options) {
        q.options.forEach((opt: string) => {
          y = addWrappedText(doc, opt, 25, y, 160, 6, 280);
        });
        y += 2;
        y = addWrappedText(doc, `Jawaban: ${q.answer || ""}`, 25, y, 160, 6, 280);
        y += 2;
      }

      // === Short Answer ===
      else if (q.type === "short_answer") {
        y = addWrappedText(doc, "Jawaban singkat: ", 25, y, 160, 6, 280);
        y += 2;
        if (q.answer) {
          y = addWrappedText(doc, `Kunci Jawaban: ${q.answer}`, 25, y, 160, 6, 280);
          y += 2;
        }
      }

      // === Essay ===
      else if (q.type === "essay") {
        y = addWrappedText(doc, "Jawaban esai:", 25, y, 160, 6, 280);
        y += 60; 
      }

      // Penjelasan (opsional)
      if (q.explanation) {
        y = addWrappedText(doc, `Penjelasan: ${q.explanation}`, 25, y, 160, 6, 280);
        y += 4;
      }

      y += 4; // spasi antar soal
    });

    const pdfBytes = doc.output("arraybuffer");

    // award points for quiz generation
    if (profileId) {
      try { await addClickPoints(profileId, 3); } catch (e) { console.error('points error', e); }
    }

    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="quiz.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("Error generate PDF:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
