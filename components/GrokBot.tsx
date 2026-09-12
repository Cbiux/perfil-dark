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
  const eyeWidth = size * 0.16;
  const eyeHeight = size * 0.34;

  return (
    <div
      ref={botRef}
      className={`relative shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <div className="absolute -inset-3 rounded-full bg-accent/30 blur-xl" />
      <div
        ref={sphereRef}
        data-grok-sphere
        className="absolute inset-0 rounded-full shadow-[0_8px_28px_rgba(30,212,176,0.28)]"
        style={{
          background:
            "radial-gradient(circle at 34% 28%, #ffffff 0%, #ececec 46%, #c8c8c8 100%)",
        }}
      />
      <div
        ref={faceRef}
        data-grok-face
        className="absolute inset-0 will-change-transform"
      >
        <div
          ref={eyesRef}
          data-grok-eyes
          className="absolute inset-0 origin-center will-change-transform"
          style={{ transformOrigin: "50% 50%" } as CSSProperties}
        >
          <span
            className="absolute rounded-full bg-black"
            style={{
              width: eyeWidth,
              height: eyeHeight,
              left: "28%",
              top: "33%",
              transform: "rotate(-18deg)",
            }}
          />
          <span
            className="absolute rounded-full bg-black"
            style={{
              width: eyeWidth,
              height: eyeHeight,
              right: "28%",
              top: "33%",
              transform: "rotate(-18deg)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
