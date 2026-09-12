"use client";

import { useEffect, useRef } from "react";
import { GrokBot } from "./GrokBot";

const EYE_LERP = 0.16;
const CURSOR_LERP = 0.24;
const IDLE_AFTER_MS = 2200;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function hasFinePointer() {
  return window.matchMedia("(pointer: fine)").matches;
}

export function GrokScene() {
  const bigBotRef = useRef<HTMLDivElement>(null);
  const faceRef = useRef<HTMLDivElement>(null);
  const sphereRef = useRef<HTMLDivElement>(null);
  const eyesRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorBotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !hasFinePointer()) return;

    document.documentElement.classList.add("grok-cursor-page");

    const mouse = { x: window.innerWidth * 0.62, y: window.innerHeight * 0.42 };
    const look = { x: 0.18, y: -0.08 };
    const cursorPos = { x: mouse.x, y: mouse.y };
    const idle = { x: 0.18, y: -0.08 };
    let lastMove = performance.now();
    let blink = 1;
    let hovering = false;
    let shown = false;
    let raf = 0;
    let blinkTimer = 0;
    let cancelled = false;

    const scheduleBlink = () => {
      blinkTimer = window.setTimeout(() => {
        if (cancelled) return;
        blink = 0.08;
        window.setTimeout(() => {
          blink = 1;
          if (!cancelled) scheduleBlink();
        }, 140);
      }, 2800 + Math.random() * 4200);
    };
    scheduleBlink();

    const onMove = (event: PointerEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      lastMove = performance.now();
      const target = event.target;
      hovering =
        target instanceof Element &&
        Boolean(target.closest("a, button, input, textarea, select"));
      if (!shown && cursorRef.current) {
        cursorRef.current.classList.remove("opacity-0");
        shown = true;
      }
    };

    const tick = () => {
      const now = performance.now();
      const idleMs = now - lastMove;
      if (idleMs > IDLE_AFTER_MS) {
        const t = now / 1800;
        idle.x = Math.sin(t) * 0.42;
        idle.y = Math.cos(t * 0.7) * 0.26 - 0.04;
      }

      const bot = bigBotRef.current;
      const face = faceRef.current;
      const sphere = sphereRef.current;
      const eyes = eyesRef.current;
      if (bot && face && sphere && eyes) {
        const rect = bot.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const targetLook =
          idleMs > IDLE_AFTER_MS
            ? idle
            : {
                x: Math.max(-1, Math.min(1, (mouse.x - cx) / (rect.width * 0.55))),
                y: Math.max(-1, Math.min(1, (mouse.y - cy) / (rect.height * 0.55))),
              };
        look.x += (targetLook.x - look.x) * EYE_LERP;
        look.y += (targetLook.y - look.y) * EYE_LERP;

        const max = rect.width * 0.078;
        face.style.transform = `translate3d(${look.x * max}px, ${look.y * max}px, 0)`;
        eyes.style.transform = `scaleY(${blink})`;
        const hx = 34 + look.x * 18;
        const hy = 28 + look.y * 14;
        sphere.style.background = `radial-gradient(circle at ${hx}% ${hy}%, #ffffff 0%, #ececec 44%, #c4c4c4 100%)`;
      }

      const cursorEl = cursorRef.current;
      const cursorBot = cursorBotRef.current;
      if (cursorEl && cursorBot) {
        cursorPos.x += (mouse.x - cursorPos.x) * CURSOR_LERP;
        cursorPos.y += (mouse.y - cursorPos.y) * CURSOR_LERP;
        cursorEl.style.transform = `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0) scale(${hovering ? 1.2 : 1})`;
        const cFace = cursorBot.querySelector<HTMLElement>("[data-grok-face]");
        const cEyes = cursorBot.querySelector<HTMLElement>("[data-grok-eyes]");
        const cSphere = cursorBot.querySelector<HTMLElement>("[data-grok-sphere]");
        if (cFace && cEyes && cSphere) {
          const cRect = cursorBot.getBoundingClientRect();
          const lx = Math.max(
            -1,
            Math.min(1, (mouse.x - (cRect.left + cRect.width / 2)) / 18),
          );
          const ly = Math.max(
            -1,
            Math.min(1, (mouse.y - (cRect.top + cRect.height / 2)) / 18),
          );
          cFace.style.transform = `translate3d(${lx * 2.6}px, ${ly * 2.1}px, 0)`;
          cEyes.style.transform = `scaleY(${blink})`;
          cSphere.style.background = `radial-gradient(circle at ${50 + lx * 14}% ${40 + ly * 12}%, #ffffff 0%, #e8e8e8 50%, #c8c8c8 100%)`;
        }
      }

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(blinkTimer);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.classList.remove("grok-cursor-page");
    };
  }, []);

  return (
    <>
      <div className="pointer-events-none absolute -bottom-36 -left-28 sm:-bottom-48 sm:-left-20">
        <GrokBot
          size={520}
          className="opacity-95"
          botRef={bigBotRef}
          faceRef={faceRef}
          sphereRef={sphereRef}
          eyesRef={eyesRef}
          floating
        />
      </div>
      <div
        ref={cursorRef}
        className="grok-cursor pointer-events-none fixed top-0 left-0 z-[80] hidden opacity-0 sm:block"
        aria-hidden
      >
        <div className="-translate-x-1/2 -translate-y-1/2">
          <GrokBot size={36} botRef={cursorBotRef} />
        </div>
      </div>
    </>
  );
}
