/**
 * CMS Call to Action Block Component
 */

import { ArrowRight } from "lucide-react";

interface CTABlockProps {
  text?: string;
  url?: string;
  ctaStyle?: "primary" | "secondary" | "link";
  description?: string;
}

const CTABlock = ({ text, url, ctaStyle = "primary", description }: CTABlockProps) => {
  if (!text || !url) return null;

  const styles = {
    primary: "bg-accent text-white hover:bg-accent/90 shadow-lg",
    secondary: "bg-[hsl(var(--paper-aged))] text-foreground border-2 border-border hover:border-accent",
    link: "text-accent hover:text-accent/80 underline underline-offset-4",
  };

  if (ctaStyle === "link") {
    return (
      <div className="my-8 text-center">
        <a
          href={url}
          target={url.startsWith("http") ? "_blank" : undefined}
          rel={url.startsWith("http") ? "noopener noreferrer" : undefined}
          className={`inline-flex items-center gap-2 font-medium ${styles.link}`}
        >
          {text}
          <ArrowRight className="w-4 h-4" />
        </a>
        {description && (
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    );
  }

  return (
    <div className="my-8 text-center">
      {description && (
        <p className="mb-4 text-muted-foreground font-body">{description}</p>
      )}
      <a
        href={url}
        target={url.startsWith("http") ? "_blank" : undefined}
        rel={url.startsWith("http") ? "noopener noreferrer" : undefined}
        className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${styles[ctaStyle]}`}
      >
        {text}
        <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
};

export default CTABlock;
