import { useState, useMemo } from "react";
import { Search, X, Filter, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Article, articles } from "@/data/articles";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ArticleSearchProps {
  onFilteredArticles: (articles: Article[]) => void;
}

// Get unique categories and tags from articles
const categories = [...new Set(articles.map(a => a.category))];
const allTags = [...new Set(articles.flatMap(a => a.tags))];

const ArticleSearch = ({ onFilteredArticles }: ArticleSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Filter articles based on search, category, and tags
  const filteredArticles = useMemo(() => {
    let result = articles;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.subtitle.toLowerCase().includes(query) ||
        article.content.introduction.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter(article => article.category === selectedCategory);
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      result = result.filter(article =>
        selectedTags.some(tag => article.tags.includes(tag))
      );
    }

    return result;
  }, [searchQuery, selectedCategory, selectedTags]);

  // Update parent component when filters change
  useMemo(() => {
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
    <div className="mb-10 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <div className="relative paper-texture border border-border overflow-hidden">
          <div className="flex items-center">
            <div className="pl-4 text-muted-foreground">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari artikel berdasarkan judul, isi, atau tag..."
              className="flex-1 px-4 py-4 bg-transparent font-body text-sm focus:outline-none placeholder:text-muted-foreground/60"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="p-2 mr-2 hover:bg-muted/60 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-4 border-l border-border flex items-center gap-2 hover:bg-muted/60 transition-colors ${
                showFilters ? 'bg-muted/40' : ''
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="font-caps text-xs tracking-wider hidden sm:inline">Filter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="paper-texture border border-border p-4 space-y-4">
              {/* Category Filter */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <span className="font-caps text-xs tracking-wider text-muted-foreground min-w-[80px]">
                  Kategori
                </span>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-[200px] bg-[hsl(var(--paper-cream))] border-border">
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

              {/* Tags Filter */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                <span className="font-caps text-xs tracking-wider text-muted-foreground min-w-[80px] pt-2">
                  <Tag className="w-3 h-3 inline mr-1" />
                  Tags
                </span>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 text-xs font-body rounded-full border transition-all ${
                        selectedTags.includes(tag)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-[hsl(var(--paper-cream))] border-border hover:border-primary/50'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <div className="flex justify-end pt-2 border-t border-border">
                  <button
                    onClick={clearFilters}
                    className="text-xs font-caps text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    Reset Filter
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active filters indicator */}
      {hasActiveFilters && !showFilters && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-caps">Filter aktif:</span>
          {selectedCategory !== "all" && (
            <span className="px-2 py-1 bg-primary/10 rounded-full">{selectedCategory}</span>
          )}
          {selectedTags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-accent/20 rounded-full">{tag}</span>
          ))}
          <span className="text-muted-foreground/60">
            ({filteredArticles.length} artikel)
          </span>
        </div>
      )}
    </div>
  );
};

export default ArticleSearch;
