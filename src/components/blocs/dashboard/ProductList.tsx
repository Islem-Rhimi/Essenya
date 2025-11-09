import React from "react";
import ProductCard from "./ProductCard";
import { useSession } from "next-auth/react";
import { usePagination } from "~/common/components/pagination/hooks/use-pagination";
import { Card } from "~/components/ui/card";
import { api } from "~/utils/api";
import { TemplatePagination } from "~/common/components/pagination/components/template-pagination";

interface ProductListProps {
  searchValue: string;
}

export const ProductList: React.FC<ProductListProps> = ({ searchValue }) => {
  const { status } = useSession();
  const { paginationStates, paginationSetStates } = usePagination();

  const { data, isLoading, error } = api.produits.getMyProducts.useQuery(
    {
      page: paginationStates.currentPage,
      pageSize: paginationStates.itemsPerPage,
      search: searchValue,
    },
    {
      enabled: status === "authenticated",
      refetchOnWindowFocus: false,
    },
  );

  // Reset to page 1 on search
  React.useEffect(() => {
    if (searchValue) {
      paginationSetStates.setCurrentPage(1);
    }
  }, [searchValue, paginationSetStates]);

  if (status === "loading") return <div>Loading session…</div>;
  if (status === "unauthenticated")
    return <div>Please sign in to view your products</div>;

  if (isLoading)
    return (
      <Card className="p-8 text-center">
        <p className="text-[var(--accent-gold)]">Loading products…</p>
      </Card>
    );

  if (error)
    return (
      <Card className="p-8 text-center text-red-500">
        Error: {error.message}
      </Card>
    );

  const products = data?.data ?? [];
  const meta = data?.meta;

  return (
    <section className="backdrop- rounded-2xl">
      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground p-4 text-center">
          No products found. Adjust your filters.
        </div>
      )}
      {meta && <TemplatePagination meta={meta} />}
    </section>
  );
};
