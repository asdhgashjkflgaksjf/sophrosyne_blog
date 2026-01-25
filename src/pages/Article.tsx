import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import Header from "@/components/Header";
import ArticleCard from "@/components/ArticleCard";
import Footer from "@/components/Footer";
import BookReadingMode from "@/components/BookReadingMode";
import TornPaperEdge from "@/components/TornPaperEdge";
import ArticleTOC from "@/components/ArticleTOC";
import ReadingProgress from "@/components/ReadingProgress";
import ArticlePaper, { DropCap, SectionDivider } from "@/components/ArticlePaper";
import { getArticleById, getRelatedArticles } from "@/data/articles";
import { Facebook, Twitter, Linkedin, Link2, ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { usePaperSound } from "@/hooks/usePaperSound";
import FloatingReadingModeToggle from "@/components/FloatingReadingModeToggle";

const Article = () => {
  const { id } = useParams<{ id: string }>();
  const article = id ? getArticleById(id) : undefined;
  const [isReadingMode, setIsReadingMode] = useState(false);
  const { playRustle } = usePaperSound();
  
  if (!article) {
    return <Navigate to="/404" replace />;
  }

  const relatedArticles = getRelatedArticles(article.id);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const handleToggleReadingMode = () => {
    // If already open, treat this as an Exit button.
    if (isReadingMode) {
      playRustle();
      setIsReadingMode(false);
      return;
    }

    // IMPORTANT: scroll FIRST (no smooth) to avoid iOS/body-lock issues.
    playRustle();
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    } catch {
      // noop
    }

    // Open next frame so the scroll position is applied before the modal locks body scroll.
    requestAnimationFrame(() => setIsReadingMode(true));
  };

  const getCategoryClass = (cat: string) => {
    const normalized = cat.toLowerCase();
    if (normalized.includes("financ")) return "tag-financing";
    if (normalized.includes("lifestyle")) return "tag-lifestyle";
    if (normalized.includes("community")) return "tag-community";
    if (normalized.includes("wellness")) return "tag-wellness";
    if (normalized.includes("travel")) return "tag-travel";
    if (normalized.includes("creativ")) return "tag-creativity";
    if (normalized.includes("growth")) return "tag-growth";
    return "tag-lifestyle";
  };

  return (
    <div className="min-h-screen bg-background animate-fade-in paper-page">
      {/* Reading Progress Indicator with integrated TOC */}
      <ReadingProgress 
        articleId={article.id}
        article={article}
        estimatedReadTime={parseInt(article.readTime) || 5}
      />
      
      <Header />
      
      {/* Table of Contents Sidebar - only visible on xl screens */}
      <div className="hidden xl:block">
        <ArticleTOC article={article} />
      </div>
      
      {/* Book Reading Mode */}
      <BookReadingMode 
        article={article} 
        isOpen={isReadingMode} 
        onClose={() => setIsReadingMode(false)} 
      />

      <FloatingReadingModeToggle
        onClick={handleToggleReadingMode}
        isActive={isReadingMode}
        label="Mode Baca"
        exitLabel="Keluar"
      />
      
      <main>
        {/* Back Navigation */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to articles
          </a>
        </div>

        {/* Hero Image with torn edge */}
        <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] mb-12">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          
          {/* Torn paper edge at bottom of hero */}
          <TornPaperEdge position="bottom" variant="rough" />
        </div>

        <ArticlePaper className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
          {/* Article Header */}
          <article className="p-6 md:p-10 lg:p-12">
            <div className="mb-12 animate-slide-up">
              <div className="flex items-center gap-3 mb-6">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getCategoryClass(article.category)}`}>
                  {article.category}
                </span>
                <span className="text-sm text-muted-foreground">{article.date}</span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground">{article.readTime} read</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                {article.title}
              </h1>
            
            <p className="text-xl text-muted-foreground mb-8">
              {article.subtitle}
            </p>

            {/* Author Info */}
            <div className="flex items-center justify-between border-t border-b border-border py-6">
              <div className="flex items-center gap-4">
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{article.author.name}</p>
                  <p className="text-sm text-muted-foreground">{article.author.bio}</p>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="w-10 h-10 rounded-full border border-border hover:border-primary hover:bg-muted transition-all flex items-center justify-center"
                  aria-label="Copy link"
                >
                  <Link2 className="w-4 h-4" />
                </button>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-border hover:border-primary hover:bg-muted transition-all flex items-center justify-center"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-border hover:border-primary hover:bg-muted transition-all flex items-center justify-center"
                  aria-label="Share on Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-border hover:border-primary hover:bg-muted transition-all flex items-center justify-center"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Article Content with section IDs for TOC */}
          <div className="prose prose-lg max-w-none mb-16 animate-slide-up stagger-2">
            <div id="intro" className="mb-10">
              <DropCap>{article.content.introduction}</DropCap>
            </div>

            <SectionDivider />

            {article.content.sections.map((section, index) => (
              <div key={index} id={`section-${index}`} className="mb-10 scroll-mt-24 relative">
                <h2 className="text-3xl font-bold mb-4 font-editorial">{section.heading}</h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {section.content}
                </p>
                {index < article.content.sections.length - 1 && <SectionDivider />}
              </div>
            ))}

            <div id="conclusion" className="mt-12 p-6 md:p-8 rounded-sm bg-muted/50 border-l-4 border-accent scroll-mt-24 relative">
              {/* Quote decoration */}
              <div className="absolute -top-3 left-4 text-5xl font-editorial text-accent/40 leading-none">
                "
              </div>
              <p className="text-lg md:text-xl leading-relaxed italic text-foreground font-editorial pl-4">
                {article.content.conclusion}
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="mb-12 pb-12 border-b border-border">
            <div className="flex flex-wrap gap-3">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 rounded-sm text-sm bg-muted/80 text-foreground 
                           border border-border/50 hover:bg-accent/10 transition-colors cursor-default"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Mobile Share Buttons */}
          <div className="md:hidden mb-12 pb-12 border-b border-border">
            <p className="text-sm font-semibold mb-4">Share this article</p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopyLink}
                className="flex-1 py-3 rounded-full border border-border hover:border-primary hover:bg-muted transition-all flex items-center justify-center gap-2"
              >
                <Link2 className="w-4 h-4" />
                <span className="text-sm">Copy link</span>
              </button>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full border border-border hover:border-primary hover:bg-muted transition-all flex items-center justify-center"
                aria-label="Share on Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full border border-border hover:border-primary hover:bg-muted transition-all flex items-center justify-center"
                aria-label="Share on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Newsletter CTA */}
          <div className="mb-16 rounded-sm bg-muted/50 p-8 md:p-12 text-center border border-border/50">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 font-display">Enjoyed this article?</h3>
            <p className="text-muted-foreground mb-6">
              Subscribe to receive more insights like this directly in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-3 rounded-sm border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-sm px-8">
                Subscribe
              </Button>
            </div>
          </div>
          </article>
        </ArticlePaper>

        {/* Related Articles - with torn edge */}
        <section className="relative bg-muted py-16 animate-fade-in">
          <TornPaperEdge position="top" variant="jagged" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold mb-8 animate-slide-up">You might also like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle, index) => (
                <div key={relatedArticle.id} className={`animate-slide-up stagger-${Math.min(index + 1, 3)}`}>
                  <ArticleCard {...relatedArticle} size="small" />
                </div>
              ))}
            </div>
          </div>
          
          <TornPaperEdge position="bottom" variant="smooth" />
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Article;