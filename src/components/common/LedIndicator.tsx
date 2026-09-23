import React, { useEffect, useState } from 'react';
import { useCourseStore } from '../../store/useCourseStore';

interface LedIndicatorProps {
  isOn: boolean;
  color?: 'emerald' | 'ruby' | 'amber' | 'sky';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const LedIndicator: React.FC<LedIndicatorProps> = ({
  isOn,
  color = 'emerald',
  size = 'md',
  label
}) => {
  const { partyMode } = useCourseStore();
  const [justTurnedOn, setJustTurnedOn] = useState(false);

  useEffect(() => {
    if (isOn) {
      setJustTurnedOn(true);
      const t = setTimeout(() => setJustTurnedOn(false), 200);
      return () => clearTimeout(t);
    }
  }, [isOn]);

  const sizeMap = {
    sm: { bulb: 'w-4 h-4', ring: 'p-0.5' },
    md: { bulb: 'w-6 h-6', ring: 'p-1' },
    lg: { bulb: 'w-8 h-8', ring: 'p-1.5' },
  };

  const colorStyles = {
    emerald: {
      on: 'bg-emerald-500 border-emerald-300 shadow-[0_0_20px_6px_rgba(16,185,129,0.85),inset_0_0_6px_rgba(255,255,255,0.6)]',
      off: 'bg-emerald-950/40 border-emerald-900/40 shadow-none',
      text: 'text-emerald-700 dark:text-emerald-400',
    },
    ruby: {
      on: 'bg-rose-500 border-rose-300 shadow-[0_0_20px_6px_rgba(244,63,94,0.85),inset_0_0_6px_rgba(255,255,255,0.6)]',
      off: 'bg-rose-950/40 border-rose-900/40 shadow-none',
      text: 'text-rose-700 dark:text-rose-400',
    },
    amber: {
      on: 'bg-amber-400 border-amber-200 shadow-[0_0_20px_6px_rgba(251,191,36,0.85),inset_0_0_6px_rgba(255,255,255,0.6)]',
      off: 'bg-amber-950/40 border-amber-900/40 shadow-none',
      text: 'text-amber-700 dark:text-amber-400',
    },
    sky: {
      on: 'bg-sky-400 border-sky-200 shadow-[0_0_20px_6px_rgba(56,189,248,0.85),inset_0_0_6px_rgba(255,255,255,0.6)]',
      off: 'bg-sky-950/40 border-sky-900/40 shadow-none',
      text: 'text-sky-700 dark:text-sky-400',
    },
  };

  const effectiveOn = partyMode ? true : isOn;
  const selectedColor = colorStyles[color];
  const { bulb, ring } = sizeMap[size];

  return (
    <div className="inline-flex flex-col items-center gap-1.5 select-none font-sans">
      <div className={`rounded-full bg-stone-200/90 dark:bg-darklab-subtle border border-stone-300 dark:border-darklab-border ${ring} shadow-inner`}>
        <div
          className={`${bulb} rounded-full border transition-all duration-200 relative ${
            effectiveOn ? selectedColor.on : selectedColor.off
          } ${justTurnedOn || partyMode ? 'animate-led-on' : ''}`}
        >
          {/* Internal reflective phosphor lens highlight */}
          <div className="absolute top-1 left-1 w-1/3 h-1/3 rounded-full bg-white/80 filter blur-[0.3px]" />
        </div>
      </div>
      {label && (
        <span className="text-[11px] font-mono tracking-wider font-semibold text-ink-700 dark:text-cream-muted">
          {label} ({isOn ? '1' : '0'})
        </span>
      )}
    </div>
  );
};
