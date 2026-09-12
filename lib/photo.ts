import { put } from "@vercel/blob";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

function canUseBlob() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID,
  );
}

function extensionFor(type: string) {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  if (type === "image/gif") return "gif";
  return "jpg";
}

export async function storeProfilePhoto(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const type = file.type || "image/jpeg";
  const ext = extensionFor(type);

  if (canUseBlob()) {
    const blob = await put(`profile/photo.${ext}`, buffer, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: type,
    });
    return `${blob.url.split("?")[0]}?v=${Date.now()}`;
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, `profile.${ext}`), buffer);
  return `/uploads/profile.${ext}?v=${Date.now()}`;
}
