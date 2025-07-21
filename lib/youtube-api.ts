// YouTube API integration for educational content
export interface YouTubeVideo {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: string
  channelTitle: string
  publishedAt: string
  viewCount: string
  url: string
}

export interface SearchParams {
  category: string
  level: string
  topic: string
  maxResults?: number
}

// Educational channels mapping for better content quality
const EDUCATIONAL_CHANNELS = {
  matematika: [
    "UCqiLkFdpJrfnGBuLWnKnlhA", // Khan Academy Indonesia
    "UCWnPjmqvljcafA0z2U1fwKQ", // Matematika Hebat
    "UC-bFgwL_kFKLZA60AiB-CCQ", // Ruangguru
  ],
  fisika: [
    "UCqiLkFdpJrfnGBuLWnKnlhA", // Khan Academy Indonesia
    "UC-bFgwL_kFKLZA60AiB-CCQ", // Ruangguru
    "UCsooa4yRKGN_zEE8iknghZA", // TED-Ed
  ],
  kimia: [
    "UCqiLkFdpJrfnGBuLWnKnlhA", // Khan Academy Indonesia
    "UC-bFgwL_kFKLZA60AiB-CCQ", // Ruangguru
    "UCEWpbFLzoYGPfuWUMFPSaoA", // Crash Course
  ],
  biologi: [
    "UCqiLkFdpJrfnGBuLWnKnlhA", // Khan Academy Indonesia
    "UC-bFgwL_kFKLZA60AiB-CCQ", // Ruangguru
    "UCEWpbFLzoYGPfuWUMFPSaoA", // Crash Course
  ],
  bahasa: [
    "UC-bFgwL_kFKLZA60AiB-CCQ", // Ruangguru
    "UCqiLkFdpJrfnGBuLWnKnlhA", // Khan Academy Indonesia
  ],
  sejarah: [
    "UC-bFgwL_kFKLZA60AiB-CCQ", // Ruangguru
    "UCsooa4yRKGN_zEE8iknghZA", // TED-Ed
    "UCX6b17PVsYBQ0ip5gyeme-Q", // CrashCourse
  ],
  geografi: [
    "UC-bFgwL_kFKLZA60AiB-CCQ", // Ruangguru
    "UCqiLkFdpJrfnGBuLWnKnlhA", // Khan Academy Indonesia
  ],
}

// Level-specific search terms
const LEVEL_KEYWORDS = {
  sd: ["dasar", "anak", "mudah", "pengenalan", "belajar", "SD"],
  smp: ["menengah", "SMP", "kelas 7", "kelas 8", "kelas 9"],
  sma: ["lanjutan", "SMA", "kelas 10", "kelas 11", "kelas 12", "UTBK"],
  kuliah: ["universitas", "mahasiswa", "advanced", "tingkat lanjut"],
  profesional: ["professional", "kerja", "karir", "industri"],
}

// Mock YouTube API response for development
// In production, replace with actual YouTube Data API calls
export async function searchYouTubeVideos(params: SearchParams): Promise<YouTubeVideo[]> {
  const { category, level, topic, maxResults = 5 } = params

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Generate search query
  const levelKeywords = LEVEL_KEYWORDS[level as keyof typeof LEVEL_KEYWORDS] || []
  const searchQuery = `${topic} ${category} ${levelKeywords[0]} pembelajaran`

  // Mock data based on category and level
  const mockVideos: YouTubeVideo[] = generateMockVideos(category, level, topic, maxResults)

  return mockVideos
}

function generateMockVideos(category: string, level: string, topic: string, count: number): YouTubeVideo[] {
  const videos: YouTubeVideo[] = []

  const channelNames = {
    matematika: ["Khan Academy Indonesia", "Matematika Hebat", "Ruangguru"],
    fisika: ["Fisika Asik", "Ruangguru", "Khan Academy Indonesia"],
    kimia: ["Kimia Mudah", "Ruangguru", "Crash Course Indonesia"],
    biologi: ["Biologi Seru", "Ruangguru", "Khan Academy Indonesia"],
    bahasa: ["Bahasa Indonesia Kita", "Ruangguru", "Belajar Bahasa"],
    sejarah: ["Sejarah Nusantara", "Historia", "Ruangguru"],
    geografi: ["Geografi Indonesia", "Ruangguru", "Bumi Kita"],
  }

  const durations = ["8:45", "12:30", "15:20", "6:15", "18:45", "10:30"]
  const viewCounts = ["125K", "89K", "234K", "67K", "156K", "98K"]

  for (let i = 0; i < count; i++) {
    const videoId = `video_${category}_${level}_${i + 1}`
    const channels = channelNames[category as keyof typeof channelNames] || ["Ruangguru"]
    const channel = channels[i % channels.length]

    videos.push({
      id: videoId,
      title: generateVideoTitle(topic, category, level, i),
      description: `Video pembelajaran ${topic} untuk tingkat ${level.toUpperCase()}. Materi dijelaskan dengan mudah dan menarik.`,
      thumbnail: `/placeholder.svg?height=180&width=320&text=${encodeURIComponent(topic)}`,
      duration: durations[i % durations.length],
      channelTitle: channel,
      publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      viewCount: viewCounts[i % viewCounts.length],
      url: `https://www.youtube.com/watch?v=${videoId}`,
    })
  }

  return videos
}

