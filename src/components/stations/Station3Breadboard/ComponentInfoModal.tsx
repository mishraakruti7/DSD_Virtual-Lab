import React from 'react';
import { motion } from 'framer-motion';
import { X, Info, Cpu, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { ComponentDefinition } from '../../../data/componentLibrary';

interface ComponentInfoModalProps {
  componentDef: ComponentDefinition | null;
  onClose: () => void;
  onPlaceComponent?: (def: ComponentDefinition) => void;
}

export const ComponentInfoModal: React.FC<ComponentInfoModalProps> = ({
  componentDef,
  onClose,
  onPlaceComponent,
}) => {
  if (!componentDef) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-800/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">
                {componentDef.name}
              </h3>
              <span className="text-xs uppercase tracking-wider text-stone-400 font-mono">
                {componentDef.category} • Phase {componentDef.phase}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
          <div>
            <h4 className="font-semibold text-stone-800 dark:text-stone-200 mb-1 text-xs">
              Overview
            </h4>
            <p className="text-stone-600 dark:text-stone-300 leading-relaxed">
              {componentDef.description}
            </p>
          </div>

          {/* Simulation Model Guarantee */}
          <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-2 font-bold text-stone-800 dark:text-stone-200 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Simulation Accuracy Level</span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              {componentDef.simulationModel === 'exact_digital' ? (
                <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                  Exact Digital Simulation: Evaluated using exact gate truth tables, propagation states, and internal sequential state machines.
                </span>
              ) : componentDef.simulationModel === 'rule_based_analog' ? (
                <span className="text-amber-700 dark:text-amber-300 font-medium">
                  Rule-based Analog / Continuity: Simulated via continuity, forward/reverse bias, and safe current-limiting checks (TinkerCAD-style educational approximation).
                </span>
              ) : (
                <span className="text-blue-700 dark:text-blue-300 font-medium">
                  Interactive Programmable I/O: Digital pins can be directly toggled via canvas interface controls.
                </span>
              )}
            </p>
          </div>

          {/* Pinout description */}
          <div>
            <h4 className="font-semibold text-stone-800 dark:text-stone-200 mb-2 text-xs">
              Pinout Reference ({componentDef.pins.length} Pins)
            </h4>
            <div className="space-y-1.5 font-mono text-[11px]">
              {componentDef.pinoutDescription.map((desc, i) => (
                <div
                  key={i}
                  className="p-2 rounded-lg bg-stone-100/70 dark:bg-stone-800/60 text-stone-700 dark:text-stone-300 border border-stone-200/60 dark:border-stone-800"
                >
                  {desc}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-800/30">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            Close
          </button>
          {onPlaceComponent && (
            <button
              onClick={() => {
                onPlaceComponent(componentDef);
                onClose();
              }}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
            >
              Add to Breadboard
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
