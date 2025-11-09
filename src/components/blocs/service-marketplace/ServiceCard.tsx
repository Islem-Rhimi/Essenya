import type { Services } from "@prisma/client";
import { Badge } from "~/components/ui/badge";

interface ServiceCardProps {
  service: Services;
}

const ServiceCard = ({ service }: ServiceCardProps) => (
  <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
    <div className="relative h-48 overflow-hidden">
      <img
        src={service.imageUrl ?? ""}
        alt={service.nom}
        className="h-full w-full object-cover"
      />
    </div>
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-900">{service.nom}</h3>
      <p className="mb-3 line-clamp-2 text-sm text-gray-600">
        {service.description}
      </p>
      <div className="flex flex-wrap gap-1">
        {service.tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="bg-gray-100 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
    <div className="flex gap-2 p-4">
      <button className="flex-1 rounded-md bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700">
        Contact Provider
      </button>
    </div>
  </div>
);
export default ServiceCard;
