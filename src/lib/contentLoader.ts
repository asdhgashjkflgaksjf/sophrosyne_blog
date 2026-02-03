/**
 * Content Loader - Reads articles from src/content/articles/
 * Integrates with Decap CMS JSON content
 */

import { Article } from "@/data/articles";
import profileSilhouette from "@/assets/profile-silhouette.png";

// CMS Content Types (matching Decap CMS schema)
export interface CMSContentBlock {
  type: "heading" | "paragraph" | "quote" | "list" | "image" | "highlight" | "code" | "divider" | "table" | "embed" | "cta" | "gallery" | "note" | "stats" | "faq" | "timeline";
  // Heading
  text?: string;
  level?: "h2" | "h3" | "h4";
  // Quote
  author?: string;
  // List
  listType?: "ordered" | "unordered";
  items?: string[] | { question: string; answer: string }[] | { date: string; title: string; description: string }[] | { value: string; label: string; description?: string }[] | { cells: string[] }[];
  // Image
  src?: string;
  alt?: string;
  caption?: string;
  size?: "full" | "medium" | "small";
  // Highlight
  title?: string;
  content?: string;
  highlightType?: "info" | "tip" | "warning" | "quote";
  // Code
  language?: string;
  code?: unknown;
  // Divider
  style?: "line" | "dots" | "ornament" | "wave";
  // Table
  headers?: string[];
  rows?: { cells: string[] }[];
  // Embed
  embedType?: "youtube" | "twitter" | "pinterest" | "spotify" | "link";
  url?: string;
  // CTA
  ctaStyle?: "primary" | "secondary" | "link";
  description?: string;
  // Gallery
  layout?: "grid" | "masonry" | "carousel";
  images?: { src: string; alt: string; caption?: string }[];
  // Note/Sidenote
  position?: "inline" | "left" | "right";
  // Stats - items will be { value, label, description }
  // FAQ - items will be { question, answer }
  // Timeline - items will be { date, title, description }
}

// Publishing settings for scheduled posts
export interface CMSPublishingSettings {
  status: "draft" | "in_review" | "scheduled" | "published";
  publishDate?: string;
  updatedDate?: string;
  featured?: boolean;
  hidden?: boolean;
}

// SEO settings
export interface CMSSEOSettings {
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

export interface CMSArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image?: string;
  imageAlt?: string;
  author: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  tags: string[];
  content: CMSContentBlock[];
  relatedArticles?: string[];
  // New fields for advanced features
  publishing?: CMSPublishingSettings;
  seo?: CMSSEOSettings;
  // Legacy field for backward compatibility
  draft?: boolean;
}

export interface CMSBookReview {
  id: string;
  title: string;
  bookAuthor: string;
  cover: string;
  rating: number;
  summary: string;
  review: string;
  date: string;
  tags: string[];
  status?: "draft" | "published";
  purchaseLink?: string;
}

// Draft/Idea type
export interface CMSDraft {
  title: string;
  date: string;
  targetCategory?: string;
  notes: string;
  references?: { title: string; url?: string }[];
  priority: "high" | "medium" | "low";
}

// Default author for articles without one
const defaultAuthor = {
  name: "Farhan",
  avatar: profileSilhouette,
  bio: "Penulis, pemikir, dan pencari makna melalui filsafat dan literatur",
};

/**
 * Convert CMS content blocks to the Article content format
 */
