import { useState, useEffect } from 'react';
import { ContentItem, ContentTemplate, ContentSearchOptions } from '../utils/content/types';
import { contentManager } from '../utils/content/manager';

export function useContent() {
  const [searchResults, setSearchResults] = useState<ContentItem[]>([]);
  const [templates, setTemplates] = useState<ContentTemplate[]>([]);

  useEffect(() => {
    setTemplates(contentManager.listTemplates());
  }, []);

  const createContent = (item: Omit<ContentItem, 'versions' | 'createdAt' | 'updatedAt'>) => {
    return contentManager.createContent(item);
  };

  const updateContent = (id: string, updates: Partial<ContentItem>) => {
    return contentManager.updateContent(id, updates);
  };

  const scheduleContent = (id: string, publishAt: number) => {
    return contentManager.scheduleContent(id, publishAt);
  };

  const searchContent = (options: ContentSearchOptions) => {
    const results = contentManager.searchContent(options);
    setSearchResults(results);
    return results;
  };

  const createTemplate = (template: ContentTemplate) => {
    contentManager.createTemplate(template);
    setTemplates(contentManager.listTemplates());
  };

  return {
    searchResults,
    templates,
    createContent,
    updateContent,
    scheduleContent,
    searchContent,
    createTemplate
  };
}