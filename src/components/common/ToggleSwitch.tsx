import React from 'react';
import { motion } from 'framer-motion';
import { playSoftClick } from '../../utils/soundEffects';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  sublabel?: string;
  size?: 'sm' | 'md';
  accentColor?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label,
  sublabel,
  size = 'md',
  accentColor = 'bg-sky-500'
}) => {
  const handleClick = () => {
    playSoftClick();
    onChange(!checked);
  };

  const isSmall = size === 'sm';

  return (
    <motion.button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={handleClick}
      whileTap={{ scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      className="inline-flex items-center gap-2.5 p-1 rounded-2xl hover:bg-stone-100/80 dark:hover:bg-darklab-subtle transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 group select-none cursor-pointer"
    >
      <div
        className={`${
          isSmall ? 'w-10 h-5' : 'w-12 h-7'
        } rounded-full transition-colors duration-200 ease-in-out p-0.5 relative shadow-inner border ${
          checked
            ? `${accentColor} border-black/10 shadow-[0_0_12px_rgba(56,189,248,0.4)]`
            : 'bg-stone-300 dark:bg-stone-700 border-stone-400/60 dark:border-stone-600'
        }`}
      >
        <motion.div
          animate={{
            x: checked ? (isSmall ? 20 : 20) : 0,
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 28 }}
          className={`${
            isSmall ? 'w-4 h-4' : 'w-6 h-6'
          } rounded-full bg-white shadow-md flex items-center justify-center`}
        >
          <span className="text-[9px] font-mono font-bold text-stone-700 select-none">
            {checked ? '1' : '0'}
          </span>
        </motion.div>
      </div>

      {(label || sublabel) && (
        <div className="text-left font-sans">
          {label && (
            <div className="text-xs font-bold text-ink-800 dark:text-cream-paper tracking-tight flex items-center gap-1.5">
              <span>{label}</span>
              <span className={`px-1.5 py-0.2 rounded font-mono text-[10px] font-bold ${
                checked
                  ? 'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
              }`}>
                {checked ? 'HIGH' : 'LOW'}
              </span>
            </div>
          )}
          {sublabel && (
            <div className="text-[10px] text-ink-500 dark:text-cream-muted font-medium">
              {sublabel}
            </div>
          )}
        </div>
      )}
    </motion.button>
  );
};
