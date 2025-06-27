import { useState, useMemo } from "react";
import type {
  Event,
  EventFilters,
} from "~/components/blocs/event-management/event";

export function useEventFilters(Events: Event[]) {
  const [filters, setFilters] = useState<EventFilters>({
    searchTerm: "",
    selectedCategory: "all",
    activeFilters: [],
  });

  const filteredEvents = useMemo(() => {
    return Events.filter((Event) => {
      // Search filter
      const searchMatch =
        Event.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        Event.farmer.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        Event.location.toLowerCase().includes(filters.searchTerm.toLowerCase());

      // Category filter (you can implement this based on your Event categories)
      const categoryMatch = filters.selectedCategory === "all" || true; // Implement your category logic

      // Tag filter
      const tagMatch =
        filters.activeFilters.length === 0 ||
        filters.activeFilters.some((filter) =>
          Event.tags.some((tag) => tag.toLowerCase() === filter.toLowerCase()),
        );

      return searchMatch && categoryMatch && tagMatch;
    });
  }, [Events, filters]);

  const updateFilters = (newFilters: Partial<EventFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return {
    filters,
    filteredEvents,
    updateFilters,
  };
}
