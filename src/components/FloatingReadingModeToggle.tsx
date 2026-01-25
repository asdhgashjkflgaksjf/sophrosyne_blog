import { useEffect, useMemo, useState } from "react";
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
    <motion.button
      type="button"
      onClick={onClick}
      className={
        `fixed right-6 z-[120]
         px-4 py-3 rounded-full
         bg-card/95 text-foreground paper-shadow paper-texture
         border border-border/70
         flex items-center justify-center gap-2
         hover:scale-105 active:scale-95 transition-transform`
      }
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 1.5rem)" }}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ delay: 0.35, type: "spring", stiffness: 220, damping: 22 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={ui.aria}
      aria-pressed={ui.active}
    >
      {/* Paper grain overlay */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Icon swap */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={ui.iconKey}
          initial={{ opacity: 0, rotate: -18, scale: 0.9 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 18, scale: 0.9 }}
          transition={{ duration: 0.15 }}
          className="relative z-10"
        >
          {ui.active ? <X className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
        </motion.span>
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={ui.text}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 6 }}
          transition={{ duration: 0.15 }}
          className="relative z-10 hidden sm:inline text-sm font-medium"
        >
          {ui.text}
        </motion.span>
      </AnimatePresence>

      {/* Subtle pulse only when not active */}
      {!ui.active && (
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full bg-accent/10"
          animate={{ scale: [1, 1.06, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </motion.button>,
    document.body,
  );
};

export default FloatingReadingModeToggle;
