export type IconName =
  | "instagram"
  | "x"
  | "telegram"
  | "whatsapp"
  | "linkedin"
  | "github"
  | "calendly"
  | "community"
  | "link";

export type QuickSocial = {
  id: string;
  icon: IconName;
  label: string;
  href: string;
};

export type ProfileLink = {
  id: string;
  icon: IconName;
  label: string;
  href: string;
  subtitle?: string;
  thumbnail?: string;
};

export type SiteContent = {
  name: string;
  headline: string;
  handle: string;
  photo: string;
  quickSocials: QuickSocial[];
  links: ProfileLink[];
};

export const ICON_OPTIONS: IconName[] = [
  "instagram",
  "x",
  "telegram",
  "whatsapp",
  "linkedin",
  "github",
  "calendly",
  "community",
  "link",
];
