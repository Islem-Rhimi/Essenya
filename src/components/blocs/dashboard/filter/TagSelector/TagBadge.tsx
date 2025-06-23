"use client";

import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function TagBadge({
  tag,
  onRemove,
}: {
  tag: string;
  onRemove: () => void;
}) {
  return (
    <Badge className="bg-primary flex items-center gap-1 text-white">
      {tag}
      <Button
        variant="ghost"
        size="icon"
        className="ml-1 h-3 w-3 p-0 text-white hover:bg-transparent"
        onClick={onRemove}
      >
        <X className="h-3 w-3" />
      </Button>
    </Badge>
  );
}
