import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { philosopherQuotes, PhilosopherQuote } from "@/data/philosopherQuotes";
import { Quote, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

interface QuoteCarouselProps {
  autoPlayInterval?: number;
  className?: string;
}

const QuoteCarousel = ({ autoPlayInterval = 8000, className = "" }: QuoteCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);

  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % philosopherQuotes.length);
  }, []);

  const goToPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + philosopherQuotes.length) % philosopherQuotes.length);
  }, []);

  const goToIndex = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Auto-rotation
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(timer);
  }, [isPaused, autoPlayInterval, goToNext]);

  const currentQuote = philosopherQuotes[currentIndex];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Quote Container */}
      <div className="relative min-h-[180px] flex items-center justify-center px-4">
        {/* Decorative quote marks */}
        <Quote className="absolute top-0 left-0 w-8 h-8 text-[hsl(var(--accent)/0.3)] rotate-180" />
        <Quote className="absolute bottom-0 right-0 w-8 h-8 text-[hsl(var(--accent)/0.3)]" />

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 },
            }}
            className="text-center px-8"
          >
            {/* Quote text */}
            <blockquote className="font-editorial text-lg md:text-xl lg:text-2xl italic text-foreground leading-relaxed mb-4">
              "{currentQuote.quote}"
            </blockquote>
            
            {/* Author */}
            <div className="space-y-1">
              <p className="font-script text-xl md:text-2xl text-accent">
                — {currentQuote.author}
              </p>
              <p className="font-caps text-[10px] tracking-widest text-muted-foreground">
                {currentQuote.era}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-4 mt-6">
        {/* Prev Button */}
        <button
          onClick={goToPrev}
          className="p-2 hover:bg-muted/60 rounded-full transition-colors"
          aria-label="Previous quote"
        >
          <ChevronLeft className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Dots */}
        <div className="flex items-center gap-2">
          {philosopherQuotes.map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-accent w-6'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              aria-label={`Go to quote ${index + 1}`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={goToNext}
          className="p-2 hover:bg-muted/60 rounded-full transition-colors"
          aria-label="Next quote"
        >
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Pause/Play Button */}
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="p-2 hover:bg-muted/60 rounded-full transition-colors ml-2"
          aria-label={isPaused ? "Play" : "Pause"}
        >
          {isPaused ? (
            <Play className="w-4 h-4 text-muted-foreground" />
          ) : (
            <Pause className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      </div>
    </div>
  );
};

export default QuoteCarousel;
