import { LinkCard } from "./LinkCard";
import type { ProfileLink } from "@/lib/types";

export function SocialGrid({ links }: { links: ProfileLink[] }) {
  return (
    <section className="relative z-10 mt-8 grid w-full grid-cols-1 gap-3">
      {links.map((link) => (
        <LinkCard key={link.id} link={link} />
      ))}
    </section>
  );
}
