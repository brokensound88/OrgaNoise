import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useForm } from 'react-hook-form';

interface Section {
  id: string;
  type: 'personal' | 'work' | 'skills' | 'education' | 'custom';
  title: string;
  content: Record<string, unknown>;
  isVisible: boolean;
}

interface ProfileSectionsProps {
  initialSections?: Section[];
  onSave: (sections: Section[]) => Promise<void>;
}

const defaultSections: Section[] = [
  {
    id: 'personal',
    type: 'personal',
    title: 'Personal Information',
    content: {},
    isVisible: true
  },
  {
    id: 'work',
    type: 'work',
    title: 'Work History',
    content: {},
    isVisible: true
  },
  {
    id: 'skills',
    type: 'skills',
    title: 'Skills & Expertise',
    content: {},
    isVisible: true
  }
];

export const ProfileSections: React.FC<ProfileSectionsProps> = ({
  initialSections = defaultSections,
  onSave
}) => {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm();

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSections(items);
  };

  const handleSectionVisibility = (sectionId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, isVisible: !section.isVisible }
        : section
    ));
  };

  const handleSectionEdit = (sectionId: string) => {
    setEditingSection(sectionId);
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      reset(section.content);
    }
  };

  const handleSectionSave = async (data: any) => {
    if (!editingSection) return;

    const updatedSections = sections.map(section =>
      section.id === editingSection
        ? { ...section, content: data }
        : section
    );

    setSections(updatedSections);
    setEditingSection(null);
    await onSave(updatedSections);
  };

  const addNewSection = () => {
    const newSection: Section = {
      id: `custom-${Date.now()}`,
      type: 'custom',
      title: 'New Section',
      content: {},
      isVisible: true
    };
    setSections([...sections, newSection]);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Profile Sections</h2>
        <button
          onClick={addNewSection}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Section
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {sections.map((section, index) => (
                <Draggable
                  key={section.id}
                  draggableId={section.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="bg-white p-4 rounded-lg shadow"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <div {...provided.dragHandleProps} className="cursor-move">
                            ⋮⋮
                          </div>
                          <h3 className="font-medium">{section.title}</h3>
                        </div>
                        <div className="space-x-2">
                          <button
                            onClick={() => handleSectionVisibility(section.id)}
                            className={`px-3 py-1 rounded ${
                              section.isVisible
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {section.isVisible ? 'Visible' : 'Hidden'}
                          </button>
                          <button
                            onClick={() => handleSectionEdit(section.id)}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded"
                          >
                            Edit
                          </button>
                        </div>
                      </div>

                      {editingSection === section.id && (
                        <form
                          onSubmit={handleSubmit(handleSectionSave)}
                          className="mt-4 space-y-4"
                        >
                          {section.type === 'personal' && (
                            <>
                              <input
                                {...register('fullName')}
                                placeholder="Full Name"
                                className="w-full p-2 border rounded"
                              />
                              <input
                                {...register('title')}
                                placeholder="Professional Title"
                                className="w-full p-2 border rounded"
                              />
                              <textarea
                                {...register('bio')}
                                placeholder="Bio"
                                className="w-full p-2 border rounded"
                              />
                            </>
                          )}

                          {section.type === 'work' && (
                            <>
                              <input
                                {...register('company')}
                                placeholder="Company"
                                className="w-full p-2 border rounded"
                              />
                              <input
                                {...register('position')}
                                placeholder="Position"
                                className="w-full p-2 border rounded"
                              />
                              <textarea
                                {...register('description')}
                                placeholder="Description"
                                className="w-full p-2 border rounded"
                              />
                            </>
                          )}

                          {section.type === 'skills' && (
                            <>
                              <input
                                {...register('skills')}
                                placeholder="Skills (comma separated)"
                                className="w-full p-2 border rounded"
                              />
                              <textarea
                                {...register('expertise')}
                                placeholder="Areas of Expertise"
                                className="w-full p-2 border rounded"
                              />
                            </>
                          )}

                          {section.type === 'custom' && (
                            <>
                              <input
                                {...register('title')}
                                placeholder="Section Title"
                                className="w-full p-2 border rounded"
                              />
                              <textarea
                                {...register('content')}
                                placeholder="Section Content"
                                className="w-full p-2 border rounded"
                              />
                            </>
                          )}

                          <div className="flex justify-end space-x-2">
                            <button
                              type="button"
                              onClick={() => setEditingSection(null)}
                              className="px-4 py-2 bg-gray-100 text-gray-800 rounded"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 bg-blue-500 text-white rounded"
                            >
                              Save
                            </button>
                          </div>
                        </form>
                      )}
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