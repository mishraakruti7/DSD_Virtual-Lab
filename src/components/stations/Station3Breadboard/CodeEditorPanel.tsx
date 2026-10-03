import React, { useState } from 'react';
import { Play, Square, RotateCcw, Terminal, FileCode, Check, AlertCircle } from 'lucide-react';
import { STARTER_CIRCUITS } from '../../../data/starterCircuits';

interface CodeEditorPanelProps {
  code: string;
  onChangeCode: (newCode: string) => void;
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  activeError: string | null;
  onSelectExample?: (code: string) => void;
}

export const CodeEditorPanel: React.FC<CodeEditorPanelProps> = ({
  code,
  onChangeCode,
  isRunning,
  onStart,
  onStop,
  onReset,
  activeError,
  onSelectExample,
}) => {
  const [selectedExampleId, setSelectedExampleId] = useState<string>('mcu-blink');

  const mcuExamples = STARTER_CIRCUITS.filter(
    (c) => c.category === 'Microcontrollers' && c.sketchCode
  );

  const handleSelectExample = (id: string) => {
    setSelectedExampleId(id);
    const ex = mcuExamples.find((c) => c.id === id);
    if (ex && ex.sketchCode) {
      onChangeCode(ex.sketchCode);
      if (onSelectExample) onSelectExample(ex.sketchCode);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#181824] text-stone-200 border-l border-stone-800 select-none">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#12121a] border-b border-stone-800">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-emerald-400" />
          <span className="font-mono text-xs font-bold text-white tracking-wide">
            sketch.ino
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
            C++ / Arduino
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Examples Preset Selector */}
          <select
            value={selectedExampleId}
            onChange={(e) => handleSelectExample(e.target.value)}
            className="text-[11px] bg-stone-800 border border-stone-700 text-stone-300 rounded px-2 py-1 outline-hidden hover:border-emerald-500 focus:border-emerald-500 transition-colors"
          >
            {mcuExamples.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>

          {isRunning ? (
            <button
              onClick={onStop}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md transition-colors"
              title="Stop Sketch Execution"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop</span>
            </button>
          ) : (
            <button
              onClick={onStart}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-colors"
              title="Compile and Upload Sketch to Virtual Arduino"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Upload & Run</span>
            </button>
          )}

          <button
            onClick={onReset}
            className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition-colors"
            title="Reset Board & Sketch"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Error Callout if sketch failed */}
      {activeError && (
        <div className="px-3 py-2 bg-rose-950/80 border-b border-rose-800 text-rose-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span className="font-mono text-[11px] leading-tight break-all">
            {activeError}
          </span>
        </div>
      )}

      {/* Code Textarea Editor with Line Numbers */}
      <div className="flex-1 relative flex overflow-hidden font-mono text-xs leading-5">
        <textarea
          value={code}
          onChange={(e) => onChangeCode(e.target.value)}
          spellCheck={false}
          className="w-full h-full p-3 bg-[#1e1e2d] text-stone-100 resize-none outline-hidden font-mono text-xs leading-5 focus:ring-1 focus:ring-emerald-500/40"
        />
      </div>

      {/* Editor Footer Status */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#12121a] border-t border-stone-800 text-[10px] text-stone-400 font-mono">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <span
              className={`w-2 h-2 rounded-full ${
                isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-stone-500'
              }`}
            />
            {isRunning ? 'RUNNING (Loop Active)' : 'IDLE (Ready)'}
          </span>
        </div>
        <span>ATmega328P @ 16 MHz</span>
      </div>
    </div>
  );
};
