import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { ReactNode, useEffect, useRef } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

// Paper sound effects
const playPaperSound = (type: 'turn' | 'rustle' | 'flip') => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.3, audioContext.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);
  
  // Generate paper-like noise
  for (let i = 0; i < noiseBuffer.length; i++) {
    noiseData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / noiseBuffer.length, 2);
  }
  
  const noiseSource = audioContext.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  
  const filter = audioContext.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = type === 'turn' ? 2000 : type === 'flip' ? 3000 : 1500;
  
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(type === 'turn' ? 0.08 : 0.05, audioContext.currentTime + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + (type === 'turn' ? 0.25 : 0.15));
  
  noiseSource.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  noiseSource.start(audioContext.currentTime);
  noiseSource.stop(audioContext.currentTime + 0.3);
};

const pageVariants = {
  initial: {
    opacity: 0,
    rotateY: -90,
    transformOrigin: "left center",
    x: "-10%",
  },
  animate: {
    opacity: 1,
    rotateY: 0,
    transformOrigin: "left center",
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    rotateY: 90,
    transformOrigin: "right center",
    x: "10%",
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};

const overlayVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: [0, 0.3, 0],
    transition: { duration: 0.6, times: [0, 0.5, 1] }
  },
  exit: { opacity: 0 },
};

const PageTransition = ({ children }: PageTransitionProps) => {
  const location = useLocation();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    // Play paper turn sound on route change
    try {
      playPaperSound('turn');
    } catch (e) {
      // Audio context might not be available
    }
  }, [location.pathname]);

  return (
    <div className="perspective-[2000px] overflow-x-hidden overflow-y-visible">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="relative"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Page shadow during transition */}
          <motion.div
            variants={overlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 bg-gradient-to-r from-[hsl(var(--paper-shadow)/0.5)] to-transparent pointer-events-none z-50"
          />
          
          {/* Torn edge effect during transition */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 0.6, times: [0, 0.3, 1] }}
            className="fixed left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-[hsl(var(--paper-cream))] to-transparent z-50 origin-top"
            style={{
              maskImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 20 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0 Q 10 5, 5 10 T 10 20 T 5 30 T 10 40 T 5 50 T 10 60 T 5 70 T 10 80 T 5 90 T 10 100 L 20 100 L 20 0 Z' fill='black'/%3E%3C/svg%3E")`,
              maskSize: "100% 100%",
            }}
          />
          
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PageTransition;
