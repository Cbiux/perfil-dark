import { Orb } from "@/components/Orb";
import { PosterMarks } from "@/components/PosterMarks";
import { QuickSocials } from "@/components/QuickSocials";
import { ShareButton } from "@/components/ShareButton";
import { SocialGrid } from "@/components/SocialGrid";
import { getContent } from "@/lib/content";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getContent();

  return (
    <div className="relative min-h-full overflow-hidden bg-background">
      <PosterMarks />
      <div className="pointer-events-none absolute -bottom-36 -left-28 sm:-bottom-48 sm:-left-20">
        <Orb size={520} className="opacity-95" />
      </div>

      <div className="absolute top-6 right-6 z-20 sm:top-8 sm:right-24">
        <ShareButton title={content.name} />
      </div>

      <main className="relative mx-auto flex min-h-full w-full max-w-md flex-col items-center px-6 pb-24 pt-16 text-center sm:pt-20">
        <div className="relative">
          <div className="absolute -inset-3 rounded-full bg-accent/20 blur-xl" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={content.photo}
            alt={content.name}
            width={112}
            height={112}
            className="relative h-28 w-28 rounded-full object-cover ring-2 ring-white/80"
          />
        </div>

        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-white sm:text-[28px]">
          {content.name}
        </h1>
        <p className="mt-1 text-sm text-muted">{content.headline}</p>

        <QuickSocials socials={content.quickSocials} />
        <SocialGrid links={content.links} />
      </main>

      <Link
        href="/admin"
        className="absolute bottom-4 right-5 z-20 text-[11px] text-white/20 transition-colors hover:text-accent"
      >
        Admin
      </Link>
    </div>
  );
}
