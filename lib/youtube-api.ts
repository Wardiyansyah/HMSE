export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  url: string;
}

export async function searchYouTubeVideos({
  category,
  level,
  topic,
  maxResults = 12,
}: {
  category: string;
  level?: string;
  topic: string;
  maxResults?: number;
}): Promise<YouTubeVideo[]> {
  const query = `${topic} ${category} ${level || ""} pembelajaran`;

  const res = await fetch(`/api/youtube?q=${encodeURIComponent(query)}&maxResults=${maxResults}`);
  const data = await res.json();

  if (!data.items) return [];

  return data.items.map((item: any) => ({
    id: item.id.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail: item.snippet.thumbnails.medium.url,
    channelTitle: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
    url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
  }));
}
