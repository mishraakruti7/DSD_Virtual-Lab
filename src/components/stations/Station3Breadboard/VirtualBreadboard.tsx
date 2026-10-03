import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToggleSwitch } from '../../common/ToggleSwitch';
import { getCatenaryPath } from '../../../utils/catenary';
import {
  Layers,
  Sparkles,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  HelpCircle,
  Eye,
  Save,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Info,
  Play,
  Pause,
  Edit3,
  RotateCcw,
  BookOpen,
  FileText,
  FileCode,
  Activity,
  Check,
  Power,
  Terminal,
  ChevronLeft,
  ChevronRight,
  Keyboard,
  Star,
  Cpu,
} from 'lucide-react';
import { ConsoleLogEntry } from './CircuitHealthPanel';
import { Stack } from '../../../dsa';
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
  playAlarmBuzz,
  playErrorClick,
} from '../../../utils/soundEffects';
import { validateWireConnection, TerminalPoint, Wire } from '../../../utils/wireValidation';
import { useCourseStore } from '../../../store/useCourseStore';
import { CircuitComponent, ComponentPin, BreadboardWire } from '../../../types/breadboard';
import { COMPONENT_LIBRARY, ComponentDefinition } from '../../../data/componentLibrary';
import { STARTER_CIRCUITS, StarterCircuitTemplate } from '../../../data/starterCircuits';
import { BREADBOARD_PRESETS, BreadboardPreset } from '../../../data/breadboardPresets';
import { simulateCircuit, SimulationResult } from '../../../utils/circuitEngine';
import { ComponentPalette } from './ComponentPalette';
import { CircuitHealthPanel } from './CircuitHealthPanel';
import { StarterCircuitsModal } from './StarterCircuitsModal';
import { ComponentInfoModal } from './ComponentInfoModal';
import { ProjectsModal } from './ProjectsModal';
import { CodeEditorPanel } from './CodeEditorPanel';
import { SketchRunner } from '../../../utils/sketchRunner';
import { AccessibleWorkbenchPanel } from './AccessibleWorkbenchPanel';

export interface VirtualBreadboardProps {
  initialPresetId?: string;
  onNavigateToLab?: (id: number) => void;
}

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

