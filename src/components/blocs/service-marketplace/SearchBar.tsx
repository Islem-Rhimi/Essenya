interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar = ({ searchQuery, setSearchQuery }: SearchBarProps) => (
  <input
    type="text"
    placeholder="Search services, providers, or locations..."
    className="h-10 w-full rounded-lg border border-gray-300 p-2 focus:border-transparent focus:ring-2 focus:ring-green-500"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />
);
export default SearchBar;
