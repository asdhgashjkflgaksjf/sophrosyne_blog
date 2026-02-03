/**
 * CMS Embed Block Component
 * Supports YouTube, Twitter, Spotify, Pinterest embeds
 */

import { ExternalLink, Play } from "lucide-react";

interface EmbedBlockProps {
  embedType?: "youtube" | "twitter" | "pinterest" | "spotify" | "link";
  url?: string;
  caption?: string;
}

// Extract YouTube video ID from various URL formats
const getYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

// Extract Spotify embed URL
const getSpotifyEmbed = (url: string): string | null => {
  if (url.includes("open.spotify.com")) {
    return url.replace("open.spotify.com", "open.spotify.com/embed");
  }
  return null;
};

const EmbedBlock = ({ embedType = "link", url, caption }: EmbedBlockProps) => {
  if (!url) return null;

  const renderEmbed = () => {
    switch (embedType) {
      case "youtube": {
        const videoId = getYouTubeId(url);
        if (!videoId) {
          return (
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              {url}
            </a>
          );
        }
        return (
          <div className="relative w-full pt-[56.25%] bg-black rounded-lg overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video"
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );
      }

      case "twitter": {
        // For Twitter/X, we show a link preview style card
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 border border-[hsl(var(--sepia)/0.3)] rounded-lg bg-[hsl(var(--paper-cream))] hover:bg-[hsl(var(--paper-aged))] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white">
                𝕏
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground group-hover:text-accent">
                  View on X (Twitter)
                </p>
                <p className="text-xs text-muted-foreground truncate">{url}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </div>
          </a>
        );
      }

      case "spotify": {
        const embedUrl = getSpotifyEmbed(url);
        if (!embedUrl) {
          return (
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              {url}
            </a>
          );
        }
        return (
          <iframe
            src={embedUrl}
            width="100%"
            height="152"
            allow="encrypted-media"
            className="rounded-lg"
          />
        );
      }

      case "pinterest": {
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 border border-[hsl(var(--sepia)/0.3)] rounded-lg bg-[hsl(var(--paper-cream))] hover:bg-[hsl(var(--paper-aged))] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
                P
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground group-hover:text-accent">
                  View on Pinterest
                </p>
                <p className="text-xs text-muted-foreground truncate">{url}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </div>
          </a>
        );
      }

      case "link":
      default: {
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 border border-[hsl(var(--sepia)/0.3)] rounded-lg bg-[hsl(var(--paper-cream))] hover:bg-[hsl(var(--paper-aged))] transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <ExternalLink className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground group-hover:text-accent truncate">
                  {new URL(url).hostname}
                </p>
                <p className="text-xs text-muted-foreground truncate">{url}</p>
              </div>
            </div>
          </a>
        );
      }
    }
  };

  return (
    <figure className="my-8">
      {renderEmbed()}
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground font-script italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

export default EmbedBlock;
