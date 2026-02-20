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
    // Primary uses theme primary color
    primary: "bg-theme-primary hover:opacity-90 text-theme-card focus:ring-theme-muted shadow-sm",
    // Secondary uses card bg and border
    secondary: "bg-theme-card hover:bg-theme-secondary text-theme-text border border-theme-border focus:ring-theme-border",
    // Danger stays red for semantics
    danger: "bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 focus:ring-rose-200",
    // Ghost
    ghost: "bg-transparent hover:bg-theme-secondary text-theme-muted hover:text-theme-text shadow-none",
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