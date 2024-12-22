import React from 'react';
import { ContentTemplate } from '../../../utils/content/types';
import { Card } from '../../ui/Card';
import { FileText } from 'lucide-react';

interface TemplateListProps {
  templates: ContentTemplate[];
  onSelect: (template: ContentTemplate) => void;
}

export function TemplateList({ templates, onSelect }: TemplateListProps) {
  return (
    <div className="grid gap-4">
      {templates.map((template) => (
        <Card
          key={template.id}
          hover
          className="cursor-pointer"
          onClick={() => onSelect(template)}
        >
          <div className="p-4 flex items-start space-x-4">
            <FileText className="h-6 w-6 text-blue-500 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {template.name}
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {Object.keys(template.structure).length} fields
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}