function generateVideoTitle(topic: string, category: string, level: string, index: number): string {
  const titleTemplates = {
    sd: [
      `Belajar ${topic} untuk Anak SD - Mudah dan Menyenangkan`,
      `${topic} Dasar - Penjelasan Sederhana untuk SD`,
      `Mengenal ${topic} - Video Pembelajaran SD`,
      `${topic} untuk Pemula - Kelas SD`,
      `Cara Mudah Memahami ${topic} - Tingkat SD`,
    ],
    smp: [
      `${topic} SMP - Penjelasan Lengkap dan Mudah`,
      `Materi ${topic} Kelas 7-9 SMP`,
      `${topic} untuk SMP - Tutorial Step by Step`,
      `Belajar ${topic} SMP dengan Contoh Soal`,
      `${topic} SMP - Konsep Dasar hingga Lanjutan`,
    ],
    sma: [
      `${topic} SMA - Persiapan UTBK dan UN`,
      `Materi ${topic} Kelas 10-12 SMA`,
      `${topic} SMA - Konsep Lanjutan dan Aplikasi`,
      `Tutorial ${topic} untuk SMA - Lengkap dengan Rumus`,
      `${topic} SMA - Pembahasan Soal dan Teori`,
    ],
    kuliah: [
      `${topic} Tingkat Universitas - Advanced Learning`,
      `${topic} untuk Mahasiswa - Konsep Mendalam`,
      `Advanced ${topic} - University Level`,
      `${topic} - Teori dan Aplikasi Tingkat Tinggi`,
      `${topic} untuk Perguruan Tinggi - Comprehensive Guide`,
    ],
    profesional: [
      `${topic} untuk Profesional - Aplikasi di Dunia Kerja`,
      `${topic} dalam Industri - Professional Development`,
      `Advanced ${topic} for Professionals`,
      `${topic} - Skill Development untuk Karir`,
      `Professional ${topic} - Industry Applications`,
    ],
  }

  const templates = titleTemplates[level as keyof typeof titleTemplates] || titleTemplates.sma
  return templates[index % templates.length]
}

// Real YouTube API implementation (commented for development)
/*
export async function searchYouTubeVideos(params: SearchParams): Promise<YouTubeVideo[]> {
  const { category, level, topic, maxResults = 5 } = params
  const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
  
  if (!API_KEY) {
    throw new Error('YouTube API key not configured')
  }
  
  const levelKeywords = LEVEL_KEYWORDS[level as keyof typeof LEVEL_KEYWORDS] || []
  const channels = EDUCATIONAL_CHANNELS[category as keyof typeof EDUCATIONAL_CHANNELS] || []
  
  const searchQuery = `${topic} ${category} ${levelKeywords[0]} pembelajaran`
  const channelFilter = channels.length > 0 ? `&channelId=${channels.join('|')}` : ''
  
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&maxResults=${maxResults}&key=${API_KEY}${channelFilter}&regionCode=ID&relevanceLanguage=id`
  
  try {
    const response = await fetch(url)
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'YouTube API error')
    }
    
    const videoIds = data.items.map((item: any) => item.id.videoId).join(',')
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds}&key=${API_KEY}`
    
    const detailsResponse = await fetch(detailsUrl)
    const detailsData = await detailsResponse.json()
    
    return data.items.map((item: any, index: number) => {
      const details = detailsData.items[index]
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium.url,
        duration: formatDuration(details.contentDetails.duration),
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        viewCount: formatViewCount(details.statistics.viewCount),
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`
      }
    })
  } catch (error) {
    console.error('YouTube API error:', error)
    throw error
  }
}

function formatDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
  if (!match) return '0:00'
  
  const hours = parseInt(match[1]?.replace('H', '') || '0')
  const minutes = parseInt(match[2]?.replace('M', '') || '0')
  const seconds = parseInt(match[3]?.replace('S', '') || '0')
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function formatViewCount(count: string): string {
  const num = parseInt(count)
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}
*/
