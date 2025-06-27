import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import type { Event } from "./event";
import { EventTableRow } from "./EventTableRow";

interface EventTableProps {
  Events: Event[];
  onEdit: (EventId: number) => void;
  onDelete: (EventId: number) => void;
}

export function EventTable({ Events, onEdit, onDelete }: EventTableProps) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow className="border-b">
            <TableHead className="font-medium text-gray-600">
              Event Name
            </TableHead>
            <TableHead className="font-medium text-gray-600">Price</TableHead>
            <TableHead className="font-medium text-gray-600">Farmer</TableHead>
            <TableHead className="font-medium text-gray-600">
              Location
            </TableHead>
            <TableHead className="font-medium text-gray-600">Rating</TableHead>
            <TableHead className="font-medium text-gray-600">Tags</TableHead>
            <TableHead className="font-medium text-gray-600">Status</TableHead>
            <TableHead className="font-medium text-gray-600">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Events.map((Event) => (
            <EventTableRow
              key={Event.id}
              Event={Event}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
