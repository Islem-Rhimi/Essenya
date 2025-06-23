"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

interface HoverEffectProps {
  items: {
    title: string;
    description?: string;
    image?: string;
    price?: string;
  }[];
  children?: (item: any) => React.ReactNode;
  className?: string;
}

export function HoverEffect({ items, children, className }: HoverEffectProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
        className,
      )}
    >
      {items.map((item, i) => (
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          key={i}
        >
          {children ? (
            children(item)
          ) : (
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              {item.description && (
                <p className="text-muted-foreground mt-2 text-sm">
                  {item.description}
                </p>
              )}
              {item.price && (
                <p className="mt-4 font-bold text-green-600">{item.price}</p>
              )}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
