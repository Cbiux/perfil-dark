"use client";

import { useEffect, useState } from "react";
import type { SocialLink } from "@/data/profile";
import { SocialIcon } from "./SocialIcon";
import { cardClass } from "@/lib/card-class";

export function CopyCard({ social }: { social: SocialLink }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(id);
  }, [copied]);

  return (
    <button
      type="button"
      className={cardClass}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(social.handle);
          setCopied(true);
        } catch {
          setCopied(false);
        }
      }}
      aria-label={`Copiar Discord ${social.handle}`}
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-accent transition-colors group-hover:border-accent/50">
        <SocialIcon id={social.id} />
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block text-[15px] font-medium tracking-tight text-white">
          {social.label}
        </span>
        <span className="block truncate text-sm text-muted">
          {copied ? "Copiado" : social.handle}
        </span>
      </span>
      <span className="text-xs text-muted transition-colors group-hover:text-accent">
        {copied ? "OK" : "Copiar"}
      </span>
    </button>
  );
}
