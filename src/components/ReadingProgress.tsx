import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, BookmarkCheck, X, List, ChevronUp } from "lucide-react";
import { useReadingBookmark } from "@/hooks/useReadingBookmark";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Article } from "@/data/articles";

interface ReadingProgressProps {
  articleId: string;
  article?: Article;
  estimatedReadTime?: number;
  showPercentage?: boolean;
}

const ReadingProgress = ({ 
  articleId, 
  article,
  estimatedReadTime = 5, 
  showPercentage = true 
}: ReadingProgressProps) => {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);
  const [showTOC, setShowTOC] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("intro");
  const isMobile = useIsMobile();
  
  const lastScrollTop = useRef(0);
  const lastScrollTime = useRef(Date.now());
  
  const { bookmark, saveBookmark, restoreBookmark, hasBookmark } = 
    useReadingBookmark(articleId);

  // Build TOC items from article
  const tocItems = article ? [
    { id: "intro", title: "Introduction" },
    ...article.content.sections.map((section, index) => ({
      id: `section-${index}`,
      title: section.heading,
    })),
    { id: "conclusion", title: "Conclusion" },
  ] : [];

  useEffect(() => {
    if (hasBookmark && bookmark && bookmark.progress > 5 && bookmark.progress < 95) {
      setShowRestorePrompt(true);
      const timer = setTimeout(() => setShowRestorePrompt(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [hasBookmark, bookmark]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
      setIsVisible(scrollTop > 100);
      
      lastScrollTop.current = scrollTop;
      lastScrollTime.current = Date.now();
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, [estimatedReadTime]);

  // Track active section
  useEffect(() => {
    if (!article) return;
    
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    });

    const timer = setTimeout(() => {
      tocItems.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element) observer.observe(element);
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [article, tocItems]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (progress > 5 && progress < 95) {
        saveBookmark();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [progress, saveBookmark]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (progress > 5 && progress < 95) {
        saveBookmark();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [progress, saveBookmark]);

  const handleSaveBookmark = useCallback(() => {
    saveBookmark();
    toast.success("Posisi baca tersimpan!", {
      description: `${Math.round(progress)}% selesai dibaca`,
      icon: <BookmarkCheck className="w-4 h-4" />,
    });
  }, [saveBookmark, progress]);

  const handleRestoreBookmark = useCallback(() => {
    restoreBookmark();
    setShowRestorePrompt(false);
    toast.success("Melanjutkan dari posisi terakhir", {
      icon: <Bookmark className="w-4 h-4" />,
    });
  }, [restoreBookmark]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
      setShowTOC(false);
    }
  };

  if (!mounted) return null;

  // Mobile: Ultra-minimal with integrated TOC
  if (isMobile) {
    return createPortal(
      <>
        {/* Restore bookmark prompt - mobile */}
        <AnimatePresence>
          {showRestorePrompt && bookmark && (
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-4 left-4 right-4 z-[80]"
            >
              <div className="flex items-center gap-2 px-3 py-2 rounded-full 
                            bg-card/95 backdrop-blur-md paper-shadow border border-accent/30 text-xs">
                <Bookmark className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                <span className="font-medium flex-1">
                  Lanjutkan? ({Math.round(bookmark.progress)}%)
                </span>
                <button
                  onClick={handleRestoreBookmark}
                  className="px-2.5 py-1 rounded-full bg-accent text-accent-foreground 
                           text-[10px] font-medium"
                >
                  Ya
                </button>
                <button
                  onClick={() => setShowRestorePrompt(false)}
                  className="p-1 rounded-full hover:bg-muted"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile minimal indicator with TOC toggle (paper style) */}
        <AnimatePresence>
          {isVisible && showPercentage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed top-1/2 -translate-y-1/2 right-2 z-[70]"
            >
              <div className="relative flex flex-col items-center gap-1 px-1.5 py-2 rounded-full 
                            bg-card/95 backdrop-blur-sm border border-border/60 paper-shadow overflow-hidden">
                {/* Paper grain */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-[0.06]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
                  }}
                />
                {/* Mini circular progress - clickable for TOC */}
                <button
                  onClick={() => article && setShowTOC(!showTOC)}
                  className="relative z-10 w-8 h-8 flex items-center justify-center"
                >
                  <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
                    <circle
                      cx="16" cy="16" r="12"
                      fill="none"
                      className="stroke-muted/50"
                      strokeWidth="2"
                    />
                    <motion.circle
                      cx="16" cy="16" r="12"
                      fill="none"
                      className="stroke-accent"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray={75.4}
                      animate={{ strokeDashoffset: 75.4 - (progress / 100) * 75.4 }}
                      transition={{ duration: 0.1 }}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[7px] font-bold">
                    {Math.round(progress)}
                  </span>
                </button>
                
                {/* TOC icon */}
                {article && (
                  <button
                    onClick={() => setShowTOC(!showTOC)}
                    className={`relative z-10 p-1 rounded-full transition-colors ${showTOC ? 'bg-accent/15' : 'hover:bg-muted/50'}`}
                  >
                    <List className="w-3 h-3 text-muted-foreground" />
                  </button>
                )}
                
                {/* Bookmark */}
                <button
                  onClick={handleSaveBookmark}
                  className="relative z-10 p-1 rounded-full hover:bg-muted/50"
                >
                  {hasBookmark ? (
                    <BookmarkCheck className="w-3 h-3 text-accent" />
                  ) : (
                    <Bookmark className="w-3 h-3 text-muted-foreground" />
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile TOC Panel (paper style) */}
        <AnimatePresence>
          {showTOC && article && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="fixed top-1/2 -translate-y-1/2 right-12 z-[70] max-w-[180px]"
            >
              <div className="relative bg-card/97 backdrop-blur-md rounded-lg border border-border/70 paper-shadow overflow-hidden p-2">
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-[0.06]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
                  }}
                />
                <div className="flex items-center justify-between px-2 py-1 mb-1">
                  <span className="text-[10px] font-caps text-muted-foreground">Contents</span>
                  <button onClick={() => setShowTOC(false)} className="p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <nav className="space-y-0.5 max-h-[200px] overflow-y-auto">
                  {tocItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full text-left px-2 py-1.5 rounded text-[10px] transition-colors ${
                        activeSection === item.id 
                          ? 'bg-accent/10 text-accent' 
                          : 'text-muted-foreground hover:bg-muted'
                      }`}
                    >
                      <span className="line-clamp-1">{item.title}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>,
      document.body,
    );
  }

  // Desktop/Tablet: Compact vertical card with integrated TOC
  return createPortal(
    <>
      {/* Restore bookmark prompt */}
      <AnimatePresence>
        {showRestorePrompt && bookmark && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed right-4 z-[80] max-w-[90vw]"
            style={{ top: "calc(50% - 120px)" }}
          >
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-full 
                          bg-card/98 backdrop-blur-md paper-shadow border border-accent/30">
              <Bookmark className="w-4 h-4 text-accent flex-shrink-0" />
              <span className="text-sm font-medium whitespace-nowrap">
                Lanjutkan? ({Math.round(bookmark.progress)}%)
              </span>
              <button
                onClick={handleRestoreBookmark}
                className="px-3 py-1 rounded-full bg-accent text-accent-foreground 
                         text-xs font-medium hover:bg-accent/90 transition-colors"
              >
                Lanjut
              </button>
              <button
                onClick={() => setShowRestorePrompt(false)}
                className="p-1 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop indicator with TOC (paper style) */}
      <AnimatePresence>
        {isVisible && showPercentage && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/2 -translate-y-1/2 right-4 z-[70] flex flex-col items-center gap-2 
                      px-2 py-2.5 rounded-xl bg-card/95 backdrop-blur-sm 
                      border border-border/60 paper-shadow overflow-hidden"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
              }}
            />
            {/* Circular progress - clickable for TOC */}
            <button
              onClick={() => article && setShowTOC(!showTOC)}
              className="relative z-10 w-10 h-10 group"
              title="Show contents"
            >
              <svg className="w-10 h-10 -rotate-90" viewBox="0 0 40 40">
                <circle
                  cx="20" cy="20" r="16"
                  fill="none"
                  className="stroke-muted"
                  strokeWidth="2.5"
                />
                <motion.circle
                  cx="20" cy="20" r="16"
                  fill="none"
                  className="stroke-accent"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={100.5}
                  animate={{ strokeDashoffset: 100.5 - (progress / 100) * 100.5 }}
                  transition={{ duration: 0.1, ease: "easeOut" }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
                {Math.round(progress)}%
              </span>
            </button>

            {/* TOC button */}
            {article && (
              <button
                onClick={() => setShowTOC(!showTOC)}
                className={`p-1.5 rounded-full transition-colors ${
                  showTOC ? 'bg-accent/20 text-accent' : 'hover:bg-muted text-muted-foreground hover:text-accent'
                }`}
                title="Table of contents"
              >
                <List className="w-4 h-4" />
              </button>
            )}

            {/* Bookmark button */}
            <button
              onClick={handleSaveBookmark}
              className="relative z-10 p-1.5 rounded-full hover:bg-muted transition-colors group"
              title="Simpan posisi baca"
            >
              {hasBookmark ? (
                <BookmarkCheck className="w-4 h-4 text-accent" />
              ) : (
                <Bookmark className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop TOC Panel */}
      <AnimatePresence>
        {showTOC && article && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed top-1/2 -translate-y-1/2 right-20 z-[70] w-[220px]"
          >
            <div className="relative bg-card/98 backdrop-blur-md rounded-lg border border-border/70 paper-shadow overflow-hidden">
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
                }}
              />
              <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <List className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-caps text-muted-foreground">Contents</span>
                </div>
                <button onClick={() => setShowTOC(false)} className="p-1 hover:bg-muted rounded">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              
              {/* Progress bar */}
              <div className="h-0.5 bg-muted">
                <motion.div 
                  className="h-full bg-accent"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <nav className="p-2 space-y-0.5 max-h-[280px] overflow-y-auto">
                {tocItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full text-left px-2.5 py-2 rounded text-xs transition-colors flex items-start gap-2 ${
                      activeSection === item.id 
                        ? 'bg-accent/10 text-accent' 
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      activeSection === item.id ? 'bg-accent' : 'bg-border'
                    }`} />
                    <span className="line-clamp-2 leading-tight">{item.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body,
  );
};

export default ReadingProgress;
