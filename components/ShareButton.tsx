"use client";

import { useState } from "react";

export function ShareButton({
  title,
  url,
  compact = false,
}: {
  title: string;
  url?: string;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function share() {
      const shareUrl = url ?? window.location.href;
      try {
        if (navigator.share) {
          await navigator.share({ title, url: shareUrl });
          return;
        }
      } catch {
        // user cancelled or share failed — fall back to copy
      }
      await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void share();
      }}
      className={
        compact
          ? "rounded-full p-2 text-muted transition-colors hover:bg-white/8 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          : "flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/5 text-white transition-colors hover:border-accent/70 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      }
      aria-label={copied ? "Enlace copiado" : `Compartir ${title}`}
    >
      {copied ? (
        <span className="text-[10px] font-medium text-accent">OK</span>
      ) : (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
          <path
            d="M8.5 12.5 15 8.8M8.5 12.5 15 16.2"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <circle cx="7" cy="12.5" r="2.3" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="16.5" cy="8" r="2.3" stroke="currentColor" strokeWidth="1.7" />
          <circle cx="16.5" cy="17" r="2.3" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      )}
    </button>
  );
}
