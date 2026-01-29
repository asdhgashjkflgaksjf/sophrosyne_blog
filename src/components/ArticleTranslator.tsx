import { useState } from "react";
import { Globe, Check, Loader2, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { SUPPORTED_LANGUAGES, Language } from "@/hooks/useGoogleTranslate";
import { cn } from "@/lib/utils";

interface ArticleTranslatorProps {
  currentLanguage: string;
  onLanguageChange: (langCode: string) => void;
  isTranslating: boolean;
}

const ArticleTranslator = ({
  currentLanguage,
  onLanguageChange,
  isTranslating,
}: ArticleTranslatorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = SUPPORTED_LANGUAGES.find(
    (l) => l.code === currentLanguage
  );

  const handleLanguageSelect = (lang: Language) => {
    onLanguageChange(lang.code);
    setIsOpen(false);
  };

  // Group languages: popular first, then others
  const popularCodes = ["id", "en", "zh", "ja", "ko"];
  const popularLanguages = SUPPORTED_LANGUAGES.filter((l) =>
    popularCodes.includes(l.code)
  );
  const otherLanguages = SUPPORTED_LANGUAGES.filter(
    (l) => !popularCodes.includes(l.code)
  );

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          disabled={isTranslating}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2",
            "bg-background border border-border rounded-sm",
            "text-sm font-medium text-foreground",
            "hover:bg-muted hover:border-primary/50 transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "paper-shadow"
          )}
        >
          {isTranslating ? (
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          ) : (
            <Globe className="w-4 h-4 text-primary" />
          )}
          <span className="hidden sm:inline font-caps tracking-wide">
            {currentLang?.nativeName || "Bahasa"}
          </span>
          <span className="sm:hidden font-caps">
            {currentLang?.code.toUpperCase()}
          </span>
          <ChevronDown
            className={cn(
              "w-3 h-3 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className={cn(
          "w-64 max-h-[400px] overflow-y-auto",
          "bg-card border border-border rounded-sm",
          "shadow-lg z-50"
        )}
      >
        <DropdownMenuLabel className="text-xs font-caps tracking-wider text-muted-foreground px-3 py-2">
          Pilih Bahasa
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />

        {/* Popular Languages */}
        <div className="py-1">
          {popularLanguages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageSelect(lang)}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 cursor-pointer",
                "hover:bg-muted focus:bg-muted",
                currentLanguage === lang.code && "bg-accent/10"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-muted text-xs font-bold uppercase">
                  {lang.code}
                </span>
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">
                    {lang.nativeName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {lang.name}
                  </span>
                </div>
              </div>
              {currentLanguage === lang.code && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </div>

        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuLabel className="text-xs font-caps tracking-wider text-muted-foreground px-3 py-2">
          Bahasa Lainnya
        </DropdownMenuLabel>

        {/* Other Languages */}
        <div className="py-1">
          {otherLanguages.map((lang) => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageSelect(lang)}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 cursor-pointer",
                "hover:bg-muted focus:bg-muted",
                currentLanguage === lang.code && "bg-accent/10"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-muted text-xs font-bold uppercase">
                  {lang.code}
                </span>
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">
                    {lang.nativeName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {lang.name}
                  </span>
                </div>
              </div>
              {currentLanguage === lang.code && (
                <Check className="w-4 h-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </div>

        {/* Footer note */}
        <DropdownMenuSeparator className="bg-border" />
        <div className="px-3 py-2 text-[10px] text-muted-foreground text-center italic">
          Powered by Google Translate
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ArticleTranslator;