function convertCMSContentToArticleContent(
  blocks: CMSContentBlock[],
  excerpt: string
): Article["content"] {
  const sections: { heading: string; content: string }[] = [];
  let currentSection: { heading: string; content: string } | null = null;
  let conclusion = "";

  blocks.forEach((block, index) => {
    if (block.type === "heading" && block.text) {
      // Save previous section if exists
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = { heading: block.text, content: "" };
    } else if (currentSection) {
      // Add content to current section
      const content = formatBlockContent(block);
      if (content) {
        currentSection.content += (currentSection.content ? "\n\n" : "") + content;
      }
    } else {
      // Content before first heading goes to introduction or conclusion
      const content = formatBlockContent(block);
      if (content) {
        // Check if this is near the end
        if (index > blocks.length - 3 && blocks.length > 5) {
          conclusion += (conclusion ? "\n\n" : "") + content;
        }
      }
    }
  });

  // Push the last section
  if (currentSection) {
    // Check if last section is conclusion-like
    const headingLower = currentSection.heading.toLowerCase();
    if (
      headingLower.includes("kesimpulan") ||
      headingLower.includes("conclusion") ||
      headingLower.includes("penutup")
    ) {
      conclusion = currentSection.content;
    } else {
      sections.push(currentSection);
    }
  }

  return {
    introduction: excerpt,
    sections,
    conclusion: conclusion || "Terima kasih telah membaca artikel ini.",
  };
}

/**
 * Format a content block to string
 */
function formatBlockContent(block: CMSContentBlock): string {
  switch (block.type) {
    case "paragraph":
      return block.text || "";
    case "quote":
      return block.author
        ? `"${block.text}" — ${block.author}`
        : `"${block.text}"`;
    case "list":
      if (block.items && block.items.length > 0) {
        return block.items
          .map((item, i) =>
            block.listType === "ordered" ? `${i + 1}. ${item}` : `• ${item}`
          )
          .join("\n");
      }
      return "";
    case "highlight":
      return block.title
        ? `**${block.title}**\n${block.content || ""}`
        : block.content || "";
    case "image":
      return block.caption || "";
    default:
      return "";
  }
}

/**
 * Convert CMS article to standard Article format
 */
export function convertCMSToArticle(cmsArticle: CMSArticle): Article {
  return {
    id: cmsArticle.id,
    title: cmsArticle.title,
    subtitle: cmsArticle.excerpt,
    category: cmsArticle.category,
    date: cmsArticle.date,
    readTime: cmsArticle.readTime,
    image: cmsArticle.image || "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1920&q=80",
    author: {
      name: cmsArticle.author?.name || defaultAuthor.name,
      avatar: cmsArticle.author?.avatar || defaultAuthor.avatar,
      bio: cmsArticle.author?.bio || defaultAuthor.bio,
    },
    content: convertCMSContentToArticleContent(cmsArticle.content, cmsArticle.excerpt),
    tags: cmsArticle.tags || [],
  };
}

/**
 * Check if article should be published based on status and scheduled date
 */
function isArticlePublishable(cmsArticle: CMSArticle): boolean {
  // Legacy draft field support
  if (cmsArticle.draft === true) return false;
  
  // New publishing settings
  if (cmsArticle.publishing) {
    const { status, publishDate } = cmsArticle.publishing;
    
    // Draft or in review - not published
    if (status === "draft" || status === "in_review") return false;
    
    // Hidden articles - don't show in listings
    if (cmsArticle.publishing.hidden) return false;
    
    // Scheduled - check if publish date has passed
    if (status === "scheduled" && publishDate) {
      const now = new Date();
      const scheduled = new Date(publishDate);
      if (scheduled > now) return false; // Not yet time to publish
    }
  }
  
  return true;
}

/**
 * Load all CMS articles from the content folder
 * Uses Vite's import.meta.glob for dynamic imports
 */
export async function loadCMSArticles(): Promise<Article[]> {
  const articles: Article[] = [];
  
  // Use Vite's glob import to get all JSON files in the articles folder
  const modules = import.meta.glob<CMSArticle>("/src/content/articles/*.json", {
    eager: true,
    import: "default",
  });

  for (const path in modules) {
    const cmsArticle = modules[path];

    // Ensure every CMS article has a stable ID.
    // In Decap CMS, the `id` field is optional; if authors leave it empty, the
    // JSON may be saved without `id`, which breaks routing (/article/:id).
    // Fallback: derive ID from filename (e.g. 2026-01-31-my-post.json -> 2026-01-31-my-post)
    const fallbackId = path
      .split("/")
      .pop()
      ?.replace(/\.json$/i, "")
      .trim();

    const cmsArticleWithId: CMSArticle = {
      ...cmsArticle,
      id:
        typeof cmsArticle.id === "string" && cmsArticle.id.trim().length > 0
          ? cmsArticle.id.trim()
          : fallbackId || "untitled",
    };
    
    // Check if article should be published
    if (!isArticlePublishable(cmsArticleWithId)) continue;
    
    try {
      const article = convertCMSToArticle(cmsArticleWithId);
      articles.push(article);
    } catch (error) {
      console.error(`Error loading article from ${path}:`, error);
    }
  }

  // Sort by date (newest first)
  return articles.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
}

