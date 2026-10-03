// ==============================================================================
// AccessibleWorkbenchPanel Component: WCAG 2.2 AA Non-Dragging Alternative
// Provides full keyboard, button-operated, and screen-reader accessible alternatives
// for placing parts, moving/rotating components, and connecting jumper wires.
// ==============================================================================

import React, { useState } from 'react';
import {
  Keyboard,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Trash2,
  Plus,
  Layers,
  Cpu,
  Sliders,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  X,
} from 'lucide-react';
import { CircuitComponent } from '../../../types/breadboard';
import { Wire, TerminalPoint } from '../../../utils/wireValidation';
import { ComponentDefinition } from '../../../data/componentLibrary';

interface BreadboardHole {
  id: string;
  name: string;
  type: 'vcc' | 'gnd' | 'pin';
  x: number;
  y: number;
  col: number;
  row?: string;
  rail?: 'top_plus' | 'top_minus' | 'bottom_plus' | 'bottom_minus';
}

interface AccessibleWorkbenchPanelProps {
  components: CircuitComponent[];
  wires: Wire[];
  breadboardHoles: BreadboardHole[];
  allTerminals: TerminalPoint[];
  componentLibrary: ComponentDefinition[];
  onMoveComponent: (id: string, dx: number, dy: number) => void;
  onRotateComponent: (id: string) => void;
  onRemoveComponent: (id: string) => void;
  onRemoveWire: (id: string) => void;
  onAddWire: (fromTerminal: TerminalPoint, toTerminal: TerminalPoint, color: string) => void;
  onPlaceComponentAtHole: (componentType: string, hole: BreadboardHole) => void;
}

