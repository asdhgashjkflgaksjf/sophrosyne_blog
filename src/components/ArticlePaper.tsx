import { ReactNode } from "react";
import { motion } from "framer-motion";

interface ArticlePaperProps {
  children: ReactNode;
  className?: string;
}

// Enhanced paper-style wrapper for article content
const ArticlePaper = ({ children, className = "" }: ArticlePaperProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`relative ${className}`}
    >
      {/* Main paper container */}
      <div className="relative bg-card rounded-sm overflow-hidden paper-shadow">
        {/* Paper texture overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            mixBlendMode: 'multiply',
          }}
        />
        
        {/* Paper grain lines */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                hsl(var(--sepia)) 2px,
                hsl(var(--sepia)) 4px
              )
            `,
          }}
        />

        {/* Paper fiber effect */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%238B7355' stroke-width='0.3' opacity='0.08'%3E%3Cpath d='M10 20 Q 30 15, 50 25 T 90 20'/%3E%3Cpath d='M5 45 Q 25 50, 45 40 T 95 45'/%3E%3Cpath d='M15 70 Q 35 65, 55 75 T 85 70'/%3E%3Cpath d='M0 90 Q 20 85, 40 95 T 100 90'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px',
          }}
        />

        {/* Top aged edge */}
        <div 
          className="absolute top-0 left-0 right-0 h-8 pointer-events-none"
          style={{
            background: `linear-gradient(
              to bottom,
              hsl(var(--paper-aged) / 0.6) 0%,
              transparent 100%
            )`,
          }}
        />

        {/* Left margin line (like notebook) */}
        <div 
          className="absolute top-0 bottom-0 left-12 md:left-16 w-px pointer-events-none hidden md:block"
          style={{
            background: `linear-gradient(
              to bottom,
              transparent 0%,
              hsl(var(--ink-red) / 0.15) 5%,
              hsl(var(--ink-red) / 0.15) 95%,
              transparent 100%
            )`,
          }}
        />

        {/* Subtle page shadow on left */}
        <div 
          className="absolute top-0 bottom-0 left-0 w-4 pointer-events-none"
          style={{
            background: `linear-gradient(
              to right,
              hsl(var(--paper-shadow) / 0.05) 0%,
              transparent 100%
            )`,
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Bottom aged edge */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
          style={{
            background: `linear-gradient(
              to top,
              hsl(var(--paper-aged) / 0.4) 0%,
              transparent 100%
            )`,
          }}
        />

        {/* Corner fold effect */}
        <div 
          className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none"
          style={{
            background: `linear-gradient(
              315deg,
              hsl(var(--background)) 0%,
              hsl(var(--background)) 50%,
              transparent 50%
            )`,
            filter: 'drop-shadow(-2px -2px 3px hsl(var(--paper-shadow) / 0.15))',
          }}
        />
      </div>
    </motion.div>
  );
};

// Drop cap component for first letter
export const DropCap = ({ children }: { children: string }) => {
  const firstLetter = children.charAt(0);
  const rest = children.slice(1);

  return (
    <p className="text-lg leading-relaxed text-muted-foreground">
      <span 
        className="float-left font-display text-6xl md:text-7xl leading-[0.8] 
                   pr-3 pt-1 text-primary"
        style={{ fontWeight: 900 }}
      >
        {firstLetter}
      </span>
      {rest}
    </p>
  );
};

// Pull quote component
export const PullQuote = ({ children, author }: { children: string; author?: string }) => {
  return (
    <blockquote className="my-8 md:my-12 mx-4 md:mx-8 relative">
      {/* Decorative quote marks */}
      <div 
        className="absolute -top-4 -left-2 text-6xl font-editorial text-accent/30 leading-none"
        aria-hidden="true"
      >
        "
      </div>
      
      <div className="pl-6 border-l-4 border-accent">
        <p className="font-editorial text-xl md:text-2xl italic leading-relaxed text-sepia">
          {children}
        </p>
        {author && (
          <footer className="mt-3 text-sm text-muted-foreground font-script text-lg">
            — {author}
          </footer>
        )}
      </div>
    </blockquote>
  );
};

// Section divider
export const SectionDivider = () => {
  return (
    <div className="my-10 md:my-14 flex items-center justify-center gap-4">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="flex items-center gap-2 text-sepia">
        <span className="text-lg">✦</span>
        <span className="text-sm">✦</span>
        <span className="text-lg">✦</span>
      </div>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-border to-transparent" />
    </div>
  );
};

// Margin note component
export const MarginNote = ({ children }: { children: ReactNode }) => {
  return (
    <aside className="hidden lg:block absolute right-[-200px] w-44 text-sm text-muted-foreground italic">
      <div className="p-3 bg-paper-aged/30 rounded-sm border-l-2 border-accent/30">
        {children}
      </div>
    </aside>
  );
};

export default ArticlePaper;
