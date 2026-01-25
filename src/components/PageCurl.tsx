import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useIsMobile, useIsTablet } from "@/hooks/use-mobile";

interface PageCurlProps {
  onFlip: () => void;
  isLastPage?: boolean;
}

const PageCurl = ({ onFlip, isLastPage = false }: PageCurlProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  
  // Motion values for drag
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  
  // Adjust sensitivity based on device
  const dragThreshold = isMobile ? -80 : isTablet ? -100 : -150;
  
  // Transform drag to curl amount (0-1)
  const curlAmount = useTransform(dragX, [0, dragThreshold], [0, 1]);
  
  // Visual transforms based on curl - smaller on mobile
  const baseSize = isMobile ? 30 : isTablet ? 35 : 40;
  const maxSize = isMobile ? 80 : isTablet ? 100 : 120;
  
  const cornerX = useTransform(curlAmount, [0, 1], [0, isMobile ? -50 : -80]);
  const cornerY = useTransform(curlAmount, [0, 1], [0, isMobile ? 50 : 80]);
  const rotation = useTransform(curlAmount, [0, 1], [0, -45]);
  const shadowOpacity = useTransform(curlAmount, [0, 0.5, 1], [0, 0.3, 0.5]);
  const peekWidth = useTransform(curlAmount, [0, 1], [baseSize, maxSize]);
  const peekHeight = useTransform(curlAmount, [0, 1], [baseSize, maxSize]);

  const handleDragEnd = () => {
    setIsDragging(false);
    
    const currentCurl = curlAmount.get();
    
    if (currentCurl > 0.5 && !isLastPage) {
      // Complete the flip
      animate(dragX, dragThreshold * 1.5, {
        duration: 0.3,
        onComplete: () => {
          onFlip();
          dragX.set(0);
          dragY.set(0);
        }
      });
    } else {
      // Spring back
      animate(dragX, 0, { type: "spring", stiffness: 300, damping: 30 });
      animate(dragY, 0, { type: "spring", stiffness: 300, damping: 30 });
    }
  };

  // Handle tap for tablet/touch devices
  const handleTap = () => {
    if ((isMobile || isTablet) && !isLastPage) {
      // Animate a quick flip on tap
      animate(dragX, dragThreshold, {
        duration: 0.2,
        onComplete: () => {
          onFlip();
          dragX.set(0);
        }
      });
    }
  };

  if (isLastPage) return null;

  // Size adjustments based on device
  const containerSize = isMobile ? 'w-16 h-16' : isTablet ? 'w-20 h-20' : 'w-24 h-24';
  const dragHandleSize = isMobile ? 'w-12 h-12' : isTablet ? 'w-14 h-14' : 'w-16 h-16';

  return (
    <div 
      ref={containerRef}
      className={`absolute bottom-0 right-0 ${containerSize} z-10 cursor-grab active:cursor-grabbing`}
      style={{ touchAction: 'none' }}
    >
      {/* Drag handle - invisible but interactive */}
      <motion.div
        className={`absolute bottom-0 right-0 ${dragHandleSize}`}
        drag
        dragConstraints={{ 
          left: dragThreshold, 
          right: 0, 
          top: 0, 
          bottom: isMobile ? 60 : 100 
        }}
        dragElastic={0.1}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        onTap={handleTap}
        style={{ x: dragX, y: dragY }}
      />

      {/* Visual curl effect */}
      <motion.div
        className="absolute bottom-0 right-0 pointer-events-none"
        style={{
          width: peekWidth,
          height: peekHeight,
          x: cornerX,
          y: cornerY,
          rotate: rotation,
          transformOrigin: "bottom right",
        }}
      >
        {/* Curled corner */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              135deg,
              hsl(var(--paper-cream)) 0%,
              hsl(var(--paper-aged)) 50%,
              hsl(var(--paper-cream)) 100%
            )`,
            clipPath: "polygon(100% 0, 0 100%, 100% 100%)",
            boxShadow: `
              -4px -4px 8px rgba(0,0,0,0.15),
              inset 2px 2px 4px rgba(255,255,255,0.3)
            `,
          }}
        />
        
        {/* Shadow under curl */}
        <motion.div
          className="absolute -inset-2"
          style={{
            background: "radial-gradient(ellipse at bottom right, rgba(0,0,0,0.3) 0%, transparent 70%)",
            opacity: shadowOpacity,
            filter: "blur(4px)",
          }}
        />
      </motion.div>

      {/* Static corner hint when not dragging */}
      {!isDragging && (
        <motion.div
          className={`absolute bottom-0 right-0 ${isMobile ? 'w-8 h-8' : isTablet ? 'w-9 h-9' : 'w-10 h-10'}`}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            background: `linear-gradient(
              225deg,
              hsl(var(--paper-aged)) 0%,
              hsl(var(--paper-aged)) 50%,
              transparent 50%
            )`,
            boxShadow: "-2px 2px 4px hsl(var(--paper-shadow)/0.2)",
          }}
        />
      )}

      {/* Hint text - desktop only */}
      {!isDragging && !isMobile && !isTablet && (
        <motion.span
          className="absolute bottom-2 right-12 text-[9px] font-caps text-muted-foreground/60 whitespace-nowrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Drag to turn →
        </motion.span>
      )}
      
      {/* Touch hint for tablet */}
      {!isDragging && isTablet && (
        <motion.span
          className="absolute bottom-1 right-10 text-[8px] font-caps text-muted-foreground/60 whitespace-nowrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Tap or drag
        </motion.span>
      )}
    </div>
  );
};

export default PageCurl;