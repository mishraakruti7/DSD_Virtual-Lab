// ==============================================================================
// SectionHeading Component: Standardized Consistent Heading System
// Enforces solid ink-900 / cream-paper headings with intentional gradient highlights
// Prevents accidental half-colored or cutoff multi-line heading gradients.
// ==============================================================================

import React from 'react';

export interface SectionHeadingProps {
  badge?: string;
  badgeIcon?: React.ReactNode;
  badgeVariant?: 'indigo' | 'emerald' | 'amber' | 'purple' | 'brand';
  title: string;
  highlight?: string;
  subtitle?: string;
  align?: 'left' | 'center';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  badgeIcon,
  badgeVariant = 'indigo',
  title,
  highlight,
  subtitle,
  align = 'left',
  size = 'md',
  className = '',
}) => {
  const badgeClasses = {
    indigo: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    amber: 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    purple: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    brand: 'bg-indigo-50 text-brand-600 dark:bg-indigo-950/60 dark:text-brand-400 border-brand-200 dark:border-brand-800',
  }[badgeVariant];

  const sizeClasses = {
    sm: 'text-lg sm:text-xl',
    md: 'text-xl sm:text-2xl lg:text-3xl',
    lg: 'text-2xl sm:text-3xl lg:text-4xl',
    xl: 'text-3xl sm:text-4xl lg:text-5xl',
  }[size];

  // Render title with highlight phrase safely isolated
  const renderTitle = () => {
    if (!highlight || !title.includes(highlight)) {
      return (
        <span className="text-ink-900 dark:text-cream-paper">
          {title}
        </span>
      );
    }

    const parts = title.split(highlight);
    return (
      <span className="text-ink-900 dark:text-cream-paper">
        {parts[0]}
        <span className="bg-gradient-to-r from-brand-start via-brand-mid to-brand-end bg-clip-text text-transparent font-black inline-block">
          {highlight}
        </span>
        {parts[1]}
      </span>
    );
  };

  return (
    <div
      className={`space-y-2 ${
        align === 'center' ? 'text-center mx-auto' : 'text-left'
      } ${className}`}
    >
      {badge && (
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border shadow-xs ${badgeClasses}`}>
          {badgeIcon}
          <span>{badge}</span>
        </div>
      )}

      <h2
        className={`font-display font-extrabold tracking-tight ${sizeClasses} leading-tight`}
      >
        {renderTitle()}
      </h2>

      {subtitle && (
        <p
          className={`text-xs sm:text-sm text-ink-600 dark:text-cream-muted leading-relaxed font-sans ${
            align === 'center' ? 'max-w-2xl mx-auto' : 'max-w-2xl'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
