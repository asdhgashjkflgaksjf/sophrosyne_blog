import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Menu, X, Moon, Sun, Feather, ChevronDown, BookOpen, Lightbulb, Palette, Sprout, Compass, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// Paper grain pattern
const PAPER_GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`;

// Navigation structure with sub-menus
const navItems = [
  { label: "Home", href: "/" },
  { label: "Artikel", href: "/#articles" },
  {
    label: "Kategori",
    submenu: [
      { label: "Filsafat", href: "/filsafat", icon: BookOpen, description: "Eksplorasi pemikiran filosofis" },
      { label: "Kreativitas", href: "/creativity", icon: Palette, description: "Seni & ekspresi diri" },
      { label: "Pertumbuhan", href: "/growth", icon: Sprout, description: "Pengembangan diri" },
      { label: "Wellness", href: "/wellness", icon: Heart, description: "Kesehatan & keseimbangan" },
    ],
  },
  { label: "Book Review", href: "/book-review" },
  { label: "Tentang", href: "/about" },
];

interface SubMenuProps {
  items: { label: string; href: string; icon: any; description: string }[];
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement>;
}

const SubMenuDropdown = ({ items, isOpen, onClose, triggerRef }: SubMenuProps) => {
  const prefersReducedMotion = useReducedMotion();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Calculate position based on trigger button
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 8,
        left: rect.left + rect.width / 2,
      });
    }
  }, [isOpen, triggerRef]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, triggerRef]);

  const dropdownVariants = prefersReducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: -8, scale: 0.96 },
        visible: { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: { type: "spring" as const, damping: 25, stiffness: 400 }
        },
      };

  if (!isOpen) return null;

  // Use portal to render dropdown at body level
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={dropdownRef}
          variants={dropdownVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed w-72 z-[9999] origin-top"
          style={{
            top: position.top,
            left: position.left,
            transform: 'translateX(-50%)',
          }}
        >
          {/* Paper style card */}
          <div className="relative bg-[hsl(var(--paper-cream))] border border-border rounded-xl shadow-xl overflow-hidden">
            {/* Paper grain overlay */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{ backgroundImage: PAPER_GRAIN }}
            />
            
            {/* Decorative torn edge at top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

            <div className="relative p-2">
              <div className="text-[9px] font-caps tracking-widest text-muted-foreground px-3 py-2 border-b border-border/50 mb-1">
                Kategori Tulisan
              </div>
              {items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-all group"
                    initial={prefersReducedMotion ? {} : { opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                      <Icon className="w-4 h-4 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="block text-sm font-body font-medium text-foreground group-hover:text-accent transition-colors">
                        {item.label}
                      </span>
                      <span className="block text-xs text-muted-foreground line-clamp-1">
                        {item.description}
                      </span>
                    </div>
                  </motion.a>
                );
              })}
            </div>

            {/* Decorative bottom */}
            <div className="h-1 bg-gradient-to-r from-transparent via-accent/10 to-transparent" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

// Separate component for nav items with submenu to properly use hooks
interface NavItemWithSubmenuProps {
  item: {
    label: string;
    submenu: { label: string; href: string; icon: any; description: string }[];
  };
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const NavItemWithSubmenu = ({ item, isOpen, onToggle, onClose }: NavItemWithSubmenuProps) => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  
  return (
    <div className="relative">
      <button
        ref={triggerRef}
        onClick={onToggle}
        className={`flex items-center gap-1 text-sm font-body font-medium px-4 py-2 transition-all border-b-2 rounded-lg
          ${isOpen 
            ? 'bg-muted/60 border-accent text-accent' 
            : 'border-transparent hover:bg-muted/40 hover:border-primary'
          }`}
      >
        {item.label}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.div>
      </button>
      <SubMenuDropdown
        items={item.submenu}
        isOpen={isOpen}
        onClose={onClose}
        triggerRef={triggerRef}
      />
    </div>
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

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
    <header className="sticky top-0 z-50 py-3 sm:py-4 overflow-visible">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-visible">
        {/* Main header bar with paper style - overflow-visible to allow dropdown */}
        <div className="relative flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6 bg-[hsl(var(--paper-cream))] border border-border rounded-2xl paper-shadow overflow-visible">
          {/* Paper grain overlay */}
          <div
            className="absolute inset-0 opacity-[0.02] pointer-events-none"
            style={{ backgroundImage: PAPER_GRAIN }}
          />

          {/* Logo */}
          <div className="flex items-center min-w-0 relative z-10">
            <a href="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary border-2 border-primary flex items-center justify-center flex-shrink-0 paper-shadow transition-all group-hover:rotate-3 rounded-lg">
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

          {/* Desktop Navigation with Sub-menus */}
          <nav className="hidden lg:flex items-center gap-1 relative z-10">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.submenu ? (
                  <NavItemWithSubmenu
                    item={item as { label: string; submenu: { label: string; href: string; icon: any; description: string }[] }}
                    isOpen={openSubmenu === item.label}
                    onToggle={() => setOpenSubmenu(openSubmenu === item.label ? null : item.label)}
                    onClose={() => setOpenSubmenu(null)}
                  />
                ) : (
                  <a
                    href={item.href}
                    className="text-sm font-body font-medium hover:bg-muted/40 px-4 py-2 transition-all border-b-2 border-transparent hover:border-primary rounded-lg"
                  >
                    {item.label}
                  </a>
                )}
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 relative z-10">
            {/* Animated Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="relative p-2 hover:bg-muted/60 transition-colors border border-transparent hover:border-border rounded-lg overflow-hidden"
              aria-label="Toggle theme"
              whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isDark ? (
                  <motion.div
                    key="sun"
                    initial={prefersReducedMotion ? {} : { rotate: -90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={prefersReducedMotion ? {} : { rotate: 90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={prefersReducedMotion ? {} : { rotate: 90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={prefersReducedMotion ? {} : { rotate: -90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-500" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
            
            <Button className="hidden md:flex bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 font-body font-medium paper-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all rounded-lg">
              Subscribe
            </Button>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 hover:bg-muted/60 transition-all rounded-lg"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu with Paper Style */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden mt-2 overflow-hidden"
            >
              <div className="relative bg-[hsl(var(--paper-cream))] border border-border rounded-xl paper-shadow overflow-hidden">
                {/* Paper grain overlay */}
                <div
                  className="absolute inset-0 opacity-[0.03] pointer-events-none"
                  style={{ backgroundImage: PAPER_GRAIN }}
                />

                <nav className="relative flex flex-col gap-1 p-4">
                  {navItems.map((item, index) => (
                    <div key={item.label}>
                      {item.submenu ? (
                        <>
                          <button
                            onClick={() => setMobileSubmenuOpen(mobileSubmenuOpen === item.label ? null : item.label)}
                            className={`w-full flex items-center justify-between text-sm font-body font-medium py-3 px-4 transition-all rounded-lg
                              ${mobileSubmenuOpen === item.label 
                                ? 'bg-accent/10 text-accent' 
                                : 'hover:bg-muted/40'
                              }`}
                          >
                            {item.label}
                            <motion.div
                              animate={{ rotate: mobileSubmenuOpen === item.label ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="w-4 h-4" />
                            </motion.div>
                          </button>
                          
                          <AnimatePresence>
                            {mobileSubmenuOpen === item.label && (
                              <motion.div
                                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="pl-4 py-2 space-y-1 border-l-2 border-accent/30 ml-4">
                                  {item.submenu.map((subItem) => {
                                    const Icon = subItem.icon;
                                    return (
                                      <a
                                        key={subItem.href}
                                        href={subItem.href}
                                        className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-muted/40 transition-colors"
                                      >
                                        <div className="w-7 h-7 rounded-md bg-accent/10 flex items-center justify-center">
                                          <Icon className="w-3.5 h-3.5 text-accent" />
                                        </div>
                                        <span className="text-sm font-body">{subItem.label}</span>
                                      </a>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <a
                          href={item.href}
                          className="block text-sm font-body font-medium hover:bg-muted/40 py-3 px-4 transition-all border-l-2 border-transparent hover:border-primary rounded-lg"
                        >
                          {item.label}
                        </a>
                      )}
                    </div>
                  ))}
                  
                  <div className="pt-4 mt-2 border-t border-border">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full font-body font-medium paper-shadow rounded-lg">
                      Subscribe
                    </Button>
                  </div>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;