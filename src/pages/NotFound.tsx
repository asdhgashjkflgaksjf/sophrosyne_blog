import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Search, BookOpen, Feather, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Paper grain texture
const PAPER_GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)'/%3E%3C/svg%3E")`;

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen paper-page">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-16 md:py-24">
        {/* Main 404 Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Background paper layers for depth */}
          <div className="absolute inset-0 bg-[hsl(var(--paper-aged))] transform rotate-2 translate-x-3 translate-y-3 opacity-60" />
          <div className="absolute inset-0 bg-[hsl(var(--paper-cream))] transform -rotate-1 translate-x-1 translate-y-1 opacity-80" />
          
          {/* Main card */}
          <div className="relative bg-[hsl(var(--paper-cream))] border border-[hsl(var(--sepia)/0.3)] p-8 md:p-12 lg:p-16 overflow-hidden">
            {/* Paper texture overlay */}
            <div 
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{ backgroundImage: PAPER_GRAIN }}
            />
            
            {/* Decorative tape */}
            <div className="absolute -top-1 left-1/4 w-20 h-6 bg-[hsl(var(--sepia-light)/0.5)] transform -rotate-3" />
            <div className="absolute -top-1 right-1/3 w-16 h-6 bg-[hsl(var(--sepia-light)/0.4)] transform rotate-2" />
            
            {/* Corner decorations */}
            <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-[hsl(var(--sepia)/0.3)]" />
            <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-[hsl(var(--sepia)/0.3)]" />
            <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-[hsl(var(--sepia)/0.3)]" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-[hsl(var(--sepia)/0.3)]" />
            
            {/* Decorative scattered papers */}
            <motion.div 
              className="absolute -top-4 -right-4 w-24 h-32 bg-[hsl(var(--paper-aged))] paper-shadow transform rotate-12 opacity-40 hidden md:block"
              animate={{ rotate: [12, 14, 12] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute -bottom-6 -left-6 w-20 h-28 bg-[hsl(var(--torn-edge))] paper-shadow transform -rotate-8 opacity-30 hidden md:block"
              animate={{ rotate: [-8, -10, -8] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative text-center space-y-8">
              {/* Decorative ornament */}
              <div className="flex items-center justify-center gap-4">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-[hsl(var(--sepia)/0.4)]" />
                <Feather className="w-6 h-6 text-[hsl(var(--sepia)/0.6)]" />
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-[hsl(var(--sepia)/0.4)]" />
              </div>

              {/* 404 Number - Vintage Typography */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <h1 className="font-display text-[120px] md:text-[180px] font-bold leading-none text-[hsl(var(--sepia)/0.15)] relative">
                  404
                  {/* Overlay text for depth */}
                  <span className="absolute inset-0 font-display text-[120px] md:text-[180px] font-bold text-foreground opacity-90" style={{ transform: 'translate(-2px, -2px)' }}>
                    404
                  </span>
                </h1>
              </motion.div>

              {/* Message */}
              <div className="space-y-4">
                <h2 className="font-editorial text-2xl md:text-3xl font-semibold text-foreground">
                  Halaman Tidak Ditemukan
                </h2>
                <p className="font-script text-xl md:text-2xl text-accent">
                  "Seperti halaman yang hilang dari buku tua..."
                </p>
                <p className="font-body text-muted-foreground max-w-md mx-auto">
                  Maaf, halaman yang Anda cari tidak ada atau mungkin telah dipindahkan. 
                  Mari kembali ke beranda dan temukan bacaan menarik lainnya.
                </p>
              </div>

              {/* Torn paper note */}
              <motion.div 
                className="inline-block"
                initial={{ rotate: -3 }}
                animate={{ rotate: [-3, -1, -3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="relative bg-[hsl(var(--paper-aged))] px-6 py-4 paper-shadow">
                  {/* Torn top edge */}
                  <div className="absolute -top-2 left-0 right-0 h-3 overflow-hidden">
                    <svg viewBox="0 0 200 12" className="w-full h-full" preserveAspectRatio="none">
                      <path 
                        d="M0,12 L0,6 Q10,2 20,6 Q30,10 40,6 Q50,2 60,6 Q70,10 80,6 Q90,2 100,6 Q110,10 120,6 Q130,2 140,6 Q150,10 160,6 Q170,2 180,6 Q190,10 200,6 L200,12 Z"
                        fill="hsl(var(--paper-aged))"
                      />
                    </svg>
                  </div>
                  <p className="font-caps text-[10px] tracking-widest text-[hsl(var(--sepia))]">
                    Halaman yang dicari: <span className="font-body text-xs">{location.pathname}</span>
                  </p>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <motion.a
                  href="/"
                  className="group flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-body font-medium paper-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Home className="w-5 h-5" />
                  Kembali ke Beranda
                </motion.a>
                
                <motion.a
                  href="/#articles"
                  className="group flex items-center gap-3 px-8 py-4 bg-[hsl(var(--paper-aged))] border-2 border-[hsl(var(--sepia)/0.3)] text-foreground font-body font-medium hover:border-accent transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <BookOpen className="w-5 h-5 text-accent" />
                  Jelajahi Artikel
                </motion.a>
              </div>

              {/* Decorative bottom ornament */}
              <div className="flex items-center justify-center gap-3 pt-8">
                <span className="text-[hsl(var(--sepia)/0.4)]">✦</span>
                <span className="text-[hsl(var(--sepia)/0.3)]">✦</span>
                <span className="text-[hsl(var(--sepia)/0.4)]">✦</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Suggested Links */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-12"
        >
          <div className="text-center mb-6">
            <span className="font-caps text-[10px] tracking-widest text-[hsl(var(--sepia))]">
              Mungkin Anda mencari
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Filsafat", href: "/filsafat", icon: BookOpen },
              { label: "Book Review", href: "/book-review", icon: Feather },
              { label: "Pertumbuhan", href: "/growth", icon: Search },
              { label: "Tentang", href: "/about", icon: Home },
            ].map((link, index) => (
              <motion.a
                key={link.href}
                href={link.href}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="group relative bg-[hsl(var(--paper-cream))] border border-[hsl(var(--sepia)/0.2)] p-4 text-center hover:border-accent transition-all"
              >
                <div 
                  className="absolute inset-0 opacity-[0.03] pointer-events-none"
                  style={{ backgroundImage: PAPER_GRAIN }}
                />
                <link.icon className="w-5 h-5 mx-auto mb-2 text-[hsl(var(--sepia))] group-hover:text-accent transition-colors" />
                <span className="font-body text-sm text-foreground group-hover:text-accent transition-colors">
                  {link.label}
                </span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;