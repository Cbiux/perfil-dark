import { list, put } from "@vercel/blob";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ProfileLink, QuickSocial, SiteContent } from "./types";
import fallback from "@/data/content.json";

const contentPath = path.join(process.cwd(), "data", "content.json");
const CONTENT_BLOB = "site/content.json";
const HEADLINE = "Build Ambassador • SpaceXSI\nFounder • ZEEK";
const WHATSAPP_COMMUNITY_HREF = "https://chat.whatsapp.com/EjedY8Yysb8Bhuevn1zsKV";
const WHATSAPP_COMMUNITY_LABEL = "SpaceXSI Community Costa Rica";
const ICON_ROW: QuickSocial[] = [
  {
    id: "linkedin",
    icon: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/cbiux",
  },
  {
    id: "github",
    icon: "github",
    label: "GitHub",
    href: "https://github.com/Cbiux",
  },
];

function isIconRowItem(item: { id: string; href: string }) {
  return ICON_ROW.some((icon) => icon.id === item.id || icon.href === item.href);
}

function ensureProfileUpdates(content: SiteContent): SiteContent {
  const quickSocials = [...content.quickSocials];
  for (const icon of ICON_ROW) {
    const fromLinks = content.links.find((link) => link.id === icon.id || link.href === icon.href);
    const entry: QuickSocial = fromLinks
      ? { id: fromLinks.id, icon: fromLinks.icon, label: fromLinks.label, href: fromLinks.href }
      : icon;
    if (!quickSocials.some((social) => social.id === entry.id || social.href === entry.href)) {
      quickSocials.push(entry);
    }
  }

  const links = content.links.filter((link) => !isIconRowItem(link));
  const communityIndex = links.findIndex((link) => link.href === WHATSAPP_COMMUNITY_HREF);
  const community: ProfileLink =
    communityIndex === -1
      ? {
          id: "whatsapp-community",
          icon: "whatsapp",
          label: WHATSAPP_COMMUNITY_LABEL,
          href: WHATSAPP_COMMUNITY_HREF,
        }
      : { ...links[communityIndex], label: WHATSAPP_COMMUNITY_LABEL };
  const rest = links.filter((link) => link.href !== WHATSAPP_COMMUNITY_HREF);

  return {
    ...content,
    headline: HEADLINE,
    quickSocials,
    links: [community, ...rest],
  };
}

function canUseBlob() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID,
  );
}

async function readBlobContent(): Promise<SiteContent | null> {
  if (!canUseBlob()) return null;
  const { blobs } = await list({ prefix: CONTENT_BLOB });
  const match =
    blobs.find((blob) => blob.pathname === CONTENT_BLOB) ?? blobs[0];
  if (!match) return null;
  const response = await fetch(match.url, { cache: "no-store" });
  if (!response.ok) return null;
  return (await response.json()) as SiteContent;
}

async function writeBlobContent(content: SiteContent) {
  if (!canUseBlob()) return false;
  await put(CONTENT_BLOB, `${JSON.stringify(content, null, 2)}\n`, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
  return true;
}

export async function getContent(): Promise<SiteContent> {
  try {
    const fromBlob = await readBlobContent();
    if (fromBlob) return ensureProfileUpdates(fromBlob);
  } catch {
    // fall through to the local file
  }
  try {
    const raw = await readFile(contentPath, "utf8");
    return ensureProfileUpdates(JSON.parse(raw) as SiteContent);
  } catch {
    return ensureProfileUpdates(fallback as SiteContent);
  }
}

export async function saveContent(content: SiteContent) {
  let wrote = false;
  try {
    await writeFile(contentPath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
    wrote = true;
  } catch {
    // Vercel production filesystem is read-only
  }
  try {
    if (await writeBlobContent(content)) wrote = true;
  } catch {
    // Blob store may not be configured yet
  }
  if (!wrote) {
    throw new Error("No se pudo escribir el archivo de contenido");
  }
}
