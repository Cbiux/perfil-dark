"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { GrokBot } from "./GrokBot";

const FOLLOW = 0.14;
const DAMPING = 0.8;
const OFFSET_X = 92;
const OFFSET_Y = 68;
const GAP = 36;
const GYRO_ACCEL = 0.62;
const FRICTION = 0.986;
const RESTITUTION = 0.76;
const MAX_SPEED = 22;

type OrientationEventCtor = {
  requestPermission?: () => Promise<"granted" | "denied">;
};

function petSizeForViewport(desktop: boolean) {
  if (!desktop) return 84;
  return window.matchMedia("(min-width: 768px)").matches ? 120 : 88;
}

function isDesktopPointer() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function keepAwayFromPointer(
  mouseX: number,
  mouseY: number,
  preferredX: number,
  preferredY: number,
  minDist: number,
  pad: number,
) {
  const maxX = window.innerWidth - pad;
  const maxY = window.innerHeight - pad;
  const offsets = [
    { x: OFFSET_X, y: OFFSET_Y },
    { x: -OFFSET_X, y: OFFSET_Y },
    { x: OFFSET_X, y: -OFFSET_Y },
    { x: -OFFSET_X, y: -OFFSET_Y },
    { x: 0, y: minDist },
    { x: 0, y: -minDist },
    { x: minDist, y: 0 },
    { x: -minDist, y: 0 },
  ];

  let bestX = clamp(preferredX, pad, maxX);
  let bestY = clamp(preferredY, pad, maxY);
  let bestScore = -1;

  for (const offset of offsets) {
    const x = clamp(mouseX + offset.x, pad, maxX);
    const y = clamp(mouseY + offset.y, pad, maxY);
    const dist = Math.hypot(x - mouseX, y - mouseY);
    if (dist < minDist) continue;
    const closeness =
      dist + Math.hypot(x - preferredX, y - preferredY) * 0.35;
    if (bestScore < 0 || closeness < bestScore) {
      bestScore = closeness;
      bestX = x;
      bestY = y;
    }
  }

  const dist = Math.hypot(bestX - mouseX, bestY - mouseY);
  if (dist < minDist) {
    const towardCenterX = window.innerWidth / 2 - mouseX;
    const towardCenterY = window.innerHeight / 2 - mouseY;
    const length = Math.hypot(towardCenterX, towardCenterY) || 1;
    bestX = clamp(mouseX + (towardCenterX / length) * minDist, pad, maxX);
    bestY = clamp(mouseY + (towardCenterY / length) * minDist, pad, maxY);
  }

  return { x: bestX, y: bestY };
}

function separateFromPointer(
  x: number,
  y: number,
  mouseX: number,
  mouseY: number,
  minDist: number,
  pad: number,
) {
  let dx = x - mouseX;
  let dy = y - mouseY;
  let dist = Math.hypot(dx, dy);
  if (dist < 0.001) {
    dx = OFFSET_X;
    dy = OFFSET_Y;
    dist = Math.hypot(dx, dy);
  }
  if (dist < minDist) {
    const scale = minDist / dist;
    x = mouseX + dx * scale;
    y = mouseY + dy * scale;
  }
  return {
    x: clamp(x, pad, window.innerWidth - pad),
    y: clamp(y, pad, window.innerHeight - pad),
  };
}

function screenAngle() {
  return (
    (screen.orientation && screen.orientation.angle) ||
    (window.orientation as number | undefined) ||
    0
  );
}

function tiltAccel(beta: number, gamma: number) {
  let x = gamma / 32;
  let y = (beta - 35) / 32;
  const angle = screenAngle();
  if (angle === 90) {
    const nextX = y;
    y = -x;
    x = nextX;
  } else if (angle === -90 || angle === 270) {
    const nextX = -y;
    y = x;
    x = nextX;
  } else if (angle === 180) {
    x = -x;
    y = -y;
  }
  return {
    x: clamp(x, -1.8, 1.8),
    y: clamp(y, -1.8, 1.8),
  };
}

async function requestMotionPermission() {
  const orientation = DeviceOrientationEvent as unknown as OrientationEventCtor;
  const motion = DeviceMotionEvent as unknown as OrientationEventCtor;
  try {
    if (typeof orientation.requestPermission === "function") {
      const result = await orientation.requestPermission();
      if (result !== "granted") return false;
    }
    if (typeof motion.requestPermission === "function") {
      await motion.requestPermission();
    }
    return true;
  } catch {
    return false;
  }
}

