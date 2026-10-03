import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Info,
  Layers,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Zap,
  ToggleLeft,
  Sun,
  Activity,
  Maximize2,
} from 'lucide-react';
import { COMPONENT_LIBRARY, ComponentDefinition } from '../../../data/componentLibrary';
import { ComponentCategory } from '../../../types/breadboard';

interface ComponentPaletteProps {
  onSelectComponentToPlace: (def: ComponentDefinition) => void;
  onOpenInfo: (def: ComponentDefinition) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  position?: 'left' | 'right';
}

export const ComponentPalette: React.FC<ComponentPaletteProps> = ({
  onSelectComponentToPlace,
  onOpenInfo,
  isOpen,
  onToggleOpen,
  position = 'right',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'microcontrollers', label: 'Microcontrollers & Boards' },
    { id: 'logic_ic', label: 'Logic ICs' },
    { id: 'sequential_ic', label: 'Sequential / 555' },
    { id: 'passives', label: 'Passives' },
    { id: 'switches', label: 'Switches' },
    { id: 'outputs', label: 'Displays & LEDs' },
    { id: 'power', label: 'Power Sources' },
    { id: 'sensors', label: 'Sensors' },
    { id: 'modules', label: 'Modules' },
  ];

  const filteredComponents = useMemo(() => {
    return COMPONENT_LIBRARY.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.type.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat =
        selectedCategory === 'all' || c.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [searchTerm, selectedCategory]);

  const isRight = position === 'right';

  return (
    <div
      className={`relative flex flex-col bg-white dark:bg-stone-900 ${
        isRight
          ? 'border-l border-stone-200 dark:border-stone-800'
          : 'border-r border-stone-200 dark:border-stone-800'
      } transition-all duration-300 z-20 ${
        isOpen ? 'w-80' : 'w-12'
      }`}
    >
      {/* Toggle button */}
      <button
        onClick={onToggleOpen}
        title={isOpen ? 'Collapse Component Palette' : 'Expand Component Palette'}
        className={`absolute ${
          isRight ? '-left-3.5' : '-right-3.5'
        } top-6 z-30 p-1 rounded-full bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 shadow-md text-stone-600 dark:text-stone-300 hover:text-indigo-600 transition-colors`}
      >
        {isRight ? (
          isOpen ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />
        ) : (
          isOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />
        )}
      </button>

      {/* Collapsed state mini-strip */}
      {!isOpen && (
        <div className="flex flex-col items-center py-6 gap-6 text-stone-400">
          <button
            onClick={onToggleOpen}
            className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300"
            title="Expand Palette"
          >
            <Layers className="w-5 h-5" />
          </button>
          <span className="[writing-mode:vertical-rl] text-xs font-bold tracking-widest uppercase text-stone-400">
            Component Library
          </span>
        </div>
      )}

      {/* Expanded Palette Content */}
      {isOpen && (
        <div className="flex flex-col h-full overflow-hidden text-xs">
          {/* Header */}
          <div className="p-3.5 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/40">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 font-bold text-stone-900 dark:text-stone-100">
                <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Component Palette</span>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900">
                {COMPONENT_LIBRARY.length} parts
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-stone-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search ICs, LEDs, resistors..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Categories Pill Scroller */}
          <div className="p-2 border-b border-stone-200 dark:border-stone-800 flex items-center gap-1 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Component Items List */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
            {filteredComponents.length === 0 ? (
              <div className="text-center py-8 text-stone-400">
                <p>No components match "{searchTerm}"</p>
              </div>
            ) : (
              filteredComponents.map((comp) => (
                <div
                  key={comp.type}
                  className="group p-2.5 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-stone-900/60 hover:bg-stone-50 dark:hover:bg-stone-800/40 shadow-xs transition-all flex items-start gap-2.5"
                >
                  <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 shrink-0 group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:group-hover:bg-indigo-950/60 dark:group-hover:text-indigo-400 transition-colors">
                    {comp.category === 'logic_ic' || comp.category === 'sequential_ic' ? (
                      <Cpu className="w-4 h-4" />
                    ) : comp.category === 'outputs' ? (
                      <Sun className="w-4 h-4" />
                    ) : comp.category === 'switches' ? (
                      <ToggleLeft className="w-4 h-4" />
                    ) : (
                      <Zap className="w-4 h-4" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-stone-800 dark:text-stone-200 truncate text-[11px]">
                        {comp.name}
                      </h4>
                      <span className="text-[9px] font-mono text-stone-400 shrink-0">
                        {comp.pins.length}p
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-500 dark:text-stone-400 line-clamp-1 mt-0.5">
                      {comp.description}
                    </p>

                    <div className="flex items-center gap-1.5 mt-2 pt-1 border-t border-stone-100 dark:border-stone-800">
                      <button
                        onClick={() => onSelectComponentToPlace(comp)}
                        className="flex-1 inline-flex items-center justify-center gap-1 py-1 rounded bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-[10px] transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Place</span>
                      </button>
                      <button
                        onClick={() => onOpenInfo(comp)}
                        title="View Pinout & Specs"
                        className="p-1 rounded text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
