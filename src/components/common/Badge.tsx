import React from 'react';
import { clsx } from 'clsx';

export type BadgeVariant = 'active' | 'pending' | 'rejected' | 'info' | 'neutral' | 'mint' | 'pine';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className,
  size = 'md',
  icon,
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    active: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/80',
    pending: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800/80',
    rejected: 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800/80',
    info: 'bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800/80',
    neutral: 'bg-sand-100 dark:bg-sand-200 text-neutral-muted border border-sand-300 dark:border-sand-400',
    mint: 'bg-mint-100 dark:bg-mint-900/60 text-pine font-bold border border-mint-300 dark:border-mint-700',
    pine: 'bg-pine text-canvas font-semibold',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 rounded-md gap-1',
    md: 'text-xs px-2.5 py-1 rounded-full gap-1.5',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium leading-none transition-colors select-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {icon && <span className="inline-block">{icon}</span>}
      {children}
    </span>
  );
};
