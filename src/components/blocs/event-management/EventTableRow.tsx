import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Star } from "lucide-react";
import type { Event } from "./event";
import Image from "next/image";

interface EventTableRowProps {
  Event: Event;
  onEdit: (EventId: number) => void;
  onDelete: (EventId: number) => void;
}

export function EventTableRow({ Event, onEdit, onDelete }: EventTableRowProps) {
  return (
    <TableRow className="hover:bg-gray-50/50">
      <TableCell>
        <div className="flex items-center gap-3">
          <Image
            src={Event.image}
            alt={Event.name}
            width={50}
            height={50}
            className="h-12 w-12 rounded-lg bg-gray-100 object-cover"
          />
          <span className="font-medium text-gray-900">{Event.name}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="font-semibold text-green-600">
          {Event.price}
          <span className="ml-1 font-normal text-gray-500">{Event.unit}</span>
        </div>
      </TableCell>
      <TableCell>
        <span className="text-gray-900">{Event.farmer}</span>
      </TableCell>
      <TableCell>
        <span className="text-gray-700">{Event.location}</span>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{Event.rating}</span>
          <span className="text-sm text-gray-500">({Event.ratingCount})</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap items-center gap-1">
          {Event.tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              {tag}
            </Badge>
          ))}
          {Event.additionalTags > 0 && (
            <span className="text-sm text-gray-500">
              +{Event.additionalTags}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge
          className={`${Event.statusColor} text-white hover:${Event.statusColor}/90`}
        >
          {Event.status}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(Event.id)}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <Edit className="h-4 w-4 text-gray-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(Event.id)}
            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
