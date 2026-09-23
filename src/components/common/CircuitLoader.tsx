import React from 'react';

interface CircuitLoaderProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CircuitLoader: React.FC<CircuitLoaderProps> = ({
  label = 'Clocking Circuit Logic...',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: { led: 'w-2 h-2', text: 'text-[10px]', svg: 'h-4 w-20' },
    md: { led: 'w-3 h-3', text: 'text-xs', svg: 'h-6 w-28' },
    lg: { led: 'w-4 h-4', text: 'text-sm', svg: 'h-8 w-36' },
  }[size];

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center p-6 space-y-3 select-none"
    >
      {/* 3 Sequential Digital Electronics Diodes */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center gap-1">
          <div
            className={`${sizeClasses.led} rounded-full bg-rose-500 shadow-rose-sm animate-pulse`}
            style={{ animationDelay: '0ms' }}
          />
          <span className="text-[9px] font-mono font-bold text-rose-600 dark:text-rose-400">VCC</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div
            className={`${sizeClasses.led} rounded-full bg-amber-400 shadow-amber-sm animate-pulse`}
            style={{ animationDelay: '200ms' }}
          />
          <span className="text-[9px] font-mono font-bold text-amber-600 dark:text-amber-400">CLK</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div
            className={`${sizeClasses.led} rounded-full bg-emerald-500 shadow-teal-sm animate-pulse`}
            style={{ animationDelay: '400ms' }}
          />
          <span className="text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400">DATA</span>
        </div>
      </div>

      {/* Looping Digital Waveform Scope */}
      <svg
        viewBox="0 0 100 24"
        className={`${sizeClasses.svg} text-indigo-500 overflow-visible`}
        fill="none"
      >
        <path
          d="M 0 18 L 20 18 L 20 6 L 40 6 L 40 18 L 60 18 L 60 6 L 80 6 L 80 18 L 100 18"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="6 4"
          className="wire-flow-high"
        />
      </svg>

      <span className={`font-mono font-bold text-ink-600 dark:text-cream-muted ${sizeClasses.text} tracking-wider`}>
        {label}
      </span>
    </div>
  );
};
