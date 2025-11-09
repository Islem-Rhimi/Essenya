import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { ProductTableRow } from "./ProductTableRow";
import { TemplatePagination } from "~/common/components/pagination/components/template-pagination";
import { useSession } from "next-auth/react";
import { usePagination } from "~/common/components/pagination/hooks/use-pagination";
import { api } from "~/utils/api";
import React from "react";

interface ProductTableProps {
  searchValue: string;
}

export const ProductTable: React.FC<ProductTableProps> = ({ searchValue }) => {
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
    <div className="flex-col space-y-6">
      <Card className="overflow-auto rounded-xl border border-[rgba(212,175,55,0.3)] p-0 shadow backdrop-blur">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-3 pl-8">Product</TableHead>
              <TableHead className="px-4 py-3">Price</TableHead>
              <TableHead className="px-4 py-3">Location</TableHead>
              <TableHead className="px-4 py-3">Tags</TableHead>
              <TableHead className="px-4 py-3">Status</TableHead>
              <TableHead className="flex justify-center px-4 py-3">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-12 text-center text-gray-500"
                >
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <ProductTableRow key={product.id} product={product} />
              ))
            )}
          </TableBody>
        </Table>
      </Card>
      <Card className="overflow-auto rounded-xl border border-[rgba(212,175,55,0.3)] p-0 shadow backdrop-blur">
        {meta && <TemplatePagination meta={meta} />}
      </Card>
    </div>
  );
};