/**
 * Load featured articles only
 */
export async function loadFeaturedArticles(): Promise<Article[]> {
  const allArticles = await loadCMSArticles();
  
  // Use Vite's glob import to check for featured flag
  const modules = import.meta.glob<CMSArticle>("/src/content/articles/*.json", {
    eager: true,
    import: "default",
  });
  
  const featuredIds = new Set<string>();
  for (const path in modules) {
    const cmsArticle = modules[path];
    if (cmsArticle.publishing?.featured) {
      featuredIds.add(cmsArticle.id);
    }
  }
  
  return allArticles.filter(article => featuredIds.has(article.id));
}

/**
 * Load all CMS book reviews
 */
export async function loadCMSBookReviews(): Promise<CMSBookReview[]> {
  const reviews: CMSBookReview[] = [];
  
  const modules = import.meta.glob<CMSBookReview>("/src/content/books/*.json", {
    eager: true,
    import: "default",
  });

  for (const path in modules) {
    try {
      const review = modules[path];
      // Skip drafts
      if (review.status === "draft") continue;
      reviews.push(review);
    } catch (error) {
      console.error(`Error loading book review from ${path}:`, error);
    }
  }

  return reviews.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
}

/**
 * Load drafts/ideas
 */
export async function loadDrafts(): Promise<CMSDraft[]> {
  const drafts: CMSDraft[] = [];
  
  const modules = import.meta.glob<CMSDraft>("/src/content/drafts/*.json", {
    eager: true,
    import: "default",
  });

  for (const path in modules) {
    try {
      drafts.push(modules[path]);
    } catch (error) {
      console.error(`Error loading draft from ${path}:`, error);
    }
  }

  // Sort by priority then date
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return drafts.sort((a, b) => {
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

// Site settings interfaces
export interface SiteGeneralSettings {
  siteName: string;
  tagline: string;
  description: string;
  logo?: string;
  favicon?: string;
}

export interface SiteSocialSettings {
  twitter?: string;
  instagram?: string;
  github?: string;
  email: string;
}

export interface SiteAboutSettings {
  title: string;
  photo: string;
  bio: string;
  quote?: string;
}

export interface SiteSettings {
  general: SiteGeneralSettings;
  social: SiteSocialSettings;
  about: SiteAboutSettings;
}

/**
 * Load site settings using glob import
 */
export function loadSiteSettings(): SiteSettings | null {
  try {
    // Use glob import for settings files
    const settingsModules = import.meta.glob<Record<string, unknown>>(
      "/src/content/settings/*.json",
      { eager: true, import: "default" }
    );
    
    let general: SiteGeneralSettings | null = null;
    let social: SiteSocialSettings | null = null;
    let about: SiteAboutSettings | null = null;
    
    for (const path in settingsModules) {
      const data = settingsModules[path];
      if (path.includes("general.json")) {
        general = data as unknown as SiteGeneralSettings;
      } else if (path.includes("social.json")) {
        social = data as unknown as SiteSocialSettings;
      } else if (path.includes("about.json")) {
        about = data as unknown as SiteAboutSettings;
      }
    }
    
    if (!general || !social || !about) {
      console.warn("Some settings files are missing");
      return null;
    }
    
    return { general, social, about };
  } catch (error) {
    console.error("Error loading site settings:", error);
    return null;
  }
}
