import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToggleSwitch } from '../../common/ToggleSwitch';
import { LedIndicator } from '../../common/LedIndicator';
import { getCatenaryPath } from '../../../utils/catenary';
import {
  Layers,
  RotateCcw,
  Zap,
  Sparkles,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  HelpCircle,
  Cpu,
  Eye,
  PlusCircle,
  Flame,
  Activity,
  FolderOpen,
  Save,
  Undo2,
  Redo2,
} from 'lucide-react';
import { Stack, Graph, DirectedAcyclicGraph, HashTable } from '../../../dsa';
import confetti from 'canvas-confetti';
import { useAuth } from '../../../context/AuthContext';
import {
  saveCircuit,
  fetchSavedCircuits,
  deleteSavedCircuit,
  SavedCircuitItem,
} from '../../../services/cloudSync';
import {
  playSoftClick,
  playConnectClick,
  playSuccessChime,
  playAlarmBuzz
} from '../../../utils/soundEffects';
import { useCourseStore } from '../../../store/useCourseStore';

interface TerminalPoint {
  id: string;
  name: string;
  x: number;
  y: number;
  type: 'vcc' | 'gnd' | 'input' | 'output' | 'pin';
}

interface Wire {
  id: string;
  fromId: string;
  toId: string;
  color: string;
  from: { x: number; y: number; label: string };
  to: { x: number; y: number; label: string };
}

