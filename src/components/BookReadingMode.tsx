import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, PanInfo, useReducedMotion } from "framer-motion";
import { X, BookOpen, ChevronLeft, ChevronRight, Bookmark, MessageSquare, Highlighter, List } from "lucide-react";
import { Article } from "@/data/articles";
import PageCurl from "./PageCurl";
import { Highlight, HIGHLIGHT_COLORS, HighlightList } from "./TextHighlighter";
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile";
import ReadingModeOnboarding, { hasSeenOnboarding } from "./ReadingModeOnboarding";

// Paper grain SVG for reuse
const PAPER_GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`;

interface BookReadingModeProps {
  article: Article;
  isOpen: boolean;
  onClose: () => void;
}

interface MarginNote {
  id: string;
  pageIndex: number;
  content: string;
  position: number;
}

// Paper sound effects
const playPaperSound = (type: 'turn' | 'rustle' | 'close') => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.2, audioContext.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < noiseBuffer.length; i++) {
      const decay = type === 'close' 
        ? Math.pow(1 - i / noiseBuffer.length, 1.5)
        : Math.pow(1 - i / noiseBuffer.length, 2);
      noiseData[i] = (Math.random() * 2 - 1) * decay;
    }
    
    const noiseSource = audioContext.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    
    const filter = audioContext.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = type === 'turn' ? 2500 : type === 'close' ? 1000 : 3000;
    
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(type === 'close' ? 0.1 : 0.06, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
    
    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    noiseSource.start(audioContext.currentTime);
    noiseSource.stop(audioContext.currentTime + 0.25);
  } catch (e) {
    // Audio might not be available
  }
};

// Page flip animation variants
const mobilePageVariants = {
  enter: (direction: number) => ({
    rotateY: direction > 0 ? 25 : -25,
    x: direction > 0 ? 100 : -100,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    rotateY: 0,
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" as const }
  },
  exit: (direction: number) => ({
    rotateY: direction > 0 ? -25 : 25,
    x: direction > 0 ? -100 : 100,
    opacity: 0,
    scale: 0.95,
  })
};

const tabletPageVariants = {
  enter: (direction: number) => ({
    rotateY: direction > 0 ? 90 : -90,
    opacity: 0,
    scale: 0.9,
    transformOrigin: direction > 0 ? "left center" : "right center",
  }),
  center: {
    rotateY: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const }
  },
  exit: (direction: number) => ({
    rotateY: direction > 0 ? -90 : 90,
    opacity: 0,
    scale: 0.9,
    transformOrigin: direction > 0 ? "right center" : "left center",
  })
};

const BookReadingMode = ({ article, isOpen, onClose }: BookReadingModeProps) => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [marginNotes, setMarginNotes] = useState<MarginNote[]>([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteInput, setNoteInput] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [isHighlighting, setIsHighlighting] = useState(false);
  const [highlightColor, setHighlightColor] = useState(HIGHLIGHT_COLORS[0].value);
  const [showHighlights, setShowHighlights] = useState(false);
  const [showTOC, setShowTOC] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Build TOC items for jumping to pages
  const tocItems = [
    { pageIndex: 0, title: article.title, type: 'title' },
    { pageIndex: 1, title: 'Introduction', type: 'intro' },
    ...article.content.sections.map((section, index) => ({
      pageIndex: index + 2,
      title: section.heading,
      type: 'section',
    })),
    { pageIndex: article.content.sections.length + 2, title: 'Conclusion', type: 'conclusion' },
  ];
  
  const goToPage = useCallback((pageIndex: number) => {
    setDirection(pageIndex > currentPage ? 1 : -1);
    playPaperSound('turn');
    setCurrentPage(pageIndex);
    setShowTOC(false);
  }, [currentPage]);

  // Split content into pages
  const pages = [
    { type: 'title' as const, content: article.title, subtitle: article.subtitle, heading: '' },
    { type: 'content' as const, heading: 'Introduction', content: article.content.introduction },
    ...article.content.sections.map(section => ({
      type: 'content' as const,
      heading: section.heading,
      content: section.content,
    })),
    { type: 'conclusion' as const, content: article.content.conclusion, heading: '' },
  ];

  const totalPages = pages.length;

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      setDirection(1);
      playPaperSound('turn');
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);

  const goToPrevPage = useCallback(() => {
    if (currentPage > 0) {
      setDirection(-1);
      playPaperSound('turn');
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  const handleClose = useCallback(() => {
    playPaperSound('close');
    onClose();
  }, [onClose]);

  const addMarginNote = () => {
    if (noteInput.trim()) {
      const newNote: MarginNote = {
        id: Date.now().toString(),
        pageIndex: currentPage,
        content: noteInput,
        position: 30 + Math.random() * 40,
      };
      setMarginNotes([...marginNotes, newNote]);
      setNoteInput("");
      setIsAddingNote(false);
    }
  };

  const currentPageNotes = marginNotes.filter(note => note.pageIndex === currentPage);

  // Handle text highlighting
  const handleAddHighlight = useCallback((highlightData: Omit<Highlight, 'id' | 'createdAt'>) => {
    const newHighlight: Highlight = {
      ...highlightData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setHighlights(prev => [...prev, newHighlight]);
  }, []);

  const handleRemoveHighlight = (id: string) => {
    setHighlights(prev => prev.filter(h => h.id !== id));
  };

  const goToHighlightPage = (pageIndex: number) => {
    setCurrentPage(pageIndex);
    setShowHighlights(false);
  };

  // Swipe gesture handling for mobile/tablet
  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x < -threshold && currentPage < totalPages - 1) {
      goToNextPage();
    } else if (info.offset.x > threshold && currentPage > 0) {
      goToPrevPage();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goToNextPage();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevPage();
      }
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, goToNextPage, goToPrevPage, handleClose]);

  useEffect(() => {
    if (isOpen) {
      // Ensure modal starts at the top of the document BEFORE scroll lock.
      try {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      } catch {
        // noop
      }

      playPaperSound('rustle');
      setCurrentPage(0);
      setDirection(0);
      
      // Show onboarding if user hasn't seen it yet
      if (!hasSeenOnboarding()) {
        setShowOnboarding(true);
      }
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted) return null;

  // Render page content helper
  const renderPageContent = (pageIndex: number, size: 'mobile' | 'tablet' | 'desktop' = 'desktop') => {
    const page = pages[pageIndex];
    const textSize = size === 'mobile' ? 'text-base' : size === 'tablet' ? 'text-base' : 'text-sm';
    const headingSize = size === 'mobile' ? 'text-2xl' : size === 'tablet' ? 'text-2xl' : 'text-xl';
    
    if (page.type === 'title') {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          <div className="ornament-divider mb-6 w-16 text-sm">✦</div>
          <h1 className={`font-display ${size === 'mobile' ? 'text-2xl' : 'text-3xl'} font-bold mb-4 leading-tight`}>
            {page.content}
          </h1>
          <p className={`font-editorial ${textSize} text-muted-foreground italic mb-6`}>
            {page.subtitle}
          </p>
          <div className="flex items-center gap-3 mt-4">
            <img 
              src={article.author.avatar} 
              alt={article.author.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-border"
            />
            <div className="text-left">
              <p className="font-body font-semibold text-sm">{article.author.name}</p>
              <p className="text-xs text-muted-foreground">{article.date}</p>
            </div>
          </div>
          <div className="ornament-divider mt-6 w-16 text-sm">✦</div>
        </div>
      );
    }
    
    if (page.type === 'conclusion') {
      return (
        <div className="py-6 flex flex-col items-center justify-center h-full px-4">
          <div className="ornament-divider mb-4 text-sm">✦</div>
          <blockquote className={`font-editorial ${size === 'mobile' ? 'text-lg' : 'text-xl'} italic text-center px-2 text-[hsl(var(--sepia))]`}>
            {page.content}
          </blockquote>
          <div className="ornament-divider mt-4 text-sm">✦</div>
          <div className="mt-8 text-center">
            <p className="font-script text-xl text-muted-foreground">The End</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="py-2 px-2">
        <h2 className={`font-editorial ${headingSize} font-semibold mb-4 text-[hsl(var(--primary))]`}>
          {page.heading}
        </h2>
        <div className="article-body">
          <p className={`font-body ${textSize} leading-relaxed text-foreground`}>
            {page.content}
          </p>
        </div>
      </div>
    );
  };

  // Mobile Single-Page Layout with 3D Flip - FIXED RESPONSIVE
  if (isMobile) {
    return createPortal(
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col bg-[hsl(var(--paper-cream))] overflow-hidden"
          >
            {/* Mobile Header - Compact with mini progress */}
            <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-border bg-[hsl(var(--paper-cream))] safe-area-top">
              <div className="flex items-center gap-3">
                {/* Mini circular progress */}
                <div className="relative w-8 h-8">
                  <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
                    <circle cx="16" cy="16" r="12" fill="none" className="stroke-muted/40" strokeWidth="2" />
                    <motion.circle
                      cx="16" cy="16" r="12"
                      fill="none"
                      className="stroke-accent"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray={75.4}
                      animate={{ strokeDashoffset: 75.4 - ((currentPage + 1) / totalPages) * 75.4 }}
                      transition={{ duration: 0.2 }}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[7px] font-bold">
                    {currentPage + 1}
                  </span>
                </div>
                
                {/* TOC button */}
                <button
                  type="button"
                  onClick={() => setShowTOC(!showTOC)}
                  className={`p-2 rounded-full transition-colors ${showTOC ? 'bg-accent/15 text-accent' : 'hover:bg-muted/60'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`p-2.5 rounded-full transition-all ${
                    isBookmarked 
                      ? 'bg-accent text-white' 
                      : 'hover:bg-muted/60'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="p-2.5 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Mobile TOC Drawer */}
            <AnimatePresence>
              {showTOC && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden border-b border-border bg-[hsl(var(--paper-aged)/0.3)]"
                >
                  <div className="p-3 max-h-[200px] overflow-y-auto scrollbar-hide">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[9px] font-caps text-muted-foreground tracking-wider">Daftar Isi</span>
                    </div>
                    <nav className="space-y-1">
                      {tocItems.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => goToPage(item.pageIndex)}
                          className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors flex items-center gap-2
                            ${currentPage === item.pageIndex 
                              ? 'bg-accent/15 text-accent font-medium' 
                              : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                            }`}
                        >
                          <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold
                            ${currentPage === item.pageIndex ? 'bg-accent text-white' : 'bg-muted/50'}`}>
                            {idx + 1}
                          </span>
                          <span className="line-clamp-1">{item.title}</span>
                        </button>
                      ))}
                    </nav>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile Content Area - Full height with proper scrolling */}
            <div className="flex-1 relative overflow-hidden" style={{ perspective: "1000px" }}>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentPage}
                  ref={contentRef}
                  custom={direction}
                  variants={mobilePageVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                  className="absolute inset-0 overflow-y-auto overscroll-contain"
                  style={{ 
                    transformStyle: "preserve-3d",
                    WebkitOverflowScrolling: "touch"
                  }}
                >
                  <div className="min-h-full p-5 pb-8">
                    <div className="bg-[hsl(var(--paper-cream))] rounded-xl paper-shadow p-5 min-h-[calc(100vh-200px)]">
                      {/* Paper texture */}
                      <div className="absolute inset-0 opacity-[0.04] pointer-events-none rounded-xl"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
                        }}
                      />
                      {renderPageContent(currentPage, 'mobile')}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              
              {/* Page curl indicator - subtle */}
              {currentPage < totalPages - 1 && (
                <motion.div
                  className="absolute bottom-6 right-6 w-10 h-10 pointer-events-none"
                  animate={{ opacity: [0.3, 0.6, 0.3], rotate: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    background: `linear-gradient(225deg, hsl(var(--paper-aged)) 0%, hsl(var(--paper-aged)) 45%, transparent 45%)`,
                    boxShadow: "-2px 2px 6px hsl(var(--paper-shadow)/0.15)",
                    borderRadius: "0 0 0 8px"
                  }}
                />
              )}
            </div>

            {/* Mobile Bottom Navigation - Fixed, safe area aware */}
            <div className="flex-shrink-0 bg-[hsl(var(--paper-cream))] border-t border-border safe-area-bottom">
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <button
                  type="button"
                  onClick={goToPrevPage}
                  disabled={currentPage === 0}
                  className="flex-1 py-3 rounded-xl bg-muted/50 flex items-center justify-center gap-2 
                           disabled:opacity-30 disabled:cursor-not-allowed 
                           active:bg-muted/80 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="font-medium text-sm">Prev</span>
                </button>
                
                {/* Progress dots - scrollable if many pages */}
                <div className="flex gap-1.5 justify-center max-w-[100px] overflow-x-auto scrollbar-hide px-1">
                  {pages.map((_, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => {
                        setDirection(idx > currentPage ? 1 : -1);
                        setCurrentPage(idx);
                        playPaperSound('turn');
                      }}
                      className={`flex-shrink-0 w-2 h-2 rounded-full transition-all ${
                        idx === currentPage ? 'bg-accent' : 'bg-muted-foreground/30'
                      }`}
                      animate={idx === currentPage ? { scale: 1.4 } : { scale: 1 }}
                    />
                  ))}
                </div>
                
                <button
                  type="button"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages - 1}
                  className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground flex items-center justify-center gap-2 
                           disabled:opacity-30 disabled:cursor-not-allowed 
                           active:bg-primary/80 transition-colors"
                >
                  <span className="font-medium text-sm">Next</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              
              {/* Swipe hint */}
              <div className="text-center pb-2 text-[10px] font-caps text-muted-foreground/50">
                ← Swipe untuk membalik →
              </div>
            </div>
            
            {/* Onboarding Popup */}
            <ReadingModeOnboarding
              isOpen={showOnboarding}
              onComplete={() => setShowOnboarding(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>,
      document.body,
    );
  }

  // Tablet Single-Page Layout with Full 3D Flip
  if (isTablet) {
    return createPortal(
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={prefersReducedMotion ? { duration: 0.1 } : { duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[hsl(var(--paper-shadow)/0.85)] backdrop-blur-sm"
          >
            {/* Click outside to close */}
            <div className="absolute inset-0" onClick={handleClose} />
            
            {/* Mini progress & TOC - top left */}
            <div className="absolute top-4 left-4 z-30 flex items-center gap-2">
              {/* Mini circular progress */}
              <div className="relative w-10 h-10 bg-card/90 rounded-full paper-shadow border border-border/50 flex items-center justify-center">
                <svg className="w-10 h-10 -rotate-90 absolute" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="16" fill="none" className="stroke-muted/30" strokeWidth="2" />
                  <motion.circle
                    cx="20" cy="20" r="16"
                    fill="none"
                    className="stroke-accent"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={100.5}
                    animate={{ strokeDashoffset: 100.5 - ((currentPage + 1) / totalPages) * 100.5 }}
                    transition={{ duration: 0.2 }}
                  />
                </svg>
                <span className="text-[8px] font-bold z-10">{currentPage + 1}</span>
              </div>
              
              {/* TOC button */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setShowTOC(!showTOC); }}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all shadow-lg
                  ${showTOC ? 'bg-accent border-accent text-white' : 'bg-card/90 border-border hover:bg-muted'}`}
              >
                <List className="w-4 h-4" />
              </button>
              
              {/* TOC Dropdown */}
              <AnimatePresence>
                {showTOC && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute top-14 left-0 w-[200px] bg-card/98 backdrop-blur-md rounded-lg border border-border paper-shadow overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-2 border-b border-border/50">
                      <span className="text-[9px] font-caps text-muted-foreground">Daftar Isi</span>
                    </div>
                    <nav className="p-2 space-y-0.5 max-h-[250px] overflow-y-auto scrollbar-hide">
                      {tocItems.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => goToPage(item.pageIndex)}
                          className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors flex items-center gap-2
                            ${currentPage === item.pageIndex 
                              ? 'bg-accent/15 text-accent font-medium' 
                              : 'text-muted-foreground hover:bg-muted/50'
                            }`}
                        >
                          <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold
                            ${currentPage === item.pageIndex ? 'bg-accent text-white' : 'bg-muted/50'}`}>
                            {idx + 1}
                          </span>
                          <span className="line-clamp-1">{item.title}</span>
                        </button>
                      ))}
                    </nav>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Tablet Book Container */}
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { scale: 0.9, rotateY: -20 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { scale: 1, rotateY: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { scale: 0.9, rotateY: 20 }}
              transition={prefersReducedMotion ? { duration: 0.1 } : { type: "spring", damping: 20, stiffness: 100 }}
              className="relative w-[85vw] max-w-2xl h-[80vh] max-h-[700px]"
              style={{ perspective: "2000px" }}
            >
              {/* Single Page with 3D Flip */}
              <div 
                className="relative w-full h-full"
                style={{ perspective: "2000px", transformStyle: "preserve-3d" }}
              >
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={currentPage}
                    custom={direction}
                    variants={tabletPageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0 bg-[hsl(var(--paper-cream))] rounded-lg overflow-hidden"
                    style={{
                      boxShadow: "0 25px 50px -12px hsl(var(--paper-shadow)/0.4), 0 0 0 1px hsl(var(--border))",
                      transformStyle: "preserve-3d",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    {/* Paper texture */}
                    <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
                      }}
                    />
                    
                    {/* Content */}
                    <motion.div
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.1}
                      onDragEnd={handleDragEnd}
                      className="absolute inset-0 p-8 overflow-y-auto"
                    >
                      {renderPageContent(currentPage, 'tablet')}
                    </motion.div>
                    
                    {/* Page curl */}
                    <PageCurl 
                      onFlip={goToNextPage}
                      isLastPage={currentPage === totalPages - 1}
                    />
                    
                    {/* Page number */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-caps text-xs text-muted-foreground">
                      {currentPage + 1} / {totalPages}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {/* Side Navigation */}
              <button
                type="button"
                onClick={goToPrevPage}
                disabled={currentPage === 0}
                className="absolute left-[-60px] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[hsl(var(--paper-cream))] border-2 border-border flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[hsl(var(--paper-aged))] hover:scale-105 transition-all shadow-lg"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button
                type="button"
                onClick={goToNextPage}
                disabled={currentPage === totalPages - 1}
                className="absolute right-[-60px] top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[hsl(var(--paper-cream))] border-2 border-border flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[hsl(var(--paper-aged))] hover:scale-105 transition-all shadow-lg"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              
              {/* Top controls */}
              <div className="absolute -top-16 right-0 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all shadow-lg ${
                    isBookmarked 
                      ? 'bg-[hsl(var(--accent))] border-[hsl(var(--accent))] text-white' 
                      : 'bg-[hsl(var(--paper-cream))] border-border hover:bg-[hsl(var(--paper-aged))]'
                  }`}
                >
                  <Bookmark className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-11 h-11 rounded-full bg-[hsl(var(--paper-cream))] border-2 border-border flex items-center justify-center hover:bg-[hsl(var(--destructive))] hover:text-white hover:border-[hsl(var(--destructive))] transition-colors shadow-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Swipe hint */}
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-[10px] font-caps text-muted-foreground/60">
                Swipe atau gunakan tombol untuk navigasi
              </div>
            </motion.div>
            
            {/* Onboarding Popup */}
            <ReadingModeOnboarding
              isOpen={showOnboarding}
              onComplete={() => setShowOnboarding(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>,
      document.body,
    );
  }

  // Desktop Two-Page Book Layout
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={prefersReducedMotion ? { duration: 0.1 } : { duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[hsl(var(--paper-shadow)/0.85)] backdrop-blur-sm"
        >
          {/* Click outside to close */}
          <div className="absolute inset-0" onClick={handleClose} />
          
          {/* Mini progress & TOC - top left */}
          <div className="absolute top-6 left-6 z-30 flex items-center gap-3">
            {/* Mini circular progress */}
            <div className="relative w-12 h-12 bg-card/90 rounded-full paper-shadow border border-border/50 flex items-center justify-center">
              <svg className="w-12 h-12 -rotate-90 absolute" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="none" className="stroke-muted/30" strokeWidth="2.5" />
                <motion.circle
                  cx="24" cy="24" r="20"
                  fill="none"
                  className="stroke-accent"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray={125.6}
                  animate={{ strokeDashoffset: 125.6 - ((currentPage + 1) / totalPages) * 125.6 }}
                  transition={{ duration: 0.2 }}
                />
              </svg>
              <span className="text-[10px] font-bold z-10">{currentPage + 1}/{totalPages}</span>
            </div>
            
            {/* TOC button */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setShowTOC(!showTOC); }}
              className={`w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all shadow-lg cursor-pointer
                ${showTOC ? 'bg-accent border-accent text-white' : 'bg-card/90 border-border hover:bg-muted'}`}
            >
              <List className="w-5 h-5" />
            </button>
            
            {/* TOC Dropdown */}
            <AnimatePresence>
              {showTOC && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute top-16 left-0 w-[240px] bg-card/98 backdrop-blur-md rounded-lg border border-border paper-shadow overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-[0.06]"
                    style={{ backgroundImage: PAPER_GRAIN }}
                  />
                  <div className="p-3 border-b border-border/50 flex items-center gap-2">
                    <List className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs font-caps text-muted-foreground tracking-wider">Daftar Isi</span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1 bg-muted/50">
                    <motion.div 
                      className="h-full bg-accent"
                      animate={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
                    />
                  </div>
                  <nav className="p-2 space-y-0.5 max-h-[300px] overflow-y-auto scrollbar-hide">
                    {tocItems.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => goToPage(item.pageIndex)}
                        className={`w-full text-left px-2.5 py-2 rounded text-xs transition-colors flex items-center gap-2
                          ${currentPage === item.pageIndex 
                            ? 'bg-accent/15 text-accent font-medium' 
                            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                          }`}
                      >
                        <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold
                          ${currentPage === item.pageIndex ? 'bg-accent text-white' : 'bg-muted/50'}`}>
                          {idx + 1}
                        </span>
                        <span className="line-clamp-1">{item.title}</span>
                      </button>
                    ))}
                  </nav>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Book Container */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { scale: 0.85, rotateY: -25 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { scale: 1, rotateY: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { scale: 0.85, rotateY: 25 }}
            transition={prefersReducedMotion ? { duration: 0.1 } : { type: "spring", damping: 22, stiffness: 120 }}
            className="relative w-[95vw] max-w-5xl h-[80vh] max-h-[700px]"
            style={{ perspective: "2000px" }}
          >
            {/* Book Spine */}
            <div className="absolute left-1/2 top-0 bottom-0 w-6 -ml-3 bg-gradient-to-r from-[hsl(var(--primary))] via-[hsl(var(--primary)/0.9)] to-[hsl(var(--primary))] rounded-sm shadow-xl z-20" />
            
            {/* Left Page */}
            <div
              className="absolute left-0 top-0 bottom-0 w-[calc(50%-0.75rem)] bg-[hsl(var(--paper-cream))] rounded-l-sm overflow-hidden"
              style={{
                boxShadow: "inset -20px 0 30px -15px hsl(var(--paper-shadow)/0.2), -5px 5px 20px hsl(var(--paper-shadow)/0.3)",
              }}
            >
              {/* Paper texture */}
              <div className="absolute inset-0 opacity-[0.08] pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
                }}
              />
              
              {/* Margin notes area */}
              <div className="absolute left-0 top-0 bottom-0 w-14 bg-[hsl(var(--paper-aged)/0.3)] border-r border-[hsl(var(--sepia)/0.2)]">
                <div className="flex flex-col gap-3 p-2 pt-6">
                  {currentPageNotes.map((note) => (
                    <div
                      key={note.id}
                      className="text-[7px] font-script text-[hsl(var(--ink-blue))] leading-tight p-1 bg-[hsl(var(--paper-cream)/0.5)] rounded border border-[hsl(var(--sepia)/0.2)]"
                    >
                      {note.content}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Left page content */}
              <div className="absolute left-16 right-6 top-10 bottom-10 overflow-hidden">
                {currentPage > 0 && (
                  <div className="opacity-50">
                    <p className="text-[10px] font-caps text-muted-foreground mb-2 tracking-wider">Previous</p>
                    <p className="text-xs font-body text-muted-foreground line-clamp-[12]">
                      {pages[currentPage - 1].type === 'title' 
                        ? pages[currentPage - 1].content 
                        : pages[currentPage - 1].content?.substring(0, 300) + '...'}
                    </p>
                  </div>
                )}
                
                {currentPage === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                    <div className="ornament-divider mb-4 text-lg">✦</div>
                    <p className="font-script text-lg text-muted-foreground">A Publication by</p>
                    <p className="font-display text-xl font-bold mt-2">Sophrosyne</p>
                    <div className="ornament-divider mt-4 text-lg">✦</div>
                  </div>
                )}
              </div>
              
              {/* Page number */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 font-caps text-[10px] text-muted-foreground">
                {currentPage > 0 ? currentPage : '—'}
              </div>
            </div>
            
            {/* Right Page (Current content) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ rotateY: -90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: 90, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                className="absolute right-0 top-0 bottom-0 w-[calc(50%-0.75rem)] bg-[hsl(var(--paper-cream))] rounded-r-sm overflow-hidden"
                style={{
                  boxShadow: "inset 20px 0 30px -15px hsl(var(--paper-shadow)/0.15), 5px 5px 20px hsl(var(--paper-shadow)/0.3)",
                  transformOrigin: "left center",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Paper texture */}
                <div className="absolute inset-0 opacity-[0.08] pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
                  }}
                />
                
                {/* Page curl effect - interactive (desktop only) */}
                <PageCurl 
                  onFlip={goToNextPage}
                  isLastPage={currentPage === totalPages - 1}
                />
                
                {/* Content area */}
                <div className="absolute left-6 right-10 top-10 bottom-14 overflow-y-auto scrollbar-hide">
                  {renderPageContent(currentPage, 'desktop')}
                </div>
                
                {/* Page number */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 font-caps text-[10px] text-muted-foreground">
                  {currentPage + 1}
                </div>
                
                {/* Decorative footer line */}
                <div className="absolute bottom-8 left-6 right-10 h-px bg-gradient-to-r from-transparent via-[hsl(var(--border))] to-transparent" />
              </motion.div>
            </AnimatePresence>
            
            {/* Navigation Controls - Below book */}
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-4 z-30">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goToPrevPage();
                }}
                disabled={currentPage === 0}
                className="w-14 h-14 rounded-full bg-[hsl(var(--paper-cream))] border-2 border-border flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[hsl(var(--paper-aged))] hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <div className="flex items-center gap-2 px-5 py-3 bg-[hsl(var(--paper-cream))] rounded-full border-2 border-border shadow-lg">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
                <span className="font-caps text-sm font-medium">
                  {currentPage + 1} / {totalPages}
                </span>
              </div>
              
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goToNextPage();
                }}
                disabled={currentPage === totalPages - 1}
                className="w-14 h-14 rounded-full bg-[hsl(var(--paper-cream))] border-2 border-border flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[hsl(var(--paper-aged))] hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            
            {/* Top controls */}
            <div className="absolute -top-16 right-0 flex items-center gap-3 z-30">
              {/* Highlight toggle with color picker */}
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsHighlighting(!isHighlighting);
                  }}
                  className={`w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all shadow-lg cursor-pointer ${
                    isHighlighting
                      ? 'bg-[hsl(var(--accent))] border-[hsl(var(--accent))] text-white'
                      : 'bg-[hsl(var(--paper-cream))] border-border hover:bg-[hsl(var(--paper-aged))]'
                  }`}
                  title="Toggle text highlighting"
                >
                  <Highlighter className="w-5 h-5" />
                </button>
                
                {/* Color picker */}
                <AnimatePresence>
                  {isHighlighting && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-14 right-0 bg-[hsl(var(--paper-cream))] border-2 border-border rounded-lg p-2 shadow-xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex gap-2 mb-2">
                        {HIGHLIGHT_COLORS.map((color) => (
                          <button
                            key={color.name}
                            type="button"
                            onClick={() => setHighlightColor(color.value)}
                            className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${
                              highlightColor === color.value ? 'ring-2 ring-offset-1 ring-[hsl(var(--primary))]' : ''
                            }`}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                          />
                        ))}
                      </div>
                      {highlights.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setShowHighlights(!showHighlights)}
                          className="text-[10px] font-caps text-muted-foreground hover:text-foreground"
                        >
                          View highlights ({highlights.length})
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Highlights list popup */}
                <AnimatePresence>
                  {showHighlights && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-28 right-0 w-64 bg-[hsl(var(--paper-cream))] border-2 border-border rounded-lg p-3 shadow-xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <HighlightList
                        highlights={highlights}
                        onRemove={handleRemoveHighlight}
                        onGoToPage={goToHighlightPage}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsBookmarked(!isBookmarked);
                }}
                className={`w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all shadow-lg cursor-pointer ${
                  isBookmarked 
                    ? 'bg-[hsl(var(--accent))] border-[hsl(var(--accent))] text-white' 
                    : 'bg-[hsl(var(--paper-cream))] border-border hover:bg-[hsl(var(--paper-aged))]'
                }`}
              >
                <Bookmark className="w-5 h-5" />
              </button>
              
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAddingNote(!isAddingNote);
                }}
                className="w-11 h-11 rounded-full bg-[hsl(var(--paper-cream))] border-2 border-border flex items-center justify-center hover:bg-[hsl(var(--paper-aged))] transition-colors shadow-lg cursor-pointer"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
              
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClose();
                }}
                className="w-11 h-11 rounded-full bg-[hsl(var(--paper-cream))] border-2 border-border flex items-center justify-center hover:bg-[hsl(var(--destructive))] hover:text-white hover:border-[hsl(var(--destructive))] transition-colors shadow-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Keyboard hint */}
            <div className="absolute -bottom-20 left-0 text-[10px] font-caps text-muted-foreground/60 z-30">
              Use ← → arrows or click buttons to navigate
            </div>
            
            {/* Note input modal */}
            <AnimatePresence>
              {isAddingNote && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute -top-36 right-0 w-64 p-4 bg-[hsl(var(--paper-cream))] rounded-lg border-2 border-border shadow-xl z-40"
                >
                  <p className="text-sm font-caps mb-2">Add Margin Note</p>
                  <textarea
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="Write your note..."
                    className="w-full h-20 p-2 text-sm bg-[hsl(var(--background))] border border-border rounded resize-none focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingNote(false)}
                      className="flex-1 py-2 text-sm border border-border rounded hover:bg-[hsl(var(--muted))] cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={addMarginNote}
                      className="flex-1 py-2 text-sm bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Onboarding Popup */}
            <ReadingModeOnboarding
              isOpen={showOnboarding}
              onComplete={() => setShowOnboarding(false)}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default BookReadingMode;