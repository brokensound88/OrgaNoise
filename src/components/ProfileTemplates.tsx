import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  profileTemplatesService,
  ProfileTemplate,
  TemplateFilter,
} from '../services/profileTemplatesService';

interface ProfileTemplatesProps {
  userId: string;
}

export const ProfileTemplates: React.FC<ProfileTemplatesProps> = ({ userId }) => {
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState<ProfileTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ProfileTemplate | null>(null);
  const [filters, setFilters] = useState<TemplateFilter>({
    sortBy: 'popular',
    isPublic: true,
    tags: [],
    category: 'all',
  });
  const [categories, setCategories] = useState<{
    categories: string[];
    industries: string[];
    roles: string[];
    popularTags: string[];
  }>({
    categories: [],
    industries: [],
    roles: [],
    popularTags: [],
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Partial<ProfileTemplate>>({
    name: '',
    description: '',
    isPublic: true,
    layout: {
      sections: [],
      theme: {
        colors: {
          primary: '#4F46E5',
          secondary: '#6366F1',
          accent: '#818CF8',
          background: '#FFFFFF',
          text: '#111827',
        },
        fonts: {
          heading: 'Inter',
          body: 'Inter',
        },
        spacing: {
          section: '2rem',
          element: '1rem',
        },
      },
    },
    metadata: {
      tags: [] as string[],
      category: 'general',
    },
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [templatesData, categoriesData] = await Promise.all([
        profileTemplatesService.getTemplates(filters),
        profileTemplatesService.getCategories(),
      ]);
      setTemplates(templatesData);
      setCategories(categoriesData);
    } catch (error) {
      toast.error('Failed to load templates');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async () => {
    try {
      const template = await profileTemplatesService.createTemplate({
        ...newTemplate as Omit<ProfileTemplate, 'id' | 'stats' | 'createdAt' | 'updatedAt'>,
        createdBy: userId,
      });
      setTemplates([template, ...templates]);
      setShowCreateModal(false);
      setNewTemplate({
        name: '',
        description: '',
        isPublic: true,
        layout: {
          sections: [],
          theme: {
            colors: {
              primary: '#4F46E5',
              secondary: '#6366F1',
              accent: '#818CF8',
              background: '#FFFFFF',
              text: '#111827',
            },
            fonts: {
              heading: 'Inter',
              body: 'Inter',
            },
            spacing: {
              section: '2rem',
              element: '1rem',
            },
          },
        },
        metadata: {
          tags: [],
          category: '',
        },
      });
      toast.success('Template created successfully');
    } catch (error) {
      toast.error('Failed to create template');
      console.error(error);
    }
  };

  const handleApplyTemplate = async (templateId: string) => {
    if (!window.confirm('Are you sure you want to apply this template? This will override your current profile layout.')) {
      return;
    }

    try {
      await profileTemplatesService.applyTemplate(userId, templateId);
      toast.success('Template applied successfully');
    } catch (error) {
      toast.error('Failed to apply template');
      console.error(error);
    }
  };

  const handleRateTemplate = async (templateId: string, rating: number) => {
    try {
      await profileTemplatesService.rateTemplate(templateId, rating);
      const updatedTemplate = await profileTemplatesService.getTemplate(templateId);
      setTemplates(templates.map(t => t.id === templateId ? updatedTemplate : t));
      toast.success('Rating submitted successfully');
    } catch (error) {
      toast.error('Failed to submit rating');
      console.error(error);
    }
  };

  const handleCloneTemplate = async (templateId: string) => {
    try {
      const clonedTemplate = await profileTemplatesService.cloneTemplate(templateId, {
        name: `Copy of ${templates.find(t => t.id === templateId)?.name}`,
        isPublic: false,
      });
      setTemplates([clonedTemplate, ...templates]);
      toast.success('Template cloned successfully');
    } catch (error) {
      toast.error('Failed to clone template');
      console.error(error);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!window.confirm('Are you sure you want to delete this template?')) {
      return;
    }

    try {
      await profileTemplatesService.deleteTemplate(templateId);
      setTemplates(templates.filter(t => t.id !== templateId));
      toast.success('Template deleted successfully');
    } catch (error) {
      toast.error('Failed to delete template');
      console.error(error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Profile Templates</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Create Template
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              value={filters.category || ''}
              onChange={(e) => setFilters({ ...filters, category: e.target.value || undefined })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">All Categories</option>
              {categories.categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
              Industry
            </label>
            <select
              id="industry"
              value={filters.industry || ''}
              onChange={(e) => setFilters({ ...filters, industry: e.target.value || undefined })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">All Industries</option>
              {categories.industries.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              id="role"
              value={filters.role || ''}
              onChange={(e) => setFilters({ ...filters, role: e.target.value || undefined })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">All Roles</option>
              {categories.roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700">
              Sort By
            </label>
            <select
              id="sort"
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as TemplateFilter['sortBy'] })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {/* Popular Tags */}
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Popular Tags</h3>
          <div className="flex flex-wrap gap-2">
            {categories.popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setFilters({
                  ...filters,
                  tags: filters.tags?.includes(tag)
                    ? filters.tags.filter(t => t !== tag)
                    : [...(filters.tags || []), tag],
                })}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  filters.tags?.includes(tag)
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg shadow overflow-hidden">
            {/* Template Preview */}
            <div
              className="h-48 bg-cover bg-center"
              style={{
                backgroundColor: template.layout.theme.colors.background,
                color: template.layout.theme.colors.text,
              }}
            >
              <div className="h-full p-4 flex flex-col">
                <h3
                  className="text-lg font-bold"
                  style={{ fontFamily: template.layout.theme.fonts.heading }}
                >
                  {template.name}
                </h3>
                <p
                  className="mt-2 text-sm"
                  style={{ fontFamily: template.layout.theme.fonts.body }}
                >
                  {template.description}
                </p>
              </div>
            </div>

            {/* Template Info */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">
                    {template.stats.rating.toFixed(1)}
                  </span>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRateTemplate(template.id, star)}
                        className={`h-5 w-5 ${
                          star <= template.stats.rating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 3.314l2.364 4.827 5.296.77-3.83 3.73.904 5.27L10 15.31l-4.734 2.6.904-5.27-3.83-3.73 5.296-.77L10 3.314z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({template.stats.reviews})
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {template.stats.uses} uses
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {template.metadata.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApplyTemplate(template.id)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTemplate(template);
                      setShowPreviewModal(true);
                    }}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Preview
                  </button>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleCloneTemplate(template.id)}
                    className="text-gray-400 hover:text-gray-500"
                    title="Clone template"
                    aria-label="Clone template"
                  >
                    <span className="sr-only">Clone</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                      <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                    </svg>
                  </button>
                  {template.createdBy === userId && (
                    <button
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="text-red-400 hover:text-red-500"
                    >
                      <span className="sr-only">Delete</span>
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Create Template</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="template-name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="template-name"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="template-description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="template-description"
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="template-category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="template-category"
                  value={newTemplate.metadata?.category}
                  onChange={(e) => setNewTemplate({
                    ...newTemplate,
                    metadata: { ...newTemplate.metadata, category: e.target.value },
                  })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">Select Category</option>
                  {categories.categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Tags</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {categories.popularTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setNewTemplate({
                        ...newTemplate,
                        metadata: {
                          ...newTemplate.metadata,
                          tags: newTemplate.metadata?.tags?.includes(tag)
                            ? newTemplate.metadata.tags.filter(t => t !== tag)
                            : [...(newTemplate.metadata?.tags || []), tag],
                        },
                      })}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        newTemplate.metadata?.tags?.includes(tag)
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="template-public"
                  checked={newTemplate.isPublic}
                  onChange={(e) => setNewTemplate({ ...newTemplate, isPublic: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="template-public" className="ml-2 block text-sm text-gray-900">
                  Make template public
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTemplate}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && selectedTemplate && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div
              className="p-6"
              style={{
                backgroundColor: selectedTemplate.layout.theme.colors.background,
                color: selectedTemplate.layout.theme.colors.text,
              }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3
                  className="text-xl font-bold"
                  style={{ fontFamily: selectedTemplate.layout.theme.fonts.heading }}
                >
                  {selectedTemplate.name}
                </h3>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div
                className="space-y-6"
                style={{
                  marginTop: selectedTemplate.layout.theme.spacing.section,
                  gap: selectedTemplate.layout.theme.spacing.element,
                } as React.CSSProperties}
              >
                {selectedTemplate.layout.sections.map((section) => (
                  <div
                    key={section.id}
                    className="border rounded-lg p-4"
                    style={{
                      marginTop: selectedTemplate.layout.theme.spacing.section,
                      borderColor: selectedTemplate.layout.theme.colors.accent,
                    }}
                  >
                    <h4
                      className="text-lg font-medium mb-4"
                      style={{ fontFamily: selectedTemplate.layout.theme.fonts.heading }}
                    >
                      {section.title}
                      {section.isRequired && (
                        <span className="ml-1 text-red-500">*</span>
                      )}
                    </h4>
                    <div
                      className="text-sm"
                      style={{
                        fontFamily: selectedTemplate.layout.theme.fonts.body,
                        marginTop: selectedTemplate.layout.theme.spacing.element,
                      }}
                    >
                      {/* Placeholder content */}
                      <div className="h-16 bg-gray-100 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleApplyTemplate(selectedTemplate.id);
                  setShowPreviewModal(false);
                }}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Apply Template
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      )}
    </div>
  );
}; 