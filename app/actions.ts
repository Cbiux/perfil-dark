"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  adminPassword,
  clearAdminCookie,
  isAdmin,
  setAdminCookie,
} from "@/lib/admin";
import { getContent, saveContent } from "@/lib/content";
import { storeProfilePhoto } from "@/lib/photo";
import type { SiteContent } from "@/lib/types";

export async function loginAdmin(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const expected = adminPassword();
  if (!expected || password !== expected) {
    redirect("/admin?error=1");
  }
  await setAdminCookie();
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminCookie();
  redirect("/admin");
}

export async function saveSiteContent(content: SiteContent) {
  if (!(await isAdmin())) {
    throw new Error("No autorizado");
  }
  try {
    await saveContent(content);
  } catch {
    throw new Error("No se pudo escribir el archivo de contenido");
  }
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function uploadProfilePhoto(formData: FormData) {
  if (!(await isAdmin())) {
    throw new Error("No autorizado");
  }
  const file = formData.get("photo");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Elige una foto");
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("El archivo tiene que ser una imagen");
  }
  if (file.size > 8 * 1024 * 1024) {
    throw new Error("La foto es muy pesada (máx. 8 MB)");
  }

  const url = await storeProfilePhoto(file);
  const content = await getContent();
  content.photo = url;
  await saveContent(content);
  revalidatePath("/");
  revalidatePath("/admin");
  return { url };
}
