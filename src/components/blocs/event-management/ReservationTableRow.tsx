import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import type { Reservation, User } from "@prisma/client";
import { EditRecivedReservationModal } from "./EditRecivedReservationModal";

interface RecivedReservationTableRowProps {
  reservation: Reservation & {
    user: User;
  };
}

export function RecivedReservationTableRow({
  reservation,
}: RecivedReservationTableRowProps) {
  return (
    <TableRow className="transition-colors hover:bg-gray-50/50">
      <TableCell className="pl-8">
        <div className="flex items-center gap-3">
          {reservation.user.image ? (
            <Image
              src={reservation.user.image}
              alt={reservation.user.name ?? ""}
              width={48}
              height={48}
              className="h-12 w-12 rounded-lg object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-lg border-2 border-dashed border-gray-300 bg-gray-200" />
          )}
          <span className="font-medium text-gray-900 dark:text-amber-100">
            {reservation.user.name}
          </span>
        </div>
      </TableCell>

      <TableCell className="flex-col items-center justify-center">
        <span className="flex text-center text-gray-700 dark:text-white">
          +(216) {reservation.user.numTel ?? "---"}
        </span>
      </TableCell>

      <TableCell className="flex-col justify-center">
        <span className="text-gray-700 dark:text-white">
          {reservation.user.email}
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
      <TableCell className="flex justify-center">
        <div className="flex gap-2">
          <EditRecivedReservationModal
            reservationId={reservation.id}
            reservationTitre={reservation.user.name ?? ""}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
