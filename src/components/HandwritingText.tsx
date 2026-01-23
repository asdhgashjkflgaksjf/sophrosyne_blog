import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface HandwritingTextProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
  onComplete?: () => void;
}

const HandwritingText = ({ 
  text, 
  className = "", 
  delay = 0, 
  speed = 50,
  onComplete 
}: HandwritingTextProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayedText("");
    indexRef.current = 0;
    setIsComplete(false);
    setShowCursor(true);

    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (indexRef.current < text.length) {
          setDisplayedText(text.slice(0, indexRef.current + 1));
          indexRef.current++;
        } else {
          clearInterval(interval);
          setIsComplete(true);
          onComplete?.();
          
          // Hide cursor after completion
          setTimeout(() => setShowCursor(false), 1000);
        }
      }, speed + Math.random() * 30); // Add slight randomness for natural feel

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [text, delay, speed, onComplete]);

  // Cursor blink effect
  useEffect(() => {
    if (!isComplete) {
      const blinkInterval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 530);
      return () => clearInterval(blinkInterval);
    }
  }, [isComplete]);

  return (
    <span className={`relative ${className}`}>
      <span className="relative">
        {displayedText}
        {/* Ink cursor */}
        {showCursor && !isComplete && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-block w-[2px] h-[1em] bg-[hsl(var(--ink-dark))] ml-0.5 align-middle"
            style={{ verticalAlign: 'text-bottom' }}
          />
        )}
      </span>
      
      {/* Ink splatter effect on complete */}
      {isComplete && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 0.3 }}
          className="absolute -right-1 top-0 w-1 h-1 rounded-full bg-[hsl(var(--ink-dark))]"
        />
      )}
    </span>
  );
};

// Full paragraph handwriting animation
interface HandwritingParagraphProps {
  children: string;
  className?: string;
  letterDelay?: number;
  startDelay?: number;
}

export const HandwritingParagraph = ({ 
  children, 
  className = "",
  letterDelay = 30,
  startDelay = 0
}: HandwritingParagraphProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setDisplayedText("");
    setIsComplete(false);
    let index = 0;

    const startTimeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (index < children.length) {
          setDisplayedText(children.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          setIsComplete(true);
        }
      }, letterDelay + (Math.random() * 15));

      return () => clearInterval(interval);
    }, startDelay);

    return () => clearTimeout(startTimeout);
  }, [children, letterDelay, startDelay]);

  return (
    <span ref={containerRef} className={`relative ${className}`}>
      {displayedText}
      {!isComplete && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="inline-block w-[2px] h-[0.9em] bg-[hsl(var(--ink-dark))] ml-0.5"
          style={{ verticalAlign: 'text-bottom' }}
        />
      )}
    </span>
  );
};

// Decorative handwriting line effect
interface HandwritingLineProps {
  className?: string;
  delay?: number;
  duration?: number;
}

export const HandwritingLine = ({ className = "", delay = 0, duration = 1 }: HandwritingLineProps) => {
  return (
    <motion.svg
      viewBox="0 0 200 10"
      className={`w-full h-auto ${className}`}
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay, duration, ease: "easeInOut" }}
    >
      <motion.path
        d="M5 5 Q 50 2, 100 5 T 195 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay, duration, ease: "easeInOut" }}
      />
    </motion.svg>
  );
};

// Ink drop effect
interface InkDropProps {
  x?: number;
  y?: number;
  delay?: number;
  size?: number;
}

export const InkDrop = ({ x = 50, y = 50, delay = 0, size = 8 }: InkDropProps) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 0.15 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className="absolute rounded-full bg-[hsl(var(--ink-dark))]"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
};

export default HandwritingText;
