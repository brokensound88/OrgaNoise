import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { profileSectionService, ProfileSection, CreateSectionData } from '../services/profileSectionService';
import { toast } from 'react-toastify';
import { PersonalInfoEditor } from './sections/PersonalInfoEditor';
import { WorkHistoryEditor } from './sections/WorkHistoryEditor';
import { SkillsEditor } from './sections/SkillsEditor';

interface ProfileSectionsProps {
  userId: string;
  onSectionChange?: () => void;
}

export const ProfileSections: React.FC<ProfileSectionsProps> = ({ userId, onSectionChange }) => {
  const [sections, setSections] = useState<ProfileSection[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [templates, setTemplates] = useState<CreateSectionData[]>([]);
  const [selectedType, setSelectedType] = useState<ProfileSection['type']>('personal-info');

  useEffect(() => {
    loadSections();
  }, [userId]);

  const loadSections = async () => {
    try {
      const data = await profileSectionService.getSections(userId);
      setSections(data.sort((a, b) => a.order - b.order));
    } catch (error) {
      toast.error('Failed to load profile sections');
      console.error(error);
    }
  };

  const loadTemplates = async (type: ProfileSection['type']) => {
    try {
      const data = await profileSectionService.getSectionTemplates(type);
      setTemplates(data);
    } catch (error) {
      toast.error('Failed to load section templates');
      console.error(error);
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updates = items.map((item, index) => ({
      sectionId: item.id,
      newOrder: index,
    }));

    setLoading(true);
    try {
      const updatedSections = await profileSectionService.updateSectionsOrder(userId, updates);
      setSections(updatedSections);
      onSectionChange?.();
    } catch (error) {
      toast.error('Failed to update section order');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSection = async (template?: CreateSectionData) => {
    setLoading(true);
    try {
      const data: CreateSectionData = template || {
        type: selectedType,
        title: `New ${selectedType.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`,
        order: sections.length,
        isVisible: true,
        data: getDefaultData(selectedType),
      };

      const newSection = await profileSectionService.createSection(userId, data);
      setSections([...sections, newSection]);
      setEditingSection(newSection.id);
      setShowTemplates(false);
      onSectionChange?.();
      toast.success('Section created successfully');
    } catch (error) {
      toast.error('Failed to create section');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!window.confirm('Are you sure you want to delete this section?')) return;

    setLoading(true);
    try {
      await profileSectionService.deleteSection(userId, sectionId);
      setSections(sections.filter(s => s.id !== sectionId));
      onSectionChange?.();
      toast.success('Section deleted successfully');
    } catch (error) {
      toast.error('Failed to delete section');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getDefaultData = (type: ProfileSection['type']) => {
    switch (type) {
      case 'personal-info':
        return {
          fullName: '',
          headline: '',
          summary: '',
          location: '',
          socialLinks: [],
        };
      case 'work-history':
        return {
          positions: [],
        };
      case 'skills':
        return {
          categories: [],
        };
      default:
        return {};
    }
  };

  const renderSectionEditor = (section: ProfileSection) => {
    switch (section.type) {
      case 'personal-info':
        return (
          <PersonalInfoEditor
            section={section}
            onSave={async (data) => {
              try {
                await profileSectionService.updateSection(userId, section.id, { data });
                setEditingSection(null);
                await loadSections();
                onSectionChange?.();
                toast.success('Section updated successfully');
              } catch (error) {
                toast.error('Failed to update section');
                console.error(error);
              }
            }}
            onCancel={() => setEditingSection(null)}
          />
        );
      case 'work-history':
        return (
          <WorkHistoryEditor
            section={section}
            onSave={async (data) => {
              try {
                await profileSectionService.updateSection(userId, section.id, { data });
                setEditingSection(null);
                await loadSections();
                onSectionChange?.();
                toast.success('Section updated successfully');
              } catch (error) {
                toast.error('Failed to update section');
                console.error(error);
              }
            }}
            onCancel={() => setEditingSection(null)}
          />
        );
      case 'skills':
        return (
          <SkillsEditor
            section={section}
            onSave={async (data) => {
              try {
                await profileSectionService.updateSection(userId, section.id, { data });
                setEditingSection(null);
                await loadSections();
                onSectionChange?.();
                toast.success('Section updated successfully');
              } catch (error) {
                toast.error('Failed to update section');
                console.error(error);
              }
            }}
            onCancel={() => setEditingSection(null)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Profile Sections</h2>
        <button
          onClick={() => {
            setShowTemplates(true);
            loadTemplates(selectedType);
          }}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Section
        </button>
      </div>

      {showTemplates && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Choose Section Type</h3>
            <button
              onClick={() => setShowTemplates(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {(['personal-info', 'work-history', 'skills'] as const).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setSelectedType(type);
                  loadTemplates(type);
                }}
                className={`p-4 rounded-lg border ${
                  selectedType === type
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="block text-sm font-medium">
                  {type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </span>
              </button>
            ))}
          </div>
          <div className="space-y-4">
            <button
              onClick={() => handleCreateSection()}
              className="w-full p-4 border border-dashed border-gray-300 rounded-lg hover:border-gray-400 flex items-center justify-center"
            >
              <span className="text-sm font-medium text-gray-600">Create Empty Section</span>
            </button>
            {templates.map((template, index) => (
              <button
                key={index}
                onClick={() => handleCreateSection(template)}
                className="w-full p-4 border border-gray-200 rounded-lg hover:border-gray-300"
              >
                <span className="block text-sm font-medium">{template.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {sections.map((section, index) => (
                <Draggable key={section.id} draggableId={section.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="bg-white rounded-lg shadow"
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <div {...provided.dragHandleProps} className="mr-3">
                              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
                              </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setEditingSection(editingSection === section.id ? null : section.id)}
                              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              {editingSection === section.id ? 'Cancel' : 'Edit'}
                            </button>
                            <button
                              onClick={() => handleDeleteSection(section.id)}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        {editingSection === section.id ? (
                          renderSectionEditor(section)
                        ) : (
                          <div className="prose max-w-none">
                            {/* Render section preview here */}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}; 