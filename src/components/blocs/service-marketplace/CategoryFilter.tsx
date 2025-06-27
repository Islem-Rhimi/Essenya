import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  label?: string;
}

const CategoryFilter = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  label = "Filter by category",
}: CategoryFilterProps) => (
  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
    <SelectTrigger className="w-full sm:w-auto">
      <SelectValue placeholder="Select category" />
    </SelectTrigger>
    <SelectContent>
      {categories.map((category) => (
        <SelectItem key={category} value={category}>
          {category}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

export default CategoryFilter;
