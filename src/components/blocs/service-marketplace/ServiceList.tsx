import React, { useMemo } from "react";
import { Card } from "~/components/ui/card";
import ServiceCard from "./ServiceCard";
import { TemplatePagination } from "~/common/components/pagination/components/template-pagination";
import { usePagination } from "~/common/components/pagination/hooks/use-pagination";
import { api } from "~/utils/api";

interface ServiceListProps {
  searchQuery: string;
  selectedTags: string[];
  selectedCategory: string;
}

export const ServiceList: React.FC<ServiceListProps> = ({
  searchQuery,
  selectedTags,
  selectedCategory,
}) => {
  const { paginationStates, paginationSetStates } = usePagination();
  const { data, isLoading, error } = api.services.list.useQuery({
    page: paginationStates.currentPage,
    pageSize: paginationStates.itemsPerPage,
    search: searchQuery,
  });
  // React.useEffect(() => {
  //   if (searchQuery) {
  //     paginationSetStates.setCurrentPage(1);
  //   }
  // }, [searchQuery, paginationSetStates]);

  // if (isLoading)
  //   return (
  //     <Card className="p-8 text-center">
  //       <p className="text-[var(--accent-gold)]">Loading products…</p>
  //     </Card>
  //   );

  // if (error)
  //   return (
  //     <Card className="p-8 text-center text-red-500">
  //       Error: {error.message}
  //     </Card>
  //   );

  const services = data?.data ?? [];
  const meta = data?.meta;

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesSearch = service.nom
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All Services" ||
        service.types?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => service.tags.includes(tag));
      return matchesSearch && matchesCategory && matchesTags;
    });
  }, [services, searchQuery, selectedCategory, selectedTags]); // Added 'services' here!

  return (
    <>
      <Card className="mb-6 p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </Card>
      {meta && <TemplatePagination meta={meta} />}
    </>
  );
};
