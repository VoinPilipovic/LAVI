"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface LightboxImage {
  src: string;
  alt: string;
  label: string;
}

interface GalleryLightboxProps {
  images: LightboxImage[];
  index: number | null;
  onClose: () => void;
  onNavigate: (direction: 1 | -1) => void;
}

/**
 * Fullscreen portfolio viewer built on Radix Dialog — gets focus
 * trapping, Escape-to-close, and body scroll lock for free. Arrow keys
 * and the on-screen chevrons drive the same wrapped index, so both
 * stay in sync with no separate keyboard-listener bookkeeping.
 */
export function GalleryLightbox({ images, index, onClose, onNavigate }: GalleryLightboxProps) {
  const open = index !== null;
  const current = index !== null ? images[index] : null;

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-ink/95 backdrop-blur-sm",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
          )}
        />
        <Dialog.Content
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") onNavigate(1);
            if (event.key === "ArrowLeft") onNavigate(-1);
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
          className={cn(
            "fixed inset-0 z-50 flex flex-col items-center justify-center p-4 outline-none sm:p-10",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
          )}
        >
          <Dialog.Title className="sr-only">{current?.label || "Gallery image"}</Dialog.Title>
          <Dialog.Description className="sr-only">{current?.alt || ""}</Dialog.Description>

          <Dialog.Close
            className="absolute right-5 top-5 z-10 text-ivory-dim outline-none transition-colors duration-300 hover:text-ivory focus-visible:text-ivory focus-visible:ring-1 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            aria-label="Close"
          >
            <X className="h-6 w-6" strokeWidth={1.25} />
          </Dialog.Close>

          {current ? (
            <>
              <button
                type="button"
                onClick={() => onNavigate(-1)}
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 p-3 text-ivory-dim outline-none transition-colors duration-300 hover:text-ivory focus-visible:text-ivory focus-visible:ring-1 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink sm:left-6"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-8 w-8" strokeWidth={1.25} />
              </button>

              <div className="relative h-[70vh] w-full max-w-4xl">
                <Image
                  src={current.src}
                  alt={current.alt}
                  fill
                  sizes="(min-width: 1024px) 60vw, 90vw"
                  className="object-contain"
                />
              </div>

              <p className="mt-5 text-eyebrow text-ivory-dim">{current.label}</p>

              <button
                type="button"
                onClick={() => onNavigate(1)}
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 p-3 text-ivory-dim outline-none transition-colors duration-300 hover:text-ivory focus-visible:text-ivory focus-visible:ring-1 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink sm:right-6"
                aria-label="Next image"
              >
                <ChevronRight className="h-8 w-8" strokeWidth={1.25} />
              </button>
            </>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
