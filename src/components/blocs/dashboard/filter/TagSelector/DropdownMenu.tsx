"use client";

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export default function DropdownMenu({
  options,
  inputValue,
  selectedTags,
  onSelect,
}: {
  options: string[];
  inputValue: string;
  selectedTags: string[];
  onSelect: (tag: string) => void;
}) {
  const filteredOptions = options.filter(
    (opt) =>
      opt.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedTags.includes(opt),
  );

  return (
    <Command className="bg-background absolute top-full z-50 mt-1 h-auto w-full overflow-visible rounded-md border shadow-md">
      <CommandList className="max-h-48 overflow-auto p-1">
        {filteredOptions.length ? (
          filteredOptions.map((opt) => (
            <CommandItem
              key={opt}
              className="px-2 py-1"
              onSelect={() => onSelect(opt)}
            >
              {opt}
            </CommandItem>
          ))
        ) : (
          <div className="text-muted-foreground p-2">No matching tags</div>
        )}
      </CommandList>
    </Command>
  );
}
