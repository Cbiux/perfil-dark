"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { GrokBot } from "./GrokBot";

const FOLLOW = 0.085;
const DAMPING = 0.78;
const PET_SIZE = 92;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function GrokScene() {
  const [ready, setReady] = useState(false);
  const petRef = useRef<HTMLDivElement>(null);
  const botRef = useRef<HTMLDivElement>(null);
  const faceRef = useRef<HTMLDivElement>(null);
  const sphereRef = useRef<HTMLDivElement>(null);
  const eyesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const pet = petRef.current;
    if (!pet) return;

    const reduced = prefersReducedMotion();
    const mouse = {
      x: window.innerWidth / 2,
      y: window.innerHeight * 0.55,
    };
    const pos = { x: mouse.x + 72, y: mouse.y + 64 };
    const vel = { x: 0, y: 0 };
    const look = { x: 0.12, y: -0.06 };
    let blink = 1;
    let bounce = 0;
    let hoverBoost = 0;
    let lastMove = performance.now();
    let raf = 0;
    let blinkTimer = 0;
    let cancelled = false;

    const scheduleBlink = () => {
      blinkTimer = window.setTimeout(() => {
        if (cancelled) return;
        blink = 0.1;
        window.setTimeout(() => {
          blink = 1;
          if (!cancelled) scheduleBlink();
        }, 130);
      }, 2400 + Math.random() * 3800);
    };
    scheduleBlink();

    const onMove = (event: PointerEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      lastMove = performance.now();
      const target = event.target;
      hoverBoost =
        target instanceof Element &&
        Boolean(target.closest("a, button, input, textarea, select"))
          ? 1
          : 0;
    };

    const onClick = () => {
      bounce = -18;
    };

    const tick = () => {
      const now = performance.now();
      const idle = now - lastMove > 1800;

      const pad = PET_SIZE / 2 + 16;
      const targetX = reduced
        ? window.innerWidth - pad - 8
        : Math.min(window.innerWidth - pad, Math.max(pad, mouse.x + 42));
      const targetY = reduced
        ? window.innerHeight - pad - 8
        : Math.min(window.innerHeight - pad, Math.max(pad, mouse.y + 48));

      if (!reduced) {
        vel.x = (vel.x + (targetX - pos.x) * FOLLOW) * DAMPING;
        vel.y = (vel.y + (targetY - pos.y) * FOLLOW) * DAMPING;
        bounce *= 0.86;
        pos.x += vel.x;
        pos.y += vel.y + bounce;
      } else {
        pos.x += (targetX - pos.x) * 0.2;
        pos.y += (targetY - pos.y) * 0.2;
      }

      if (idle && !reduced) {
        const t = now / 900;
        pos.x += Math.sin(t) * 0.35;
        pos.y += Math.cos(t * 1.3) * 0.28;
      }

      const speed = Math.hypot(vel.x, vel.y);
      const tilt = Math.max(-14, Math.min(14, vel.x * 1.4));
      const squash = Math.min(0.08, speed * 0.012);

      pet.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) rotate(${tilt}deg) scale(${1 + hoverBoost * 0.08}, ${1 - squash})`;
      pet.style.opacity = "1";

      const face = faceRef.current;
      const sphere = sphereRef.current;
      const eyes = eyesRef.current;
      if (face && sphere && eyes) {
        const lookTarget = idle
          ? { x: Math.sin(now / 1400) * 0.45, y: Math.cos(now / 1600) * 0.28 }
          : {
              x: Math.max(-1, Math.min(1, (mouse.x - pos.x) / 90)),
              y: Math.max(-1, Math.min(1, (mouse.y - pos.y) / 90)),
            };
        look.x += (lookTarget.x - look.x) * 0.18;
        look.y += (lookTarget.y - look.y) * 0.18;
        face.style.transform = `translate3d(${look.x * 7}px, ${look.y * 6}px, 0)`;
        eyes.style.transform = `scaleY(${blink})`;
        sphere.style.background = `radial-gradient(circle at ${34 + look.x * 16}% ${28 + look.y * 12}%, #ffffff 0%, #ececec 46%, #c8c8c8 100%)`;
      }

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onClick);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(blinkTimer);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onClick);
    };
  }, [ready]);

  if (!ready) return null;

  return createPortal(
    <div
      ref={petRef}
      className="pointer-events-none fixed top-0 left-0 z-[70] -translate-x-1/2 -translate-y-1/2 opacity-0"
      aria-hidden
    >
      <GrokBot
        size={PET_SIZE}
        botRef={botRef}
        faceRef={faceRef}
        sphereRef={sphereRef}
        eyesRef={eyesRef}
      />
    </div>,
    document.body,
  );
}
