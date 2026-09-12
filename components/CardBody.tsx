import type { SocialLink } from "@/data/profile";
import { SocialIcon } from "./SocialIcon";

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
