import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  FolderOpen,
  Save,
  Trash2,
  Calendar,
  Sparkles,
  ArrowRight,
  PlusCircle,
  FileCode,
} from 'lucide-react';
import { SavedCircuitItem } from '../../../services/cloudSync';

interface ProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  circuits: SavedCircuitItem[];
  onLoadCircuit: (circuit: SavedCircuitItem) => void;
  onDeleteCircuit: (id: string) => void;
  onNewProject: () => void;
}

export const ProjectsModal: React.FC<ProjectsModalProps> = ({
  isOpen,
  onClose,
  circuits,
  onLoadCircuit,
  onDeleteCircuit,
  onNewProject,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-800/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-base">
                My Saved Circuits & Projects
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Synchronized with your lab profile in Supabase cloud storage.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list or friendly empty state */}
        <div className="p-5 flex-1 overflow-y-auto space-y-3">
          {circuits.length === 0 ? (
            <div className="text-center py-10 px-4 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto border border-indigo-200 dark:border-indigo-900">
                <FileCode className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-stone-800 dark:text-stone-200 text-sm">
                No saved circuits yet
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs mx-auto leading-relaxed">
                Build a circuit using the component palette, place wires between terminals, and click "Save Circuit" to store your work here.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    onNewProject();
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Start a Blank Project</span>
                </button>
              </div>
            </div>
          ) : (
            circuits.map((item) => {
              const compCount = Array.isArray(item.circuit_json?.components)
                ? item.circuit_json.components.length
                : item.circuit_json?.installedIc ? 4 : 0;
              const wireCount = Array.isArray(item.circuit_json?.wires)
                ? item.circuit_json.wires.length
                : 0;

              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-stone-900/60 shadow-xs flex items-center justify-between transition-all"
                >
                  <div>
                    <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                      {item.name || 'Untitled Circuit'}
                    </h4>
                    <div className="flex items-center gap-3 text-[11px] text-stone-400 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span>{compCount} components</span>
                      <span>•</span>
                      <span>{wireCount} wires</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onDeleteCircuit(item.id)}
                      title="Delete circuit"
                      className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onLoadCircuit(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 transition-colors"
                    >
                      <span>Open</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-800/30">
          <button
            onClick={() => {
              onNewProject();
              onClose();
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create Blank Project</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
