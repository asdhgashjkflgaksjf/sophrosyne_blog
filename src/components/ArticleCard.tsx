import { ArrowUpRight, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

interface ArticleCardProps {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
  size?: "small" | "large";
}

// Paper clip SVG component
const PaperClip = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 60" 
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M12 2C7.58 2 4 5.58 4 10v35c0 6.63 5.37 12 12 12s12-5.37 12-12V14h-4v31c0 4.41-3.59 8-8 8s-8-3.59-8-8V10c0-2.21 1.79-4 4-4s4 1.79 4 4v30c0 1.1-.9 2-2 2s-2-.9-2-2V14h-4v26c0 3.31 2.69 6 6 6s6-2.69 6-6V10c0-4.42-3.58-8-8-8z"
      fill="currentColor"
    />
  </svg>
);

// Vintage stamp decoration
const VintageStamp = ({ category }: { category: string }) => (
  <div className="absolute -top-2 -right-2 w-16 h-16 rotate-12 opacity-80 pointer-events-none">
    <div className="w-full h-full rounded-full border-2 border-dashed border-[hsl(var(--sepia)/0.5)] flex items-center justify-center bg-[hsl(var(--paper-cream)/0.9)]">
      <div className="text-[8px] font-caps text-[hsl(var(--sepia))] text-center leading-tight px-1">
        {category.slice(0, 8).toUpperCase()}
      </div>
    </div>
  </div>
);

