import { useState, useCallback } from "react";

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia" },
  { code: "en", name: "English", nativeName: "English" },
  { code: "zh", name: "Chinese", nativeName: "中文" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "ko", name: "Korean", nativeName: "한국어" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "ru", name: "Russian", nativeName: "Русский" },
  { code: "th", name: "Thai", nativeName: "ไทย" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt" },
];

interface TranslationCache {
  [key: string]: string;
}

export const useGoogleTranslate = () => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<string>("id");
  const [translationCache] = useState<TranslationCache>({});

  const translateText = useCallback(
    async (text: string, targetLang: string): Promise<string> => {
      if (!text || targetLang === "id") return text;

      const cacheKey = `${text.substring(0, 50)}_${targetLang}`;
      if (translationCache[cacheKey]) {
        return translationCache[cacheKey];
      }

      try {
        // Using the free Google Translate API endpoint
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=id&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

        const response = await fetch(url);
        const data = await response.json();

        // Extract translated text from response
        let translatedText = "";
        if (data && data[0]) {
          for (const item of data[0]) {
            if (item[0]) {
              translatedText += item[0];
            }
          }
        }

        // Cache the result
        translationCache[cacheKey] = translatedText || text;
        return translatedText || text;
      } catch (error) {
        console.error("Translation error:", error);
        return text;
      }
    },
    [translationCache]
  );

  const translateArticle = useCallback(
    async (article: {
      title: string;
      subtitle: string;
      content: {
        introduction: string;
        sections: { heading: string; content: string }[];
        conclusion: string;
      };
    }, targetLang: string) => {
      if (targetLang === "id") {
        return null; // Return null to indicate original content should be used
      }

      setIsTranslating(true);

      try {
        // Translate all parts in parallel for efficiency
        const [
          translatedTitle,
          translatedSubtitle,
          translatedIntro,
          translatedConclusion,
          ...translatedSections
        ] = await Promise.all([
          translateText(article.title, targetLang),
          translateText(article.subtitle, targetLang),
          translateText(article.content.introduction, targetLang),
          translateText(article.content.conclusion, targetLang),
          ...article.content.sections.flatMap((section) => [
            translateText(section.heading, targetLang),
            translateText(section.content, targetLang),
          ]),
        ]);

        // Reconstruct sections
        const sections: { heading: string; content: string }[] = [];
        for (let i = 0; i < article.content.sections.length; i++) {
          sections.push({
            heading: translatedSections[i * 2] as string,
            content: translatedSections[i * 2 + 1] as string,
          });
        }

        return {
          title: translatedTitle,
          subtitle: translatedSubtitle,
          content: {
            introduction: translatedIntro,
            sections,
            conclusion: translatedConclusion,
          },
        };
      } catch (error) {
        console.error("Article translation error:", error);
        return null;
      } finally {
        setIsTranslating(false);
      }
    },
    [translateText]
  );

  return {
    translateText,
    translateArticle,
    isTranslating,
    currentLanguage,
    setCurrentLanguage,
    languages: SUPPORTED_LANGUAGES,
  };
};
