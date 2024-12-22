import React from 'react';
import { Category } from '../../utils/content/categories/types';
import { Card } from '../ui/Card';

interface CategoryListProps {
  categories: Category[];
  onSelect: (category: Category) => void;
  selectedId?: string;
}

export function CategoryList({ categories, onSelect, selectedId }: CategoryListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Content Categories
      </h2>
      <div className="grid gap-4">
        {categories.map((category) => (
          <Card
            key={category.id}
            hover
            className={`cursor-pointer ${
              selectedId === category.id
                ? 'ring-2 ring-blue-500 dark:ring-blue-400'
                : ''
            }`}
            onClick={() => onSelect(category)}
          >
            <div className="p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {category.name}
              </h3>
              {category.description && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {category.description}
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}