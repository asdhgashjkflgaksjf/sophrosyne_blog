/**
 * CMS Note/Sidenote Block Component
 */

interface NoteBlockProps {
  text?: string;
  position?: "inline" | "left" | "right";
}

const NoteBlock = ({ text, position = "inline" }: NoteBlockProps) => {
  if (!text) return null;

  if (position === "inline") {
    return (
      <aside className="my-6 p-4 bg-[hsl(var(--paper-aged)/0.5)] border-l-4 border-accent/50 rounded-r-lg">
        <div
          className="text-sm text-muted-foreground italic font-body leading-relaxed"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </aside>
    );
  }

  // For margin notes (left/right), we use CSS to position them
  const marginClass = position === "left" 
    ? "md:-ml-32 md:w-28 md:float-left md:mr-4" 
    : "md:-mr-32 md:w-28 md:float-right md:ml-4";

  return (
    <aside className={`my-4 md:my-0 ${marginClass}`}>
      <div className="p-3 bg-[hsl(var(--paper-aged)/0.5)] rounded-lg border border-[hsl(var(--sepia)/0.2)]">
        <div
          className="text-xs text-muted-foreground italic font-body leading-relaxed"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </div>
    </aside>
  );
};

export default NoteBlock;
