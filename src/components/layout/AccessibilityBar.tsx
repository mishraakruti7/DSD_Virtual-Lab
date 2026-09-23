import React from 'react';
import { useCourseStore, FontSize } from '../../store/useCourseStore';
import { Eye, Sun, Moon, Type, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { playSoftClick } from '../../utils/soundEffects';

export const AccessibilityBar: React.FC = () => {
  const {
    theme,
    toggleTheme,
    highContrast,
    toggleHighContrast,
    fontSize,
    setFontSize,
    soundEnabled,
    toggleSound,
  } = useCourseStore();

  const handleToggleSound = () => {
    toggleSound();
    // If we just turned sound ON, give immediate feedback click
    if (!soundEnabled) {
      setTimeout(() => playSoftClick(), 50);
    }
  };

  const fontSizes: { label: string; size: FontSize }[] = [
    { label: 'A-', size: 'sm' },
    { label: 'A', size: 'base' },
    { label: 'A+', size: 'lg' },
  ];

  return (
    <div className="bg-cream-soft/90 dark:bg-darklab-card/90 border-b border-cream-border dark:border-darklab-border text-ink-700 dark:text-cream-paper/90 text-xs py-1.5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Course Identification Breadcrumb */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-brand-600 dark:text-brand-300 flex items-center gap-1.5 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-brand-500 dark:text-brand-400 animate-pulse" />
            ECCOR2PC203: Digital System Design
          </span>
          <span className="text-cream-border dark:text-darklab-border hidden md:inline">|</span>
          <span className="text-ink-500 dark:text-cream-muted hidden md:inline text-[11px]">
            Shah & Anchor Kutchhi Engineering College (SAKEC)
          </span>
        </div>

        {/* Right: Accessibility & Theme Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3 ml-auto shrink-0">
          {/* Font Resizing */}
          <div className="flex items-center gap-1 bg-cream-paper dark:bg-darklab-base rounded-xl px-1.5 py-0.5 border border-cream-border dark:border-darklab-border shadow-xs">
            <Type className="w-3 h-3 text-ink-400 dark:text-cream-muted mr-0.5" />
            {fontSizes.map((f) => (
              <button
                key={f.size}
                onClick={() => setFontSize(f.size)}
                className={`px-1.5 py-0.5 rounded-lg text-[11px] font-bold font-mono transition-colors ${
                  fontSize === f.size
                    ? 'bg-gradient-to-r from-brand-start to-brand-end text-white shadow-xs'
                    : 'text-ink-600 dark:text-cream-muted hover:text-ink-900 dark:hover:text-cream-paper'
                }`}
                title={`Set text size to ${f.size}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* High Contrast Toggle */}
          <button
            onClick={toggleHighContrast}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border text-[11px] font-mono transition-colors shadow-xs ${
              highContrast
                ? 'bg-mod2 text-white font-bold border-mod2 shadow-amber'
                : 'border-cream-border dark:border-darklab-border bg-cream-paper dark:bg-darklab-base text-ink-700 dark:text-cream-paper/90 hover:text-ink-900 dark:hover:text-cream-paper'
            }`}
            title="Toggle High Contrast Mode for enhanced legibility"
          >
            <Eye className="w-3 h-3" />
            <span>Contrast</span>
          </button>

          {/* Sound Toggle (Web Audio API) */}
          <button
            onClick={handleToggleSound}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-mono transition-all shadow-xs ${
              soundEnabled
                ? 'bg-mod3 text-white font-bold border-mod3 shadow-teal'
                : 'border-cream-border dark:border-darklab-border bg-cream-paper dark:bg-darklab-base text-ink-700 dark:text-cream-paper/90 hover:text-ink-900 dark:hover:text-cream-paper'
            }`}
            title={soundEnabled ? 'Mute Sound Effects' : 'Enable Interactive Sound Effects (Synthesized)'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3 h-3 text-white" />
                <span>Sound: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3 h-3 text-ink-400" />
                <span>Sound: OFF</span>
              </>
            )}
          </button>

          {/* Theme Toggle with distinct boundary */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-cream-border dark:border-darklab-border bg-cream-paper dark:bg-darklab-base text-ink-700 dark:text-cream-paper/90 hover:text-ink-900 dark:hover:text-cream-paper text-[11px] font-mono transition-colors shadow-xs"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-3 h-3 text-ink-600" />
                <span>Dark</span>
              </>
            ) : (
              <>
                <Sun className="w-3 h-3 text-mod2" />
                <span>Light</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
