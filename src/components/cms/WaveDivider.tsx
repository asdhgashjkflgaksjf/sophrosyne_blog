/**
 * Wave Divider SVG Component
 */

const WaveDivider = () => (
  <div className="my-10 flex items-center justify-center">
    <svg 
      width="120" 
      height="20" 
      viewBox="0 0 120 20" 
      fill="none" 
      className="text-[hsl(var(--sepia)/0.4)]"
    >
      <path 
        d="M0 10 Q15 0, 30 10 T60 10 T90 10 T120 10" 
        stroke="currentColor" 
        strokeWidth="2" 
        fill="none"
      />
    </svg>
  </div>
);

export default WaveDivider;
