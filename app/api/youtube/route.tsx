import { NextResponse } from "next/server";
import { addClickPoints } from '@/lib/insanai-points';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const maxResults = searchParams.get("maxResults") || "10";
  const profileId = searchParams.get('profileId') || null;

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${q}&maxResults=${maxResults}&key=${process.env.YOUTUBE_API_KEY}`
    );
    const data = await response.json();

    // award small point for using youtube helper
    if (profileId) {
      try { await addClickPoints(profileId, 1); } catch (e) { console.error('points error', e); }
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch YouTube API" }, { status: 500 });
  }
}
