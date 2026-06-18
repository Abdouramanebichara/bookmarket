import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import { useLocalization } from '../context/LocalizationContext';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterClick?: () => void;
  placeholder?: string;
  defaultValue?: string;
  showFilters?: boolean;
}

export function SearchBar({
  onSearch,
  onFilterClick,
  placeholder,
  defaultValue = '',
  showFilters = true,
}: SearchBarProps) {
  const { t, language } = useLocalization();
  const [query, setQuery] = useState(defaultValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder || t.searchPlaceholder}
          className="w-full pl-12 pr-12 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {showFilters && onFilterClick && (
        <button
          type="button"
          onClick={onFilterClick}
          className="px-4 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 flex items-center gap-2 border border-border"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="hidden sm:inline">{language === 'fr' ? 'Filtres' : 'Filters'}</span>
        </button>
      )}

      <button
        type="submit"
        className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium hidden md:block"
      >
        {language === 'fr' ? 'Rechercher' : 'Search'}
      </button>
    </form>
  );
}
