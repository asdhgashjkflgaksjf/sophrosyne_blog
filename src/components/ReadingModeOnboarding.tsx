import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Hand, ChevronLeft, ChevronRight, BookOpen, MousePointer } from "lucide-react";

const ONBOARDING_STORAGE_KEY = "sophrosyne_reading_mode_onboarding_completed";

interface ReadingModeOnboardingProps {
  isOpen: boolean;
  onComplete: () => void;
}

// Paper grain pattern
const PAPER_GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`;

const tutorialSteps = [
  {
    icon: Hand,
    title: "Swipe untuk Navigasi",
    description: "Geser ke kiri untuk halaman berikutnya, geser ke kanan untuk kembali.",
    animation: "swipe",
  },
  {
    icon: ChevronLeft,
    title: "Tombol Navigasi",
    description: "Gunakan tombol panah di samping halaman untuk berpindah antar halaman.",
    animation: "arrows",
  },
  {
    icon: BookOpen,
    title: "Daftar Isi",
    description: "Ketuk ikon daftar untuk melihat dan melompat ke bagian tertentu.",
    animation: "toc",
  },
  {
    icon: MousePointer,
    title: "Keyboard Shortcut",
    description: "Gunakan ← → untuk navigasi, ESC untuk keluar.",
    animation: "keyboard",
  },
];

export const hasSeenOnboarding = (): boolean => {
  try {
    return localStorage.getItem(ONBOARDING_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

export const markOnboardingComplete = (): void => {
  try {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
  } catch {
    // Storage not available
  }
};

const ReadingModeOnboarding = ({ isOpen, onComplete }: ReadingModeOnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    markOnboardingComplete();
    onComplete();
  };

  const step = tutorialSteps[currentStep];
  const StepIcon = step.icon;

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const cardVariants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: { 
          opacity: 1, 
          scale: 1, 
          y: 0,
          transition: { type: "spring" as const, damping: 25, stiffness: 300 }
        },
        exit: { opacity: 0, scale: 0.95, y: -10 },
      };

  const stepVariants = prefersReducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        hidden: { opacity: 0, x: 30 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, x: -30, transition: { duration: 0.2 } },
      };

  // Swipe gesture animation
  const SwipeAnimation = () => (
    <motion.div 
      className="relative w-24 h-16 mx-auto"
      initial={false}
    >
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center"
        animate={
          prefersReducedMotion
            ? {}
            : {
                x: [0, 40, 0],
                opacity: [1, 0.5, 1],
              }
        }
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Hand className="w-5 h-5 text-accent" />
      </motion.div>
    </motion.div>
  );

  // Arrow navigation animation
  const ArrowAnimation = () => (
    <div className="flex items-center justify-center gap-6">
      <motion.div
        className="w-8 h-8 rounded-full bg-muted/60 flex items-center justify-center"
        animate={
          prefersReducedMotion
            ? {}
            : { scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }
        }
        transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
      >
        <ChevronLeft className="w-4 h-4" />
      </motion.div>
      <div className="w-12 h-16 bg-[hsl(var(--paper-cream))] rounded shadow-sm border border-border" />
      <motion.div
        className="w-8 h-8 rounded-full bg-muted/60 flex items-center justify-center"
        animate={
          prefersReducedMotion
            ? {}
            : { scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }
        }
        transition={{ duration: 1, repeat: Infinity }}
      >
        <ChevronRight className="w-4 h-4" />
      </motion.div>
    </div>
  );

  // TOC animation
  const TOCAnimation = () => (
    <div className="flex gap-3 items-start">
      <motion.div
        className="w-6 h-6 rounded bg-accent/20 flex items-center justify-center"
        animate={
          prefersReducedMotion
            ? {}
            : { scale: [1, 1.1, 1] }
        }
        transition={{ duration: 0.8, repeat: Infinity }}
      >
        <BookOpen className="w-3 h-3 text-accent" />
      </motion.div>
      <div className="flex flex-col gap-1">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="h-2 bg-muted/40 rounded"
            style={{ width: `${60 - i * 10}px` }}
            initial={{ opacity: 0.3 }}
            animate={
              prefersReducedMotion
                ? {}
                : { opacity: [0.3, 0.7, 0.3] }
            }
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );

  // Keyboard animation
  const KeyboardAnimation = () => (
    <div className="flex items-center gap-2">
      {["←", "→", "ESC"].map((key, i) => (
        <motion.div
          key={key}
          className="px-2 py-1 rounded bg-muted/60 font-mono text-xs border border-border"
          animate={
            prefersReducedMotion
              ? {}
              : { y: [0, -3, 0], opacity: [0.6, 1, 0.6] }
          }
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
        >
          {key}
        </motion.div>
      ))}
    </div>
  );

  const renderAnimation = () => {
    switch (step.animation) {
      case "swipe":
        return <SwipeAnimation />;
      case "arrows":
        return <ArrowAnimation />;
      case "toc":
        return <TOCAnimation />;
      case "keyboard":
        return <KeyboardAnimation />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-center justify-center px-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleSkip}
          />

          {/* Card */}
          <motion.div
            className="relative bg-[hsl(var(--paper-cream))] rounded-2xl p-6 max-w-sm w-full paper-shadow overflow-hidden"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Paper grain overlay */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{ backgroundImage: PAPER_GRAIN }}
            />

            {/* Close button */}
            <button
              onClick={handleSkip}
              className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-muted/60 transition-colors z-10"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Header */}
            <div className="text-center mb-4">
              <span className="font-caps text-[10px] tracking-widest text-muted-foreground">
                Panduan Mode Baca
              </span>
            </div>

            {/* Step content with animation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative z-10"
              >
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center">
                    <StepIcon className="w-7 h-7 text-accent" />
                  </div>
                </div>

                {/* Animation demo */}
                <div className="flex justify-center mb-5 h-16">
                  {renderAnimation()}
                </div>

                {/* Text */}
                <div className="text-center mb-6">
                  <h3 className="font-display text-lg font-semibold mb-2">
                    {step.title}
                  </h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-5">
              {tutorialSteps.map((_, i) => (
                <motion.div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentStep
                      ? "w-6 bg-accent"
                      : i < currentStep
                      ? "w-1.5 bg-accent/50"
                      : "w-1.5 bg-muted/50"
                  }`}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleSkip}
                className="flex-1 py-2.5 text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
              >
                Lewati
              </button>
              <motion.button
                onClick={handleNext}
                className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-body font-medium paper-shadow"
                whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
              >
                {currentStep < tutorialSteps.length - 1 ? "Lanjut" : "Mulai Membaca"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReadingModeOnboarding;
