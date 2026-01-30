import { motion } from "framer-motion";

interface VintageLoaderProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

const VintageLoader = ({ message = "Memuat...", size = "md" }: VintageLoaderProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Vintage paper stack animation */}
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Bottom paper */}
        <motion.div
          className="absolute inset-0 bg-paper-cream border border-sepia/20 rounded-sm paper-shadow"
          style={{
            transformOrigin: "center bottom",
          }}
          animate={{
            rotate: [-3, 3, -3],
            y: [0, -2, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Middle paper */}
        <motion.div
          className="absolute inset-0 bg-card border border-sepia/30 rounded-sm"
          style={{
            transformOrigin: "center bottom",
          }}
          animate={{
            rotate: [2, -2, 2],
            y: [-4, -6, -4],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2,
          }}
        />
        
        {/* Top paper with writing animation */}
        <motion.div
          className="absolute inset-0 bg-background border border-sepia/40 rounded-sm overflow-hidden"
          style={{
            transformOrigin: "center bottom",
          }}
          animate={{
            rotate: [-1, 1, -1],
            y: [-8, -10, -8],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4,
          }}
        >
          {/* Animated writing lines */}
          <div className="absolute inset-2 flex flex-col gap-1 pt-1">
            <motion.div
              className="h-0.5 bg-sepia/30 rounded-full"
              animate={{
                scaleX: [0, 1, 1, 0],
                originX: 0,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="h-0.5 bg-sepia/20 rounded-full w-3/4"
              animate={{
                scaleX: [0, 1, 1, 0],
                originX: 0,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3,
              }}
            />
            <motion.div
              className="h-0.5 bg-sepia/25 rounded-full w-1/2"
              animate={{
                scaleX: [0, 1, 1, 0],
                originX: 0,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.6,
              }}
            />
          </div>
        </motion.div>

        {/* Floating quill/pen */}
        <motion.div
          className="absolute -right-2 -top-2 text-sepia"
          animate={{
            rotate: [0, -15, 0],
            x: [0, 3, 0],
            y: [0, -3, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className={size === "sm" ? "w-3 h-3" : size === "md" ? "w-4 h-4" : "w-5 h-5"}
          >
            <path d="M12 19l7-7 3 3-7 7-3-3z" />
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            <path d="M2 2l7.586 7.586" />
          </svg>
        </motion.div>
      </div>

      {/* Loading text with typewriter effect */}
      <motion.p
        className={`font-script text-sepia ${textSizes[size]}`}
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {message}
      </motion.p>

      {/* Decorative dots */}
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1 h-1 rounded-full bg-sepia/50"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Skeleton variant for content loading
export const VintageSkeleton = ({ className = "" }: { className?: string }) => {
  return (
    <motion.div
      className={`bg-gradient-to-r from-paper-cream via-paper-aged/30 to-paper-cream rounded-sm ${className}`}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        backgroundSize: "200% 100%",
      }}
    />
  );
};

// Full page vintage loader
export const VintagePageLoader = ({ message }: { message?: string }) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="relative">
        {/* Paper texture background */}
        <div 
          className="absolute -inset-20 rounded-lg opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        
        <VintageLoader message={message} size="lg" />
      </div>
    </div>
  );
};

export default VintageLoader;
