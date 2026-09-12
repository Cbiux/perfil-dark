"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { GrokBot } from "./GrokBot";

const FOLLOW = 0.13;
const DAMPING = 0.8;

function petSizeForViewport() {
  return window.matchMedia("(min-width: 768px)").matches ? 120 : 88;
}

export function GrokScene() {
  const [ready, setReady] = useState(false);
  const [size, setSize] = useState(88);
  const petRef = useRef<HTMLDivElement>(null);
  const botRef = useRef<HTMLDivElement>(null);
  const faceRef = useRef<HTMLDivElement>(null);
  const sphereRef = useRef<HTMLDivElement>(null);
  const eyesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSize(petSizeForViewport());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const pet = petRef.current;
    if (!pet) return;

    let petSize = petSizeForViewport();
    const mouse = {
      x: window.innerWidth / 2 + 90,
      y: Math.min(window.innerHeight * 0.42, 280),
    };
    const pos = { x: mouse.x, y: mouse.y };
    const vel = { x: 0, y: 0 };
    const look = { x: 0.18, y: -0.08 };
    let blink = 1;
    let bounce = 0;
    let spin = 0;
    let hover = 0;
    let lastMove = performance.now();
    let lastPointer = { x: mouse.x, y: mouse.y };
    let raf = 0;
    let blinkTimer = 0;
    let cancelled = false;
    let catching = false;
    let hovered = false;

    const scheduleBlink = () => {
      blinkTimer = window.setTimeout(() => {
        if (cancelled) return;
        blink = 0.08;
        window.setTimeout(() => {
          blink = 1;
          if (!cancelled) scheduleBlink();
        }, 140);
      }, 2200 + Math.random() * 3600);
    };
    scheduleBlink();

    const onResize = () => {
      petSize = petSizeForViewport();
      setSize(petSize);
    };

    const onMove = (event: PointerEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      lastMove = performance.now();
    };

    const onDown = (event: PointerEvent) => {
      const dx = event.clientX - pos.x;
      const dy = event.clientY - pos.y;
      const hit = hovered || Math.hypot(dx, dy) <= petSize / 2 + 8;
      bounce = hit ? -28 : -12;
      if (hit) spin = event.clientX < pos.x ? -22 : 22;
    };

    const onEnter = () => {
      hovered = true;
    };

    const onLeave = () => {
      hovered = false;
    };

    const tick = (now: number) => {
      const idle = now - lastMove > 1600;
      const radius = petSize / 2;
      const pad = radius + 14;
      const dx = mouse.x - lastPointer.x;
      const dy = mouse.y - lastPointer.y;
      lastPointer.x = mouse.x;
      lastPointer.y = mouse.y;

      catching = hovered;
      hover += ((catching ? 1 : 0) - hover) * 0.22;

      let targetX: number;
      let targetY: number;

      if (catching) {
        targetX = pos.x + dx * 0.15;
        targetY = pos.y + dy * 0.15;
      } else if (idle) {
        const t = now / 980;
        targetX = mouse.x + Math.sin(t) * 46 + 28;
        targetY = mouse.y + Math.cos(t * 1.15) * 34 + 24;
      } else {
        const speed = Math.hypot(dx, dy);
        const trail = Math.min(1, speed / 16);
        targetX = mouse.x + 72 - trail * dx * 5;
        targetY = mouse.y + 56 - trail * dy * 5;
      }

      targetX = Math.min(window.innerWidth - pad, Math.max(pad, targetX));
      targetY = Math.min(window.innerHeight - pad, Math.max(pad, targetY));

      vel.x = (vel.x + (targetX - pos.x) * FOLLOW) * DAMPING;
      vel.y = (vel.y + (targetY - pos.y) * FOLLOW) * DAMPING;
      bounce *= 0.84;
      spin *= 0.88;
      pos.x += vel.x;
      pos.y += vel.y + bounce;

      pos.x = Math.min(window.innerWidth - pad, Math.max(pad, pos.x));
      pos.y = Math.min(window.innerHeight - pad, Math.max(pad, pos.y));

      const speed = Math.hypot(vel.x, vel.y);
      const tilt = Math.max(-16, Math.min(16, vel.x * 1.35 + spin));
      const squash = Math.min(0.09, speed * 0.01);
      const scale = 1 + hover * 0.12;

      pet.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) rotate(${tilt}deg) scale(${scale}, ${scale - squash})`;
      pet.style.opacity = "1";
      pet.style.cursor = catching ? "pointer" : "default";

      const face = faceRef.current;
      const sphere = sphereRef.current;
      const eyes = eyesRef.current;
      if (face && sphere && eyes) {
        const lookTarget = catching
          ? {
              x: Math.max(-1, Math.min(1, (mouse.x - pos.x) / 40)),
              y: Math.max(-1, Math.min(1, (mouse.y - pos.y) / 40)),
            }
          : idle
            ? { x: Math.sin(now / 1300) * 0.5, y: Math.cos(now / 1500) * 0.3 }
            : {
                x: Math.max(-1, Math.min(1, (mouse.x - pos.x) / 80)),
                y: Math.max(-1, Math.min(1, (mouse.y - pos.y) / 80)),
              };
        look.x += (lookTarget.x - look.x) * 0.22;
        look.y += (lookTarget.y - look.y) * 0.22;
        face.style.transform = `translate3d(${look.x * 8}px, ${look.y * 7}px, 0)`;
        eyes.style.transform = `scaleY(${catching ? Math.max(blink, 0.72) : blink})`;
        sphere.style.background = `radial-gradient(circle at ${34 + look.x * 16}% ${28 + look.y * 12}%, #ffffff 0%, #f2f2f2 42%, #cfcfcf 72%, #b4b4b4 100%)`;
      }

      raf = requestAnimationFrame(tick);
    };

    pet.addEventListener("pointerenter", onEnter);
    pet.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(blinkTimer);
      pet.removeEventListener("pointerenter", onEnter);
      pet.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("resize", onResize);
    };
  }, [ready]);

  if (!ready) return null;

  return createPortal(
    <div
      ref={petRef}
      className="fixed top-0 left-0 z-[70] opacity-0"
      style={{ pointerEvents: "auto" }}
      aria-hidden
    >
      <GrokBot
        size={size}
        botRef={botRef}
        faceRef={faceRef}
        sphereRef={sphereRef}
        eyesRef={eyesRef}
      />
    </div>,
    document.body,
  );
}
