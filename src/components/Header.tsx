import { useState, useEffect } from "react";
import { Menu, X, Moon, Sun, Feather } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark);
    
    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <header className="sticky top-0 z-50 py-3 sm:py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 pill-nav px-4 sm:px-6">
          {/* Logo */}
          <div className="flex items-center min-w-0">
            <a href="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary border-2 border-primary flex items-center justify-center flex-shrink-0 paper-shadow transition-all group-hover:rotate-3">
                <Feather className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-display font-bold tracking-tight leading-none">
                  Sophrosyne
                </span>
                <span className="text-[10px] sm:text-xs font-caps text-muted-foreground tracking-widest hidden sm:block">
                  Where Wisdom Meets Wonder
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <a href="/" className="text-sm font-body font-medium hover:bg-muted/60 px-4 py-2 transition-all border-b-2 border-transparent hover:border-primary">
              Home
            </a>
            <a href="/#articles" className="text-sm font-body font-medium hover:bg-muted/60 px-4 py-2 transition-all border-b-2 border-transparent hover:border-primary">
              Artikel
            </a>
            <a href="/filsafat" className="text-sm font-body font-medium hover:bg-muted/60 px-4 py-2 transition-all border-b-2 border-transparent hover:border-primary">
              Filsafat
            </a>
            <a href="/book-review" className="text-sm font-body font-medium hover:bg-muted/60 px-4 py-2 transition-all border-b-2 border-transparent hover:border-primary">
              Book Review
            </a>
            <a href="/authors" className="text-sm font-body font-medium hover:bg-muted/60 px-4 py-2 transition-all border-b-2 border-transparent hover:border-primary">
              Penulis
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-muted/60 transition-all border border-transparent hover:border-border"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
              ) : (
                <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>
            
            <Button className="hidden md:flex bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 font-body font-medium paper-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
              Subscribe
            </Button>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 hover:bg-muted/60 transition-all"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-6 mt-2 paper-texture paper-shadow animate-unfold">
            <nav className="flex flex-col gap-1 px-4">
              <a href="/" className="text-sm font-body font-medium hover:bg-muted/40 py-3 px-4 transition-all border-l-2 border-transparent hover:border-primary">
                Home
              </a>
              <a href="/#articles" className="text-sm font-body font-medium hover:bg-muted/40 py-3 px-4 transition-all border-l-2 border-transparent hover:border-primary">
                Artikel
              </a>
              <a href="/filsafat" className="text-sm font-body font-medium hover:bg-muted/40 py-3 px-4 transition-all border-l-2 border-transparent hover:border-primary">
                Filsafat
              </a>
              <a href="/book-review" className="text-sm font-body font-medium hover:bg-muted/40 py-3 px-4 transition-all border-l-2 border-transparent hover:border-primary">
                Book Review
              </a>
              <a href="/authors" className="text-sm font-body font-medium hover:bg-muted/40 py-3 px-4 transition-all border-l-2 border-transparent hover:border-primary">
                Penulis
              </a>
              <div className="pt-4 px-4">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full font-body font-medium paper-shadow">
                  Subscribe
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
