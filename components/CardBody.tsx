import type { SocialLink } from "@/data/profile";
import { SocialIcon } from "./SocialIcon";

export const cardClass =
  "group flex min-h-[76px] w-full items-center gap-4 rounded-2xl border border-white/12 bg-card px-4 py-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/70 hover:shadow-[0_0_28px_rgba(30,212,176,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function CardBody({
  social,
  hint,
}: {
  social: SocialLink;
  hint: string;
}) {
  return (
    <>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-visible rounded-full border border-white/15 bg-white/[0.03] text-accent transition-colors group-hover:border-accent/50">
        <SocialIcon id={social.id} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-medium tracking-tight text-white">
          {social.label}
        </span>
        <span className="block truncate text-sm text-muted">{social.handle}</span>
      </span>
      <span className="text-xs text-muted transition-colors group-hover:text-accent">
        {hint}
      </span>
    </>
  );
}