export const AccessibleWorkbenchPanel: React.FC<AccessibleWorkbenchPanelProps> = ({
  components,
  wires,
  breadboardHoles,
  allTerminals,
  componentLibrary,
  onMoveComponent,
  onRotateComponent,
  onRemoveComponent,
  onRemoveWire,
  onAddWire,
  onPlaceComponentAtHole,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'components' | 'wires' | 'quick-place'>('components');
  const [isWireModalOpen, setIsWireModalOpen] = useState(false);

  // Wire Modal State
  const [fromTerminalId, setFromTerminalId] = useState<string>('');
  const [toTerminalId, setToTerminalId] = useState<string>('');
  const [selectedWireColor, setSelectedWireColor] = useState<string>('#0284c7');
  const [wireModalError, setWireModalError] = useState<string | null>(null);

  // Quick Place State
  const [placeCompType, setPlaceCompType] = useState<string>(componentLibrary[0]?.type || 'ic_7408');
  const [placeHoleId, setPlaceHoleId] = useState<string>('strip:15:A');

  const handleOpenWireModal = () => {
    setWireModalError(null);
    if (allTerminals.length >= 2) {
      setFromTerminalId(allTerminals[0].id);
      setToTerminalId(allTerminals[1].id);
    }
    setIsWireModalOpen(true);
  };

  const handleConnectWireFromModal = (e: React.FormEvent) => {
    e.preventDefault();
    setWireModalError(null);
    if (!fromTerminalId || !toTerminalId) {
      setWireModalError('Please select both a start terminal and an end terminal.');
      return;
    }
    if (fromTerminalId === toTerminalId) {
      setWireModalError('Cannot connect a terminal to itself. Please pick different start and end points.');
      return;
    }

    const fromTerm = allTerminals.find((t) => t.id === fromTerminalId);
    const toTerm = allTerminals.find((t) => t.id === toTerminalId);

    if (!fromTerm || !toTerm) {
      setWireModalError('Selected terminal could not be found.');
      return;
    }

    onAddWire(fromTerm, toTerm, selectedWireColor);
    setIsWireModalOpen(false);
  };

  const handleQuickPlaceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetHole = breadboardHoles.find((h) => h.id === placeHoleId);
    if (targetHole) {
      onPlaceComponentAtHole(placeCompType, targetHole);
    }
  };

  return (
    <div className="rounded-2xl border border-cream-border dark:border-darklab-border bg-white dark:bg-darklab-card shadow-xs transition-colors overflow-hidden">
      {/* Header Banner & Collapse Toggle */}
      <div className="p-3.5 bg-indigo-50/60 dark:bg-indigo-950/40 border-b border-cream-border dark:border-darklab-border flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
            <Keyboard className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-xs text-ink-900 dark:text-cream-paper">
                Keyboard & Non-Dragging Accessible Workbench
              </h3>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-indigo-200 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-200">
                WCAG 2.2 AA
              </span>
            </div>
            <p className="text-[11px] text-ink-600 dark:text-cream-muted">
              Precision button controls to move parts, rotate ICs, and route jumper wires without dragging.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenWireModal}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Wire via Dialog</span>
          </button>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1.5 rounded-xl border border-cream-border dark:border-darklab-border bg-white dark:bg-darklab-base text-xs font-bold text-ink-700 dark:text-cream-paper hover:bg-cream-soft flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-expanded={isExpanded}
            aria-controls="accessible-workbench-body"
          >
            <span>{isExpanded ? 'Hide Panel' : 'Show Controls'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Controls Body */}
      {isExpanded && (
        <div id="accessible-workbench-body" className="p-4 space-y-4">
          {/* Subtabs */}
          <div className="flex items-center gap-1 border-b border-cream-border dark:border-darklab-border pb-2 text-xs">
            <button
              onClick={() => setActiveTab('components')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                activeTab === 'components'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-ink-600 dark:text-cream-muted hover:bg-cream-soft'
              }`}
            >
              Mounted Components ({components.length})
            </button>
            <button
              onClick={() => setActiveTab('wires')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                activeTab === 'wires'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-ink-600 dark:text-cream-muted hover:bg-cream-soft'
              }`}
            >
              Connected Wires ({wires.length})
            </button>
            <button
              onClick={() => setActiveTab('quick-place')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                activeTab === 'quick-place'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-ink-600 dark:text-cream-muted hover:bg-cream-soft'
              }`}
            >
              Place Part by Coordinate
            </button>
          </div>

          {/* TAB 1: Components List with Accessible Nudge / Rotate / Delete Buttons */}
          {activeTab === 'components' && (
            <div className="space-y-3">
              {components.length === 0 ? (
                <p className="text-xs text-ink-500 dark:text-cream-muted py-3 italic">
                  No components placed on breadboard yet. Use the "Place Part by Coordinate" tab or click a component in the palette to place.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {components.map((comp) => (
                    <div
                      key={comp.id}
                      className="p-3 rounded-xl border border-cream-border dark:border-darklab-border bg-cream-soft/50 dark:bg-darklab-base/60 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-ink-900 dark:text-cream-paper flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                          <span>{comp.name}</span>
                        </span>
                        <span className="font-mono text-[10px] text-ink-500 dark:text-cream-muted">
                          Pos: ({Math.round(comp.x)}, {Math.round(comp.y)}) • {comp.rotation}°
                        </span>
                      </div>

                      {/* Directional Nudge Buttons (Non-Dragging Alternative) */}
                      <div className="flex items-center justify-between gap-1 pt-1 border-t border-cream-border/60 dark:border-darklab-border/60">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => onMoveComponent(comp.id, -10, 0)}
                            className="p-1.5 rounded-lg border border-cream-border dark:border-darklab-border bg-white dark:bg-darklab-card hover:bg-indigo-50 text-ink-700 dark:text-cream-paper focus-visible:ring-2 focus-visible:ring-indigo-500"
                            aria-label={`Move ${comp.name} left 10 pixels`}
                            title="Move Left 10px"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onMoveComponent(comp.id, 10, 0)}
                            className="p-1.5 rounded-lg border border-cream-border dark:border-darklab-border bg-white dark:bg-darklab-card hover:bg-indigo-50 text-ink-700 dark:text-cream-paper focus-visible:ring-2 focus-visible:ring-indigo-500"
                            aria-label={`Move ${comp.name} right 10 pixels`}
                            title="Move Right 10px"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onMoveComponent(comp.id, 0, -10)}
                            className="p-1.5 rounded-lg border border-cream-border dark:border-darklab-border bg-white dark:bg-darklab-card hover:bg-indigo-50 text-ink-700 dark:text-cream-paper focus-visible:ring-2 focus-visible:ring-indigo-500"
                            aria-label={`Move ${comp.name} up 10 pixels`}
                            title="Move Up 10px"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onMoveComponent(comp.id, 0, 10)}
                            className="p-1.5 rounded-lg border border-cream-border dark:border-darklab-border bg-white dark:bg-darklab-card hover:bg-indigo-50 text-ink-700 dark:text-cream-paper focus-visible:ring-2 focus-visible:ring-indigo-500"
                            aria-label={`Move ${comp.name} down 10 pixels`}
                            title="Move Down 10px"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onRotateComponent(comp.id)}
                            className="p-1.5 rounded-lg border border-cream-border dark:border-darklab-border bg-white dark:bg-darklab-card hover:bg-indigo-50 text-ink-700 dark:text-cream-paper focus-visible:ring-2 focus-visible:ring-indigo-500"
                            aria-label={`Rotate ${comp.name} 90 degrees`}
                            title="Rotate 90°"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveComponent(comp.id)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900 focus-visible:ring-2 focus-visible:ring-rose-500"
                          aria-label={`Delete ${comp.name}`}
                          title="Delete Component"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Wires List */}
          {activeTab === 'wires' && (
            <div className="space-y-2">
              {wires.length === 0 ? (
                <p className="text-xs text-ink-500 dark:text-cream-muted py-3 italic">
                  No wires placed. Click "Add Wire via Dialog" to create a connection.
                </p>
              ) : (
                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  {wires.map((wire, idx) => (
                    <div
                      key={wire.id}
                      className="p-2 rounded-xl border border-cream-border dark:border-darklab-border bg-cream-soft/50 dark:bg-darklab-base/60 flex items-center justify-between text-xs gap-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/20"
                          style={{ backgroundColor: wire.color }}
                        />
                        <span className="font-mono text-[11px] font-bold text-ink-700 dark:text-cream-muted">
                          #{idx + 1}
                        </span>
                        <span className="truncate text-ink-900 dark:text-cream-paper">
                          {wire.from.label || wire.fromId} → {wire.to.label || wire.toId}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveWire(wire.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-100 text-rose-600 dark:hover:bg-rose-950/60 dark:text-rose-300 shrink-0 focus-visible:ring-2 focus-visible:ring-rose-500"
                        aria-label={`Delete wire from ${wire.from.label} to ${wire.to.label}`}
                        title="Delete Wire"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Quick Place by Coordinate */}
          {activeTab === 'quick-place' && (
            <form onSubmit={handleQuickPlaceSubmit} className="space-y-3 max-w-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-ink-800 dark:text-cream-paper mb-1">
                    Select Component:
                  </label>
                  <select
                    value={placeCompType}
                    onChange={(e) => setPlaceCompType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-cream-border dark:border-darklab-border bg-cream-soft dark:bg-darklab-base text-ink-900 dark:text-cream-paper"
                  >
                    {componentLibrary.map((c) => (
                      <option key={c.type} value={c.type}>
                        {c.name} ({c.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-ink-800 dark:text-cream-paper mb-1">
                    Target Breadboard Tie-Point:
                  </label>
                  <select
                    value={placeHoleId}
                    onChange={(e) => setPlaceHoleId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-cream-border dark:border-darklab-border bg-cream-soft dark:bg-darklab-base text-ink-900 dark:text-cream-paper"
                  >
                    <optgroup label="Terminal Strip (Cols 1-30)">
                      {breadboardHoles
                        .filter((h) => h.row)
                        .slice(0, 100)
                        .map((h) => (
                          <option key={h.id} value={h.id}>
                            {h.name}
                          </option>
                        ))}
                    </optgroup>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Place Component at Target Hole</span>
              </button>
            </form>
          )}
        </div>
      )}

      {/* Accessible "Add Wire" Modal Dialog */}
      {isWireModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="a11y-wire-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn"
        >
          <div className="w-full max-w-lg bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-cream-border dark:border-darklab-border pb-3">
              <div className="flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 id="a11y-wire-title" className="font-display font-black text-sm sm:text-base text-ink-900 dark:text-cream-paper">
                  Add Jumper Wire (Accessible Dialog)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsWireModalOpen(false)}
                className="p-1 rounded-lg text-ink-400 hover:text-ink-700 dark:hover:text-white"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {wireModalError && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-200 text-xs font-bold">
                {wireModalError}
              </div>
            )}

            <form onSubmit={handleConnectWireFromModal} className="space-y-4 text-xs font-sans">
              <div>
                <label htmlFor="wire-from-select" className="block font-bold text-ink-800 dark:text-cream-paper mb-1">
                  Start Terminal (From):
                </label>
                <select
                  id="wire-from-select"
                  value={fromTerminalId}
                  onChange={(e) => setFromTerminalId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-cream-border dark:border-darklab-border bg-cream-soft dark:bg-darklab-base text-ink-900 dark:text-cream-paper font-mono text-[11px]"
                >
                  <optgroup label="Power Rails">
                    {allTerminals
                      .filter((t) => t.type === 'vcc' || t.type === 'gnd')
                      .slice(0, 30)
                      .map((t) => (
                        <option key={`from-${t.id}`} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Component Pins">
                    {allTerminals
                      .filter((t) => t.id.includes(':'))
                      .map((t) => (
                        <option key={`from-${t.id}`} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Breadboard Holes">
                    {allTerminals
                      .filter((t) => t.id.startsWith('strip:'))
                      .slice(0, 60)
                      .map((t) => (
                        <option key={`from-${t.id}`} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label htmlFor="wire-to-select" className="block font-bold text-ink-800 dark:text-cream-paper mb-1">
                  Destination Terminal (To):
                </label>
                <select
                  id="wire-to-select"
                  value={toTerminalId}
                  onChange={(e) => setToTerminalId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-cream-border dark:border-darklab-border bg-cream-soft dark:bg-darklab-base text-ink-900 dark:text-cream-paper font-mono text-[11px]"
                >
                  <optgroup label="Component Pins">
                    {allTerminals
                      .filter((t) => t.id.includes(':'))
                      .map((t) => (
                        <option key={`to-${t.id}`} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Power Rails">
                    {allTerminals
                      .filter((t) => t.type === 'vcc' || t.type === 'gnd')
                      .slice(0, 30)
                      .map((t) => (
                        <option key={`to-${t.id}`} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Breadboard Holes">
                    {allTerminals
                      .filter((t) => t.id.startsWith('strip:'))
                      .slice(0, 60)
                      .map((t) => (
                        <option key={`to-${t.id}`} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="block font-bold text-ink-800 dark:text-cream-paper mb-1">
                  Wire Color:
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { color: '#ef4444', label: 'Red (VCC)' },
                    { color: '#1c1917', label: 'Black (GND)' },
                    { color: '#0284c7', label: 'Blue' },
                    { color: '#10b981', label: 'Green' },
                    { color: '#f59e0b', label: 'Amber' },
                    { color: '#a855f7', label: 'Purple' },
                    { color: '#ffffff', label: 'White' },
                  ].map((c) => (
                    <label
                      key={c.color}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-cream-border dark:border-darklab-border cursor-pointer hover:bg-cream-soft"
                    >
                      <input
                        type="radio"
                        name="wire-color"
                        value={c.color}
                        checked={selectedWireColor === c.color}
                        onChange={() => setSelectedWireColor(c.color)}
                        className="sr-only"
                      />
                      <span
                        className={`w-3.5 h-3.5 rounded-full border border-black/20 ${
                          selectedWireColor === c.color ? 'ring-2 ring-indigo-600 scale-110' : ''
                        }`}
                        style={{ backgroundColor: c.color }}
                      />
                      <span className="text-[11px] font-bold text-ink-700 dark:text-cream-muted">{c.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-cream-border dark:border-darklab-border">
                <button
                  type="button"
                  onClick={() => setIsWireModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-ink-700 dark:text-cream-muted font-bold hover:bg-cream-soft"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  Connect Jumper Wire
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
