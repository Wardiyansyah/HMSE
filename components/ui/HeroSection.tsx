import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Revolusi Pembelajaran</span>
          <span className="block text-blue-600">Dengan Kecerdasan Buatan</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Platform pembelajaran berkelanjutan yang menggunakan AI untuk memberikan pengalaman belajar yang personal, meningkatkan kualitas, dan efektivitas pendidikan.
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            <Link href="/login" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
              Mulai Sekarang
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-16 flex justify-center">
        <div className="relative rounded-lg shadow-xl overflow-hidden w-full max-w-4xl">
          <img className="w-full h-auto" src="/dasboard.png" alt="Preview dashboard EduAI" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
