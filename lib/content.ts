import { list, put } from "@vercel/blob";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { SiteContent } from "./types";
import fallback from "@/data/content.json";

const contentPath = path.join(process.cwd(), "data", "content.json");
const CONTENT_BLOB = "site/content.json";
const AMBASSADOR_ROLE = "Build Ambassador SpaceXSI";
const WHATSAPP_COMMUNITY_HREF = "https://chat.whatsapp.com/EjedY8Yysb8Bhuevn1zsKV";

function ensureProfileUpdates(content: SiteContent): SiteContent {
  const headline = content.headline.includes(AMBASSADOR_ROLE)
    ? content.headline
    : `${content.headline}\n${AMBASSADOR_ROLE}`.replace(/^\n/, "");
  const hasCommunity = content.links.some((link) => link.href === WHATSAPP_COMMUNITY_HREF);

  return {
    ...content,
    headline,
    links: hasCommunity
      ? content.links
      : [
          ...content.links,
          {
            id: "whatsapp-community",
            icon: "whatsapp",
            label: "Comunidad de WhatsApp",
            href: WHATSAPP_COMMUNITY_HREF,
          },
        ],
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
