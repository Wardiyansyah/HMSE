"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { NavigationHeader } from "@/components/navigation-header-student"
import { useLanguage } from "@/lib/language-context"
import {
  MessageCircle,
  Search,
  Plus,
  Reply,
  Send,
  ArrowUp,
  ArrowDown,
  User,
  Star,
  CheckCircle,
  Eye,
  BookOpen,
  Calculator,
  Atom,
  Microscope,
  Globe,
  DollarSign,
  Clock,
  Users,
  Palette,
  Activity,
  ChevronRight,
  Home,
  Award,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Types
interface Author {
  id: number
  name: string
  avatar: string
  reputation: number
  level: string
}

interface Post {
  id: number
  content: string
  author: Author
  createdAt: string
  votes: number
  isOriginalPost: boolean
  isBestAnswer: boolean
  replies: any[]
}

interface Topic {
  id: number
  title: string
  content: string
  author: Author
  subcategory: string
  createdAt: string
  views: number
  replies: number
  votes: number
  isAnswered: boolean
  subjectId: number
}

export default function Community() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentView, setCurrentView] = useState("subjects") // subjects, topics, topic-detail
  const [selectedSubject, setSelectedSubject] = useState<any>(null)
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [showCreateTopic, setShowCreateTopic] = useState(false)
  const [showReplyDialog, setShowReplyDialog] = useState(false)
  const [replyToPostId, setReplyToPostId] = useState<number | null>(null)
  const [newTopicTitle, setNewTopicTitle] = useState("")
  const [newTopicContent, setNewTopicContent] = useState("")
  const [newReplyContent, setNewReplyContent] = useState("")
  const [selectedSubjectForTopic, setSelectedSubjectForTopic] = useState("")
  const [selectedSubcategory, setSelectedSubcategory] = useState("Semua")

  // State untuk data yang bisa diubah
  const [topics, setTopics] = useState<Topic[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([])

  const { t } = useLanguage()

  // Current user
  const currentUser: Author = {
    id: 1,
    name: "Ahmad Rizki",
    avatar: "/placeholder.svg?height=40&width=40",
    reputation: 1250,
    level: "Intermediate",
  }

  // Subjects/Mata Pelajaran
  const subjects = [
    {
      id: 1,
      name: "Matematika",
      description: "Aljabar, Geometri, Kalkulus, Statistika, dan Trigonometri",
      icon: <Calculator className="h-8 w-8" />,
      color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
      topics: 1247,
      posts: 8934,
      lastActivity: "2 menit yang lalu",
      subcategories: ["Aljabar", "Geometri", "Kalkulus", "Statistika", "Trigonometri", "Matematika Diskrit"],
    },
    {
      id: 2,
      name: "Fisika",
      description: "Mekanika, Termodinamika, Elektromagnetisme, dan Fisika Modern",
      icon: <Atom className="h-8 w-8" />,
      color: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300",
      topics: 892,
      posts: 6543,
      lastActivity: "8 menit yang lalu",
      subcategories: ["Mekanika", "Termodinamika", "Elektromagnetisme", "Optik", "Fisika Modern", "Gelombang"],
    },
    {
      id: 3,
      name: "Kimia",
      description: "Kimia Organik, Anorganik, Fisik, dan Analitik",
      icon: <Microscope className="h-8 w-8" />,
      color: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300",
      topics: 654,
      posts: 4321,
      lastActivity: "15 menit yang lalu",
      subcategories: ["Kimia Organik", "Kimia Anorganik", "Kimia Fisik", "Kimia Analitik", "Biokimia"],
    },
    {
      id: 4,
      name: "Biologi",
      description: "Biologi Sel, Genetika, Ekologi, dan Evolusi",
      icon: <Activity className="h-8 w-8" />,
      color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300",
      topics: 543,
      posts: 3876,
      lastActivity: "22 menit yang lalu",
      subcategories: ["Biologi Sel", "Genetika", "Ekologi", "Evolusi", "Anatomi", "Fisiologi"],
    },
    {
      id: 5,
      name: "Bahasa Indonesia",
      description: "Tata Bahasa, Sastra, Puisi, dan Penulisan Kreatif",
      icon: <BookOpen className="h-8 w-8" />,
      color: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300",
      topics: 432,
      posts: 2987,
      lastActivity: "35 menit yang lalu",
      subcategories: ["Tata Bahasa", "Sastra Indonesia", "Puisi", "Cerpen", "Novel", "Penulisan Kreatif"],
    },
    {
      id: 6,
      name: "Bahasa Inggris",
      description: "Grammar, Conversation, Literature, dan TOEFL/IELTS",
      icon: <Globe className="h-8 w-8" />,
      color: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300",
      topics: 678,
      posts: 4532,
      lastActivity: "18 menit yang lalu",
      subcategories: ["Grammar", "Conversation", "Literature", "TOEFL/IELTS", "Business English", "Academic Writing"],
    },
    {
      id: 7,
      name: "Sejarah",
      description: "Sejarah Indonesia, Dunia, dan Peradaban",
      icon: <Clock className="h-8 w-8" />,
      color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300",
      topics: 345,
      posts: 2156,
      lastActivity: "45 menit yang lalu",
      subcategories: ["Sejarah Indonesia", "Sejarah Dunia", "Peradaban Kuno", "Sejarah Modern", "Arkeologi"],
    },
    {
      id: 8,
      name: "Geografi",
      description: "Geografi Fisik, Manusia, dan Lingkungan",
      icon: <Globe className="h-8 w-8" />,
      color: "bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300",
      topics: 287,
      posts: 1876,
      lastActivity: "1 jam yang lalu",
      subcategories: ["Geografi Fisik", "Geografi Manusia", "Kartografi", "Klimatologi", "Geologi"],
    },
    {
      id: 9,
      name: "Ekonomi",
      description: "Mikroekonomi, Makroekonomi, dan Ekonomi Pembangunan",
      icon: <DollarSign className="h-8 w-8" />,
      color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300",
      topics: 234,
      posts: 1543,
      lastActivity: "1.5 jam yang lalu",
      subcategories: ["Mikroekonomi", "Makroekonomi", "Ekonomi Pembangunan", "Ekonomi Internasional", "Akuntansi"],
    },
    {
      id: 10,
      name: "Sosiologi",
      description: "Masyarakat, Budaya, dan Interaksi Sosial",
      icon: <Users className="h-8 w-8" />,
      color: "bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-300",
      topics: 198,
      posts: 1234,
      lastActivity: "2 jam yang lalu",
      subcategories: ["Teori Sosiologi", "Masyarakat", "Budaya", "Perubahan Sosial", "Sosiologi Pendidikan"],
    },
    {
      id: 11,
      name: "Seni Budaya",
      description: "Seni Rupa, Musik, Tari, dan Teater",
      icon: <Palette className="h-8 w-8" />,
      color: "bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300",
      topics: 156,
      posts: 987,
      lastActivity: "3 jam yang lalu",
      subcategories: ["Seni Rupa", "Musik", "Tari", "Teater", "Seni Tradisional", "Seni Modern"],
    },
    {
      id: 12,
      name: "Pendidikan Jasmani",
      description: "Olahraga, Kesehatan, dan Kebugaran",
      icon: <Activity className="h-8 w-8" />,
      color: "bg-lime-100 text-lime-700 dark:bg-lime-900/20 dark:text-lime-300",
      topics: 123,
      posts: 765,
      lastActivity: "4 jam yang lalu",
      subcategories: ["Atletik", "Permainan Bola", "Senam", "Renang", "Kesehatan", "Gizi"],
    },
  ]

  // Initial data
  const initialTopics: Topic[] = [
    {
      id: 1,
      title: "Bagaimana cara menyelesaikan integral parsial yang kompleks?",
      content:
        "Saya kesulitan memahami langkah-langkah integral parsial, terutama untuk fungsi trigonometri dan logaritma. Bisakah seseorang menjelaskan dengan contoh yang detail?",
      author: {
        id: 2,
        name: "Budi Santoso",
        avatar: "/placeholder.svg?height=40&width=40",
        reputation: 890,
        level: "Intermediate",
      },
      subcategory: "Kalkulus",
      createdAt: "2024-01-20T10:30:00Z",
      views: 234,
      replies: 8,
      votes: 15,
      isAnswered: true,
      subjectId: 1,
    },
    {
      id: 2,
      title: "Konsep limit dalam kalkulus untuk pemula",
      content: "Sebagai siswa baru, saya bingung dengan konsep limit. Ada tips untuk memahaminya?",
      author: {
        id: 3,
        name: "Siti Nurhaliza",
        avatar: "/placeholder.svg?height=40&width=40",
        reputation: 456,
        level: "Beginner",
      },
      subcategory: "Kalkulus",
      createdAt: "2024-01-19T15:20:00Z",
      views: 189,
      replies: 5,
      votes: 12,
      isAnswered: false,
      subjectId: 1,
    },
    {
      id: 3,
      title: "Cara menyelesaikan sistem persamaan linear 3 variabel",
      content: "Bagaimana cara yang paling efektif untuk menyelesaikan sistem persamaan linear dengan 3 variabel?",
      author: {
        id: 4,
        name: "Andi Wijaya",
        avatar: "/placeholder.svg?height=40&width=40",
        reputation: 1234,
        level: "Advanced",
      },
      subcategory: "Aljabar",
      createdAt: "2024-01-18T11:45:00Z",
      views: 345,
      replies: 12,
      votes: 28,
      isAnswered: true,
      subjectId: 1,
    },
    {
      id: 4,
      title: "Hukum Newton dan aplikasinya dalam kehidupan sehari-hari",
      content: "Bisakah dijelaskan contoh nyata penerapan hukum Newton dalam kehidupan sehari-hari?",
      author: {
        id: 5,
        name: "Rizki Pratama",
        avatar: "/placeholder.svg?height=40&width=40",
        reputation: 678,
        level: "Intermediate",
      },
      subcategory: "Mekanika",
      createdAt: "2024-01-20T09:15:00Z",
      views: 156,
      replies: 6,
      votes: 18,
      isAnswered: true,
      subjectId: 2,
    },
    {
      id: 5,
      title: "Konsep gelombang elektromagnetik",
      content: "Saya kesulitan memahami sifat-sifat gelombang elektromagnetik dan spektrumnya.",
      author: {
        id: 6,
        name: "Dewi Lestari",
        avatar: "/placeholder.svg?height=40&width=40",
        reputation: 543,
        level: "Beginner",
      },
      subcategory: "Elektromagnetisme",
      createdAt: "2024-01-19T14:30:00Z",
      views: 198,
      replies: 9,
      votes: 14,
      isAnswered: false,
      subjectId: 2,
    },
  ]

  const initialPosts: Post[] = [
    {
      id: 1,
      content:
        "Saya kesulitan memahami langkah-langkah integral parsial, terutama ketika melibatkan fungsi trigonometri dan logaritma. Bisakah seseorang menjelaskan dengan contoh yang detail?\n\nContoh soal yang saya hadapi:\n∫ x ln(x) dx\n\nSaya sudah mencoba menggunakan rumus integral parsial ∫ u dv = uv - ∫ v du, tapi masih bingung dalam menentukan u dan dv yang tepat.",
      author: {
        id: 2,
        name: "Budi Santoso",
        avatar: "/placeholder.svg?height=40&width=40",
        reputation: 890,
        level: "Intermediate",
      },
      createdAt: "2024-01-20T10:30:00Z",
      votes: 15,
      isOriginalPost: true,
      isBestAnswer: false,
      replies: [],
    },
    {
      id: 2,
      content:
        "Untuk integral parsial ∫ x ln(x) dx, kunci utamanya adalah memilih u dan dv dengan tepat.\n\n**Langkah 1: Pilih u dan dv**\n- u = ln(x) → du = (1/x) dx\n- dv = x dx → v = (x²/2)\n\n**Langkah 2: Terapkan rumus**\n∫ x ln(x) dx = uv - ∫ v du\n= ln(x) · (x²/2) - ∫ (x²/2) · (1/x) dx\n= (x² ln(x))/2 - ∫ x/2 dx\n= (x² ln(x))/2 - x²/4 + C\n\n**Tips memilih u dan dv:**\nGunakan urutan LIATE:\n- **L**ogaritma\n- **I**nvers trigonometri\n- **A**ljabar\n- **T**rigonometri\n- **E**ksponensial\n\nPilih u dari yang paling atas dalam daftar ini.",
      author: {
        id: 5,
        name: "Dr. Matematika",
        avatar: "/placeholder.svg?height=40&width=40",
        reputation: 3456,
        level: "Expert",
      },
      createdAt: "2024-01-20T11:15:00Z",
      votes: 28,
      isOriginalPost: false,
      isBestAnswer: true,
      replies: [
        {
          id: 3,
          content:
            "Terima kasih Dr. Matematika! Penjelasannya sangat jelas. Saya baru tahu tentang urutan LIATE untuk memilih u dan dv.\n\nBisakah Anda berikan satu contoh lagi dengan fungsi trigonometri? Misalnya ∫ x sin(x) dx?",
          author: {
            id: 2,
            name: "Budi Santoso",
            avatar: "/placeholder.svg?height=40&width=40",
            reputation: 890,
            level: "Intermediate",
          },
          createdAt: "2024-01-20T12:30:00Z",
          votes: 5,
          parentId: 2,
        },
        {
          id: 4,
          content:
            "Tentu! Untuk ∫ x sin(x) dx:\n\n**Menggunakan LIATE:**\n- u = x (Aljabar) → du = dx\n- dv = sin(x) dx (Trigonometri) → v = -cos(x)\n\n**Penyelesaian:**\n∫ x sin(x) dx = x(-cos(x)) - ∫ (-cos(x)) dx\n= -x cos(x) + ∫ cos(x) dx\n= -x cos(x) + sin(x) + C\n\n**Verifikasi dengan turunan:**\nd/dx[-x cos(x) + sin(x)] = -cos(x) + x sin(x) + cos(x) = x sin(x) ✓",
          author: {
            id: 5,
            name: "Dr. Matematika",
            avatar: "/placeholder.svg?height=40&width=40",
            reputation: 3456,
            level: "Expert",
          },
          createdAt: "2024-01-20T13:45:00Z",
          votes: 22,
          parentId: 2,
        },
      ],
    },
    {
      id: 6,
      content:
        "Saya juga punya pertanyaan serupa. Bagaimana kalau integralnya ∫ x² ln(x) dx? Apakah masih menggunakan metode yang sama?",
      author: {
        id: 6,
        name: "Sari Dewi",
        avatar: "/placeholder.svg?height=40&width=40",
        reputation: 567,
        level: "Intermediate",
      },
      createdAt: "2024-01-20T11:45:00Z",
      votes: 8,
      isOriginalPost: false,
      isBestAnswer: false,
      replies: [
        {
          id: 7,
          content:
            "Untuk ∫ x² ln(x) dx, ya masih menggunakan metode yang sama!\n\n**Langkah-langkah:**\n- u = ln(x) → du = (1/x) dx\n- dv = x² dx → v = x³/3\n\n**Penyelesaian:**\n∫ x² ln(x) dx = ln(x) · (x³/3) - ∫ (x³/3) · (1/x) dx\n= (x³ ln(x))/3 - ∫ x²/3 dx\n= (x³ ln(x))/3 - x³/9 + C\n\nPola yang sama, hanya pangkat x yang berbeda! 👍",
          author: {
            id: 5,
            name: "Dr. Matematika",
            avatar: "/placeholder.svg?height=40&width=40",
            reputation: 3456,
            level: "Expert",
          },
          createdAt: "2024-01-20T13:30:00Z",
          votes: 15,
          parentId: 6,
        },
      ],
    },
  ]

  // Initialize data
  useEffect(() => {
    setTopics(initialTopics)
    setPosts(initialPosts)
    setFilteredTopics(initialTopics)
  }, [])

  // Search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTopics(topics.filter((topic) => !selectedSubject || topic.subjectId === selectedSubject.id))
    } else {
      const filtered = topics.filter((topic) => {
        const matchesSearch =
          topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          topic.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          topic.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          topic.subcategory.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesSubject = !selectedSubject || topic.subjectId === selectedSubject.id

        return matchesSearch && matchesSubject
      })
      setFilteredTopics(filtered)
    }
  }, [searchQuery, topics, selectedSubject])

  // Filter by subcategory
  useEffect(() => {
    if (selectedSubject) {
      let filtered = topics.filter((topic) => topic.subjectId === selectedSubject.id)

      if (selectedSubcategory !== "Semua") {
        filtered = filtered.filter((topic) => topic.subcategory === selectedSubcategory)
      }

      if (searchQuery.trim()) {
        filtered = filtered.filter((topic) => {
          return (
            topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            topic.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            topic.author.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        })
      }

      setFilteredTopics(filtered)
    }
  }, [selectedSubcategory, selectedSubject, topics, searchQuery])

  // Create new topic
  const handleCreateTopic = () => {
    if (!newTopicTitle.trim() || !newTopicContent.trim() || !selectedSubjectForTopic) {
      toast({
        title: "Error",
        description: "Harap isi semua field yang diperlukan.",
        variant: "destructive",
      })
      return
    }

    const selectedSubjectData = subjects.find((s) => s.id.toString() === selectedSubjectForTopic)
    const newTopic: Topic = {
      id: Date.now(),
      title: newTopicTitle.trim(),
      content: newTopicContent.trim(),
      author: currentUser,
      subcategory: selectedSubjectData?.subcategories[0] || "Umum",
      createdAt: new Date().toISOString(),
      views: 0,
      replies: 0,
      votes: 0,
      isAnswered: false,
      subjectId: Number.parseInt(selectedSubjectForTopic),
    }

    setTopics((prev) => [newTopic, ...prev])

    // Create original post for the topic
    const originalPost: Post = {
      id: Date.now() + 1,
      content: newTopicContent.trim(),
      author: currentUser,
      createdAt: new Date().toISOString(),
      votes: 0,
      isOriginalPost: true,
      isBestAnswer: false,
      replies: [],
    }

    setPosts((prev) => [originalPost, ...prev])

    toast({
      title: "Berhasil!",
      description: "Topik baru berhasil dibuat.",
    })

    setNewTopicTitle("")
    setNewTopicContent("")
    setSelectedSubjectForTopic("")
    setShowCreateTopic(false)
  }

  // Add reply to post
  const handleSendReply = () => {
    if (!newReplyContent.trim()) {
      toast({
        title: "Error",
        description: "Harap isi konten balasan.",
        variant: "destructive",
      })
      return
    }

    const newReply = {
      id: Date.now(),
      content: newReplyContent.trim(),
      author: currentUser,
      createdAt: new Date().toISOString(),
      votes: 0,
      parentId: replyToPostId || undefined,
    }

    if (replyToPostId) {
      // Add reply to specific post
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id === replyToPostId) {
            return {
              ...post,
              replies: [...post.replies, newReply],
            }
          }
          return post
        }),
      )
    } else {
      // Add as new post
      const newPost: Post = {
        id: Date.now(),
        content: newReplyContent.trim(),
        author: currentUser,
        createdAt: new Date().toISOString(),
        votes: 0,
        isOriginalPost: false,
        isBestAnswer: false,
        replies: [],
      }
      setPosts((prev) => [...prev, newPost])
    }

    // Update topic reply count
    if (selectedTopic) {
      setTopics((prev) =>
        prev.map((topic) => {
          if (topic.id === selectedTopic.id) {
            return {
              ...topic,
              replies: topic.replies + 1,
              isAnswered: true,
            }
          }
          return topic
        }),
      )
    }

    toast({
      title: "Berhasil!",
      description: "Balasan berhasil ditambahkan.",
    })

    setNewReplyContent("")
    setReplyToPostId(null)
    setShowReplyDialog(false)
  }

  // Quick reply from topic detail
  const handleQuickReply = () => {
    if (!newReplyContent.trim()) {
      toast({
        title: "Error",
        description: "Harap isi konten balasan.",
        variant: "destructive",
      })
      return
    }

    const newPost: Post = {
      id: Date.now(),
      content: newReplyContent.trim(),
      author: currentUser,
      createdAt: new Date().toISOString(),
      votes: 0,
      isOriginalPost: false,
      isBestAnswer: false,
      replies: [],
    }

    setPosts((prev) => [...prev, newPost])

    // Update topic reply count
    if (selectedTopic) {
      setTopics((prev) =>
        prev.map((topic) => {
          if (topic.id === selectedTopic.id) {
            return {
              ...topic,
              replies: topic.replies + 1,
              isAnswered: true,
            }
          }
          return topic
        }),
      )
    }

    toast({
      title: "Berhasil!",
      description: "Balasan berhasil ditambahkan.",
    })

    setNewReplyContent("")
  }

  // Vote functionality
  const handleVote = (postId: number, voteType: "up" | "down", isReply = false) => {
    const voteChange = voteType === "up" ? 1 : -1

    if (isReply) {
      // Handle reply votes
      setPosts((prev) =>
        prev.map((post) => ({
          ...post,
          replies: post.replies.map((reply) =>
            reply.id === postId ? { ...reply, votes: reply.votes + voteChange } : reply,
          ),
        })),
      )
    } else {
      // Handle post votes
      setPosts((prev) => prev.map((post) => (post.id === postId ? { ...post, votes: post.votes + voteChange } : post)))
    }

    toast({
      title: "Vote berhasil!",
      description: `Anda telah memberikan ${voteType === "up" ? "upvote" : "downvote"}.`,
    })
  }

  // Mark as best answer
  const handleMarkBestAnswer = (postId: number) => {
    setPosts((prev) =>
      prev.map((post) => ({
        ...post,
        isBestAnswer: post.id === postId ? true : post.isBestAnswer,
      })),
    )

    toast({
      title: "Jawaban Terbaik!",
      description: "Postingan telah ditandai sebagai jawaban terbaik.",
    })
  }

  // Update topic views
  const handleTopicView = (topic: Topic) => {
    setTopics((prev) => prev.map((t) => (t.id === topic.id ? { ...t, views: t.views + 1 } : t)))
    setSelectedTopic({ ...topic, views: topic.views + 1 })
    setCurrentView("topic-detail")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const navigateToSubject = (subject: any) => {
    setSelectedSubject(subject)
    setSelectedSubcategory("Semua")
    setCurrentView("topics")
  }

  const navigateBack = () => {
    if (currentView === "topic-detail") {
      setCurrentView("topics")
      setSelectedTopic(null)
    } else if (currentView === "topics") {
      setCurrentView("subjects")
      setSelectedSubject(null)
      setSelectedSubcategory("Semua")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      <NavigationHeader />

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
            <MessageCircle className="h-6 w-6 md:h-8 md:w-8 mr-2 md:mr-3 text-blue-600" />
            Forum Diskusi Insan AI
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Platform diskusi untuk berbagi pengetahuan dan saling membantu dalam belajar
          </p>
        </div>

        {/* Breadcrumb */}
        {currentView !== "subjects" && (
          <div className="mb-4 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Home className="h-4 w-4" />
            <span className="hover:text-blue-600 cursor-pointer" onClick={() => setCurrentView("subjects")}>
              Forum
            </span>
            {selectedSubject && (
              <>
                <ChevronRight className="h-4 w-4" />
                <span className="hover:text-blue-600 cursor-pointer" onClick={() => setCurrentView("topics")}>
                  {selectedSubject.name}
                </span>
              </>
            )}
            {selectedTopic && (
              <>
                <ChevronRight className="h-4 w-4" />
                <span className="text-gray-900 dark:text-gray-100 font-medium line-clamp-1">{selectedTopic.title}</span>
              </>
            )}
          </div>
        )}

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={
                    currentView === "subjects"
                      ? "Cari mata pelajaran..."
                      : currentView === "topics"
                        ? "Cari topik atau pertanyaan..."
                        : "Cari dalam diskusi..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={() => setShowCreateTopic(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Buat Topik
              </Button>
            </div>
            {searchQuery && (
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {currentView === "topics" && `Ditemukan ${filteredTopics.length} topik untuk "${searchQuery}"`}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subjects List */}
        {currentView === "subjects" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects
              .filter((subject) => {
                if (!searchQuery.trim()) return true
                return (
                  subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  subject.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  subject.subcategories.some((sub) => sub.toLowerCase().includes(searchQuery.toLowerCase()))
                )
              })
              .map((subject) => (
                <Card
                  key={subject.id}
                  className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105"
                  onClick={() => navigateToSubject(subject)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg ${subject.color}`}>{subject.icon}</div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{subject.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {topics.filter((t) => t.subjectId === subject.id).length} topik
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{subject.description}</p>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {subject.subcategories.slice(0, 3).map((sub, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {sub}
                          </Badge>
                        ))}
                        {subject.subcategories.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{subject.subcategories.length - 3} lainnya
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{posts.length} postingan</span>
                        <span>{subject.lastActivity}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}

        {/* Topics List */}
        {currentView === "topics" && selectedSubject && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Button variant="outline" onClick={navigateBack} className="mb-2 bg-transparent">
                  ← Kembali ke Mata Pelajaran
                </Button>
                <h2 className="text-2xl font-bold flex items-center">
                  <div className={`p-2 rounded-lg ${selectedSubject.color} mr-3`}>{selectedSubject.icon}</div>
                  {selectedSubject.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{selectedSubject.description}</p>
              </div>
            </div>

            {/* Subcategories Filter */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={selectedSubcategory === "Semua" ? "default" : "secondary"}
                    className="cursor-pointer hover:bg-blue-100"
                    onClick={() => setSelectedSubcategory("Semua")}
                  >
                    Semua ({topics.filter((t) => t.subjectId === selectedSubject.id).length})
                  </Badge>
                  {selectedSubject.subcategories.map((sub: string, index: number) => {
                    const count = topics.filter(
                      (t) => t.subjectId === selectedSubject.id && t.subcategory === sub,
                    ).length
                    return (
                      <Badge
                        key={index}
                        variant={selectedSubcategory === sub ? "default" : "outline"}
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() => setSelectedSubcategory(sub)}
                      >
                        {sub} ({count})
                      </Badge>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Topics */}
            <div className="space-y-4">
              {filteredTopics.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="text-gray-500 dark:text-gray-400">
                      {searchQuery ? (
                        <>
                          <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p className="text-lg font-medium mb-2 hover:text-blue-600 line-clamp-2">
                            Tidak ada topik yang ditemukan
                          </p>
                          <p>Coba gunakan kata kunci yang berbeda atau buat topik baru</p>
                        </>
                      ) : (
                        <>
                          <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p className="text-lg font-medium mb-2">Belum ada topik</p>
                          <p>Jadilah yang pertama membuat topik di kategori ini</p>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                filteredTopics.map((topic) => (
                  <Card key={topic.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6" onClick={() => handleTopicView(topic)}>
                      <div className="flex items-start space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={topic.author.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {topic.author.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-1 hover:text-blue-600 line-clamp-2">
                                {topic.title}
                              </h3>
                              <Badge variant="secondary" className="mb-2">
                                {topic.subcategory}
                              </Badge>
                              <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{topic.content}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <User className="h-4 w-4 mr-1" />
                                {topic.author.name}
                              </span>
                              <Badge variant="outline">{topic.author.level}</Badge>
                              <span className="flex items-center">
                                <Star className="h-4 w-4 mr-1 text-yellow-500" />
                                {topic.author.reputation}
                              </span>
                              <span>{formatDate(topic.createdAt)}</span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center">
                                <ArrowUp className="h-4 w-4 mr-1 text-green-600" />
                                {topic.votes}
                              </span>
                              <span className="flex items-center">
                                <MessageCircle className="h-4 w-4 mr-1" />
                                {topic.replies}
                              </span>
                              <span className="flex items-center">
                                <Eye className="h-4 w-4 mr-1" />
                                {topic.views}
                              </span>
                              {topic.isAnswered && (
                                <Badge className="bg-green-100 text-green-700">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Terjawab
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {/* Topic Detail */}
        {currentView === "topic-detail" && selectedTopic && (
          <div className="space-y-4">
            {/* Back Button */}
            <Button variant="outline" onClick={navigateBack} className="mb-4 bg-transparent">
              ← Kembali ke {selectedSubject?.name}
            </Button>

            {/* Topic Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <Badge variant="secondary" className="mb-2">
                      {selectedTopic.subcategory}
                    </Badge>
                    <h1 className="text-2xl font-bold mb-2">{selectedTopic.title}</h1>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {selectedTopic.views} views
                    </span>
                    <span className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {selectedTopic.replies} replies
                    </span>
                    <span className="flex items-center">
                      <ArrowUp className="h-4 w-4 mr-1 text-green-600" />
                      {selectedTopic.votes} votes
                    </span>
                  </div>
                  <span>{formatDate(selectedTopic.createdAt)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Posts */}
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id} className={post.isBestAnswer ? "border-green-500 bg-green-50/50" : ""}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Vote Section */}
                      <div className="flex flex-col items-center space-y-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote(post.id, "up")}
                          className="p-1 hover:bg-green-100"
                        >
                          <ArrowUp className="h-5 w-5" />
                        </Button>
                        <span className="font-semibold">{post.votes}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVote(post.id, "down")}
                          className="p-1 hover:bg-red-100"
                        >
                          <ArrowDown className="h-5 w-5" />
                        </Button>
                        {post.isBestAnswer && (
                          <div className="flex flex-col items-center mt-2">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                            <span className="text-xs text-green-600 font-medium">Jawaban Terbaik</span>
                          </div>
                        )}
                        {!post.isOriginalPost && !post.isBestAnswer && selectedTopic.author.id === currentUser.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkBestAnswer(post.id)}
                            className="p-1 hover:bg-green-100 mt-2"
                            title="Tandai sebagai jawaban terbaik"
                          >
                            <Award className="h-4 w-4 text-green-600" />
                          </Button>
                        )}
                      </div>

                      {/* Post Content */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {post.author.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="font-medium">{post.author.name}</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {post.author.level}
                            </Badge>
                            <div className="text-xs text-gray-500">
                              <span className="flex items-center">
                                <Star className="h-3 w-3 mr-1 text-yellow-500" />
                                {post.author.reputation} • {formatDate(post.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Post Text */}
                        <div className="prose dark:prose-invert max-w-none mb-4">
                          <div className="whitespace-pre-wrap">{post.content}</div>
                        </div>

                        {/* Post Actions */}
                        <div className="flex items-center space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setReplyToPostId(post.id)
                              setShowReplyDialog(true)
                            }}
                            className="text-gray-500 hover:text-blue-600"
                          >
                            <Reply className="h-4 w-4 mr-1" />
                            Balas
                          </Button>
                        </div>

                        {/* Replies */}
                        {post.replies && post.replies.length > 0 && (
                          <div className="mt-4 ml-4 border-l-2 border-gray-200 pl-4 space-y-3">
                            {post.replies.map((reply) => (
                              <div key={reply.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                <div className="flex items-start space-x-3">
                                  <div className="flex flex-col items-center space-y-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleVote(reply.id, "up", true)}
                                      className="p-1 hover:bg-green-100"
                                    >
                                      <ArrowUp className="h-4 w-4" />
                                    </Button>
                                    <span className="text-sm font-medium">{reply.votes}</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleVote(reply.id, "down", true)}
                                      className="p-1 hover:bg-red-100"
                                    >
                                      <ArrowDown className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                      <Avatar className="w-6 h-6">
                                        <AvatarImage src={reply.author.avatar || "/placeholder.svg"} />
                                        <AvatarFallback className="text-xs">
                                          {reply.author.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="font-medium text-sm">{reply.author.name}</span>
                                      <Badge variant="outline" className="text-xs">
                                        {reply.author.level}
                                      </Badge>
                                      <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
                                    </div>
                                    <div className="text-sm whitespace-pre-wrap">{reply.content}</div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setReplyToPostId(reply.id)
                                        setShowReplyDialog(true)
                                      }}
                                      className="mt-2 text-xs text-gray-500 hover:text-blue-600"
                                    >
                                      <Reply className="h-3 w-3 mr-1" />
                                      Balas
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Reply */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {currentUser.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Tulis balasan Anda..."
                      value={newReplyContent}
                      onChange={(e) => setNewReplyContent(e.target.value)}
                      rows={3}
                      className="mb-3"
                    />
                    <Button onClick={handleQuickReply} className="bg-blue-600 hover:bg-blue-700">
                      <Send className="h-4 w-4 mr-2" />
                      Kirim Balasan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Create Topic Dialog */}
        <Dialog open={showCreateTopic} onOpenChange={setShowCreateTopic}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Buat Topik Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Mata Pelajaran</label>
                <Select value={selectedSubjectForTopic} onValueChange={setSelectedSubjectForTopic}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih mata pelajaran..." />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id.toString()}>
                        <div className="flex items-center space-x-2">
                          {subject.icon}
                          <span>{subject.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Input
                placeholder="Judul topik..."
                value={newTopicTitle}
                onChange={(e) => setNewTopicTitle(e.target.value)}
              />
              <Textarea
                placeholder="Tulis pertanyaan atau diskusi Anda..."
                value={newTopicContent}
                onChange={(e) => setNewTopicContent(e.target.value)}
                rows={6}
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateTopic(false)}>
                  Batal
                </Button>
                <Button onClick={handleCreateTopic} className="bg-blue-600 hover:bg-blue-700">
                  <Send className="h-4 w-4 mr-2" />
                  Buat Topik
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Reply Dialog */}
        <Dialog open={showReplyDialog} onOpenChange={setShowReplyDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Balas Postingan</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="Tulis balasan Anda..."
                value={newReplyContent}
                onChange={(e) => setNewReplyContent(e.target.value)}
                rows={6}
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowReplyDialog(false)}>
                  Batal
                </Button>
                <Button onClick={handleSendReply} className="bg-blue-600 hover:bg-blue-700">
                  <Send className="h-4 w-4 mr-2" />
                  Kirim Balasan
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
