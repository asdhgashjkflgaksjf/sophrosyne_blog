import { useState, useMemo, useEffect } from "react";
import { Search, X, Filter, Tag, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Article } from "@/data/articles";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ArticleSearchProps {
  articles: Article[];
  onFilteredArticles: (articles: Article[]) => void;
}

// Typewriter search icon animation
const TypewriterIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="6" width="20" height="14" rx="2" />
    <line x1="6" y1="10" x2="18" y2="10" />
    <line x1="6" y1="14" x2="14" y2="14" />
    <circle cx="17" cy="14" r="1.5" fill="currentColor" />
    <rect x="8" y="2" width="8" height="4" rx="1" />
  </svg>
);

const ArticleSearch = ({ articles, onFilteredArticles }: ArticleSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Get unique categories and tags from articles
  const categories = useMemo(() => [...new Set(articles.map(a => a.category))], [articles]);
  const allTags = useMemo(() => [...new Set(articles.flatMap(a => a.tags))], [articles]);

  // Filter articles based on search, category, and tags
  const filteredArticles = useMemo(() => {
    let result = articles;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.subtitle.toLowerCase().includes(query) ||
        article.content.introduction.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter(article => article.category === selectedCategory);
    }

    if (selectedTags.length > 0) {
      result = result.filter(article =>
        selectedTags.some(tag => article.tags.includes(tag))
      );
    }

    return result;
  }, [searchQuery, selectedCategory, selectedTags]);

  // Update parent when filters change - use useEffect to avoid setState during render
  useEffect(() => {
    onFilteredArticles(filteredArticles);
  }, [filteredArticles, onFilteredArticles]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedTags([]);
  };

  const hasActiveFilters = searchQuery || selectedCategory !== "all" || selectedTags.length > 0;

  return (
    <div className="mb-12 space-y-4">
      {/* Vintage Search Box */}
      <motion.div 
        className="relative"
        animate={{ 
          boxShadow: isFocused 
            ? "4px 4px 0 hsl(var(--sepia-light)), 8px 8px 20px hsl(var(--paper-shadow)/0.15)" 
            : "2px 2px 0 hsl(var(--sepia-light)), 4px 4px 12px hsl(var(--paper-shadow)/0.1)"
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Paper texture container */}
        <div className="relative bg-[hsl(var(--paper-cream))] border-2 border-[hsl(var(--sepia)/0.3)] overflow-hidden">
          {/* Decorative corner stamps */}
          <div className="absolute top-0 left-0 w-6 h-6 border-r-2 border-b-2 border-[hsl(var(--sepia)/0.2)]" />
          <div className="absolute top-0 right-0 w-6 h-6 border-l-2 border-b-2 border-[hsl(var(--sepia)/0.2)]" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-r-2 border-t-2 border-[hsl(var(--sepia)/0.2)]" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-l-2 border-t-2 border-[hsl(var(--sepia)/0.2)]" />
          
          {/* Paper grain overlay */}
          <div 
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />

          <div className="flex items-center relative">
            {/* Typewriter-style search icon */}
            <div className="pl-5 text-[hsl(var(--sepia))]">
              <TypewriterIcon />
            </div>
            
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Ketik untuk mencari artikel..."
              className="flex-1 px-4 py-5 bg-transparent font-body text-base focus:outline-none placeholder:text-[hsl(var(--sepia)/0.5)] placeholder:italic"
            />
            
            {searchQuery && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                onClick={() => setSearchQuery("")}
                className="p-2 mr-2 hover:bg-[hsl(var(--sepia)/0.1)] rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-[hsl(var(--sepia))]" />
              </motion.button>
            )}
            
            {/* Filter button with vintage style */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-5 py-5 border-l-2 border-[hsl(var(--sepia)/0.2)] flex items-center gap-2 hover:bg-[hsl(var(--sepia)/0.08)] transition-colors ${
                showFilters ? 'bg-[hsl(var(--sepia)/0.1)]' : ''
              }`}
            >
              <Filter className="w-4 h-4 text-[hsl(var(--sepia))]" />
              <span className="font-caps text-xs tracking-wider text-[hsl(var(--sepia))] hidden sm:inline">Filter</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {/* Decorative tape on corners */}
        <div className="absolute -top-1 left-8 w-12 h-4 bg-[hsl(var(--sepia-light)/0.6)] transform -rotate-3 opacity-70" />
        <div className="absolute -top-1 right-20 w-10 h-4 bg-[hsl(var(--sepia-light)/0.5)] transform rotate-2 opacity-60" />
      </motion.div>

      {/* Filters Panel - Vintage Paper Card */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="relative bg-[hsl(var(--paper-aged))] border border-[hsl(var(--sepia)/0.2)] p-5 space-y-5">
              {/* Torn top edge */}
              <div className="absolute -top-2 left-0 right-0 h-4 overflow-hidden">
                <svg viewBox="0 0 400 16" className="w-full h-full" preserveAspectRatio="none">
                  <path 
                    d="M0,16 L0,8 Q20,4 40,8 Q60,12 80,8 Q100,4 120,8 Q140,12 160,8 Q180,4 200,8 Q220,12 240,8 Q260,4 280,8 Q300,12 320,8 Q340,4 360,8 Q380,12 400,8 L400,16 Z"
                    fill="hsl(var(--paper-aged))"
                  />
                </svg>
              </div>

              {/* Paper texture */}
              <div 
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
              />

              {/* Section header */}
              <div className="flex items-center gap-2 pb-2 border-b border-[hsl(var(--sepia)/0.15)]">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="font-script text-lg text-accent">Saring Pencarian</span>
              </div>

              {/* Category Filter */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 relative">
                <span className="font-caps text-[10px] tracking-widest text-[hsl(var(--sepia))] min-w-[90px] flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border border-[hsl(var(--sepia)/0.4)]" />
                  Kategori
                </span>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-[220px] bg-[hsl(var(--paper-cream))] border-[hsl(var(--sepia)/0.3)] font-body">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tags Filter - Vintage label style */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-3 relative">
                <span className="font-caps text-[10px] tracking-widest text-[hsl(var(--sepia))] min-w-[90px] pt-2 flex items-center gap-2">
                  <Tag className="w-3 h-3" />
                  Label
                </span>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <motion.button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      whileHover={{ scale: 1.05, rotate: Math.random() * 2 - 1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-3 py-1.5 text-xs font-body transition-all ${
                        selectedTags.includes(tag)
                          ? 'bg-accent text-accent-foreground shadow-md'
                          : 'bg-[hsl(var(--paper-cream))] border border-[hsl(var(--sepia)/0.3)] hover:border-accent/50 text-[hsl(var(--sepia))]'
                      }`}
                      style={{
                        transform: `rotate(${Math.random() * 2 - 1}deg)`,
                      }}
                    >
                      {tag}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-end pt-3 border-t border-[hsl(var(--sepia)/0.15)]"
                >
                  <button
                    onClick={clearFilters}
                    className="text-xs font-caps text-[hsl(var(--sepia))] hover:text-accent transition-colors flex items-center gap-1 px-3 py-1.5 border border-[hsl(var(--sepia)/0.2)] hover:border-accent/50 bg-[hsl(var(--paper-cream))]"
                  >
                    <X className="w-3 h-3" />
                    Hapus Semua Filter
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active filters indicator - Vintage label strip */}
      <AnimatePresence>
        {hasActiveFilters && !showFilters && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex items-center gap-3 text-xs p-3 bg-[hsl(var(--paper-aged)/0.5)] border-l-4 border-accent"
          >
            <span className="font-caps text-[10px] tracking-wider text-[hsl(var(--sepia))]">Filter aktif:</span>
            <div className="flex flex-wrap gap-2">
              {selectedCategory !== "all" && (
                <span className="px-2 py-1 bg-[hsl(var(--paper-cream))] border border-[hsl(var(--sepia)/0.3)] font-body text-[hsl(var(--sepia))]">
                  {selectedCategory}
                </span>
              )}
              {selectedTags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-accent/20 border border-accent/30 font-body text-accent">
                  {tag}
                </span>
              ))}
            </div>
            <span className="ml-auto font-script text-sm text-[hsl(var(--sepia))]">
              {filteredArticles.length} artikel ditemukan
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArticleSearch;
