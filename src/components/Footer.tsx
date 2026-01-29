import { Feather, Instagram, Twitter } from "lucide-react";
import profileSilhouette from "@/assets/profile-silhouette.png";

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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
            <div className="paper-note">
              <h3 className="font-caps text-xs tracking-widest mb-4 text-foreground">Jelajahi</h3>
              <ul className="space-y-3 text-sm font-body text-muted-foreground">
                <li>
                  <a href="/filsafat" className="hover:text-accent transition-colors inline-block paper-link">
                    Filsafat
                  </a>
                </li>
                <li>
                  <a href="/book-review" className="hover:text-accent transition-colors inline-block paper-link">
                    Book Review
                  </a>
                </li>
                <li>
                  <a href="/wellness" className="hover:text-accent transition-colors inline-block paper-link">
                    Refleksi
                  </a>
                </li>
                <li>
                  <a href="/growth" className="hover:text-accent transition-colors inline-block paper-link">
                    Stoikisme
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="paper-note col-span-2 md:col-span-1">
              <h3 className="font-caps text-xs tracking-widest mb-4 text-foreground">Tentang Penulis</h3>
              <div className="flex items-start gap-4">
                <img
                  src={profileSilhouette}
                  alt="Farhan"
                  className="w-14 h-14 rounded-full object-cover border-2 border-border paper-shadow bg-[hsl(var(--paper-cream))]"
                />
                <div className="flex-1">
                  <p className="font-editorial text-sm font-semibold text-foreground mb-1">Farhan</p>
                  <p className="text-xs text-muted-foreground font-body leading-relaxed">
                    Penulis & pemikir yang mengeksplorasi filsafat, stoikisme, dan kebijaksanaan hidup melalui tulisan.
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm font-body text-muted-foreground">
                <a href="/about" className="hover:text-accent transition-colors inline-block paper-link">
                  Selengkapnya →
                </a>
              </div>
            </div>
            
            <div className="paper-note">
              <h3 className="font-caps text-xs tracking-widest mb-4 text-foreground">Ikuti</h3>
              <ul className="space-y-3 text-sm font-body text-muted-foreground">
                <li>
                  <a href="#instagram" className="hover:text-accent transition-colors inline-block paper-link">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#twitter" className="hover:text-accent transition-colors inline-block paper-link">
                    Twitter
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
            <a href="#twitter" className="floating-button w-10 h-10" aria-label="Twitter">
              <Twitter className="w-4 h-4" />
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
