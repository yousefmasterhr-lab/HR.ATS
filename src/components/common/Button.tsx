import React from 'react';
import { clsx } from 'clsx';

export type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost' | 'outline' | 'mint-soft';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 select-none disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-mint-500/30';

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5 h-8',
    md: 'text-sm px-4 py-2.5 rounded-xl gap-2 h-10',
    lg: 'text-base px-5 py-3 rounded-xl gap-2.5 h-12',
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-mint-500 text-canvas hover:bg-mint-600 shadow-sm hover:shadow-card active:transform-none',
    secondary: 'bg-sand-100 text-pine border border-sand-300 hover:bg-sidebar-hover hover:border-sand-400',
    destructive: 'bg-terracotta text-white hover:bg-terracotta-hover shadow-sm',
    ghost: 'bg-transparent text-neutral-muted hover:text-neutral-main hover:bg-sand-100',
    outline: 'bg-transparent text-pine border border-sand-300 hover:bg-sand-50 hover:border-mint-500',
    'mint-soft': 'bg-mint-100 text-pine hover:bg-mint-200 border border-mint-200',
  };

  return (
    <button
      className={clsx(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="inline-block shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="inline-block shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
};
