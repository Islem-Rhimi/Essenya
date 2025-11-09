import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { Services } from "@prisma/client";
import { EditServiceModal } from "./EditServiceModal";
import { DeleteServiceModal } from "./DeleteServiceModal";

interface ServiceTableRowProps {
  service: Services;
}

export function ServiceTableRow({ service }: ServiceTableRowProps) {
  const [editOpen, setEditOpen] = useState(false);
  return (
    <TableRow className="transition-colors hover:bg-gray-50/50">
      {/* Image + Name */}
      <TableCell className="pl-8">
        <div className="flex items-center gap-3">
          {service.imageUrl ? (
            <Image
              src={service.imageUrl}
              alt={service.nom}
              width={48}
              height={48}
              className="h-12 w-12 rounded-lg object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-lg border-2 border-dashed border-gray-300 bg-gray-200" />
          )}
          <span className="font-medium text-gray-900 dark:text-amber-100">
            {service.nom}
          </span>
        </div>
      </TableCell>

      {/* Price */}
      <TableCell>
        <div className="font-semibold text-green-600">
          {service.prix}
          <span className="ml-1 font-normal text-gray-500">/ par heure</span>
        </div>
      </TableCell>

      {/* Tags */}
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {service.types.map((type) => (
            <Badge key={type} variant="secondary" className="text-xs">
              {type}
            </Badge>
          ))}
        </div>
      </TableCell>

      <TableCell>
        <div className="font-medium text-gray-900 dark:text-amber-100">
          {service.description}
        </div>
      </TableCell>

      {/* Actions */}
      <TableCell className="flex justify-center">
        <div className="flex gap-2">
          <Button
            className="flex items-center space-x-2 border border-blue-500/30 bg-white text-blue-500 transition hover:bg-blue-500/10 dark:bg-transparent"
            variant="ghost"
            size="icon"
            onClick={() => setEditOpen(true)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <EditServiceModal
            open={editOpen}
            onOpenChange={setEditOpen}
            service={service}
          />

          <DeleteServiceModal
            serviceId={service.id}
            serviceName={service.nom}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
