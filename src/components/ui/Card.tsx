import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`
        bg-white rounded-lg p-8 
        ${hover ? 'hover:shadow-lg transition-shadow' : 'shadow-md'}
        ${className}
      `}
    >
      {children}
    </div>
  );
}