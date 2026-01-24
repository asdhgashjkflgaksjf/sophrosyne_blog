import { useState, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import HeroSection from "@/components/HeroSection";
import IntroSection from "@/components/IntroSection";
import ArticleSearch from "@/components/ArticleSearch";
import { articles, Article } from "@/data/articles";
import { Send } from "lucide-react";

const Index = () => {
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(articles);

  const handleFilteredArticles = useCallback((filtered: Article[]) => {
    setFilteredArticles(filtered);
  }, []);

  const displayedArticles = filteredArticles.slice(0, 6);

  return (
    <div className="min-h-screen paper-page animate-fade-in">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <HeroSection />

        {/* Intro Section */}
        <IntroSection />

        {/* Featured Articles Grid */}
        <section id="articles" className="py-12">
          <div className="flex items-center justify-between mb-8 animate-slide-up">
            <div>
              <span className="font-caps text-xs tracking-widest text-muted-foreground block mb-2">Curated Reads</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight">Featured Articles</h2>
            </div>
            <a href="#all" className="text-sm font-body font-medium text-muted-foreground hover:text-accent transition-colors px-4 py-2 paper-link">
              View all →
            </a>
          </div>

          {/* Search Component */}
          <ArticleSearch onFilteredArticles={handleFilteredArticles} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedArticles.map((article, index) => (
              <div key={article.id} className={`animate-slide-up stagger-${Math.min(index + 1, 6)}`}>
                <ArticleCard {...article} size="small" />
              </div>
            ))}
          </div>

          {displayedArticles.length === 0 && (
            <div className="paper-section p-12 text-center">
              <p className="font-body text-muted-foreground">Tidak ada artikel yang sesuai dengan pencarian.</p>
            </div>
          )}

          {filteredArticles.length > 6 && (
            <div className="text-center mt-8">
              <a 
                href="#all" 
                className="inline-block px-6 py-3 border border-border hover:border-primary font-body text-sm transition-colors"
              >
                Lihat {filteredArticles.length - 6} artikel lainnya →
              </a>
            </div>
          )}
        </section>

        {/* Newsletter Section with Paper Style */}
        <section className="my-20 paper-section paper-shadow p-12 md:p-16 text-center animate-scale-in relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-4 left-4 w-16 h-20 bg-[hsl(var(--paper-aged))] transform rotate-[-6deg] opacity-20" />
          <div className="absolute bottom-4 right-4 w-12 h-16 bg-[hsl(var(--paper-cream))] transform rotate-[8deg] opacity-30" />
          
          <div className="max-w-2xl mx-auto space-y-8 relative">
            <div className="ornament-divider justify-center">
              <span className="font-script text-2xl text-accent">✉</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight">Stay inspired.</h2>
            <p className="text-xl font-body text-muted-foreground leading-relaxed">
              Subscribe to receive our latest articles and insights directly in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-6 py-4 border border-border bg-[hsl(var(--paper-cream))] font-body focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
              <button className="px-8 py-4 bg-primary text-primary-foreground font-body font-medium paper-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
