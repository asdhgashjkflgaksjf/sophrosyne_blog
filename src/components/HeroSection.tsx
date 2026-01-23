import { useState, useEffect } from "react";
import { Instagram, Facebook, Linkedin, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import HandwritingText, { HandwritingLine, InkDrop } from "./HandwritingText";

const HeroSection = () => {
  const [showMainText, setShowMainText] = useState(false);
  const [showParagraph, setShowParagraph] = useState(false);

  useEffect(() => {
    // Start main text after welcome animation
    const timer1 = setTimeout(() => setShowMainText(true), 800);
    const timer2 = setTimeout(() => setShowParagraph(true), 1500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <section className="relative my-8 md:my-12 animate-fade-in">
      {/* Paper texture background */}
      <div className="relative paper-texture paper-stack overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 p-6 md:p-12 lg:p-16">
          {/* Left side - Image with paper effects */}
          <div className="relative animate-paper-drop">
            <div className="relative aspect-[4/3] md:aspect-[3/4] overflow-hidden paper-shadow paper-corner-fold group">
              <img
                src="https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=1920&q=80"
                alt="Sophrosyne - Wisdom and Balance"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Vintage overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--sepia)/0.1)] to-transparent mix-blend-multiply" />
              
              {/* Decorative stamp */}
              <div className="absolute bottom-6 left-6 ink-stamp bg-[hsl(var(--paper-cream)/0.9)] px-4 py-2 font-caps text-xs tracking-widest">
                Est. MMXXIV
              </div>
            </div>
            
            {/* Floating decorative paper */}
            <div className="absolute -bottom-4 -right-4 w-24 h-32 bg-[hsl(var(--paper-aged))] paper-shadow transform rotate-6 hidden md:block" />
          </div>

          {/* Right side - Content */}
          <div className="flex flex-col justify-center space-y-6 md:space-y-8">
            {/* Editorial header with handwriting effect */}
            <div className="space-y-2">
              <span className="font-script text-2xl md:text-3xl text-accent block">
                <HandwritingText 
                  text="Welcome to" 
                  speed={80}
                  onComplete={() => setShowMainText(true)}
                />
              </span>
            </div>
            
            <div className="space-y-4 md:space-y-6">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: showMainText ? 1 : 0, y: showMainText ? 0 : 20 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl lg:text-7xl font-display font-black leading-[0.95] tracking-tight"
              >
                <span className="block">The Art of</span>
                <span className="block text-accent relative">
                  Balanced
                  {/* Decorative underline that draws in */}
                  <motion.span 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: showMainText ? 1 : 0 }}
                    transition={{ delay: 0.5, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute -bottom-1 left-0 right-0 h-1 bg-[hsl(var(--accent)/0.3)] origin-left"
                  />
                </span>
                <span className="block">Living</span>
              </motion.h1>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: showMainText ? 1 : 0 }}
                transition={{ delay: 0.3 }}
                className="ornament-divider text-2xl"
              >
                ✦
              </motion.div>
              
              {/* Paragraph with typing effect */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: showParagraph ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                {/* Ink drops for decoration */}
                <InkDrop x={95} y={10} delay={2} size={4} />
                <InkDrop x={98} y={25} delay={2.2} size={3} />
                
                <p className="font-body text-muted-foreground text-lg md:text-xl leading-relaxed max-w-xl">
                  <span className="drop-cap">S</span>ophrosyne invites you to explore the intersection of wisdom and wonder. 
                  Here, words are carefully crafted like fine paper, each fold revealing new perspectives 
                  on mindful living, creative expression, and the beautiful complexity of human experience.
                </p>
                
                {/* Handwriting flourish line */}
                <div className="mt-4 text-[hsl(var(--sepia)/0.4)] w-32">
                  <HandwritingLine delay={2.5} duration={0.8} />
                </div>
              </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: showParagraph ? 1 : 0, y: showParagraph ? 0 : 20 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 pt-4"
            >
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 md:px-10 md:py-6 text-base font-body font-medium paper-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all w-full sm:w-auto group">
                <BookOpen className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Begin Reading
              </Button>

              <div className="flex items-center gap-3">
                <a
                  href="#instagram"
                  className="floating-button"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#facebook"
                  className="floating-button"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#linkedin"
                  className="floating-button"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </motion.div>

            {/* Decorative quote with handwriting */}
            <motion.blockquote 
              initial={{ opacity: 0 }}
              animate={{ opacity: showParagraph ? 1 : 0 }}
              transition={{ delay: 0.5 }}
              className="pull-quote hidden lg:block"
            >
              <span className="font-script text-xl">
                <HandwritingText 
                  text='"Where every word is a brushstroke on the canvas of understanding"' 
                  delay={3000}
                  speed={40}
                />
              </span>
            </motion.blockquote>
          </div>
        </div>

        {/* Torn edge bottom */}
        <div className="torn-edge-bottom" />
      </div>
    </section>
  );
};

export default HeroSection;
