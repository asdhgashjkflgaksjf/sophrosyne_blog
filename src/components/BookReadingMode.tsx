import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, ChevronLeft, ChevronRight, Bookmark, MessageSquare } from "lucide-react";
import { Article } from "@/data/articles";

interface BookReadingModeProps {
  article: Article;
  isOpen: boolean;
  onClose: () => void;
}

interface MarginNote {
  id: string;
  pageIndex: number;
  content: string;
  position: number; // percentage from top
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

const BookReadingMode = ({ article, isOpen, onClose }: BookReadingModeProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [marginNotes, setMarginNotes] = useState<MarginNote[]>([]);
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteInput, setNoteInput] = useState("");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const bookRef = useRef<HTMLDivElement>(null);

  // Split content into pages
  const pages = [
    // Title page
    {
      type: 'title',
      content: article.title,
      subtitle: article.subtitle,
    },
    // Introduction
    {
      type: 'content',
      heading: 'Introduction',
      content: article.content.introduction,
    },
    // Article sections
    ...article.content.sections.map(section => ({
      type: 'content',
      heading: section.heading,
      content: section.content,
    })),
    // Conclusion
    {
      type: 'conclusion',
      content: article.content.conclusion,
    },
  ];

  const totalPages = pages.length;

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      playPaperSound('turn');
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      playPaperSound('turn');
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleClose = () => {
    playPaperSound('close');
    onClose();
  };

  const addMarginNote = () => {
    if (noteInput.trim()) {
      const newNote: MarginNote = {
        id: Date.now().toString(),
        pageIndex: currentPage,
        content: noteInput,
        position: 30 + Math.random() * 40, // Random position
      };
      setMarginNotes([...marginNotes, newNote]);
      setNoteInput("");
      setIsAddingNote(false);
    }
  };

