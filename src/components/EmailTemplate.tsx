import React, { useState, useEffect } from 'react';
import { emailNotificationService, EmailTemplate as IEmailTemplate } from '../services/emailNotificationService';
import { Editor } from '@tinymce/tinymce-react';
import { toast } from 'react-toastify';

interface EmailTemplateProps {
  templateId?: string;
  onSave?: (template: IEmailTemplate) => void;
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({ templateId, onSave }) => {
  const [template, setTemplate] = useState<Partial<IEmailTemplate>>({
    name: '',
    description: '',
    subject: '',
    htmlBody: '',
    plainTextBody: '',
    variables: [],
    category: 'notification'
  });
  const [previewData, setPreviewData] = useState<{
    subject: string;
    htmlPreview: string;
    plainTextPreview: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewVariables, setPreviewVariables] = useState<Record<string, string>>({});

  useEffect(() => {
    if (templateId) {
      loadTemplate();
    }
  }, [templateId]);

  const loadTemplate = async () => {
    if (!templateId) return;
    
    try {
      setLoading(true);
      const loadedTemplate = await emailNotificationService.getTemplate(templateId);
      setTemplate(loadedTemplate);
      
      // Initialize preview variables
      const initialVariables: Record<string, string> = {};
      loadedTemplate.variables.forEach(variable => {
        initialVariables[variable] = `{{${variable}}}`;
      });
      setPreviewVariables(initialVariables);
    } catch (error) {
      console.error('Failed to load template:', error);
      toast.error('Failed to load email template');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      let savedTemplate: IEmailTemplate;
      
      if (templateId) {
        savedTemplate = await emailNotificationService.updateTemplate(templateId, template);
      } else {
        savedTemplate = await emailNotificationService.createTemplate(template as Omit<IEmailTemplate, 'id' | 'createdAt' | 'updatedAt'>);
      }
      
      toast.success('Email template saved successfully');
      onSave?.(savedTemplate);
    } catch (error) {
      console.error('Failed to save template:', error);
      toast.error('Failed to save email template');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async () => {
    try {
      setLoading(true);
      const preview = await emailNotificationService.previewTemplate(
        templateId || 'preview',
        previewVariables
      );
      setPreviewData(preview);
    } catch (error) {
      console.error('Failed to preview template:', error);
      toast.error('Failed to generate preview');
    } finally {
      setLoading(false);
    }
  };

  const handleVariableChange = (variable: string, value: string) => {
    setPreviewVariables(prev => ({
      ...prev,
      [variable]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Template Details */}
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Template Name
          </label>
          <input
            type="text"
            id="name"
            value={template.name}
            onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={template.description}
            onChange={(e) => setTemplate(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            value={template.category}
            onChange={(e) => setTemplate(prev => ({ ...prev, category: e.target.value as IEmailTemplate['category'] }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="welcome">Welcome</option>
            <option value="verification">Verification</option>
            <option value="reset_password">Reset Password</option>
            <option value="notification">Notification</option>
            <option value="marketing">Marketing</option>
            <option value="system">System</option>
          </select>
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            value={template.subject}
            onChange={(e) => setTemplate(prev => ({ ...prev, subject: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            HTML Content
          </label>
          <div className="mt-1">
            <Editor
              apiKey="your-tinymce-api-key"
              value={template.htmlBody}
              onEditorChange={(content: string) => setTemplate(prev => ({ ...prev, htmlBody: content }))}
              init={{
                height: 400,
                menubar: true,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                  'bold italic forecolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help'
              }}
            />
          </div>
        </div>

        <div>
          <label htmlFor="plainText" className="block text-sm font-medium text-gray-700">
            Plain Text Content
          </label>
          <textarea
            id="plainText"
            value={template.plainTextBody}
            onChange={(e) => setTemplate(prev => ({ ...prev, plainTextBody: e.target.value }))}
            rows={10}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Variables
          </label>
          <div className="mt-2 space-y-2">
            {(template.variables || []).map((variable, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={variable}
                  onChange={(e) => {
                    const newVariables = [...template.variables];
                    newVariables[index] = e.target.value;
                    setTemplate(prev => ({ ...prev, variables: newVariables }));
                  }}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Variable name"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newVariables = template.variables.filter((_, i) => i !== index);
                    setTemplate(prev => ({ ...prev, variables: newVariables }));
                  }}
                  className="inline-flex items-center rounded border border-transparent bg-red-100 px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setTemplate(prev => ({ ...prev, variables: [...(prev.variables || []), ''] }))}
              className="inline-flex items-center rounded border border-transparent bg-indigo-100 px-2.5 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Add Variable
            </button>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="space-y-4">
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium text-gray-900">Preview</h3>
          <div className="mt-4 space-y-4">
            {(template.variables || []).map((variable) => (
              <div key={variable} className="flex items-center space-x-2">
                <label className="block text-sm font-medium text-gray-700 w-1/4">
                  {variable}
                </label>
                <input
                  type="text"
                  value={previewVariables[variable] || ''}
                  onChange={(e) => handleVariableChange(variable, e.target.value)}
                  className="block w-3/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder={`Value for ${variable}`}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handlePreview}
              disabled={loading}
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {loading ? 'Generating Preview...' : 'Generate Preview'}
            </button>
          </div>
        </div>

        {previewData && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700">Subject Preview</h4>
              <p className="mt-1 text-sm text-gray-900">{previewData.subject}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700">HTML Preview</h4>
              <div
                className="mt-1 rounded-md border border-gray-200 p-4"
                dangerouslySetInnerHTML={{ __html: previewData.htmlPreview }}
              />
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700">Plain Text Preview</h4>
              <pre className="mt-1 whitespace-pre-wrap rounded-md border border-gray-200 bg-gray-50 p-4 text-sm">
                {previewData.plainTextPreview}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-3 border-t border-gray-200 pt-4">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {loading ? 'Saving...' : 'Save Template'}
        </button>
      </div>
    </div>
  );
}; 