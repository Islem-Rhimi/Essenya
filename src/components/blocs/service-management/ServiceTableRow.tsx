import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Star } from "lucide-react";
import type { Service } from "./service";
import Image from "next/image";

interface ServiceTableRowProps {
  service: Service;
  onEdit: (serviceId: number) => void;
  onDelete: (serviceId: number) => void;
}

export function ServiceTableRow({
  service,
  onEdit,
  onDelete,
}: ServiceTableRowProps) {
  return (
    <TableRow className="hover:bg-gray-50/50">
      <TableCell>
        <div className="flex items-center gap-3">
          <Image
            src={service.image}
            alt={service.name}
            width={50}
            height={50}
            className="h-12 w-12 rounded-lg bg-gray-100 object-cover"
          />
          <span className="font-medium text-gray-900">{service.name}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="font-semibold text-green-600">
          {service.price}
          <span className="ml-1 font-normal text-gray-500">{service.unit}</span>
        </div>
      </TableCell>
      <TableCell>
        <span className="text-gray-900">{service.farmer}</span>
      </TableCell>
      <TableCell>
        <span className="text-gray-700">{service.location}</span>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{service.rating}</span>
          <span className="text-sm text-gray-500">({service.ratingCount})</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap items-center gap-1">
          {service.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              {tag}
            </Badge>
          ))}
          {service.additionalTags > 0 && (
            <span className="text-sm text-gray-500">
              +{service.additionalTags}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge
          className={`${service.statusColor} text-white hover:${service.statusColor}/90`}
        >
          {service.status}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(service.id)}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <Edit className="h-4 w-4 text-gray-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(service.id)}
            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
