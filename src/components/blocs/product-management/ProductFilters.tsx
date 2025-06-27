import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProductFilters as ProductFiltersType } from "./product";

interface ProductFiltersProps {
  filters: ProductFiltersType;
  onFiltersChange: (filters: Partial<ProductFiltersType>) => void;
  filterTags: string[];
}

export function ProductFilters({
  filters,
  onFiltersChange,
  filterTags,
}: ProductFiltersProps) {
  const handleTagFilter = (tag: string) => {
    const newActiveFilters = filters.activeFilters.includes(tag)
      ? filters.activeFilters.filter((t) => t !== tag)
      : [...filters.activeFilters, tag];

    onFiltersChange({ activeFilters: newActiveFilters });
  };

  return (
    <>
      <div className="space-y-4">
        {/* Search and Category Filter */}
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search products, farmers, or locations..."
              value={filters.searchTerm}
              onChange={(e) => onFiltersChange({ searchTerm: e.target.value })}
              className="h-10"
            />
          </div>
          <div className="flex justify-end">
            <Select
              value={filters.selectedCategory}
              onValueChange={(value) =>
                onFiltersChange({ selectedCategory: value })
              }
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="All Products" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="vegetables">Vegetables</SelectItem>
                <SelectItem value="fruits">Fruits</SelectItem>
                <SelectItem value="grains">Grains</SelectItem>
                <SelectItem value="dairy">Dairy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tag Filters */}
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Filter by tags:</p>
          <div className="flex flex-wrap gap-2">
            {filterTags.map((tag) => (
              <Button
                key={tag}
                variant={
                  filters.activeFilters.includes(tag) ? "default" : "outline"
                }
                size="sm"
                onClick={() => handleTagFilter(tag)}
                className="h-8 rounded-full"
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
