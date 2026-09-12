import type { CSSProperties, Ref } from "react";

type GrokBotProps = {
  size: number;
  className?: string;
  floating?: boolean;
  botRef?: Ref<HTMLDivElement>;
  faceRef?: Ref<HTMLDivElement>;
  sphereRef?: Ref<HTMLDivElement>;
  eyesRef?: Ref<HTMLDivElement>;
};

export function GrokBot({
  size,
  className = "",
  floating = false,
  botRef,
  faceRef,
  sphereRef,
  eyesRef,
}: GrokBotProps) {
  const eyeWidth = size * 0.17;
  const eyeHeight = size * 0.4;
  const glow = size > 80;

  return (
    <div
      ref={botRef}
      className={`relative shrink-0 ${floating ? "orb-float" : ""} ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {glow ? (
        <div className="orb-glow absolute -inset-[12%] rounded-full bg-accent/25 blur-3xl" />
      ) : (
        <div className="absolute -inset-2 rounded-full bg-accent/25 blur-md" />
      )}
      <div
        ref={sphereRef}
        data-grok-sphere
        className="absolute inset-0 rounded-full shadow-[0_0_64px_rgba(30,212,176,0.22)]"
        style={{
          background:
            "radial-gradient(circle at 34% 28%, #ffffff 0%, #e9e9e9 42%, #c8c8c8 100%)",
        }}
      />
      <div
        ref={faceRef}
        data-grok-face
        className="absolute inset-0 will-change-transform"
        style={{ transform: "translate3d(0,0,0)" }}
      >
        <div
          ref={eyesRef}
          data-grok-eyes
          className="absolute inset-0 origin-center will-change-transform"
          style={{ transformOrigin: "50% 52%" } as CSSProperties}
        >
          <span
            className="absolute rounded-full bg-black"
            style={{
              width: eyeWidth,
              height: eyeHeight,
              left: "27%",
              top: "36%",
              transform: "rotate(-22deg)",
            }}
          />
          <span
            className="absolute rounded-full bg-black"
            style={{
              width: eyeWidth,
              height: eyeHeight,
              right: "27%",
              top: "36%",
              transform: "rotate(-22deg)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
