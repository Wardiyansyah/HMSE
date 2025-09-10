'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useAppStore } from '@/lib/store';
import { NavigationHeader } from '@/components/navigation-header-student';
import { searchYouTubeVideos, type YouTubeVideo, type SearchParams } from '@/lib/youtube-api';
import {
  RefreshCw,
  Sparkles,
  BookOpen,
  HelpCircle,
  Video,
  PresentationIcon as PresentationChart,
  Brain,
  Download,
  Share2,
  Eye,
  Clock,
  Users,
  Target,
  Lightbulb,
  Zap,
  Star,
  ArrowRight,
  CheckCircle,
  Play,
  ExternalLink,
  Youtube,
  Settings,
  AlertCircle,
} from 'lucide-react';

interface GeneratedContent {
  type: 'presentation' | 'quiz' | 'material' | 'video' | 'package';
  title: string;
  content: any;
  timestamp: Date;
  status: 'generating' | 'completed' | 'error';
  progress: number;
  youtubeVideos?: YouTubeVideo[];
}

interface ContentType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
  estimatedTime: string;
}

const contentTypes: ContentType[] = [
  {
    id: 'presentation',
    title: 'Presentasi',
    description: 'Slide PowerPoint interaktif',
    icon: <PresentationChart className="h-6 w-6" />,
    color: 'from-blue-500 to-cyan-500',
    features: ['10-15 Slide', 'Animasi Menarik', 'Template Modern'],
    estimatedTime: '2-3 menit',
  },
  {
    id: 'video',
    title: 'Video Pembelajaran',
    description: 'Video edukatif dari YouTube',
    icon: <Video className="h-6 w-6" />,
    color: 'from-red-500 to-pink-500',
    features: ['Video Berkualitas Tinggi', 'Dari Channel Terpercaya', 'Durasi Optimal', 'Subtitle Indonesia'],
    estimatedTime: '3-5 menit',
  },
  {
    id: 'quiz',
    title: 'Kuis Interaktif',
    description: 'Soal pilihan ganda + essay',
    icon: <HelpCircle className="h-6 w-6" />,
    color: 'from-orange-500 to-red-500',
    features: ['10-20 Soal', 'Pembahasan Lengkap', 'Skor Otomatis'],
    estimatedTime: '1-2 menit',
  },
  // {
  //   id: 'material',
  //   title: 'Materi Bacaan',
  //   description: 'Dokumen pembelajaran lengkap',
  //   icon: <BookOpen className="h-6 w-6" />,
  //   color: 'from-indigo-500 to-purple-500',
  //   features: ['Format PDF', 'Ilustrasi', 'Ringkasan'],
  //   estimatedTime: '2-4 menit',
  // },
];

const subjects = [
  { value: 'matematika', label: 'Matematika', icon: '🔢' },
  { value: 'fisika', label: 'Fisika', icon: '⚛️' },
  { value: 'kimia', label: 'Kimia', icon: '🧪' },
  { value: 'biologi', label: 'Biologi', icon: '🧬' },
  { value: 'sejarah', label: 'Sejarah', icon: '📜' },
  { value: 'geografi', label: 'Geografi', icon: '🌍' },
  { value: 'bahasa-indonesia', label: 'Bahasa Indonesia', icon: '📚' },
  { value: 'bahasa-inggris', label: 'Bahasa Inggris', icon: '🇺🇸' },
  { value: 'ekonomi', label: 'Ekonomi', icon: '💰' },
  { value: 'sosiologi', label: 'Sosiologi', icon: '👥' },
];

const educationLevels = [
  { value: 'sd', label: 'Sekolah Dasar', description: 'Kelas 1-6', icon: '🎒' },
  { value: 'smp', label: 'SMP', description: 'Kelas 7-9', icon: '📖' },
  { value: 'sma', label: 'SMA', description: 'Kelas 10-12', icon: '🎓' },
];

