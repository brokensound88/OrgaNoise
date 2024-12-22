import React from 'react';
import { BlogCategory } from '../../types/blog';

interface BlogCategoriesProps {
  categories: BlogCategory[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export function BlogCategories({
  categories,
  selectedCategory,
  onSelectCategory,
}: BlogCategoriesProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Categories</h2>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectCategory(null)}
          className={`px-3 py-1 rounded-full text-sm ${
            !selectedCategory
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.slug}
            onClick={() => onSelectCategory(category.slug)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedCategory === category.slug
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>
    </div>
  );
}