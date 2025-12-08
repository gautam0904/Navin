import { useState } from 'react';
import { Search, X, Filter } from 'lucide-react';
import type { FileStatus } from '@/types/git';

type FilterType = 'all' | 'modified' | 'added' | 'deleted' | 'staged' | 'unstaged';

interface FileSearchFilterProps {
  files: FileStatus[];
  onFilterChange: (filtered: FileStatus[]) => void;
  filterType?: FilterType;
  onFilterTypeChange?: (type: FilterType) => void;
}

export function FileSearchFilter({
  files,
  onFilterChange,
  filterType = 'all',
  onFilterTypeChange,
}: FileSearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>(filterType);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, activeFilter);
  };

  const handleFilterChange = (type: FilterType) => {
    setActiveFilter(type);
    onFilterTypeChange?.(type);
    applyFilters(searchQuery, type);
  };

  const applyFilters = (query: string, filter: FilterType) => {
    let filtered = [...files];

    // Apply search filter
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (file) =>
          file.path.toLowerCase().includes(lowerQuery) ||
          file.path.split('/').pop()?.toLowerCase().includes(lowerQuery)
      );
    }

    // Apply type filter
    if (filter !== 'all') {
      filtered = filtered.filter((file) => {
        const status = file.status;
        if (typeof status === 'object' && status !== null) {
          switch (filter) {
            case 'modified':
              return 'Modified' in status;
            case 'added':
              return 'Added' in status || 'Untracked' in status;
            case 'deleted':
              return 'Deleted' in status;
            default:
              return true;
          }
        }
        return true;
      });
    }

    onFilterChange(filtered);
  };

  const filterButtons: { type: FilterType; label: string }[] = [
    { type: 'all', label: 'All' },
    { type: 'modified', label: 'Modified' },
    { type: 'added', label: 'Added' },
    { type: 'deleted', label: 'Deleted' },
  ];

  return (
    <div className="px-3 py-2 border-b border-[--git-panel-border] bg-[--git-panel-header] space-y-2">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[--color-text-tertiary]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Filter files..."
          className="w-full pl-8 pr-8 py-1.5 text-xs rounded-md border border-[--git-panel-border] bg-[--color-bg-primary] text-[--color-text-primary] focus:outline-none focus:ring-1 focus:ring-[--color-primary]"
        />
        {searchQuery && (
          <button
            onClick={() => handleSearchChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-[--color-bg-surface-2] rounded"
          >
            <X className="w-3 h-3 text-[--color-text-tertiary]" />
          </button>
        )}
      </div>
      <div className="flex items-center gap-1">
        <Filter className="w-3 h-3 text-[--color-text-tertiary] mr-1" />
        {filterButtons.map(({ type, label }) => (
          <button
            key={type}
            onClick={() => handleFilterChange(type)}
            className={`
              px-2 py-0.5 text-[10px] font-medium rounded transition-colors
              ${
                activeFilter === type
                  ? 'bg-[--color-primary] text-white'
                  : 'bg-[--color-bg-surface-2] text-[--color-text-secondary] hover:bg-[--color-bg-surface-3] hover:text-[--color-text-primary]'
              }
            `}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
