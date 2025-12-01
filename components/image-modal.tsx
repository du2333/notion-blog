"use client";

import { X, ZoomIn, ZoomOut } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface ImageModalProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageModal({
  src,
  alt,
  isOpen,
  onClose,
}: ImageModalProps) {
  const [scale, setScale] = useState(1);
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setIsVisible(true);
      setScale(1);
    } else {
      document.body.style.overflow = "unset";
      // Delay hiding to allow exit animation
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale((prev) => Math.max(prev - 0.5, 1));
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!isMounted || (!isOpen && !isVisible)) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[200] flex items-center justify-center bg-background/95 backdrop-blur-md transition-opacity duration-300 ease-in-out",
        isOpen ? "opacity-100" : "opacity-0"
      )}
      onClick={onClose}
    >
      {/* Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-[201]">
        <button
          onClick={handleZoomOut}
          className="p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={scale <= 1}
        >
          <ZoomOut className="size-5" />
        </button>
        <button
          onClick={handleZoomIn}
          className="p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={scale >= 3}
        >
          <ZoomIn className="size-5" />
        </button>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Image Container */}
      <div
        className={cn(
          "relative w-full h-full flex items-center justify-center p-4 md:p-8 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
          isOpen ? "scale-100 opacity-100" : "scale-90 opacity-0"
        )}
        onClick={onClose}
      >
        <div
          className="relative w-full h-full flex items-center justify-center"
          onClick={handleContentClick}
        >
          <div
            style={{
              transform: `scale(${scale})`,
              transition: "transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}
            className="relative max-w-full max-h-full cursor-grab active:cursor-grabbing"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
