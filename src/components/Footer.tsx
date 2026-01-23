import { Feather, Instagram, Facebook, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative mt-20">
      {/* Torn edge top */}
      <div className="torn-edge-top-footer" />
      
      {/* Main footer with paper texture */}
      <div className="paper-texture-heavy relative">
        {/* Decorative paper grain overlay */}
        <div className="absolute inset-0 paper-grain pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
          {/* Top section with logo and tagline */}
          <div className="text-center mb-12 pb-12 border-b border-border/50">
            <a href="/" className="inline-flex flex-col items-center gap-3 group">
              <div className="w-14 h-14 bg-primary border-2 border-primary flex items-center justify-center paper-shadow transition-all group-hover:rotate-3">
                <Feather className="w-7 h-7 text-primary-foreground" />
              </div>
              <span className="font-display text-2xl font-bold tracking-tight">
                Sophrosyne
              </span>
            </a>
            <p className="mt-4 font-script text-xl text-accent">
              "Where wisdom meets wonder"
            </p>
            <p className="mt-2 text-sm text-muted-foreground font-body max-w-md mx-auto">
              A paper-crafted sanctuary for exploring ideas, finding inspiration, 
              and discovering the art of balanced living.
            </p>
          </div>

          {/* Navigation Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="paper-note">
              <h3 className="font-caps text-xs tracking-widest mb-4 text-foreground">Explore</h3>
              <ul className="space-y-3 text-sm font-body text-muted-foreground">
                <li>
                  <a href="/wellness" className="hover:text-accent transition-colors inline-block paper-link">
                    Wellness
                  </a>
                </li>
                <li>
                  <a href="/travel" className="hover:text-accent transition-colors inline-block paper-link">
                    Travel
                  </a>
                </li>
                <li>
                  <a href="/creativity" className="hover:text-accent transition-colors inline-block paper-link">
                    Creativity
                  </a>
                </li>
                <li>
                  <a href="/growth" className="hover:text-accent transition-colors inline-block paper-link">
                    Growth
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="paper-note">
              <h3 className="font-caps text-xs tracking-widest mb-4 text-foreground">About</h3>
              <ul className="space-y-3 text-sm font-body text-muted-foreground">
                <li>
                  <a href="/about" className="hover:text-accent transition-colors inline-block paper-link">
                    Our Story
                  </a>
                </li>
                <li>
                  <a href="/authors" className="hover:text-accent transition-colors inline-block paper-link">
                    Authors
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-accent transition-colors inline-block paper-link">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="paper-note">
              <h3 className="font-caps text-xs tracking-widest mb-4 text-foreground">Resources</h3>
              <ul className="space-y-3 text-sm font-body text-muted-foreground">
                <li>
                  <a href="/style-guide" className="hover:text-accent transition-colors inline-block paper-link">
                    Style Guide
                  </a>
                </li>
                <li>
                  <a href="/#newsletter" className="hover:text-accent transition-colors inline-block paper-link">
                    Newsletter
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="paper-note">
              <h3 className="font-caps text-xs tracking-widest mb-4 text-foreground">Legal</h3>
              <ul className="space-y-3 text-sm font-body text-muted-foreground">
                <li>
                  <a href="/privacy" className="hover:text-accent transition-colors inline-block paper-link">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="hover:text-accent transition-colors inline-block paper-link">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Social links */}
          <div className="flex justify-center gap-4 mb-12">
            <a href="#instagram" className="floating-button w-10 h-10" aria-label="Instagram">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#facebook" className="floating-button w-10 h-10" aria-label="Facebook">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#twitter" className="floating-button w-10 h-10" aria-label="Twitter">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#linkedin" className="floating-button w-10 h-10" aria-label="LinkedIn">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>

          {/* Bottom section */}
          <div className="pt-8 border-t border-border/50 text-center">
            <p className="text-xs font-body text-muted-foreground">
              © {new Date().getFullYear()} Sophrosyne. Crafted with care, like fine paper.
            </p>
            <p className="mt-2 font-script text-sm text-accent/70">
              σωφροσύνη — excellence of character and soundness of mind
            </p>
          </div>
        </div>

        {/* Decorative paper elements */}
        <div className="absolute bottom-0 left-8 w-20 h-24 bg-[hsl(var(--paper-aged))] paper-shadow transform rotate-[-3deg] opacity-30 hidden lg:block" />
        <div className="absolute bottom-4 right-12 w-16 h-20 bg-[hsl(var(--paper-cream))] paper-shadow transform rotate-[5deg] opacity-40 hidden lg:block" />
      </div>
    </footer>
  );
};

export default Footer;
