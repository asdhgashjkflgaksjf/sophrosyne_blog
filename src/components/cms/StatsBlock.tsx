/**
 * CMS Stats/Numbers Block Component
 */

interface StatItem {
  value: string;
  label: string;
  description?: string;
}

interface StatsBlockProps {
  items?: StatItem[];
}

const StatsBlock = ({ items }: StatsBlockProps) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="my-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item, i) => (
        <div
          key={i}
          className="text-center p-4 bg-[hsl(var(--paper-aged)/0.3)] rounded-lg border border-[hsl(var(--sepia)/0.2)]"
        >
          <div className="text-3xl md:text-4xl font-editorial font-bold text-accent mb-1">
            {item.value}
          </div>
          <div className="text-sm font-caps tracking-wider text-foreground">
            {item.label}
          </div>
          {item.description && (
            <div className="text-xs text-muted-foreground mt-1">
              {item.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StatsBlock;
