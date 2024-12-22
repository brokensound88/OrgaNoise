import React, { useState } from 'react';
import { useContentCategories } from '../../hooks/useContentCategories';
import { CategoryList } from './CategoryList';
import { CategoryAnalytics } from './CategoryAnalytics';
import { ContentSearch } from './ContentSearch';
import { Section } from '../ui/Section';

export function ContentDashboard() {
  const { categories, getCategoryAnalytics } = useContentCategories();
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id);

  return (
    <Section className="py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <CategoryList
            categories={categories}
            selectedId={selectedCategory}
            onSelect={(category) => setSelectedCategory(category.id)}
          />
          <div className="mt-8">
            <ContentSearch
              onSearch={(options) => {
                console.log('Search options:', options);
                // Implement search functionality
              }}
            />
          </div>
        </div>
        <div className="lg:col-span-2">
          {selectedCategory && (
            <CategoryAnalytics
              analytics={getCategoryAnalytics(selectedCategory)}
            />
          )}
        </div>
      </div>
    </Section>
  );
}