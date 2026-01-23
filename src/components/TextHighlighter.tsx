import { useState, useCallback } from "react";
import { Highlighter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface Highlight {
  id: string;
  text: string;
  color: string;
  pageIndex: number;
  createdAt: Date;
}

export const HIGHLIGHT_COLORS = [
  { name: 'Yellow', value: 'hsl(50, 90%, 70%)', darkValue: 'hsl(50, 60%, 40%)' },
  { name: 'Pink', value: 'hsl(330, 80%, 80%)', darkValue: 'hsl(330, 50%, 45%)' },
  { name: 'Green', value: 'hsl(120, 50%, 75%)', darkValue: 'hsl(120, 35%, 35%)' },
  { name: 'Blue', value: 'hsl(200, 70%, 75%)', darkValue: 'hsl(200, 45%, 40%)' },
  { name: 'Orange', value: 'hsl(30, 85%, 70%)', darkValue: 'hsl(30, 55%, 40%)' },
];

interface TextHighlighterProps {
  onAddHighlight: (highlight: Omit<Highlight, 'id' | 'createdAt'>) => void;
  currentPageIndex: number;
  isEnabled: boolean;
  onToggle: () => void;
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export const TextHighlighter = ({
  onAddHighlight,
  currentPageIndex,
  isEnabled,
  onToggle,
  selectedColor,
  onColorChange,
}: TextHighlighterProps) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleMouseUp = useCallback(() => {
    if (!isEnabled) return;
    
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    
    if (selectedText && selectedText.length > 0) {
      onAddHighlight({
        text: selectedText,
        color: selectedColor,
        pageIndex: currentPageIndex,
      });
      selection?.removeAllRanges();
    }
  }, [isEnabled, selectedColor, currentPageIndex, onAddHighlight]);

  // Attach listener when enabled
  if (typeof window !== 'undefined' && isEnabled) {
    document.addEventListener('mouseup', handleMouseUp);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className={`w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all shadow-lg cursor-pointer ${
          isEnabled
            ? 'bg-[hsl(var(--accent))] border-[hsl(var(--accent))] text-white'
            : 'bg-[hsl(var(--paper-cream))] border-border hover:bg-[hsl(var(--paper-aged))]'
        }`}
        title="Toggle highlighting"
      >
        <Highlighter className="w-5 h-5" />
      </button>

      {/* Color picker dropdown */}
      <AnimatePresence>
        {isEnabled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-14 right-0 bg-[hsl(var(--paper-cream))] border-2 border-border rounded-lg p-2 shadow-xl z-50"
          >
            <div className="flex gap-2">
              {HIGHLIGHT_COLORS.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => onColorChange(color.value)}
                  className={`w-7 h-7 rounded-full transition-transform hover:scale-110 ${
                    selectedColor === color.value ? 'ring-2 ring-offset-2 ring-[hsl(var(--primary))]' : ''
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface HighlightListProps {
  highlights: Highlight[];
  onRemove: (id: string) => void;
  onGoToPage: (pageIndex: number) => void;
}

export const HighlightList = ({ highlights, onRemove, onGoToPage }: HighlightListProps) => {
  if (highlights.length === 0) return null;

  return (
    <div className="space-y-2 max-h-60 overflow-y-auto">
      <h4 className="font-caps text-[10px] tracking-wider text-muted-foreground mb-2">
        Highlights ({highlights.length})
      </h4>
      {highlights.map((highlight) => (
        <div
          key={highlight.id}
          className="group relative p-2 rounded border border-border/50 bg-[hsl(var(--paper-cream)/0.5)] cursor-pointer hover:bg-[hsl(var(--paper-aged)/0.5)] transition-colors"
          onClick={() => onGoToPage(highlight.pageIndex)}
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-1 rounded-l"
            style={{ backgroundColor: highlight.color }}
          />
          <p className="text-[11px] font-body line-clamp-2 pl-2 pr-6">
            "{highlight.text}"
          </p>
          <span className="text-[9px] text-muted-foreground pl-2">
            Page {highlight.pageIndex + 1}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(highlight.id);
            }}
            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default TextHighlighter;
