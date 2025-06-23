"use client";

import { useState } from "react";
import TagSelector from "./TagSelector";
import PriceSlider from "./PriceSlider";
import { Button } from "@/components/ui/button";

export default function ProductFilterSection({
  onFilter,
}: {
  onFilter: (filters: any) => void;
}) {
  const [tags, setTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);

  return (
    <div className="space-y-4">
      <TagSelector selectedTags={tags} setSelectedTags={setTags} />
      <PriceSlider priceRange={priceRange} setPriceRange={setPriceRange} />
      <Button
        className="w-full"
        onClick={() =>
          onFilter({ tags, priceMin: priceRange[0], priceMax: priceRange[1] })
        }
      >
        Apply Filters
      </Button>
    </div>
  );
}
