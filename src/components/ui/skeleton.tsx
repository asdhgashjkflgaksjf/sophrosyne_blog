import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "rounded-sm animate-vintage-shimmer bg-gradient-to-r from-paper-cream via-paper-aged/40 to-paper-cream bg-[length:200%_100%]",
        className
      )} 
      {...props} 
    />
  );
}

// Vintage line skeleton for text
function SkeletonLine({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "h-3 rounded-full animate-vintage-shimmer bg-gradient-to-r from-sepia/10 via-sepia/25 to-sepia/10 bg-[length:200%_100%]",
        className
      )} 
      {...props} 
    />
  );
}

// Vintage card skeleton
function SkeletonCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("bg-card border border-sepia/10 rounded-sm p-4 paper-shadow", className)} {...props}>
      <Skeleton className="h-40 w-full mb-4" />
      <SkeletonLine className="w-3/4 mb-2" />
      <SkeletonLine className="w-1/2 mb-4" />
      <div className="flex gap-2">
        <SkeletonLine className="w-16 h-4" />
        <SkeletonLine className="w-20 h-4" />
      </div>
    </div>
  );
}

export { Skeleton, SkeletonLine, SkeletonCard };
