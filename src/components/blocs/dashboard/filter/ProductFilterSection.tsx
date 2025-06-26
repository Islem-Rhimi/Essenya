"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const predefinedOptions = ["Fruits", "Vegetables", "Dairy", "Organic", "Local"];

interface ProductFilterBarProps {
  onFilter: (filters: any) => void;
}

export default function ProductFilterBar({ onFilter }: ProductFilterBarProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [inputValue, setInputValue] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setInputValue("");
    setDropdownOpen(false);
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleApplyFilters = () => {
    onFilter({ tags, priceMin: priceRange[0], priceMax: priceRange[1] });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Tags Filter */}
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-sm font-medium">
          Filters:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <div
              key={tag}
              className="bg-primary text-primary-foreground flex items-center rounded-md pl-3 text-sm"
            >
              {tag}
              <Button
                onClick={() => removeTag(tag)}
                className="hover:bg-primary-foreground/20 rounded-md"
              >
                <X className="h-2 w-2" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Tags Popover */}
      <Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="default">
            Add Filter <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64" align="start">
          <div className="space-y-3">
            <div>
              <Input
                placeholder="Search or add tag"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && inputValue.trim()) {
                    e.preventDefault();
                    addTag(inputValue.trim());
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Quick Select:</p>
              <div className="flex flex-wrap gap-2">
                {predefinedOptions
                  .filter((option) => !tags.includes(option))
                  .map((option) => (
                    <Button
                      key={option}
                      variant="outline"
                      size="sm"
                      onClick={() => addTag(option)}
                    >
                      {option}
                    </Button>
                  ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Price Range Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="default">
            Price: ${priceRange[0]} - ${priceRange[1]}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium">Price Range</p>
              <p className="text-muted-foreground mb-3 text-sm">
                ${priceRange[0]} - ${priceRange[1]}
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
          </div>
        </PopoverContent>
      </Popover>

      {/* Apply Filters Button */}
      {(tags.length > 0 || priceRange[0] > 0 || priceRange[1] < 100) && (
        <Button onClick={handleApplyFilters} size="default">
          Apply Filters
        </Button>
      )}

      {/* Clear All Button */}
      {(tags.length > 0 || priceRange[0] > 0 || priceRange[1] < 100) && (
        <Button
          variant="outline"
          size="default"
          onClick={() => {
            setTags([]);
            setPriceRange([0, 100]);
            onFilter({ tags: [], priceMin: 0, priceMax: 100 });
          }}
        >
          Clear All
        </Button>
      )}
    </div>
  );
}
