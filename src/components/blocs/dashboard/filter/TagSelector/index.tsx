"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import TagBadge from "./TagBadge";
import DropdownMenu from "./DropdownMenu";

const predefinedOptions = ["Fruits", "Vegetables", "Dairy", "Organic", "Local"];

export default function TagSelector({
  selectedTags,
  setSelectedTags,
}: {
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
}) {
  const [inputValue, setInputValue] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const addTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setInputValue("");
    setDropdownOpen(false);
  };

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  return (
    <div className="relative space-y-2">
      {/* Tags + Input + Toggle */}
      <div className="focus-within:ring-primary flex flex-wrap items-center gap-2 rounded-lg border px-2 py-1 focus-within:ring-2">
        {selectedTags.map((tag) => (
          <TagBadge key={tag} tag={tag} onRemove={() => removeTag(tag)} />
        ))}

        <Input
          className="min-w-[100px] flex-1 border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Search or add tag"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setDropdownOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && inputValue.trim()) {
              e.preventDefault();
              addTag(inputValue.trim());
            }
          }}
        />

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          type="button"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <DropdownMenu
          options={predefinedOptions}
          inputValue={inputValue}
          selectedTags={selectedTags}
          onSelect={addTag}
        />
      )}
    </div>
  );
}
