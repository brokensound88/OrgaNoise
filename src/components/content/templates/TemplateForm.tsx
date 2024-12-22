import React from 'react';
import { useForm } from '../../../hooks/useForm';
import { ContentTemplate } from '../../../utils/content/types';
import { FormField } from '../../ui/form/FormField';
import { Input } from '../../ui/form/Input';
import { Button } from '../../ui/Button';

interface TemplateFormProps {
  onSubmit: (template: Omit<ContentTemplate, 'id'>) => void;
  initialValues?: Partial<ContentTemplate>;
}

export function TemplateForm({ onSubmit, initialValues }: TemplateFormProps) {
  const { values, handleChange, handleSubmit } = useForm({
    initialValues: {
      name: '',
      structure: {},
      defaultMetadata: {},
      ...initialValues
    },
    onSubmit: (values) => {
      onSubmit(values);
    }
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField label="Template Name" required>
        <Input
          type="text"
          name="name"
          value={values.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
      </FormField>

      <div className="flex justify-end">
        <Button type="submit" variant="primary">
          Save Template
        </Button>
      </div>
    </form>
  );
}