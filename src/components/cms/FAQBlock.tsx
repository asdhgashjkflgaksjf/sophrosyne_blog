/**
 * CMS FAQ/Accordion Block Component
 */

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQBlockProps {
  title?: string;
  items?: FAQItem[];
}

const FAQBlock = ({ title, items }: FAQBlockProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!items || items.length === 0) return null;

  return (
    <div className="my-8">
      {title && (
        <h4 className="text-xl font-editorial font-bold mb-4">{title}</h4>
      )}
      <div className="space-y-2">
        {items.map((item, i) => (
          <div
            key={i}
            className="border border-[hsl(var(--sepia)/0.2)] rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-4 text-left bg-[hsl(var(--paper-cream))] hover:bg-[hsl(var(--paper-aged)/0.5)] transition-colors"
            >
              <span className="font-medium text-foreground pr-4">
                {item.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${
                  openIndex === i ? "rotate-180" : ""
                }`}
              />
            </button>
            
            {openIndex === i && (
              <div className="p-4 bg-[hsl(var(--paper-aged)/0.2)] border-t border-[hsl(var(--sepia)/0.1)]">
                <div
                  className="text-muted-foreground font-body leading-relaxed prose prose-sm"
                  dangerouslySetInnerHTML={{ __html: item.answer }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQBlock;
