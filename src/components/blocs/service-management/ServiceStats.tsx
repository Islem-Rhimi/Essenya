interface ServiceStatsProps {
  totalservices: number;
  filteredservices: number;
}

export function ServiceStats({
  totalservices,
  filteredservices,
}: ServiceStatsProps) {
  return (
    <div className="mb-4">
      <p className="text-sm text-gray-600">
        Showing {filteredservices} of {totalservices} services
      </p>
    </div>
  );
}
