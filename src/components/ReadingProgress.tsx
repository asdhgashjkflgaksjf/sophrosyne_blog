import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Bookmark, BookmarkCheck, X, List } from "lucide-react";
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

// Paper grain SVG for reuse
const PAPER_GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`;

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
  const prefersReducedMotion = useReducedMotion();
  
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
      setIsVisible(scrollTop > 80);
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
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
      setShowTOC(false);
    }
  };

  if (!mounted) return null;

  // Calculate which section index is active for the strip indicator
  const activeIndex = tocItems.findIndex(item => item.id === activeSection);

  // Shared TOC Paper Strip Component
  const TOCPaperStrip = ({ isCompact = false }: { isCompact?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={prefersReducedMotion ? { duration: 0.1 } : { type: "spring", damping: 25, stiffness: 300 }}
      className={`
        relative bg-card/98 backdrop-blur-md rounded-lg border border-border/60 
        paper-shadow overflow-hidden
        ${isCompact ? 'w-[160px]' : 'w-[200px]'}
      `}
    >
      {/* Paper grain */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: PAPER_GRAIN }}
      />
      
      {/* Header */}
      <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-border/50">
        <div className="flex items-center gap-1.5">
          <List className="w-3 h-3 text-muted-foreground" />
          <span className="text-[9px] font-caps text-muted-foreground tracking-wider">Daftar Isi</span>
        </div>
        <button 
          onClick={() => setShowTOC(false)} 
          className="p-0.5 rounded hover:bg-muted/50 transition-colors"
        >
          <X className="w-3 h-3 text-muted-foreground" />
        </button>
      </div>
      
      {/* Progress bar strip */}
      <div className="h-1 bg-muted/50 relative overflow-hidden">
        <motion.div 
          className="absolute inset-y-0 left-0 bg-accent"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.2 }}
        />
        {/* Section markers */}
        <div className="absolute inset-0 flex">
          {tocItems.map((_, idx) => (
            <div 
              key={idx}
              className="flex-1 border-r border-background/50 last:border-r-0"
            />
          ))}
        </div>
      </div>
      
      {/* TOC Items */}
      <nav className={`p-1.5 space-y-0.5 ${isCompact ? 'max-h-[180px]' : 'max-h-[220px]'} overflow-y-auto scrollbar-hide`}>
        {tocItems.map((item, idx) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`
                w-full text-left px-2 py-1.5 rounded text-[10px] transition-all
                flex items-center gap-2 group
                ${isActive 
                  ? 'bg-accent/15 text-accent font-medium' 
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }
              `}
            >
              {/* Section number/dot indicator */}
              <span className={`
                flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold
                transition-colors
                ${isActive 
                  ? 'bg-accent text-accent-foreground' 
                  : 'bg-muted/50 text-muted-foreground group-hover:bg-muted'
                }
              `}>
                {idx + 1}
              </span>
              <span className="line-clamp-1 leading-tight">{item.title}</span>
            </button>
          );
        })}
      </nav>
    </motion.div>
  );

  // Mobile layout
  if (isMobile) {
    return createPortal(
      <>
        {/* Restore bookmark prompt */}
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
                  className="px-2.5 py-1 rounded-full bg-accent text-accent-foreground text-[10px] font-medium"
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

        {/* Mobile progress indicator */}
        <AnimatePresence>
          {isVisible && showPercentage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed top-20 right-2 z-[70]"
            >
              <div className="relative flex flex-col items-center gap-1.5 p-1.5 rounded-xl
                            bg-card/95 backdrop-blur-sm border border-border/60 paper-shadow overflow-hidden">
                {/* Paper grain */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-[0.06]"
                  style={{ backgroundImage: PAPER_GRAIN }}
                />
                
                {/* Circular progress */}
                <button
                  onClick={() => article && setShowTOC(!showTOC)}
                  className="relative z-10 w-9 h-9 flex items-center justify-center"
                >
                  <svg className="w-9 h-9 -rotate-90" viewBox="0 0 36 36">
                    <circle
                      cx="18" cy="18" r="14"
                      fill="none"
                      className="stroke-muted/40"
                      strokeWidth="2.5"
                    />
                    <motion.circle
                      cx="18" cy="18" r="14"
                      fill="none"
                      className="stroke-accent"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray={88}
                      animate={{ strokeDashoffset: 88 - (progress / 100) * 88 }}
                      transition={{ duration: 0.15 }}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold">
                    {Math.round(progress)}
                  </span>
                </button>
                
                {/* TOC button */}
                {article && (
                  <button
                    onClick={() => setShowTOC(!showTOC)}
                    className={`relative z-10 p-1.5 rounded-lg transition-colors ${
                      showTOC ? 'bg-accent/15 text-accent' : 'hover:bg-muted/50 text-muted-foreground'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                )}
                
                {/* Bookmark */}
                <button
                  onClick={handleSaveBookmark}
                  className="relative z-10 p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  {hasBookmark ? (
                    <BookmarkCheck className="w-3.5 h-3.5 text-accent" />
                  ) : (
                    <Bookmark className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile TOC Panel */}
        <AnimatePresence>
          {showTOC && article && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[75]"
              onClick={() => setShowTOC(false)}
            >
              {/* Backdrop */}
              <div className="absolute inset-0 bg-background/50 backdrop-blur-sm" />
              
              {/* Panel */}
              <div 
                className="absolute top-20 right-14"
                onClick={(e) => e.stopPropagation()}
              >
                <TOCPaperStrip isCompact />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>,
      document.body,
    );
  }

  // Desktop/Tablet layout
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

      {/* Desktop indicator */}
      <AnimatePresence>
        {isVisible && showPercentage && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/3 right-4 z-[70] flex flex-col items-center gap-2 
                      p-2 rounded-xl bg-card/95 backdrop-blur-sm 
                      border border-border/60 paper-shadow overflow-hidden"
          >
            {/* Paper grain */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.06]"
              style={{ backgroundImage: PAPER_GRAIN }}
            />
            
            {/* Circular progress */}
            <button
              onClick={() => article && setShowTOC(!showTOC)}
              className="relative z-10 w-11 h-11 group"
              title="Tampilkan daftar isi"
            >
              <svg className="w-11 h-11 -rotate-90" viewBox="0 0 44 44">
                <circle
                  cx="22" cy="22" r="18"
                  fill="none"
                  className="stroke-muted/40"
                  strokeWidth="3"
                />
                <motion.circle
                  cx="22" cy="22" r="18"
                  fill="none"
                  className="stroke-accent"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={113}
                  animate={{ strokeDashoffset: 113 - (progress / 100) * 113 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
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
                className={`relative z-10 p-1.5 rounded-lg transition-colors ${
                  showTOC ? 'bg-accent/20 text-accent' : 'hover:bg-muted text-muted-foreground hover:text-accent'
                }`}
                title="Daftar isi"
              >
                <List className="w-4 h-4" />
              </button>
            )}

            {/* Bookmark button */}
            <button
              onClick={handleSaveBookmark}
              className="relative z-10 p-1.5 rounded-lg hover:bg-muted transition-colors group"
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[65]"
            onClick={() => setShowTOC(false)}
          >
            <div 
              className="absolute top-1/3 right-20"
              onClick={(e) => e.stopPropagation()}
            >
              <TOCPaperStrip />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body,
  );
};

export default ReadingProgress;
