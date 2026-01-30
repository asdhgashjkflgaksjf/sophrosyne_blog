/**
 * CMS Content Block Renderer
 * Renders various content blocks from Decap CMS
 */

import { motion } from "framer-motion";
import { Info, Lightbulb, AlertTriangle, Quote } from "lucide-react";
import { CMSContentBlock } from "@/lib/contentLoader";

interface CMSContentRendererProps {
  blocks: CMSContentBlock[];
  className?: string;
}

// Heading Component
const HeadingBlock = ({ text, level = "h2" }: { text: string; level?: "h2" | "h3" | "h4" }) => {
  const baseClasses = "font-editorial font-bold mb-4";
  const levelClasses = {
    h2: "text-3xl",
    h3: "text-2xl",
    h4: "text-xl",
  };
  
  const Tag = level;
  return (
    <Tag className={`${baseClasses} ${levelClasses[level]}`} id={text.toLowerCase().replace(/\s+/g, '-')}>
      {text}
    </Tag>
  );
};

// Paragraph Component
const ParagraphBlock = ({ text }: { text: string }) => (
  <div 
    className="text-lg leading-relaxed text-muted-foreground mb-6 font-body"
    dangerouslySetInnerHTML={{ __html: text }}
  />
);

// Quote Component
const QuoteBlock = ({ text, author }: { text: string; author?: string }) => (
  <blockquote className="relative my-8 p-6 bg-[hsl(var(--paper-aged)/0.5)] border-l-4 border-accent">
    <div className="absolute -top-3 left-4 text-5xl font-editorial text-accent/40 leading-none">
      "
    </div>
    <p className="text-lg md:text-xl leading-relaxed italic text-foreground font-editorial pl-4 mb-2">
      {text}
    </p>
    {author && (
      <cite className="block text-right text-sm text-muted-foreground font-caps tracking-wider not-italic">
        — {author}
      </cite>
    )}
  </blockquote>
);

// List Component
const ListBlock = ({ items, listType = "unordered" }: { items: string[]; listType?: "ordered" | "unordered" }) => {
  const ListTag = listType === "ordered" ? "ol" : "ul";
  const listClasses = listType === "ordered" 
    ? "list-decimal list-inside" 
    : "list-disc list-inside";
  
  return (
    <ListTag className={`${listClasses} space-y-2 mb-6 text-lg text-muted-foreground ml-4`}>
      {items.map((item, index) => (
        <li key={index} className="leading-relaxed">
          <span className="ml-2">{item}</span>
        </li>
      ))}
    </ListTag>
  );
};

