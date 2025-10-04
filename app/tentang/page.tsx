import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Target, Users, Award, Lightbulb, Sparkles, Heart, Shield, Zap, Facebook, Twitter, Instagram } from "lucide-react"
import Link from "next/link"

export default function TentangPage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      
      {/* Main Content */}
      <main className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10 rounded-3xl blur-3xl"></div>
            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-blue-600/10 backdrop-blur-sm border border-blue-500/20 rounded-full px-6 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 text-sm font-medium">Tentang Platform Kami</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent mb-6">
                Tentang InsanAI
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
                Membangun masa depan pendidikan dengan kekuatan kecerdasan buatan yang mengutamakan pembelajaran
                personal dan adaptif
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-20">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Target className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">Misi Kami</h2>
                </div>
                <p className="text-gray-300 leading-relaxed text-lg">
                  InsanAI hadir untuk merevolusi cara belajar dan mengajar dengan memanfaatkan teknologi kecerdasan
                  buatan. Kami percaya bahwa setiap individu memiliki cara belajar yang unik, dan AI dapat membantu
                  mempersonalisasi pengalaman pendidikan untuk mencapai potensi maksimal setiap pembelajar.
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Lightbulb className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">Visi Kami</h2>
                </div>
                <p className="text-gray-300 leading-relaxed text-lg">
                  Menjadi platform pendidikan AI terdepan di Indonesia yang memberdayakan jutaan pembelajar untuk
                  mencapai kesuksesan akademik dan profesional melalui teknologi pembelajaran adaptif dan personal.
                </p>
              </div>
            </div>
          </div>

          <section className="mb-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
                Nilai-Nilai Kami
              </h2>
              <p className="text-gray-400 text-lg">Prinsip-prinsip yang memandu setiap langkah perjalanan kami</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-600/10 rounded-xl blur-lg"></div>
                <div className="relative bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Inovasi Berkelanjutan</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Mengembangkan teknologi AI terbaru untuk pengalaman belajar yang revolusioner
                  </p>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-emerald-600/10 rounded-xl blur-lg"></div>
                <div className="relative bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-green-500/30 transition-all duration-300 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Aksesibilitas</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Pendidikan berkualitas untuk semua, kapan saja dan di mana saja
                  </p>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-xl blur-lg"></div>
                <div className="relative bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-purple-500/30 transition-all duration-300 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Personalisasi</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Pembelajaran yang disesuaikan dengan kebutuhan individual setiap siswa
                  </p>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-red-600/10 rounded-xl blur-lg"></div>
                <div className="relative bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-orange-500/30 transition-all duration-300 text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Kualitas</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Standar tertinggi dalam konten dan pengalaman pembelajaran
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl blur-2xl"></div>
              <div className="relative bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-12 text-center">
                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Tim Kami
                  </h2>
                </div>
                <p className="text-gray-300 leading-relaxed text-xl mb-10 max-w-4xl mx-auto">
                  InsanAI didukung oleh tim ahli teknologi, pendidikan, dan AI yang berpengalaman dalam mengembangkan
                  solusi pembelajaran inovatif. Kami terdiri dari para profesional yang passionate dalam memajukan dunia
                  pendidikan Indonesia.
                </p>
                <div className="flex items-center justify-center gap-6 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl p-6 backdrop-blur-sm border border-blue-500/20">
                  <Award className="w-10 h-10 text-blue-400" />
                  <span className="text-white font-bold text-xl">Dipercaya oleh 10,000+ Pembelajar</span>
                  <Sparkles className="w-8 h-8 text-purple-400" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
            
            {/* ===== FOOTER BARU DIMULAI DI SINI ===== */}
      <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto py-12 px-6">
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-wrap justify-center gap-8 mb-8">
          <Link href="/tentang" className="text-gray-400 hover:text-white transition-colors">
            Tentang
          </Link>
          <Link href="/kebijakan-privasi" className="text-gray-400 hover:text-white transition-colors">
            Kebijakan Privasi
          </Link>
          <Link href="/syarat-ketentuan" className="text-gray-400 hover:text-white transition-colors">
            Syarat & Ketentuan
          </Link>
          <Link href="/kontak" className="text-gray-400 hover:text-white transition-colors">
            Kontak
          </Link>
        </div>

            {/* Social Icons */}
        <div className="mt-8 flex justify-center space-x-6">
          <a href="https://www.facebook.com/profile.php?id=61581391546213" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Facebook</span>
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                clipRule="evenodd"
              />
            </svg>
          </a>
          <a href="https://x.com/Insan_Ai41?t=ThSOxOu9kNHfRWKp8ttIsg&s=08" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Twitter</span>
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </a>
          <a href="https://www.instagram.com/insan_ai41?igsh=czR5bml5Z3R5cnN3" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">Instagram</span>
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>

        <br></br>

            <p className="text-center text-sm text-gray-500">
              © 2025 Insan AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
       {/* ===== FOOTER BARU BERAKHIR DI SINI ===== */}
    </main>
  )
}