import { Feather, Instagram, Twitter, Mail, ArrowRight, Sparkles, BookOpen, Heart, Compass } from "lucide-react";
import { motion } from "framer-motion";
import profileSilhouette from "@/assets/profile-silhouette.png";

// Paper grain texture
const PAPER_GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`;

const Footer = () => {
  const navLinks = [
    { label: "Filsafat", href: "/filsafat", icon: BookOpen },
    { label: "Book Review", href: "/book-review", icon: Sparkles },
    { label: "Wellness", href: "/wellness", icon: Heart },
    { label: "Travel", href: "/travel", icon: Compass },
  ];

  const socialLinks = [
    { icon: Instagram, href: "#instagram", label: "Instagram", color: "hover:text-pink-500" },
    { icon: Twitter, href: "#twitter", label: "Twitter", color: "hover:text-sky-500" },
    { icon: Mail, href: "mailto:hello@sophrosyne.com", label: "Email", color: "hover:text-amber-500" },
  ];

  return (
    <footer className="relative mt-24">
      {/* Decorative Torn Paper Edge */}
      <div className="absolute top-0 left-0 right-0 h-8 overflow-hidden -translate-y-full">
        <svg 
          viewBox="0 0 1200 32" 
          preserveAspectRatio="none" 
          className="absolute bottom-0 w-full h-full"
          fill="hsl(var(--card))"
        >
          <path d="M0 32 Q 50 20, 100 28 T 200 24 T 300 30 T 400 22 T 500 28 T 600 20 T 700 26 T 800 22 T 900 28 T 1000 24 T 1100 30 T 1200 26 L 1200 32 L 0 32 Z" />
        </svg>
        {/* Shadow under torn edge */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-[hsl(var(--paper-shadow)/0.15)] to-transparent" />
      </div>

      {/* Main Footer Container */}
      <div className="relative bg-card overflow-hidden">
        {/* Paper grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: PAPER_GRAIN }}
        />
        
        {/* Decorative gradient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-radial from-accent/5 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          {/* Main Content Section */}
          <div className="py-12 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
            
            {/* Brand Column */}
            <div className="md:col-span-4 space-y-6">
              <a href="/" className="inline-flex items-center gap-3 group">
                <div className="w-12 h-12 bg-primary border-2 border-primary flex items-center justify-center paper-shadow transition-all group-hover:rotate-6 rounded-lg">
                  <Feather className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <span className="font-display text-xl font-bold block">Sophrosyne</span>
                  <span className="font-script text-sm text-accent">σωφροσύνη</span>
                </div>
              </a>
              
              <p className="font-body text-muted-foreground text-sm leading-relaxed max-w-xs">
                Sebuah ruang untuk mengeksplorasi kebijaksanaan, menemukan inspirasi, 
                dan menjalani hidup dengan lebih bermakna.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ y: -3 }}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg bg-[hsl(var(--paper-cream))] border border-border text-muted-foreground transition-colors ${social.color}`}
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Navigation Column */}
            <div className="md:col-span-3">
              <h4 className="font-caps text-xs tracking-widest text-foreground mb-5">Jelajahi</h4>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="group flex items-center gap-3 text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <span className="w-8 h-8 flex items-center justify-center rounded-md bg-muted/50 group-hover:bg-accent/10 transition-colors">
                        <link.icon className="w-4 h-4 group-hover:text-accent transition-colors" />
                      </span>
                      <span>{link.label}</span>
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Author Column */}
            <div className="md:col-span-5">
              <h4 className="font-caps text-xs tracking-widest text-foreground mb-5">Tentang Penulis</h4>
              <div className="relative p-5 bg-[hsl(var(--paper-cream))] rounded-xl border border-border paper-shadow">
                {/* Paper texture */}
                <div
                  className="absolute inset-0 opacity-[0.02] pointer-events-none rounded-xl"
                  style={{ backgroundImage: PAPER_GRAIN }}
                />
                
                <div className="relative flex items-start gap-4">
                  <div className="relative flex-shrink-0">
                    <img
                      src={profileSilhouette}
                      alt="Farhan"
                      className="w-16 h-16 rounded-full object-cover border-2 border-border bg-muted"
                    />
                    {/* Online indicator */}
                    <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-[hsl(var(--paper-cream))] rounded-full" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-editorial text-base font-semibold">Farhan</span>
                      <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-caps">Penulis</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-body leading-relaxed mb-3">
                      Pengamat filsafat, pencinta buku, dan penulis yang mengeksplorasi makna hidup melalui tulisan.
                    </p>
                    <a
                      href="/about"
                      className="inline-flex items-center gap-1.5 text-xs font-caps text-accent hover:text-accent/80 transition-colors"
                    >
                      <span>Selengkapnya</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Copyright */}
          <div className="py-6 border-t border-border/50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs font-body text-muted-foreground text-center sm:text-left">
                © {new Date().getFullYear()} Sophrosyne. Dibuat dengan <Heart className="w-3 h-3 inline text-red-400" /> dan secangkir kopi.
              </p>
              
              <div className="flex items-center gap-6 text-xs font-body text-muted-foreground">
                <a href="/privacy" className="hover:text-foreground transition-colors">Privasi</a>
                <a href="/terms" className="hover:text-foreground transition-colors">Ketentuan</a>
                <a href="/contact" className="hover:text-foreground transition-colors">Kontak</a>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative corner papers */}
        <div className="absolute bottom-0 left-8 w-16 h-20 bg-[hsl(var(--paper-aged))] paper-shadow transform rotate-[-5deg] opacity-20 hidden lg:block" />
        <div className="absolute bottom-4 right-12 w-12 h-16 bg-[hsl(var(--paper-cream))] paper-shadow transform rotate-[8deg] opacity-30 hidden lg:block" />
      </div>
    </footer>
  );
};

export default Footer;
