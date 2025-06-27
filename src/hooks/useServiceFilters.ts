import { useState, useMemo } from "react";
import type {
  Service,
  ServiceFilters,
} from "~/components/blocs/service-management/service";

export function useServiceFilters(services: Service[]) {
  const [filters, setFilters] = useState<ServiceFilters>({
    searchTerm: "",
    selectedCategory: "all",
    activeFilters: [],
  });

  const filteredservices = useMemo(() => {
    return services.filter((service) => {
      // Search filter
      const searchMatch =
        service.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        service.farmer
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        service.location
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase());

      // Category filter (you can implement this based on your service categories)
      const categoryMatch = filters.selectedCategory === "all" || true; // Implement your category logic

      // Tag filter
      const tagMatch =
        filters.activeFilters.length === 0 ||
        filters.activeFilters.some((filter) =>
          service.tags.some(
            (tag) => tag.toLowerCase() === filter.toLowerCase(),
          ),
        );

      return searchMatch && categoryMatch && tagMatch;
    });
  }, [services, filters]);

  const updateFilters = (newFilters: Partial<ServiceFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return {
    filters,
    filteredservices,
    updateFilters,
  };
}
