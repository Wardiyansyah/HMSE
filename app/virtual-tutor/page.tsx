'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAppStore } from '@/lib/store';
import { NavigationHeader } from '@/components/navigation-header';
import { streamText } from 'ai';
import { openai as openaiBase } from '@ai-sdk/openai';
import { Label } from '@/components/ui/label';
import { RefreshCw, Send } from 'lucide-react';
import { Sparkles, Brain, ChevronDown, ChevronUp, Lightbulb, BookOpen, Calculator, Beaker, Globe, History, User, ImageIcon, FileText } from 'lucide-react';

// --- Bagian ini dihapus: Komponen ApiKeySetup ---
// Hapus seluruh blok kode function ApiKeySetup(...) { ... }

// Sesuaikan cara inisialisasi API Key
// Langsung ambil dari environment variable
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

const openai = (modelName: string) =>
  openaiBase({
    model: modelName,
    ...(NEXT_PUBLIC_OPENAI_API_KEY ? { apiKey: NEXT_PUBLIC_OPENAI_API_KEY } : {}),
  });

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export default function VirtualTutor() {
  const { user, startSession, endSession } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: `Halo ${
        user?.name || 'Siswa'
      }! 👋 Saya AI Tutor EduGenAI, siap membantu Anda belajar dengan cara yang menyenangkan dan efektif!\n\n🎯 Saya bisa membantu Anda dengan:\n• Penjelasan konsep dari berbagai mata pelajaran\n• Pemecahan soal step-by-step\n• Tips dan strategi belajar\n• Persiapan ujian dan tugas\n\nSilakan ajukan pertanyaan atau pilih topik dari menu di samping. Mari kita mulai belajar! 🚀`,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isQuickQuestionsOpen, setIsQuickQuestionsOpen] = useState(false);
  const [isCapabilitiesOpen, setIsCapabilitiesOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Hapus state untuk menampilkan ApiKeySetup
  // const [showApiKeySetup, setShowApiKeySetup] = useState(!OPENAI_API_KEY);

  const quickQuestions = [
    {
      icon: <Calculator className="h-4 w-4" />,
      text: 'Jelaskan hukum Newton',
      subject: 'Fisika',
    },
    {
      icon: <Beaker className="h-4 w-4" />,
      text: 'Proses fotosintesis',
      subject: 'Biologi',
    },
    {
      icon: <Globe className="h-4 w-4" />,
      text: 'Penyebab pemanasan global',
      subject: 'Geografi',
    },
    {
      icon: <History className="h-4 w-4" />,
      text: 'Kemerdekaan Indonesia',
      subject: 'Sejarah',
    },
    {
      icon: <Calculator className="h-4 w-4" />,
      text: 'Persamaan kuadrat',
      subject: 'Matematika',
    },
    {
      icon: <BookOpen className="h-4 w-4" />,
      text: 'Analisis puisi Chairil Anwar',
      subject: 'Bahasa',
    },
  ];

  useEffect(() => {
    startSession('Virtual Tutor', 'AI Chat');
    return () => endSession();
  }, [startSession, endSession]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      type: 'ai',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, aiMessage]);

    // Periksa API key
    if (!OPENAI_API_KEY) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? {
                ...msg,
                content: '⚠️ API key tidak ditemukan. Pastikan Anda telah menyetel NEXT_PUBLIC_OPENAI_API_KEY di file .env.local.',
                isStreaming: false,
              }
            : msg
        )
      );
      setIsTyping(false);
      // Hapus pemanggilan setShowApiKeySetup(true)
      return;
    }

    try {
      const result = await streamText({
        model: openai('gpt-4o-mini'),
        system: `Anda adalah AI Tutor EduGenAI, asisten pembelajaran cerdas untuk siswa Indonesia. 

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

Selalu berikan jawaban yang komprehensif namun mudah dipahami sesuai level siswa.`,
        prompt: content,
        maxTokens: 1500,
      });

      let fullResponse = '';

      for await (const delta of result.textStream) {
        fullResponse += delta;
        setMessages((prev) => prev.map((msg) => (msg.id === aiMessageId ? { ...msg, content: fullResponse } : msg)));
      }

      setMessages((prev) => prev.map((msg) => (msg.id === aiMessageId ? { ...msg, isStreaming: false } : msg)));
    } catch (error) {
      console.error('Error generating AI response:', error);

      const fallbackResponse = `Maaf, saya mengalami kesulitan teknis saat memproses pertanyaan "${content}". 

Namun, saya tetap bisa membantu Anda! Berikut beberapa saran:

🔧 **Solusi Teknis:**
- Pastikan koneksi internet stabil
- Coba refresh halaman dan ulangi pertanyaan
- Periksa apakah API key sudah dikonfigurasi dengan benar

💡 **Alternatif Bantuan:**
- Coba ajukan pertanyaan dengan kata-kata yang lebih sederhana
- Gunakan fitur Content Generator untuk materi pembelajaran
- Bergabung dengan komunitas untuk diskusi dengan sesama pelajar

Silakan coba lagi atau ajukan pertanyaan lain. Saya siap membantu! 😊`;

      setMessages((prev) => prev.map((msg) => (msg.id === aiMessageId ? { ...msg, content: fallbackResponse, isStreaming: false } : msg)));
    }

    setIsTyping(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      <NavigationHeader />
      {/* Hapus pemanggilan komponen ApiKeySetup */}
      {/* {showApiKeySetup && <ApiKeySetup onClose={() => setShowApiKeySetup(false)} />} */}

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
            <Brain className="h-6 w-6 md:h-8 md:w-8 mr-2 md:mr-3 text-blue-600" />
            Virtual AI Tutor
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">Asisten pembelajaran AI yang siap membantu Anda 24/7 dengan penjelasan yang mudah dipahami</p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Online
            </Badge>
            <Badge variant="outline">Powered by OpenAI GPT-4</Badge>
            <Badge variant="outline" className="hidden sm:inline-flex">
              Machine Learning
            </Badge>
            <Badge variant="outline" className="hidden md:inline-flex">
              Bahasa Indonesia
            </Badge>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Interface - Full width on mobile, 3/4 on desktop */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] md:h-[700px] flex flex-col overflow-hidden">
              <CardHeader className="border-b dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <Avatar className="border-2 border-blue-200 dark:border-blue-700">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      <Brain className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base md:text-lg flex items-center">
                      AI Tutor EduGenAI
                      <Sparkles className="h-4 w-4 ml-2 text-yellow-500" />
                    </CardTitle>
                    <CardDescription className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      Siap membantu Anda belajar
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-full" ref={scrollAreaRef}>
                  <div className="p-4 space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex space-x-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarFallback className={message.type === 'user' ? 'bg-gray-100 dark:bg-gray-700' : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'}>
                              {message.type === 'user' ? <User className="h-4 w-4" /> : <Brain className="h-4 w-4" />}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`rounded-lg p-3 md:p-4 break-words ${message.type === 'user' ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' : 'bg-white dark:bg-card border shadow-sm dark:border-gray-700'}`}>
                            <div className="whitespace-pre-wrap text-sm leading-relaxed">
                              {message.content}
                              {message.isStreaming && <span className="inline-block w-2 h-4 bg-gray-400 dark:bg-gray-500 ml-1 animate-pulse"></span>}
                            </div>
                            <div className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                              {message.timestamp.toLocaleTimeString('id-ID', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="flex space-x-2 max-w-[85%]">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                              <Brain className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-white dark:bg-card border shadow-sm dark:border-gray-700 rounded-lg p-4">
                            <div className="flex items-center space-x-2">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                              <span className="text-sm text-gray-600 dark:text-gray-400">AI sedang berpikir...</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>

              <div className="border-t dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800 flex-shrink-0">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Tanyakan apa saja tentang pelajaran Anda..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(inputMessage);
                      }
                    }}
                    className="flex-1"
                    disabled={isTyping}
                  />
                  <Button size="icon" variant="outline" disabled className="hidden sm:flex bg-transparent">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => handleSendMessage(inputMessage)} disabled={!inputMessage.trim() || isTyping} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">💡 Tips: Ajukan pertanyaan spesifik untuk mendapatkan penjelasan yang lebih detail</p>
              </div>
            </Card>
          </div>

          {/* Desktop Sidebar - Hidden on mobile */}
          <div className="hidden lg:block space-y-6">
            {/* Quick Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  <span>Pertanyaan Populer</span>
                </CardTitle>
                <CardDescription className="text-sm">Klik untuk langsung bertanya</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickQuestions.slice(0, 4).map((question, index) => (
                  <Button key={index} variant="outline" className="w-full justify-start text-left h-auto p-3 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20" onClick={() => handleSendMessage(question.text)} disabled={isTyping}>
                    <div className="flex items-center space-x-2 w-full">
                      <div className="p-1 bg-blue-100 dark:bg-blue-900/20 rounded flex-shrink-0">{question.icon}</div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="text-xs font-medium truncate">{question.text}</div>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {question.subject}
                        </Badge>
                      </div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* AI Capabilities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base">
                  <Brain className="h-5 w-5 text-purple-500" />
                  <span>Kemampuan AI</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <BookOpen className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <span>Penjelasan konsep mendalam</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Calculator className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span>Pemecahan soal step-by-step</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <FileText className="h-4 w-4 text-purple-600 flex-shrink-0" />
                  <span>Bantuan tugas & PR</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Beaker className="h-4 w-4 text-orange-600 flex-shrink-0" />
                  <span>Simulasi eksperimen</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mobile Quick Actions - Collapsible */}
        <div className="lg:hidden mt-6 space-y-4">
          <Collapsible open={isQuickQuestionsOpen} onOpenChange={setIsQuickQuestionsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between bg-transparent">
                <span className="flex items-center">
                  <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
                  Pertanyaan Populer
                </span>
                {isQuickQuestionsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start text-left h-auto p-3 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  onClick={() => {
                    handleSendMessage(question.text);
                    setIsQuickQuestionsOpen(false);
                  }}
                  disabled={isTyping}
                >
                  <div className="flex items-center space-x-2 w-full">
                    <div className="p-1 bg-blue-100 dark:bg-blue-900/20 rounded flex-shrink-0">{question.icon}</div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="text-sm font-medium">{question.text}</div>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {question.subject}
                      </Badge>
                    </div>
                  </div>
                </Button>
              ))}
            </CollapsibleContent>
          </Collapsible>

          <Collapsible open={isCapabilitiesOpen} onOpenChange={setIsCapabilitiesOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between bg-transparent">
                <span className="flex items-center">
                  <Brain className="h-4 w-4 mr-2 text-purple-500" />
                  Kemampuan AI
                </span>
                {isCapabilitiesOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 mt-2 p-4 bg-white dark:bg-card rounded-lg border dark:border-gray-700">
              <div className="flex items-center space-x-2 text-sm">
                <BookOpen className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span>Penjelasan konsep mendalam</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Calculator className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span>Pemecahan soal step-by-step</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <FileText className="h-4 w-4 text-purple-600 flex-shrink-0" />
                <span>Bantuan tugas & PR</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Beaker className="h-4 w-4 text-orange-600 flex-shrink-0" />
                <span>Simulasi eksperimen</span>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  );
}
