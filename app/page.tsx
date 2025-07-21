"use client"

import type { NextPage } from 'next';
import Head from 'next/head';
import { NavigationHeader } from '../components/navigation-header';
import HeroSection from '../components/ui/HeroSection';
import FeaturesSection from '../components/ui/FeaturesSection';
import TestimonialsSection from '../components/ui/TestimonialsSection';
import Footer from '../components/ui/Footer';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';
import { useState, useEffect } from 'react';

const Home: NextPage = () => {
    const [chatOpen, setChatOpen] = useState(false);
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);


    const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setMessages((prev) => [...prev, `🧑: ${userMessage}`]);
    setInput('');
    setLoading(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await res.json();
    setMessages((prev) => [...prev, `🤖: ${data.reply}`]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Head>
        <title>EduAI - Platform Pembelajaran Berkelanjutan dengan AI</title>
        <meta name="description" content="Platform pembelajaran berbasis AI untuk pendidikan yang lebih personal dan efektif" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <NavigationHeader/>
      <main>
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
      </main>
      {/* Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        <button onClick={() => setChatOpen(!chatOpen)} className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg">
          <Bot className="w-6 h-6" />
        </button>
        {chatOpen && (
          <div className="mt-2 w-80 p-4 bg-white rounded-xl shadow-xl max-h-[500px] overflow-y-auto">
            <p className="font-semibold text-gray-800 mb-2">Halo! Saya AI Tutor. Apa yang ingin kamu pelajari?</p>
            <div className="text-sm text-gray-700 mb-3 space-y-2">
              {messages.map((msg, i) => (
                <div key={i} className="whitespace-pre-line">{msg}</div>
              ))}
              {loading && <div className="text-gray-400">Mengetik...</div>}
            </div>
            <div className="flex items-center gap-2">
              <input
                className="w-full border px-2 py-1 rounded text-sm"
                value={input}
                placeholder="Tulis pesan..."
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button size="sm" onClick={handleSend} className="bg-blue-500 text-white">Kirim</Button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Home;