const ArticleCard = ({ id, title, category, date, image, size = "small" }: ArticleCardProps) => {
  const getCategoryClass = (cat: string) => {
    const normalized = cat.toLowerCase();
    if (normalized.includes("financ")) return "tag-financing";
    if (normalized.includes("lifestyle")) return "tag-lifestyle";
    if (normalized.includes("community")) return "tag-community";
    if (normalized.includes("wellness")) return "tag-wellness";
    if (normalized.includes("filsafat") || normalized.includes("philosophy")) return "tag-philosophy";
    if (normalized.includes("book review")) return "tag-book-review";
    if (normalized.includes("creativ")) return "tag-creativity";
    if (normalized.includes("growth")) return "tag-growth";
    return "tag-lifestyle";
  };

  return (
    <motion.a
      href={`/article/${id}`}
      className={`group relative block bg-[hsl(var(--paper-cream))] overflow-visible ${
        size === "large" ? "col-span-1 md:col-span-2 row-span-2" : ""
      }`}
      whileHover={{ rotate: -0.5, y: -4 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Paper stack effect - multiple layers */}
      <div className="absolute inset-0 bg-[hsl(var(--paper-aged))] transform translate-x-1 translate-y-1 -z-10 rounded-sm" />
      <div className="absolute inset-0 bg-[hsl(var(--paper-cream)/0.8)] transform translate-x-2 translate-y-2 -z-20 rounded-sm" />
      <div className="absolute inset-0 bg-[hsl(var(--torn-edge))] transform translate-x-3 translate-y-3 rotate-[0.5deg] -z-30 rounded-sm" />
      
      {/* Main card container */}
      <div className="relative paper-shadow rounded-sm overflow-hidden border border-[hsl(var(--border)/0.5)]">
        {/* Paper clip decoration - only on odd cards */}
        {parseInt(id) % 2 === 1 && (
          <div className="absolute -top-3 left-6 z-20 text-[hsl(var(--sepia)/0.6)]">
            <PaperClip className="w-5 h-12" />
          </div>
        )}

        {/* Vintage stamp */}
        <VintageStamp category={category} />
        
        {/* Image container with vintage photo style */}
        <div className="relative aspect-[4/3] overflow-hidden m-3 mb-0">
          {/* Photo frame border */}
          <div className="absolute inset-0 border-4 border-[hsl(var(--paper-aged))] z-10 pointer-events-none" />
          
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Vintage sepia overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--paper-shadow)/0.6)] via-[hsl(var(--sepia)/0.15)] to-[hsl(var(--sepia)/0.05)] mix-blend-multiply" />
          
          {/* Film grain effect */}
          <div 
            className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
          
          {/* Corner photo mount */}
          <div className="absolute top-0 left-0 w-6 h-6 bg-[hsl(var(--paper-aged))] z-10" 
            style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} 
          />
          <div className="absolute top-0 right-0 w-6 h-6 bg-[hsl(var(--paper-aged))] z-10" 
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }} 
          />
          <div className="absolute bottom-0 left-0 w-6 h-6 bg-[hsl(var(--paper-aged))] z-10" 
            style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }} 
          />
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-[hsl(var(--paper-aged))] z-10" 
            style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }} 
          />
        </div>
        
        {/* Content section - Editorial notebook style */}
        <div className="p-4 md:p-5 space-y-3 bg-[hsl(var(--paper-cream))] relative">
          {/* Notebook lines background */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.15]"
            style={{
              backgroundImage: `repeating-linear-gradient(
                transparent,
                transparent 23px,
                hsl(var(--sepia-light)) 23px,
                hsl(var(--sepia-light)) 24px
              )`,
              backgroundPosition: '0 12px',
            }}
          />
          
          {/* Paper texture overlay */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
          
          {/* Red margin line (notebook style) */}
          <div className="absolute left-8 top-0 bottom-0 w-[1px] bg-[hsl(var(--ink-red)/0.2)]" />
          
          {/* Top meta - Category and Date */}
          <div className="flex items-center justify-between relative pl-4">
            <span className={`px-3 py-1 text-[10px] font-caps tracking-wider ${getCategoryClass(category)} border border-current/20`}>
              {category}
            </span>
            <span className="text-[11px] font-script text-[hsl(var(--sepia))] italic">
              {date}
            </span>
          </div>

          {/* Article number - Hand-drawn circle style */}
          <div className="absolute top-3 right-4 w-8 h-8 rounded-full border-2 border-dashed border-[hsl(var(--sepia)/0.3)] flex items-center justify-center">
            <span className="font-script text-sm text-[hsl(var(--sepia)/0.6)]">{id}</span>
          </div>

          {/* Title */}
          <h3 className="font-editorial text-lg md:text-xl font-semibold leading-snug text-foreground group-hover:text-accent transition-colors relative pl-4 pr-10">
            {title}
          </h3>

          {/* Decorative hand-drawn underline */}
          <div className="relative pl-4 h-2 overflow-hidden">
            <svg viewBox="0 0 200 8" className="w-24 h-2 text-[hsl(var(--sepia)/0.4)]">
              <path 
                d="M0 4 Q25 0 50 4 T100 4 T150 4 T200 4" 
                stroke="currentColor" 
                strokeWidth="1.5"
                fill="none"
                className="group-hover:stroke-accent transition-colors"
              />
            </svg>
          </div>

          {/* Read more indicator */}
          <div className="flex items-center gap-2 pt-1 relative pl-4">
            <BookOpen className="w-3.5 h-3.5 text-[hsl(var(--sepia))]" />
            <span className="text-xs font-caps text-muted-foreground tracking-wider">Baca Artikel</span>
            <div className="ml-auto w-7 h-7 flex items-center justify-center border border-[hsl(var(--border))] bg-[hsl(var(--paper-aged)/0.5)] group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground transition-all rounded-sm">
              <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* Torn paper edge at bottom */}
        <div className="h-3 relative overflow-hidden">
          <svg 
            viewBox="0 0 400 12" 
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <path 
              d="M0,0 L400,0 L400,4 Q380,8 360,4 Q340,0 320,4 Q300,8 280,4 Q260,0 240,4 Q220,8 200,4 Q180,0 160,4 Q140,8 120,4 Q100,0 80,4 Q60,8 40,4 Q20,0 0,4 Z"
              fill="hsl(var(--paper-cream))"
            />
          </svg>
        </div>
      </div>
    </motion.a>
  );
};

export default ArticleCard;
