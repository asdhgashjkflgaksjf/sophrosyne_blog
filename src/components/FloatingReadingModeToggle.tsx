import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, X } from "lucide-react";

interface FloatingReadingModeToggleProps {
  onClick: () => void;
  isActive?: boolean;
  label?: string;
  exitLabel?: string;
}

const FloatingReadingModeToggle = ({
  onClick,
  isActive = false,
  label = "Reading Mode",
  exitLabel = "Exit",
}: FloatingReadingModeToggleProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  // Don't show when reading mode is active (the reading mode has its own close button)
  if (isActive) return null;

  return createPortal(
    <motion.button
      type="button"
      onClick={onClick}
      className="fixed right-6 z-[80]
                 px-5 py-3 rounded-full
                 bg-primary text-primary-foreground paper-shadow
                 flex items-center justify-center gap-2
                 hover:scale-105 active:scale-95 transition-transform"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 1.5rem)" }}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ delay: 0.35, type: "spring", stiffness: 220, damping: 22 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Open Reading Mode"
    >
      <BookOpen className="w-5 h-5" />
      <span className="text-sm font-medium">{label}</span>

      {/* Subtle glow effect */}
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-full bg-primary/20"
        animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.button>,
    document.body,
  );
};

export default FloatingReadingModeToggle;
