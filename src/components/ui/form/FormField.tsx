import React from 'react';

interface FormFieldProps {
  label: string;
  error?: string;
  touched?: boolean;
  children: React.ReactNode;
  required?: boolean;
}

export function FormField({
  label,
  error,
  touched,
  children,
  required,
}: FormFieldProps) {
  const showError = touched && error;
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {showError && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}