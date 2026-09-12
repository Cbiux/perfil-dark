"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  adminPassword,
  clearAdminCookie,
  isAdmin,
  setAdminCookie,
} from "@/lib/admin";
import { saveContent } from "@/lib/content";
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
