'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { NavigationHeader } from '@/components/navigation-header-student';
import { useLanguage } from '@/lib/language-context';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Users, MessageCircle, Search, Plus, ThumbsUp, Reply, Share2, Bookmark, Clock, Eye, TrendingUp, Award, HelpCircle, BookOpen, Lightbulb, Send, X, MessageSquare, Copy, CheckCircle, UserPlus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

export default function Community() {
  const [searchQuery, setSearchQuery] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('');
  const [newPostTags, setNewPostTags] = useState<string[]>([]);
  const [enableWhatsApp, setEnableWhatsApp] = useState(false);
  const [showCreateStudyGroup, setShowCreateStudyGroup] = useState(false);
  const [showCreateDiscussion, setShowCreateDiscussion] = useState(false);
  const [studyGroupName, setStudyGroupName] = useState('');
  const [studyGroupDescription, setStudyGroupDescription] = useState('');
  const [studyGroupSubject, setStudyGroupSubject] = useState('');
  const [studyGroupMaxMembers, setStudyGroupMaxMembers] = useState('10');
  const [activeTab, setActiveTab] = useState('discussions');
  const { t } = useLanguage();

  const [discussions, setDiscussions] = useState([
    {
      id: 1,
      title: 'Bagaimana cara mudah memahami integral?',
      content: 'Saya kesulitan memahami konsep integral dalam kalkulus. Ada yang bisa bantu jelaskan dengan cara yang sederhana?',
      author: {
        name: 'Andi Pratama',
        role: t('common.student'),
        avatar: '/placeholder.svg?height=40&width=40',
        level: t('common.beginner'),
      },
      category: t('subject.matematika'),
      tags: ['kalkulus', 'integral', 'bantuan'],
      timestamp: '2 jam yang lalu',
      replies: 12,
      likes: 8,
      views: 156,
      isAnswered: false,
      isTrending: true,
      whatsappGroup: 'https://chat.whatsapp.com/ABC123DEF456',
      hasWhatsApp: true,
    },
    {
      id: 2,
      title: 'Tips belajar efektif untuk persiapan UTBK',
      content: 'Mau sharing tips belajar yang efektif untuk persiapan UTBK. Saya berhasil meningkatkan skor dari 450 ke 650 dalam 3 bulan!',
      author: {
        name: 'Sarah Dewi',
        role: 'Alumni SMA',
        avatar: '/placeholder.svg?height=40&width=40',
        level: t('common.expert'),
      },
      category: 'Tips Belajar',
      tags: ['utbk', 'tips', 'motivasi'],
      timestamp: '5 jam yang lalu',
      replies: 24,
      likes: 45,
      views: 320,
      isAnswered: true,
      isTrending: true,
      whatsappGroup: 'https://chat.whatsapp.com/XYZ789GHI012',
      hasWhatsApp: true,
    },
    {
      id: 3,
      title: 'Diskusi: Dampak AI terhadap pendidikan masa depan',
      content: 'Bagaimana menurut kalian dampak AI seperti ChatGPT dan EduGenAI terhadap cara kita belajar di masa depan?',
      author: {
        name: 'Dr. Budi Santoso',
        role: t('common.teacher'),
        avatar: '/placeholder.svg?height=40&width=40',
        level: t('common.expert'),
      },
      category: 'Diskusi Umum',
      tags: ['ai', 'teknologi', 'pendidikan'],
      timestamp: '1 hari yang lalu',
      replies: 18,
      likes: 32,
      views: 280,
      isAnswered: false,
      isTrending: false,
      hasWhatsApp: false,
    },
  ]);

  const [studyGroups, setStudyGroups] = useState([
    {
      id: 1,
      name: 'Grup Belajar Matematika SMA',
      description: 'Belajar bersama matematika untuk persiapan ujian. Diskusi soal-soal sulit, sharing tips, dan saling membantu memahami konsep matematika.',
      subject: 'Matematika',
      members: 15,
      maxMembers: 20,
      whatsappGroup: 'https://chat.whatsapp.com/MATH123ABC',
      createdBy: 'Sarah Dewi',
      createdAt: '3 hari yang lalu',
    },
    {
      id: 2,
      name: 'Fisika Quantum Discussion',
      description: 'Diskusi mendalam tentang fisika quantum dan aplikasinya. Cocok untuk mahasiswa fisika yang ingin memahami konsep-konsep advanced.',
      subject: 'Fisika',
      members: 8,
      maxMembers: 12,
      whatsappGroup: 'https://chat.whatsapp.com/PHYSICS456DEF',
      createdBy: 'Dr. Ahmad',
      createdAt: '1 minggu yang lalu',
    },
    {
      id: 3,
      name: 'English Conversation Club',
      description: 'Praktik speaking bahasa Inggris setiap hari. Diskusi topik menarik, sharing vocabulary, dan improve pronunciation bersama-sama.',
      subject: 'Bahasa Inggris',
      members: 22,
      maxMembers: 25,
      whatsappGroup: 'https://chat.whatsapp.com/ENGLISH789GHI',
      createdBy: 'Ms. Linda',
      createdAt: '2 minggu yang lalu',
    },
  ]);

  const postCategories = [
    { value: 'matematika', label: t('subject.matematika') },
    { value: 'fisika', label: t('subject.fisika') },
    { value: 'kimia', label: t('subject.kimia') },
    { value: 'biologi', label: t('subject.biologi') },
    { value: 'bahasa', label: t('subject.bahasa') },
    { value: 'sejarah', label: t('subject.sejarah') },
    { value: 'geografi', label: t('subject.geografi') },
    { value: 'umum', label: 'Diskusi Umum' },
  ];

  const handleAddTag = (tag: string) => {
    if (tag && !newPostTags.includes(tag)) {
      setNewPostTags([...newPostTags, tag]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewPostTags(newPostTags.filter((tag) => tag !== tagToRemove));
  };

  const createWhatsAppGroup = (title: string, description: string) => {
    const groupText = `${title}\n\n${description}\n\nBergabunglah dengan grup diskusi EduGenAI!`;
    const whatsappGroupLink = `https://chat.whatsapp.com/${Math.random().toString(36).substring(2, 15)}`;
    return whatsappGroupLink;
  };

  const handlePostDiscussion = () => {
    if (!newPostTitle.trim() || !newPostContent.trim() || !newPostCategory) {
      toast({
        title: 'Error',
        description: 'Harap isi semua kolom yang diperlukan.',
        variant: 'destructive',
      });
      return;
    }

    let whatsappGroupLink = null;
    if (enableWhatsApp) {
      whatsappGroupLink = createWhatsAppGroup(newPostTitle, newPostContent);

      const whatsappCreateUrl = `https://wa.me/?text=${encodeURIComponent(`Halo! Saya membuat grup diskusi "${newPostTitle}" di EduGenAI. Mari bergabung untuk berdiskusi lebih lanjut!`)}`;

      window.open(whatsappCreateUrl, '_blank');
    }

    const newDiscussion = {
      id: discussions.length + 1,
      title: newPostTitle,
      content: newPostContent,
      author: {
        name: 'Ahmad Rizki', // Current user
        role: t('common.student'),
        avatar: '/placeholder.svg?height=40&width=40',
        level: t('common.intermediate'),
      },
      category: postCategories.find((cat) => cat.value === newPostCategory)?.label || newPostCategory,
      tags: newPostTags,
      timestamp: 'Baru saja',
      replies: 0,
      likes: 0,
      views: 1,
      isAnswered: false,
      isTrending: false,
      whatsappGroup: whatsappGroupLink,
      hasWhatsApp: enableWhatsApp,
    };

    setDiscussions([newDiscussion, ...discussions]);

    toast({
      title: 'Berhasil!',
      description: enableWhatsApp ? 'Diskusi berhasil diposting dan grup WhatsApp sedang dibuat!' : 'Diskusi berhasil diposting!',
    });

    setNewPostTitle('');
    setNewPostContent('');
    setNewPostCategory('');
    setNewPostTags([]);
    setEnableWhatsApp(false);
    setShowCreateDiscussion(false);
    setActiveTab('discussions');
  };

  const handleCreateStudyGroup = () => {
    if (!studyGroupName.trim() || !studyGroupDescription.trim() || !studyGroupSubject) {
      toast({
        title: 'Error',
        description: 'Harap isi semua kolom yang diperlukan.',
        variant: 'destructive',
      });
      return;
    }

    const whatsappGroupLink = createWhatsAppGroup(studyGroupName, studyGroupDescription);

    const whatsappCreateUrl = `https://wa.me/?text=${encodeURIComponent(`Halo! Saya membuat grup belajar "${studyGroupName}" di EduGenAI. Mari bergabung untuk belajar bersama!\n\n${studyGroupDescription}`)}`;

    window.open(whatsappCreateUrl, '_blank');

    const newStudyGroup = {
      id: studyGroups.length + 1,
      name: studyGroupName,
      description: studyGroupDescription,
      subject: postCategories.find((cat) => cat.value === studyGroupSubject)?.label || studyGroupSubject,
      members: 1,
      maxMembers: Number.parseInt(studyGroupMaxMembers),
      whatsappGroup: whatsappGroupLink,
      createdBy: 'Ahmad Rizki', // Current user
      createdAt: 'Baru saja',
    };

    setStudyGroups([newStudyGroup, ...studyGroups]);

    toast({
      title: 'Berhasil!',
      description: 'Grup belajar berhasil dibuat dan grup WhatsApp sedang dibuat!',
    });

    setStudyGroupName('');
    setStudyGroupDescription('');
    setStudyGroupSubject('');
    setStudyGroupMaxMembers('10');
    setShowCreateStudyGroup(false);
  };

  const copyWhatsAppLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({
      title: 'Berhasil!',
      description: 'Link grup WhatsApp berhasil disalin!',
    });
  };

  const joinWhatsAppGroup = (link: string, groupName: string) => {
    // Open WhatsApp group directly
    window.open(link, '_blank');

    toast({
      title: 'Bergabung ke WhatsApp!',
      description: `Anda akan diarahkan ke grup WhatsApp "${groupName}". Klik "Gabung Grup" di WhatsApp untuk bergabung.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      <NavigationHeader />

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
            <Users className="h-6 w-6 md:h-8 md:w-8 mr-2 md:mr-3 text-blue-600" />
            {t('community.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">{t('community.subtitle')}</p>
        </div>

        {/* Search and Create Post */}
        <Card className="mb-6">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Cari diskusi, grup belajar, atau topik..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
              </div>
              <Dialog open={showCreateDiscussion} onOpenChange={setShowCreateDiscussion}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Buat Diskusi Baru
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center">
                      <MessageCircle className="h-5 w-5 mr-2 text-blue-600" />
                      Buat Diskusi Baru
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input placeholder="Judul diskusi..." value={newPostTitle} onChange={(e) => setNewPostTitle(e.target.value)} />
                    <Textarea placeholder="Tulis pertanyaan atau topik diskusi Anda..." value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)} rows={4} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Select value={newPostCategory} onValueChange={setNewPostCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {postCategories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Tekan Enter untuk menambah tag..."
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddTag((e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                          }
                        }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {newPostTags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs cursor-pointer hover:bg-red-100 hover:text-red-700" onClick={() => handleRemoveTag(tag)}>
                          #{tag} <X className="h-3 w-3 ml-1" />
                        </Badge>
                      ))}
                    </div>

                    {/* WhatsApp Integration Toggle */}
                    <div className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <MessageSquare className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <div className="flex-1">
                        <Label htmlFor="whatsapp-toggle" className="text-sm font-medium cursor-pointer">
                          Buat Grup WhatsApp
                        </Label>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Otomatis membuat grup WhatsApp untuk diskusi lebih lanjut</p>
                      </div>
                      <Switch id="whatsapp-toggle" checked={enableWhatsApp} onCheckedChange={setEnableWhatsApp} />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowCreateDiscussion(false)}>
                        Batal
                      </Button>
                      <Button onClick={handlePostDiscussion} className="bg-blue-600 hover:bg-blue-700">
                        <Send className="h-4 w-4 mr-2" />
                        Posting Diskusi
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="discussions">Diskusi</TabsTrigger>
                <TabsTrigger value="study-groups">Grup Belajar</TabsTrigger>
                <TabsTrigger value="qa">Tanya Jawab</TabsTrigger>
              </TabsList>

              <TabsContent value="discussions" className="space-y-6">
                {/* Discussion List */}
                <div className="space-y-4">
                  {discussions
                    .filter(
                      (discussion) =>
                        searchQuery === '' ||
                        discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        discussion.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        discussion.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
                    )
                    .map((discussion) => (
                      <Card key={discussion.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4 md:p-6">
                          <div className="flex items-start space-x-4">
                            <Avatar className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
                              <AvatarImage src={discussion.author.avatar || '/placeholder.svg'} />
                              <AvatarFallback>
                                {discussion.author.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h3 className="font-semibold text-base md:text-lg line-clamp-2">{discussion.title}</h3>
                                {discussion.isTrending && (
                                  <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300 text-xs">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    Trending
                                  </Badge>
                                )}
                                {discussion.isAnswered && (
                                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300 text-xs">
                                    <Award className="h-3 w-3 mr-1" />
                                    Terjawab
                                  </Badge>
                                )}
                                {discussion.hasWhatsApp && (
                                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300 text-xs">
                                    <MessageSquare className="h-3 w-3 mr-1" />
                                    WhatsApp
                                  </Badge>
                                )}
                              </div>
                              <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm md:text-base line-clamp-3">{discussion.content}</p>
                              <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-3">
                                <span className="font-medium">{discussion.author.name}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {discussion.author.role}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {discussion.author.level}
                                </Badge>
                                <span className="flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {discussion.timestamp}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 mb-3">
                                <Badge variant="outline" className="text-xs">
                                  {discussion.category}
                                </Badge>
                                {discussion.tags.map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    #{tag}
                                  </Badge>
                                ))}
                              </div>

                              {/* WhatsApp Group Link */}
                              {discussion.hasWhatsApp && discussion.whatsappGroup && (
                                <div className="mb-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <div className="flex items-center space-x-2">
                                      <MessageSquare className="h-4 w-4 text-green-600 flex-shrink-0" />
                                      <div>
                                        <span className="text-sm font-medium text-green-700 dark:text-green-300">Grup WhatsApp Diskusi</span>
                                        <p className="text-xs text-green-600 dark:text-green-400">Bergabung untuk diskusi real-time dan sharing materi</p>
                                      </div>
                                    </div>
                                    <div className="flex space-x-2">
                                      <Button size="sm" variant="outline" onClick={() => copyWhatsAppLink(discussion.whatsappGroup!)} className="text-xs">
                                        <Copy className="h-3 w-3 mr-1" />
                                        Salin
                                      </Button>
                                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs" onClick={() => joinWhatsAppGroup(discussion.whatsappGroup!, discussion.title)}>
                                        <MessageSquare className="h-3 w-3 mr-1" />
                                        Gabung Grup
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}

                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                  <span className="flex items-center">
                                    <MessageCircle className="h-4 w-4 mr-1" />
                                    {discussion.replies}
                                  </span>
                                  <span className="flex items-center">
                                    <ThumbsUp className="h-4 w-4 mr-1" />
                                    {discussion.likes}
                                  </span>
                                  <span className="flex items-center">
                                    <Eye className="h-4 w-4 mr-1" />
                                    {discussion.views}
                                  </span>
                                </div>
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm" className="text-xs bg-transparent">
                                    <Reply className="h-3 w-3 mr-1" />
                                    Balas
                                  </Button>
                                  <Button variant="outline" size="sm" className="text-xs bg-transparent">
                                    <Bookmark className="h-3 w-3" />
                                  </Button>
                                  <Button variant="outline" size="sm" className="text-xs bg-transparent">
                                    <Share2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="study-groups" className="space-y-6">
                {/* Create Study Group Button */}
                <div className="flex justify-end">
                  <Dialog open={showCreateStudyGroup} onOpenChange={setShowCreateStudyGroup}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Buat Grup Belajar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center">
                          <Users className="h-5 w-5 mr-2 text-blue-600" />
                          Buat Grup Belajar Baru
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input placeholder="Nama grup belajar..." value={studyGroupName} onChange={(e) => setStudyGroupName(e.target.value)} />
                        <Textarea placeholder="Deskripsi grup belajar..." value={studyGroupDescription} onChange={(e) => setStudyGroupDescription(e.target.value)} rows={3} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Select value={studyGroupSubject} onValueChange={setStudyGroupSubject}>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih mata pelajaran" />
                            </SelectTrigger>
                            <SelectContent>
                              {postCategories.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value}>
                                  {cat.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select value={studyGroupMaxMembers} onValueChange={setStudyGroupMaxMembers}>
                            <SelectTrigger>
                              <SelectValue placeholder="Maksimal anggota" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5">5 anggota</SelectItem>
                              <SelectItem value="10">10 anggota</SelectItem>
                              <SelectItem value="15">15 anggota</SelectItem>
                              <SelectItem value="20">20 anggota</SelectItem>
                              <SelectItem value="25">25 anggota</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                          <div className="flex items-center space-x-2 mb-2">
                            <MessageSquare className="h-5 w-5 text-green-600" />
                            <span className="font-medium text-green-700 dark:text-green-300">Integrasi WhatsApp</span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Grup WhatsApp akan otomatis dibuat untuk memudahkan komunikasi anggota grup belajar.</p>
                        </div>

                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setShowCreateStudyGroup(false)}>
                            Batal
                          </Button>
                          <Button onClick={handleCreateStudyGroup} className="bg-green-600 hover:bg-green-700">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Buat Grup
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Study Groups List */}
                <div className="space-y-4">
                  {studyGroups
                    .filter(
                      (group) =>
                        searchQuery === '' ||
                        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        group.subject.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((group) => (
                      <Card key={group.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4 md:p-6">
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-2 flex items-center">
                                <Users className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0" />
                                <span className="line-clamp-2">{group.name}</span>
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm md:text-base line-clamp-3">{group.description}</p>
                              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                                <Badge variant="outline" className="text-xs">
                                  {group.subject}
                                </Badge>
                                <span className="text-xs">
                                  {group.members}/{group.maxMembers} anggota
                                </span>
                                <span className="text-xs">Dibuat oleh {group.createdBy}</span>
                                <span className="text-xs">{group.createdAt}</span>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                              <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => joinWhatsAppGroup(group.whatsappGroup, group.name)} disabled={group.members >= group.maxMembers}>
                                <UserPlus className="h-4 w-4 mr-2" />
                                {group.members >= group.maxMembers ? 'Grup Penuh' : 'Gabung Grup'}
                              </Button>
                            </div>
                          </div>

                          {/* WhatsApp Group Info */}
                          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                              <div className="flex items-center space-x-2">
                                <MessageSquare className="h-4 w-4 text-green-600 flex-shrink-0" />
                                <div>
                                  <span className="text-sm font-medium text-green-700 dark:text-green-300">Grup WhatsApp Aktif</span>
                                  <CheckCircle className="h-4 w-4 text-green-600 inline ml-1" />
                                  <p className="text-xs text-green-600 dark:text-green-400">Klik "Gabung Grup" untuk langsung bergabung ke WhatsApp dan mulai belajar bersama!</p>
                                </div>
                              </div>
                              <Button size="sm" variant="outline" onClick={() => copyWhatsAppLink(group.whatsappGroup)} className="text-xs">
                                <Copy className="h-3 w-3 mr-1" />
                                Salin Link
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="qa" className="space-y-6">
                <div className="text-center py-12">
                  <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">Tanya Jawab Komunitas</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">Ajukan pertanyaan dan dapatkan jawaban dari komunitas belajar</p>
                  <Button
                    onClick={() => {
                      setActiveTab('discussions');
                      setShowCreateDiscussion(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajukan Pertanyaan
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">📊 Statistik Komunitas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Anggota</span>
                  <span className="font-semibold">2,847</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Diskusi Aktif</span>
                  <span className="font-semibold">{discussions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Grup Belajar</span>
                  <span className="font-semibold">{studyGroups.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Grup WhatsApp</span>
                  <span className="font-semibold text-green-600">{discussions.filter((d) => d.hasWhatsApp).length + studyGroups.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Online Sekarang</span>
                  <span className="font-semibold text-green-600">234</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">⚡ Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => {
                    setActiveTab('discussions');
                    setShowCreateDiscussion(true);
                  }}
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Ajukan Pertanyaan
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => {
                    setActiveTab('discussions');
                    setShowCreateDiscussion(true);
                  }}
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Bagikan Tips
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => {
                    setActiveTab('study-groups');
                    setShowCreateStudyGroup(true);
                  }}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Buat Grup Belajar
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  onClick={() => {
                    const activeGroups = studyGroups.filter((group) => group.members < group.maxMembers);
                    if (activeGroups.length > 0) {
                      joinWhatsAppGroup(activeGroups[0].whatsappGroup, activeGroups[0].name);
                    }
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Gabung WhatsApp
                </Button>
              </CardContent>
            </Card>

            {/* WhatsApp Integration Info */}
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center text-green-700 dark:text-green-300">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Integrasi WhatsApp
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">Setiap diskusi dan grup belajar terintegrasi langsung dengan WhatsApp untuk komunikasi yang lebih mudah dan real-time.</p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                    <span>Langsung gabung ke grup WhatsApp</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                    <span>Notifikasi real-time</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                    <span>Berbagi file dan materi mudah</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                    <span>Diskusi 24/7 dengan sesama pelajar</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <p className="text-xs text-green-700 dark:text-green-300 font-medium">💡 Tips: Klik tombol "Gabung Grup" untuk langsung diarahkan ke WhatsApp dan bergabung dengan komunitas belajar!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
