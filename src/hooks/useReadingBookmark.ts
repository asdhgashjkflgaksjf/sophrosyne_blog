import { useState, useEffect, useCallback } from "react";

interface BookmarkData {
  articleId: string;
  scrollPosition: number;
  progress: number;
  lastRead: string;
}

interface UseReadingBookmarkReturn {
  bookmark: BookmarkData | null;
  saveBookmark: () => void;
  restoreBookmark: () => void;
  clearBookmark: () => void;
  hasBookmark: boolean;
}

const STORAGE_KEY = "sophrosyne_reading_bookmarks";

export const useReadingBookmark = (articleId: string): UseReadingBookmarkReturn => {
  const [bookmark, setBookmark] = useState<BookmarkData | null>(null);

  // Load bookmark from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const bookmarks: Record<string, BookmarkData> = JSON.parse(stored);
        if (bookmarks[articleId]) {
          setBookmark(bookmarks[articleId]);
        }
      } catch (e) {
        console.error("Failed to parse bookmarks", e);
      }
    }
  }, [articleId]);

  const saveBookmark = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    const newBookmark: BookmarkData = {
      articleId,
      scrollPosition: scrollTop,
      progress: Math.min(100, Math.max(0, progress)),
      lastRead: new Date().toISOString(),
    };

    const stored = localStorage.getItem(STORAGE_KEY);
    let bookmarks: Record<string, BookmarkData> = {};
    
    if (stored) {
      try {
        bookmarks = JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse bookmarks", e);
      }
    }

    bookmarks[articleId] = newBookmark;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    setBookmark(newBookmark);
  }, [articleId]);

  const restoreBookmark = useCallback(() => {
    if (bookmark) {
      window.scrollTo({
        top: bookmark.scrollPosition,
        behavior: "smooth",
      });
    }
  }, [bookmark]);

  const clearBookmark = useCallback(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const bookmarks: Record<string, BookmarkData> = JSON.parse(stored);
        delete bookmarks[articleId];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
        setBookmark(null);
      } catch (e) {
        console.error("Failed to clear bookmark", e);
      }
    }
  }, [articleId]);

  return {
    bookmark,
    saveBookmark,
    restoreBookmark,
    clearBookmark,
    hasBookmark: bookmark !== null,
  };
};

// Hook for getting all bookmarks
export const useAllBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Record<string, BookmarkData>>({});

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setBookmarks(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse bookmarks", e);
      }
    }
  }, []);

  return bookmarks;
};