export const VirtualBreadboard: React.FC<VirtualBreadboardProps> = ({
  initialPresetId,
  onNavigateToLab,
}) => {
  const { unlockAchievement } = useCourseStore();
  const { user } = useAuth();

  // Active Preset tracking
  const [activePresetId, setActivePresetId] = useState<string | null>(initialPresetId || 'exp1-gates');
  const activePreset = useMemo(() => {
    return BREADBOARD_PRESETS.find((p) => p.id === activePresetId) || null;
  }, [activePresetId]);

  // Mode: Guided Mode vs Build It Yourself Mode (Task 21a, 22c)
  const [workspaceMode, setWorkspaceMode] = useState<'guided' | 'build'>('guided');

  // Simulation Running State (Play/Pause)
  const [isSimulating, setIsSimulating] = useState<boolean>(true);

  // Circuit Name (Editable Inline)
  const [circuitName, setCircuitName] = useState<string>(
    activePreset ? activePreset.name : 'Lab 1: Logic Gates (7408 AND & 7432 OR)'
  );
  const [isEditingName, setIsEditingName] = useState<boolean>(false);

  // Placed components & wires state (Default initialized with Lab 1 preset)
  const initialPresetData = useMemo(() => {
    return BREADBOARD_PRESETS.find((p) => p.id === (initialPresetId || 'exp1-gates')) || BREADBOARD_PRESETS[0];
  }, []);

  const [components, setComponents] = useState<CircuitComponent[]>(() => {
    const saved = localStorage.getItem('dsd_active_breadboard_circuit');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.components) && parsed.components.length > 0) return parsed.components;
      } catch (e) {}
    }
    return initialPresetData.components;
  });

  const [wires, setWires] = useState<Wire[]>(() => {
    const saved = localStorage.getItem('dsd_active_breadboard_circuit');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.wires) && parsed.wires.length > 0) return parsed.wires;
      } catch (e) {}
    }
    return initialPresetData.wires.map((w, idx) => ({
      id: w.id || `w-${idx}`,
      fromId: w.from.label || `from-${idx}`,
      toId: w.to.label || `to-${idx}`,
      color: w.color || '#0284c7',
      from: { x: w.from.x, y: w.from.y, label: w.from.label },
      to: { x: w.to.x, y: w.to.y, label: w.to.label },
    }));
  });

  // Load preset whenever initialPresetId changes from external navigation
  useEffect(() => {
    if (initialPresetId) {
      const found = BREADBOARD_PRESETS.find((p) => p.id === initialPresetId);
      if (found) {
        handleLoadPreset(found);
      }
    }
  }, [initialPresetId]);

  // Selection states
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [selectedWireId, setSelectedWireId] = useState<string | null>(null);
  const selectedComponent = useMemo(() => {
    return components.find((c) => c.id === selectedComponentId) || null;
  }, [components, selectedComponentId]);

  // Palette & Modals
  const [paletteOpen, setPaletteOpen] = useState<boolean>(true);
  const [starterModalOpen, setStarterModalOpen] = useState<boolean>(false);
  const [projectsModalOpen, setProjectsModalOpen] = useState<boolean>(false);
  const [infoModalDef, setInfoModalDef] = useState<ComponentDefinition | null>(null);
  const [saveModalOpen, setSaveModalOpen] = useState<boolean>(false);
  const [savedCircuitsList, setSavedCircuitsList] = useState<SavedCircuitItem[]>([]);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Canvas Viewport Pan & Zoom
  const [zoom, setZoom] = useState<number>(1.0);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Wiring state & strict hole snapping
  const [wireColor, setWireColor] = useState<string>('#ef4444');
  const [wiringFrom, setWiringFrom] = useState<TerminalPoint | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [hoveredHole, setHoveredHole] = useState<BreadboardHole | null>(null);
  const [validationToast, setValidationToast] = useState<{
    type: 'success' | 'error';
    message: string;
    fixSuggestion?: string;
  } | null>(null);
  const [lastSnapPoint, setLastSnapPoint] = useState<{ x: number; y: number } | null>(null);
  const breadboardContainerRef = useRef<HTMLDivElement>(null);

  // Multimeter Probe state
  const [probeMode, setProbeMode] = useState<boolean>(false);
  const [probeReading, setProbeReading] = useState<{ pin: string; voltage: string; note: string } | null>(null);

  // Verification payoff
  const [verifierSweep, setVerifierSweep] = useState<boolean>(false);
  const [verifierMessage, setVerifierMessage] = useState<string | null>(null);

  // Master Power Switch (VBB Style: Images 3 & 4)
  const [isPowerOn, setIsPowerOn] = useState<boolean>(true);

  // Digital Simulation Timer (VBB Style: Images 3 & 4)
  const [simulationSeconds, setSimulationSeconds] = useState<number>(18.766);
  useEffect(() => {
    if (!isSimulating || !isPowerOn) return;
    const timer = setInterval(() => {
      setSimulationSeconds((prev) => prev + 0.05);
    }, 50);
    return () => clearInterval(timer);
  }, [isSimulating, isPowerOn]);

  const formattedSimTime = useMemo(() => {
    const totalMs = Math.floor(simulationSeconds * 1000);
    const m = Math.floor(totalMs / 60000);
    const s = Math.floor((totalMs % 60000) / 1000);
    const ms = totalMs % 1000;
    const pad = (n: number, w: number = 2) => String(n).padStart(w, '0');
    return `${pad(m)}:${pad(s)}.${pad(ms, 3)} (100%)`;
  }, [simulationSeconds]);

  // VBB-Style Hardware & PHY Console Logs (Image 4)
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLogEntry[]>([
    { time: '00:00.000', type: 'phy', msg: 'Mixed Reality & Hardware Abstraction Layer Started' },
    { time: '00:00.012', type: 'success', msg: 'Power Rails Energized: VCC +5.00V DC / GND 0.00V Reference Active' },
    { time: '00:00.045', type: 'info', msg: 'Breadboard Solver: 420 tie points mapped to 30 vertical tie strips' },
    { time: '00:00.088', type: 'info', msg: 'Runtime Engine: Astable clock generator running at 1.6 Hz' },
  ]);

  const addConsoleLog = useCallback((type: 'info' | 'warn' | 'success' | 'phy', msg: string) => {
    setConsoleLogs((prev) => [
      ...prev.slice(-49),
      { time: formattedSimTime.split(' ')[0], type, msg },
    ]);
  }, [formattedSimTime]);

  // VBB Left Panel Docs/Reference State (Images 3 & 4)
  const [vbbDocsOpen, setVbbDocsOpen] = useState<boolean>(true);
  const [vbbDocsTab, setVbbDocsTab] = useState<'docs' | 'theory' | 'pinouts' | 'shortcuts'>('docs');

  // Clock tick generator for sequential/timer circuits
  const [clockTick, setClockTick] = useState<number>(0);
  useEffect(() => {
    if (!isSimulating || !isPowerOn) return;
    const timer = setInterval(() => {
      setClockTick((prev) => prev + 1);
    }, 600); // ~1.6 Hz
    return () => clearInterval(timer);
  }, [isSimulating, isPowerOn]);

  // Microcontroller Code Editor State (Task 20)
  const [isCodePanelOpen, setIsCodePanelOpen] = useState<boolean>(false);
  const [sketchCode, setSketchCode] = useState<string>(
    STARTER_CIRCUITS.find((c) => c.id === 'mcu-blink')?.sketchCode ||
    `// Project 1: Arduino Blink\nconst int ledPin = 13;\n\nvoid setup() {\n  pinMode(ledPin, OUTPUT);\n  Serial.begin(9600);\n  Serial.println("Arduino Online: Loop Ready");\n}\n\nvoid loop() {\n  digitalWrite(ledPin, HIGH);\n  delay(1000);\n  digitalWrite(ledPin, LOW);\n  delay(1000);\n}`
  );
  const [isSketchRunning, setIsSketchRunning] = useState<boolean>(false);
  const [sketchError, setSketchError] = useState<string | null>(null);
  const sketchRunnerRef = useRef<SketchRunner | null>(null);

  const handleStartSketch = () => {
    setSketchError(null);
    setIsSketchRunning(true);
    addConsoleLog('phy', 'Sketch compiler: Uploading binary to virtual microcontroller...');

    const runner = new SketchRunner({
      onPinChange: (pin, high, _analogVal) => {
        setComponents((prev) =>
          prev.map((c) => {
            if (c.category === 'microcontrollers' || c.type.startsWith('arduino_')) {
              const nextPinStates = { ...(c.properties.pinStates || {}), [pin]: high };
              return {
                ...c,
                properties: {
                  ...c.properties,
                  pinStates: nextPinStates,
                  pin13LedState: pin === 'D13' || pin === '13' ? high : c.properties.pin13LedState,
                  pin2LedState: pin === 'D2' || pin === '2' ? high : c.properties.pin2LedState,
                },
              };
            }
            return c;
          })
        );
      },
      onSerialMessage: (msg) => {
        addConsoleLog('info', `[Serial] ${msg}`);
      },
      onError: (err) => {
        setSketchError(err);
        setIsSketchRunning(false);
        addConsoleLog('warn', `Sketch Runtime Error: ${err}`);
      },
    });

    sketchRunnerRef.current = runner;
    runner.start(sketchCode);
    addConsoleLog('success', 'Virtual Sketch Execution Started (Loop Active)');
  };

  const handleStopSketch = () => {
    if (sketchRunnerRef.current) {
      sketchRunnerRef.current.stop();
      sketchRunnerRef.current = null;
    }
    setIsSketchRunning(false);
    addConsoleLog('info', 'Sketch execution stopped.');
  };

  const handleResetSketch = () => {
    handleStopSketch();
    setSketchError(null);
  };

  // Dragging placed component on canvas
  const [draggingCompId, setDraggingCompId] = useState<string | null>(null);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // =========================================================================
  // AUTHENTIC BREADBOARD TIE-POINT HOLES GRID (Columns 1..30, Rows A-E & F-J, Dual Rails)
  // =========================================================================
  const breadboardHoles: BreadboardHole[] = useMemo(() => {
    const list: BreadboardHole[] = [];
    const numCols = 30;
    const startX = 110;
    const dx = 26;

    for (let c = 1; c <= numCols; c++) {
      const hx = startX + (c - 1) * dx;

      // Top power rails
      list.push({
        id: `rail:top_plus:${c}`,
        name: `+5V Rail (Col ${c})`,
        type: 'vcc',
        x: hx,
        y: 50,
        col: c,
        rail: 'top_plus',
      });
      list.push({
        id: `rail:top_minus:${c}`,
        name: `GND Rail (Col ${c})`,
        type: 'gnd',
        x: hx,
        y: 76,
        col: c,
        rail: 'top_minus',
      });

      // Terminal Strip Upper (Rows A..E)
      const upperRows: { r: string; y: number }[] = [
        { r: 'A', y: 124 },
        { r: 'B', y: 146 },
        { r: 'C', y: 168 },
        { r: 'D', y: 190 },
        { r: 'E', y: 212 },
      ];
      upperRows.forEach(({ r, y }) => {
        list.push({
          id: `strip:${c}:${r}`,
          name: `Hole ${r}${c}`,
          type: 'pin',
          x: hx,
          y,
          col: c,
          row: r,
        });
      });

      // Terminal Strip Lower (Rows F..J)
      const lowerRows: { r: string; y: number }[] = [
        { r: 'F', y: 268 },
        { r: 'G', y: 290 },
        { r: 'H', y: 312 },
        { r: 'I', y: 334 },
        { r: 'J', y: 356 },
      ];
      lowerRows.forEach(({ r, y }) => {
        list.push({
          id: `strip:${c}:${r}`,
          name: `Hole ${r}${c}`,
          type: 'pin',
          x: hx,
          y,
          col: c,
          row: r,
        });
      });

      // Bottom power rails
      list.push({
        id: `rail:bottom_plus:${c}`,
        name: `+5V Bottom Rail (Col ${c})`,
        type: 'vcc',
        x: hx,
        y: 404,
        col: c,
        rail: 'bottom_plus',
      });
      list.push({
        id: `rail:bottom_minus:${c}`,
        name: `GND Bottom Rail (Col ${c})`,
        type: 'gnd',
        x: hx,
        y: 430,
        col: c,
        rail: 'bottom_minus',
      });
    }

    return list;
  }, []);

  // Fixed Breadboard Power Rail Terminals for backward compatibility
  const railTerminals: TerminalPoint[] = useMemo(() => [
    { id: 'vcc-rail-1', name: '+5V Rail (Top)', x: 90, y: 40, type: 'vcc' },
    { id: 'vcc-rail-2', name: '+5V Rail (Top Right)', x: 380, y: 40, type: 'vcc' },
    { id: 'gnd-rail-1', name: 'GND Rail (Bottom)', x: 90, y: 355, type: 'gnd' },
    { id: 'gnd-rail-2', name: 'GND Rail (Bottom Right)', x: 380, y: 355, type: 'gnd' },
  ], []);

  // Dynamic Component Pin Terminals
  const allTerminals: TerminalPoint[] = useMemo(() => {
    const list: TerminalPoint[] = [...railTerminals];

    // Add component pins
    components.forEach((comp) => {
      comp.pins.forEach((pin) => {
        const angleRad = (comp.rotation * Math.PI) / 180;
        const cos = Math.cos(angleRad);
        const sin = Math.sin(angleRad);
        const rotX = pin.xOffset * cos - pin.yOffset * sin;
        const rotY = pin.xOffset * sin + pin.yOffset * cos;

        list.push({
          id: `${comp.id}:${pin.id}`,
          name: `${comp.name} [${pin.label}]`,
          x: comp.x + rotX,
          y: comp.y + rotY,
          type: pin.role === 'vcc' ? 'vcc' : pin.role === 'gnd' ? 'gnd' : pin.role === 'output' ? 'output' : 'pin',
        });
      });
    });

    // Add breadboard holes
    breadboardHoles.forEach((hole) => {
      list.push({
        id: hole.id,
        name: hole.name,
        x: hole.x,
        y: hole.y,
        type: hole.type,
      });
    });

    return list;
  }, [components, railTerminals, breadboardHoles]);

  // Electrical Simulation Engine
  const simulation: SimulationResult = useMemo(() => {
    if (!isPowerOn) {
      return {
        isVccConnected: false,
        isGndConnected: false,
        componentStates: {},
        issues: [],
        pinVoltages: {},
        shortCircuitDetected: false,
        netCount: 0,
      };
    }
    const breadboardWires: BreadboardWire[] = wires.map((w) => {
      const fromHole = breadboardHoles.find((h) => h.id === w.fromId);
      const toHole = breadboardHoles.find((h) => h.id === w.toId);
      return {
        id: w.id,
        color: (w.color || 'blue') as any,
        from: {
          type: 'tie_point',
          label: w.fromId,
          col: fromHole?.col,
          row: fromHole?.row,
          rail: fromHole?.rail,
          x: w.from.x,
          y: w.from.y,
        },
        to: {
          type: 'tie_point',
          label: w.toId,
          col: toHole?.col,
          row: toHole?.row,
          rail: toHole?.rail,
          x: w.to.x,
          y: w.to.y,
        },
      };
    });

    return simulateCircuit(components, breadboardWires, clockTick);
  }, [components, wires, clockTick, isPowerOn]);

  // TinkerCAD-Style Connected Strip Hover (Image 2)
  const connectedHoveredHoleIds = useMemo(() => {
    if (!hoveredHole) return new Set<string>();
    const ids = new Set<string>();
    if (hoveredHole.row) {
      const isUpper = ['A', 'B', 'C', 'D', 'E'].includes(hoveredHole.row);
      breadboardHoles.forEach((h) => {
        if (h.col === hoveredHole.col && h.row) {
          const hUpper = ['A', 'B', 'C', 'D', 'E'].includes(h.row);
          if (hUpper === isUpper) {
            ids.add(h.id);
          }
        }
      });
    } else if (hoveredHole.rail) {
      breadboardHoles.forEach((h) => {
        if (h.rail === hoveredHole.rail) {
          ids.add(h.id);
        }
      });
    }
    return ids;
  }, [hoveredHole, breadboardHoles]);

  // Inject current circuit state into window for AI Circuit Assistant
  useEffect(() => {
    (window as any).__DSD_CIRCUIT_STATE__ = {
      components: components.map((c) => ({ id: c.id, name: c.name, type: c.type, properties: c.properties })),
      wireCount: wires.length,
      isVccConnected: simulation.isVccConnected,
      isGndConnected: simulation.isGndConnected,
      issues: simulation.issues,
    };
  }, [components, wires, simulation]);

  // --- DEBOUNCED AUTOSAVE (Immediate localStorage + 10s Cloud Autosave) (Task 29) ---
  const [saveStatus, setSaveStatus] = useState<'saved-local' | 'saving-cloud' | 'saved-cloud' | 'unsaved'>('saved-local');
  const cloudSaveTimerRef = useRef<any>(null);

  useEffect(() => {
    // 1. Immediate local save
    try {
      localStorage.setItem(
        'dsd_active_breadboard_circuit',
        JSON.stringify({ components, wires })
      );
    } catch (e) {}

    // 2. Debounced 10s cloud save if authenticated
    if (user?.id) {
      setSaveStatus('unsaved');
      if (cloudSaveTimerRef.current) clearTimeout(cloudSaveTimerRef.current);
      cloudSaveTimerRef.current = setTimeout(async () => {
        try {
          setSaveStatus('saving-cloud');
          await saveCircuit(
            user.id,
            circuitName || activePreset?.name || 'My Breadboard Circuit',
            { components, wires },
            'Autosaved circuit'
          );
          setSaveStatus('saved-cloud');
        } catch (e) {
          setSaveStatus('saved-local');
        }
      }, 10000);
    } else {
      setSaveStatus('saved-local');
    }

    return () => {
      if (cloudSaveTimerRef.current) clearTimeout(cloudSaveTimerRef.current);
    };
  }, [components, wires, user?.id, circuitName, activePreset?.name]);

  // Screen Reader Live Announcer
  const [screenReaderAnnouncement, setScreenReaderAnnouncement] = useState<string>('');

  // Accessible Non-Dragging Action Handlers (WCAG 2.2 AA)
  const handleMoveComponentA11y = (id: string, dx: number, dy: number) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, x: c.x + dx, y: c.y + dy } : c))
    );
    setWires((prev) =>
      prev.map((w) => {
        let updated = { ...w };
        if (w.fromId.startsWith(`${id}:`)) {
          updated.from = { ...updated.from, x: updated.from.x + dx, y: updated.from.y + dy };
        }
        if (w.toId.startsWith(`${id}:`)) {
          updated.to = { ...updated.to, x: updated.to.x + dx, y: updated.to.y + dy };
        }
        return updated;
      })
    );
    const comp = components.find((c) => c.id === id);
    setScreenReaderAnnouncement(`Moved ${comp?.name || 'component'} by ${dx}px horizontally, ${dy}px vertically.`);
  };

  const handleAddWireA11y = (fromTerm: TerminalPoint, toTerm: TerminalPoint, color: string) => {
    const validation = validateWireConnection(fromTerm, toTerm, wires);
    if (!validation.valid) {
      playErrorClick();
      setValidationToast({
        type: 'error',
        message: validation.reason || 'Invalid wire connection.',
        fixSuggestion: validation.fixSuggestion,
      });
      return;
    }

    playConnectClick();
    const newWire: Wire = {
      id: `w-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      fromId: fromTerm.id,
      toId: toTerm.id,
      color,
      from: { x: fromTerm.x, y: fromTerm.y, label: fromTerm.name },
      to: { x: toTerm.x, y: toTerm.y, label: toTerm.name },
    };

    const nextWires = [...wires, newWire];
    pushUndoAction({
      type: 'ADD_WIRE',
      prevComponents: components,
      prevWires: wires,
      nextComponents: components,
      nextWires,
    });
    setWires(nextWires);
    unlockAchievement('first_wire');
    setScreenReaderAnnouncement(`Connected jumper wire between ${fromTerm.name} and ${toTerm.name}.`);
  };

  const handlePlaceComponentAtHoleA11y = (compType: string, hole: BreadboardHole) => {
    const def = COMPONENT_LIBRARY.find((c) => c.type === compType);
    if (!def) return;
    const newComp: CircuitComponent = {
      id: `comp-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      name: def.name,
      type: def.type,
      category: def.category as any,
      x: hole.x,
      y: hole.y,
      rotation: 0,
      pins: def.pins.map((p) => ({
        id: p.id,
        label: p.label,
        role: p.role,
        xOffset: p.xOffset,
        yOffset: p.yOffset,
      })),
      properties: { ...def.defaultProperties },
    };
    const nextComponents = [...components, newComp];
    pushUndoAction({
      type: 'ADD_COMPONENT',
      prevComponents: components,
      prevWires: wires,
      nextComponents,
      nextWires: wires,
    });
    setComponents(nextComponents);
    playConnectClick();
    setScreenReaderAnnouncement(`Placed ${def.name} at ${hole.name}.`);
  };

  // --- STACK FOR UNDO / REDO HISTORY (LIFO Behavior) ---
  interface CircuitAction {
    type: 'ADD_WIRE' | 'REMOVE_WIRE' | 'MOVE_COMPONENT' | 'ADD_COMPONENT' | 'REMOVE_COMPONENT' | 'ROTATE_COMPONENT' | 'LOAD_STATE';
    prevComponents: CircuitComponent[];
    prevWires: Wire[];
    nextComponents: CircuitComponent[];
    nextWires: Wire[];
  }

  const undoStack = useRef(new Stack<CircuitAction>(50));
  const redoStack = useRef(new Stack<CircuitAction>(50));
  const [canUndo, setCanUndo] = useState<boolean>(false);
  const [canRedo, setCanRedo] = useState<boolean>(false);

  const updateUndoRedoFlags = useCallback(() => {
    setCanUndo(!undoStack.current.isEmpty());
    setCanRedo(!redoStack.current.isEmpty());
  }, []);

  const pushUndoAction = useCallback(
    (action: CircuitAction) => {
      undoStack.current.push(action);
      redoStack.current.clear();
      updateUndoRedoFlags();
    },
    [updateUndoRedoFlags]
  );

  const handleUndo = useCallback(() => {
    if (undoStack.current.isEmpty()) return;
    playSoftClick();
    const action = undoStack.current.pop()!;
    redoStack.current.push(action);
    setComponents(action.prevComponents);
    setWires(action.prevWires);
    updateUndoRedoFlags();
  }, [updateUndoRedoFlags]);

  const handleRedo = useCallback(() => {
    if (redoStack.current.isEmpty()) return;
    playSoftClick();
    const action = redoStack.current.pop()!;
    undoStack.current.push(action);
    setComponents(action.nextComponents);
    setWires(action.nextWires);
    updateUndoRedoFlags();
  }, [updateUndoRedoFlags]);

  // Keyboard Shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      } else if (e.key === 'Escape') {
        setWiringFrom(null);
        setMousePos(null);
        setSelectedComponentId(null);
        setSelectedWireId(null);
      } else if (e.key.toLowerCase() === 'r' && selectedComponentId) {
        handleRotateComponent(selectedComponentId);
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && (selectedComponentId || selectedWireId)) {
        e.preventDefault();
        if (selectedWireId) {
          handleRemoveWire(selectedWireId);
          setSelectedWireId(null);
        } else if (selectedComponentId) {
          handleRemoveComponent(selectedComponentId);
          setSelectedComponentId(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedComponentId, selectedWireId, handleUndo, handleRedo]);

  // Terminal & Hole Click Handler
  const handleTerminalClick = (terminal: TerminalPoint) => {
    // 1. Multimeter Probe Mode
    if (probeMode) {
      playSoftClick();
      const reading = simulation.pinVoltages[terminal.id];
      if (reading) {
        setProbeReading({
          pin: terminal.name,
          voltage: `${reading.voltage.toFixed(2)} V (${reading.logic})`,
          note: reading.note,
        });
      } else if (terminal.type === 'vcc') {
        setProbeReading({
          pin: terminal.name,
          voltage: '5.00 V (VCC)',
          note: 'Continuous +5V DC Supply Rail',
        });
      } else if (terminal.type === 'gnd') {
        setProbeReading({
          pin: terminal.name,
          voltage: '0.00 V (GND)',
          note: '0V System Reference Ground',
        });
      } else {
        setProbeReading({
          pin: terminal.name,
          voltage: '0.00 V (Floating)',
          note: 'High-impedance or unpowered terminal',
        });
      }
      return;
    }

    // 2. Wiring Mode
    if (!wiringFrom) {
      playSoftClick();
      setWiringFrom(terminal);
    } else {
      if (wiringFrom.id === terminal.id) {
        setWiringFrom(null);
        setMousePos(null);
        return;
      }

      const validation = validateWireConnection(wiringFrom, terminal, wires);
      if (!validation.valid) {
        playErrorClick();
        setValidationToast({
          type: 'error',
          message: validation.reason || 'Invalid wire connection.',
          fixSuggestion: validation.fixSuggestion,
        });
        setWiringFrom(null);
        setMousePos(null);
        return;
      }

      playConnectClick();
      setLastSnapPoint({ x: terminal.x, y: terminal.y });
      setTimeout(() => setLastSnapPoint(null), 800);

      const newWire: Wire = {
        id: `w-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        fromId: wiringFrom.id,
        toId: terminal.id,
        color: wireColor,
        from: { x: wiringFrom.x, y: wiringFrom.y, label: wiringFrom.name },
        to: { x: terminal.x, y: terminal.y, label: terminal.name },
      };

      const nextWires = [...wires, newWire];
      pushUndoAction({
        type: 'ADD_WIRE',
        prevComponents: components,
        prevWires: wires,
        nextComponents: components,
        nextWires,
      });

      setWires(nextWires);
      unlockAchievement('first_wire');
      addConsoleLog('success', `Jumper Wire Connected: ${wiringFrom.name} → ${terminal.name}`);
      setValidationToast({
        type: 'success',
        message: `Connected: ${wiringFrom.name} → ${terminal.name}`,
      });
      setWiringFrom(null);
      setMousePos(null);
    }
  };

  // Remove Wire
  const handleRemoveWire = (wireId: string) => {
    playSoftClick();
    const nextWires = wires.filter((w) => w.id !== wireId);
    pushUndoAction({
      type: 'REMOVE_WIRE',
      prevComponents: components,
      prevWires: wires,
      nextComponents: components,
      nextWires,
    });
    setWires(nextWires);
  };

  // Add Component from Palette
  const handlePlaceComponentFromPalette = (def: ComponentDefinition) => {
    playSoftClick();
    const newId = `comp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const posX = 320 + (components.length % 5) * 40;
    const posY = 200 + ((components.length * 30) % 90);

    const newComponent: CircuitComponent = {
      id: newId,
      type: def.type,
      name: def.name,
      category: def.category,
      x: posX,
      y: posY,
      rotation: 0,
      pins: def.pins,
      properties: { ...def.defaultProperties },
    };

    const nextComponents = [...components, newComponent];
    pushUndoAction({
      type: 'ADD_COMPONENT',
      prevComponents: components,
      prevWires: wires,
      nextComponents,
      nextWires: wires,
    });

    setComponents(nextComponents);
    setSelectedComponentId(newId);
  };

  // Rotate Component
  const handleRotateComponent = (compId: string) => {
    playSoftClick();
    const comp = components.find((c) => c.id === compId);
    if (!comp) return;

    const nextRotation = (((comp.rotation + 90) % 360) as 0 | 90 | 180 | 270);
    const nextComponents = components.map((c) =>
      c.id === compId ? { ...c, rotation: nextRotation } : c
    );

    pushUndoAction({
      type: 'ROTATE_COMPONENT',
      prevComponents: components,
      prevWires: wires,
      nextComponents,
      nextWires: wires,
    });

    setComponents(nextComponents);
  };

  // Remove Component
  const handleRemoveComponent = (compId: string) => {
    playSoftClick();
    const nextWires = wires.filter(
      (w) => !w.fromId.startsWith(`${compId}:`) && !w.toId.startsWith(`${compId}:`)
    );
    const nextComponents = components.filter((c) => c.id !== compId);

    pushUndoAction({
      type: 'REMOVE_COMPONENT',
      prevComponents: components,
      prevWires: wires,
      nextComponents,
      nextWires: wires,
    });

    setComponents(nextComponents);
    setWires(nextWires);
  };

  // Toggle Component Interactive State (Switches / Pushbuttons)
  const handleToggleComponentProperty = (compId: string, propKey: string, val: any) => {
    playSoftClick();
    setComponents((prev) =>
      prev.map((c) =>
        c.id === compId
          ? { ...c, properties: { ...c.properties, [propKey]: val } }
          : c
      )
    );
  };

  // Start Blank Project
  const handleNewBlankProject = () => {
    playSoftClick();
    pushUndoAction({
      type: 'LOAD_STATE',
      prevComponents: components,
      prevWires: wires,
      nextComponents: [],
      nextWires: [],
    });
    setComponents([]);
    setWires([]);
    setSelectedComponentId(null);
    setSelectedWireId(null);
    setActivePresetId(null);
    setCircuitName('Custom Circuit Sandbox');
    setValidationToast({
      type: 'success',
      message: 'Created new blank project. Drag components from the palette to begin!',
    });
  };

  // Load Preset Circuit
  const handleLoadPreset = (preset: BreadboardPreset) => {
    playConnectClick();
    setActivePresetId(preset.id);
    setCircuitName(preset.name);

    const nextWires: Wire[] = preset.wires.map((w, idx) => ({
      id: w.id || `w-${idx}`,
      fromId: w.from.label || `from-${idx}`,
      toId: w.to.label || `to-${idx}`,
      color: w.color || '#0284c7',
      from: { x: w.from.x, y: w.from.y, label: w.from.label },
      to: { x: w.to.x, y: w.to.y, label: w.to.label },
    }));

    pushUndoAction({
      type: 'LOAD_STATE',
      prevComponents: components,
      prevWires: wires,
      nextComponents: preset.components,
      nextWires,
    });

    setComponents(preset.components);
    setWires(nextWires);
    setSelectedComponentId(null);
    setSelectedWireId(null);
  };

  // Reset to original preset
  const handleResetBoard = () => {
    if (activePreset) {
      handleLoadPreset(activePreset);
      setValidationToast({
        type: 'success',
        message: `Reset "${activePreset.name}" to initial state.`,
      });
    } else {
      handleNewBlankProject();
    }
  };

  // Save current circuit to Supabase
  const handleSaveCurrentCircuit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!circuitName.trim()) return;

    const payload = {
      components,
      wires,
    };

    const res = await saveCircuit(user?.id || null, circuitName.trim(), payload);
    if (res.success) {
      playSuccessChime();
      setSaveSuccessMsg(`Circuit "${circuitName}" saved successfully!`);
      setTimeout(() => {
        setSaveSuccessMsg(null);
        setSaveModalOpen(false);
      }, 1300);
    }
  };

  // Open Saved Projects Modal
  const handleOpenProjects = async () => {
    const list = await fetchSavedCircuits(user?.id || '');
    setSavedCircuitsList(list);
    setProjectsModalOpen(true);
  };

  const handleLoadSavedProject = (item: SavedCircuitItem) => {
    if (item.circuit_json) {
      const nextComps = Array.isArray(item.circuit_json.components)
        ? item.circuit_json.components
        : [];
      const nextWires = Array.isArray(item.circuit_json.wires)
        ? item.circuit_json.wires
        : [];

      pushUndoAction({
        type: 'LOAD_STATE',
        prevComponents: components,
        prevWires: wires,
        nextComponents: nextComps,
        nextWires,
      });

      setComponents(nextComps);
      setWires(nextWires);
      setActivePresetId(null);
      setCircuitName(item.name || 'Saved Project');
      playConnectClick();
      setProjectsModalOpen(false);
    }
  };

  const handleDeleteSavedProject = async (id: string) => {
    await deleteSavedCircuit(user?.id || null, id);
    setSavedCircuitsList((prev) => prev.filter((c) => c.id !== id));
  };

  // Verify Circuit with Confetti Payoff
  const handleVerifyCircuit = () => {
    if (simulation.shortCircuitDetected) {
      playAlarmBuzz();
      setVerifierMessage('Direct VCC-GND short circuit detected! Disconnect conflicting wires before verifying.');
      setTimeout(() => setVerifierMessage(null), 4000);
      return;
    }

    if (simulation.issues.length === 0 && components.length > 0) {
      setVerifierSweep(true);
      playSuccessChime();
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#10B981', '#4F46E5', '#FF9F1C'],
      });
      setVerifierMessage('Verification Passed! Circuit is electrically continuous, fully powered, and functioning within safe ratings.');
      unlockAchievement('first_lab');
      setTimeout(() => setVerifierSweep(false), 1400);
    } else {
      playAlarmBuzz();
      setVerifierMessage(`Circuit Incomplete: ${simulation.issues.length} diagnostic issues need attention.`);
      setTimeout(() => setVerifierMessage(null), 4000);
    }
  };

  // Mouse move for rubber-banding and hole-snapping
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!breadboardContainerRef.current) return;
    const rect = breadboardContainerRef.current.getBoundingClientRect();
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;

    const canvasX = (rawX - panOffset.x) / zoom;
    const canvasY = (rawY - panOffset.y) / zoom;

    // Strict Hole-Snapping: find nearest breadboard hole within 16px radius
    let nearest: BreadboardHole | null = null;
    let minDist = 18;

    for (const h of breadboardHoles) {
      const dist = Math.hypot(canvasX - h.x, canvasY - h.y);
      if (dist < minDist) {
        minDist = dist;
        nearest = h;
      }
    }

    setHoveredHole(nearest);

    if (wiringFrom) {
      if (nearest) {
        setMousePos({ x: nearest.x, y: nearest.y });
      } else {
        setMousePos({ x: canvasX, y: canvasY });
      }
    }

    if (draggingCompId) {
      const targetComp = components.find((c) => c.id === draggingCompId);
      if (targetComp) {
        const nextX = canvasX - dragOffsetRef.current.x;
        const nextY = canvasY - dragOffsetRef.current.y;
        const dx = nextX - targetComp.x;
        const dy = nextY - targetComp.y;

        setComponents((prev) =>
          prev.map((c) =>
            c.id === draggingCompId ? { ...c, x: nextX, y: nextY } : c
          )
        );

        if (dx !== 0 || dy !== 0) {
          setWires((prev) =>
            prev.map((w) => {
              let updated = { ...w };
              if (w.fromId.startsWith(`${draggingCompId}:`)) {
                updated.from = { ...updated.from, x: updated.from.x + dx, y: updated.from.y + dy };
              }
              if (w.toId.startsWith(`${draggingCompId}:`)) {
                updated.to = { ...updated.to, x: updated.to.x + dx, y: updated.to.y + dy };
              }
              return updated;
            })
          );
        }
      }
    }

    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStartRef.current.x,
        y: e.clientY - panStartRef.current.y,
      });
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || e.altKey) {
      setIsPanning(true);
      panStartRef.current = {
        x: e.clientX - panOffset.x,
        y: e.clientY - panOffset.y,
      };
    }
  };

  const handleCanvasMouseUp = () => {
    setIsPanning(false);
    setDraggingCompId(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.1 : -0.1;
      setZoom((z) => Math.max(0.6, Math.min(1.8, Number((z + delta).toFixed(2)))));
    }
  };

  // Trigger AI assistant from diagnostic issue
  const handleAskAiAboutIssue = (issue: any) => {
    window.dispatchEvent(
      new CustomEvent('dsd:open-tutor', {
        detail: {
          prompt: `Please help me understand and fix this breadboard circuit error: "${issue.title}". Why does this happen?`,
        },
      })
    );
  };

  // Guided Mode Wiring Progress
  const guidedProgress = useMemo(() => {
    if (workspaceMode !== 'guided' || !activePreset) return null;
    const targetWiresCount = activePreset.wires.length;
    const currentCount = Math.min(wires.length, targetWiresCount);
    const percent = Math.round((currentCount / Math.max(1, targetWiresCount)) * 100);
    return {
      current: currentCount,
      total: targetWiresCount,
      percent,
      isComplete: currentCount >= targetWiresCount && simulation.issues.length === 0,
    };
  }, [workspaceMode, activePreset, wires.length, simulation.issues.length]);

  return (
    <div className="space-y-4 font-sans select-none">
      {/* =========================================================================
          1. SLIM TOP TOOLBAR (Height ~48px) - Modern EDA Aesthetic (Task 21a)
          ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-2xl bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border shadow-xs text-xs">
        {/* Left: Circuit Name, Mode Toggle, and Preset Selector */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Master Power Switch (VBB Style: Images 3 & 4) */}
          <button
            onClick={() => {
              playSoftClick();
              const nextPower = !isPowerOn;
              setIsPowerOn(nextPower);
              addConsoleLog(
                nextPower ? 'success' : 'warn',
                nextPower
                  ? 'PHY Service: Power Rails Energized (+5.00V DC / GND 0.00V Active)'
                  : 'PHY Service: Power Rails De-energized (0.00V). Simulation suspended.'
              );
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all shadow-xs ${
              isPowerOn
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20 ring-1 ring-emerald-400'
                : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20 ring-1 ring-rose-400'
            }`}
            title={isPowerOn ? 'Master Power ON: 5.0V Active (Click to power down)' : 'Master Power OFF: 0.0V (Click to energize rails)'}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{isPowerOn ? 'Power On' : 'Power Off'}</span>
          </button>

          {/* Editable Circuit Name */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-cream-soft dark:bg-darklab-base border border-cream-border dark:border-darklab-border">
            {isEditingName ? (
              <input
                type="text"
                value={circuitName}
                onChange={(e) => setCircuitName(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                autoFocus
                className="bg-transparent font-display font-extrabold text-xs text-ink-900 dark:text-cream-paper outline-none w-44 sm:w-56"
              />
            ) : (
              <button
                onClick={() => setIsEditingName(true)}
                className="flex items-center gap-1.5 font-display font-extrabold text-xs text-ink-900 dark:text-cream-paper hover:text-brand-600 transition-colors"
                title="Click to edit circuit title"
              >
                <span className="truncate max-w-[180px] sm:max-w-[260px]">{circuitName}</span>
                <Edit3 className="w-3 h-3 text-ink-400 shrink-0" />
              </button>
            )}
          </div>

          {/* Mode Switch: Guided Mode vs Build It Yourself */}
          <div className="flex items-center p-0.5 rounded-xl bg-cream-soft dark:bg-darklab-base border border-cream-border dark:border-darklab-border text-[11px] font-bold">
            <button
              onClick={() => {
                playSoftClick();
                setWorkspaceMode('guided');
              }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                workspaceMode === 'guided'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-ink-600 dark:text-cream-muted hover:text-ink-900'
              }`}
            >
              Guided Mode
            </button>
            <button
              onClick={() => {
                playSoftClick();
                setWorkspaceMode('build');
              }}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                workspaceMode === 'build'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-ink-600 dark:text-cream-muted hover:text-ink-900'
              }`}
            >
              Build It Yourself
            </button>
          </div>

          {/* Preset Selector Dropdown */}
          <select
            value={activePresetId || 'blank'}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'blank') {
                handleNewBlankProject();
              } else {
                const found = BREADBOARD_PRESETS.find((p) => p.id === val);
                if (found) handleLoadPreset(found);
              }
            }}
            className="px-2.5 py-1.5 rounded-xl bg-cream-soft dark:bg-darklab-base border border-cream-border dark:border-darklab-border text-xs font-semibold text-ink-800 dark:text-cream-paper outline-none cursor-pointer"
          >
            <optgroup label="Curriculum Lab Presets (Labs 1–8 & 11)">
              {BREADBOARD_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </optgroup>
            <option value="blank">Blank Workbench Sandbox</option>
          </select>

          {/* Guided Mode Progress Badge */}
          {workspaceMode === 'guided' && guidedProgress && (
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-[11px] font-mono text-indigo-900 dark:text-indigo-200">
              <span className="font-bold">Wiring: {guidedProgress.current}/{guidedProgress.total}</span>
              <div className="w-16 h-1.5 rounded-full bg-indigo-200 dark:bg-indigo-800 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 transition-all duration-300"
                  style={{ width: `${guidedProgress.percent}%` }}
                />
              </div>
              {guidedProgress.isComplete && (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ Ready</span>
              )}
            </div>
          )}
        </div>

        {/* Center/Right: Simulation Controls, Probe, Tools */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* VBB Simulation Time Clock (Images 3 & 4) */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#0b0f19] text-emerald-400 font-mono text-[11px] font-bold border border-emerald-900/50 shadow-inner">
            <Activity className="w-3.5 h-3.5 text-emerald-500 shrink-0 animate-pulse" />
            <span className="text-stone-400 font-sans text-[10px]">Time:</span>
            <span>{formattedSimTime}</span>
          </div>

          {/* Start / Stop Simulation with pulsing green LED */}
          <button
            onClick={() => {
              playSoftClick();
              setIsSimulating(!isSimulating);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              isSimulating
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
            }`}
            title={isSimulating ? 'Pause circuit simulation engine' : 'Run circuit simulation engine'}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isSimulating ? 'bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500' : 'bg-stone-400'
              }`}
            />
            {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isSimulating ? 'Simulating' : 'Paused'}</span>
          </button>

          {/* Multimeter Probe Toggle */}
          <button
            onClick={() => {
              playSoftClick();
              setProbeMode(!probeMode);
              setWiringFrom(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all ${
              probeMode
                ? 'bg-purple-600 text-white shadow-xs ring-2 ring-purple-300'
                : 'bg-cream-soft dark:bg-darklab-base text-ink-700 dark:text-cream-paper border border-cream-border dark:border-darklab-border hover:bg-white'
            }`}
            title="Inspect voltage and logic states on any component pin"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{probeMode ? 'Probe Active' : 'Probe'}</span>
          </button>

          {/* Wire Color Palette */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-cream-soft dark:bg-darklab-base border border-cream-border dark:border-darklab-border">
            {[
              { color: '#ef4444', name: 'Red (+5V)' },
              { color: '#1c1917', name: 'Black (GND)' },
              { color: '#0284c7', name: 'Blue (Signal A)' },
              { color: '#f59e0b', name: 'Amber (Signal B)' },
              { color: '#10b981', name: 'Emerald (Output)' },
              { color: '#a855f7', name: 'Purple (Clock)' },
              { color: '#ffffff', name: 'White' },
            ].map((c) => (
              <button
                key={c.color}
                onClick={() => {
                  playSoftClick();
                  setWireColor(c.color);
                  setProbeMode(false);
                }}
                title={c.name}
                className={`w-4 h-4 rounded-full border transition-all ${
                  wireColor === c.color && !probeMode
                    ? 'scale-125 ring-2 ring-indigo-500 border-white'
                    : 'border-stone-400 dark:border-stone-600'
                }`}
                style={{ backgroundColor: c.color }}
              />
            ))}
          </div>

          {/* Undo & Redo */}
          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-cream-soft dark:bg-darklab-base border border-cream-border dark:border-darklab-border">
            <button
              onClick={handleUndo}
              disabled={!canUndo}
              className={`p-1.5 rounded-lg transition-colors ${
                canUndo
                  ? 'text-ink-700 dark:text-cream-paper hover:bg-white dark:hover:bg-darklab-card'
                  : 'text-ink-300 dark:text-darklab-subtle cursor-not-allowed opacity-40'
              }`}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleRedo}
              disabled={!canRedo}
              className={`p-1.5 rounded-lg transition-colors ${
                canRedo
                  ? 'text-ink-700 dark:text-cream-paper hover:bg-white dark:hover:bg-darklab-card'
                  : 'text-ink-300 dark:text-darklab-subtle cursor-not-allowed opacity-40'
              }`}
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center p-0.5 rounded-xl bg-cream-soft dark:bg-darklab-base border border-cream-border dark:border-darklab-border">
            <button
              onClick={() => setZoom((z) => Math.max(0.6, Number((z - 0.1).toFixed(2))))}
              className="p-1 rounded-lg text-ink-600 dark:text-cream-paper hover:bg-white dark:hover:bg-darklab-card transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono px-1.5 font-bold text-ink-600 dark:text-cream-muted">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(1.8, Number((z + 0.1).toFixed(2))))}
              className="p-1 rounded-lg text-ink-600 dark:text-cream-paper hover:bg-white dark:hover:bg-darklab-card transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Microcontroller Code Editor Toggle (Task 20) */}
          <button
            onClick={() => setIsCodePanelOpen(!isCodePanelOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-colors shadow-xs ${
              isCodePanelOpen
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-400/40'
                : 'text-ink-700 dark:text-cream-paper hover:bg-cream-soft dark:hover:bg-darklab-base border border-cream-border dark:border-darklab-border'
            }`}
            title="Toggle Microcontroller Code Panel (C++ Sketches)"
          >
            <FileCode className="w-3.5 h-3.5 text-emerald-500" />
            <span>Code</span>
          </button>

          {/* Verify Circuit */}
          <button
            onClick={handleVerifyCircuit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-transform active:scale-95"
            title="Verify truth table and circuit connections"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verify</span>
          </button>

          {/* Reset Board */}
          <button
            onClick={handleResetBoard}
            className="p-1.5 rounded-xl text-ink-600 dark:text-cream-paper hover:bg-cream-soft dark:hover:bg-darklab-base border border-cream-border dark:border-darklab-border transition-colors"
            title="Reset board to default state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Debounced Autosave Live Indicator (Task 29) */}
          <div className="hidden md:flex items-center">
            {saveStatus === 'saved-cloud' && (
              <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-300 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <Check className="w-3 h-3" />
                <span>Cloud Synced</span>
              </span>
            )}
            {saveStatus === 'saving-cloud' && (
              <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 dark:bg-indigo-950/50 dark:text-indigo-300 px-2 py-0.5 rounded-lg border border-indigo-200 dark:border-indigo-800 animate-pulse">
                <span>Saving to cloud...</span>
              </span>
            )}
            {saveStatus === 'unsaved' && (
              <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-amber-700 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-300 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-800">
                <span>Autosave pending (10s)</span>
              </span>
            )}
            {saveStatus === 'saved-local' && (
              <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-stone-300 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                <span>Saved locally</span>
              </span>
            )}
          </div>

          {/* Save Circuit */}
          <button
            onClick={() => setSaveModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-ink-700 dark:text-cream-paper hover:bg-cream-soft dark:hover:bg-darklab-base border border-cream-border dark:border-darklab-border font-bold text-xs transition-colors"
            title="Save circuit to cloud account"
          >
            <Save className="w-3.5 h-3.5 text-brand-mid" />
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>
      </div>

      {/* Verification Alert Banner */}
      {verifierMessage && (
        <div
          className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2 animate-fadeIn ${
            verifierMessage.includes('Passed')
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-200'
              : 'bg-rose-50 text-rose-900 border-rose-300 dark:bg-rose-950/60 dark:text-rose-200'
          }`}
        >
          {verifierMessage.includes('Passed') ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{verifierMessage}</span>
        </div>
      )}

      {/* Active Wire Routing Banner */}
      {wiringFrom && (
        <div className="p-2.5 rounded-2xl bg-sky-50 dark:bg-sky-950/70 border-2 border-sky-400 dark:border-sky-600 text-xs text-sky-900 dark:text-sky-200 flex items-center justify-between shadow-xs animate-pulse">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping" />
            <span>
              <strong>Routing Wire:</strong> Click target breadboard hole or pin. Press <kbd className="px-1.5 py-0.5 rounded bg-sky-200 dark:bg-sky-800 text-[10px] font-mono">Esc</kbd> to cancel.
            </span>
          </div>
          <button
            onClick={() => {
              setWiringFrom(null);
              setMousePos(null);
            }}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-sky-900 border border-sky-300 text-xs font-bold text-sky-800 dark:text-sky-200 hover:bg-sky-100"
          >
            Cancel (Esc)
          </button>
        </div>
      )}

      {/* Multimeter Probe Reading Callout */}
      {probeMode && probeReading && (
        <div className="p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-xs flex items-center justify-between text-purple-900 dark:text-purple-200 shadow-xs">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <div>
              <span className="font-bold">{probeReading.pin}:</span>{' '}
              <span className="font-mono font-bold text-purple-700 dark:text-purple-300 bg-white dark:bg-purple-900/60 px-2 py-0.5 rounded border border-purple-200 dark:border-purple-800 ml-1">
                {probeReading.voltage}
              </span>
              <span className="text-stone-500 dark:text-stone-400 ml-2">({probeReading.note})</span>
            </div>
          </div>
          <button
            onClick={() => setProbeReading(null)}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
          >
            ✕
          </button>
        </div>
      )}

      {/* =========================================================================
          2. WORKSPACE SPLIT: COLLAPSIBLE PALETTE (LEFT) + CANVAS & DOCKED TABS (RIGHT)
          ========================================================================= */}
      <div className="flex rounded-3xl overflow-hidden border border-cream-border dark:border-darklab-border bg-white dark:bg-darklab-card shadow-sm h-[740px]">
        {/* Left Panel: VBB-Style Docs & Reference Drawer (Images 3 & 4) */}
        <div
          className={`relative flex flex-col bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 transition-all duration-300 z-20 ${
            vbbDocsOpen ? 'w-80' : 'w-12'
          }`}
        >
          {/* Toggle button */}
          <button
            onClick={() => setVbbDocsOpen(!vbbDocsOpen)}
            title={vbbDocsOpen ? 'Collapse Docs & Reference Panel' : 'Expand Docs & Reference Panel'}
            className="absolute -right-3.5 top-6 z-30 p-1 rounded-full bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 shadow-md text-stone-600 dark:text-stone-300 hover:text-indigo-600 transition-colors"
          >
            {vbbDocsOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {/* Collapsed mini-strip */}
          {!vbbDocsOpen && (
            <div className="flex flex-col items-center py-5 gap-5 text-stone-400">
              <button
                onClick={() => {
                  setVbbDocsOpen(true);
                  setVbbDocsTab('docs');
                }}
                className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-amber-500"
                title="Experiment Docs & 'What can I learn?'"
              >
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              </button>
              <button
                onClick={() => {
                  setVbbDocsOpen(true);
                  setVbbDocsTab('theory');
                }}
                className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-indigo-500"
                title="Theory & Truth Table"
              >
                <BookOpen className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setVbbDocsOpen(true);
                  setVbbDocsTab('pinouts');
                }}
                className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-cyan-500"
                title="IC Pinout Reference"
              >
                <Cpu className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setVbbDocsOpen(true);
                  setVbbDocsTab('shortcuts');
                }}
                className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-500"
                title="Keyboard Shortcuts"
              >
                <Keyboard className="w-4 h-4" />
              </button>
              <span className="[writing-mode:vertical-rl] text-[10px] font-bold tracking-widest uppercase text-stone-400 mt-2">
                Experiment Guide
              </span>
            </div>
          )}

          {/* Expanded Drawer Content */}
          {vbbDocsOpen && (
            <div className="flex flex-col h-full overflow-hidden text-xs">
              {/* Header Tab Bar */}
              <div className="flex items-center justify-between p-2 bg-stone-50 dark:bg-stone-800/60 border-b border-stone-200 dark:border-stone-800">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setVbbDocsTab('docs')}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                      vbbDocsTab === 'docs'
                        ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200'
                        : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/50'
                    }`}
                  >
                    <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                    <span>Docs</span>
                  </button>
                  <button
                    onClick={() => setVbbDocsTab('theory')}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                      vbbDocsTab === 'theory'
                        ? 'bg-indigo-100 text-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-200'
                        : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/50'
                    }`}
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>Theory</span>
                  </button>
                  <button
                    onClick={() => setVbbDocsTab('pinouts')}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                      vbbDocsTab === 'pinouts'
                        ? 'bg-cyan-100 text-cyan-900 dark:bg-cyan-950/60 dark:text-cyan-200'
                        : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/50'
                    }`}
                  >
                    <Cpu className="w-3 h-3" />
                    <span>Pinouts</span>
                  </button>
                  <button
                    onClick={() => setVbbDocsTab('shortcuts')}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                      vbbDocsTab === 'shortcuts'
                        ? 'bg-stone-200 text-stone-900 dark:bg-stone-700 dark:text-white'
                        : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/50'
                    }`}
                  >
                    <Keyboard className="w-3 h-3" />
                    <span>Keys</span>
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5">
                {/* 1. Docs Tab (VBB Style: Images 3 & 4) */}
                {vbbDocsTab === 'docs' && (
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 font-mono">
                        {activePreset ? `Curriculum Lab ${activePreset.labNumber}` : 'Custom Circuit Sandbox'}
                      </span>
                      <h3 className="text-sm font-display font-black text-stone-900 dark:text-white mt-0.5">
                        {activePreset ? activePreset.name : circuitName}
                      </h3>
                    </div>

                    {/* Schematic Diagram Block */}
                    <div className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-center space-y-1.5">
                      <div className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider">
                        Circuit Schematic Blueprint
                      </div>
                      <div className="h-20 rounded-xl bg-white dark:bg-stone-900 flex items-center justify-center border border-dashed border-stone-300 dark:border-stone-700 p-2 text-stone-500 font-mono text-[10px]">
                        <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                          <Cpu className="w-4 h-4" />
                          <span>{components.length} ICs & Passives Mounted</span>
                        </div>
                      </div>
                    </div>

                    {/* "What can I learn?" Card (VBB Image 3 Style) */}
                    <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-200">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span>What can I learn?</span>
                      </div>
                      <p className="text-[11px] text-stone-700 dark:text-stone-300 leading-relaxed">
                        {activePreset?.whatCanILearn ||
                          'Explore solderless breadboard prototyping, verify logic gate truth tables, and examine supply continuity.'}
                      </p>
                      <ul className="space-y-1 text-[11px] text-stone-600 dark:text-stone-300 list-disc list-inside">
                        <li>DIP chips straddle the center socket trough across rows E and F.</li>
                        <li>Upper rows A–E and lower rows F–J form 5-hole vertical tie strips.</li>
                        <li>Power rails provide continuous +5V (Red) and 0V GND (Blue).</li>
                        <li>LEDs require current-limiting resistors to prevent overload.</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* 2. Theory & Truth Table */}
                {vbbDocsTab === 'theory' && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-xs text-stone-900 dark:text-white">
                      Expected Truth Table & Logic Equations
                    </h4>
                    {activePreset?.testbench ? (
                      <div className="overflow-x-auto rounded-xl border border-stone-200 dark:border-stone-700">
                        <table className="w-full text-[10px] font-mono">
                          <thead className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                            <tr>
                              {activePreset.testbench.inputs.map((i) => (
                                <th key={i.name} className="p-1 text-center font-bold">
                                  {i.label}
                                </th>
                              ))}
                              {activePreset.testbench.outputs.map((o) => (
                                <th key={o.name} className="p-1 text-center font-bold text-indigo-600 dark:text-indigo-400">
                                  {o.label}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {activePreset.testbench.truthTable.map((row, idx) => (
                              <tr key={idx} className="border-t border-stone-100 dark:border-stone-800 text-center">
                                {activePreset.testbench!.inputs.map((i) => (
                                  <td key={i.name} className="p-1">
                                    {row.inputs[i.name]}
                                  </td>
                                ))}
                                {activePreset.testbench!.outputs.map((o) => (
                                  <td key={o.name} className="p-1 font-bold text-indigo-600 dark:text-indigo-400">
                                    {row.outputs[o.name]}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-stone-500 italic text-[11px]">
                        Load a preset circuit to see its verified truth table.
                      </p>
                    )}
                  </div>
                )}

                {/* 3. IC Pinouts Tab */}
                {vbbDocsTab === 'pinouts' && (
                  <div className="space-y-2.5">
                    <h4 className="font-bold text-xs text-stone-900 dark:text-white">
                      Mounted IC Pinouts (DIP-14 / 16)
                    </h4>
                    {components
                      .filter((c) => c.category === 'logic_ic' || c.category === 'sequential_ic')
                      .map((comp) => {
                        const def = COMPONENT_LIBRARY.find((lib) => lib.type === comp.type);
                        return (
                          <div
                            key={comp.id}
                            className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/70 border border-stone-200 dark:border-stone-700 space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-xs">
                                {comp.name}
                              </span>
                              <span className="text-[10px] text-stone-500 font-mono">
                                {comp.pins.length} Pins
                              </span>
                            </div>
                            {def?.pinoutDescription && (
                              <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-stone-600 dark:text-stone-300">
                                {def.pinoutDescription.slice(0, 6).map((d, i) => (
                                  <div key={i} className="truncate" title={d}>
                                    • {d}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                )}

                {/* 4. Keyboard Shortcuts Tab (DCACLab Image 1) */}
                {vbbDocsTab === 'shortcuts' && (
                  <div className="space-y-2 font-sans">
                    <h4 className="font-bold text-xs text-stone-900 dark:text-white flex items-center gap-1.5">
                      <Keyboard className="w-3.5 h-3.5 text-stone-500" />
                      <span>DCACLab Workspace Shortcuts</span>
                    </h4>
                    <div className="space-y-1.5 text-[11px]">
                      {[
                        { k: 'Del / Backspace', desc: 'Delete selected component or wire' },
                        { k: 'R', desc: 'Rotate selected component by 90°' },
                        { k: 'Ctrl + Z', desc: 'Undo previous wire or placement' },
                        { k: 'Ctrl + Y', desc: 'Redo previously undone action' },
                        { k: 'Esc', desc: 'Cancel in-progress wire routing' },
                        { k: 'Alt + Drag / Mid-Click', desc: 'Pan breadboard workspace canvas' },
                        { k: 'Ctrl + Wheel', desc: 'Zoom in or out smoothly' },
                      ].map((s, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-1.5 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700"
                        >
                          <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 text-[10px] font-mono font-bold text-stone-800 dark:text-stone-200">
                            {s.k}
                          </kbd>
                          <span className="text-[10px] text-stone-600 dark:text-stone-400">
                            {s.desc}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Section: Breadboard Canvas + Docked Secondary Panel */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Interactive Breadboard Canvas Surface */}
          <div
            ref={breadboardContainerRef}
            onMouseMove={handleCanvasMouseMove}
            onMouseDown={handleCanvasMouseDown}
            onMouseUp={handleCanvasMouseUp}
            onWheel={handleWheel}
            className={`flex-1 relative overflow-hidden select-none bg-[#f4eee2] dark:bg-[#0e0e14] transition-colors ${
              isPanning ? 'cursor-grab' : wiringFrom ? 'cursor-crosshair' : 'cursor-default'
            }`}
          >
            {/* Transform Canvas Surface for Pan & Zoom */}
            <div
              style={{
                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
                transformOrigin: '0 0',
                width: 1100,
                height: 580,
              }}
              className="relative p-6"
            >
              {/* Authentic TinkerCAD-Style Breadboard Enclosure */}
              <div className="w-[1020px] h-[510px] bg-[#fbf9f4] dark:bg-[#181822] border-4 border-[#e6decb] dark:border-stone-700 rounded-3xl p-6 shadow-xl relative">
                
                {/* SVG Layer for Catenary Wires, Rubber-banding, Snap Rings & Holes */}
                <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none">
                  {/* Power Rail Silk Lines */}
                  {/* Top +5V Red Line */}
                  <line x1="100" y1="42" x2="880" y2="42" stroke="#ef4444" strokeWidth="2" strokeOpacity="0.8" />
                  <text x="75" y="46" fill="#ef4444" fontSize="13" fontWeight="bold" fontFamily="monospace">+</text>
                  <text x="895" y="46" fill="#ef4444" fontSize="13" fontWeight="bold" fontFamily="monospace">+</text>

                  {/* Top GND Blue Line */}
                  <line x1="100" y1="84" x2="880" y2="84" stroke="#0284c7" strokeWidth="2" strokeOpacity="0.8" />
                  <text x="75" y="88" fill="#0284c7" fontSize="14" fontWeight="bold" fontFamily="monospace">−</text>
                  <text x="895" y="88" fill="#0284c7" fontSize="14" fontWeight="bold" fontFamily="monospace">−</text>

                  {/* Bottom +5V Red Line */}
                  <line x1="100" y1="396" x2="880" y2="396" stroke="#ef4444" strokeWidth="2" strokeOpacity="0.8" />
                  <text x="75" y="400" fill="#ef4444" fontSize="13" fontWeight="bold" fontFamily="monospace">+</text>
                  <text x="895" y="400" fill="#ef4444" fontSize="13" fontWeight="bold" fontFamily="monospace">+</text>

                  {/* Bottom GND Blue Line */}
                  <line x1="100" y1="438" x2="880" y2="438" stroke="#0284c7" strokeWidth="2" strokeOpacity="0.8" />
                  <text x="75" y="442" fill="#0284c7" fontSize="14" fontWeight="bold" fontFamily="monospace">−</text>
                  <text x="895" y="442" fill="#0284c7" fontSize="14" fontWeight="bold" fontFamily="monospace">−</text>

                  {/* Column Labels (1 to 30) */}
                  {[1, 5, 10, 15, 20, 25, 30].map((col) => {
                    const cx = 110 + (col - 1) * 26;
                    return (
                      <g key={col}>
                        <text x={cx} y="110" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                          {col}
                        </text>
                        <text x={cx} y="378" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                          {col}
                        </text>
                      </g>
                    );
                  })}

                  {/* Row Labels (A..E and F..J) */}
                  {[
                    { r: 'A', y: 128 },
                    { r: 'B', y: 150 },
                    { r: 'C', y: 172 },
                    { r: 'D', y: 194 },
                    { r: 'E', y: 216 },
                    { r: 'F', y: 272 },
                    { r: 'G', y: 294 },
                    { r: 'H', y: 316 },
                    { r: 'I', y: 338 },
                    { r: 'J', y: 360 },
                  ].map(({ r, y }) => (
                    <g key={r}>
                      <text x="85" y={y} fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                        {r}
                      </text>
                      <text x="885" y={y} fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                        {r}
                      </text>
                    </g>
                  ))}

                  {/* All Visible Breadboard Holes (420 holes) */}
                  {breadboardHoles.map((hole) => (
                    <g key={hole.id}>
                      {/* Metallic Ring */}
                      <circle cx={hole.x} cy={hole.y} r="4.5" fill="none" stroke="#cbd5e1" strokeWidth="0.8" />
                      {/* Tie-Point Hole */}
                      <circle cx={hole.x} cy={hole.y} r="2.8" fill="#1e293b" />
                    </g>
                  ))}

                  {/* Guided Mode Ghost Guidelines (Task 21a, 22c) */}
                  {workspaceMode === 'guided' && activePreset && (
                    <g className="guided-ghost-wires">
                      {activePreset.wires.map((gw, idx) => {
                        const path = getCatenaryPath(gw.from.x, gw.from.y, gw.to.x, gw.to.y, 0.25);
                        return (
                          <path
                            key={`ghost-${idx}`}
                            d={path}
                            fill="none"
                            stroke="#6366f1"
                            strokeWidth="2.5"
                            strokeDasharray="4 4"
                            strokeOpacity="0.45"
                          />
                        );
                      })}
                    </g>
                  )}

                  {/* Placed Wires with Catenary Sagging */}
                  {wires.map((wire) => {
                    const isSelected = wire.id === selectedWireId;
                    const path = getCatenaryPath(wire.from.x, wire.from.y, wire.to.x, wire.to.y, 0.28);

                    return (
                      <g key={wire.id} className="group">
                        {/* Shadow */}
                        <path
                          d={path}
                          fill="none"
                          stroke="rgba(0,0,0,0.18)"
                          strokeWidth="6"
                          strokeLinecap="round"
                          transform="translate(0, 3)"
                        />
                        {/* Wire Core */}
                        <path
                          d={path}
                          fill="none"
                          stroke={isSelected ? '#f43f5e' : wire.color}
                          strokeWidth={isSelected ? '5' : '3.5'}
                          strokeLinecap="round"
                          className="pointer-events-auto cursor-pointer hover:stroke-rose-500 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedWireId(wire.id);
                          }}
                        />
                        {/* Pin Terminal Contacts */}
                        <circle cx={wire.from.x} cy={wire.from.y} r="3.5" fill="#334155" />
                        <circle cx={wire.to.x} cy={wire.to.y} r="3.5" fill="#334155" />
                      </g>
                    );
                  })}

                  {/* Wire rubber-banding while routing */}
                  {wiringFrom && mousePos && (
                    <path
                      d={getCatenaryPath(wiringFrom.x, wiringFrom.y, mousePos.x, mousePos.y, 0.2)}
                      fill="none"
                      stroke={wireColor}
                      strokeWidth="3.5"
                      strokeDasharray="6 4"
                      className="opacity-80 pointer-events-none"
                    />
                  )}

                  {/* Source Point Pulse Indicator */}
                  {wiringFrom && (
                    <circle
                      cx={wiringFrom.x}
                      cy={wiringFrom.y}
                      r="10"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                      className="animate-ping pointer-events-none"
                    />
                  )}

                  {/* TinkerCAD-Style Connected Strip Hover Ring (Image 2) */}
                  {hoveredHole && (
                    <g className="tinkercad-strip-hover pointer-events-none">
                      {/* Highlight other holes in this connected strip/rail */}
                      {breadboardHoles
                        .filter((h) => connectedHoveredHoleIds.has(h.id) && h.id !== hoveredHole.id)
                        .map((h) => (
                          <circle
                            key={`strip-h-${h.id}`}
                            cx={h.x}
                            cy={h.y}
                            r="6.5"
                            fill="rgba(34, 197, 94, 0.2)"
                            stroke="#22c55e"
                            strokeWidth="1.5"
                            strokeDasharray="2 2"
                            className="animate-pulse"
                          />
                        ))}
                      {/* Exact hovered hole with crisp glowing green ring */}
                      <circle
                        cx={hoveredHole.x}
                        cy={hoveredHole.y}
                        r="8.5"
                        fill="rgba(34, 197, 94, 0.35)"
                        stroke="#16a34a"
                        strokeWidth="2.5"
                        className="animate-pulse"
                      />
                      <circle cx={hoveredHole.x} cy={hoveredHole.y} r="2.5" fill="#16a34a" />
                    </g>
                  )}

                  {/* Tactile Wire Snap Ripple */}
                  {lastSnapPoint && (
                    <circle
                      cx={lastSnapPoint.x}
                      cy={lastSnapPoint.y}
                      r="14"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                      className="animate-ping pointer-events-none"
                    />
                  )}
                </svg>

                {/* Center Divider Trough Channel */}
                <div className="absolute left-16 right-16 top-[228px] h-8 bg-[#ded5c2] dark:bg-stone-800 border-y border-[#c8bfa7] dark:border-stone-700 flex items-center justify-center pointer-events-none z-0">
                  <span className="text-[9px] font-mono font-bold text-stone-500 tracking-widest uppercase">
                    DIP IC Socket Trough (Straddles Rows E & F)
                  </span>
                </div>

                {/* Transparent Interactive Hole Buttons for Precision Clicking */}
                {breadboardHoles.map((hole) => (
                  <button
                    key={hole.id}
                    onClick={() => handleTerminalClick(hole)}
                    style={{
                      left: hole.x - 7,
                      top: hole.y - 7,
                    }}
                    title={hole.name}
                    className="absolute w-3.5 h-3.5 rounded-full z-15 hover:bg-sky-400/40 cursor-crosshair"
                  />
                ))}

                {/* Placed Components Layer (Task 10a, 21a) */}
                {components.map((comp) => {
                  const isSelected = comp.id === selectedComponentId;
                  const compDef = COMPONENT_LIBRARY.find((c) => c.type === comp.type);
                  const state = simulation.componentStates[comp.id] || {};

                  return (
                    <div
                      key={comp.id}
                      style={{
                        left: comp.x,
                        top: comp.y,
                        transform: `rotate(${comp.rotation}deg)`,
                        transformOrigin: 'center center',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedComponentId(comp.id);
                      }}
                      onMouseDown={(e) => {
                        if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === 'DIV') {
                          setDraggingCompId(comp.id);
                          const rect = breadboardContainerRef.current?.getBoundingClientRect();
                          if (rect) {
                            const canvasX = (e.clientX - rect.left - panOffset.x) / zoom;
                            const canvasY = (e.clientY - rect.top - panOffset.y) / zoom;
                            dragOffsetRef.current = { x: canvasX - comp.x, y: canvasY - comp.y };
                          }
                        }
                      }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 rounded-xl transition-all cursor-move select-none z-20 ${
                        isSelected
                          ? 'ring-2 ring-indigo-500 shadow-lg bg-indigo-50/20'
                          : 'hover:ring-1 hover:ring-indigo-300'
                      }`}
                    >
                      {/* Floating actions toolbar when selected */}
                      {isSelected && (
                        <div
                          style={{ transform: `rotate(-${comp.rotation}deg)` }}
                          className="absolute -top-9 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-1 shadow-md z-40 whitespace-nowrap"
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRotateComponent(comp.id);
                            }}
                            title="Rotate 90° (R)"
                            className="p-1 rounded hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300"
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (compDef) setInfoModalDef(compDef);
                            }}
                            title="Component Info"
                            className="p-1 rounded hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300"
                          >
                            <Info className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveComponent(comp.id);
                            }}
                            title="Delete Component (Del)"
                            className="p-1 rounded hover:bg-red-50 text-red-600 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      {/* Visual Component Renderers */}
                      {/* 1. DIP IC Package (7408, 7474, 74194, 74138, etc.) */}
                      {(comp.category === 'logic_ic' || comp.category === 'sequential_ic') && (
                        <div className="w-44 h-16 bg-[#334155] rounded-lg border border-[#475569] shadow-md flex items-center justify-between px-3 text-white relative">
                          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-4 rounded-r-full bg-[#1e293b]" />
                          <div className="text-center mx-auto pointer-events-none">
                            <span className="font-mono font-bold text-xs text-amber-300 block">
                              {comp.name}
                            </span>
                            <span className="text-[9px] font-mono text-stone-300">
                              {state.isPowered ? (
                                <span className="text-emerald-400 font-bold">⚡ VCC Active</span>
                              ) : (
                                <span className="text-stone-400">Unpowered</span>
                              )}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* 2. LED Component */}
                      {comp.type === 'led' && (
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center shadow-md ${
                              state.isIlluminated
                                ? comp.properties.color === 'green'
                                  ? 'bg-emerald-400 border-emerald-300 shadow-emerald-400/80 ring-4 ring-emerald-400/40'
                                  : comp.properties.color === 'blue'
                                  ? 'bg-blue-400 border-blue-300 shadow-blue-400/80 ring-4 ring-blue-400/40'
                                  : comp.properties.color === 'yellow'
                                  ? 'bg-amber-300 border-amber-200 shadow-amber-300/80 ring-4 ring-amber-300/40'
                                  : 'bg-rose-500 border-rose-300 shadow-rose-500/80 ring-4 ring-rose-500/40'
                                : 'bg-stone-300/60 dark:bg-stone-700/60 border-stone-400'
                            }`}
                          >
                            <div className="w-3 h-3 rounded-full bg-white/40 pointer-events-none" />
                          </div>
                          <span className="text-[9px] font-mono mt-1 font-bold text-stone-600 dark:text-stone-300">
                            {comp.name}
                          </span>
                        </div>
                      )}

                      {/* 3. Resistor */}
                      {comp.type === 'resistor' && (
                        <div className="w-24 h-6 bg-[#d1bb9e] border border-[#a89070] rounded-full flex items-center justify-around px-2 shadow-xs">
                          <div className="w-1.5 h-full bg-amber-700" />
                          <div className="w-1.5 h-full bg-orange-700" />
                          <div className="w-1.5 h-full bg-amber-800" />
                          <div className="w-1.5 h-full bg-yellow-500" />
                        </div>
                      )}

                      {/* 4. Toggle Switch */}
                      {comp.type === 'toggle_switch' && (
                        <div className="bg-stone-200 dark:bg-stone-800 p-2 rounded-xl border border-stone-300 dark:border-stone-700 flex items-center gap-2 shadow-xs">
                          <ToggleSwitch
                            checked={comp.properties.state ?? true}
                            onChange={(v) => handleToggleComponentProperty(comp.id, 'state', v)}
                            label={comp.properties.label || 'SW'}
                            accentColor="bg-sky-500"
                            size="sm"
                          />
                        </div>
                      )}

                      {/* 5. Pushbutton */}
                      {comp.type === 'pushbutton' && (
                        <div className="p-2 rounded-xl bg-stone-300 dark:bg-stone-800 border border-stone-400 dark:border-stone-700 flex flex-col items-center">
                          <button
                            onMouseDown={() => handleToggleComponentProperty(comp.id, 'pressed', true)}
                            onMouseUp={() => handleToggleComponentProperty(comp.id, 'pressed', false)}
                            className="w-8 h-8 rounded-full bg-rose-600 hover:bg-rose-500 active:scale-90 text-white font-mono text-[9px] font-bold shadow-md"
                          >
                            CLK
                          </button>
                        </div>
                      )}

                      {/* 6. Arduino Uno R3 Microcontroller Board */}
                      {comp.type === 'arduino_uno' && (
                        <div className="w-[220px] h-[160px] bg-[#00878F] rounded-2xl border-2 border-[#006f75] shadow-2xl relative select-none overflow-hidden p-2 text-white">
                          <div className="flex items-center justify-between border-b border-[#006f75] pb-1 px-1">
                            <span className="font-mono font-extrabold text-[11px] text-white tracking-wider flex items-center gap-1">
                              <span>ARDUINO</span>
                              <span className="text-amber-300">UNO R3</span>
                            </span>
                            <span className="text-[9px] font-mono text-cyan-200">ITALY</span>
                          </div>

                          <div className="absolute left-0 top-6 w-9 h-11 bg-stone-300 rounded-r-md border border-stone-400 shadow-inner flex items-center justify-center">
                            <div className="w-5 h-7 bg-stone-700 rounded-xs" />
                          </div>
                          <div className="absolute left-0 bottom-4 w-10 h-9 bg-stone-800 rounded-r-md border border-stone-900 shadow-inner" />

                          <div className="absolute left-11 top-7 w-5 h-5 rounded-md bg-stone-700 flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-rose-600 shadow-xs" />
                          </div>

                          <div className="absolute left-16 top-16 w-24 h-8 bg-stone-900 rounded border border-stone-700 flex items-center justify-center shadow-md">
                            <span className="text-[9px] font-mono font-bold text-stone-300 tracking-widest">
                              ATMEGA328P
                            </span>
                          </div>

                          <div className="absolute right-12 top-11 flex flex-col gap-1 items-center">
                            <div className="flex items-center gap-1">
                              <span className="text-[8px] font-mono text-cyan-200">ON</span>
                              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-[8px] font-mono text-cyan-200">L</span>
                              <div
                                className={`w-2.5 h-2.5 rounded-full transition-all ${
                                  comp.properties.pin13LedState
                                    ? 'bg-amber-300 shadow-[0_0_10px_#fde047]'
                                    : 'bg-stone-700'
                                }`}
                              />
                            </div>
                          </div>

                          <div className="absolute top-1 right-2 left-16 flex justify-between text-[7px] font-mono font-bold text-cyan-200 pointer-events-none">
                            <span>AREF GND 13 12 ~11 ~10 ~9 8</span>
                            <span>7 ~6 ~5 4 ~3 2 TX RX</span>
                          </div>

                          <div className="absolute bottom-1 right-2 left-16 flex justify-between text-[7px] font-mono font-bold text-cyan-200 pointer-events-none">
                            <span>IOREF RESET 3.3V 5V GND GND VIN</span>
                            <span>A0 A1 A2 A3 A4 A5</span>
                          </div>
                        </div>
                      )}

                      {/* 7. Arduino Nano */}
                      {comp.type === 'arduino_nano' && (
                        <div className="w-[140px] h-[60px] bg-[#00878F] rounded-lg border border-[#006f75] shadow-lg flex items-center justify-between px-2 text-white relative">
                          <div className="w-4 h-6 bg-stone-300 rounded-r-xs border border-stone-400 absolute left-0" />
                          <div className="mx-auto text-center pointer-events-none">
                            <span className="font-mono font-bold text-[10px] text-white block">ARDUINO NANO</span>
                            <span className="text-[8px] font-mono text-cyan-200">ATmega328P</span>
                          </div>
                          <div
                            className={`w-2 h-2 rounded-full absolute right-3 top-2 ${
                              comp.properties.pin13LedState ? 'bg-amber-300 shadow-[0_0_8px_#fde047]' : 'bg-stone-700'
                            }`}
                          />
                        </div>
                      )}

                      {/* 8. ESP32 DevKit V1 */}
                      {comp.type === 'esp32_devkit' && (
                        <div className="w-[170px] h-[70px] bg-[#1e293b] rounded-lg border border-stone-600 shadow-xl flex items-center justify-between px-3 text-white relative">
                          <div className="w-5 h-6 bg-stone-400 rounded-r-xs absolute left-0" />
                          <div className="w-16 h-12 bg-stone-300 rounded border border-stone-400 flex items-center justify-center text-stone-900 shadow-inner ml-4">
                            <span className="text-[8px] font-mono font-bold">ESP-WROOM-32</span>
                          </div>
                          <div className="text-right pointer-events-none mr-2">
                            <span className="font-mono font-bold text-[10px] text-cyan-400 block">ESP32 DevKit</span>
                            <span className="text-[8px] font-mono text-stone-400">Wi-Fi + BT 240MHz</span>
                          </div>
                        </div>
                      )}

                      {/* 9. BBC micro:bit */}
                      {comp.type === 'microbit' && (
                        <div className="w-[160px] h-[130px] bg-stone-950 rounded-2xl border-2 border-stone-700 shadow-xl p-3 flex flex-col justify-between text-white relative">
                          <div className="flex justify-between items-center text-[10px] font-mono font-bold text-stone-400">
                            <span>BBC micro:bit</span>
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-xs" />
                          </div>
                          <div className="grid grid-cols-5 gap-1.5 mx-auto p-2 bg-stone-900 rounded-lg">
                            {Array.from({ length: 25 }).map((_, i) => (
                              <div key={i} className="w-2 h-2 rounded-full bg-rose-600/40" />
                            ))}
                          </div>
                          <div className="flex justify-between border-t border-amber-500/40 pt-1 text-[8px] font-mono text-amber-300">
                            <span>0</span>
                            <span>1</span>
                            <span>2</span>
                            <span>3V</span>
                            <span>GND</span>
                          </div>
                        </div>
                      )}

                      {/* 10. Ultrasonic Sensor (HC-SR04) */}
                      {comp.type === 'ultrasonic_sensor' && (
                        <div className="w-[110px] h-[50px] bg-[#0284c7] rounded-xl border border-sky-600 shadow-lg flex items-center justify-around px-2 text-white relative">
                          <div className="w-9 h-9 rounded-full bg-stone-300 border-2 border-stone-400 flex items-center justify-center text-stone-800 font-mono text-[9px] font-bold shadow-inner">
                            T
                          </div>
                          <span className="text-[8px] font-mono font-bold text-sky-100">HC-SR04</span>
                          <div className="w-9 h-9 rounded-full bg-stone-300 border-2 border-stone-400 flex items-center justify-center text-stone-800 font-mono text-[9px] font-bold shadow-inner">
                            R
                          </div>
                        </div>
                      )}

                      {/* 11. Micro Servo (SG90) */}
                      {comp.type === 'servo_motor' && (
                        <div className="w-[90px] h-[80px] bg-sky-600 rounded-xl border border-sky-400 shadow-lg flex flex-col items-center justify-between p-2 text-white relative">
                          <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-300 shadow-md flex items-center justify-center">
                            <div
                              style={{ transform: `rotate(${comp.properties.angleDeg || 90}deg)` }}
                              className="w-1.5 h-6 bg-white rounded-full border border-stone-400"
                            />
                          </div>
                          <span className="text-[9px] font-mono font-bold">SG90 Servo</span>
                        </div>
                      )}

                      {/* 12. Piezo Buzzer */}
                      {comp.type === 'buzzer_piezo' && (
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-12 h-12 rounded-full bg-stone-900 border-2 border-stone-700 flex items-center justify-center text-stone-300 shadow-lg ${
                              state.isSounding ? 'animate-bounce ring-4 ring-amber-400/50' : ''
                            }`}
                          >
                            <div className="w-3.5 h-3.5 rounded-full bg-stone-700 border border-stone-600" />
                          </div>
                          <span className="text-[9px] font-mono mt-1 font-bold text-stone-600 dark:text-stone-300">
                            {state.isSounding ? '🔊 Sounding' : 'Buzzer'}
                          </span>
                        </div>
                      )}

                      {/* 13. Potentiometer (10kΩ) */}
                      {comp.type === 'potentiometer' && (
                        <div className="w-16 h-16 rounded-full bg-sky-800 border-2 border-sky-600 shadow-md flex items-center justify-center relative">
                          <div
                            style={{ transform: `rotate(${((comp.properties.value || 50) / 100) * 270 - 135}deg)` }}
                            className="w-10 h-10 rounded-full bg-stone-200 border border-stone-400 shadow-inner flex items-start justify-center pt-1 cursor-grab"
                          >
                            <div className="w-1.5 h-3 bg-stone-800 rounded-full" />
                          </div>
                          <span className="absolute -bottom-4 text-[8px] font-mono font-bold text-stone-500 whitespace-nowrap">
                            10kΩ ({comp.properties.value || 50}%)
                          </span>
                        </div>
                      )}

                      {/* Interactive Connection Pin Terminals */}
                      {comp.pins.map((pin) => {
                        const terminalId = `${comp.id}:${pin.id}`;
                        const isWiringSource = wiringFrom?.id === terminalId;

                        return (
                          <button
                            key={pin.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              const term = allTerminals.find((t) => t.id === terminalId);
                              if (term) handleTerminalClick(term);
                            }}
                            style={{
                              left: `calc(50% + ${pin.xOffset}px)`,
                              top: `calc(50% + ${pin.yOffset}px)`,
                            }}
                            title={`${pin.label} (${pin.role})`}
                            className={`absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border transition-all z-30 ${
                              isWiringSource
                                ? '!bg-sky-400 !border-white ring-4 ring-sky-300 scale-125'
                                : 'bg-stone-700/80 border-stone-400 hover:scale-125 hover:bg-sky-500 hover:border-white shadow-xs'
                            }`}
                          />
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* =========================================================================
              3. DOCKED TABBED BOTTOM PANEL (Task 21a)
              Replaces floating popup with a docked 3-tab drawer:
              Tab 1: Circuit Health | Tab 2: Docs / Learn | Tab 3: Reference
              ========================================================================= */}
          <CircuitHealthPanel
            issues={simulation.issues}
            activePreset={activePreset}
            selectedComponent={selectedComponent}
            onNavigateToLab={onNavigateToLab}
            onAskAiAboutIssue={handleAskAiAboutIssue}
            consoleLogs={consoleLogs}
            simulationTime={formattedSimTime}
            isPowerOn={isPowerOn}
            onClearLogs={() => setConsoleLogs([])}
          />
        </div>

        {/* Microcontroller Code Editor Drawer (Task 20) */}
        {isCodePanelOpen && (
          <div className="w-96 flex flex-col border-l border-stone-200 dark:border-stone-800 bg-[#181824] z-25 relative">
            <CodeEditorPanel
              code={sketchCode}
              onChangeCode={setSketchCode}
              isRunning={isSketchRunning}
              onStart={handleStartSketch}
              onStop={handleStopSketch}
              onReset={handleResetSketch}
              activeError={sketchError}
              onSelectExample={(code) => {
                setSketchCode(code);
                if (isSketchRunning) handleStopSketch();
              }}
            />
          </div>
        )}

        {/* Right Drawer: TinkerCAD-Style Component Palette (Image 2) */}
        {!isCodePanelOpen && (
          <ComponentPalette
            isOpen={paletteOpen}
            onToggleOpen={() => setPaletteOpen(!paletteOpen)}
            onSelectComponentToPlace={handlePlaceComponentFromPalette}
            onOpenInfo={(def) => setInfoModalDef(def)}
            position="right"
          />
        )}
      </div>

      {/* Screen Reader Live Announcer (WCAG 2.2 AA) */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {screenReaderAnnouncement}
      </div>

      {/* WCAG 2.2 AA Keyboard Accessible Workbench Panel (Non-Dragging Alternative) */}
      <AccessibleWorkbenchPanel
        components={components}
        wires={wires}
        breadboardHoles={breadboardHoles}
        allTerminals={allTerminals}
        componentLibrary={COMPONENT_LIBRARY}
        onMoveComponent={handleMoveComponentA11y}
        onRotateComponent={handleRotateComponent}
        onRemoveComponent={handleRemoveComponent}
        onRemoveWire={handleRemoveWire}
        onAddWire={handleAddWireA11y}
        onPlaceComponentAtHole={handlePlaceComponentAtHoleA11y}
      />

      {/* Starter Circuits Modal */}
      <StarterCircuitsModal
        isOpen={starterModalOpen}
        onClose={() => setStarterModalOpen(false)}
        onSelectCircuit={(circuit) => {
          const nextWires: Wire[] = circuit.wires.map((w, idx) => ({
            id: w.id || `w-${idx}`,
            fromId: w.from.label || `from-${idx}`,
            toId: w.to.label || `to-${idx}`,
            color: w.color || '#0284c7',
            from: { x: w.from.x, y: w.from.y, label: w.from.label },
            to: { x: w.to.x, y: w.to.y, label: w.to.label },
          }));
          setComponents(circuit.components);
          setWires(nextWires);
          setCircuitName(circuit.name);
          if (circuit.sketchCode) {
            setSketchCode(circuit.sketchCode);
            setIsCodePanelOpen(true);
          }
          setStarterModalOpen(false);
        }}
      />

      {/* Projects Modal */}
      <ProjectsModal
        isOpen={projectsModalOpen}
        onClose={() => setProjectsModalOpen(false)}
        circuits={savedCircuitsList}
        onLoadCircuit={handleLoadSavedProject}
        onDeleteCircuit={handleDeleteSavedProject}
        onNewProject={handleNewBlankProject}
      />

      {/* Component Info Modal */}
      <ComponentInfoModal
        componentDef={infoModalDef}
        onClose={() => setInfoModalDef(null)}
        onPlaceComponent={handlePlaceComponentFromPalette}
      />

      {/* Save Project Modal */}
      {saveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-darklab-card border border-cream-border dark:border-darklab-border rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="font-display font-extrabold text-lg text-ink-900 dark:text-cream-paper">
              Save Breadboard Circuit
            </h3>
            <p className="text-xs text-ink-500 dark:text-cream-muted">
              Save your circuit layout and wiring connections to your personal account in Supabase.
            </p>
            <form onSubmit={handleSaveCurrentCircuit} className="space-y-3">
              <input
                type="text"
                value={circuitName}
                onChange={(e) => setCircuitName(e.target.value)}
                placeholder="Circuit Project Name..."
                className="w-full px-4 py-2.5 rounded-xl border border-cream-border dark:border-darklab-border bg-cream-soft dark:bg-darklab-base text-ink-900 dark:text-cream-paper text-sm outline-none"
              />
              {saveSuccessMsg && (
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold">
                  {saveSuccessMsg}
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSaveModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-ink-700 dark:text-cream-muted hover:bg-cream-soft"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                >
                  Save Circuit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
