import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  to?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  icon?: LucideIcon;
  className?: string;
  onClick?: () => void;
}

export function Button({
  children,
  to,
  variant = 'primary',
  icon: Icon,
  className = '',
  onClick,
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center px-6 py-3 border text-base font-medium rounded-md transition-colors';
  
  const variantStyles = {
    primary: 'border-transparent text-white bg-blue-600 hover:bg-blue-700',
    secondary: 'border-transparent text-white bg-gray-600 hover:bg-gray-700',
    outline: 'border-white text-white hover:bg-white hover:text-gray-900',
  };

  const buttonContent = (
    <>
      {Icon && <Icon className="mr-2 h-5 w-5" />}
      {children}
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      >
        {buttonContent}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {buttonContent}
    </button>
  );
}