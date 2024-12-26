import React from 'react';
import { WorkHistorySection } from '../../services/profileSectionService';
import { useForm, useFieldArray } from 'react-hook-form';

interface WorkHistoryEditorProps {
  section: WorkHistorySection;
  onSave: (data: WorkHistorySection['data']) => void;
  onCancel: () => void;
}

export const WorkHistoryEditor: React.FC<WorkHistoryEditorProps> = ({
  section,
  onSave,
  onCancel,
}) => {
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      positions: section.data.positions || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'positions',
  });

  const watchPositions = watch('positions');

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Work Experience</h3>
        <button
          type="button"
          onClick={() => append({
            id: crypto.randomUUID(),
            title: '',
            company: '',
            location: '',
            startDate: '',
            isCurrent: false,
            description: '',
            achievements: [],
          })}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Position
        </button>
      </div>

      <div className="space-y-8">
        {fields.map((field, index) => (
          <div key={field.id} className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-start mb-6">
              <h4 className="text-md font-medium text-gray-900">
                Position {index + 1}
              </h4>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor={`positions.${index}.title`}
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  type="text"
                  {...register(`positions.${index}.title` as const, {
                    required: 'Title is required',
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.positions?.[index]?.title && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.positions[index]?.title?.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor={`positions.${index}.company`}
                  className="block text-sm font-medium text-gray-700"
                >
                  Company
                </label>
                <input
                  type="text"
                  {...register(`positions.${index}.company` as const, {
                    required: 'Company is required',
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.positions?.[index]?.company && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.positions[index]?.company?.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor={`positions.${index}.location`}
                  className="block text-sm font-medium text-gray-700"
                >
                  Location
                </label>
                <input
                  type="text"
                  {...register(`positions.${index}.location` as const, {
                    required: 'Location is required',
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.positions?.[index]?.location && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.positions[index]?.location?.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor={`positions.${index}.startDate`}
                  className="block text-sm font-medium text-gray-700"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  {...register(`positions.${index}.startDate` as const, {
                    required: 'Start date is required',
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.positions?.[index]?.startDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.positions[index]?.startDate?.message}
                  </p>
                )}
              </div>

              <div className="col-span-2 flex items-center">
                <input
                  type="checkbox"
                  {...register(`positions.${index}.isCurrent` as const)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor={`positions.${index}.isCurrent`}
                  className="ml-2 block text-sm text-gray-900"
                >
                  I currently work here
                </label>
              </div>

              {!watchPositions[index]?.isCurrent && (
                <div>
                  <label
                    htmlFor={`positions.${index}.endDate`}
                    className="block text-sm font-medium text-gray-700"
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    {...register(`positions.${index}.endDate` as const, {
                      required: 'End date is required',
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.positions?.[index]?.endDate && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.positions[index]?.endDate?.message}
                    </p>
                  )}
                </div>
              )}

              <div className="col-span-2">
                <label
                  htmlFor={`positions.${index}.description`}
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  {...register(`positions.${index}.description` as const, {
                    required: 'Description is required',
                  })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                {errors.positions?.[index]?.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.positions[index]?.description?.message}
                  </p>
                )}
              </div>
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