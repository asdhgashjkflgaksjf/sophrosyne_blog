import { ArrowUpRight } from "lucide-react";

interface ArticleCardProps {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
  size?: "small" | "large";
}

const ArticleCard = ({ id, title, category, date, image, size = "small" }: ArticleCardProps) => {
  const getCategoryClass = (cat: string) => {
    const normalized = cat.toLowerCase();
    if (normalized.includes("financ")) return "tag-financing";
    if (normalized.includes("lifestyle")) return "tag-lifestyle";
    if (normalized.includes("community")) return "tag-community";
    if (normalized.includes("wellness")) return "tag-wellness";
    if (normalized.includes("travel")) return "tag-travel";
    if (normalized.includes("creativ")) return "tag-creativity";
    if (normalized.includes("growth")) return "tag-growth";
    return "tag-lifestyle";
  };

  return (
    <a
      href={`/article/${id}`}
      className={`group relative block paper-shadow paper-fold bg-card overflow-hidden transition-all duration-500 hover:rotate-[-0.5deg] ${
        size === "large" ? "col-span-1 md:col-span-2 row-span-2" : ""
      }`}
    >
      {/* Paper stack effect */}
      <div className="absolute inset-0 bg-[hsl(var(--paper-aged))] transform translate-x-1 translate-y-1 -z-10" />
      <div className="absolute inset-0 bg-[hsl(var(--paper-cream))] transform translate-x-2 translate-y-2 -z-20" />
      
      {/* Image container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Vintage sepia overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--paper-shadow)/0.7)] via-[hsl(var(--sepia)/0.2)] to-transparent mix-blend-multiply" />
        
        {/* Decorative corner fold indicator */}
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[40px] border-t-[hsl(var(--paper-cream))] border-l-[40px] border-l-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {/* Content section - Editorial style */}
      <div className="p-5 md:p-6 space-y-3 bg-card relative">
        {/* Paper texture overlay */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Top meta - Category and Date */}
        <div className="flex items-center justify-between relative">
          <span className={`px-3 py-1 text-xs font-caps tracking-wider ${getCategoryClass(category)}`}>
            {category}
          </span>
          <span className="text-xs font-body text-muted-foreground italic">
            {date}
          </span>
        </div>

        {/* Article number - Editorial style */}
        <div className="font-display text-4xl font-bold text-muted-foreground/20 absolute top-4 right-6">
          {id}
        </div>

        {/* Title */}
        <h3 className="font-editorial text-xl md:text-2xl font-semibold leading-tight text-foreground group-hover:text-accent transition-colors relative">
          {title}
        </h3>

        {/* Read more indicator */}
        <div className="flex items-center gap-2 pt-2 relative">
          <span className="text-sm font-caps text-muted-foreground tracking-wider">Read Article</span>
          <div className="w-8 h-8 flex items-center justify-center border border-border group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
            <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </a>
  );
};

export default ArticleCard;
