"use client";

import { useState } from "react";
import { logoutAdmin, saveSiteContent, uploadProfilePhoto } from "@/app/actions";
import { ICON_OPTIONS, type IconName, type ProfileLink, type QuickSocial, type SiteContent } from "@/lib/types";

const fieldClass =
  "w-full rounded-xl border border-white/12 bg-black px-3 py-2 text-sm text-white outline-none focus:border-accent";

function newId() {
  return crypto.randomUUID();
}

export function AdminPanel({ initial }: { initial: SiteContent }) {
  const [content, setContent] = useState(initial);
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  function updateLink(id: string, patch: Partial<ProfileLink>) {
    setContent((prev) => ({
      ...prev,
      links: prev.links.map((link) => (link.id === id ? { ...link, ...patch } : link)),
    }));
  }

  function updateSocial(id: string, patch: Partial<QuickSocial>) {
    setContent((prev) => ({
      ...prev,
      quickSocials: prev.quickSocials.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    }));
  }

  async function onSave() {
    setSaving(true);
    setStatus("");
    try {
      await saveSiteContent(content);
      setStatus("Guardado");
    } catch {
      setStatus("No se pudo guardar. Revisa permisos o corre esto en local.");
    } finally {
      setSaving(false);
    }
  }

  async function onPhoto(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setStatus("");
    try {
      let payload: File;
      try {
        payload = await compressPhoto(file);
      } catch {
        payload = file;
      }
      const data = new FormData();
      data.set("photo", payload, payload.name || "profile.jpg");
      const result = await uploadProfilePhoto(data);
      setContent((prev) => ({ ...prev, photo: result.url }));
      setStatus("Foto actualizada");
    } catch {
      setStatus("No se pudo subir la foto.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted">Panel</p>
          <h1 className="text-2xl font-semibold">Admin</h1>
        </div>
        <form action={logoutAdmin}>
          <button className="text-sm text-muted hover:text-white" type="submit">
            Salir
          </button>
        </form>
      </div>

      <section className="space-y-3 rounded-2xl border border-white/12 bg-card p-4">
        <h2 className="text-sm font-medium text-accent">Perfil</h2>
        <input
          className={fieldClass}
          value={content.name}
          onChange={(e) => setContent({ ...content, name: e.target.value })}
          placeholder="Nombre"
        />
        <input
          className={fieldClass}
          value={content.headline}
          onChange={(e) => setContent({ ...content, headline: e.target.value })}
          placeholder="Headline"
        />
        <input
          className={fieldClass}
          value={content.handle}
          onChange={(e) => setContent({ ...content, handle: e.target.value })}
          placeholder="Handle"
        />
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={content.photo}
            alt={content.name}
            className="h-20 w-20 rounded-full object-cover ring-2 ring-white/80"
          />
          <label className="cursor-pointer text-sm text-accent hover:text-white">
            {uploading ? "Subiendo…" : "Cambiar foto"}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              disabled={uploading}
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                void onPhoto(file);
              }}
            />
          </label>
        </div>
        <p className="text-xs text-muted">
          Sube la foto que quieras. Se verá en el perfil y al abrirla en grande.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border border-white/12 bg-card p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-accent">Iconos rápidos</h2>
          <button
            type="button"
            className="text-sm text-accent"
            onClick={() =>
              setContent((prev) => ({
                ...prev,
                quickSocials: [
                  ...prev.quickSocials,
                  { id: newId(), icon: "link", label: "Nueva", href: "https://" },
                ],
              }))
            }
          >
            Añadir
          </button>
        </div>
        {content.quickSocials.map((social) => (
          <div key={social.id} className="grid gap-2 rounded-xl border border-white/8 p-3 sm:grid-cols-4">
            <select
              className={fieldClass}
              value={social.icon}
              onChange={(e) => updateSocial(social.id, { icon: e.target.value as IconName })}
            >
              {ICON_OPTIONS.map((icon) => (
                <option key={icon} value={icon}>
                  {icon}
                </option>
              ))}
            </select>
            <input
              className={fieldClass}
              value={social.label}
              onChange={(e) => updateSocial(social.id, { label: e.target.value })}
              placeholder="Label"
            />
            <input
              className={`${fieldClass} sm:col-span-2`}
              value={social.href}
              onChange={(e) => updateSocial(social.id, { href: e.target.value })}
              placeholder="URL"
            />
            <button
              type="button"
              className="text-left text-xs text-muted hover:text-white sm:col-span-4"
              onClick={() =>
                setContent((prev) => ({
                  ...prev,
                  quickSocials: prev.quickSocials.filter((item) => item.id !== social.id),
                }))
              }
            >
              Quitar
            </button>
          </div>
        ))}
      </section>

      <section className="space-y-3 rounded-2xl border border-white/12 bg-card p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-accent">Enlaces</h2>
          <button
            type="button"
            className="text-sm text-accent"
            onClick={() =>
              setContent((prev) => ({
                ...prev,
                links: [
                  ...prev.links,
                  { id: newId(), icon: "link", label: "Nuevo enlace", href: "https://" },
                ],
              }))
            }
          >
            Añadir
          </button>
        </div>
        {content.links.map((link) => (
          <div key={link.id} className="grid gap-2 rounded-xl border border-white/8 p-3">
            <input
              className={fieldClass}
              value={link.label}
              onChange={(e) => updateLink(link.id, { label: e.target.value })}
              placeholder="Título"
            />
            <input
              className={fieldClass}
              value={link.subtitle ?? ""}
              onChange={(e) => updateLink(link.id, { subtitle: e.target.value })}
              placeholder="Subtítulo"
            />
            <input
              className={fieldClass}
              value={link.href}
              onChange={(e) => updateLink(link.id, { href: e.target.value })}
              placeholder="URL"
            />
            <input
              className={fieldClass}
              value={link.thumbnail ?? ""}
              onChange={(e) => updateLink(link.id, { thumbnail: e.target.value })}
              placeholder="Thumbnail opcional"
            />
            <div className="flex gap-2">
              <select
                className={fieldClass}
                value={link.icon}
                onChange={(e) => updateLink(link.id, { icon: e.target.value as IconName })}
              >
                {ICON_OPTIONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="text-xs text-muted hover:text-white"
                onClick={() =>
                  setContent((prev) => ({
                    ...prev,
                    links: prev.links.filter((item) => item.id !== link.id),
                  }))
                }
              >
                Quitar
              </button>
            </div>
          </div>
        ))}
      </section>

      <button
        type="button"
        onClick={() => void onSave()}
        disabled={saving}
        className="w-full rounded-2xl bg-accent px-4 py-3 font-medium text-black disabled:opacity-60"
      >
        {saving ? "Guardando…" : "Guardar cambios"}
      </button>
      {status ? <p className="text-center text-sm text-muted">{status}</p> : null}
    </div>
  );
}

function compressPhoto(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);
    image.onload = () => {
      const max = 1400;
      const scale = Math.min(1, max / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext("2d");
      if (!context) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("No se pudo procesar la foto"));
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(objectUrl);
          if (!blob) {
            reject(new Error("No se pudo comprimir la foto"));
            return;
          }
          resolve(new File([blob], "profile.jpg", { type: "image/jpeg" }));
        },
        "image/jpeg",
        0.88,
      );
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("No se pudo leer la foto"));
    };
    image.src = objectUrl;
  });
}
