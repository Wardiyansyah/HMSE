const features = [
  {
    name: 'Pembelajaran Personal',
    description: 'AI menganalisis gaya belajar dan kesulitan Anda, kemudian menyesuaikan materi dan kecepatan pembelajaran.',
    icon: '👨‍🎓',
  },
  {
    name: 'Rekomendasi Cerdas',
    description: 'Dapatkan rekomendasi materi tambahan berdasarkan performa dan minat belajar Anda.',
    icon: '🧠',
  },
  {
    name: 'Analisis Kemajuan',
    description: 'Pantau perkembangan belajar dengan laporan detail yang dihasilkan oleh sistem AI kami.',
    icon: '📊',
  },
  {
    name: 'Dukungan 24/7',
    description: 'Asisten virtual AI siap membantu kapan saja dengan pertanyaan dan penjelasan tambahan.',
    icon: '🤖',
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Fitur</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Belajar Lebih Cerdas dengan AI
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Platform kami menggunakan teknologi terkini untuk memberikan pengalaman belajar yang unik dan efektif.
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg text-3xl">
                        {feature.icon}
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{feature.name}</h3>
                    <p className="mt-5 text-base text-gray-500">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;