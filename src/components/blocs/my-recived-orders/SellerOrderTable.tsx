"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { TemplatePagination } from "~/common/components/pagination/components/template-pagination";
import { useSession } from "next-auth/react";
import { usePagination } from "~/common/components/pagination/hooks/use-pagination";
import { api } from "~/utils/api";
import SellerOrderTableRow from "./SellerOrderTableRow";

export default function SellerOrderTable() {
  const { status } = useSession();
  const { paginationStates } = usePagination();

  const { data, isLoading, error } = api.commande.vendeurOrders.useQuery(
    {
      page: paginationStates.currentPage,
      pageSize: paginationStates.itemsPerPage,
    },
    {
      enabled: status === "authenticated",
      refetchOnWindowFocus: false,
    },
  );

  if (status === "loading") return <div>Loading session…</div>;
  if (status === "unauthenticated")
    return <div>Please sign in to view your orders</div>;

  if (isLoading)
    return (
      <Card className="p-8 text-center">
        <p className="text-[var(--accent-gold)]">Loading received orders…</p>
      </Card>
    );

  if (error)
    return (
      <Card className="p-8 text-center text-red-500">
        Error: {error.message}
      </Card>
    );

  const orders = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="flex-col space-y-6">
      <Card className="overflow-auto rounded-xl border border-[rgba(212,175,55,0.3)] p-0 shadow backdrop-blur">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-3">Produit</TableHead>
              <TableHead className="px-4 py-3">Client</TableHead>
              <TableHead className="px-4 py-3">Date</TableHead>
              <TableHead className="px-4 py-3">Quantité</TableHead>
              <TableHead className="px-4 py-3">Montant</TableHead>
              <TableHead className="px-4 py-3">Statut</TableHead>
              <TableHead className="px-4 py-3">Notes</TableHead>
              <TableHead className="flex justify-center px-4 py-3">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-12 text-center text-gray-500"
                >
                  Aucun commande reçue
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <SellerOrderTableRow key={order.id} order={order} />
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
}
