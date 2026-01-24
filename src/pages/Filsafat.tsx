import { useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import QuoteCarousel from "@/components/QuoteCarousel";
import TornPaperEdge from "@/components/TornPaperEdge";
import { articles } from "@/data/articles";
import { BookOpen, Clock, Lightbulb } from "lucide-react";

const Filsafat = () => {
  const filsafatArticles = useMemo(() => 
    articles.filter(article => article.category === "Filsafat"),
    []
  );

  const totalReadTime = useMemo(() => 
    filsafatArticles.reduce((acc, article) => {
      const minutes = parseInt(article.readTime) || 0;
      return acc + minutes;
    }, 0),
    [filsafatArticles]
  );

  return (
    <div className="min-h-screen paper-page animate-fade-in">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="relative paper-texture paper-stack overflow-hidden mb-12">
          <div className="py-16 px-6 md:px-12 lg:px-16">
            {/* Category badge */}
            <div className="flex items-center justify-center mb-6">
              <span className="tag-philosophy px-4 py-2">
                <Lightbulb className="w-4 h-4 inline mr-2" />
                Filsafat
              </span>
            </div>

            {/* Title */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-4">
                Eksplorasi Pemikiran
              </h1>
              <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Jelajahi kedalaman pemikiran manusia, dari kebijaksanaan kuno hingga refleksi kontemporer
                tentang makna, kebenaran, dan cara hidup yang baik.
              </p>
            </div>

            {/* Quote Carousel */}
            <div className="max-w-3xl mx-auto">
              <QuoteCarousel />
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-12 pt-8 border-t border-border">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-accent mb-1">
                  <BookOpen className="w-5 h-5" />
                  <span className="font-display text-2xl font-bold">{filsafatArticles.length}</span>
                </div>
                <span className="font-caps text-xs tracking-wider text-muted-foreground">Artikel</span>
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

        {/* Articles Grid */}
        <section className="py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="font-caps text-xs tracking-widest text-muted-foreground block mb-2">Koleksi</span>
              <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight">Artikel Filsafat</h2>
            </div>
          </div>

          {filsafatArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filsafatArticles.map((article, index) => (
                <div key={article.id} className={`animate-slide-up stagger-${Math.min(index + 1, 6)}`}>
                  <ArticleCard {...article} size="small" />
                </div>
              ))}
            </div>
          ) : (
            <div className="paper-section p-12 text-center">
              <p className="font-body text-muted-foreground">Belum ada artikel di kategori ini.</p>
            </div>
          )}
        </section>

        {/* About Philosophy Section */}
        <section className="my-16 paper-section paper-shadow p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-4 right-4 w-20 h-24 bg-[hsl(var(--paper-aged))] transform rotate-6 opacity-20" />
          
          <div className="relative">
            <div className="ornament-divider justify-center mb-6">
              <span className="font-script text-2xl text-accent">✦</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-6">
              Mengapa Filsafat?
            </h2>
            
            <div className="max-w-3xl mx-auto space-y-4 font-body text-muted-foreground leading-relaxed">
              <p>
                Filsafat bukan sekadar mata kuliah abstrak atau diskusi elit. Ia adalah 
                <span className="text-foreground font-medium"> seni bertanya </span>
                yang mendasar—pertanyaan yang seringkali kita hindari dalam kesibukan sehari-hari.
              </p>
              <p>
                Di Sophrosyne, kami percaya bahwa filsafat adalah
                <span className="text-foreground font-medium"> alat praktis </span>
                untuk menghadapi tantangan modern: kecemasan, pencarian makna, dilema etis, 
                dan hubungan dengan diri sendiri dan orang lain.
              </p>
              <p>
                Dari kebijaksanaan Stoik yang membantu menghadapi stres, hingga eksistensialisme 
                yang memberdayakan kita untuk menciptakan makna sendiri—filsafat adalah 
                <span className="text-foreground font-medium"> panduan hidup yang telah teruji waktu</span>.
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

export default Filsafat;
