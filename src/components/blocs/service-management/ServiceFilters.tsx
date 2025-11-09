import { Input } from "@/components/ui/input";
interface ServiceFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const ServiceFilters: React.FC<ServiceFiltersProps> = ({
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <>
      <div className="space-y-4">
        {/* Search and Category Filter */}
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search products, farmers, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10"
            />
          </div>
        </div>
      </div>
    </>
  );
};
