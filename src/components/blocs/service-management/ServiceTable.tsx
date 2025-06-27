import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import type { Service } from "./service";
import { ServiceTableRow } from "./ServiceTableRow";

interface ServiceTableProps {
  services: Service[];
  onEdit: (serviceId: number) => void;
  onDelete: (serviceId: number) => void;
}

export function ServiceTable({
  services,
  onEdit,
  onDelete,
}: ServiceTableProps) {
  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow className="border-b">
            <TableHead className="font-medium text-gray-600">
              service Name
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
          {services.map((service) => (
            <ServiceTableRow
              key={service.id}
              service={service}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
