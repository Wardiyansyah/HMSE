const testimonials = [
  {
    id: 1,
    quote: "Dengan sistem rekomendasi AI-nya, saya bisa fokus pada materi yang benar-benar saya butuhkan. Waktu belajar saya menjadi jauh lebih efisien.",
    attribution: 'Sarah Wijaya, Mahasiswa Teknik',
  },
  {
    id: 2,
    quote: "Sebagai guru, saya sangat terbantu dengan analisis yang diberikan platform ini. Saya bisa mengetahui dengan tepat bagian mana yang sulit dipahami siswa.",
    attribution: 'Budi Santoso, Guru Matematika',
  },
  {
    id: 3,
    quote: "Anak saya yang biasanya malas belajar sekarang jadi antusias karena materinya disesuaikan dengan minat dan kemampuannya.",
    attribution: 'Dewi Anggraeni, Orang Tua Siswa',
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-12">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Testimoni</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Apa Kata Pengguna Kami
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-8 rounded-lg shadow">
              <blockquote className="text-lg text-gray-600">
                <p>"{testimonial.quote}"</p>
              </blockquote>
              <div className="mt-4">
                <p className="text-base font-medium text-gray-900">{testimonial.attribution}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;