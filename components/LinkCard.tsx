import type { ProfileLink } from "@/lib/types";
import { cardClass } from "@/lib/card-class";
import { ShareButton } from "./ShareButton";
import { SocialIcon } from "./SocialIcon";

export function LinkCard({ link }: { link: ProfileLink }) {
  return (
    <div className={`${cardClass} pr-2`}>
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-w-0 flex-1 items-center gap-4"
        aria-label={`${link.label}${link.subtitle ? ` ${link.subtitle}` : ""}`}
      >
        {link.thumbnail ? (
          <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-white/15">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={link.thumbnail} alt="" className="h-full w-full object-cover" />
          </span>
        ) : (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-accent">
            <SocialIcon id={link.icon} />
          </span>
        )}
        <span className="min-w-0 flex-1 text-left">
          <span className="block text-[15px] font-medium tracking-tight text-white">
            {link.label}
          </span>
          {link.subtitle ? (
            <span className="block truncate text-sm text-muted">{link.subtitle}</span>
          ) : null}
        </span>
      </a>
      <ShareButton compact title={link.label} url={link.href} />
    </div>
  );
}
