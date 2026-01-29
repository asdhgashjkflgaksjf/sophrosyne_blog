import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface ParallaxPaperProps {
  children: React.ReactNode;
}

const ParallaxPaper = ({ children }: ParallaxPaperProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // Parallax transforms for different paper layers
  const layer1Y = useTransform(scrollY, [0, 1000], [0, -50]);
  const layer2Y = useTransform(scrollY, [0, 1000], [0, -100]);
  const layer3Y = useTransform(scrollY, [0, 1000], [0, -150]);
  
  // Smooth spring animation
  const smoothLayer1 = useSpring(layer1Y, { stiffness: 100, damping: 30 });
  const smoothLayer2 = useSpring(layer2Y, { stiffness: 80, damping: 25 });
  const smoothLayer3 = useSpring(layer3Y, { stiffness: 60, damping: 20 });
  
  // Rotation based on scroll
  const rotation = useTransform(scrollY, [0, 2000], [0, 2]);
  const smoothRotation = useSpring(rotation, { stiffness: 50, damping: 30 });

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden">
      {/* Base paper texture - fixed */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `hsl(var(--background))`,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 500 500' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' stitchTiles='stitch'/%3E%3CfeDiffuseLighting in='noise' lighting-color='%23f5f0e6' surfaceScale='2'%3E%3CfeDistantLight azimuth='45' elevation='60'/%3E%3C/feDiffuseLighting%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`,
          backgroundBlendMode: 'overlay',
        }}
      />
      
      {/* Parallax paper grain layer 1 */}
      <motion.div 
        style={{ y: smoothLayer1 }}
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.06]"
      >
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />
      </motion.div>
      
      {/* Parallax paper fiber layer 2 */}
      <motion.div 
        style={{ y: smoothLayer2, rotate: smoothRotation }}
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.04]"
      >
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%238B7355' stroke-width='0.5' opacity='0.5'%3E%3Cpath d='M10 30 Q 50 20, 90 35 T 170 25'/%3E%3Cpath d='M20 70 Q 60 60, 100 75 T 180 65'/%3E%3Cpath d='M5 110 Q 45 100, 85 115 T 165 105'/%3E%3Cpath d='M15 150 Q 55 140, 95 155 T 175 145'/%3E%3Cpath d='M10 190 Q 50 180, 90 195 T 170 185'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />
      </motion.div>
      
      {/* Parallax aged spots layer 3 */}
      <motion.div 
        style={{ y: smoothLayer3 }}
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
      >
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(ellipse 80px 60px at 15% 25%, hsl(var(--sepia) / 0.3), transparent),
              radial-gradient(ellipse 100px 80px at 75% 45%, hsl(var(--sepia) / 0.2), transparent),
              radial-gradient(ellipse 60px 50px at 45% 75%, hsl(var(--sepia) / 0.25), transparent),
              radial-gradient(ellipse 90px 70px at 85% 85%, hsl(var(--sepia) / 0.2), transparent)`,
          }}
        />
      </motion.div>
      
      {/* Vignette effect */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent 40%, hsl(var(--paper-shadow) / 0.1) 100%)`,
        }}
      />
      
      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default ParallaxPaper;
