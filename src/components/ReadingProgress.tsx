import { useState, useEffect, useRef, useCallback } from "react";
import { Progress } from "@/components/ui/progress";
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

  return (
    <>
      {/* Fixed top progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1.5 bg-muted/50 backdrop-blur-sm">
        <motion.div
          className="h-full bg-gradient-to-r from-accent via-primary to-accent relative overflow-hidden"
          style={{ width: `${progress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: "easeOut" }}
        >
          {/* Animated shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>

      {/* Restore bookmark prompt */}
      <AnimatePresence>
        {showRestorePrompt && bookmark && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className="fixed top-6 left-1/2 z-50 -translate-x-1/2"
          >
            <div className="flex items-center gap-3 px-5 py-3 rounded-lg 
                          bg-card/98 backdrop-blur-md paper-shadow border border-accent/30
                          paper-texture">
              <Bookmark className="w-5 h-5 text-accent" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">Lanjutkan membaca?</span>
                <span className="text-xs text-muted-foreground">
                  {Math.round(bookmark.progress)}% selesai
                </span>
              </div>
              <button
                onClick={handleRestoreBookmark}
                className="px-3 py-1.5 rounded-md bg-accent text-accent-foreground 
                         text-sm font-medium hover:bg-accent/90 transition-colors"
              >
                Lanjut
              </button>
              <button
                onClick={() => setShowRestorePrompt(false)}
                className="p-1 rounded-md hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop: Floating indicator */}
      <AnimatePresence>
        {isVisible && showPercentage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 hidden md:flex flex-col gap-2"
          >
            {/* Main progress card */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl 
                          bg-card/98 backdrop-blur-md paper-shadow border border-border
                          paper-texture">
              {/* Circular progress */}
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    className="stroke-muted"
                    strokeWidth="3"
                  />
                  <motion.circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    className="stroke-accent"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={88}
                    initial={{ strokeDashoffset: 88 }}
                    animate={{ strokeDashoffset: 88 - (progress / 100) * 88 }}
                    transition={{ duration: 0.1, ease: "easeOut" }}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
                  {Math.round(progress)}
                </span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{Math.round(progress)}% dibaca</span>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>~{formatTime(remainingTime)} lagi</span>
                </div>
              </div>

              {/* Bookmark button */}
              <button
                onClick={handleSaveBookmark}
                className="p-2 rounded-lg hover:bg-muted transition-colors group"
                title="Simpan posisi baca"
              >
                {hasBookmark ? (
                  <BookmarkCheck className="w-5 h-5 text-accent group-hover:scale-110 transition-transform" />
                ) : (
                  <Bookmark className="w-5 h-5 text-muted-foreground group-hover:text-accent group-hover:scale-110 transition-all" />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile: Bottom bar */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-4 right-4 z-50 md:hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl 
                          bg-card/98 backdrop-blur-md paper-shadow border border-border
                          paper-texture">
              <div className="flex-1 flex flex-col gap-1.5">
                <Progress 
                  value={progress} 
                  className="h-2 bg-muted"
                />
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium">{Math.round(progress)}% dibaca</span>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    ~{formatTime(remainingTime)}
                  </span>
                </div>
              </div>
              
              <button
                onClick={handleSaveBookmark}
                className="p-2 rounded-lg bg-muted hover:bg-accent/20 transition-colors"
                title="Simpan posisi baca"
              >
                {hasBookmark ? (
                  <BookmarkCheck className="w-5 h-5 text-accent" />
                ) : (
                  <Bookmark className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ReadingProgress;
