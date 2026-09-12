export type SocialLink = {
  id: "x" | "instagram" | "github" | "linkedin" | "youtube" | "tiktok" | "discord" | "website";
  label: string;
  handle: string;
  href: string;
  action?: "link" | "copy";
};

export const profile = {
  name: "Sebastián Ceciliano",
  location: "San José",
  headline: "Perfil de redes",
  bio: "Diseño, código y comunidad. Enlaces placeholder — cámbialos en data/profile.ts.",
};

export const socials: SocialLink[] = [
  {
    id: "x",
    label: "X",
    handle: "@sebastian",
    href: "https://x.com/sebastian",
  },
  {
    id: "instagram",
    label: "Instagram",
    handle: "@sebastian",
    href: "https://instagram.com/sebastian",
  },
  {
    id: "github",
    label: "GitHub",
    handle: "sebastian",
    href: "https://github.com/sebastian",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    handle: "sebastian-ceciliano",
    href: "https://linkedin.com/in/sebastian-ceciliano",
  },
  {
    id: "youtube",
    label: "YouTube",
    handle: "@sebastian",
    href: "https://youtube.com/@sebastian",
  },
  {
    id: "tiktok",
    label: "TikTok",
    handle: "@sebastian",
    href: "https://tiktok.com/@sebastian",
  },
  {
    id: "discord",
    label: "Discord",
    handle: "sebastian",
    href: "https://discord.com/users/sebastian",
    action: "copy",
  },
  {
    id: "website",
    label: "Sitio web",
    handle: "sebastian.dev",
    href: "https://sebastian.dev",
  },
];
