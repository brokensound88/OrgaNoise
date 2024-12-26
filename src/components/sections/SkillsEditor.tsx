import React from 'react';
import { SkillsSection } from '../../services/profileSectionService';
import { useForm, useFieldArray } from 'react-hook-form';

interface SkillsEditorProps {
  section: SkillsSection;
  onSave: (data: SkillsSection['data']) => void;
  onCancel: () => void;
}

export const SkillsEditor: React.FC<SkillsEditorProps> = ({
  section,
  onSave,
  onCancel,
}) => {
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      categories: section.data.categories || [],
    },
  });

  const { fields: categoryFields, append: appendCategory, remove: removeCategory } = useFieldArray({
    control,
    name: 'categories',
  });

  const skillsArray = useFieldArray({
    control,
    name: 'categories',
  });

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Skills & Expertise</h3>
        <button
          type="button"
          onClick={() => appendCategory({
            name: '',
            skills: [],
          })}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Category
        </button>
      </div>

      <div className="space-y-8">
        {categoryFields.map((categoryField, categoryIndex) => (
          <div key={categoryField.id} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1 mr-4">
                <label
                  htmlFor={`categories.${categoryIndex}.name`}
                  className="block text-sm font-medium text-gray-700"
                >
                  Category Name
                </label>
                <input
                  type="text"
                  {...register(`categories.${categoryIndex}.name` as const, {
                    required: 'Category name is required',
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.categories?.[categoryIndex]?.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.categories[categoryIndex]?.name?.message}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeCategory(categoryIndex)}
                className="text-red-600 hover:text-red-800"
              >
                Remove Category
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium text-gray-700">Skills</h4>
                <button
                  type="button"
                  onClick={() => {
                    const currentSkills = skillsArray.fields[categoryIndex]?.skills || [];
                    skillsArray.update(categoryIndex, {
                      ...skillsArray.fields[categoryIndex],
                      skills: [
                        ...currentSkills,
                        {
                          name: '',
                          level: 'beginner',
                        },
                      ],
                    });
                  }}
                  className="inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Skill
                </button>
              </div>

              {skillsArray.fields[categoryIndex]?.skills?.map((_, skillIndex) => (
                <div key={`${categoryField.id}-skill-${skillIndex}`} className="grid grid-cols-12 gap-4">
                  <div className="col-span-4">
                    <label
                      htmlFor={`categories.${categoryIndex}.skills.${skillIndex}.name`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Skill Name
                    </label>
                    <input
                      type="text"
                      {...register(`categories.${categoryIndex}.skills.${skillIndex}.name` as const, {
                        required: 'Skill name is required',
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="col-span-3">
                    <label
                      htmlFor={`categories.${categoryIndex}.skills.${skillIndex}.level`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Level
                    </label>
                    <select
                      {...register(`categories.${categoryIndex}.skills.${skillIndex}.level` as const)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>

                  <div className="col-span-3">
                    <label
                      htmlFor={`categories.${categoryIndex}.skills.${skillIndex}.yearsOfExperience`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      {...register(`categories.${categoryIndex}.skills.${skillIndex}.yearsOfExperience` as const)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="col-span-2 flex items-end">
                    <button
                      type="button"
                      onClick={() => {
                        const currentSkills = [...skillsArray.fields[categoryIndex].skills];
                        currentSkills.splice(skillIndex, 1);
                        skillsArray.update(categoryIndex, {
                          ...skillsArray.fields[categoryIndex],
                          skills: currentSkills,
                        });
                      }}
                      className="mb-1 inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Save
        </button>
      </div>
    </form>
  );
}; 