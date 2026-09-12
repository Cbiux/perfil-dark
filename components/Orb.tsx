type OrbProps = {
  className?: string;
  size?: number;
};

export function Orb({ className = "", size = 220 }: OrbProps) {
  return (
    <div
      className={`orb-float relative shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <div className="orb-glow absolute -inset-8 rounded-full bg-accent/25 blur-3xl" />
      <div
        className="absolute inset-0 rounded-full shadow-[0_0_64px_rgba(30,212,176,0.22)]"
        style={{
          background:
            "radial-gradient(circle at 34% 28%, #ffffff 0%, #e9e9e9 42%, #c8c8c8 100%)",
        }}
      />
      <div className="absolute left-[27%] top-[36%] h-[40%] w-[17%] -rotate-[22deg] rounded-full bg-black" />
      <div className="absolute right-[27%] top-[36%] h-[40%] w-[17%] -rotate-[22deg] rounded-full bg-black" />
    </div>
  );
}
