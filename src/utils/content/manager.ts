import { ContentItem, ContentVersion, ContentTemplate, ContentSearchOptions } from './types';

export class ContentManager {
  private content: Map<string, ContentItem> = new Map();
  private templates: Map<string, ContentTemplate> = new Map();

  createContent(item: Omit<ContentItem, 'versions' | 'createdAt' | 'updatedAt'>): ContentItem {
    const newItem: ContentItem = {
      ...item,
      versions: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    this.content.set(item.id, newItem);
    return newItem;
  }

  updateContent(id: string, updates: Partial<ContentItem>): ContentItem {
    const item = this.content.get(id);
    if (!item) throw new Error(`Content ${id} not found`);

    const version: ContentVersion = {
      id: crypto.randomUUID(),
      content: item.content,
      author: item.author,
      timestamp: Date.now()
    };

    const updatedItem = {
      ...item,
      ...updates,
      updatedAt: Date.now(),
      versions: [...item.versions, version]
    };

    this.content.set(id, updatedItem);
    return updatedItem;
  }

  scheduleContent(id: string, publishAt: number): ContentItem {
    const item = this.content.get(id);
    if (!item) throw new Error(`Content ${id} not found`);

    return this.updateContent(id, {
      status: 'scheduled',
      scheduledAt: publishAt
    });
  }

  searchContent(options: ContentSearchOptions): ContentItem[] {
    let results = Array.from(this.content.values());

    if (options.query) {
      const query = options.query.toLowerCase();
      results = results.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.content.toLowerCase().includes(query)
      );
    }

    if (options.type) {
      results = results.filter(item => item.type === options.type);
    }

    if (options.status) {
      results = results.filter(item => item.status === options.status);
    }

    if (options.author) {
      results = results.filter(item => item.author === options.author);
    }

    if (options.tags?.length) {
      results = results.filter(item =>
        options.tags!.some(tag => item.tags.includes(tag))
      );
    }

    if (options.startDate) {
      results = results.filter(item => item.createdAt >= options.startDate!);
    }

    if (options.endDate) {
      results = results.filter(item => item.createdAt <= options.endDate!);
    }

    return results;
  }

  createTemplate(template: ContentTemplate): void {
    this.templates.set(template.id, template);
  }

  getTemplate(id: string): ContentTemplate | undefined {
    return this.templates.get(id);
  }

  listTemplates(): ContentTemplate[] {
    return Array.from(this.templates.values());
  }
}

export const contentManager = new ContentManager();