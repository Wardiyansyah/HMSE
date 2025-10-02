'use client';

import { CardDescription } from '@/components/ui/card';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { NavigationHeader } from '@/components/navigation-header-student';
import { useLanguage } from '@/lib/language-context';
import { searchYouTubeVideos, type YouTubeVideo } from '@/lib/youtube-api';
import { BookOpen, Search, Download, Play, FileText, Video, Headphones, Star, Clock, Eye, Share2, Bookmark, Youtube, ExternalLink } from 'lucide-react';

export default function Library() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);
  const { t } = useLanguage();

  const categories = [
    { value: 'all', label: t('library.all-categories') },
    { value: 'matematika', label: t('matematika') },
    { value: 'fisika', label: t('fisika') },
    { value: 'kimia', label: t('kimia') },
    { value: 'biologi', label: t('biologi') },
    { value: 'bahasa', label: t('bahasa') },
    { value: 'sejarah', label: t('sejarah') },
    { value: 'geografi', label: t('geografi') },
  ];

  const levels = [
    { value: 'all', label: t('library.all-levels') },
    { value: 'sd', label: t('sd') },
    { value: 'smp', label: t('smp') },
    { value: 'sma', label: t('sma') },
  ];

  // Load videos when category or level changes
  useEffect(() => {
    if (selectedCategory !== 'all' && selectedLevel !== 'all') {
      loadYouTubeVideos();
    }
  }, [selectedCategory, selectedLevel, searchQuery, t]); // Added searchQuery and t to dependencies

  const loadYouTubeVideos = async () => {
    if (selectedCategory === 'all' || selectedLevel === 'all') return;

    setIsLoadingVideos(true);
    try {
      const videos = await searchYouTubeVideos({
        category: selectedCategory,
        level: selectedLevel,
        topic: searchQuery || getCategoryDefaultTopic(selectedCategory),
        maxResults: 12,
      });
      setYoutubeVideos(videos);
    } catch (error) {
      console.error('Error loading YouTube videos:', error);
    } finally {
      setIsLoadingVideos(false);
    }
  };

  const getCategoryDefaultTopic = (category: string): string => {
    const defaultTopics: { [key: string]: string } = {
      matematika: t('matematika'),
      fisika: t('fisika'),
      kimia: t('kimia'),
      biologi: t('biologi'),
      bahasa: t('bahasa'),
      sejarah: t('sejarah'),
      geografi: t('geografi'),
    };
    return defaultTopics[category] || t('common.learning'); // Assuming 'common.learning' exists
  };

  const handleSearch = () => {
    if (selectedCategory !== 'all' && selectedLevel !== 'all') {
      loadYouTubeVideos();
    }
  };

  const featuredContent = [
    {
      id: 1,
      title: 'Panduan Lengkap Fotosintesis',
      description: 'Materi komprehensif tentang proses fotosintesis dengan animasi 3D dan eksperimen virtual',
      category: t('subject.biologi'),
      level: t('level.smp'),
      type: 'Interactive',
      duration: '45 menit',
      rating: 4.8,
      views: 1250,
      downloads: 340,
      thumbnail: '/placeholder.svg?height=200&width=300',
      author: 'Dr. Sari Biologi',
      isBookmarked: true,
    },
    {
      id: 2,
      title: 'Hukum Newton dalam Kehidupan Sehari-hari',
      description: 'Video pembelajaran interaktif yang menjelaskan aplikasi hukum Newton dengan contoh nyata',
      category: t('subject.fisika'),
      level: t('level.sma'),
      type: 'Video',
      duration: '30 menit',
      rating: 4.9,
      views: 2100,
      downloads: 580,
      thumbnail: '/placeholder.svg?height=200&width=300',
      author: 'Prof. Ahmad Fisika',
      isBookmarked: false,
    },
    {
      id: 3,
      title: 'Aljabar Linear untuk Pemula',
      description: 'E-book interaktif dengan latihan soal dan pembahasan step-by-step',
      category: t('subject.matematika'),
      level: t('level.sma'),
      type: 'E-book',
      duration: '2 jam',
      rating: 4.7,
      views: 890,
      downloads: 220,
      thumbnail: '/placeholder.svg?height=200&width=300',
      author: 'Drs. Budi Matematika',
      isBookmarked: true,
    },
  ];

  const recentContent = [
    {
      id: 4,
      title: 'Sejarah Kemerdekaan Indonesia',
      category: t('subject.sejarah'),
      level: t('level.smp'),
      type: 'Audio',
      duration: '25 menit',
      rating: 4.6,
      author: 'Dra. Siti Sejarah',
    },
    {
      id: 5,
      title: 'Tata Bahasa Indonesia Modern',
      category: t('subject.bahasa'),
      level: t('level.sma'),
      type: 'PDF',
      duration: '1.5 jam',
      rating: 4.5,
      author: 'Prof. Andi Bahasa',
    },
    {
      id: 6,
      title: 'Kimia Organik Dasar',
      category: t('subject.kimia'),
      level: t('level.sma'),
      type: 'Interactive',
      duration: '40 menit',
      rating: 4.8,
      author: 'Dr. Maya Kimia',
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Video':
        return <Video className="h-4 w-4" />;
      case 'Audio':
        return <Headphones className="h-4 w-4" />;
      case 'PDF':
        return <FileText className="h-4 w-4" />;
      case 'E-book':
        return <BookOpen className="h-4 w-4" />;
      case 'Interactive':
        return <Play className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Video':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300';
      case 'Audio':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300';
      case 'PDF':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300';
      case 'E-book':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300';
      case 'Interactive':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return t('common.today');
    if (diffInDays === 1) return t('common.one-day-ago');
    if (diffInDays < 7) return t('common.days-ago', { count: diffInDays });
    if (diffInDays < 30) return t('common.weeks-ago', { count: Math.floor(diffInDays / 7) });
    return t('common.months-ago', { count: Math.floor(diffInDays / 30) });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-black">
      <NavigationHeader />

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
            <BookOpen className="h-6 w-6 md:h-8 md:w-8 mr-2 md:mr-3 text-blue-600" />
            {t('library.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">{t('library.subtitle')}</p>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder={t('library.search')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSearch()} className="pl-10" />
              </div>
              <div className="flex gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleSearch} disabled={selectedCategory === 'all'}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Youtube className="h-5 w-5 mr-2 text-red-600" />
                  {t('library.youtube')}
                </CardTitle>
                <CardDescription>Video berkualitas tinggi dari channel edukasi terpercaya, dipilih berdasarkan kategori dan level</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedCategory === 'all' || selectedLevel === 'all' ? (
                  <div className="text-center py-12">
                    <Youtube className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">{t('library.select-category-level')}</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">{t('library.select-category-level-description')}</p>
                  </div>
                ) : isLoadingVideos ? (
                  <div className="text-center py-12">
                    <Youtube className="h-16 w-16 text-red-600 mx-auto mb-4 animate-pulse" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('common.searching-videos')}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('library.searching-videos-description', {
                        category: selectedCategory,
                        level: selectedLevel,
                      })}
                    </p>
                  </div>
                ) : youtubeVideos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {youtubeVideos.map((video) => (
                      <Card key={video.id} className="hover:shadow-lg transition-shadow">
                        <div className="relative">
                          <img src={video.thumbnail || '/placeholder.svg'} alt={video.title} className="w-full h-48 object-cover rounded-t-lg" />
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">{video.duration}</div>
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-red-600 text-white">
                              <Youtube className="h-3 w-3 mr-1" />
                              YouTube
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{video.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{video.description}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                            <span className="font-medium">{video.channelTitle}</span>
                            <span className="flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              {video.viewCount}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{formatTimeAgo(video.publishedAt)}</p>
                          <div className="flex space-x-2">
                            <Button className="flex-1" size="sm" asChild>
                              <a href={video.url} target="_blank" rel="noopener noreferrer">
                                <Play className="h-4 w-4 mr-2" />
                                {t('common.watch')}
                              </a>
                            </Button>
                            <Button variant="outline" size="sm">
                              <Bookmark className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <a href={video.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Youtube className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">{t('library.no-videos-found')}</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">{t('library.no-videos-found-description')}</p>
                    <Button onClick={loadYouTubeVideos}>
                      <Search className="h-4 w-4 mr-2" />
                      {t('common.search-again')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
      </div>
    </div>
  );
}
