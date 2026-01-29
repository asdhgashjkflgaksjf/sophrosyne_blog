import { useState } from "react";
import { Languages, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 rounded-sm border-border hover:bg-muted"
          disabled={isTranslating}
        >
          {isTranslating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Languages className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">
            {currentLang?.nativeName || "Bahasa"}
          </span>
          <span className="sm:hidden">{currentLang?.code.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 max-h-80 overflow-y-auto bg-card border-border"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageSelect(lang)}
            className={cn(
              "flex items-center justify-between cursor-pointer",
              currentLanguage === lang.code && "bg-muted"
            )}
          >
            <div className="flex flex-col">
              <span className="font-medium">{lang.nativeName}</span>
              <span className="text-xs text-muted-foreground">{lang.name}</span>
            </div>
            {currentLanguage === lang.code && (
              <Check className="w-4 h-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ArticleTranslator;
