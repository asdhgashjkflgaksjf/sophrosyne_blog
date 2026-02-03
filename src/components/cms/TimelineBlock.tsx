/**
 * CMS Timeline Block Component
 */

interface TimelineEvent {
  date: string;
  title: string;
  description: string;
}

interface TimelineBlockProps {
  title?: string;
  items?: TimelineEvent[];
}

const TimelineBlock = ({ title, items }: TimelineBlockProps) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="my-8">
      {title && (
        <h4 className="text-xl font-editorial font-bold mb-6">{title}</h4>
      )}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[hsl(var(--sepia)/0.3)]" />
        
        <div className="space-y-6">
          {items.map((item, i) => (
            <div key={i} className="relative pl-10">
              {/* Dot */}
              <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-accent border-2 border-[hsl(var(--paper-cream))]" />
              
              <div className="bg-[hsl(var(--paper-aged)/0.3)] rounded-lg p-4 border border-[hsl(var(--sepia)/0.2)]">
                <div className="text-xs font-caps tracking-wider text-accent mb-1">
                  {item.date}
                </div>
                <h5 className="font-medium text-foreground mb-2">
                  {item.title}
                </h5>
                <div
                  className="text-sm text-muted-foreground font-body leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineBlock;
