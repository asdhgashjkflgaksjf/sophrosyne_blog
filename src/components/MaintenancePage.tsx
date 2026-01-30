/**
 * Maintenance Page Component
 * Displays a vintage paper style maintenance message
 */

import { motion } from "framer-motion";
import { Wrench, Clock, Mail, Coffee } from "lucide-react";

interface MaintenanceSettings {
  enabled: boolean;
  title?: string;
  message?: string;
  estimatedTime?: string;
  contactEmail?: string;
  showProgress?: boolean;
  progressPercent?: number;
}

interface MaintenancePageProps {
  settings: MaintenanceSettings;
}

const MaintenancePage = ({ settings }: MaintenancePageProps) => {
  const {
    title = "Sedang Dalam Perbaikan",
    message = "Kami sedang melakukan pembaruan untuk memberikan pengalaman yang lebih baik. Silakan kembali lagi nanti.",
    estimatedTime,
    contactEmail,
    showProgress = false,
    progressPercent = 0,
  } = settings;

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Paper grain texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Decorative scattered papers */}
      <motion.div 
        className="absolute top-10 left-10 w-32 h-40 bg-[hsl(var(--paper-aged))] opacity-30 transform -rotate-12"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 0.3, y: 0 }}
        transition={{ delay: 0.2 }}
      />
      <motion.div 
        className="absolute bottom-20 right-20 w-24 h-32 bg-[hsl(var(--paper-cream))] opacity-20 transform rotate-[15deg]"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 0.2, y: 0 }}
        transition={{ delay: 0.3 }}
      />
      <motion.div 
        className="absolute top-1/4 right-10 w-20 h-28 bg-[hsl(var(--sepia-light))] opacity-25 transform rotate-6"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 0.25, x: 0 }}
        transition={{ delay: 0.4 }}
      />
      
      {/* Main maintenance card */}
      <motion.div 
        className="relative max-w-2xl w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Paper layers */}
        <div className="absolute inset-0 bg-[hsl(var(--paper-aged))] transform rotate-2 translate-x-2 translate-y-2" />
        <div className="absolute inset-0 bg-[hsl(var(--paper-cream))] transform -rotate-1 translate-x-1 translate-y-1" />
        
        {/* Main card */}
        <div className="relative bg-[hsl(var(--paper-cream))] border border-[hsl(var(--sepia)/0.3)] p-8 md:p-12 overflow-hidden">
          {/* Corner decorations */}
          <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-[hsl(var(--sepia)/0.3)]" />
          <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-[hsl(var(--sepia)/0.3)]" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-[hsl(var(--sepia)/0.3)]" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-[hsl(var(--sepia)/0.3)]" />
          
          {/* Tape decoration */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-[hsl(var(--sepia-light)/0.6)] transform rotate-1" />
          
          {/* Paper texture overlay */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
          
          {/* Content */}
          <div className="relative text-center">
            {/* Animated icon */}
            <motion.div 
              className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-[hsl(var(--paper-aged))] border-2 border-[hsl(var(--sepia)/0.3)] rounded-full"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <Wrench className="w-10 h-10 text-[hsl(var(--sepia))]" />
            </motion.div>
            
            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
              {title}
            </h1>
            
            {/* Decorative line */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-16 bg-[hsl(var(--sepia)/0.3)]" />
              <span className="font-script text-xl text-accent">✦</span>
              <div className="h-px w-16 bg-[hsl(var(--sepia)/0.3)]" />
            </div>
            
            {/* Message */}
            <p className="text-lg md:text-xl text-muted-foreground font-body leading-relaxed mb-8 max-w-lg mx-auto">
              {message}
            </p>
            
            {/* Progress bar */}
            {showProgress && (
              <div className="mb-8">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                  <span className="font-caps text-xs tracking-wider">Progress</span>
                  <span className="font-caps text-xs tracking-wider">{progressPercent}%</span>
                </div>
                <div className="h-3 bg-[hsl(var(--paper-aged))] border border-[hsl(var(--sepia)/0.3)] overflow-hidden">
                  <motion.div 
                    className="h-full bg-accent"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
            )}
            
            {/* Estimated time */}
            {estimatedTime && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[hsl(var(--paper-aged)/0.5)] border border-[hsl(var(--sepia)/0.2)] mb-6">
                <Clock className="w-4 h-4 text-[hsl(var(--sepia))]" />
                <span className="text-sm font-caps tracking-wider text-[hsl(var(--sepia))]">
                  Estimasi: {estimatedTime}
                </span>
              </div>
            )}
            
            {/* Coffee break illustration */}
            <motion.div 
              className="my-8 flex items-center justify-center gap-2 text-muted-foreground"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Coffee className="w-5 h-5" />
              <span className="font-script text-lg italic">Sebentar ya, sedang menyeduh kopi...</span>
            </motion.div>
            
            {/* Contact email */}
            {contactEmail && (
              <div className="mt-8 pt-6 border-t border-[hsl(var(--sepia)/0.2)]">
                <p className="text-sm text-muted-foreground mb-2">
                  Ada pertanyaan? Hubungi kami:
                </p>
                <a 
                  href={`mailto:${contactEmail}`}
                  className="inline-flex items-center gap-2 text-accent hover:underline font-body"
                >
                  <Mail className="w-4 h-4" />
                  {contactEmail}
                </a>
              </div>
            )}
            
            {/* Signature */}
            <div className="mt-8">
              <p className="font-script text-2xl text-accent">Sophrosyne</p>
              <p className="text-xs text-muted-foreground font-caps tracking-widest mt-1">
                Where Wisdom Meets Wonder
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MaintenancePage;
