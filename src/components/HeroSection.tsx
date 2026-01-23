import { Instagram, Facebook, Linkedin, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
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
            {/* Editorial header */}
            <div className="space-y-2 animate-slide-down">
              <span className="font-script text-2xl md:text-3xl text-accent">
                Welcome to
              </span>
            </div>
            
            <div className="space-y-4 md:space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-black leading-[0.95] tracking-tight animate-slide-down">
                <span className="block">The Art of</span>
                <span className="block text-accent">Balanced</span>
                <span className="block">Living</span>
              </h1>
              
              <div className="ornament-divider text-2xl animate-fade-in stagger-1">✦</div>
              
              <p className="font-body text-muted-foreground text-lg md:text-xl leading-relaxed max-w-xl animate-slide-up stagger-2">
                <span className="drop-cap">S</span>ophrosyne invites you to explore the intersection of wisdom and wonder. 
                Here, words are carefully crafted like fine paper, each fold revealing new perspectives 
                on mindful living, creative expression, and the beautiful complexity of human experience.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 pt-4 animate-slide-up stagger-3">
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
            </div>

            {/* Decorative quote */}
            <blockquote className="pull-quote animate-fade-in stagger-4 hidden lg:block">
              "Σωφροσύνη — the ancient Greek ideal of sound mind and excellent character"
            </blockquote>
          </div>
        </div>

        {/* Torn edge bottom */}
        <div className="torn-edge-bottom" />
      </div>
    </section>
  );
};

export default HeroSection;
