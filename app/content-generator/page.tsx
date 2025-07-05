"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NavigationHeader } from "@/components/navigation-header"
import {
  Brain,
  HelpCircle,
  Download,
  Share2,
  Sparkles,
  BookOpen,
  PresentationIcon as PresentationChart,
  PlayCircle,
} from "lucide-react"

export default function ContentGenerator() {
  const [topic, setTopic] = useState("")
  const [level, setLevel] = useState("")
  const [contentType, setContentType] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<any>(null)

  const handleGenerate = async () => {
    setIsGenerating(true)

    // Simulate AI content generation
    setTimeout(() => {
      setGeneratedContent({
        presentation: {
          title: `Presentasi: ${topic}`,
          slides: 12,
          duration: "15 menit",
          preview: "Slide 1: Pengertian, Slide 2: Proses, Slide 3: Faktor-faktor...",
        },
        video: {
          title: `Video Pembelajaran: ${topic}`,
          duration: "8 menit",
          format: "MP4",
          description: "Video animasi interaktif dengan narasi yang mudah dipahami",
        },
        quiz: {
          title: `Kuis: ${topic}`,
          questions: 10,
          types: ["Pilihan Ganda", "Isian Singkat", "Benar/Salah"],
          difficulty: level,
        },
      })
      setIsGenerating(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <NavigationHeader />

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Brain className="h-6 w-6 md:h-8 md:w-8 mr-2 md:mr-3 text-blue-600" />
            AI Content Generator
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Buat materi pembelajaran yang menarik dengan bantuan AI dalam hitungan detik
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Input Form */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  <span>Generator Settings</span>
                </CardTitle>
                <CardDescription className="text-sm">
                  Atur parameter untuk menghasilkan konten yang sesuai
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="topic">Topik Pembelajaran</Label>
                  <Input
                    id="topic"
                    placeholder="Contoh: Fotosintesis, Hukum Newton, dll."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="level">Level Pendidikan</Label>
                  <Select value={level} onValueChange={setLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sd">Sekolah Dasar (SD)</SelectItem>
                      <SelectItem value="smp">Sekolah Menengah Pertama (SMP)</SelectItem>
                      <SelectItem value="sma">Sekolah Menengah Atas (SMA)</SelectItem>
                      <SelectItem value="kuliah">Perguruan Tinggi</SelectItem>
                      <SelectItem value="profesional">Profesional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="content-type">Jenis Konten</Label>
                  <Select value={contentType} onValueChange={setContentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis konten" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="complete">Paket Lengkap (PPT + Video + Quiz)</SelectItem>
                      <SelectItem value="presentation">Presentasi Saja</SelectItem>
                      <SelectItem value="video">Video Pembelajaran</SelectItem>
                      <SelectItem value="quiz">Quiz & Assessment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="additional">Instruksi Tambahan (Opsional)</Label>
                  <Textarea
                    id="additional"
                    placeholder="Contoh: Fokus pada contoh praktis, gunakan gambar yang menarik..."
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={!topic || !level || !contentType || isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Brain className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Konten
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Quick Templates */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Template Cepat</CardTitle>
                <CardDescription className="text-sm">Gunakan template yang sudah siap pakai</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => {
                    setTopic("Fotosintesis")
                    setLevel("smp")
                    setContentType("complete")
                  }}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Fotosintesis (SMP)
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => {
                    setTopic("Hukum Newton")
                    setLevel("sma")
                    setContentType("complete")
                  }}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Hukum Newton (SMA)
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => {
                    setTopic("Pecahan")
                    setLevel("sd")
                    setContentType("complete")
                  }}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Pecahan (SD)
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Generated Content */}
          <div className="lg:col-span-2">
            {!generatedContent && !isGenerating && (
              <Card className="h-full flex items-center justify-center min-h-[400px]">
                <CardContent className="text-center py-12">
                  <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Siap Membuat Konten?</h3>
                  <p className="text-gray-500">Isi form di sebelah kiri dan klik "Generate Konten" untuk memulai</p>
                </CardContent>
              </Card>
            )}

            {isGenerating && (
              <Card className="h-full flex items-center justify-center min-h-[400px]">
                <CardContent className="text-center py-12">
                  <Brain className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-spin" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Sedang Bekerja...</h3>
                  <p className="text-gray-600 mb-4">Membuat konten pembelajaran untuk "{topic}"</p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <p>✓ Menganalisis topik dan level pendidikan</p>
                    <p>✓ Menyusun struktur pembelajaran</p>
                    <p>⏳ Menghasilkan konten multimedia...</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {generatedContent && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
                        Konten Berhasil Dibuat!
                      </span>
                      <Badge variant="secondary">
                        {topic} - {level?.toUpperCase()}
                      </Badge>
                    </CardTitle>
                    <CardDescription>AI telah menghasilkan materi pembelajaran lengkap untuk Anda</CardDescription>
                  </CardHeader>
                </Card>

                <Tabs defaultValue="presentation" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="presentation">Presentasi</TabsTrigger>
                    <TabsTrigger value="video">Video</TabsTrigger>
                    <TabsTrigger value="quiz">Quiz</TabsTrigger>
                  </TabsList>

                  <TabsContent value="presentation">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <PresentationChart className="h-5 w-5 mr-2 text-blue-600" />
                          {generatedContent.presentation.title}
                        </CardTitle>
                        <CardDescription>
                          Presentasi PowerPoint siap pakai dengan {generatedContent.presentation.slides} slide
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                          <h4 className="font-semibold mb-2">Preview Struktur:</h4>
                          <p className="text-sm text-gray-600">{generatedContent.presentation.preview}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-4 text-sm text-gray-600">
                            <span>{generatedContent.presentation.slides} slides</span>
                            <span>•</span>
                            <span>{generatedContent.presentation.duration}</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </Button>
                            <Button size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download PPT
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="video">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <PlayCircle className="h-5 w-5 mr-2 text-red-600" />
                          {generatedContent.video.title}
                        </CardTitle>
                        <CardDescription>Video pembelajaran interaktif dengan animasi dan narasi</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gray-100 aspect-video rounded-lg flex items-center justify-center mb-4">
                          <div className="text-center">
                            <PlayCircle className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-600">Video Preview</p>
                            <p className="text-sm text-gray-500">{generatedContent.video.duration}</p>
                          </div>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg mb-4">
                          <h4 className="font-semibold mb-2">Deskripsi:</h4>
                          <p className="text-sm text-gray-700">{generatedContent.video.description}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-4 text-sm text-gray-600">
                            <span>{generatedContent.video.duration}</span>
                            <span>•</span>
                            <span>{generatedContent.video.format}</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </Button>
                            <Button size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download Video
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="quiz">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <HelpCircle className="h-5 w-5 mr-2 text-green-600" />
                          {generatedContent.quiz.title}
                        </CardTitle>
                        <CardDescription>Assessment interaktif untuk mengukur pemahaman siswa</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="bg-green-50 p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold text-green-600">{generatedContent.quiz.questions}</div>
                            <div className="text-sm text-green-700">Pertanyaan</div>
                          </div>
                          <div className="bg-blue-50 p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold text-blue-600">3</div>
                            <div className="text-sm text-blue-700">Jenis Soal</div>
                          </div>
                          <div className="bg-purple-50 p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold text-purple-600 capitalize">
                              {generatedContent.quiz.difficulty}
                            </div>
                            <div className="text-sm text-purple-700">Level</div>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                          <h4 className="font-semibold mb-2">Jenis Pertanyaan:</h4>
                          <div className="flex flex-wrap gap-2">
                            {generatedContent.quiz.types.map((type: string, index: number) => (
                              <Badge key={index} variant="outline">
                                {type}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">Estimasi waktu: 15-20 menit</div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </Button>
                            <Button size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Export Quiz
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
