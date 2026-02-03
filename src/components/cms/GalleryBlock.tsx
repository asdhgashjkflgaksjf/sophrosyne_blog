/**
 * CMS Gallery Block Component
 */

import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

interface GalleryBlockProps {
  images?: GalleryImage[];
  layout?: "grid" | "masonry" | "carousel";
  caption?: string;
}

const GalleryBlock = ({ images, layout = "grid", caption }: GalleryBlockProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const renderGrid = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {images.map((img, i) => (
        <div
          key={i}
          className="relative aspect-square overflow-hidden rounded-lg border border-[hsl(var(--sepia)/0.2)] cursor-pointer group"
          onClick={() => openLightbox(i)}
        >
          <img
            src={img.src}
            alt={img.alt}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
        </div>
      ))}
    </div>
  );

  const renderMasonry = () => (
    <div className="columns-2 md:columns-3 gap-3 space-y-3">
      {images.map((img, i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-lg border border-[hsl(var(--sepia)/0.2)] cursor-pointer group break-inside-avoid"
          onClick={() => openLightbox(i)}
        >
          <img
            src={img.src}
            alt={img.alt}
            className="w-full h-auto object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
          {img.caption && (
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2">
              <p className="text-white text-xs">{img.caption}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderCarousel = () => (
    <div className="relative">
      <div className="overflow-hidden rounded-lg border border-[hsl(var(--sepia)/0.2)]">
        <img
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          className="w-full h-auto object-cover cursor-pointer"
          onClick={() => openLightbox(currentIndex)}
        />
        {images[currentIndex].caption && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <p className="text-white text-sm">{images[currentIndex].caption}</p>
          </div>
        )}
      </div>
      
      {images.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex(i => (i - 1 + images.length) % images.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentIndex(i => (i + 1) % images.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          
          <div className="flex justify-center gap-2 mt-3">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentIndex ? "bg-accent" : "bg-border"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <figure className="my-8">
      {layout === "grid" && renderGrid()}
      {layout === "masonry" && renderMasonry()}
      {layout === "carousel" && renderCarousel()}
      
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-muted-foreground font-script italic">
          {caption}
        </figcaption>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
            onClick={() => setLightboxOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
          
          <img
            src={images[lightboxIndex].src}
            alt={images[lightboxIndex].alt}
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(i => (i - 1 + images.length) % images.length);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(i => (i + 1) % images.length);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      )}
    </figure>
  );
};

export default GalleryBlock;
