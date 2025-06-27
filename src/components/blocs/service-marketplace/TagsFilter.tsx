interface TagsFilterProps {
  allTags: string[];
  selectedTags: string[];
  toggleTag: (tag: string) => void;
}

const TagsFilter = ({ allTags, selectedTags, toggleTag }: TagsFilterProps) => (
  <div className="flex flex-wrap gap-2">
    {allTags.map((tag) => (
      <button
        key={tag}
        onClick={() => toggleTag(tag)}
        className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
          selectedTags.includes(tag)
            ? "bg-green-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        {tag}
      </button>
    ))}
  </div>
);
export default TagsFilter;
