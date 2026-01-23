import { motion } from "framer-motion";

interface TornPaperEdgeProps {
  position: 'top' | 'bottom';
  variant?: 'rough' | 'smooth' | 'jagged';
  className?: string;
  animate?: boolean;
}

const TornPaperEdge = ({ position, variant = 'rough', className = '', animate = false }: TornPaperEdgeProps) => {
  const getPath = () => {
    switch (variant) {
      case 'smooth':
        return position === 'top'
          ? "M0,20 Q25,10 50,18 T100,15 T150,20 T200,12 T250,18 T300,14 T350,20 T400,15 L400,0 L0,0 Z"
          : "M0,0 Q25,10 50,2 T100,8 T150,0 T200,10 T250,3 T300,8 T350,2 T400,8 L400,20 L0,20 Z";
      case 'jagged':
        return position === 'top'
          ? "M0,20 L15,8 L30,18 L45,5 L60,15 L75,10 L90,20 L105,6 L120,16 L135,8 L150,18 L165,4 L180,14 L195,10 L210,20 L225,6 L240,16 L255,8 L270,18 L285,5 L300,15 L315,10 L330,20 L345,6 L360,16 L375,8 L390,18 L400,10 L400,0 L0,0 Z"
          : "M0,0 L15,12 L30,2 L45,15 L60,5 L75,10 L90,0 L105,14 L120,4 L135,12 L150,2 L165,16 L180,6 L195,10 L210,0 L225,14 L240,4 L255,12 L270,2 L285,15 L300,5 L315,10 L330,0 L345,14 L360,4 L375,12 L390,2 L400,10 L400,20 L0,20 Z";
      default: // rough
        return position === 'top'
          ? "M0,18 Q10,12 20,16 Q30,8 45,14 Q55,6 70,12 Q85,4 100,10 Q115,14 130,8 Q145,12 160,6 Q175,10 190,14 Q205,6 220,12 Q235,8 250,14 Q265,4 280,10 Q295,12 310,6 Q325,10 340,8 Q355,14 370,10 Q385,6 400,12 L400,0 L0,0 Z"
          : "M0,2 Q10,8 20,4 Q30,12 45,6 Q55,14 70,8 Q85,16 100,10 Q115,6 130,12 Q145,8 160,14 Q175,10 190,6 Q205,14 220,8 Q235,12 250,6 Q265,16 280,10 Q295,8 310,14 Q325,10 340,12 Q355,6 370,10 Q385,14 400,8 L400,20 L0,20 Z";
    }
  };

  const EdgeComponent = animate ? motion.div : 'div';
  const animationProps = animate ? {
    initial: { scaleY: 0 },
    animate: { scaleY: 1 },
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }
  } : {};

  return (
    <EdgeComponent
      {...animationProps}
      className={`absolute ${position === 'top' ? 'top-0 origin-bottom' : 'bottom-0 origin-top'} left-0 right-0 h-5 pointer-events-none ${className}`}
      style={{ zIndex: 10 }}
    >
      <svg
        viewBox="0 0 400 20"
        preserveAspectRatio="none"
        className="w-full h-full"
        style={{
          filter: position === 'top' 
            ? 'drop-shadow(0 2px 3px hsl(var(--paper-shadow) / 0.15))'
            : 'drop-shadow(0 -2px 3px hsl(var(--paper-shadow) / 0.15))',
        }}
      >
        <path
          d={getPath()}
          fill="hsl(var(--background))"
        />
      </svg>
      
      {/* Additional paper fiber details */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          maskImage: `url("data:image/svg+xml,${encodeURIComponent(`<svg viewBox='0 0 400 20' xmlns='http://www.w3.org/2000/svg'><path d='${getPath()}' fill='black'/></svg>`)}")`,
          maskSize: '100% 100%',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%238B7355' stroke-width='0.3' opacity='0.5'%3E%3Cpath d='M0 5 Q 20 3, 40 7 T 80 5 T 100 6'/%3E%3Cpath d='M0 10 Q 25 12, 50 8 T 100 11'/%3E%3Cpath d='M0 15 Q 15 13, 30 17 T 60 14 T 100 16'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '100px 20px',
        }}
      />
    </EdgeComponent>
  );
};

export default TornPaperEdge;
