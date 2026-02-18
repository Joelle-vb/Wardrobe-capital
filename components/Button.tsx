import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  icon,
  className = '',
  disabled,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm";
  
  const variants = {
    // Chic black for primary action - feels like a fashion label or high-end fintech
    primary: "bg-gray-900 hover:bg-black text-white focus:ring-gray-700 shadow-gray-200",
    // Clean white for secondary
    secondary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 focus:ring-gray-200",
    // Soft red
    danger: "bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 focus:ring-rose-200",
    // Ghost
    ghost: "bg-transparent hover:bg-gray-100 text-gray-600 shadow-none",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {!isLoading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};