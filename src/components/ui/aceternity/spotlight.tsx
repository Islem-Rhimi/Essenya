"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import React, { useRef } from "react";

interface SpotlightProps {
  children: React.ReactNode;
  className?: string;
}

export function Spotlight({ children, className = "" }: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const background = useTransform(
    [mouseX, mouseY],
    ([x, y]) =>
      `radial-gradient(600px circle at ${x}px ${y}px, rgba(255,255,255,0.15), transparent 80%)`,
  );

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (bounds) {
      mouseX.set(event.clientX - bounds.left);
      mouseY.set(event.clientY - bounds.top);
    }
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      style={{ background }}
      className={cn("relative transition-colors duration-500", className)}
    >
      {children}
    </motion.div>
  );
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}
