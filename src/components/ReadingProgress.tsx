import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

interface ReadingProgressProps {
  showPercentage?: boolean;
}

const ReadingProgress = ({ showPercentage = true }: ReadingProgressProps) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
      setIsVisible(scrollTop > 100);
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <>
      {/* Fixed top progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-muted/50">
        <motion.div
          className="h-full bg-gradient-to-r from-accent via-primary to-accent"
          style={{ width: `${progress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: "easeOut" }}
        />
      </div>

      {/* Floating percentage indicator */}
      <AnimatePresence>
        {isVisible && showPercentage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 hidden md:flex items-center gap-3 
                       px-4 py-3 rounded-full bg-card/95 backdrop-blur-sm 
                       paper-shadow border border-border"
          >
            {/* Circular progress */}
            <div className="relative w-10 h-10">
              <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                {/* Background circle */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  className="stroke-muted"
                  strokeWidth="3"
                />
                {/* Progress circle */}
                <motion.circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  className="stroke-accent"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={97.5}
                  initial={{ strokeDashoffset: 97.5 }}
                  animate={{ strokeDashoffset: 97.5 - (progress / 100) * 97.5 }}
                  transition={{ duration: 0.1, ease: "easeOut" }}
                />
              </svg>
              {/* Center percentage */}
              <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                {Math.round(progress)}
              </span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Reading</span>
              <span className="text-sm font-semibold">{Math.round(progress)}%</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile: Simple bottom bar with percentage */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-4 right-4 z-50 md:hidden"
          >
            <div className="flex items-center gap-3 px-4 py-2 rounded-full 
                          bg-card/95 backdrop-blur-sm paper-shadow border border-border">
              <Progress 
                value={progress} 
                className="flex-1 h-2 bg-muted"
              />
              <span className="text-sm font-medium min-w-[3rem] text-right">
                {Math.round(progress)}%
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ReadingProgress;
