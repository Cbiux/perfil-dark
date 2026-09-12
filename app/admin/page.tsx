import { loginAdmin } from "@/app/actions";
import { AdminPanel } from "./admin-panel";
import { isAdmin } from "@/lib/admin";
import { getContent } from "@/lib/content";
import Link from "next/link";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const loggedIn = await isAdmin();

  if (!loggedIn) {
    return (
      <main className="mx-auto flex min-h-full max-w-sm flex-col justify-center px-6 py-16">
        <p className="text-sm text-muted">cbiux</p>
        <h1 className="mt-1 text-3xl font-semibold">Admin</h1>
        <form action={loginAdmin} className="mt-8 space-y-3">
          <input
            type="password"
            name="password"
            required
            placeholder="Contraseña"
            className="w-full rounded-xl border border-white/12 bg-card px-3 py-3 text-white outline-none focus:border-accent"
          />
          <button
            type="submit"
            className="w-full rounded-2xl bg-accent py-3 font-medium text-black"
          >
            Entrar
          </button>
        </form>
        {error ? (
          <p className="mt-4 text-sm text-red-400">Contraseña incorrecta.</p>
        ) : null}
        <Link href="/" className="mt-8 text-sm text-muted hover:text-white">
          Volver al perfil
        </Link>
      </main>
    );
  }

  const content = await getContent();
  return (
    <main className="mx-auto min-h-full max-w-xl px-6 py-12">
      <Link href="/" className="text-sm text-muted hover:text-white">
        Ver perfil
      </Link>
      <div className="mt-6">
        <AdminPanel initial={content} />
      </div>
    </main>
  );
}
