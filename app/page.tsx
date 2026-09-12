import { GrokScene } from "@/components/GrokScene";
import { ProfilePhoto } from "@/components/ProfilePhoto";
import { QuickSocials } from "@/components/QuickSocials";
import { ShareButton } from "@/components/ShareButton";
import { SocialGrid } from "@/components/SocialGrid";
import { getContent } from "@/lib/content";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getContent();

  return (
    <div className="relative min-h-full bg-background">
      <GrokScene />
      <div className="absolute top-6 right-6 z-20 sm:top-8 sm:right-8">
        <ShareButton title={content.name} />
      </div>

      <main className="relative mx-auto flex min-h-full w-full max-w-md flex-col items-center px-6 pb-24 pt-16 text-center sm:pt-20">
        <ProfilePhoto src={content.photo} alt={content.name} />

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