export const VirtualBreadboard: React.FC = () => {
  const { unlockAchievement } = useCourseStore();

  // Available IC options
  const [installedIc, setInstalledIc] = useState<'7408' | '7432' | '7404' | '7400' | '7486'>('7408');

  // Input switches mounted on breadboard
  const [swA, setSwA] = useState<boolean>(true);
  const [swB, setSwB] = useState<boolean>(true);

  // Wire routing state
  const [canvasContrast, setCanvasContrast] = useState<'light' | 'dark'>('light');
  const [wireColor, setWireColor] = useState<string>('#0284c7');
  const [wiringFrom, setWiringFrom] = useState<TerminalPoint | null>(null);
  const [probeMode, setProbeMode] = useState<boolean>(false);
  const [probeReading, setProbeReading] = useState<{ pin: string; voltage: string; note: string } | null>(null);

  // Verification payoff state
  const [verifierSweep, setVerifierSweep] = useState<boolean>(false);
  const [verifierMessage, setVerifierMessage] = useState<string | null>(null);

  // Saved Circuits State (Cloud / Local)
  const { user } = useAuth();
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [loadModalOpen, setLoadModalOpen] = useState(false);
  const [circuitName, setCircuitName] = useState('');
  const [savedCircuitsList, setSavedCircuitsList] = useState<SavedCircuitItem[]>([]);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const handleOpenLoadModal = async () => {
    const list = await fetchSavedCircuits(user?.id || '');
    setSavedCircuitsList(list);
    setLoadModalOpen(true);
  };

  const handleSaveCurrentCircuit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!circuitName.trim()) return;

    const circuitPayload = {
      installedIc,
      swA,
      swB,
      wires,
    };

    const res = await saveCircuit(user?.id || null, circuitName.trim(), circuitPayload);
    if (res.success) {
      playSuccessChime();
      setSaveSuccessMsg(`Circuit "${circuitName}" saved successfully!`);
      setTimeout(() => {
        setSaveSuccessMsg(null);
        setSaveModalOpen(false);
        setCircuitName('');
      }, 1400);
    }
  };

  const handleLoadCircuit = (circuit: SavedCircuitItem) => {
    if (circuit.circuit_json) {
      if (circuit.circuit_json.installedIc) setInstalledIc(circuit.circuit_json.installedIc);
      if (typeof circuit.circuit_json.swA === 'boolean') setSwA(circuit.circuit_json.swA);
      if (typeof circuit.circuit_json.swB === 'boolean') setSwB(circuit.circuit_json.swB);
      if (Array.isArray(circuit.circuit_json.wires)) setWires(circuit.circuit_json.wires);
      playConnectClick();
      setLoadModalOpen(false);
    }
  };

  const handleDeleteCircuit = async (id: string) => {
    await deleteSavedCircuit(user?.id || null, id);
    setSavedCircuitsList((prev) => prev.filter((c) => c.id !== id));
  };

  const [lastSnapPoint, setLastSnapPoint] = useState<{ x: number; y: number } | null>(null);

  // Terminals Coordinates on Virtual Breadboard
  const terminals: TerminalPoint[] = [
    // Power Rails
    { id: 'vcc-rail-1', name: '+5V Rail (Top)', x: 90, y: 40, type: 'vcc' },
    { id: 'vcc-rail-2', name: '+5V Rail (Top Right)', x: 380, y: 40, type: 'vcc' },
    { id: 'gnd-rail-1', name: 'GND Rail (Bottom)', x: 90, y: 355, type: 'gnd' },
    { id: 'gnd-rail-2', name: 'GND Rail (Bottom Right)', x: 380, y: 355, type: 'gnd' },

    // Switch Terminals
    { id: 'swA-out', name: 'Switch A Output', x: 130, y: 200, type: 'input' },
    { id: 'swB-out', name: 'Switch B Output', x: 130, y: 250, type: 'input' },

    // DIP-14 IC Pins
    { id: 'pin-1', name: 'Pin 1 (1A)', x: 230, y: 245, type: 'pin' },
    { id: 'pin-2', name: 'Pin 2 (1B)', x: 250, y: 245, type: 'pin' },
    { id: 'pin-3', name: 'Pin 3 (1Y)', x: 270, y: 245, type: 'pin' },
    { id: 'pin-7', name: 'Pin 7 (GND)', x: 350, y: 245, type: 'pin' },
    { id: 'pin-14', name: 'Pin 14 (VCC)', x: 230, y: 135, type: 'pin' },

    // Resistor & LED Terminals
    { id: 'resistor-in', name: '330Ω Resistor In', x: 440, y: 200, type: 'output' },
    { id: 'led-anode', name: 'LED Anode (+)', x: 470, y: 200, type: 'output' },
    { id: 'led-cathode', name: 'LED Cathode (-)', x: 500, y: 200, type: 'output' },
  ];

  // Initial standard AND gate preset wires
  const defaultAndWires: Wire[] = [
    { id: 'w1', fromId: 'vcc-rail-1', toId: 'pin-14', color: '#ef4444', from: { x: 90, y: 40, label: '+5V Rail' }, to: { x: 230, y: 135, label: 'Pin 14 (VCC)' } },
    { id: 'w2', fromId: 'gnd-rail-1', toId: 'pin-7', color: '#1c1917', from: { x: 90, y: 355, label: 'GND Rail' }, to: { x: 350, y: 245, label: 'Pin 7 (GND)' } },
    { id: 'w3', fromId: 'swA-out', toId: 'pin-1', color: '#0284c7', from: { x: 130, y: 200, label: 'Switch A' }, to: { x: 230, y: 245, label: 'Pin 1 (1A)' } },
    { id: 'w4', fromId: 'swB-out', toId: 'pin-2', color: '#0284c7', from: { x: 130, y: 250, label: 'Switch B' }, to: { x: 250, y: 245, label: 'Pin 2 (1B)' } },
    { id: 'w5', fromId: 'pin-3', toId: 'resistor-in', color: '#10b981', from: { x: 270, y: 245, label: 'Pin 3 (1Y)' }, to: { x: 440, y: 200, label: '330Ω In' } },
    { id: 'w6', fromId: 'led-cathode', toId: 'gnd-rail-2', color: '#1c1917', from: { x: 500, y: 200, label: 'LED Cathode' }, to: { x: 380, y: 355, label: 'GND Rail' } },
  ];

  const [wires, setWires] = useState<Wire[]>(defaultAndWires);

  // --- DSA MODULE 1: STACK FOR UNDO / REDO HISTORY (LIFO Behavior) ---
  // History is managed via explicit Stack<WireAction> instances matching syllabus 1.2
  interface WireAction {
    type: 'ADD_WIRE' | 'REMOVE_WIRE' | 'LOAD_PRESET' | 'CLEAR_WIRES';
    prevWires: Wire[];
    nextWires: Wire[];
  }

  const undoStack = useRef(new Stack<WireAction>(50));
  const redoStack = useRef(new Stack<WireAction>(50));
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);

  const updateUndoRedoFlags = useCallback(() => {
    setCanUndo(!undoStack.current.isEmpty());
    setCanRedo(!redoStack.current.isEmpty());
  }, []);

  const handleUndo = useCallback(() => {
    if (undoStack.current.isEmpty()) return;
    playSoftClick();
    const action = undoStack.current.pop()!;
    redoStack.current.push(action);
    setWires(action.prevWires);
    updateUndoRedoFlags();
  }, [updateUndoRedoFlags]);

  const handleRedo = useCallback(() => {
    if (redoStack.current.isEmpty()) return;
    playSoftClick();
    const action = redoStack.current.pop()!;
    undoStack.current.push(action);
    setWires(action.nextWires);
    updateUndoRedoFlags();
  }, [updateUndoRedoFlags]);

  // Keyboard shortcut listener: Ctrl+Z for Undo, Ctrl+Y or Ctrl+Shift+Z for Redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // --- DSA MODULE 3: HASH TABLE FOR SIMULATION MEMOIZATION ---
  // Caches O(V + E) BFS reachability results keyed by circuit state hash (Linear Probing)
  const simulationCache = useRef(
    new HashTable<
      string,
      {
        isCircuitComplete: boolean;
        isVccConnected: boolean;
        isGndConnected: boolean;
        isSwitchAConnected: boolean;
        isSwitchBConnected: boolean;
        isOutputConnected: boolean;
        isLedGndConnected: boolean;
        gateOutputBool: boolean;
        topologicalOrder: string[];
        electricalNetsCount: number;
      }
    >(67, 'linear')
  );

  // --- DSA MODULE 2: GRAPH (ADJACENCY LIST), BFS/DFS NETLIST & KAHN'S TOPOLOGICAL SORT ---
  const circuitSimulation = useMemo(() => {
    // Generate deterministic circuit state hash key
    const sortedWirePairs = wires
      .map((w) => (w.fromId < w.toId ? `${w.fromId}:${w.toId}` : `${w.toId}:${w.fromId}`))
      .sort()
      .join('|');
    const stateKey = `${installedIc}:${swA ? 1 : 0}:${swB ? 1 : 0}:${sortedWirePairs}`;

    const cached = simulationCache.current.get(stateKey);
    if (cached) {
      return cached;
    }

    // 1. Construct Adjacency List Graph (Module 2: 2.3)
    const circuitGraph = new Graph<string>();
    terminals.forEach((t) => circuitGraph.addVertex(t.id));
    wires.forEach((w) => circuitGraph.addEdge(w.fromId, w.toId, false));

    // 2. Compute Connected Components (Electrical Nets) via BFS
    const electricalNets = circuitGraph.findConnectedComponents();

    // 3. Power, Ground & Signal Reachability via BFS (Module 2: 2.3)
    const isVccConnected =
      circuitGraph.isReachable('vcc-rail-1', 'pin-14') ||
      circuitGraph.isReachable('vcc-rail-2', 'pin-14');

    const isGndConnected =
      circuitGraph.isReachable('gnd-rail-1', 'pin-7') ||
      circuitGraph.isReachable('gnd-rail-2', 'pin-7');

    const isSwitchAConnected = circuitGraph.isReachable('swA-out', 'pin-1');
    const isSwitchBConnected =
      installedIc === '7404' ? true : circuitGraph.isReachable('swB-out', 'pin-2');

    const isOutputConnected = circuitGraph.isReachable('pin-3', 'resistor-in');
    const isLedGndConnected =
      circuitGraph.isReachable('led-cathode', 'gnd-rail-1') ||
      circuitGraph.isReachable('led-cathode', 'gnd-rail-2');

    const isCircuitComplete =
      isVccConnected &&
      isGndConnected &&
      isSwitchAConnected &&
      isSwitchBConnected &&
      isOutputConnected &&
      isLedGndConnected;

    // 4. Signal Dependency DAG & Kahn's Topological Sort (Module 2: 2.4)
    const signalDAG = new DirectedAcyclicGraph<string>();
    signalDAG.addDependency('swA-out', 'pin-1');
    if (installedIc !== '7404') {
      signalDAG.addDependency('swB-out', 'pin-2');
      signalDAG.addDependency('pin-2', 'pin-3');
    }
    signalDAG.addDependency('pin-1', 'pin-3');
    signalDAG.addDependency('pin-3', 'resistor-in');
    signalDAG.addDependency('resistor-in', 'led-anode');
    const topologicalOrder = signalDAG.topologicalSort();

    // 5. Gate Output Boolean evaluation
    let gateOutputBool = false;
    if (installedIc === '7408') gateOutputBool = swA && swB;
    else if (installedIc === '7432') gateOutputBool = swA || swB;
    else if (installedIc === '7404') gateOutputBool = !swA;
    else if (installedIc === '7400') gateOutputBool = !(swA && swB);
    else if (installedIc === '7486') gateOutputBool = (swA && !swB) || (!swA && swB);

    const result = {
      isCircuitComplete,
      isVccConnected,
      isGndConnected,
      isSwitchAConnected,
      isSwitchBConnected,
      isOutputConnected,
      isLedGndConnected,
      gateOutputBool,
      topologicalOrder,
      electricalNetsCount: electricalNets.length,
    };

    simulationCache.current.set(stateKey, result);
    return result;
  }, [wires, installedIc, swA, swB, terminals]);

  const {
    isCircuitComplete,
    isVccConnected,
    isGndConnected,
    isSwitchAConnected,
    isSwitchBConnected,
    isOutputConnected,
    isLedGndConnected,
    gateOutputBool,
  } = circuitSimulation;

  // LED is illuminated ONLY when circuit is fully closed and output is 1!
  const ledIlluminated = isCircuitComplete && gateOutputBool;

  // Handle Terminal Click (Wiring or Probe)
  const handleTerminalClick = (terminal: TerminalPoint) => {
    if (probeMode) {
      playSoftClick();
      let voltage = '0.00 V (LOW)';
      let note = 'Line grounded or unpowered';

      if (terminal.type === 'vcc') {
        voltage = '5.00 V (VCC)';
        note = 'Continuous +5V DC Rail';
      } else if (terminal.id === 'pin-14') {
        voltage = isVccConnected ? '5.00 V' : '0.00 V (Floating)';
        note = isVccConnected ? 'Power supply active' : 'Missing VCC wire!';
      } else if (terminal.id === 'pin-3') {
        voltage = isCircuitComplete ? (gateOutputBool ? '4.85 V (HIGH)' : '0.18 V (LOW)') : '0.00 V';
        note = `IC Gate Output Y = ${gateOutputBool ? '1' : '0'}`;
      } else if (terminal.id === 'swA-out') {
        voltage = swA ? '5.00 V (HIGH)' : '0.00 V (LOW)';
        note = `Switch A state: ${swA ? 'ON' : 'OFF'}`;
      } else if (terminal.id === 'swB-out') {
        voltage = swB ? '5.00 V (HIGH)' : '0.00 V (LOW)';
        note = `Switch B state: ${swB ? 'ON' : 'OFF'}`;
      }

      setProbeReading({
        pin: terminal.name,
        voltage,
        note,
      });
      return;
    }

    // Wiring mode
    if (!wiringFrom) {
      playSoftClick();
      setWiringFrom(terminal);
    } else {
      if (wiringFrom.id !== terminal.id) {
        playConnectClick();
        setLastSnapPoint({ x: terminal.x, y: terminal.y });
        setTimeout(() => setLastSnapPoint(null), 900);

        const newWire: Wire = {
          id: `w-${Date.now()}`,
          fromId: wiringFrom.id,
          toId: terminal.id,
          color: wireColor,
          from: { x: wiringFrom.x, y: wiringFrom.y, label: wiringFrom.name },
          to: { x: terminal.x, y: terminal.y, label: terminal.name },
        };
        const nextWires = [...wires, newWire];
        undoStack.current.push({
          type: 'ADD_WIRE',
          prevWires: wires,
          nextWires,
        });
        redoStack.current.clear();
        setWires(nextWires);
        updateUndoRedoFlags();
        unlockAchievement('first_wire');
      }
      setWiringFrom(null);
    }
  };

  // Remove wire by ID (pushes to undo stack)
  const handleRemoveWire = (wireId: string) => {
    playSoftClick();
    const nextWires = wires.filter((w) => w.id !== wireId);
    undoStack.current.push({
      type: 'REMOVE_WIRE',
      prevWires: wires,
      nextWires,
    });
    redoStack.current.clear();
    setWires(nextWires);
    updateUndoRedoFlags();
  };

  // Clear all wires (pushes to undo stack)
  const handleClearAllWires = () => {
    if (wires.length === 0) return;
    playSoftClick();
    const nextWires: Wire[] = [];
    undoStack.current.push({
      type: 'CLEAR_WIRES',
      prevWires: wires,
      nextWires,
    });
    redoStack.current.clear();
    setWires(nextWires);
    updateUndoRedoFlags();
  };

  // Load Preset (pushes to undo stack)
  const handleLoadPreset = (presetName: string) => {
    playSoftClick();
    setWiringFrom(null);
    let nextWires: Wire[] = [];

    if (presetName === '7408') {
      setInstalledIc('7408');
      nextWires = defaultAndWires;
      setSwA(true);
      setSwB(true);
    } else if (presetName === '7432') {
      setInstalledIc('7432');
      nextWires = defaultAndWires;
      setSwA(false);
      setSwB(true);
    } else if (presetName === '7404') {
      setInstalledIc('7404');
      nextWires = [
        { id: 'w1', fromId: 'vcc-rail-1', toId: 'pin-14', color: '#ef4444', from: { x: 90, y: 40, label: '+5V Rail' }, to: { x: 230, y: 135, label: 'Pin 14' } },
        { id: 'w2', fromId: 'gnd-rail-1', toId: 'pin-7', color: '#1c1917', from: { x: 90, y: 355, label: 'GND Rail' }, to: { x: 350, y: 245, label: 'Pin 7' } },
        { id: 'w3', fromId: 'swA-out', toId: 'pin-1', color: '#0284c7', from: { x: 130, y: 200, label: 'Switch A' }, to: { x: 230, y: 245, label: 'Pin 1' } },
        { id: 'w5', fromId: 'pin-3', toId: 'resistor-in', color: '#10b981', from: { x: 270, y: 245, label: 'Pin 3' }, to: { x: 440, y: 200, label: 'Resistor' } },
        { id: 'w6', fromId: 'led-cathode', toId: 'gnd-rail-2', color: '#1c1917', from: { x: 500, y: 200, label: 'Cathode' }, to: { x: 380, y: 355, label: 'GND' } }
      ];
      setSwA(false);
    } else if (presetName === 'blank') {
      nextWires = [];
    }

    undoStack.current.push({
      type: 'LOAD_PRESET',
      prevWires: wires,
      nextWires,
    });
    redoStack.current.clear();
    setWires(nextWires);
    updateUndoRedoFlags();
  };

  // Payoff moment for "Check My Circuit"
  const handleVerifyCircuit = () => {
    if (isCircuitComplete) {
      setVerifierSweep(true);
      playSuccessChime();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#4F46E5', '#FF9F1C'],
      });
      setVerifierMessage(
        `Verification Passed! SN${installedIc}N circuit is electrically continuous and functioning according to IEEE standards.`
      );
      unlockAchievement('first_lab');
      setTimeout(() => setVerifierSweep(false), 1400);
    } else {
      playAlarmBuzz();
      setVerifierMessage(
        'Circuit Incomplete: Check missing connections in the diagnostic banner before testing.'
      );
      setTimeout(() => setVerifierMessage(null), 4000);
    }
  };

  // Determine whether a wire carries HIGH voltage
  const isWireHigh = (wire: Wire) => {
    if (wire.fromId.includes('vcc') || wire.toId.includes('vcc')) return true;
    if (wire.fromId === 'swA-out' && swA) return true;
    if (wire.fromId === 'swB-out' && swB) return true;
    if (wire.fromId === 'pin-3' && gateOutputBool && isCircuitComplete) return true;
    return false;
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Station Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-sans font-bold badge-vivid-brand inline-block">
              Station 3 • Hardware Prototyping
            </span>
            <span className="w-2 h-2 rounded-full bg-mod3 animate-ping" />
            <span className="text-xs font-sans text-mod3-dark dark:text-mod3 font-bold">Breadboard Live</span>
          </div>
          <h2 className="font-display font-black text-3xl text-ink-900 dark:text-cream-paper tracking-tight mt-1">
            Hands-On Solderless{' '}
            <span className="text-brand-gradient">Practice Breadboard</span>
          </h2>
          <p className="text-ink-700 dark:text-cream-muted text-sm font-sans mt-0.5 max-w-2xl font-medium">
            Click pins to route real jumper wires, choose wire colors, test IC chips, and diagnose circuit faults live.
          </p>
        </div>

        {/* 1-Click Practice Presets */}
        <div className="flex items-center gap-1.5 bg-cream-soft dark:bg-darklab-card p-1.5 rounded-2xl border border-cream-border dark:border-darklab-border flex-wrap shadow-xs">
          <span className="text-xs font-sans text-ink-700 dark:text-cream-muted mr-1 font-bold">Presets:</span>
          {[
            { id: '7408', label: '7408 AND' },
            { id: '7432', label: '7432 OR' },
            { id: '7404', label: '7404 NOT' },
            { id: 'blank', label: 'Blank Canvas' }
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleLoadPreset(preset.id)}
              className="px-3 py-1 rounded-xl font-sans text-xs font-bold bg-white dark:bg-darklab-base text-ink-800 dark:text-cream-paper hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-400 border border-cream-border dark:border-darklab-border shadow-xs transition-all cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Workbench Container */}
      <div className="bg-white dark:bg-darklab-card rounded-3xl p-6 sm:p-8 border border-cream-border dark:border-darklab-border card-vivid-brand shadow-xs space-y-6">
        
        {/* Breadboard Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-cream-border dark:border-darklab-border">
          
          {/* Chip Swap */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-sans font-bold text-ink-800 dark:text-cream-paper">IC Chip:</span>
            <div className="flex gap-1">
              {(['7408', '7432', '7404', '7400', '7486'] as const).map((ic) => (
                <button
                  key={ic}
                  onClick={() => {
                    playSoftClick();
                    setInstalledIc(ic);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                    installedIc === ic
                      ? 'bg-mod2 !text-white shadow-amber ring-2 ring-mod2/40'
                      : 'bg-cream-soft dark:bg-darklab-base text-ink-800 dark:text-cream-paper hover:bg-white dark:hover:bg-darklab-surface border border-cream-border dark:border-darklab-border'
                  }`}
                >
                  SN{ic}N
                </button>
              ))}
            </div>
          </div>

          {/* Wire Color Picker */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-sans font-bold text-ink-800 dark:text-cream-paper">Wire Color:</span>
            <div className="flex gap-1.5 bg-cream-soft dark:bg-darklab-base p-1.5 rounded-xl border border-cream-border dark:border-darklab-border">
              {[
                { color: '#ef4444', name: 'Red (+5V)' },
                { color: '#1c1917', name: 'Black (GND)' },
                { color: '#0284c7', name: 'Blue (Signal A)' },
                { color: '#f59e0b', name: 'Amber (Signal B)' },
                { color: '#10b981', name: 'Emerald (Output)' },
                { color: '#a855f7', name: 'Purple' }
              ].map((c) => (
                <button
                  key={c.color}
                  onClick={() => {
                    playSoftClick();
                    setWireColor(c.color);
                    setProbeMode(false);
                  }}
                  title={c.name}
                  className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
                    wireColor === c.color && !probeMode ? 'scale-125 ring-2 ring-brand-500 border-white' : 'border-ink-400'
                  }`}
                  style={{ backgroundColor: c.color }}
                />
              ))}
            </div>
          </div>

          {/* Multimeter Probe, Verifier, & Canvas Lighting Toggle */}
          <div className="flex items-center gap-2">
            {/* Payoff Verifier Button */}
            <button
              onClick={handleVerifyCircuit}
              className="px-3.5 py-1.5 rounded-xl font-sans text-xs font-bold flex items-center gap-1.5 transition-all bg-emerald-600 hover:bg-emerald-700 text-white shadow-teal cursor-pointer active:scale-95"
              title="Verify electrical integrity of current breadboard assembly"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verify Circuit</span>
            </button>

            <button
              onClick={() => {
                playSoftClick();
                setCanvasContrast((c) => (c === 'light' ? 'dark' : 'light'));
              }}
              className="px-3 py-1.5 rounded-xl font-sans text-xs font-bold flex items-center gap-1.5 transition-all bg-cream-soft dark:bg-darklab-base border border-cream-border dark:border-darklab-border text-ink-800 dark:text-cream-paper hover:bg-white dark:hover:bg-darklab-surface shadow-xs cursor-pointer"
              title="Toggle Breadboard Canvas Contrast"
            >
              <span>{canvasContrast === 'light' ? '🌙 Dark Canvas' : '☀️ Light Canvas'}</span>
            </button>

            <button
              onClick={() => {
                playSoftClick();
                setProbeMode(!probeMode);
                setWiringFrom(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl font-sans text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                probeMode
                  ? 'bg-mod4 !text-white shadow-violet ring-2 ring-mod4/40'
                  : 'bg-cream-soft dark:bg-darklab-base text-ink-800 dark:text-cream-paper hover:bg-white dark:hover:bg-darklab-surface border border-cream-border dark:border-darklab-border'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{probeMode ? 'Probe Active' : 'Multimeter Probe'}</span>
            </button>

            {/* Save & Load Custom Circuits */}
            <button
              onClick={() => {
                playSoftClick();
                setSaveModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-xl font-sans text-xs font-bold flex items-center gap-1.5 transition-all bg-cream-soft dark:bg-darklab-base text-ink-800 dark:text-cream-paper hover:bg-white dark:hover:bg-darklab-surface border border-cream-border dark:border-darklab-border shadow-xs cursor-pointer"
              title="Save current circuit wiring to your account or browser"
            >
              <Save className="w-3.5 h-3.5 text-brand-mid" />
              <span className="hidden sm:inline">Save</span>
            </button>

            <button
              onClick={() => {
                playSoftClick();
                handleOpenLoadModal();
              }}
              className="px-3 py-1.5 rounded-xl font-sans text-xs font-bold flex items-center gap-1.5 transition-all bg-cream-soft dark:bg-darklab-base text-ink-800 dark:text-cream-paper hover:bg-white dark:hover:bg-darklab-surface border border-cream-border dark:border-darklab-border shadow-xs cursor-pointer"
              title="Open saved circuit wirings"
            >
              <FolderOpen className="w-3.5 h-3.5 text-purple-500" />
              <span className="hidden sm:inline">My Circuits</span>
            </button>

            {/* Undo & Redo Buttons (DSA Module 1: Stack LIFO) */}
            <div className="flex items-center gap-1 border-l border-cream-border dark:border-darklab-border pl-2">
              <button
                onClick={handleUndo}
                disabled={!canUndo}
                className={`p-2 rounded-xl border border-cream-border dark:border-darklab-border transition-all shadow-xs ${
                  canUndo
                    ? 'text-ink-800 dark:text-cream-paper hover:bg-cream-soft dark:hover:bg-darklab-surface cursor-pointer active:scale-95'
                    : 'text-ink-300 dark:text-darklab-border cursor-not-allowed opacity-40'
                }`}
                title="Undo Wire Action (Ctrl+Z) [LIFO Stack]"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleRedo}
                disabled={!canRedo}
                className={`p-2 rounded-xl border border-cream-border dark:border-darklab-border transition-all shadow-xs ${
                  canRedo
                    ? 'text-ink-800 dark:text-cream-paper hover:bg-cream-soft dark:hover:bg-darklab-surface cursor-pointer active:scale-95'
                    : 'text-ink-300 dark:text-darklab-border cursor-not-allowed opacity-40'
                }`}
                title="Redo Wire Action (Ctrl+Y / Ctrl+Shift+Z) [LIFO Stack]"
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleClearAllWires}
              className="p-2 rounded-xl text-mod1 hover:text-white hover:bg-mod1 border border-cream-border dark:border-darklab-border transition-colors shadow-xs cursor-pointer"
              title="Clear All Wires"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Verification Alert / Payoff Message */}
        {verifierMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3.5 rounded-2xl border text-xs font-sans font-bold flex items-center gap-2 ${
              isCircuitComplete
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-200'
                : 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/60 dark:text-rose-200'
            }`}
          >
            {isCircuitComplete ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{verifierMessage}</span>
          </motion.div>
        )}

        {/* Live Circuit Diagnostic Banner */}
        <div className={`p-4 rounded-2xl border text-xs font-sans flex items-center justify-between gap-3 ${
          isCircuitComplete
            ? 'zone-mod3-wash border-mod3/40 text-mod3-dark dark:bg-mod3/20 dark:text-mod3 shadow-xs font-medium'
            : 'zone-mod2-wash border-mod2/40 text-mod2-dark dark:bg-mod2/20 dark:text-mod2 shadow-xs font-medium'
        }`}>
          <div className="flex items-center gap-2">
            {isCircuitComplete ? (
              <CheckCircle2 className="w-5 h-5 text-mod3 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-mod2 shrink-0" />
            )}
            <div>
              <strong className="font-bold">Circuit Diagnostic:</strong>{' '}
              {isCircuitComplete ? (
                <span>All loops closed. VCC, GND, and Output lines valid. Output Y is <span className="font-mono font-bold">{gateOutputBool ? '5V HIGH (LED ON!)' : '0V LOW (Cutoff)'}</span>.</span>
              ) : (
                <span>
                  {!isVccConnected && '• Missing VCC connection (Pin 14 to +5V rail) '}
                  {!isGndConnected && '• Missing GND connection (Pin 7 to GND rail) '}
                  {!isSwitchAConnected && '• Connect Switch A to Pin 1 (1A) '}
                  {!isSwitchBConnected && '• Connect Switch B to Pin 2 (1B) '}
                  {!isOutputConnected && '• Connect Pin 3 (1Y) to Resistor In '}
                  {!isLedGndConnected && '• Connect LED Cathode to GND rail '}
                </span>
              )}
            </div>
          </div>
          <div className="text-xs font-mono font-bold shrink-0">
            {wires.length} Wires
          </div>
        </div>

        {/* The Physical Virtual Breadboard Canvas with Light/Dark Contrast Support */}
        <div className={`relative overflow-hidden rounded-3xl p-6 border-4 shadow-inner select-none min-w-[780px] transition-colors duration-200 ${
          canvasContrast === 'dark'
            ? 'bg-[#22242E] border-[#363848] text-cream-paper'
            : 'bg-[#FFFDF9] border-[#E8E2D2] text-ink-900'
        }`}>
          
          {/* Verification Payoff Green Sweep Light Wave */}
          {verifierSweep && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="absolute inset-y-0 w-48 bg-gradient-to-r from-transparent via-emerald-400/35 to-transparent pointer-events-none z-30 transform -skew-x-12"
            />
          )}

          {/* Idle Empty Canvas Hint */}
          {wires.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div className="bg-white/90 dark:bg-darklab-card/90 backdrop-blur-sm border-2 border-brand-start px-6 py-3 rounded-2xl shadow-lg text-center animate-pulse">
                <span className="font-display font-bold text-sm text-ink-900 dark:text-cream-paper block">
                  ⚡ Ready to Wire Your Circuit!
                </span>
                <span className="font-sans text-xs text-ink-600 dark:text-cream-muted">
                  Click any terminal (+5V Rail, Switch A, IC Pin) to route jumper wires
                </span>
              </div>
            </div>
          )}

          {/* Snap Animation Indicator */}
          {lastSnapPoint && (
            <div
              className="absolute pointer-events-none z-30"
              style={{ left: lastSnapPoint.x - 12, top: lastSnapPoint.y - 12 }}
            >
              <div className="w-6 h-6 rounded-full border-2 border-emerald-400 bg-emerald-400/40 animate-ping" />
            </div>
          )}

          {/* SVG Overlay for Catenary Curved Jumper Wires & Animated HIGH Signal Flow */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
            {wires.map((wire) => {
              const path = getCatenaryPath(wire.from.x, wire.from.y, wire.to.x, wire.to.y, 0.35);
              const isHigh = isWireHigh(wire);

              return (
                <g key={wire.id} className="cursor-pointer pointer-events-auto group" onClick={() => handleRemoveWire(wire.id)}>
                  {/* Outer glow / shadow */}
                  <path
                    d={path}
                    fill="none"
                    stroke="rgba(0,0,0,0.18)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    transform="translate(0, 4)"
                  />
                  {/* Main Wire Solid Line */}
                  <path
                    d={path}
                    fill="none"
                    stroke={wire.color}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="hover:stroke-rose-500 transition-colors"
                  />
                  {/* Animated HIGH Voltage Electrical Current Flow Overlay */}
                  {isHigh && (
                    <path
                      d={path}
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className="wire-flow-high opacity-80"
                    />
                  )}
                  {/* Terminals Pins */}
                  <circle cx={wire.from.x} cy={wire.from.y} r="3.5" fill="#334155" />
                  <circle cx={wire.to.x} cy={wire.to.y} r="3.5" fill="#334155" />
                </g>
              );
            })}

            {/* Ghost pending wire being drawn */}
            {wiringFrom && (
              <circle
                cx={wiringFrom.x}
                cy={wiringFrom.y}
                r="10"
                fill="none"
                stroke="#00d2ff"
                strokeWidth="2.5"
                className="animate-ping"
              />
            )}

            {/* Tactile Wire Snap Ripple Pulse */}
            {lastSnapPoint && (
              <circle
                cx={lastSnapPoint.x}
                cy={lastSnapPoint.y}
                r="16"
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                className="animate-ping"
              />
            )}

            {/* Idle Empty Board Hint */}
            {wires.length === 0 && (
              <g className="pointer-events-none select-none">
                <rect
                  x="180"
                  y="290"
                  width="240"
                  height="34"
                  rx="10"
                  fill="#10B981"
                  fillOpacity="0.1"
                  stroke="#10B981"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
                <text
                  x="300"
                  y="311"
                  fill="#047857"
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="sans-serif"
                >
                  ✨ Click +5V Rail or Tie A to lay your first wire
                </text>
              </g>
            )}
          </svg>

          {/* Top Power Distribution Rails (+5V Red, GND Blue) */}
          <div className="bg-[#ede7d8] dark:bg-stone-800 rounded-xl p-3 border border-[#dfd7c2] dark:border-stone-700 mb-5 flex items-center justify-between text-[11px] font-mono">
            <div className="flex items-center gap-3">
              <span className="text-rose-600 font-bold text-base">+</span>
              <button
                onClick={() => handleTerminalClick(terminals[0])}
                className="px-2 py-0.5 rounded bg-rose-200 text-rose-900 font-bold hover:scale-105 transition-transform cursor-pointer"
              >
                +5V Rail
              </button>
              <div className="flex gap-1.5 opacity-60">
                {[...Array(24)].map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-stone-700/60 dark:bg-stone-400/40" />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleTerminalClick(terminals[1])}
                className="px-2 py-0.5 rounded bg-rose-200 text-rose-900 font-bold hover:scale-105 transition-transform cursor-pointer"
              >
                +5V Tie
              </button>
              <div className="flex gap-1.5 opacity-60">
                {[...Array(24)].map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-stone-700/60 dark:bg-stone-400/40" />
                ))}
              </div>
            </div>
          </div>

          {/* Central Breadboard Sockets Matrix */}
          <div className="bg-[#fcfbf9] dark:bg-[#1A1C24] rounded-2xl p-5 border border-[#dfd7c2] dark:border-stone-700 relative">
            <div className="grid grid-cols-12 gap-6 items-center">
              
              {/* Left Input Switches Module */}
              <div className="col-span-3 bg-[#f5efe4] dark:bg-stone-800 p-4 rounded-2xl border border-[#ded5c2] dark:border-stone-700 shadow-soft-sm space-y-4 relative z-30">
                <div className="text-[11px] font-mono font-bold text-stone-600 dark:text-stone-300 uppercase">
                  Logic Input Switches
                </div>

                <div className="flex items-center justify-between">
                  <ToggleSwitch checked={swA} onChange={setSwA} label="A" accentColor="bg-sky-500" size="sm" />
                  <button
                    onClick={() => handleTerminalClick(terminals[4])}
                    className="p-1.5 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 text-[10px] font-mono font-bold hover:bg-sky-200 border border-sky-300 dark:border-sky-800 cursor-pointer"
                  >
                    Tie A
                  </button>
                </div>

                {installedIc !== '7404' && (
                  <div className="flex items-center justify-between">
                    <ToggleSwitch checked={swB} onChange={setSwB} label="B" accentColor="bg-sky-500" size="sm" />
                    <button
                      onClick={() => handleTerminalClick(terminals[5])}
                      className="p-1.5 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 text-[10px] font-mono font-bold hover:bg-sky-200 border border-sky-300 dark:border-sky-800 cursor-pointer"
                    >
                      Tie B
                    </button>
                  </div>
                )}
              </div>

              {/* Central DIP-14 IC Socket */}
              <div className="col-span-6 flex flex-col items-center justify-center relative py-6">
                <div className="w-60 h-22 bg-[#334155] rounded-lg shadow-xl relative flex items-center justify-between px-4 border border-[#475569] z-10">
                  <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-5 rounded-r-full bg-[#1e293b] border border-[#475569]" />
                  <div className="text-center mx-auto">
                    <div className="font-mono font-bold text-xs text-amber-300 tracking-wider">
                      SN{installedIc}N
                    </div>
                    <div className="font-mono text-[9px] text-stone-300">
                      {installedIc === '7408' && 'QUAD 2-INPUT AND'}
                      {installedIc === '7432' && 'QUAD 2-INPUT OR'}
                      {installedIc === '7404' && 'HEX INVERTER NOT'}
                      {installedIc === '7400' && 'QUAD 2-INPUT NAND'}
                      {installedIc === '7486' && 'QUAD 2-INPUT XOR'}
                    </div>
                  </div>

                  {/* Top Pin Terminals */}
                  <div className="absolute -top-4 left-4 right-4 flex justify-between">
                    <button onClick={() => handleTerminalClick(terminals[10])} className="w-3 h-4 bg-rose-400 rounded-t shadow hover:scale-125 cursor-pointer" title="Pin 14 (VCC)" />
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="w-3 h-4 bg-stone-400 rounded-t shadow" />
                    ))}
                  </div>

                  {/* Bottom Pin Terminals */}
                  <div className="absolute -bottom-4 left-4 right-4 flex justify-between">
                    <button onClick={() => handleTerminalClick(terminals[6])} className="w-3 h-4 bg-sky-400 rounded-b shadow hover:scale-125 cursor-pointer" title="Pin 1 (1A)" />
                    <button onClick={() => handleTerminalClick(terminals[7])} className="w-3 h-4 bg-sky-400 rounded-b shadow hover:scale-125 cursor-pointer" title="Pin 2 (1B)" />
                    <button onClick={() => handleTerminalClick(terminals[8])} className="w-3 h-4 bg-emerald-400 rounded-b shadow hover:scale-125 cursor-pointer" title="Pin 3 (1Y Output)" />
                    <div className="w-3 h-4 bg-stone-400 rounded-b shadow" />
                    <div className="w-3 h-4 bg-stone-400 rounded-b shadow" />
                    <div className="w-3 h-4 bg-stone-400 rounded-b shadow" />
                    <button onClick={() => handleTerminalClick(terminals[9])} className="w-3 h-4 bg-stone-800 rounded-b shadow hover:scale-125 cursor-pointer" title="Pin 7 (GND)" />
                  </div>
                </div>

                <div className="w-full h-1 bg-[#dcd4c0] dark:bg-stone-600 absolute top-1/2 -translate-y-1/2 z-0" />
              </div>

              {/* Right Output Resistor & Glowing LED Module */}
              <div className="col-span-3 bg-[#f5efe4] dark:bg-stone-800 p-4 rounded-2xl border border-[#ded5c2] dark:border-stone-700 shadow-soft-sm flex flex-col items-center justify-center space-y-3 relative z-30">
                <div className="text-[11px] font-mono font-bold text-stone-600 dark:text-stone-300 uppercase">
                  Indicator Module
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleTerminalClick(terminals[11])}
                    className="p-1 rounded bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-mono text-[10px] font-bold hover:bg-amber-200 border border-amber-300 dark:border-amber-800 cursor-pointer"
                  >
                    R_In (330Ω)
                  </button>
                  <span className="text-[10px] font-mono text-stone-400">→</span>
                  <button
                    onClick={() => handleTerminalClick(terminals[13])}
                    className="p-1 rounded bg-stone-100 dark:bg-stone-700 text-stone-900 dark:text-stone-200 font-mono text-[10px] font-bold hover:bg-stone-200 border border-stone-300 dark:border-stone-600 cursor-pointer"
                  >
                    Cathode (-)
                  </button>
                </div>

                {/* Glowing LED with believable phosphor glow */}
                <div className="my-2 flex flex-col items-center">
                  <div className={`p-3 rounded-full transition-all duration-300 ${
                    ledIlluminated
                      ? 'bg-emerald-500/25 shadow-[0_0_40px_12px_rgba(16,185,129,0.85)]'
                      : 'bg-stone-100 dark:bg-stone-900'
                  }`}>
                    <LedIndicator isOn={ledIlluminated} color="emerald" size="lg" label="LED 1Y" />
                  </div>
                  <div className={`text-xs font-mono font-bold mt-1 ${ledIlluminated ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-400'}`}>
                    {ledIlluminated ? 'GLOWING (HIGH)' : 'CUTOFF (LOW)'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Ground Rails */}
          <div className="bg-[#ede7d8] dark:bg-stone-800 rounded-xl p-3 border border-[#dfd7c2] dark:border-stone-700 mt-5 flex items-center justify-between text-[11px] font-mono">
            <div className="flex items-center gap-3">
              <span className="text-sky-600 font-bold text-base">-</span>
              <button
                onClick={() => handleTerminalClick(terminals[2])}
                className="px-2 py-0.5 rounded bg-sky-200 text-sky-900 font-bold hover:scale-105 transition-transform cursor-pointer"
              >
                GND Rail
              </button>
              <div className="flex gap-1.5 opacity-60">
                {[...Array(24)].map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-stone-700/60 dark:bg-stone-400/40" />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleTerminalClick(terminals[3])}
                className="px-2 py-0.5 rounded bg-sky-200 text-sky-900 font-bold hover:scale-105 transition-transform cursor-pointer"
              >
                GND Tie
              </button>
              <div className="flex gap-1.5 opacity-60">
                {[...Array(24)].map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-stone-700/60 dark:bg-stone-400/40" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Multimeter Probe Reading Callout */}
        {probeReading && (
          <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-800 text-xs font-sans text-purple-950 dark:text-purple-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>
                <strong>Probe Node:</strong> <span className="font-mono font-bold">{probeReading.pin}</span> &nbsp;|&nbsp; <strong>Voltage:</strong> <span className="font-mono font-bold text-mod3-dark dark:text-mod3">{probeReading.voltage}</span>
              </span>
            </div>
            <span className="text-purple-700 dark:text-purple-300 italic font-medium">{probeReading.note}</span>
          </div>
        )}

        {/* Instructions Footer */}
        <div className="p-4 rounded-2xl bg-cream-soft dark:bg-darklab-base border border-cream-border dark:border-darklab-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-700 dark:text-cream-muted font-sans">
          <div>
            <strong className="text-ink-900 dark:text-cream-paper">How to Practice:</strong> Click any tie terminal (e.g. Pin 14, +5V, Switch A) to start a wire, then click another terminal to connect it! Click any wire to remove it.
          </div>
          <div className="font-bold text-ink-900 dark:text-cream-paper shrink-0">
            Selected IC: <span className="font-mono text-mod2-dark dark:text-mod2 font-bold">SN{installedIc}N</span>
          </div>
        </div>

        {/* Save Circuit Modal */}
        <AnimatePresence>
          {saveModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-sm bg-white dark:bg-[#151520] rounded-3xl p-6 border border-cream-border dark:border-darklab-border shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Save className="w-5 h-5 text-brand-mid" />
                    <h3 className="font-display font-bold text-base text-ink-900 dark:text-cream-paper">
                      Save Breadboard Circuit
                    </h3>
                  </div>
                  <button
                    onClick={() => setSaveModalOpen(false)}
                    className="p-1.5 rounded-xl text-ink-400 hover:text-ink-900 dark:hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-xs text-ink-500 dark:text-cream-muted">
                  {user
                    ? 'This setup will be saved to your cloud account and accessible anywhere.'
                    : 'Saving to your local browser storage. (Sign in to sync across devices!)'}
                </p>

                {saveSuccessMsg ? (
                  <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{saveSuccessMsg}</span>
                  </div>
                ) : (
                  <form onSubmit={handleSaveCurrentCircuit} className="space-y-3">
                    <input
                      type="text"
                      required
                      placeholder="e.g. 7408 AND Gate Testbench"
                      value={circuitName}
                      onChange={(e) => setCircuitName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-2xl bg-cream-soft dark:bg-darklab-base border border-cream-border dark:border-darklab-border text-xs text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-mid"
                    />

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setSaveModalOpen(false)}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold text-ink-600 dark:text-cream-muted"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-brand-gradient px-4 py-2 rounded-xl text-xs font-bold shadow-sm"
                      >
                        Save Circuit
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* My Circuits Drawer / Modal */}
        <AnimatePresence>
          {loadModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md bg-white dark:bg-[#151520] rounded-3xl p-6 border border-cream-border dark:border-darklab-border shadow-2xl space-y-4 max-h-[80vh] flex flex-col"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-5 h-5 text-purple-500" />
                    <h3 className="font-display font-bold text-base text-ink-900 dark:text-cream-paper">
                      My Saved Circuits
                    </h3>
                  </div>
                  <button
                    onClick={() => setLoadModalOpen(false)}
                    className="p-1.5 rounded-xl text-ink-400 hover:text-ink-900 dark:hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 py-2">
                  {savedCircuitsList.length === 0 ? (
                    <div className="py-8 text-center text-xs text-ink-500 dark:text-cream-muted space-y-1">
                      <p className="font-bold">No saved circuits yet.</p>
                      <p>Click "Save" on the breadboard toolbar to save custom wirings!</p>
                    </div>
                  ) : (
                    savedCircuitsList.map((circuit) => (
                      <div
                        key={circuit.id}
                        className="p-3 rounded-2xl bg-cream-soft dark:bg-darklab-base border border-cream-border dark:border-darklab-border flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="truncate">
                          <p className="font-bold text-ink-900 dark:text-cream-paper truncate">
                            {circuit.name}
                          </p>
                          <p className="text-[10px] text-ink-400 dark:text-cream-muted font-mono">
                            {circuit.circuit_json?.installedIc ? `IC 74${circuit.circuit_json.installedIc}` : 'Breadboard'} •{' '}
                            {circuit.circuit_json?.wires?.length || 0} Wires •{' '}
                            {new Date(circuit.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleLoadCircuit(circuit)}
                            className="btn-brand-gradient px-3 py-1 rounded-xl text-[11px] font-bold shadow-xs"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => handleDeleteCircuit(circuit.id)}
                            className="p-1.5 rounded-xl text-ink-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Delete Circuit"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