function ApiKeySetup({ onClose }: { onClose: () => void }) {
  const [tempApiKey, setTempApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleValidateKey = async () => {
    if (!tempApiKey.trim()) return;

    setIsValidating(true);
    try {
      if (tempApiKey.startsWith('sk-') && tempApiKey.length > 20) {
        sessionStorage.setItem('temp_openai_key', tempApiKey);
        onClose();
        window.location.reload();
      } else {
        alert("Format API key tidak valid. Pastikan dimulai dengan 'sk-' dan memiliki panjang yang sesuai.");
      }
    } catch (error) {
      alert('Terjadi kesalahan saat memvalidasi API key.');
    }
    setIsValidating(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <span>Setup API Key</span>
          </CardTitle>
          <CardDescription>Masukkan OpenAI API Key untuk mengaktifkan AI Content Generator</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">📋 Cara mendapatkan API Key:</h4>
            <ol className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-decimal list-inside">
              <li>
                Kunjungi{' '}
                <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline font-medium">
                  platform.openai.com/api-keys
                </a>
              </li>
              <li>Login atau daftar akun OpenAI</li>
              <li>Klik "Create new secret key"</li>
              <li>Salin API key yang dibuat</li>
              <li>Paste di kolom di bawah ini</li>
            </ol>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apikey">OpenAI API Key</Label>
            <Input id="apikey" type="password" placeholder="sk-..." value={tempApiKey} onChange={(e) => setTempApiKey(e.target.value)} className="font-mono text-sm" />
          </div>

          <div className="flex space-x-2">
            <Button onClick={handleValidateKey} disabled={!tempApiKey.trim() || isValidating} className="flex-1">
              {isValidating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Gunakan API Key
                </>
              )}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Nanti
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ContentGenerator() {
  const { user, startSession, endSession } = useAppStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isSearchingVideos, setIsSearchingVideos] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API Key management
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showApiKeySetup, setShowApiKeySetup] = useState(false);

  // Form states
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('');
  const [contentType, setContentType] = useState('');
  const [additionalInstructions, setAdditionalInstructions] = useState('');

  useEffect(() => {
    startSession('Content Generator', 'AI Content Creation');

    // Check for API key
    const envApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    const sessionApiKey = typeof window !== 'undefined' ? sessionStorage.getItem('temp_openai_key') : null;

    const currentApiKey = envApiKey || sessionApiKey;
    setApiKey(currentApiKey);

    if (!currentApiKey) {
      setShowApiKeySetup(true);
    }

    return () => endSession();
  }, [startSession, endSession]);

  const generateWithOpenAI = async (systemPrompt: string, userPrompt: string): Promise<string> => {
    if (!apiKey) {
      throw new Error('API key tidak tersedia');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      if (response.status === 401) {
        throw new Error('API key tidak valid. Silakan periksa kembali API key Anda.');
      } else if (response.status === 429) {
        throw new Error('Rate limit terlampaui. Silakan coba lagi dalam beberapa saat.');
      } else if (response.status === 402) {
        throw new Error('Quota tidak mencukupi. Silakan tambahkan billing di akun OpenAI Anda.');
      } else {
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Tidak ada respons dari AI';
  };

  const searchYouTubeContent = async (): Promise<YouTubeVideo[]> => {
    if (!topic.trim() || !subject || !level) return [];

    setIsSearchingVideos(true);
    try {
      const searchParams: SearchParams = {
        category: subject,
        level: level,
        topic: topic,
        maxResults: 5,
      };

      const videos = await searchYouTubeVideos(searchParams);
      return videos;
    } catch (error) {
      console.error('Error searching YouTube videos:', error);
      return [];
    } finally {
      setIsSearchingVideos(false);
    }
  };


  function cleanJSONResponse(responseText) {
    return responseText
      .replace(/^```json\s*/i, "") // remove starting ```json
      .replace(/^```\s*/i, "")     // in case it's just ``` without json
      .replace(/\s*```$/i, "")     // remove ending ```
      .trim();
  }

  const generateAIContent = async (): Promise<any> => {
    if (!apiKey) {
      throw new Error('API key tidak tersedia');
    }

    let systemPrompt = '';
    let userPrompt = '';

    switch (contentType) {
      case 'presentation':
        systemPrompt = `Anda adalah AI Content Generator untuk Insan AI yang ahli dalam membuat presentasi pembelajaran.

Tugas Anda adalah membuat presentasi pembelajaran yang komprehensif dalam format JSON dengan struktur berikut:

{
  "title": "Judul Presentasi",
  "description": "Deskripsi singkat",
  "slides": [
    {
      "slideNumber": 1,
      "title": "Judul Slide",
      "content": "Konten utama slide",
      "bulletPoints": ["Poin 1", "Poin 2", "Poin 3"],
      "notes": "Catatan untuk presenter"
    }
  ],
  "totalSlides": 10,
  "learningObjectives": ["Objektif 1", "Objektif 2"],
  "keyTakeaways": ["Takeaway 1", "Takeaway 2"]
}

PEDOMAN:
- Buat 8-12 slide yang logis dan berurutan
- Gunakan bahasa Indonesia yang mudah dipahami
- Sesuaikan dengan level pendidikan yang diminta
- Sertakan contoh praktis dan relevan
- Berikan catatan presenter yang membantu
- Fokus pada pembelajaran yang efektif
- WAJIB berikan output dalam format JSON yang valid`;

        userPrompt = `Buatkan presentasi pembelajaran tentang "${topic}" untuk mata pelajaran ${subject} tingkat ${level}. 
        ${additionalInstructions ? `Catatan tambahan: ${additionalInstructions}` : ''}
        
        Berikan output dalam format JSON yang valid.`;
        break;

      case 'quiz':
        systemPrompt = `Anda adalah AI Content Generator untuk Insan AI yang ahli dalam membuat kuis pembelajaran.

Tugas Anda adalah membuat kuis dalam format JSON dengan struktur berikut:

{
  "title": "Judul Kuis",
  "description": "Deskripsi kuis",
  "questions": [
    {
      "questionNumber": 1,
      "type": "multiple_choice",
      "question": "Pertanyaan?",
      "options": ["A. Opsi 1", "B. Opsi 2", "C. Opsi 3", "D. Opsi 4"],
      "correctAnswer": "A",
      "explanation": "Penjelasan jawaban yang benar"
    }
  ],
  "totalQuestions": 10,
  "difficulty": "medium"
}

PEDOMAN:
- Buat 8-12 pertanyaan yang bervariasi
- Gunakan berbagai jenis pertanyaan (pilihan ganda, benar/salah, isian)
- Berikan penjelasan untuk setiap jawaban
- Sesuaikan tingkat kesulitan dengan level siswa
- Fokus pada pemahaman konsep, bukan hafalan
- WAJIB berikan output dalam format JSON yang valid`;

        userPrompt = `Buatkan kuis tentang "${topic}" untuk mata pelajaran ${subject} tingkat ${level}.
        ${additionalInstructions ? `Catatan tambahan: ${additionalInstructions}` : ''}
        
        Berikan output dalam format JSON yang valid.`;
        break;

      case 'material':
        systemPrompt = `Anda adalah AI Content Generator untuk Insan AI yang ahli dalam membuat materi pembelajaran.

Tugas Anda adalah membuat materi pembelajaran komprehensif dalam format JSON:

{
  "title": "Judul Materi",
  "description": "Deskripsi materi",
  "sections": [
    {
      "sectionNumber": 1,
      "title": "Judul Bagian",
      "content": "Konten lengkap bagian",
      "examples": ["Contoh 1", "Contoh 2"],
      "keyPoints": ["Poin penting 1", "Poin penting 2"]
    }
  ],
  "summary": "Ringkasan materi",
  "additionalResources": ["Resource 1", "Resource 2"],
  "practiceExercises": ["Latihan 1", "Latihan 2"]
}

PEDOMAN:
- Buat 4-6 bagian yang logis dan berurutan
- Gunakan bahasa yang mudah dipahami
- Sertakan contoh praktis dan relevan
- Berikan ringkasan yang komprehensif
- Tambahkan latihan untuk pemahaman
- WAJIB berikan output dalam format JSON yang valid`;

        userPrompt = `Buatkan materi pembelajaran tentang "${topic}" untuk mata pelajaran ${subject} tingkat ${level}.
        ${additionalInstructions ? `Catatan tambahan: ${additionalInstructions}` : ''}
        
        Berikan output dalam format JSON yang valid.`;
        break;

      default:
        // For video and package, create a general content structure
        systemPrompt = `Anda adalah AI Content Generator untuk EduGenAI yang ahli dalam membuat konten pembelajaran.

Buatkan struktur konten pembelajaran dalam format JSON:

{
  "title": "Judul Konten",
  "description": "Deskripsi konten",
  "learningObjectives": ["Objektif 1", "Objektif 2"],
  "keyTopics": ["Topik 1", "Topik 2"],
  "summary": "Ringkasan pembelajaran"
}

PEDOMAN:
- Sesuaikan dengan level pendidikan
- Gunakan bahasa yang mudah dipahami
- Fokus pada tujuan pembelajaran yang jelas
- WAJIB berikan output dalam format JSON yang valid`;

        userPrompt = `Buatkan struktur konten pembelajaran tentang "${topic}" untuk mata pelajaran ${subject} tingkat ${level}.
        ${additionalInstructions ? `Catatan tambahan: ${additionalInstructions}` : ''}
        
        Berikan output dalam format JSON yang valid.`;
    }

    const result = await generateWithOpenAI(systemPrompt, userPrompt);

    return JSON.parse(cleanJSONResponse(result));
  };

  const simulateGeneration = async () => {
    if (!topic.trim() || !subject || !level || !contentType) return;

    if (!apiKey) {
      setShowApiKeySetup(true);
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setError(null);

    try {
      // Step 1: Initial setup
      await new Promise((resolve) => setTimeout(resolve, 800));
      setGenerationProgress(20);

      // Step 2: Search YouTube videos if content type is video or package
      let youtubeVideos: YouTubeVideo[] = [];
      if (contentType === 'video' || contentType === 'package') {
        setGenerationProgress(40);
        youtubeVideos = await searchYouTubeContent();
        setGenerationProgress(60);
      } else {
        setGenerationProgress(60);
      }

      // Step 3: Generate AI content
      setGenerationProgress(70);
      const aiContent = await generateAIContent();
      setGenerationProgress(90);

      // Step 4: Finalize
      await new Promise((resolve) => setTimeout(resolve, 500));
      setGenerationProgress(100);

      // Create final content
      const newContent: GeneratedContent = {
        type: contentType as any,
        title: aiContent.title || `${getContentTypeTitle(contentType)}: ${topic}`,
        content: {
          ...aiContent,
          estimatedTime: contentTypes.find((ct) => ct.id === contentType)?.estimatedTime || '3-5 menit',
          features: contentTypes.find((ct) => ct.id === contentType)?.features || [],
          videoCount: youtubeVideos.length,
          totalDuration: youtubeVideos.reduce((total, video) => {
            const duration = video.duration.split(':');
            return total + Number.parseInt(duration[0]) * 60 + Number.parseInt(duration[1]);
          }, 0),
          channels: [...new Set(youtubeVideos.map((v) => v.channelTitle))],
        },
        timestamp: new Date(),
        status: 'completed',
        progress: 100,
        youtubeVideos: youtubeVideos.length > 0 ? youtubeVideos : undefined,
      };

      setGeneratedContent((prev) => [newContent, ...prev]);
    } catch (error: any) {
      console.error('Error generating content:', error);
      setError(error.message || 'Terjadi kesalahan saat membuat konten');
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const getContentTypeTitle = (type: string) => {
    const contentType = contentTypes.find((ct) => ct.id === type);
    return contentType?.title || 'Konten';
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      simulateGeneration();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return subject && level;
      case 2:
        return topic.trim();
      case 3:
        return contentType;
      default:
        return false;
    }
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}j ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
      <NavigationHeader />
      {showApiKeySetup && <ApiKeySetup onClose={() => setShowApiKeySetup(false)} />}

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10" />
        <div className="relative container mx-auto px-4 py-12">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Brain className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">Powered by Advanced AI</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">AI Content Generator</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">Buat materi pembelajaran berkualitas tinggi dalam hitungan menit dengan teknologi AI terdepan</p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 px-4 py-2">
                <Zap className="h-4 w-4 mr-2" />
                10x Lebih Cepat
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-4 py-2">
                <Star className="h-4 w-4 mr-2" />
                Kualitas Profesional
              </Badge>
              <Badge variant="secondary" className="bg-green-100 text-green-800 px-4 py-2">
                <Target className="h-4 w-4 mr-2" />
                Disesuaikan Kebutuhan
              </Badge>
              <Badge variant="secondary" className="bg-red-100 text-red-800 px-4 py-2">
                <Youtube className="h-4 w-4 mr-2" />
                Integrasi YouTube
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-10 pb-12">
        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20 max-w-4xl mx-auto">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-red-800 dark:text-red-300">
                <AlertCircle className="h-5 w-5" />
                <p className="font-medium">Error:</p>
                <p>{error}</p>
              </div>
              <Button variant="outline" size="sm" className="mt-2 bg-transparent" onClick={() => setError(null)}>
                Tutup
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    currentStep >= step ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  }`}
                >
                  {currentStep > step ? <CheckCircle className="h-6 w-6" /> : step}
                </div>
                {step < 3 && <div className={`h-1 w-24 md:w-32 mx-4 transition-all duration-300 ${currentStep > step ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-gray-200 dark:bg-gray-700'}`} />}
              </div>
            ))}
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {currentStep === 1 && 'Pilih Mata Pelajaran & Level'}
              {currentStep === 2 && 'Tentukan Topik Pembelajaran'}
              {currentStep === 3 && 'Pilih Jenis Konten'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {currentStep === 1 && 'Mulai dengan memilih mata pelajaran dan tingkat pendidikan'}
              {currentStep === 2 && 'Masukkan topik spesifik yang ingin Anda buat'}
              {currentStep === 3 && 'Pilih format konten yang diinginkan'}
            </p>
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-6xl mx-auto">
          {/* Step 1: Subject & Level */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-6 w-6 text-purple-600" />
                    <span>Mata Pelajaran</span>
                  </CardTitle>
                  <CardDescription>Pilih mata pelajaran yang ingin Anda buat kontennya</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {subjects.map((subj) => (
                      <Button
                        key={subj.value}
                        variant={subject === subj.value ? 'default' : 'outline'}
                        className={`h-20 flex-col space-y-2 transition-all duration-300 ${subject === subj.value ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg scale-105' : 'hover:scale-105 hover:shadow-md'}`}
                        onClick={() => setSubject(subj.value)}
                      >
                        <span className="text-2xl">{subj.icon}</span>
                        <span className="text-xs font-medium">{subj.label}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-6 w-6 text-blue-600" />
                    <span>Tingkat Pendidikan</span>
                  </CardTitle>
                  <CardDescription>Pilih tingkat pendidikan target audiens</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {educationLevels.map((lvl) => (
                      <Button
                        key={lvl.value}
                        variant={level === lvl.value ? 'default' : 'outline'}
                        className={`h-24 flex-col space-y-2 transition-all duration-300 ${level === lvl.value ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg scale-105' : 'hover:scale-105 hover:shadow-md'}`}
                        onClick={() => setLevel(lvl.value)}
                      >
                        <span className="text-2xl">{lvl.icon}</span>
                        <div className="text-center">
                          <div className="font-medium text-sm">{lvl.label}</div>
                          <div className="text-xs opacity-70">{lvl.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Topic */}
          {currentStep === 2 && (
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm max-w-2xl mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center space-x-2">
                  <Lightbulb className="h-6 w-6 text-yellow-500" />
                  <span>Topik Pembelajaran</span>
                </CardTitle>
                <CardDescription>Masukkan topik spesifik yang ingin Anda buat kontennya</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="topic" className="text-lg font-medium">
                    Topik
                  </Label>
                  <Input id="topic" placeholder="Contoh: Fotosintesis, Hukum Newton, Sejarah Kemerdekaan..." value={topic} onChange={(e) => setTopic(e.target.value)} className="h-14 text-lg" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions" className="text-lg font-medium">
                    Instruksi Tambahan (Opsional)
                  </Label>
                  <Textarea
                    id="instructions"
                    placeholder="Contoh: Fokus pada contoh praktis, gunakan bahasa sederhana, sertakan gambar ilustrasi..."
                    value={additionalInstructions}
                    onChange={(e) => setAdditionalInstructions(e.target.value)}
                    rows={4}
                    className="text-base"
                  />
                </div>

                {subject && level && (
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="font-medium">Pengaturan Anda:</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p>
                        <strong>Mata Pelajaran:</strong> {subjects.find((s) => s.value === subject)?.label}
                      </p>
                      <p>
                        <strong>Tingkat:</strong> {educationLevels.find((l) => l.value === level)?.label}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 3: Content Type */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h3 className="text-xl font-semibold mb-2">Pilih Jenis Konten</h3>
                <p className="text-gray-600 dark:text-gray-400">Setiap jenis konten memiliki keunggulan dan fitur yang berbeda</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contentTypes.map((type) => (
                  <Card
                    key={type.id}
                    className={`cursor-pointer transition-all duration-300 border-2 hover:shadow-xl hover:scale-105 ${
                      contentType === type.id ? 'border-purple-500 shadow-xl scale-105 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                    }`}
                    onClick={() => setContentType(type.id)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${type.color}`}>
                          <div className="text-white">{type.icon}</div>
                        </div>
                        {contentType === type.id && <CheckCircle className="h-6 w-6 text-green-500" />}
                      </div>
                      <CardTitle className="text-xl">{type.title}</CardTitle>
                      <CardDescription className="text-base">{type.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="h-4 w-4" />
                          <span>Estimasi: {type.estimatedTime}</span>
                        </div>
                        <div className="space-y-2">
                          <p className="font-medium text-sm">Fitur:</p>
                          <ul className="space-y-1">
                            {type.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center space-x-2 text-sm">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        {(type.id === 'video' || type.id === 'package') && (
                          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-700">
                            <div className="flex items-center space-x-2 text-red-800 dark:text-red-300">
                              <Youtube className="h-4 w-4" />
                              <span className="text-xs font-medium">Otomatis mencari video YouTube terkait</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Generation Progress */}
          {isGenerating && (
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm max-w-2xl mx-auto">
              <CardContent className="pt-6">
                <div className="text-center space-y-6">
                  <div className="relative">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      <Brain className="h-10 w-10 text-white animate-pulse" />
                    </div>
                    <div className="absolute inset-0 rounded-full border-4 border-purple-200 animate-ping" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">AI Sedang Bekerja...</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Membuat {getContentTypeTitle(contentType).toLowerCase()} untuk "{topic}"
                    </p>
                    {(contentType === 'video' || contentType === 'package') && isSearchingVideos && (
                      <div className="flex items-center justify-center space-x-2 text-red-600 dark:text-red-400 mb-2">
                        <Youtube className="h-4 w-4 animate-pulse" />
                        <span className="text-sm">Mencari video YouTube terkait...</span>
                      </div>
                    )}
                    <Progress value={generationProgress} className="w-full h-3" />
                    <p className="text-sm text-gray-500 mt-2">{generationProgress}% selesai</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Generated Content */}
          {generatedContent.length > 0 && !isGenerating && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Konten Berhasil Dibuat! 🎉</h3>
                <p className="text-gray-600 dark:text-gray-400">Konten pembelajaran Anda siap digunakan</p>
              </div>

              <div className="grid gap-6">
                {generatedContent.map((content, index) => (
                  <Card key={index} className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xl">{content.title}</CardTitle>
                          <CardDescription>{content.content.description}</CardDescription>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Selesai</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Content Features */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {content.content.features?.map((feature: string, idx: number) => (
                            <div key={idx} className="flex items-center space-x-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>

                        {/* Video Content Stats */}
                        {(content.type === 'video' || content.type === 'package') && content.youtubeVideos && (
                          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-700">
                            <div className="flex items-center space-x-2 mb-3">
                              <Youtube className="h-5 w-5 text-red-600" />
                              <h4 className="font-semibold text-red-800 dark:text-red-300">Video Pembelajaran Ditemukan</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div className="flex items-center space-x-2">
                                <Video className="h-4 w-4 text-red-500" />
                                <span>{content.youtubeVideos.length} video berkualitas</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-red-500" />
                                <span>Total durasi: {formatDuration(content.content.totalDuration || 0)}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4 text-red-500" />
                                <span>{content.content.channels?.length || 0} channel terpercaya</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* YouTube Videos List */}
                        {content.youtubeVideos && content.youtubeVideos.length > 0 && (
                          <div className="space-y-4">
                            <h4 className="font-semibold text-lg flex items-center space-x-2">
                              <Youtube className="h-5 w-5 text-red-600" />
                              <span>Video Pembelajaran Terpilih</span>
                            </h4>
                            <div className="grid gap-4">
                              {content.youtubeVideos.map((video, videoIndex) => (
                                <div key={videoIndex} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                  <div className="flex space-x-4">
                                    <div className="relative flex-shrink-0">
                                      <img src={video.thumbnail || '/placeholder.svg'} alt={video.title} className="w-32 h-20 object-cover rounded-lg" />
                                      <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-black/70 rounded-full p-2">
                                          <Play className="h-4 w-4 text-white" />
                                        </div>
                                      </div>
                                      <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">{video.duration}</div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h5 className="font-medium text-sm mb-1 line-clamp-2">{video.title}</h5>
                                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{video.description}</p>
                                      <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>{video.channelTitle}</span>
                                        <span>{video.viewCount} views</span>
                                      </div>
                                    </div>
                                    <div className="flex flex-col space-y-2">
                                      <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent" onClick={() => window.open(video.url, '_blank')}>
                                        <ExternalLink className="h-3 w-3 mr-1" />
                                        Tonton
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <Clock className="h-4 w-4" />
                          <span>Waktu pembuatan: {content.content.estimatedTime}</span>
                        </div>
                        <div className="flex space-x-3 pt-4">
                          <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                            <Eye className="h-4 w-4 mr-2" />
                            Lihat Konten
                          </Button>
                          <Button
                            variant="outline"
                            onClick={async () => {
                              const res = await fetch("/api/generate-ppt", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ content: content.content }),
                              });
                              const blob = await res.blob();
                              const url = window.URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = `${content.title}.pptx`;
                              document.body.appendChild(a);
                              a.click();
                              a.remove();
                            }}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button variant="outline">
                            <Share2 className="h-4 w-4 mr-2" />
                            Bagikan
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          {!isGenerating && generatedContent.length === 0 && (
            <div className="flex justify-between items-center max-w-2xl mx-auto mt-12">
              <Button variant="outline" onClick={handleBack} disabled={currentStep === 1} className="px-8 py-3 bg-transparent">
                Kembali
              </Button>
              <div className="flex space-x-3">
                {!apiKey && (
                  <Button variant="outline" onClick={() => setShowApiKeySetup(true)} className="px-6 py-3">
                    <Settings className="h-4 w-4 mr-2" />
                    Setup API Key
                  </Button>
                )}
                <Button onClick={handleNext} disabled={!canProceed() || !apiKey} className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                  {currentStep === 3 ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Konten
                    </>
                  ) : (
                    <>
                      Lanjutkan
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Reset Button */}
          {generatedContent.length > 0 && !isGenerating && (
            <div className="text-center mt-12">
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentStep(1);
                  setGeneratedContent([]);
                  setSubject('');
                  setTopic('');
                  setLevel('');
                  setContentType('');
                  setAdditionalInstructions('');
                  setError(null);
                }}
                className="px-8 py-3"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Buat Konten Baru
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
