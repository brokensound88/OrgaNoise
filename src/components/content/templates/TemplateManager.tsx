import React, { useState } from 'react';
import { ContentTemplate } from '../../../utils/content/types';
import { Section } from '../../ui/Section';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { TemplateList } from './TemplateList';
import { TemplateForm } from './TemplateForm';
import { Plus } from 'lucide-react';

interface TemplateManagerProps {
  templates: ContentTemplate[];
  onCreateTemplate: (template: Omit<ContentTemplate, 'id'>) => void;
}

export function TemplateManager({ templates, onCreateTemplate }: TemplateManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);

  return (
    <Section className="py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Content Templates
        </h2>
        <Button
          variant="primary"
          onClick={() => setIsCreating(true)}
          icon={Plus}
        >
          New Template
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <TemplateList
            templates={templates}
            onSelect={setSelectedTemplate}
          />
        </div>
        <div className="lg:col-span-2">
          <Card>
            {isCreating ? (
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                  Create New Template
                </h3>
                <TemplateForm
                  onSubmit={(template) => {
                    onCreateTemplate(template);
                    setIsCreating(false);
                  }}
                />
              </div>
            ) : selectedTemplate ? (
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                  {selectedTemplate.name}
                </h3>
                <pre className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg overflow-auto">
                  {JSON.stringify(selectedTemplate.structure, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-600 dark:text-gray-400">
                Select a template or create a new one
              </div>
            )}
          </Card>
        </div>
      </div>
    </Section>
  );
}