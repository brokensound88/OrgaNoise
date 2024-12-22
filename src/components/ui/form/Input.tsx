import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ error, className = '', ...props }: InputProps) {
  return (
    <input
      className={`
        w-full px-3 py-2 rounded-md border
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${error
          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
          : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
        }
        ${className}
      `}
      {...props}
    />
  );
}