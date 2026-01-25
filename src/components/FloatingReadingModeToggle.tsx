import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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
  label = "Mode Baca",
  exitLabel = "Keluar",
}: FloatingReadingModeToggleProps) => {
  const [mounted, setMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const ui = useMemo(() => {
    const active = Boolean(isActive);
    return {
      active,
      text: active ? exitLabel : label,
      aria: active ? "Exit Reading Mode" : "Open Reading Mode",
      iconKey: active ? "exit" : "open",
    };
  }, [exitLabel, isActive, label]);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      <motion.button
        key={ui.iconKey}
        type="button"
        onClick={onClick}
        initial={{ y: 100, opacity: 0 }}
        animate={{ 
          y: 0, 
          opacity: 1,
        }}
        exit={{ y: 100, opacity: 0 }}
        transition={
          prefersReducedMotion 
            ? { duration: 0.1 } 
            : { type: "spring", stiffness: 200, damping: 20, delay: 0.2 }
        }
        whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
        whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
        className={`
          fixed z-[120] flex items-center justify-center gap-2
          px-4 py-3 rounded-full
          bg-card/95 text-foreground paper-shadow
          border border-border/70
          transition-colors
          ${ui.active 
            ? 'right-4 sm:right-6 bg-destructive/10 border-destructive/30 hover:bg-destructive/20' 
            : 'right-4 sm:right-6 hover:bg-muted/50'
          }
        `}
        style={{ 
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 1.5rem)",
        }}
        aria-label={ui.aria}
        aria-pressed={ui.active}
      >
        {/* Paper grain overlay */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Icon with swap animation */}
        <motion.span
          key={ui.iconKey + "-icon"}
          initial={prefersReducedMotion ? {} : { opacity: 0, rotate: -20, scale: 0.8 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={prefersReducedMotion ? {} : { opacity: 0, rotate: 20, scale: 0.8 }}
          transition={{ duration: 0.15 }}
          className="relative z-10"
        >
          {ui.active ? (
            <X className="w-5 h-5 text-destructive" />
          ) : (
            <BookOpen className="w-5 h-5 text-accent" />
          )}
        </motion.span>

        {/* Label text */}
        <span className={`relative z-10 text-sm font-medium ${ui.active ? 'text-destructive' : ''}`}>
          {ui.text}
        </span>

        {/* Subtle pulse only when not active */}
        {!ui.active && !prefersReducedMotion && (
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full bg-accent/10"
            animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </motion.button>
    </AnimatePresence>,
    document.body,
  );
};

export default FloatingReadingModeToggle;
