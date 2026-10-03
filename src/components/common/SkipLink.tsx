import React from 'react';

export const SkipLink: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[9999] px-4 py-2.5 rounded-xl bg-cyan-700 text-white font-bold text-xs shadow-2xl ring-2 ring-white ring-offset-2 ring-offset-cyan-700 transition-all"
    >
      Skip to main content
    </a>
  );
};
