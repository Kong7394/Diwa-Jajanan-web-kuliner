import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <Search className="w-5 h-5" />
      </div>
      <input
        type="text"
        id="menu-search-input"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Cari jajanan favoritmu..."
        className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white border border-[#E6DCCF] text-[#2D1B08] text-sm font-medium placeholder-[#8C7B6B] focus:outline-hidden focus:border-[#FF6321] focus:ring-2 focus:ring-[#FF6321]/20 shadow-xs transition-all"
      />
      {searchQuery && (
        <button
          onClick={() => onSearchChange('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
