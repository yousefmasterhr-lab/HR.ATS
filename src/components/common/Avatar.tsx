import React, { useState } from 'react';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  statusIndicator?: 'online' | 'busy' | 'offline';
}

const COLOR_PALETTES = [
  { bg: 'bg-mint-100', text: 'text-pine', border: 'border-mint-300' },
  { bg: 'bg-sand-200', text: 'text-neutral-main', border: 'border-sand-300' },
  { bg: 'bg-emerald-100', text: 'text-emerald-900', border: 'border-emerald-300' },
  { bg: 'bg-teal-100', text: 'text-teal-900', border: 'border-teal-300' },
  { bg: 'bg-amber-100', text: 'text-amber-900', border: 'border-amber-300' },
];

const SIZE_CLASSES = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm font-semibold',
  lg: 'w-12 h-12 text-base font-bold',
  xl: 'w-16 h-16 text-xl font-bold',
};

const getInitials = (fullName: string): string => {
  if (!fullName) return 'U';
  // Remove prefixes like م. or د. or Eng. or Dr.
  const cleaned = fullName.replace(/^(م\.|د\.|أ\.|Eng\.|Dr\.)\s*/i, '').trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const getPaletteForName = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLOR_PALETTES.length;
  return COLOR_PALETTES[index];
};

export const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  size = 'md',
  className = '',
  statusIndicator,
}) => {
  const [imageError, setImageError] = useState(false);
  const palette = getPaletteForName(name || 'User');
  const initials = getInitials(name || 'User');
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  // Use image if provided and no error occurred and NOT an unsplash URL that might fail SSL
  const hasValidImage = src && !imageError && !src.includes('unsplash.com');

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {hasValidImage ? (
        <img
          src={src}
          alt={name}
          onError={() => setImageError(true)}
          className={`${sizeClass} rounded-full object-cover border border-surface-border shadow-xs`}
        />
      ) : (
        <div
          className={`${sizeClass} rounded-full ${palette.bg} ${palette.text} border ${palette.border} flex items-center justify-center font-bold tracking-tight select-none shadow-xs`}
          title={name}
        >
          <span>{initials}</span>
        </div>
      )}

      {statusIndicator && (
        <span
          className={`absolute bottom-0 end-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
            statusIndicator === 'online'
              ? 'bg-emerald-500'
              : statusIndicator === 'busy'
              ? 'bg-amber-500'
              : 'bg-neutral-muted'
          }`}
        />
      )}
    </div>
  );
};
