import React from "react";
import ProductCard from "./ProductCard";
import { useSession } from "next-auth/react";
import { usePagination } from "~/common/components/pagination/hooks/use-pagination";
import { Card } from "~/components/ui/card";
import { api } from "~/utils/api";
import { TemplatePagination } from "~/common/components/pagination/components/template-pagination";

interface ProductListProps {
  searchValue: string;
  tags: string[];
  priceMin: number;
  priceMax: number;
}

export const ProductList: React.FC<ProductListProps> = ({
  searchValue,
  tags,
  priceMin,
  priceMax,
}) => {
  const { status } = useSession();
  const { paginationStates, paginationSetStates } = usePagination();

  const { data, isLoading, error } = api.produits.getProducts.useQuery(
    {
      page: paginationStates.currentPage,
      pageSize: paginationStates.itemsPerPage,
      search: searchValue,
      tags: tags.length > 0 ? tags : undefined,
      priceMin: priceMin > 0 ? priceMin : undefined,
      priceMax: priceMax < 100 ? priceMax : undefined,
    },
    {
      enabled: status === "authenticated",
      refetchOnWindowFocus: false,
    },
  );

  // Reset to page 1 when filters change
  React.useEffect(() => {
    paginationSetStates.setCurrentPage(1);
  }, [searchValue, tags, priceMin, priceMax, paginationSetStates]);

  if (status === "loading") return <div>Chargement de la session...</div>;
  if (status === "unauthenticated")
    return <div>Veuillez vous connecter pour voir vos produits</div>;

  if (isLoading)
    return (
      <Card>
        <div className="flex items-center justify-center p-8">
          <div>Chargement des produits...</div>
        </div>
      </Card>
    );

  if (error)
    return (
      <Card>
        <div className="p-4 text-red-500">Erreur : {error.message}</div>
      </Card>
    );

  const products = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div>
      {products.length > 0 ? (
        <div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        </div>
      ) : (
        <Card>
          <div className="text-muted-foreground flex items-center justify-center p-8">
            No products found. Adjust your filters.
          </div>
        </Card>
      )}
      {meta && <TemplatePagination meta={meta} />}
    </div>
  );
};
