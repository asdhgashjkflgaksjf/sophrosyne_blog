/**
 * useArticles Hook - Combines static and CMS articles
 */

import { useState, useEffect, useMemo } from "react";
import { Article, articles as staticArticles, getArticleById as getStaticArticleById } from "@/data/articles";
import { loadCMSArticles } from "@/lib/contentLoader";

interface UseArticlesResult {
  articles: Article[];
  isLoading: boolean;
  error: Error | null;
  getArticleById: (id: string) => Article | undefined;
  getArticlesByCategory: (category: string) => Article[];
  getRelatedArticles: (currentId: string, limit?: number) => Article[];
  searchArticles: (query: string) => Article[];
}

export function useArticles(): UseArticlesResult {
  const [cmsArticles, setCmsArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadArticles() {
      try {
        const loaded = await loadCMSArticles();
        setCmsArticles(loaded);
      } catch (err) {
        console.error("Failed to load CMS articles:", err);
        setError(err instanceof Error ? err : new Error("Failed to load articles"));
      } finally {
        setIsLoading(false);
      }
    }

    loadArticles();
  }, []);

  // Combine static and CMS articles, avoiding duplicates by ID
  const allArticles = useMemo(() => {
    const articleMap = new Map<string, Article>();
    
    // Add static articles first
    staticArticles.forEach((article) => {
      articleMap.set(article.id, article);
    });
    
    // CMS articles override static ones with same ID
    cmsArticles.forEach((article) => {
      articleMap.set(article.id, article);
    });
    
    // Sort by date (newest first)
    return Array.from(articleMap.values()).sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  }, [cmsArticles]);

  const getArticleById = (id: string): Article | undefined => {
    return allArticles.find((article) => article.id === id);
  };

  const getArticlesByCategory = (category: string): Article[] => {
    return allArticles.filter(
      (article) => article.category.toLowerCase() === category.toLowerCase()
    );
  };

  const getRelatedArticles = (currentId: string, limit: number = 3): Article[] => {
    const currentArticle = getArticleById(currentId);
    if (!currentArticle) return allArticles.slice(0, limit);

    // First try to find articles in the same category
    const sameCategory = allArticles.filter(
      (article) =>
        article.id !== currentId && article.category === currentArticle.category
    );

    // If not enough, add from other categories
    const otherCategories = allArticles.filter(
      (article) =>
        article.id !== currentId && article.category !== currentArticle.category
    );

    return [...sameCategory, ...otherCategories].slice(0, limit);
  };

  const searchArticles = (query: string): Article[] => {
    const searchLower = query.toLowerCase().trim();
    if (!searchLower) return allArticles;

    return allArticles.filter((article) => {
      return (
        article.title.toLowerCase().includes(searchLower) ||
        article.subtitle.toLowerCase().includes(searchLower) ||
        article.category.toLowerCase().includes(searchLower) ||
        article.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
        article.content.introduction.toLowerCase().includes(searchLower)
      );
    });
  };

  return {
    articles: allArticles,
    isLoading,
    error,
    getArticleById,
    getArticlesByCategory,
    getRelatedArticles,
    searchArticles,
  };
}

/**
 * Hook for getting a single article by ID
 */
export function useArticle(id: string) {
  const { articles, isLoading, error, getRelatedArticles } = useArticles();
  
  const article = useMemo(() => {
    return articles.find((a) => a.id === id);
  }, [articles, id]);

  const relatedArticles = useMemo(() => {
    return getRelatedArticles(id, 3);
  }, [id, getRelatedArticles]);

  return {
    article,
    relatedArticles,
    isLoading,
    error,
  };
}

/**
 * Hook for getting articles by category
 */
export function useArticlesByCategory(category: string) {
  const { articles, isLoading, error } = useArticles();
  
  const categoryArticles = useMemo(() => {
    return articles.filter(
      (article) => article.category.toLowerCase() === category.toLowerCase()
    );
  }, [articles, category]);

  return {
    articles: categoryArticles,
    isLoading,
    error,
  };
}
