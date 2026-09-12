import type { CSSProperties, Ref } from "react";

type GrokBotProps = {
  size: number;
  className?: string;
  botRef?: Ref<HTMLDivElement>;
  faceRef?: Ref<HTMLDivElement>;
  sphereRef?: Ref<HTMLDivElement>;
  eyesRef?: Ref<HTMLDivElement>;
};

export function GrokBot({
  size,
  className = "",
  botRef,
  faceRef,
  sphereRef,
  eyesRef,
}: GrokBotProps) {
  const eyeWidth = size * 0.145;
  const eyeHeight = size * 0.32;

  return (
    <div
      ref={botRef}
      className={`relative shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <div className="pointer-events-none absolute -inset-4 rounded-full bg-accent/25 blur-2xl" />
      <div
        ref={sphereRef}
        data-grok-sphere
        className="absolute inset-0 rounded-full shadow-[0_10px_32px_rgba(30,212,176,0.32)]"
        style={{
          background:
            "radial-gradient(circle at 34% 28%, #ffffff 0%, #f2f2f2 42%, #cfcfcf 72%, #b4b4b4 100%)",
        }}
      />
      <div
        ref={faceRef}
        data-grok-face
        className="pointer-events-none absolute inset-0 will-change-transform"
      >
        <div
          ref={eyesRef}
          data-grok-eyes
          className="absolute inset-0 origin-center will-change-transform"
          style={{ transformOrigin: "50% 48%" } as CSSProperties}
        >
          <span
            className="absolute rounded-full bg-black"
            style={{
              width: eyeWidth,
              height: eyeHeight,
              left: "29%",
              top: "34%",
              transform: "rotate(-12deg)",
            }}
          />
          <span
            className="absolute rounded-full bg-black"
            style={{
              width: eyeWidth,
              height: eyeHeight,
              right: "29%",
              top: "34%",
              transform: "rotate(-12deg)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
