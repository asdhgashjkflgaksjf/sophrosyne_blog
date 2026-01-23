import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Instagram, Twitter, BookOpen, Feather, Quote } from "lucide-react";

const Authors = () => {
  const author = {
    name: "Farhan",
    role: "Penulis & Pemikir",
    bio: "Seorang pencari makna yang menemukan ketenangan dalam filsafat dan kebijaksanaan dalam halaman-halaman buku. Melalui tulisan, saya berbagi refleksi tentang kehidupan, stoikisme, dan pelajaran dari karya-karya besar yang telah membentuk cara saya memandang dunia.",
    longBio: "Perjalanan saya dimulai dari rasa ingin tahu yang sederhana—mengapa kita ada di sini, dan bagaimana seharusnya kita hidup? Pertanyaan-pertanyaan ini membawa saya menyelami filsafat Yunani kuno, kebijaksanaan Stoik, dan pemikiran-pemikiran eksistensialis. Setiap buku yang saya baca menjadi percakapan dengan pemikir-pemikir besar lintas zaman. Di Sophrosyne, saya ingin berbagi percakapan-percakapan itu dengan Anda—bukan sebagai guru, tetapi sebagai sesama pencari yang berjalan di jalan yang sama.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80",
    expertise: ["Filsafat", "Book Review", "Refleksi", "Stoikisme"],
    favoriteQuote: "Kita tidak bisa mengontrol apa yang terjadi pada kita, tapi kita bisa mengontrol bagaimana kita merespons.",
    quoteAuthor: "Epictetus",
    articles: 47,
    booksReviewed: 156,
  };

  return (
    <div className="min-h-screen paper-page animate-fade-in">
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16 animate-slide-down">
          <div className="ornament-divider justify-center mb-6">
            <span className="font-script text-2xl text-accent">✦</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-4">
            Tentang Penulis
          </h1>
          <p className="text-lg text-muted-foreground font-editorial italic max-w-2xl mx-auto">
            Di balik setiap kata, ada jiwa yang mencari dan berbagi
          </p>
        </section>

        {/* Author Card */}
        <section className="paper-section paper-shadow p-8 md:p-12 mb-16 animate-scale-in">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Photo */}
            <div className="flex-shrink-0 mx-auto lg:mx-0">
              <div className="relative">
                <img
                  src={author.image}
                  alt={author.name}
                  className="w-48 h-48 md:w-56 md:h-56 rounded-sm object-cover border-4 border-border paper-shadow"
                />
                <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-primary flex items-center justify-center paper-shadow">
                  <Feather className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">{author.name}</h2>
              <p className="font-editorial text-xl text-accent italic mb-4">{author.role}</p>
              
              {/* Stats */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Feather className="w-4 h-4 text-muted-foreground" />
                  <span className="font-body text-sm">
                    <strong className="text-foreground">{author.articles}</strong> artikel
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <span className="font-body text-sm">
                    <strong className="text-foreground">{author.booksReviewed}</strong> buku direview
                  </span>
                </div>
              </div>

              {/* Expertise tags */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                {author.expertise.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 text-xs font-caps tracking-wider bg-[hsl(var(--paper-aged))] border border-border"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Bio */}
              <p className="font-body text-muted-foreground leading-relaxed mb-4">
                {author.bio}
              </p>

              {/* Social links */}
              <div className="flex justify-center lg:justify-start gap-3 mt-6">
                <a
                  href="mailto:farhan@sophrosyne.id"
                  className="floating-button w-10 h-10"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
                <a
                  href="#twitter"
                  className="floating-button w-10 h-10"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="#instagram"
                  className="floating-button w-10 h-10"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="paper-note p-8 md:p-12 text-center mb-16 animate-slide-up stagger-2">
          <Quote className="w-10 h-10 text-accent/40 mx-auto mb-4" />
          <blockquote className="font-editorial text-xl md:text-2xl italic text-[hsl(var(--sepia))] leading-relaxed max-w-3xl mx-auto mb-4">
            "{author.favoriteQuote}"
          </blockquote>
          <cite className="font-caps text-sm tracking-wider text-muted-foreground">
            — {author.quoteAuthor}
          </cite>
        </section>

        {/* Extended Bio */}
        <section className="paper-section paper-shadow p-8 md:p-12 mb-16 animate-slide-up stagger-3">
          <h3 className="font-display text-2xl font-bold mb-6 text-center">Perjalanan Saya</h3>
          <div className="prose prose-lg max-w-none">
            <p className="font-body text-muted-foreground leading-relaxed text-center max-w-3xl mx-auto">
              {author.longBio}
            </p>
          </div>
        </section>

        {/* Topics Section */}
        <section className="grid md:grid-cols-2 gap-6 mb-16">
          <div className="paper-note p-6 animate-slide-up stagger-4">
            <h4 className="font-caps text-xs tracking-widest text-muted-foreground mb-3">Filsafat</h4>
            <p className="font-body text-sm leading-relaxed">
              Eksplorasi mendalam tentang stoikisme, eksistensialisme, dan kebijaksanaan kuno yang relevan untuk kehidupan modern.
            </p>
          </div>
          <div className="paper-note p-6 animate-slide-up stagger-5">
            <h4 className="font-caps text-xs tracking-widest text-muted-foreground mb-3">Book Review</h4>
            <p className="font-body text-sm leading-relaxed">
              Ulasan jujur dan reflektif tentang buku-buku yang telah mengubah cara saya berpikir dan hidup.
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-12 paper-section paper-shadow animate-scale-in">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">Mari Berdiskusi</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto font-body">
            Punya pertanyaan tentang filsafat, rekomendasi buku, atau sekadar ingin berbagi pemikiran? 
            Saya selalu senang mendengar dari pembaca.
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 bg-primary text-primary-foreground font-body font-medium paper-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
          >
            Hubungi Saya
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Authors;