// Image Component
const ImageBlock = ({ src, alt, caption, size = "full" }: { src: string; alt: string; caption?: string; size?: "full" | "medium" | "small" }) => {
  const sizeClasses = {
    full: "w-full",
    medium: "w-3/4 mx-auto",
    small: "w-1/2 mx-auto",
  };
  
  return (
    <figure className={`my-8 ${sizeClasses[size]}`}>
      <div className="relative overflow-hidden border border-[hsl(var(--sepia)/0.2)]">
        {/* Tape decoration */}
        <div className="absolute -top-1 left-1/4 w-16 h-4 bg-[hsl(var(--sepia-light)/0.6)] transform -rotate-2 z-10" />
        <div className="absolute -top-1 right-1/4 w-12 h-4 bg-[hsl(var(--sepia-light)/0.5)] transform rotate-3 z-10" />
        
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-auto object-cover"
          loading="lazy"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-muted-foreground font-script italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

// Highlight Box Component
const HighlightBlock = ({ 
  title, 
  content, 
  highlightType = "info" 
}: { 
  title?: string; 
  content: string; 
  highlightType?: "info" | "tip" | "warning" | "quote" 
}) => {
  const typeConfig = {
    info: {
      icon: Info,
      bgColor: "bg-blue-50/50 dark:bg-blue-950/20",
      borderColor: "border-blue-400",
      iconColor: "text-blue-500",
    },
    tip: {
      icon: Lightbulb,
      bgColor: "bg-amber-50/50 dark:bg-amber-950/20",
      borderColor: "border-amber-400",
      iconColor: "text-amber-500",
    },
    warning: {
      icon: AlertTriangle,
      bgColor: "bg-red-50/50 dark:bg-red-950/20",
      borderColor: "border-red-400",
      iconColor: "text-red-500",
    },
    quote: {
      icon: Quote,
      bgColor: "bg-[hsl(var(--paper-aged)/0.5)]",
      borderColor: "border-accent",
      iconColor: "text-accent",
    },
  };
  
  const config = typeConfig[highlightType];
  const Icon = config.icon;
  
  return (
    <div className={`my-8 p-6 ${config.bgColor} border-l-4 ${config.borderColor} relative`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 mt-1 ${config.iconColor} flex-shrink-0`} />
        <div className="flex-1">
          {title && (
            <h4 className="font-bold text-foreground mb-2 font-caps tracking-wide">
              {title}
            </h4>
          )}
          <div 
            className="text-muted-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  );
};

// Code Block Component
const CodeBlock = ({ language, code, caption }: { language?: string; code: string; caption?: string }) => (
  <figure className="my-8">
    <div className="relative">
      {/* Terminal header */}
      <div className="bg-[hsl(var(--sepia))] px-4 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        {language && (
          <span className="ml-4 text-xs text-[hsl(var(--paper-cream))] font-mono uppercase">
            {language}
          </span>
        )}
      </div>
      
      {/* Code content */}
      <pre className="bg-[hsl(var(--ink-dark))] p-4 overflow-x-auto">
        <code className="text-sm font-mono text-[hsl(var(--paper-cream))] whitespace-pre-wrap">
          {code}
        </code>
      </pre>
    </div>
    {caption && (
      <figcaption className="mt-2 text-center text-sm text-muted-foreground font-script italic">
        {caption}
      </figcaption>
    )}
  </figure>
);

// Divider Component
const DividerBlock = ({ style = "line" }: { style?: "line" | "dots" | "ornament" }) => {
  const dividerContent = {
    line: (
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-[hsl(var(--sepia)/0.3)]" />
        <div className="w-2 h-2 rotate-45 border border-[hsl(var(--sepia)/0.4)]" />
        <div className="flex-1 h-px bg-[hsl(var(--sepia)/0.3)]" />
      </div>
    ),
    dots: (
      <div className="flex items-center justify-center gap-3">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--sepia)/0.4)]"
          />
        ))}
      </div>
    ),
    ornament: (
      <div className="flex items-center justify-center gap-2">
        <div className="h-px w-12 bg-[hsl(var(--sepia)/0.3)]" />
        <span className="font-script text-2xl text-accent">✦</span>
        <div className="h-px w-12 bg-[hsl(var(--sepia)/0.3)]" />
      </div>
    ),
  };
  
  return (
    <div className="my-10">
      {dividerContent[style]}
    </div>
  );
};

// Main Renderer
const CMSContentRenderer = ({ blocks, className = "" }: CMSContentRendererProps) => {
  return (
    <div className={`cms-content ${className}`}>
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return block.text ? (
              <HeadingBlock 
                key={index} 
                text={block.text} 
                level={block.level} 
              />
            ) : null;
          
          case "paragraph":
            return block.text ? (
              <ParagraphBlock key={index} text={block.text} />
            ) : null;
          
          case "quote":
            return block.text ? (
              <QuoteBlock 
                key={index} 
                text={block.text} 
                author={block.author} 
              />
            ) : null;
          
          case "list":
            return block.items && block.items.length > 0 ? (
              <ListBlock 
                key={index} 
                items={block.items} 
                listType={block.listType} 
              />
            ) : null;
          
          case "image":
            return block.src ? (
              <ImageBlock 
                key={index} 
                src={block.src} 
                alt={block.alt || ""} 
                caption={block.caption}
                size={block.size}
              />
            ) : null;
          
          case "highlight":
            return block.content ? (
              <HighlightBlock 
                key={index} 
                title={block.title} 
                content={block.content}
                highlightType={block.highlightType}
              />
            ) : null;
          
          case "code":
            return block.code ? (
              <CodeBlock 
                key={index} 
                language={block.language} 
                code={block.code}
                caption={block.caption}
              />
            ) : null;
          
          case "divider":
            return <DividerBlock key={index} style={block.style} />;
          
          default:
            return null;
        }
      })}
    </div>
  );
};

export default CMSContentRenderer;
