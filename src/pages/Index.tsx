import { useState, useCallback, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import HeroSection from "@/components/HeroSection";
import IntroSection from "@/components/IntroSection";
import ArticleSearch from "@/components/ArticleSearch";
import { Article } from "@/data/articles";
import { useArticles } from "@/hooks/useArticles";
import { Send, BookOpen, Feather, Sparkles, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

// Decorative torn paper divider
const TornDivider = () => (
  <div className="relative h-8 my-8 overflow-hidden">
    <svg viewBox="0 0 1200 32" className="w-full h-full" preserveAspectRatio="none">
      <path 
        d="M0,16 Q30,8 60,16 T120,16 T180,16 T240,16 T300,16 T360,16 T420,16 T480,16 T540,16 T600,16 T660,16 T720,16 T780,16 T840,16 T900,16 T960,16 T1020,16 T1080,16 T1140,16 T1200,16"
        stroke="hsl(var(--sepia-light))"
        strokeWidth="1.5"
        strokeDasharray="8 4"
        fill="none"
      />
    </svg>
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4">
      <Feather className="w-5 h-5 text-[hsl(var(--sepia))]" />
    </div>
  </div>
);

// Decorative paper stack element
const PaperStackDecor = ({ position }: { position: "left" | "right" }) => (
  <div className={`absolute ${position === "left" ? "-left-4 rotate-[-8deg]" : "-right-4 rotate-[6deg]"} top-0 hidden lg:block`}>
    <div className="w-16 h-24 bg-[hsl(var(--paper-aged))] paper-shadow opacity-60" />
    <div className="absolute top-2 left-1 w-16 h-24 bg-[hsl(var(--paper-cream))] paper-shadow opacity-40 rotate-2" />
  </div>
);

const ARTICLES_PER_PAGE = 6;

const Index = () => {
  const { articles, isLoading } = useArticles();
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Update filtered articles when articles load
  useEffect(() => {
    setFilteredArticles(articles);
  }, [articles]);

  // Reset to page 1 when filter changes
  const handleFilteredArticles = useCallback((filtered: Article[]) => {
    setFilteredArticles(filtered);
    setCurrentPage(1);
  }, []);

  // Pagination calculations
  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const endIndex = startIndex + ARTICLES_PER_PAGE;
  const displayedArticles = filteredArticles.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to articles section
      document.getElementById('articles')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('ellipsis');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="min-h-screen paper-page animate-fade-in">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <HeroSection />

        {/* Intro Section */}
        <IntroSection />

        {/* Featured Articles Grid */}
        <section id="articles" className="py-12 relative">
          {/* Section header with vintage paper style */}
          <div className="relative mb-10 animate-slide-up">
            {/* Decorative paper stacks */}
            <PaperStackDecor position="left" />
            <PaperStackDecor position="right" />
            
            {/* Header card */}
            <div className="relative bg-[hsl(var(--paper-cream))] border border-[hsl(var(--sepia)/0.2)] p-6 md:p-8">
              {/* Tape decoration */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-[hsl(var(--sepia-light)/0.6)] transform rotate-1" />
              
              {/* Corner decorations */}
              <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-[hsl(var(--sepia)/0.3)]" />
              <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-[hsl(var(--sepia)/0.3)]" />
              <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-[hsl(var(--sepia)/0.3)]" />
              <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-[hsl(var(--sepia)/0.3)]" />
              
              {/* Paper texture */}
              <div 
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
              />
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-[hsl(var(--sepia))]" />
                    <span className="font-caps text-[10px] tracking-[0.2em] text-[hsl(var(--sepia))]">Pilihan Bacaan</span>
                    <Sparkles className="w-3 h-3 text-accent" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
                    Artikel Pilihan
                  </h2>
                  <p className="font-script text-lg text-accent mt-1">Kumpulan tulisan terbaik untuk Anda</p>
                </div>
                
                {/* Page info badge */}
                {totalPages > 1 && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--paper-aged))] border border-[hsl(var(--sepia)/0.2)]">
                    <span className="font-caps text-xs tracking-wider text-[hsl(var(--sepia))]">
                      Halaman {currentPage} dari {totalPages}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Torn paper divider */}
          <TornDivider />

          {/* Search Component */}
          <ArticleSearch articles={articles} onFilteredArticles={handleFilteredArticles} />

          {/* Loading state */}
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-12"
            >
              <div className="relative bg-[hsl(var(--paper-cream))] border border-[hsl(var(--sepia)/0.2)] p-8 text-center">
                <Loader2 className="w-8 h-8 text-accent mx-auto mb-4 animate-spin" />
                <p className="font-editorial text-lg text-[hsl(var(--sepia))]">Memuat artikel...</p>
              </div>
            </motion.div>
          )}

          {/* Articles Grid with masonry-like layout */}
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {displayedArticles.map((article, index) => (
                <motion.div 
                  key={article.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  style={{ 
                    marginTop: index % 3 === 1 ? '2rem' : index % 3 === 2 ? '1rem' : '0',
                  }}
                >
                  <ArticleCard {...article} size="small" />
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty state with vintage style */}
          {!isLoading && displayedArticles.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative bg-[hsl(var(--paper-cream))] border border-[hsl(var(--sepia)/0.2)] p-12 text-center"
            >
              <div 
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
              />
              <Feather className="w-8 h-8 text-[hsl(var(--sepia)/0.4)] mx-auto mb-4" />
              <p className="font-editorial text-lg text-[hsl(var(--sepia))]">
                Tidak ada artikel yang sesuai dengan pencarian.
              </p>
              <p className="font-script text-accent mt-2">Coba kata kunci lain...</p>
            </motion.div>
          )}

          {/* Vintage Paper Pagination */}
          {!isLoading && totalPages > 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12"
            >
              <nav 
                role="navigation" 
                aria-label="Pagination"
                className="relative bg-[hsl(var(--paper-cream))] border border-[hsl(var(--sepia)/0.2)] p-4 md:p-6"
              >
                {/* Paper texture */}
                <div 
                  className="absolute inset-0 opacity-[0.02] pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  }}
                />
                
                {/* Corner decorations */}
                <div className="absolute top-2 left-2 w-4 h-4 border-l border-t border-[hsl(var(--sepia)/0.2)]" />
                <div className="absolute top-2 right-2 w-4 h-4 border-r border-t border-[hsl(var(--sepia)/0.2)]" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-l border-b border-[hsl(var(--sepia)/0.2)]" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-r border-b border-[hsl(var(--sepia)/0.2)]" />
                
                <div className="flex items-center justify-center gap-2 md:gap-3 relative">
                  {/* Previous Button */}
                  <motion.button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`group flex items-center gap-1.5 px-3 py-2 md:px-4 md:py-2.5 border transition-all ${
                      currentPage === 1 
                        ? 'border-[hsl(var(--sepia)/0.1)] text-[hsl(var(--sepia)/0.3)] cursor-not-allowed bg-[hsl(var(--paper-aged)/0.3)]' 
                        : 'border-[hsl(var(--sepia)/0.3)] text-[hsl(var(--sepia))] hover:border-accent hover:text-accent bg-[hsl(var(--paper-aged))]'
                    }`}
                    whileHover={currentPage !== 1 ? { x: -2 } : {}}
                    whileTap={currentPage !== 1 ? { scale: 0.98 } : {}}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline font-caps text-xs tracking-wider">Sebelumnya</span>
                  </motion.button>
                  
                  {/* Page Numbers */}
                  <div className="flex items-center gap-1 md:gap-2">
                    {getPageNumbers().map((page, index) => (
                      page === 'ellipsis' ? (
                        <span 
                          key={`ellipsis-${index}`}
                          className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-[hsl(var(--sepia)/0.4)] font-body"
                        >
                          ···
                        </span>
                      ) : (
                        <motion.button
                          key={page}
                          onClick={() => goToPage(page)}
                          className={`relative w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-body text-sm md:text-base border transition-all ${
                            currentPage === page
                              ? 'border-accent bg-accent text-accent-foreground font-medium'
                              : 'border-[hsl(var(--sepia)/0.2)] text-[hsl(var(--sepia))] hover:border-accent hover:text-accent bg-[hsl(var(--paper-cream))]'
                          }`}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {/* Active page decoration */}
                          {currentPage === page && (
                            <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-4 h-1 bg-[hsl(var(--sepia-light)/0.5)]" />
                          )}
                          {page}
                        </motion.button>
                      )
                    ))}
                  </div>
                  
                  {/* Next Button */}
                  <motion.button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`group flex items-center gap-1.5 px-3 py-2 md:px-4 md:py-2.5 border transition-all ${
                      currentPage === totalPages 
                        ? 'border-[hsl(var(--sepia)/0.1)] text-[hsl(var(--sepia)/0.3)] cursor-not-allowed bg-[hsl(var(--paper-aged)/0.3)]' 
                        : 'border-[hsl(var(--sepia)/0.3)] text-[hsl(var(--sepia))] hover:border-accent hover:text-accent bg-[hsl(var(--paper-aged))]'
                    }`}
                    whileHover={currentPage !== totalPages ? { x: 2 } : {}}
                    whileTap={currentPage !== totalPages ? { scale: 0.98 } : {}}
                  >
                    <span className="hidden sm:inline font-caps text-xs tracking-wider">Selanjutnya</span>
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>
                
                {/* Page info text */}
                <p className="text-center mt-3 font-body text-xs text-[hsl(var(--sepia)/0.5)]">
                  Menampilkan {startIndex + 1}–{Math.min(endIndex, filteredArticles.length)} dari {filteredArticles.length} artikel
                </p>
              </nav>
            </motion.div>
          )}
        </section>

        {/* Newsletter Section with Enhanced Paper Style */}
        <section className="my-20 relative animate-scale-in">
          {/* Background paper layers */}
          <div className="absolute inset-0 bg-[hsl(var(--paper-aged))] transform rotate-1 translate-x-2 translate-y-2" />
          <div className="absolute inset-0 bg-[hsl(var(--paper-cream))] transform -rotate-[0.5deg] translate-x-1 translate-y-1" />
          
          {/* Main newsletter card */}
          <div className="relative bg-[hsl(var(--paper-cream))] border border-[hsl(var(--sepia)/0.2)] p-8 md:p-16 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-4 left-4 w-20 h-24 bg-[hsl(var(--paper-aged))] transform rotate-[-8deg] opacity-30" />
            <div className="absolute bottom-4 right-4 w-16 h-20 bg-[hsl(var(--torn-edge))] transform rotate-[12deg] opacity-40" />
            <div className="absolute top-6 right-8 w-12 h-12 rounded-full border-2 border-dashed border-[hsl(var(--sepia)/0.2)] opacity-50" />
            
            {/* Tape decorations */}
            <div className="absolute -top-1 left-1/4 w-16 h-5 bg-[hsl(var(--sepia-light)/0.5)] transform -rotate-3" />
            <div className="absolute -top-1 right-1/3 w-14 h-5 bg-[hsl(var(--sepia-light)/0.4)] transform rotate-2" />
            
            {/* Corner marks */}
            <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-[hsl(var(--sepia)/0.3)]" />
            <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-[hsl(var(--sepia)/0.3)]" />
            <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-[hsl(var(--sepia)/0.3)]" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-[hsl(var(--sepia)/0.3)]" />
            
            {/* Paper texture */}
            <div 
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            />
            
            <div className="max-w-2xl mx-auto space-y-8 relative text-center">
              {/* Decorative header */}
              <div className="inline-flex items-center gap-3">
                <div className="h-px w-12 bg-[hsl(var(--sepia)/0.3)]" />
                <span className="font-script text-2xl text-accent">✉</span>
                <div className="h-px w-12 bg-[hsl(var(--sepia)/0.3)]" />
              </div>
              
              <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
                Tetap Terinspirasi
              </h2>
              
              <p className="text-lg md:text-xl font-body text-muted-foreground leading-relaxed">
                Berlangganan untuk menerima artikel dan wawasan terbaru langsung ke kotak masuk Anda.
              </p>
              
              {/* Email form with vintage styling */}
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <div className="relative flex-1">
                  <input
                    type="email"
                    placeholder="Alamat email Anda"
                    className="w-full px-6 py-4 bg-[hsl(var(--paper-aged))] border-2 border-[hsl(var(--sepia)/0.3)] font-body focus:outline-none focus:border-accent transition-colors"
                  />
                  <div className="absolute -top-1 left-4 w-8 h-3 bg-[hsl(var(--sepia-light)/0.4)] transform -rotate-2" />
                </div>
                <motion.button 
                  className="px-8 py-4 bg-accent text-accent-foreground font-body font-medium flex items-center justify-center gap-2 border-2 border-accent hover:bg-accent/90 transition-colors"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send className="w-4 h-4" />
                  Langganan
                </motion.button>
              </div>
              
              {/* Trust badge */}
              <p className="text-xs font-caps text-[hsl(var(--sepia)/0.6)] tracking-wider">
                Tanpa spam • Berhenti kapan saja
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
