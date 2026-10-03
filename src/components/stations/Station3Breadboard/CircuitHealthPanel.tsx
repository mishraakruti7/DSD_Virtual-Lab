import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sparkles,
  BookOpen,
  FileText,
  CheckCircle2,
  Cpu,
  Layers,
  HelpCircle,
  Terminal,
  Activity,
  Send,
  Trash2,
} from 'lucide-react';
import { CircuitHealthIssue, CircuitComponent } from '../../../types/breadboard';
import { BreadboardPreset } from '../../../data/breadboardPresets';
import { COMPONENT_LIBRARY } from '../../../data/componentLibrary';

export interface ConsoleLogEntry {
  time: string;
  type: 'info' | 'warn' | 'success' | 'phy';
  msg: string;
}

interface CircuitHealthPanelProps {
  issues: CircuitHealthIssue[];
  activePreset?: BreadboardPreset | null;
  selectedComponent?: CircuitComponent | null;
  onNavigateToLab?: (id: number) => void;
  onAskAiAboutIssue?: (issue: CircuitHealthIssue) => void;
  consoleLogs?: ConsoleLogEntry[];
  simulationTime?: string;
  isPowerOn?: boolean;
  onClearLogs?: () => void;
}

export const CircuitHealthPanel: React.FC<CircuitHealthPanelProps> = ({
  issues,
  activePreset,
  selectedComponent,
  onNavigateToLab,
  onAskAiAboutIssue,
  consoleLogs = [],
  simulationTime = '00:00.000 (100%)',
  isPowerOn = true,
  onClearLogs,
}) => {
  const [activeTab, setActiveTab] = useState<'health' | 'console' | 'serial' | 'docs' | 'reference'>('health');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [serialInput, setSerialInput] = useState<string>('');
  const [serialOutputs, setSerialOutputs] = useState<string[]>([
    'Virtual DSD Serial Bus initialized. Ready for UART/Probe frames.',
    'LOGIC_LEVEL: TTL 5.0V | BAUD: 9600 | SAMPLING: 1.6 kHz',
  ]);

  const handleSendSerial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serialInput.trim()) return;
    setSerialOutputs((prev) => [
      ...prev,
      `> TX: ${serialInput.trim()}`,
      `< RX: ACK [${serialInput.trim()}] processed at ${simulationTime}`,
    ]);
    setSerialInput('');
  };

  const errorCount = issues.filter((i) => i.severity === 'error').length;
  const warningCount = issues.filter((i) => i.severity === 'warning').length;

  const selectedDef = selectedComponent
    ? COMPONENT_LIBRARY.find((c) => c.type === selectedComponent.type)
    : null;

  return (
    <div className="border-t border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-lg text-xs transition-colors z-20">
      {/* Docked Tab Bar Header (Height ~38px) */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-stone-50 dark:bg-stone-800/80 border-b border-stone-200 dark:border-stone-700 select-none flex-wrap gap-2">
        {/* Left: Tab Switcher */}
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          {/* Tab 1: Circuit Health */}
          <button
            onClick={() => {
              setActiveTab('health');
              if (!isExpanded) setIsExpanded(true);
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
              activeTab === 'health' && isExpanded
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            {errorCount > 0 ? (
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            ) : warningCount > 0 ? (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            )}
            <span>Circuit Health</span>
            {issues.length > 0 ? (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                  errorCount > 0
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                }`}
              >
                {issues.length}
              </span>
            ) : (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                0
              </span>
            )}
          </button>

          {/* Tab 2: Runtime Console (VBB Style) */}
          <button
            onClick={() => {
              setActiveTab('console');
              if (!isExpanded) setIsExpanded(true);
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
              activeTab === 'console' && isExpanded
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-500" />
            <span>Runtime Console</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
              {consoleLogs.length}
            </span>
          </button>

          {/* Tab 3: Serial / Logic Probe */}
          <button
            onClick={() => {
              setActiveTab('serial');
              if (!isExpanded) setIsExpanded(true);
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
              activeTab === 'serial' && isExpanded
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-purple-500" />
            <span>Serial Monitor</span>
          </button>

          {/* Tab 4: Docs / Learn */}
          <button
            onClick={() => {
              setActiveTab('docs');
              if (!isExpanded) setIsExpanded(true);
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
              activeTab === 'docs' && isExpanded
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            <span>Docs / Learn</span>
            {selectedComponent && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                {selectedComponent.name.split(' ')[0]}
              </span>
            )}
          </button>

          {/* Tab 5: Reference */}
          <button
            onClick={() => {
              setActiveTab('reference');
              if (!isExpanded) setIsExpanded(true);
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs transition-colors ${
              activeTab === 'reference' && isExpanded
                ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-cyan-500" />
            <span>Reference</span>
            {activePreset && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-cyan-100 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300">
                Lab {activePreset.labNumber}
              </span>
            )}
          </button>
        </div>

        {/* Right: Expand / Collapse Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 rounded-lg text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors flex items-center gap-1 text-[11px] font-medium"
          title={isExpanded ? 'Collapse docked panel' : 'Expand docked panel'}
        >
          <span className="hidden sm:inline">{isExpanded ? 'Collapse' : 'Expand'}</span>
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Collapsible Panel Content Deck */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 max-h-56 overflow-y-auto">
              {/* TAB 1: CIRCUIT HEALTH */}
              {activeTab === 'health' && (
                <div className="space-y-2.5">
                  {issues.length === 0 ? (
                    <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-200">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-emerald-950 dark:text-emerald-100">
                          Circuit Health: Optimal (0 issues)
                        </p>
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">
                          All placed components are correctly powered (+5V / GND) with correct polarities and current-limiting resistors in place.
                        </p>
                      </div>
                    </div>
                  ) : (
                    issues.map((issue) => {
                      const isErr = issue.severity === 'error';
                      const isWarn = issue.severity === 'warning';

                      return (
                        <div
                          key={issue.id}
                          className={`p-3 rounded-xl border text-left transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-3 ${
                            isErr
                              ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50'
                              : isWarn
                              ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50'
                              : 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50'
                          }`}
                        >
                          <div className="flex items-start gap-2.5 flex-1 min-w-0">
                            {isErr ? (
                              <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                            ) : isWarn ? (
                              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                            ) : (
                              <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                            )}
                            <div>
                              <p
                                className={`font-bold text-xs ${
                                  isErr
                                    ? 'text-rose-900 dark:text-rose-200'
                                    : isWarn
                                    ? 'text-amber-900 dark:text-amber-200'
                                    : 'text-blue-900 dark:text-blue-200'
                                }`}
                              >
                                {issue.title}
                              </p>
                              <p className="text-stone-600 dark:text-stone-300 mt-0.5 leading-relaxed text-[11px]">
                                {issue.reason}
                              </p>
                              {issue.fixSuggestion && (
                                <p className="mt-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                                  💡 <strong>Fix:</strong> {issue.fixSuggestion}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Ask AI Assistant */}
                          {onAskAiAboutIssue && (
                            <button
                              onClick={() => onAskAiAboutIssue(issue)}
                              className="shrink-0 self-start inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-purple-100 hover:bg-purple-200 dark:bg-purple-950/60 dark:hover:bg-purple-900/80 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800 transition-colors"
                            >
                              <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                              <span>Ask AI Tutor</span>
                            </button>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* TAB 2: RUNTIME CONSOLE (VBB Style) */}
              {activeTab === 'console' && (
                <div className="space-y-2 font-mono text-[11px]">
                  <div className="flex items-center justify-between pb-1.5 border-b border-stone-200 dark:border-stone-800 text-stone-500">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-bold text-stone-800 dark:text-stone-200">
                        Hardware Abstraction & PHY Engine Bus
                      </span>
                      <span className="text-stone-400">({simulationTime})</span>
                    </div>
                    {onClearLogs && (
                      <button
                        onClick={onClearLogs}
                        className="flex items-center gap-1 text-[10px] text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
                        title="Clear console output"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Clear</span>
                      </button>
                    )}
                  </div>

                  <div className="bg-[#0b0f19] text-stone-200 rounded-xl p-3 max-h-44 overflow-y-auto space-y-1.5 border border-stone-800 shadow-inner">
                    {consoleLogs.length === 0 ? (
                      <div className="text-stone-500 italic py-2">
                        No console events recorded. Toggle power switch or place components to see hardware frames.
                      </div>
                    ) : (
                      consoleLogs.map((log, idx) => (
                        <div key={idx} className="flex items-start gap-2 leading-relaxed">
                          <span className="text-stone-500 text-[10px] select-none shrink-0 font-bold">
                            [{log.time}]
                          </span>
                          <span
                            className={`shrink-0 px-1 py-0.2 rounded text-[9px] uppercase font-bold ${
                              log.type === 'phy'
                                ? 'bg-sky-950 text-sky-400 border border-sky-800'
                                : log.type === 'success'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : log.type === 'warn'
                                ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                : 'bg-purple-950 text-purple-400 border border-purple-800'
                            }`}
                          >
                            {log.type}
                          </span>
                          <span
                            className={`flex-1 break-all ${
                              log.type === 'warn'
                                ? 'text-amber-300'
                                : log.type === 'success'
                                ? 'text-emerald-300'
                                : 'text-stone-300'
                            }`}
                          >
                            {log.msg}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: SERIAL MONITOR / LOGIC PROBE */}
              {activeTab === 'serial' && (
                <div className="space-y-2.5 font-mono text-[11px]">
                  <div className="flex items-center justify-between pb-1.5 border-b border-stone-200 dark:border-stone-800 text-stone-500">
                    <span className="font-bold text-stone-800 dark:text-stone-200">
                      UART Serial Bus Terminal • 9600 Baud
                    </span>
                    <span className="text-[10px] text-stone-400">
                      Power: {isPowerOn ? '⚡ Energized (+5.0V)' : '○ De-energized (0.0V)'}
                    </span>
                  </div>

                  <div className="bg-[#0b0f19] text-emerald-400 rounded-xl p-3 h-28 overflow-y-auto space-y-1 border border-stone-800 shadow-inner">
                    {serialOutputs.map((line, idx) => (
                      <div key={idx} className="leading-relaxed">
                        {line}
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendSerial} className="flex gap-2">
                    <input
                      type="text"
                      value={serialInput}
                      onChange={(e) => setSerialInput(e.target.value)}
                      placeholder="Type serial frame or command (e.g. GET_STATE, PULSE_CLK)..."
                      className="flex-1 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white outline-none text-xs"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Send className="w-3 h-3" />
                      <span>Send</span>
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 4: DOCS / LEARN */}
              {activeTab === 'docs' && (
                <div>
                  {selectedDef ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
                        <div>
                          <h4 className="font-display font-extrabold text-sm text-stone-900 dark:text-stone-100">
                            {selectedDef.name}
                          </h4>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400">
                            {selectedDef.description}
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 uppercase">
                          {selectedDef.category}
                        </span>
                      </div>

                      {/* Pinout Description */}
                      <div className="pt-1">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                          Pinout Connections:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5 font-mono text-[11px]">
                          {selectedDef.pinoutDescription.map((desc, idx) => (
                            <div
                              key={idx}
                              className="p-1.5 rounded-md bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300"
                            >
                              {desc}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : activePreset ? (
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-display font-extrabold text-sm text-stone-900 dark:text-stone-100">
                          {activePreset.name}
                        </h4>
                        <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-1 leading-relaxed">
                          {activePreset.whatCanILearn}
                        </p>
                      </div>

                      {/* Truth table / testbench preview if available */}
                      {activePreset.testbench && (
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                            Expected Truth Table:
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-[11px] border-collapse font-mono">
                              <thead>
                                <tr className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-b border-stone-200 dark:border-stone-700">
                                  {activePreset.testbench.inputs.map((inp) => (
                                    <th key={inp.name} className="p-1.5 text-center font-bold">
                                      {inp.label}
                                    </th>
                                  ))}
                                  {activePreset.testbench.outputs.map((out) => (
                                    <th key={out.name} className="p-1.5 text-center font-bold text-indigo-600 dark:text-indigo-400">
                                      {out.label}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {activePreset.testbench.truthTable.map((row, idx) => (
                                  <tr
                                    key={idx}
                                    className="border-b border-stone-100 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800/40 text-center"
                                  >
                                    {activePreset.testbench!.inputs.map((inp) => (
                                      <td key={inp.name} className="p-1 text-stone-800 dark:text-stone-200">
                                        {row.inputs[inp.name]}
                                      </td>
                                    ))}
                                    {activePreset.testbench!.outputs.map((out) => (
                                      <td key={out.name} className="p-1 font-bold text-indigo-700 dark:text-indigo-300">
                                        {row.outputs[out.name]}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-stone-500 dark:text-stone-400">
                      <HelpCircle className="w-5 h-5 mx-auto mb-1 text-stone-400" />
                      <p>Select any placed component on the breadboard or load an experiment preset to inspect its datasheet and truth table.</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: REFERENCE */}
              {activeTab === 'reference' && (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50">
                    <div>
                      <p className="font-bold text-xs text-indigo-950 dark:text-indigo-100">
                        {activePreset ? `Curriculum Practical: Lab ${activePreset.labNumber}` : 'Digital System Design (ECCOR2PC203)'}
                      </p>
                      <p className="text-[11px] text-indigo-700 dark:text-indigo-300 mt-0.5">
                        Mumbai University Syllabus • SAKEC Department of Electronics & Computer Science
                      </p>
                    </div>
                    {activePreset && onNavigateToLab && (
                      <button
                        onClick={() => onNavigateToLab(activePreset.labNumber)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open Lab Manual</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                    <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                      <p className="font-bold text-stone-800 dark:text-stone-200">Standard TTL Logic</p>
                      <p className="text-stone-500 dark:text-stone-400 mt-0.5">
                        VCC = +5.0V (±5%), GND = 0V. HIGH ≥ 2.0V, LOW ≤ 0.8V.
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                      <p className="font-bold text-stone-800 dark:text-stone-200">LED Current Limiting</p>
                      <p className="text-stone-500 dark:text-stone-400 mt-0.5">
                        R = (5V - 1.8V) / 10mA ≈ 330Ω in series with Anode (+).
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
                      <p className="font-bold text-stone-800 dark:text-stone-200">Floating Inputs Caution</p>
                      <p className="text-stone-500 dark:text-stone-400 mt-0.5">
                        Unconnected TTL inputs float HIGH but pick up 50Hz hum.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
