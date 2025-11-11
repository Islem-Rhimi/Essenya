import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import type { Evenement, Reservation } from "@prisma/client";
import { DeleteReservationModal } from "./DeleteReservationModal";

interface ReservationTableRowProps {
  reservation: Reservation & {
    evenement: Evenement;
  };
}

export function ReservationTableRow({ reservation }: ReservationTableRowProps) {
  return (
    <TableRow className="transition-colors hover:bg-gray-50/50">
      <TableCell className="pl-8">
        <div className="flex items-center gap-3">
          {reservation.evenement.image ? (
            <Image
              src={reservation.evenement.image}
              alt={reservation.evenement.title}
              width={48}
              height={48}
              className="h-12 w-12 rounded-lg object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-lg border-2 border-dashed border-gray-300 bg-gray-200" />
          )}
          <span className="font-medium text-gray-900 dark:text-amber-100">
            {reservation.evenement.title}
          </span>
        </div>
      </TableCell>

      <TableCell className="flex-col justify-center">
        <span className="text-gray-700 dark:text-white">
          {reservation.evenement.date
            ? new Date(reservation.evenement.date).toLocaleString("fr-FR", {
                dateStyle: "medium",
                timeStyle: "short",
              })
            : "—"}
        </span>
      </TableCell>
      <TableCell className="flex-col justify-center">
        <span className="text-gray-700 dark:text-white">
          {reservation.evenement.localisation}
        </span>
      </TableCell>

      <TableCell>
        <Badge
          variant="secondary"
          className={
            reservation.statut === "En attente"
              ? "bg-gray-100 text-gray-700"
              : reservation.statut === "Accepté"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-700"
          }
        >
          {reservation.statut}
        </Badge>
      </TableCell>
      <TableCell className="flex-col justify-center">
        <span className="text-gray-700 dark:text-white">
          {reservation.evenement.description}
        </span>
      </TableCell>

      <TableCell className="flex justify-center">
        <div className="flex gap-2">
          <DeleteReservationModal
            reservationId={reservation.id}
            reservationTitre={reservation.evenement.title}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
