import React from 'react';
import { Category } from '../types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none touch-pan-x">
      {categories.map((category) => {
        const isSelected = selectedCategoryId === category.id;
        return (
          <button
            key={category.id}
            id={`category-chip-${category.id}`}
            onClick={() => onSelectCategory(category.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-2xl text-sm font-bold transition-all shadow-2xs active:scale-95 cursor-pointer ${
              isSelected
                ? 'bg-[#FF6321] text-white shadow-md shadow-[#FF6321]/25 ring-2 ring-[#FF6321]/30'
                : 'bg-white text-[#4A3728] hover:bg-[#FFF3E0] hover:text-[#FF6321] border border-[#E6DCCF]'
            }`}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
};
