import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  BookOpen,
  Sparkles,
  ArrowRight,
  Cpu,
  Layers,
  CheckCircle2,
  Clock,
  Compass,
} from 'lucide-react';
import { STARTER_CIRCUITS, StarterCircuitTemplate } from '../../../data/starterCircuits';

interface StarterCircuitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCircuit: (circuit: StarterCircuitTemplate) => void;
}

export const StarterCircuitsModal: React.FC<StarterCircuitsModalProps> = ({
  isOpen,
  onClose,
  onSelectCircuit,
}) => {
  const [selectedId, setSelectedId] = useState<string>(STARTER_CIRCUITS[0].id);

  if (!isOpen) return null;

  const currentCircuit =
    STARTER_CIRCUITS.find((c) => c.id === selectedId) || STARTER_CIRCUITS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                Guided Starter Circuits Library
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                  {STARTER_CIRCUITS.length} Curated Labs
                </span>
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Textbook-inspired reference circuits designed for hands-on experimentation in DSD.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Left column list, Right column details */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left: Circuit List (5 cols) */}
          <div className="md:col-span-5 border-r border-stone-200 dark:border-stone-800 p-3 space-y-2 overflow-y-auto max-h-[60vh]">
            {STARTER_CIRCUITS.map((circuit) => {
              const isSelected = circuit.id === selectedId;
              return (
                <button
                  key={circuit.id}
                  onClick={() => setSelectedId(circuit.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700 shadow-sm'
                      : 'bg-white dark:bg-stone-900/60 border-stone-200/80 dark:border-stone-800/80 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold tracking-wide uppercase text-indigo-600 dark:text-indigo-400">
                      {circuit.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        circuit.difficulty === 'Beginner'
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                          : circuit.difficulty === 'Intermediate'
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                          : 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                      }`}
                    >
                      {circuit.difficulty}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 leading-snug">
                    {circuit.name}
                  </h4>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {circuit.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Selected Circuit Details & Explainer (7 cols) */}
          <div className="md:col-span-7 p-6 overflow-y-auto max-h-[60vh] flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>{currentCircuit.category}</span>
                </div>
                <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                  {currentCircuit.name}
                </h3>
              </div>

              {/* "What can I learn?" explainer callout */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/70 to-blue-50/50 dark:from-indigo-950/40 dark:to-blue-950/20 border border-indigo-200/80 dark:border-indigo-900/60 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 dark:text-indigo-200">
                  <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>What Can I Learn From This Circuit?</span>
                </div>
                <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-sans">
                  {currentCircuit.whatCanILearn}
                </p>
              </div>

              {/* Quick specs */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800">
                  <span className="text-stone-500 dark:text-stone-400 block text-[11px]">
                    Components
                  </span>
                  <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                    {currentCircuit.components.length} Placed Devices
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-800">
                  <span className="text-stone-500 dark:text-stone-400 block text-[11px]">
                    Jumper Wires
                  </span>
                  <span className="font-bold text-stone-900 dark:text-stone-100 text-sm">
                    {currentCircuit.wires.length} Color-coded Connections
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom action zone */}
            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <p className="text-[11px] text-stone-400 max-w-[60%]">
                Opening this starter circuit loads an editable copy in your sandbox without modifying the template.
              </p>
              <button
                onClick={() => {
                  onSelectCircuit(currentCircuit);
                  onClose();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all"
              >
                <span>Load Starter Circuit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
