interface EventStatsProps {
  totalEvents: number;
  filteredEvents: number;
}

export function EventStats({ totalEvents, filteredEvents }: EventStatsProps) {
  return (
    <div className="mb-4">
      <p className="text-sm text-gray-600">
        Showing {filteredEvents} of {totalEvents} Events
      </p>
    </div>
  );
}
