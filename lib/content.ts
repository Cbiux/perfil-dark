import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { SiteContent } from "./types";
import fallback from "@/data/content.json";

const contentPath = path.join(process.cwd(), "data", "content.json");

export async function getContent(): Promise<SiteContent> {
  try {
    const raw = await readFile(contentPath, "utf8");
    return JSON.parse(raw) as SiteContent;
  } catch {
    return fallback as SiteContent;
  }
}

export async function saveContent(content: SiteContent) {
  await writeFile(contentPath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
}
