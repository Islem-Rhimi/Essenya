interface ServiceCardProps {
  service: {
    id: number;
    title: string;
    description: string;
    provider: string;
    location: string;
    price: string;
    rating: number;
    reviews: number;
    category: string;
    tags: string[];
    image: string;
    availability: string;
    responseTime: string;
  };
}

const ServiceCard = ({ service }: ServiceCardProps) => (
  <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
    <div className="relative h-48 overflow-hidden">
      <img
        src={service.image}
        alt={service.title}
        className="h-full w-full object-cover"
      />
    </div>
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
      <p className="mb-3 line-clamp-2 text-sm text-gray-600">
        {service.description}
      </p>
    </div>
    <div className="flex gap-2 p-4">
      <button className="flex-1 rounded-md bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700">
        Contact Provider
      </button>
      <button className="rounded-md border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50">
        Save
      </button>
    </div>
  </div>
);
export default ServiceCard;
