// components/HeroSection.jsx
import Link from "next/link";
import React, { useRef, useEffect } from "react";

export default function HeroSection() {
  const videoRef = useRef(null);

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Video background */}
      {/* Letakkan file video di: public/ai.mp4 */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/images/hero-poster.jpg" // optional: taruh fallback di public/images/hero-poster.jpg
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      >
        <source src="/ai.mp4" type="video/mp4" />
        Browser kamu tidak mendukung video HTML5.
      </video>

      {/* Fallback image for small screens to save data */}
      <div
        className="absolute inset-0 bg-cover bg-center md:hidden"
        style={{ backgroundImage: "url('/images/hero-poster.jpg')" }}
        aria-hidden="true"
      />

      {/* Overlay agar teks jelas */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60" />

      {/* Konten hero */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
          Revolusi Pembelajaran <br />
          <span className="text-blue-600">Dengan Kecerdasan Buatan</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-200">
          Platform pembelajaran berkelanjutan yang menggunakan AI untuk
          memberikan pengalaman belajar yang personal, meningkatkan kualitas,
          dan efektivitas pendidikan.
        </p>

        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            <Link href="/login" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
              Mulai Sekarang
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}