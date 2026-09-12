"use client";

import type { SocialLink } from "@/data/profile";
import { CopyCard } from "./CopyCard";
import { SocialCard } from "./SocialCard";

export function SocialGrid({ socials }: { socials: SocialLink[] }) {
  return (
    <section className="relative z-10 mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {socials.map((social) =>
        social.action === "copy" ? (
          <CopyCard key={social.id} social={social} />
        ) : (
          <SocialCard key={social.id} social={social} />
        ),
      )}
    </section>
  );
}