export function GrokScene() {
  const [ready, setReady] = useState(false);
  const [desktop, setDesktop] = useState(true);
  const [size, setSize] = useState(88);
  const petRef = useRef<HTMLDivElement>(null);
  const botRef = useRef<HTMLDivElement>(null);
  const faceRef = useRef<HTMLDivElement>(null);
  const sphereRef = useRef<HTMLDivElement>(null);
  const eyesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nextDesktop = isDesktopPointer();
    setDesktop(nextDesktop);
    setSize(petSizeForViewport(nextDesktop));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const pet = petRef.current;
    if (!pet) return;

    let modeDesktop = isDesktopPointer();
    let petSize = petSizeForViewport(modeDesktop);
    const mouse = {
      x: window.innerWidth / 2 + (modeDesktop ? 90 : 0),
      y: modeDesktop
        ? Math.min(window.innerHeight * 0.42, 280)
        : window.innerHeight * 0.42,
    };
    const pos = modeDesktop
      ? keepAwayFromPointer(
          mouse.x,
          mouse.y,
          mouse.x + OFFSET_X,
          mouse.y + OFFSET_Y,
          petSize / 2 + GAP,
          petSize / 2 + 14,
        )
      : { x: window.innerWidth / 2, y: window.innerHeight * 0.38 };
    const vel = { x: modeDesktop ? 0 : 3.2, y: modeDesktop ? 0 : 2.4 };
    const look = { x: 0.18, y: -0.08 };
    const tilt = { beta: 35, gamma: 0 };
    let blink = 1;
    let bounce = 0;
    let spin = 0;
    let lastMove = performance.now();
    let lastPointer = { x: mouse.x, y: mouse.y };
    let lastTick = performance.now();
    let raf = 0;
    let blinkTimer = 0;
    let cancelled = false;
    let gyroOn = false;
    let askedMotion = false;

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

    const minDistFor = () => petSize / 2 + GAP;
    const padFor = () => petSize / 2 + (modeDesktop ? 14 : 8);

    const paint = (now: number) => {
      const speed = Math.hypot(vel.x, vel.y);
      const rotate = Math.max(-18, Math.min(18, vel.x * 1.2 + spin));
      const squash = Math.min(0.1, speed * 0.01);
      pet.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) rotate(${rotate}deg) scale(1, ${1 - squash})`;
      pet.style.opacity = "1";

      const face = faceRef.current;
      const sphere = sphereRef.current;
      const eyes = eyesRef.current;
      if (!face || !sphere || !eyes) return;

      const lookTarget = modeDesktop
        ? now - lastMove > 1600
          ? { x: Math.sin(now / 1300) * 0.5, y: Math.cos(now / 1500) * 0.3 }
          : {
              x: Math.max(-1, Math.min(1, (mouse.x - pos.x) / 80)),
              y: Math.max(-1, Math.min(1, (mouse.y - pos.y) / 80)),
            }
        : {
            x: Math.max(-1, Math.min(1, vel.x / 10)),
            y: Math.max(-1, Math.min(1, vel.y / 10)),
          };
      look.x += (lookTarget.x - look.x) * 0.22;
      look.y += (lookTarget.y - look.y) * 0.22;
      face.style.transform = `translate3d(${look.x * 8}px, ${look.y * 7}px, 0)`;
      eyes.style.transform = `scaleY(${blink})`;
      sphere.style.background = `radial-gradient(circle at ${34 + look.x * 16}% ${28 + look.y * 12}%, #ffffff 0%, #f2f2f2 42%, #cfcfcf 72%, #b4b4b4 100%)`;
    };

    const shoveAway = () => {
      if (!modeDesktop) return;
      const minDist = minDistFor();
      const pad = padFor();
      if (Math.hypot(pos.x - mouse.x, pos.y - mouse.y) < minDist) {
        const away = keepAwayFromPointer(
          mouse.x,
          mouse.y,
          pos.x,
          pos.y,
          minDist,
          pad,
        );
        pos.x = away.x;
        pos.y = away.y;
        paint(performance.now());
      }
    };

    const bounceWalls = () => {
      const pad = padFor();
      const minX = pad;
      const maxX = window.innerWidth - pad;
      const minY = pad;
      const maxY = window.innerHeight - pad;
      if (pos.x <= minX) {
        pos.x = minX;
        vel.x = Math.abs(vel.x) * RESTITUTION;
        spin += 12;
      } else if (pos.x >= maxX) {
        pos.x = maxX;
        vel.x = -Math.abs(vel.x) * RESTITUTION;
        spin -= 12;
      }
      if (pos.y <= minY) {
        pos.y = minY;
        vel.y = Math.abs(vel.y) * RESTITUTION;
      } else if (pos.y >= maxY) {
        pos.y = maxY;
        vel.y = -Math.abs(vel.y) * RESTITUTION;
        spin += vel.x > 0 ? 8 : -12;
      }
    };

    const jump = (clientX: number) => {
      vel.y = Math.min(vel.y, 0) - 16;
      vel.x += clientX < pos.x ? -3.5 : 3.5;
      bounce = -22;
      spin = clientX < pos.x ? -18 : 18;
    };

    const onResize = () => {
      modeDesktop = isDesktopPointer();
      setDesktop(modeDesktop);
      petSize = petSizeForViewport(modeDesktop);
      setSize(petSize);
      pet.style.pointerEvents = modeDesktop ? "none" : "auto";
      shoveAway();
    };

    const onMove = (event: PointerEvent) => {
      if (!modeDesktop) return;
      if (event.pointerType === "touch") return;
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      lastMove = performance.now();
      shoveAway();
    };

    const onPetDown = (event: PointerEvent) => {
      if (modeDesktop) return;
      event.preventDefault();
      event.stopPropagation();
      void requestMotionPermission().then((ok) => {
        if (ok) gyroOn = true;
      });
      jump(event.clientX);
    };

    const onFirstTouch = () => {
      if (modeDesktop || askedMotion) return;
      askedMotion = true;
      void requestMotionPermission().then((ok) => {
        if (ok) gyroOn = true;
      });
    };

    const onOrientation = (event: DeviceOrientationEvent) => {
      if (modeDesktop) return;
      if (typeof event.beta === "number") tilt.beta = event.beta;
      if (typeof event.gamma === "number") tilt.gamma = event.gamma;
      gyroOn = true;
    };

    const tick = (now: number) => {
      const dt = Math.min(32, now - lastTick) / 16.67;
      lastTick = now;
      const pad = padFor();
      const minDist = minDistFor();

      if (modeDesktop) {
        const dx = mouse.x - lastPointer.x;
        const dy = mouse.y - lastPointer.y;
        lastPointer.x = mouse.x;
        lastPointer.y = mouse.y;
        const idle = now - lastMove > 1600;
        let preferredX: number;
        let preferredY: number;
        if (idle) {
          const t = now / 980;
          preferredX = mouse.x + OFFSET_X + Math.sin(t) * 22;
          preferredY = mouse.y + OFFSET_Y + Math.cos(t * 1.15) * 18;
        } else {
          const speed = Math.hypot(dx, dy);
          const trail = Math.min(1, speed / 16);
          preferredX = mouse.x + OFFSET_X - trail * dx * 4;
          preferredY = mouse.y + OFFSET_Y - trail * dy * 4;
        }
        const target = keepAwayFromPointer(
          mouse.x,
          mouse.y,
          preferredX,
          preferredY,
          minDist,
          pad,
        );
        vel.x = (vel.x + (target.x - pos.x) * FOLLOW) * DAMPING;
        vel.y = (vel.y + (target.y - pos.y) * FOLLOW) * DAMPING;
        bounce *= 0.84;
        spin *= 0.88;
        pos.x += vel.x;
        pos.y += vel.y + bounce;
        const separated = separateFromPointer(
          pos.x,
          pos.y,
          mouse.x,
          mouse.y,
          minDist,
          pad,
        );
        if (Math.hypot(separated.x - mouse.x, separated.y - mouse.y) < minDist) {
          const away = keepAwayFromPointer(
            mouse.x,
            mouse.y,
            separated.x,
            separated.y,
            minDist,
            pad,
          );
          pos.x = away.x;
          pos.y = away.y;
        } else {
          pos.x = separated.x;
          pos.y = separated.y;
        }
      } else {
        const accel = gyroOn
          ? tiltAccel(tilt.beta, tilt.gamma)
          : { x: Math.sin(now / 1400) * 0.18, y: 0.22 };
        vel.x += accel.x * GYRO_ACCEL * dt;
        vel.y += accel.y * GYRO_ACCEL * dt;
        vel.x *= FRICTION;
        vel.y *= FRICTION;
        bounce *= 0.84;
        spin *= 0.9;
        const speed = Math.hypot(vel.x, vel.y);
        if (speed > MAX_SPEED) {
          vel.x = (vel.x / speed) * MAX_SPEED;
          vel.y = (vel.y / speed) * MAX_SPEED;
        }
        pos.x += vel.x * dt;
        pos.y += vel.y * dt + bounce;
        bounceWalls();
      }

      paint(now);
      raf = requestAnimationFrame(tick);
    };

    pet.style.pointerEvents = modeDesktop ? "none" : "auto";
    pet.addEventListener("pointerdown", onPetDown);
    window.addEventListener("pointerdown", onFirstTouch);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("deviceorientation", onOrientation);
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(blinkTimer);
      pet.removeEventListener("pointerdown", onPetDown);
      window.removeEventListener("pointerdown", onFirstTouch);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("deviceorientation", onOrientation);
      window.removeEventListener("resize", onResize);
    };
  }, [ready]);

  if (!ready) return null;

  return createPortal(
    <div
      ref={petRef}
      className={`fixed top-0 left-0 z-[70] opacity-0 ${desktop ? "pointer-events-none" : "pointer-events-auto"}`}
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
