"use client";

import React, { useEffect, useRef, useState } from "react";

export default function InteractiveCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  
  // Keep track of cursor coordinates and target properties
  const pointerPos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const cursorScale = useRef(1);
  const cursorOpacity = useRef(0);
  
  const targetScale = useRef(1);
  const targetOpacity = useRef(0);
  const isTouchDevice = useRef(false);
  
  // React states to handle class changes (only re-renders on entering/leaving hover states)
  const [isHovering, setIsHovering] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    // Accessibility check: respect prefers-reduced-motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setIsDisabled(true);
      return;
    }

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsDisabled(e.matches);
    };
    mediaQuery.addEventListener("change", handleMediaChange);

    // Mouse and touch pointer event handlers
    const handlePointerMove = (e: PointerEvent) => {
      isTouchDevice.current = e.pointerType === "touch";
      pointerPos.current.x = e.clientX;
      pointerPos.current.y = e.clientY;
      
      // Make cursor visible as soon as pointer moves
      targetOpacity.current = 1;
    };

    const handlePointerDown = (e: PointerEvent) => {
      isTouchDevice.current = e.pointerType === "touch";
      pointerPos.current.x = e.clientX;
      pointerPos.current.y = e.clientY;
      targetOpacity.current = 1;
      targetScale.current = 0.85; // Slightly shrink on click/press to create tactile feedback
    };

    const handlePointerUp = () => {
      targetScale.current = isHovering ? 1.4 : 1;
      
      // On touch devices, fade the spotlight out immediately once finger leaves screen
      if (isTouchDevice.current) {
        targetOpacity.current = 0;
      }
    };

    const handlePointerLeave = (e: PointerEvent) => {
      // Fade out on desktop when mouse leaves the document window bounds
      if (e.pointerType === "mouse") {
        targetOpacity.current = 0;
      }
    };

    const handlePointerEnter = (e: PointerEvent) => {
      if (e.pointerType === "mouse") {
        targetOpacity.current = 1;
      }
    };

    // Highly performant, delegated global mouseover listener to react to interactive states
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Match typical clickable/input controls
      const interactive = target.closest(
        'a, button, [role="button"], input, select, textarea, [data-interactive="true"]'
      );
      
      if (interactive) {
        setIsHovering(true);
        targetScale.current = 1.4;
      } else {
        setIsHovering(false);
        targetScale.current = 1;
      }
    };

    // Bind modern pointer events for unified mouse/touch/stylus support
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    document.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    document.addEventListener("pointerenter", handlePointerEnter, { passive: true });
    document.addEventListener("mouseover", handleMouseOver, { passive: true });

    // requestAnimationFrame animation loop to guarantee smooth 60fps tracking
    let rafId: number;
    const updatePosition = () => {
      // Position LERP (Linear Interpolation) for a subtle trailing lag
      const dx = pointerPos.current.x - cursorPos.current.x;
      const dy = pointerPos.current.y - cursorPos.current.y;
      
      const posLerp = isTouchDevice.current ? 0.22 : 0.12; // Follow touch input slightly faster
      cursorPos.current.x += dx * posLerp;
      cursorPos.current.y += dy * posLerp;

      // Opacity LERP
      const dOpacity = targetOpacity.current - cursorOpacity.current;
      cursorOpacity.current += dOpacity * 0.15;

      // Scale LERP
      const dScale = targetScale.current - cursorScale.current;
      cursorScale.current += dScale * 0.15;

      // Apply coordinates directly to styles using translate3d for GPU acceleration
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorPos.current.x}px, ${cursorPos.current.y}px, 0) scale(${cursorScale.current})`;
        cursorRef.current.style.opacity = cursorOpacity.current.toFixed(3);
      }

      rafId = requestAnimationFrame(updatePosition);
    };
    rafId = requestAnimationFrame(updatePosition);

    // Cleanup listeners and cancel animation frame on unmount
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      document.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("pointerenter", handlePointerEnter);
      document.removeEventListener("mouseover", handleMouseOver);
      mediaQuery.removeEventListener("change", handleMediaChange);
      cancelAnimationFrame(rafId);
    };
  }, [isHovering]);

  if (isDisabled) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed left-0 top-0 pointer-events-none z-[9999] will-change-transform-opacity"
      style={{
        opacity: 0,
        transform: "translate3d(-100px, -100px, 0)",
      }}
    >
      {/* Center centering container offset */}
      <div className="relative -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        {/* Outer Spotlight Ring */}
        <div
          className={`absolute rounded-full border-2 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isHovering
              ? "w-16 h-16 border-[#C1440E]/50 bg-[#C1440E]/8 shadow-lg shadow-[#C1440E]/15"
              : "w-8 h-8 border-[#D4A017]/30 bg-gradient-to-br from-[#FAF3E0]/5 to-[#D4A017]/5"
          }`}
        />
        
        {/* Radial blur shadow glow (Gold/Terracotta depending on state) */}
        <div
          className={`absolute rounded-full blur-[6px] opacity-40 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] bg-gradient-to-r ${
            isHovering
              ? "w-24 h-24 from-[#C1440E]/15 to-[#D4A017]/8"
              : "w-14 h-14 from-[#D4A017]/8 to-transparent"
          }`}
        />

        {/* Core center marker dot */}
        <div
          className={`rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isHovering ? "w-1.5 h-1.5 bg-[#C1440E]" : "w-2 h-2 bg-[#D4A017]"
          }`}
        />
      </div>
    </div>
  );
}
