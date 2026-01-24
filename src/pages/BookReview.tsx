import { useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import TornPaperEdge from "@/components/TornPaperEdge";
import { articles } from "@/data/articles";
import { BookOpen, Clock, Library, Star } from "lucide-react";

const BookReview = () => {
  const bookReviewArticles = useMemo(() => 
    articles.filter(article => article.category === "Book Review"),
    []
  );

  const totalReadTime = useMemo(() => 
    bookReviewArticles.reduce((acc, article) => {
      const minutes = parseInt(article.readTime) || 0;
      return acc + minutes;
    }, 0),
    [bookReviewArticles]
  );

  // Featured book (first one)
  const featuredBook = bookReviewArticles[0];
  const otherBooks = bookReviewArticles.slice(1);

  return (
    <div className="min-h-screen paper-page animate-fade-in">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="relative paper-texture paper-stack overflow-hidden mb-12">
          <div className="py-16 px-6 md:px-12 lg:px-16">
            {/* Category badge */}
            <div className="flex items-center justify-center mb-6">
              <span className="tag-book-review px-4 py-2">
                <Library className="w-4 h-4 inline mr-2" />
                Book Review
              </span>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-4">
                Ulasan Buku
              </h1>
              <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Eksplorasi mendalam tentang buku-buku yang membentuk cara kita berpikir,
                dari klasik filosofis hingga karya kontemporer yang menginspirasi.
              </p>
            </div>

            {/* Decorative books illustration */}
            <div className="flex items-center justify-center gap-4 my-8">
              <div className="w-6 h-24 bg-[hsl(var(--primary)/0.8)] rounded-sm transform -rotate-6" />
              <div className="w-8 h-28 bg-[hsl(var(--accent)/0.7)] rounded-sm transform rotate-2" />
              <div className="w-7 h-26 bg-[hsl(var(--sepia)/0.6)] rounded-sm transform -rotate-3" />
              <div className="w-6 h-24 bg-[hsl(var(--primary)/0.5)] rounded-sm transform rotate-6" />
              <div className="w-7 h-26 bg-[hsl(var(--accent)/0.6)] rounded-sm transform -rotate-2" />
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-8 pt-8 border-t border-border">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-accent mb-1">
                  <BookOpen className="w-5 h-5" />
                  <span className="font-display text-2xl font-bold">{bookReviewArticles.length}</span>
                </div>
                <span className="font-caps text-xs tracking-wider text-muted-foreground">Ulasan</span>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-accent mb-1">
                  <Clock className="w-5 h-5" />
                  <span className="font-display text-2xl font-bold">{totalReadTime}</span>
                </div>
                <span className="font-caps text-xs tracking-wider text-muted-foreground">Menit Baca</span>
              </div>
            </div>
          </div>

          <TornPaperEdge position="bottom" />
        </section>

        {/* Featured Review */}
        {featuredBook && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-5 h-5 text-accent fill-accent" />
              <span className="font-caps text-xs tracking-widest text-muted-foreground">Ulasan Unggulan</span>
            </div>
            <ArticleCard {...featuredBook} size="large" />
          </section>
        )}

        {/* Other Reviews Grid */}
        {otherBooks.length > 0 && (
          <section className="py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="font-caps text-xs tracking-widest text-muted-foreground block mb-2">Koleksi</span>
                <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight">Semua Ulasan</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherBooks.map((article, index) => (
                <div key={article.id} className={`animate-slide-up stagger-${Math.min(index + 1, 6)}`}>
                  <ArticleCard {...article} size="small" />
                </div>
              ))}
            </div>
          </section>
        )}

        {bookReviewArticles.length === 0 && (
          <div className="paper-section p-12 text-center">
            <p className="font-body text-muted-foreground">Belum ada ulasan buku di kategori ini.</p>
          </div>
        )}

        {/* Reading Tips Section */}
        <section className="my-16 paper-section paper-shadow p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-4 left-4 w-16 h-20 bg-[hsl(var(--paper-aged))] transform -rotate-6 opacity-20" />
          
          <div className="relative">
            <div className="ornament-divider justify-center mb-6">
              <span className="font-script text-2xl text-accent">📖</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-6">
              Filosofi Membaca
            </h2>
            
            <div className="max-w-3xl mx-auto space-y-4 font-body text-muted-foreground leading-relaxed">
              <p>
                Membaca bukan hanya tentang mengonsumsi informasi. Buku yang baik adalah
                <span className="text-foreground font-medium"> percakapan dengan pikiran-pikiran terbaik </span>
                sepanjang sejarah—kesempatan untuk berdialog dengan Socrates, berargumen dengan Nietzsche,
                atau bermeditasi bersama Marcus Aurelius.
              </p>
              <p>
                Di Sophrosyne, setiap ulasan bukan sekadar ringkasan. Kami mengeksplorasi
                <span className="text-foreground font-medium"> bagaimana ide-ide dalam buku dapat diterapkan </span>
                dalam kehidupan nyata, pertanyaan apa yang mereka ajukan, dan mengapa mereka 
                tetap relevan di era kita.
              </p>
            </div>

            <div className="ornament-divider justify-center mt-8">
              <span className="font-script text-2xl text-accent">✦</span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BookReview;
