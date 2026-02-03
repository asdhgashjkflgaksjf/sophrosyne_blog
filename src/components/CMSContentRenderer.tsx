/**
 * CMS Content Block Renderer
 * Renders various content blocks from Decap CMS
 */

import { Info, Lightbulb, AlertTriangle, Quote, Copy, Check } from "lucide-react";
import { CMSContentBlock } from "@/lib/contentLoader";
import { Highlight, themes } from "prism-react-renderer";
import { useState } from "react";

// Import new block components
import TableBlock from "@/components/cms/TableBlock";
import EmbedBlock from "@/components/cms/EmbedBlock";
import CTABlock from "@/components/cms/CTABlock";
import GalleryBlock from "@/components/cms/GalleryBlock";
import NoteBlock from "@/components/cms/NoteBlock";
import StatsBlock from "@/components/cms/StatsBlock";
import FAQBlock from "@/components/cms/FAQBlock";
import TimelineBlock from "@/components/cms/TimelineBlock";
import WaveDivider from "@/components/cms/WaveDivider";

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

// Code Block Component with Prism syntax highlighting
const CodeBlock = ({ language = "javascript", code, caption }: { language?: string; code: string; caption?: string }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Map common language aliases
  const languageMap: Record<string, string> = {
    js: "javascript",
    ts: "typescript",
    jsx: "jsx",
    tsx: "tsx",
    py: "python",
    rb: "ruby",
    sh: "bash",
    shell: "bash",
    yml: "yaml",
    md: "markdown",
  };
  
  const normalizedLanguage = languageMap[language?.toLowerCase() || ""] || language?.toLowerCase() || "javascript";
  
  return (
    <figure className="my-8 group">
      <div className="relative overflow-hidden border border-[hsl(var(--sepia)/0.3)]">
        {/* Terminal header */}
        <div className="bg-[hsl(var(--sepia))] px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            {language && (
              <span className="ml-4 text-xs text-[hsl(var(--paper-cream))] font-mono uppercase tracking-wider">
                {language}
              </span>
            )}
          </div>
          <button
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white/10 rounded text-[hsl(var(--paper-cream))]"
            title="Copy code"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        
        {/* Code content with Prism highlighting */}
        <Highlight
          theme={themes.nightOwl}
          code={code.trim()}
          language={normalizedLanguage as any}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre 
              className={`${className} p-4 overflow-x-auto text-sm`}
              style={{ 
                ...style, 
                margin: 0,
                backgroundColor: 'hsl(var(--ink-dark))',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              }}
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })} className="table-row">
                  <span className="table-cell text-right pr-4 select-none opacity-40 text-xs">
                    {i + 1}
                  </span>
                  <span className="table-cell">
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground font-script italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

function normalizeCodeValue(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    const maybe = value as { code?: unknown; value?: unknown };
    if (typeof maybe.code === "string") return maybe.code;
    if (typeof maybe.value === "string") return maybe.value;
  }
  return "";
}

// Divider Component
const DividerBlock = ({ style = "line" }: { style?: "line" | "dots" | "ornament" | "wave" }) => {
  if (style === "wave") {
    return <WaveDivider />;
  }

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
            // Type guard: list items are string[]
            const listItems = block.items as string[] | undefined;
            return listItems && listItems.length > 0 ? (
              <ListBlock 
                key={index} 
                items={listItems} 
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
            const normalizedCode = normalizeCodeValue(block.code);
            return normalizedCode ? (
              <CodeBlock 
                key={index} 
                language={block.language} 
                code={normalizedCode}
                caption={block.caption}
              />
            ) : null;
          
          case "divider":
            return <DividerBlock key={index} style={block.style} />;
          
          case "table":
            return (
              <TableBlock 
                key={index} 
                headers={block.headers}
                rows={block.rows}
                caption={block.caption}
              />
            );
          
          case "embed":
            return (
              <EmbedBlock
                key={index}
                embedType={block.embedType}
                url={block.url}
                caption={block.caption}
              />
            );
          
          case "cta":
            return (
              <CTABlock
                key={index}
                text={block.text}
                url={block.url}
                ctaStyle={block.ctaStyle}
                description={block.description}
              />
            );
          
          case "gallery":
            return (
              <GalleryBlock
                key={index}
                images={block.images}
                layout={block.layout}
                caption={block.caption}
              />
            );
          
          case "note":
            return (
              <NoteBlock
                key={index}
                text={block.text}
                position={block.position}
              />
            );
          
          case "stats":
            // Type guard: stats items are { value, label, description? }[]
            const statsItems = block.items as { value: string; label: string; description?: string }[] | undefined;
            return (
              <StatsBlock
                key={index}
                items={statsItems}
              />
            );
          
          case "faq":
            // Type guard: faq items are { question, answer }[]
            const faqItems = block.items as { question: string; answer: string }[] | undefined;
            return (
              <FAQBlock
                key={index}
                title={block.title}
                items={faqItems}
              />
            );
          
          case "timeline":
            // Type guard: timeline items are { date, title, description }[]
            const timelineItems = block.items as { date: string; title: string; description: string }[] | undefined;
            return (
              <TimelineBlock
                key={index}
                title={block.title}
                items={timelineItems}
              />
            );
          
          default:
            return null;
        }
      })}
    </div>
  );
};

export default CMSContentRenderer;
