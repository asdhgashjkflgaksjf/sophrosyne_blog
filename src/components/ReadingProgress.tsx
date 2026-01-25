import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, BookmarkCheck, X } from "lucide-react";
import { useReadingBookmark } from "@/hooks/useReadingBookmark";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

interface ReadingProgressProps {
  articleId: string;
  estimatedReadTime?: number;
  showPercentage?: boolean;
}

const ReadingProgress = ({ 
  articleId, 
  estimatedReadTime = 5, 
  showPercentage = true 
}: ReadingProgressProps) => {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);
  const isMobile = useIsMobile();
  
  const lastScrollTop = useRef(0);
  const lastScrollTime = useRef(Date.now());
  
  const { bookmark, saveBookmark, restoreBookmark, hasBookmark } = 
    useReadingBookmark(articleId);

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

  if (!mounted) return null;

  // Mobile: Ultra-minimal - just a tiny progress line at top right
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

        {/* Mobile minimal indicator - small pill at center right */}
        <AnimatePresence>
          {isVisible && showPercentage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed top-1/2 -translate-y-1/2 right-2 z-[70]"
            >
              <div className="flex flex-col items-center gap-1.5 px-1.5 py-2 rounded-full 
                            bg-card/80 backdrop-blur-sm border border-border/50 shadow-sm">
                {/* Mini circular progress */}
                <div className="relative w-7 h-7">
                  <svg className="w-7 h-7 -rotate-90" viewBox="0 0 28 28">
                    <circle
                      cx="14" cy="14" r="11"
                      fill="none"
                      className="stroke-muted/50"
                      strokeWidth="2"
                    />
                    <motion.circle
                      cx="14" cy="14" r="11"
                      fill="none"
                      className="stroke-accent"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray={69}
                      animate={{ strokeDashoffset: 69 - (progress / 100) * 69 }}
                      transition={{ duration: 0.1 }}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold">
                    {Math.round(progress)}
                  </span>
                </div>
                
                {/* Bookmark - only icon */}
                <button
                  onClick={handleSaveBookmark}
                  className="p-1 rounded-full hover:bg-muted/50"
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
      </>,
      document.body,
    );
  }

  // Desktop/Tablet: Compact vertical card at center-right
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
            style={{ top: "calc(50% - 100px)" }}
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

      {/* Desktop indicator - compact at center-right */}
      <AnimatePresence>
        {isVisible && showPercentage && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/2 -translate-y-1/2 right-4 z-[70] flex flex-col items-center gap-2 
                      px-2.5 py-3 rounded-xl bg-card/90 backdrop-blur-sm 
                      border border-border/50 shadow-md"
          >
            {/* Circular progress */}
            <div className="relative w-10 h-10">
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
            </div>

            {/* Bookmark button */}
            <button
              onClick={handleSaveBookmark}
              className="p-1.5 rounded-full hover:bg-muted transition-colors group"
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
    </>,
    document.body,
  );
};

export default ReadingProgress;
