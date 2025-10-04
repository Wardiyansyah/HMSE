import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Phone, Mail, MapPin, Clock, Send,Target, Users, Award, Lightbulb, Sparkles, Heart, Shield, Zap, Facebook, Twitter, Instagram } from "lucide-react"
import Link from "next/link"

export default function KontakPage() {
  return (
    <main className="min-h-screen bg-gray-900">
      {/* Header */}

      {/* Main Content */}
      <main className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10 rounded-3xl blur-3xl"></div>
            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-blue-600/10 backdrop-blur-sm border border-blue-500/20 rounded-full px-6 py-2 mb-6">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-blue-300 text-sm font-medium">Hubungi Tim Kami</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent mb-6">
                Hubungi Kami
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
                Kami siap membantu Anda dengan pertanyaan atau dukungan yang diperlukan untuk perjalanan pembelajaran
                Anda
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="flex">
              <div className="group relative w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl"></div>
                <div className="relative bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-300 h-full flex flex-col">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-8">
                    Informasi Kontak
                  </h2>

                  <div className="space-y-8 flex-1">
                    <div className="flex items-start gap-4 group/item">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover/item:scale-110 transition-transform duration-200">
                        <Mail className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-3">Email</h3>
                        <p className="text-blue-300 hover:text-blue-200 transition-colors cursor-pointer">
                          support@insanai.id
                        </p>
                        <p className="text-blue-300 hover:text-blue-200 transition-colors cursor-pointer">
                          info@insanai.id
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group/item">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover/item:scale-110 transition-transform duration-200">
                        <Phone className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-3">Telepon</h3>
                        <p className="text-gray-300">+62 21 1234 5678</p>
                        <p className="text-gray-300">+62 812 3456 7890 (WhatsApp)</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group/item">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover/item:scale-110 transition-transform duration-200">
                        <MapPin className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-3">Alamat</h3>
                        <p className="text-gray-300 leading-relaxed">
                          Jl. Teknologi No. 123
                          <br />
                          Jakarta Selatan 12345
                          <br />
                          Indonesia
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group/item">
                      <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover/item:scale-110 transition-transform duration-200">
                        <Clock className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-3">Jam Operasional</h3>
                        <p className="text-gray-300 leading-relaxed">
                          Senin - Jumat: 09:00 - 18:00 WIB
                          <br />
                          Sabtu: 09:00 - 15:00 WIB
                          <br />
                          Minggu: Tutup
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group/item">
                      <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover/item:scale-110 transition-transform duration-200">
                        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-3">Instagram</h3>
                        <a
                          href="https://www.instagram.com/unipem.ac.id/?hl=en"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-300 hover:text-pink-200 transition-colors duration-200 flex items-center gap-2 group/link"
                        >
                          <span>@unipem.ac.id</span>
                          <svg
                            className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transition-opacity duration-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                        <p className="text-gray-400 text-sm mt-1">Ikuti untuk update terbaru</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex">
              <div className="group relative w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl"></div>
                <div className="relative bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300 h-full flex flex-col">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-8">
                    Kirim Pesan
                  </h2>

                  <form className="space-y-6 flex-1">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Nama Lengkap *</label>
                        <Input
                          placeholder="Masukkan nama lengkap"
                          className="bg-gray-700/50 border-gray-600/50 text-white placeholder:text-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20 backdrop-blur-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                        <Input
                          type="email"
                          placeholder="nama@email.com"
                          className="bg-gray-700/50 border-gray-600/50 text-white placeholder:text-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20 backdrop-blur-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Nomor Telepon</label>
                      <Input
                        placeholder="+62 812 3456 7890"
                        className="bg-gray-700/50 border-gray-600/50 text-white placeholder:text-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20 backdrop-blur-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Subjek *</label>
                      <Input
                        placeholder="Subjek pesan Anda"
                        className="bg-gray-700/50 border-gray-600/50 text-white placeholder:text-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20 backdrop-blur-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Kategori</label>
                      <select className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/50 rounded-md text-white backdrop-blur-sm focus:border-blue-500/50 focus:ring-blue-500/20 focus:outline-none">
                        <option value="">Pilih kategori</option>
                        <option value="technical">Dukungan Teknis</option>
                        <option value="account">Masalah Akun</option>
                        <option value="billing">Pembayaran</option>
                        <option value="feature">Permintaan Fitur</option>
                        <option value="other">Lainnya</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Pesan *</label>
                      <Textarea
                        placeholder="Tuliskan pesan atau pertanyaan Anda di sini..."
                        rows={6}
                        className="bg-gray-700/50 border-gray-600/50 text-white placeholder:text-gray-400 focus:border-blue-500/50 focus:ring-blue-500/20 backdrop-blur-sm resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Kirim Pesan
                    </Button>
                  </form>

                  <p className="text-sm text-gray-400 mt-6 text-center">
                    * Wajib diisi. Kami akan merespons dalam 1-2 hari kerja.
                  </p>
                </div>
              </div>
            </div>
          </div>
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
