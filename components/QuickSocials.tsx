import type { QuickSocial } from "@/lib/types";
import { SocialIcon } from "./SocialIcon";

export function QuickSocials({ socials }: { socials: QuickSocial[] }) {
  return (
    <nav aria-label="Redes rápidas" className="mt-5 flex items-center justify-center gap-3">
      {socials.map((social) => (
        <a
          key={social.id}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/5 text-white transition-all hover:-translate-y-0.5 hover:border-accent/70 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <SocialIcon id={social.icon} />
        </a>
      ))}
    </nav>
  );
}
