import React, { useState, useEffect } from 'react';
import { ShieldCheck, X, Cookie } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ConsentManager } from '../../utils/ConsentManager';

export const StorageNoticeBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ConsentManager.isNoticeDismissed()) {
      setVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    ConsentManager.dismissNotice();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      role="region"
      aria-label="Browser Storage and Privacy Notice"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 rounded-2xl border border-cyan-200 dark:border-cyan-900/60 bg-white/95 dark:bg-[#121622]/95 backdrop-blur-xl p-4 shadow-xl text-slate-800 dark:text-stone-200 text-xs font-sans transition-all animate-fadeIn"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
          <Cookie className="w-4 h-4" />
        </div>

        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Browser Storage Notice</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                0 Trackers
              </span>
            </h4>
            <button
              onClick={handleDismiss}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg focus-visible:ring-2 focus-visible:ring-cyan-500"
              aria-label="Dismiss storage notice"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[11px] text-slate-600 dark:text-stone-300 leading-relaxed">
            We use strictly necessary browser storage to keep you signed in, preserve your accessibility settings, and save
            your breadboard circuits. We use <strong>zero advertising cookies</strong>.
          </p>

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleDismiss}
              className="px-3 py-1.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-[11px] transition-all shadow-xs focus-visible:ring-2 focus-visible:ring-cyan-500"
            >
              Acknowledge & Continue
            </button>
            <Link
              to="/cookies"
              className="text-[11px] font-bold text-cyan-700 dark:text-cyan-400 hover:underline"
            >
              Learn More in Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
};
