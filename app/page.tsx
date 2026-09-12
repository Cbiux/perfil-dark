import { Orb } from "@/components/Orb";
import { PosterMarks } from "@/components/PosterMarks";
import { SocialGrid } from "@/components/SocialGrid";
import { profile, socials } from "@/data/profile";

export default function Home() {
  return (
    <div className="relative min-h-full overflow-hidden bg-background">
      <PosterMarks />
      <div className="pointer-events-none absolute -bottom-28 -left-24 sm:-bottom-40 sm:-left-16">
        <Orb size={420} className="opacity-90 sm:opacity-100" />
      </div>

      <main className="relative mx-auto flex min-h-full w-full max-w-3xl flex-col px-6 pb-28 pt-16 sm:px-10 sm:pt-20">
        <p className="text-sm tracking-wide text-muted">San José Workshop</p>
        <h1 className="mt-3 max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">
          {profile.name}
        </h1>
        <p className="mt-3 text-xl text-muted sm:text-2xl">
          {profile.location} · {profile.headline}
        </p>

        <div className="mt-10 flex items-center gap-5">
          <Orb size={92} />
          <p className="max-w-sm text-base leading-7 text-muted">{profile.bio}</p>
        </div>

        <h2 className="sr-only">Redes sociales</h2>
        <SocialGrid socials={socials} />

        <p className="relative z-10 mt-16 text-sm text-muted">
          {profile.headline} · placeholders en{" "}
          <code className="text-accent">data/profile.ts</code>
        </p>
      </main>
    </div>
  );
}
