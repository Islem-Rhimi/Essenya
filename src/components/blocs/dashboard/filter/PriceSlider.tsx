"use client";

import { Slider } from "@/components/ui/slider";

export default function PriceSlider({
  priceRange,
  setPriceRange,
}: {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-muted-foreground text-sm">
        Price Range: ${priceRange[0]} - ${priceRange[1]}
      </p>
      <Slider
        min={0}
        max={1000}
        step={1}
        value={priceRange}
        onValueChange={(newRange) =>
          setPriceRange(newRange as [number, number])
        }
      />
    </div>
  );
}
