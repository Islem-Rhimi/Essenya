import { useState, useMemo } from "react";
import type {
  Product,
  ProductFilters,
} from "~/components/blocs/product-management/product";

export function useProductFilters(products: Product[]) {
  const [filters, setFilters] = useState<ProductFilters>({
    searchTerm: "",
    selectedCategory: "all",
    activeFilters: [],
  });

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search filter
      const searchMatch =
        product.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        product.farmer
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        product.location
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase());

      // Category filter (you can implement this based on your product categories)
      const categoryMatch = filters.selectedCategory === "all" || true; // Implement your category logic

      // Tag filter
      const tagMatch =
        filters.activeFilters.length === 0 ||
        filters.activeFilters.some((filter) =>
          product.tags.some(
            (tag) => tag.toLowerCase() === filter.toLowerCase(),
          ),
        );

      return searchMatch && categoryMatch && tagMatch;
    });
  }, [products, filters]);

  const updateFilters = (newFilters: Partial<ProductFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return {
    filters,
    filteredProducts,
    updateFilters,
  };
}
