"use client";

import { useState } from "react";
import { logoutAdmin, saveSiteContent } from "@/app/actions";
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
        <input
          className={fieldClass}
          value={content.photo}
          onChange={(e) => setContent({ ...content, photo: e.target.value })}
          placeholder="Foto (URL o /sebastian.jpg)"
        />
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
