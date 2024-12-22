import React, { useState } from 'react';
import { ContentSearchOptions } from '../../utils/content/types';
import { Input } from '../ui/form/Input';
import { Button } from '../ui/Button';

interface ContentSearchProps {
  onSearch: (options: ContentSearchOptions) => void;
}

export function ContentSearch({ onSearch }: ContentSearchProps) {
  const [options, setOptions] = useState<ContentSearchOptions>({
    query: '',
    type: undefined,
    status: undefined,
    tags: []
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(options);
  };

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div>
        <Input
          type="text"
          placeholder="Search content..."
          value={options.query || ''}
          onChange={(e) => setOptions({ ...options, query: e.target.value })}
        />
      </div>
      <div className="flex gap-4">
        <select
          className="form-select"
          value={options.type || ''}
          onChange={(e) => setOptions({ ...options, type: e.target.value || undefined })}
        >
          <option value="">All Types</option>
          <option value="page">Pages</option>
          <option value="post">Posts</option>
          <option value="product">Products</option>
        </select>
        <select
          className="form-select"
          value={options.status || ''}
          onChange={(e) => setOptions({ ...options, status: e.target.value || undefined })}
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="published">Published</option>
        </select>
      </div>
      <Button type="submit" variant="primary">
        Search
      </Button>
    </form>
  );
}