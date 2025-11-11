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
import React from "react";
import { ReservationTableRow } from "./ReservationTableRow";


export default function ReservationTable() {
  const { status } = useSession();
  const { paginationStates } = usePagination();

  const { data, isLoading, error } = api.reservation.myBookings.useQuery(
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

  const reservations = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="flex-col space-y-6">
      <Card className="overflow-auto rounded-xl border border-[rgba(212,175,55,0.3)] p-0 shadow backdrop-blur">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-3 pl-8">Événement</TableHead>
              <TableHead className="px-4 py-3">Date & Heure</TableHead>
              <TableHead className="px-4 py-3">Localisation</TableHead>
              <TableHead className="px-4 py-3">Statut</TableHead>
              <TableHead className="px-4 py-3">Description</TableHead>
              <TableHead className="flex justify-center px-4 py-3">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {reservations.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-12 text-center text-gray-500"
                >
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              reservations.map((reservation) => (
                <ReservationTableRow
                  key={reservation.id}
                  reservation={reservation}
                />
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
