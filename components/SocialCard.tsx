import type { SocialLink } from "@/data/profile";
import { CardBody, cardClass } from "./CardBody";

export function SocialCard({ social }: { social: SocialLink }) {
  return (
    <a
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      className={cardClass}
      aria-label={`${social.label} ${social.handle}`}
    >
      <CardBody social={social} hint="Abrir" />
    </a>
  );
}
