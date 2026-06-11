"use client";

import React, { useEffect, useRef, useState } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  maxSize: number;
  opacity: number;
  initialOpacity: number;
  colorPrefix: string;
  type: "star" | "dot";
  angle: number;
  spinSpeed: number;
  age: number;
  maxAge: number;
}

const BRAND_COLORS = [
  "rgba(212, 160, 23, ",   // Gold Accent
  "rgba(250, 243, 224, ",  // Warm Ivory
  "rgba(193, 68, 14, ",   // Terracotta
];

export default function InteractiveParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const lastPointerPos = useRef({ x: 0, y: 0 });
  const isPointerActive = useRef(false);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    // Accessibility check: respects prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setIsDisabled(true);
      return;
    }

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsDisabled(e.matches);
    };
    mediaQuery.addEventListener("change", handleMediaChange);

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Handle high-DPI/Retina screens for perfectly crisp drawings
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });

    // Draw an elegant 4-pointed star
    const drawStar = (
      ctx: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      outerRadius: number,
      innerRadius: number,
      angle: number
    ) => {
      let rot = (Math.PI / 2) * 3 + angle;
      const spikes = 4;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
      for (let i = 0; i < spikes; i++) {
        let x = cx + Math.cos(rot) * outerRadius;
        let y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.closePath();
    };

    // Spawning function
    const spawnParticles = (x: number, y: number, count: number, dx: number, dy: number) => {
      // Cap maximum active particles on screen to protect system resources
      if (particles.current.length > 150) {
        // Remove oldest particles if exceeding limit
        particles.current.splice(0, particles.current.length - 150);
      }

      for (let i = 0; i < count; i++) {
        // Interpolate position along the path segment when pointer moves quickly
        const t = count > 1 ? i / count : 1;
        const interpX = x - dx * (1 - t);
        const interpY = y - dy * (1 - t);

        const initialSize = Math.random() * 3.5 + 1.5; // size between 1.5px and 5px
        const colorPrefix = BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)];
        const isStar = Math.random() < 0.3; // 30% stars, 70% soft dots
        const maxAge = Math.floor(Math.random() * 35) + 30; // lifespans between 30 and 65 frames

        particles.current.push({
          x: interpX,
          y: interpY,
          // Disperse outward gently with slight initial direction drift
          vx: (Math.random() - 0.5) * 0.9,
          vy: (Math.random() - 0.5) * 0.9 - 0.2, // slight upward float bias
          size: initialSize,
          maxSize: initialSize,
          opacity: Math.random() * 0.3 + 0.7, // starting opacity between 0.7 and 1.0
          initialOpacity: Math.random() * 0.3 + 0.7,
          colorPrefix,
          type: isStar ? "star" : "dot",
          angle: Math.random() * Math.PI * 2,
          spinSpeed: (Math.random() - 0.5) * 0.08,
          age: 0,
          maxAge,
        });
      }
    };

    // Pointer event bindings
    const handlePointerMove = (e: PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      if (!isPointerActive.current) {
        lastPointerPos.current.x = x;
        lastPointerPos.current.y = y;
        isPointerActive.current = true;
        return;
      }

      const dx = x - lastPointerPos.current.x;
      const dy = y - lastPointerPos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Only spawn if movement exceeds threshold
      if (distance > 3) {
        // Adapt density to speed: faster moves generate more particles
        const spawnCount = Math.min(Math.floor(distance / 5), 5);
        spawnParticles(x, y, spawnCount, dx, dy);

        lastPointerPos.current.x = x;
        lastPointerPos.current.y = y;
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      isPointerActive.current = true;
      lastPointerPos.current.x = e.clientX;
      lastPointerPos.current.y = e.clientY;
      // Burst of particles on click/press
      spawnParticles(e.clientX, e.clientY, 8, 0, 0);
    };

    const handlePointerLeave = () => {
      isPointerActive.current = false;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    document.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    // requestAnimationFrame render loop
    let rafId: number;
    const render = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Clear full canvas
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      // Update and draw particles
      const activeParticles: Particle[] = [];
      const len = particles.current.length;

      for (let i = 0; i < len; i++) {
        const p = particles.current[i];
        p.age++;

        if (p.age < p.maxAge) {
          // Physics updates
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.005; // tiny gravity drift downward
          p.angle += p.spinSpeed;

          // Easing/decay progress
          const progress = p.age / p.maxAge;
          p.opacity = (1 - progress) * p.initialOpacity;
          // Softly shrink size
          p.size = (1 - progress) * p.maxSize;

          // Drawing
          ctx.save();
          if (p.type === "star") {
            // Star inner fill color
            ctx.fillStyle = `${p.colorPrefix}${p.opacity})`;
            drawStar(ctx, p.x, p.y, p.size, p.size * 0.25, p.angle);
            ctx.fill();

            // Star outer glow halo
            ctx.fillStyle = `${p.colorPrefix}${p.opacity * 0.25})`;
            drawStar(ctx, p.x, p.y, p.size * 2, p.size * 0.5, p.angle);
            ctx.fill();
          } else {
            // Dot glow halo
            ctx.fillStyle = `${p.colorPrefix}${p.opacity * 0.25})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 2.2, 0, Math.PI * 2);
            ctx.fill();

            // Dot core
            ctx.fillStyle = `${p.colorPrefix}${p.opacity})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();

          activeParticles.push(p);
        }
      }

      particles.current = activeParticles;
      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);

    // Cleanup
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", resizeCanvas);
      mediaQuery.removeEventListener("change", handleMediaChange);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (isDisabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9998] block will-change-transform"
      style={{
        mixBlendMode: "screen",
      }}
    />
  );
}