  const currentPageNotes = marginNotes.filter(note => note.pageIndex === currentPage);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight' || e.key === ' ') goToNextPage();
      if (e.key === 'ArrowLeft') goToPrevPage();
      if (e.key === 'Escape') handleClose();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentPage]);

  useEffect(() => {
    if (isOpen) {
      playPaperSound('rustle');
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[hsl(var(--paper-shadow)/0.8)] backdrop-blur-sm"
          onClick={handleClose}
        >
          {/* Book Container */}
          <motion.div
            ref={bookRef}
            initial={{ scale: 0.8, rotateY: -30 }}
            animate={{ scale: 1, rotateY: 0 }}
            exit={{ scale: 0.8, rotateY: 30 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="relative w-[95vw] max-w-5xl h-[85vh] perspective-[2000px]"
            onClick={(e) => e.stopPropagation()}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Book Spine */}
            <div className="absolute left-1/2 top-0 bottom-0 w-8 -ml-4 bg-gradient-to-r from-[hsl(var(--primary))] via-[hsl(var(--primary)/0.9)] to-[hsl(var(--primary))] rounded-sm shadow-xl z-10" />
            
            {/* Left Page (Previous content or margin notes) */}
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-[calc(50%-1rem)] bg-[hsl(var(--paper-cream))] rounded-l-sm overflow-hidden"
              style={{
                boxShadow: "inset -20px 0 30px -15px hsl(var(--paper-shadow)/0.2), -5px 5px 20px hsl(var(--paper-shadow)/0.3)",
                transformOrigin: "right center",
              }}
            >
              {/* Paper texture */}
              <div className="absolute inset-0 opacity-[0.08] pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
                }}
              />
              
              {/* Margin notes area */}
              <div className="absolute left-0 top-0 bottom-0 w-16 bg-[hsl(var(--paper-aged)/0.3)] border-r border-[hsl(var(--sepia)/0.2)]">
                <div className="absolute inset-0 flex flex-col gap-4 p-2 pt-8">
                  {currentPageNotes.map((note) => (
                    <div
                      key={note.id}
                      className="text-[8px] font-script text-[hsl(var(--ink-blue))] leading-tight p-1 bg-[hsl(var(--paper-cream)/0.5)] rounded border border-[hsl(var(--sepia)/0.2)]"
                      style={{ top: `${note.position}%` }}
                    >
                      {note.content}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Left page content - Previous page preview */}
              <div className="absolute left-20 right-8 top-12 bottom-12 overflow-hidden">
                {currentPage > 0 && (
                  <div className="opacity-60">
                    <p className="text-xs font-caps text-muted-foreground mb-2">Previous</p>
                    <p className="text-sm font-body text-muted-foreground line-clamp-6">
                      {pages[currentPage - 1].type === 'title' 
                        ? pages[currentPage - 1].content 
                        : pages[currentPage - 1].content?.substring(0, 200) + '...'}
                    </p>
                  </div>
                )}
                
                {/* Page crease line */}
                <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[hsl(var(--sepia)/0.3)] to-transparent" />
              </div>
              
              {/* Page number */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-caps text-xs text-muted-foreground">
                {currentPage > 0 ? currentPage : '—'}
              </div>
            </motion.div>
            
            {/* Right Page (Current content) */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ rotateY: -90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: 90, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="absolute right-0 top-0 bottom-0 w-[calc(50%-1rem)] bg-[hsl(var(--paper-cream))] rounded-r-sm overflow-hidden"
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
                
                {/* Page curl effect */}
                <div className="absolute top-0 right-0 w-12 h-12 pointer-events-none"
                  style={{
                    background: `linear-gradient(225deg, hsl(var(--paper-aged)) 0%, hsl(var(--paper-aged)) 50%, transparent 50%)`,
                    boxShadow: "-2px 2px 5px hsl(var(--paper-shadow)/0.2)",
                  }}
                />
                
                {/* Content area */}
                <div className="absolute left-8 right-12 top-12 bottom-16 overflow-y-auto scrollbar-hide">
                  {pages[currentPage].type === 'title' ? (
                    // Title page layout
                    <div className="flex flex-col items-center justify-center h-full text-center px-4">
                      <div className="ornament-divider mb-8 w-24">✦</div>
                      <h1 className="font-display text-3xl md:text-4xl font-bold mb-6 leading-tight">
                        {pages[currentPage].content}
                      </h1>
                      <p className="font-editorial text-lg text-muted-foreground italic mb-8">
                        {pages[currentPage].subtitle}
                      </p>
                      <div className="flex items-center gap-4 mt-8">
                        <img 
                          src={article.author.avatar} 
                          alt={article.author.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-border"
                        />
                        <div className="text-left">
                          <p className="font-body font-semibold text-sm">{article.author.name}</p>
                          <p className="text-xs text-muted-foreground">{article.date}</p>
                        </div>
                      </div>
                      <div className="ornament-divider mt-8 w-24">✦</div>
                    </div>
                  ) : pages[currentPage].type === 'conclusion' ? (
                    // Conclusion page
                    <div className="py-8">
                      <div className="ornament-divider mb-6">✦</div>
                      <blockquote className="font-editorial text-xl italic text-center px-4 text-[hsl(var(--sepia))]">
                        {pages[currentPage].content}
                      </blockquote>
                      <div className="ornament-divider mt-6">✦</div>
                      <div className="mt-12 text-center">
                        <p className="font-script text-2xl text-muted-foreground">The End</p>
                      </div>
                    </div>
                  ) : (
                    // Regular content page
                    <div className="py-4">
                      <h2 className="font-editorial text-2xl font-semibold mb-6 text-[hsl(var(--primary))]">
                        {pages[currentPage].heading}
                      </h2>
                      <div className="article-body">
                        <p className="font-body text-base leading-relaxed text-foreground">
                          {pages[currentPage].content}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Page number */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-caps text-xs text-muted-foreground">
                  {currentPage + 1}
                </div>
                
                {/* Decorative footer line */}
                <div className="absolute bottom-10 left-8 right-12 h-px bg-gradient-to-r from-transparent via-[hsl(var(--border))] to-transparent" />
              </motion.div>
            </AnimatePresence>
            
            {/* Controls */}
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-6">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 0}
                className="w-12 h-12 rounded-full bg-[hsl(var(--paper-cream))] border border-border flex items-center justify-center disabled:opacity-30 hover:bg-[hsl(var(--paper-aged))] transition-colors shadow-lg"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--paper-cream))] rounded-full border border-border shadow-lg">
                <BookOpen className="w-4 h-4 text-muted-foreground" />
                <span className="font-caps text-sm">
                  {currentPage + 1} / {totalPages}
                </span>
              </div>
              
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages - 1}
                className="w-12 h-12 rounded-full bg-[hsl(var(--paper-cream))] border border-border flex items-center justify-center disabled:opacity-30 hover:bg-[hsl(var(--paper-aged))] transition-colors shadow-lg"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            
            {/* Top controls */}
            <div className="absolute -top-14 right-0 flex items-center gap-3">
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all shadow-lg ${
                  isBookmarked 
                    ? 'bg-[hsl(var(--accent))] border-[hsl(var(--accent))] text-white' 
                    : 'bg-[hsl(var(--paper-cream))] border-border hover:bg-[hsl(var(--paper-aged))]'
                }`}
              >
                <Bookmark className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => setIsAddingNote(!isAddingNote)}
                className="w-10 h-10 rounded-full bg-[hsl(var(--paper-cream))] border border-border flex items-center justify-center hover:bg-[hsl(var(--paper-aged))] transition-colors shadow-lg"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
              
              <button
                onClick={handleClose}
                className="w-10 h-10 rounded-full bg-[hsl(var(--paper-cream))] border border-border flex items-center justify-center hover:bg-[hsl(var(--destructive))] hover:text-white hover:border-[hsl(var(--destructive))] transition-colors shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Note input modal */}
            <AnimatePresence>
              {isAddingNote && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute -top-32 right-0 w-64 p-4 bg-[hsl(var(--paper-cream))] rounded-lg border border-border shadow-xl"
                >
                  <p className="text-sm font-caps mb-2">Add Margin Note</p>
                  <textarea
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="Write your note..."
                    className="w-full h-20 p-2 text-sm bg-[hsl(var(--background))] border border-border rounded resize-none focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent))]"
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => setIsAddingNote(false)}
                      className="flex-1 py-1 text-sm border border-border rounded hover:bg-[hsl(var(--muted))]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addMarginNote}
                      className="flex-1 py-1 text-sm bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded"
                    >
                      Add
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookReadingMode;
