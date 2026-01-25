import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { List, ChevronUp, X } from "lucide-react";
import { Article } from "@/data/articles";

interface ArticleTOCProps {
  article: Article;
}

const ArticleTOC = ({ article }: ArticleTOCProps) => {
  const [activeSection, setActiveSection] = useState<string>("intro");
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // Build TOC items
  const tocItems = [
    { id: "intro", title: "Introduction" },
    ...article.content.sections.map((section, index) => ({
      id: `section-${index}`,
      title: section.heading,
    })),
    { id: "conclusion", title: "Conclusion" },
  ];

  // Always visible - user can minimize if needed
  const isVisible = true;

  // Track active section
  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    });

    // Observe sections after a delay to ensure DOM is ready
    const timer = setTimeout(() => {
      tocItems.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element) observer.observe(element);
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [article]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Minimized state - just show a small button
  if (isMinimized) {
    return (
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => setIsMinimized(false)}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden xl:flex
                   w-10 h-10 items-center justify-center rounded-full
                   bg-card/90 backdrop-blur-sm paper-shadow border border-border
                   hover:bg-muted transition-colors"
        title="Show table of contents"
      >
        <List className="w-4 h-4" />
      </motion.button>
    );
  }

  return (
    <motion.aside
      ref={containerRef}
      initial={{ opacity: 0, x: -20 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        x: isVisible ? 0 : -20,
        pointerEvents: isVisible ? "auto" : "none"
      }}
      transition={{ duration: 0.3, delay: 0.5 }}
      className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden xl:block"
    >
      <div className="relative paper-texture paper-shadow rounded-sm overflow-hidden max-w-[200px]">
        {/* Paper grain overlay */}
        <div 
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Header with progress */}
        <div className="relative p-3 border-b border-[hsl(var(--border))]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <List className="w-4 h-4 text-muted-foreground" />
              <span className="font-caps text-[10px] tracking-wider text-muted-foreground">Contents</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-6 h-6 flex items-center justify-center rounded hover:bg-[hsl(var(--muted))] transition-colors"
              >
                <ChevronUp className={`w-3 h-3 transition-transform ${isExpanded ? '' : 'rotate-180'}`} />
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                className="w-6 h-6 flex items-center justify-center rounded hover:bg-[hsl(var(--muted))] transition-colors"
                title="Minimize"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="h-1 bg-[hsl(var(--muted))] rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[hsl(var(--accent))] rounded-full"
              style={{ scaleX: smoothProgress, transformOrigin: "left" }}
            />
          </div>
        </div>
        
        {/* TOC Items */}
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <nav className="p-3 space-y-1">
            {tocItems.map((item, index) => {
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left py-1.5 px-2 rounded text-xs transition-all flex items-start gap-2 group ${
                    isActive 
                      ? 'bg-[hsl(var(--accent)/0.1)] text-[hsl(var(--accent))]' 
                      : 'text-muted-foreground hover:bg-[hsl(var(--muted))] hover:text-foreground'
                  }`}
                >
                  {/* Progress dot */}
                  <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${
                    isActive ? 'bg-[hsl(var(--accent))]' : 'bg-[hsl(var(--border))] group-hover:bg-muted-foreground'
                  }`} />
                  
                  <span className="font-body leading-tight line-clamp-2">
                    {item.title}
                  </span>
                </button>
              );
            })}
          </nav>
        </motion.div>
        
        {/* Decorative paper corner */}
        <div className="absolute top-0 right-0 w-6 h-6 pointer-events-none"
          style={{
            background: `linear-gradient(225deg, hsl(var(--background)) 0%, hsl(var(--background)) 50%, transparent 50%)`,
            boxShadow: "-1px 1px 2px hsl(var(--paper-shadow)/0.1)",
          }}
        />
      </div>
    </motion.aside>
  );
};

export default ArticleTOC;
