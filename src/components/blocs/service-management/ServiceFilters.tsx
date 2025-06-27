import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ServiceFilters as ServiceFiltersType } from "./service";

interface ServiceFiltersProps {
  filters: ServiceFiltersType;
  onFiltersChange: (filters: Partial<ServiceFiltersType>) => void;
  filterTags: string[];
}

export function ServiceFilters({
  filters,
  onFiltersChange,
  filterTags,
}: ServiceFiltersProps) {
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
              placeholder="Search services, farmers, or locations..."
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
                <SelectValue placeholder="All services" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All services</SelectItem>
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
