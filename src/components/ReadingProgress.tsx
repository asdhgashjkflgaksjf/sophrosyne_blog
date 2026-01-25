import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, BookmarkCheck, Clock, X } from "lucide-react";
import { useReadingBookmark } from "@/hooks/useReadingBookmark";
import { toast } from "sonner";

interface ReadingProgressProps {
  articleId: string;
  estimatedReadTime?: number; // in minutes
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
  const [remainingTime, setRemainingTime] = useState(estimatedReadTime);
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);
  
  // Scroll speed tracking
  const lastScrollTop = useRef(0);
  const lastScrollTime = useRef(Date.now());
  const scrollSpeeds = useRef<number[]>([]);
  
  const { bookmark, saveBookmark, restoreBookmark, clearBookmark, hasBookmark } = 
    useReadingBookmark(articleId);

  // Show restore prompt if there's a saved bookmark
  useEffect(() => {
    if (hasBookmark && bookmark && bookmark.progress > 5 && bookmark.progress < 95) {
      setShowRestorePrompt(true);
      // Auto-hide after 8 seconds
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
      
      // Calculate scroll speed
      const now = Date.now();
      const timeDiff = now - lastScrollTime.current;
      
      if (timeDiff > 50) { // Update every 50ms minimum
        const scrollDiff = Math.abs(scrollTop - lastScrollTop.current);
        const speed = scrollDiff / timeDiff; // pixels per ms
        
        // Keep last 10 speed measurements
        scrollSpeeds.current.push(speed);
        if (scrollSpeeds.current.length > 10) {
          scrollSpeeds.current.shift();
        }
        
        // Calculate average speed
        const avgSpeed = scrollSpeeds.current.reduce((a, b) => a + b, 0) / scrollSpeeds.current.length;
        
        // Estimate remaining time based on scroll speed and remaining content
        const remainingPercent = 100 - scrollPercent;
        const remainingPixels = (remainingPercent / 100) * docHeight;
        
        if (avgSpeed > 0) {
          // Time in minutes based on scroll speed
          const estimatedMs = remainingPixels / avgSpeed;
          const estimatedMinutes = Math.ceil(estimatedMs / 60000);
          
          // Blend with original estimate for stability
          const blendedTime = Math.max(0, Math.min(
            estimatedReadTime,
            (estimatedMinutes * 0.3 + (remainingPercent / 100 * estimatedReadTime) * 0.7)
          ));
          
          setRemainingTime(Math.ceil(blendedTime));
        } else {
          // Fall back to linear estimate
          setRemainingTime(Math.ceil((remainingPercent / 100) * estimatedReadTime));
        }
        
        lastScrollTop.current = scrollTop;
        lastScrollTime.current = now;
      }
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, [estimatedReadTime]);

  // Auto-save bookmark periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (progress > 5 && progress < 95) {
        saveBookmark();
      }
    }, 30000); // Save every 30 seconds

    return () => clearInterval(interval);
  }, [progress, saveBookmark]);

  // Save on page leave
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

  const formatTime = (minutes: number) => {
    if (minutes < 1) return "< 1 mnt";
    if (minutes === 1) return "1 mnt";
    return `${minutes} mnt`;
  };

  if (!mounted) return null;

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
            style={{ top: "calc(50% - 128px)" }}
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

      {/* Center-right sticky indicator - All devices */}
      <AnimatePresence>
        {isVisible && showPercentage && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-1/2 -translate-y-1/2 right-4 z-[80] flex flex-col items-center gap-3 
                      px-3 py-4 rounded-2xl bg-card/95 backdrop-blur-md 
                      paper-shadow border border-border"
          >
            {/* Circular progress */}
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  className="stroke-muted"
                  strokeWidth="3"
                />
                <motion.circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  className="stroke-accent"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={125.6}
                  initial={{ strokeDashoffset: 125.6 }}
                  animate={{ strokeDashoffset: 125.6 - (progress / 100) * 125.6 }}
                  transition={{ duration: 0.1, ease: "easeOut" }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                {Math.round(progress)}%
              </span>
            </div>
            
            <div className="w-full h-px bg-border" />
            
            {/* Time remaining */}
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-[10px] font-medium whitespace-nowrap">
                ~{formatTime(remainingTime)}
              </span>
            </div>

            {/* Bookmark button */}
            <button
              onClick={handleSaveBookmark}
              className="p-2 rounded-full hover:bg-muted transition-colors group"
              title="Simpan posisi baca"
            >
              {hasBookmark ? (
                <BookmarkCheck className="w-5 h-5 text-accent" />
              ) : (
                <Bookmark className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
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
