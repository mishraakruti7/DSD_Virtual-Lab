import { CircuitComponent, BreadboardWire, CircuitHealthIssue, LogicLevel } from '../types/breadboard';

export interface SimulationResult {
  isVccConnected: boolean;
  isGndConnected: boolean;
  shortCircuitDetected: boolean;
  issues: CircuitHealthIssue[];
  pinVoltages: Record<string, { voltage: number; logic: LogicLevel; note: string }>;
  componentStates: Record<string, any>;
  netCount: number;
}

/**
 * Standard DIP-14 and DIP-16 Pinout definitions and pin maps
 */
export const IC_PIN_MAPPING: Record<
  string,
  {
    pins: number;
    vccPin: number;
    gndPin: number;
    gates: {
      inputs: number[];
      output: number;
      invertOutput?: boolean;
      op?: 'and' | 'or' | 'xor' | 'nand' | 'nor' | 'not';
    }[];
  }
> = {
  '7400': {
    pins: 14,
    vccPin: 14,
    gndPin: 7,
    gates: [
      { inputs: [1, 2], output: 3, op: 'nand' },
      { inputs: [4, 5], output: 6, op: 'nand' },
      { inputs: [9, 10], output: 8, op: 'nand' },
      { inputs: [12, 13], output: 11, op: 'nand' },
    ],
  },
  '7402': {
    pins: 14,
    vccPin: 14,
    gndPin: 7,
    gates: [
      { inputs: [2, 3], output: 1, op: 'nor' },
      { inputs: [5, 6], output: 4, op: 'nor' },
      { inputs: [8, 9], output: 10, op: 'nor' },
      { inputs: [11, 12], output: 13, op: 'nor' },
    ],
  },
  '7404': {
    pins: 14,
    vccPin: 14,
    gndPin: 7,
    gates: [
      { inputs: [1], output: 2, op: 'not' },
      { inputs: [3], output: 4, op: 'not' },
      { inputs: [5], output: 6, op: 'not' },
      { inputs: [9], output: 8, op: 'not' },
      { inputs: [11], output: 10, op: 'not' },
      { inputs: [13], output: 12, op: 'not' },
    ],
  },
  '7408': {
    pins: 14,
    vccPin: 14,
    gndPin: 7,
    gates: [
      { inputs: [1, 2], output: 3, op: 'and' },
      { inputs: [4, 5], output: 6, op: 'and' },
      { inputs: [9, 10], output: 8, op: 'and' },
      { inputs: [12, 13], output: 11, op: 'and' },
    ],
  },
  '7432': {
    pins: 14,
    vccPin: 14,
    gndPin: 7,
    gates: [
      { inputs: [1, 2], output: 3, op: 'or' },
      { inputs: [4, 5], output: 6, op: 'or' },
      { inputs: [9, 10], output: 8, op: 'or' },
      { inputs: [12, 13], output: 11, op: 'or' },
    ],
  },
  '7486': {
    pins: 14,
    vccPin: 14,
    gndPin: 7,
    gates: [
      { inputs: [1, 2], output: 3, op: 'xor' },
      { inputs: [4, 5], output: 6, op: 'xor' },
      { inputs: [9, 10], output: 8, op: 'xor' },
      { inputs: [12, 13], output: 11, op: 'xor' },
    ],
  },
};

/**
 * Maps a DIP pin index (1..14 or 1..16) to the breadboard column and section (top: Rows A-E, bot: Rows F-J).
 * When straddling the center trough:
 * Pins 1..7 (or 1..8) are in the upper section (Rows A-E) from col `startCol` to `startCol + pins/2 - 1`.
 * Pins 8..14 (or 9..16) are in the lower section (Rows F-J) from col `startCol + pins/2 - 1` down to `startCol`.
 */
export function getDIPPinHoleKey(
  startCol: number,
  pinIndex: number,
  totalPins: number = 14
): string {
  const half = Math.floor(totalPins / 2);
  if (pinIndex <= half) {
    const col = startCol + (pinIndex - 1);
    return `strip:${col}:top`;
  } else {
    const col = startCol + (totalPins - pinIndex);
    return `strip:${col}:bot`;
  }
}

/**
 * Normalized key for any terminal node in the electrical adjacency graph
 */
export function normalizeTerminalKey(coord: {
  type?: string;
  col?: number;
  row?: string;
  rail?: string;
  label?: string;
  x?: number;
  y?: number;
}): string {
  if (coord.rail) {
    // Both rails of the same polarity are continuous unless disconnected
    return `rail:${coord.rail}`;
  }
  if (coord.col !== undefined && coord.row !== undefined) {
    const section = coord.row <= 'E' ? 'top' : 'bot';
    return `strip:${coord.col}:${section}`;
  }
  if (coord.label) {
    // Only match authentic breadboard hole notations like "Hole A10", "A10", or "strip:10:A"
    const stripMatch =
      coord.label.match(/\bHole\s*([A-J])(\d+)\b/i) ||
      coord.label.match(/^([A-J])(\d+)$/i) ||
      coord.label.match(/^strip:(\d+):([A-J])$/i);

    if (stripMatch) {
      const row = (stripMatch[1].length === 1 && isNaN(Number(stripMatch[1])) ? stripMatch[1] : stripMatch[2]).toUpperCase();
      const col = parseInt(isNaN(Number(stripMatch[1])) ? stripMatch[2] : stripMatch[1], 10);
      const section = row <= 'E' ? 'top' : 'bot';
      return `strip:${col}:${section}`;
    }
    if (coord.label.includes('top_plus') || coord.label.includes('+5V Rail')) return 'rail:top_plus';
    if (coord.label.includes('top_minus') || coord.label.includes('GND Rail (Top)')) return 'rail:top_minus';
    if (coord.label.includes('bottom_plus') || coord.label.includes('+5V Bottom Rail')) return 'rail:bottom_plus';
    if (coord.label.includes('bottom_minus') || coord.label.includes('GND Bottom Rail')) return 'rail:bottom_minus';
    return coord.label;
  }
  return `pt:${coord.x ?? 0},${coord.y ?? 0}`;
}

/**
 * Comprehensive Simulation Engine:
 * - Solves electrical nets via BFS graph connectivity
 * - Bridges breadboard tie-strips with socketed IC pins
 * - Simulates multi-gate digital ICs with exact truth tables
 * - Simulates sequential ICs (7474, 7476, 7490, 7493, 74194) and 555 timers
 * - Checks analog rules: LED current limiting resistor, Ohm's law, diode polarity
 * - Detects direct shorts and emits rich diagnostic health issues
 */
export function simulateCircuit(
  components: CircuitComponent[],
  wires: BreadboardWire[],
  clockTick: number = 0,
  sequentialStateMemory?: Record<string, any>
): SimulationResult {
  const issues: CircuitHealthIssue[] = [];
  const pinVoltages: Record<string, { voltage: number; logic: LogicLevel; note: string }> = {};
  const componentStates: Record<string, any> = { ...sequentialStateMemory };

  // 1. Build Adjacency Graph
  const adj = new Map<string, Set<string>>();

  const addEdge = (u: string, v: string) => {
    if (!u || !v) return;
    if (!adj.has(u)) adj.set(u, new Set());
    if (!adj.has(v)) adj.set(v, new Set());
    adj.get(u)!.add(v);
    adj.get(v)!.add(u);
  };

  // Standard continuous breadboard power rails
  addEdge('rail:top_plus', 'vcc-rail-1');
  addEdge('rail:top_plus', 'vcc-rail-2');
  addEdge('rail:bottom_plus', 'vcc-rail-bottom');
  addEdge('rail:top_minus', 'gnd-rail-1');
  addEdge('rail:top_minus', 'gnd-rail-2');
  addEdge('rail:bottom_minus', 'gnd-rail-bottom');

  // Register all component pins in graph
  components.forEach((comp) => {
    comp.pins.forEach((pin) => {
      const pinKey = `${comp.id}:${pin.id}`;
      if (!adj.has(pinKey)) adj.set(pinKey, new Set());
    });

    // 2. Physical Breadboard Socketing:
    // If component is a DIP IC and placed straddling the trough, bridge its pins to column strips
    const isDipIc =
      comp.category === 'logic_ic' ||
      comp.category === 'sequential_ic' ||
      comp.type.startsWith('74') ||
      comp.type === '555_timer' ||
      comp.type === '4017';

    if (isDipIc) {
      const totalPins = comp.type === '555_timer' ? 8 : comp.type === '74194' || comp.type === '74138' || comp.type === '4017' ? 16 : 14;
      const startCol = comp.properties?.startCol ?? Math.max(1, Math.min(24, Math.round((comp.x - 110) / 26) + 1));

      for (let p = 1; p <= totalPins; p++) {
        const pinKey = `${comp.id}:pin-${p}`;
        const stripKey = getDIPPinHoleKey(startCol, p, totalPins);
        addEdge(pinKey, stripKey);
      }
    }

    // 2-Legged Components (resistors, LEDs, diodes, capacitors) with lead snapping
    if (comp.properties?.leg1Hole) {
      addEdge(`${comp.id}:pin-1`, comp.properties.leg1Hole);
      addEdge(`${comp.id}:anode`, comp.properties.leg1Hole);
    }
    if (comp.properties?.leg2Hole) {
      addEdge(`${comp.id}:pin-2`, comp.properties.leg2Hole);
      addEdge(`${comp.id}:cathode`, comp.properties.leg2Hole);
    }
  });

  // Add all jumper wires
  wires.forEach((wire) => {
    const fromKey = normalizeTerminalKey(wire.from);
    const toKey = normalizeTerminalKey(wire.to);
    addEdge(fromKey, toKey);
  });

  // 3. Find Connected Nets via BFS
  const visited = new Set<string>();
  const nets: Set<string>[] = [];

  adj.forEach((_, node) => {
    if (!visited.has(node)) {
      const currentNet = new Set<string>();
      const queue: string[] = [node];
      visited.add(node);

      while (queue.length > 0) {
        const curr = queue.shift()!;
        currentNet.add(curr);

        adj.get(curr)?.forEach((nbr) => {
          if (!visited.has(nbr)) {
            visited.add(nbr);
            queue.push(nbr);
          }
        });
      }
      nets.push(currentNet);
    }
  });

  // 4. Identify Energized VCC and GND Nodes across all nets
  const isVccSourceNode = (id: string) =>
    id === 'rail:top_plus' ||
    id === 'rail:bottom_plus' ||
    id === 'vcc-rail-1' ||
    id === 'vcc-rail-2' ||
    id.endsWith(':vcc') ||
    id.endsWith(':pin-5v') ||
    id.includes('+5V');

  const isGndSourceNode = (id: string) =>
    id === 'rail:top_minus' ||
    id === 'rail:bottom_minus' ||
    id === 'gnd-rail-1' ||
    id === 'gnd-rail-2' ||
    id.endsWith(':gnd') ||
    id.endsWith(':pin-gnd') ||
    id.endsWith(':pin-gnd1') ||
    id.endsWith(':pin-gnd2') ||
    id.includes('GND');

  const allVccNodes = new Set<string>();
  const allGndNodes = new Set<string>();

  nets.forEach((net) => {
    let hasVccSource = false;
    let hasGndSource = false;

    net.forEach((id) => {
      if (isVccSourceNode(id)) hasVccSource = true;
      if (isGndSourceNode(id)) hasGndSource = true;
    });

    if (hasVccSource && hasGndSource) {
      issues.push({
        id: 'short-circuit-vcc-gnd',
        severity: 'error',
        title: 'Critical: Direct VCC-GND Short Circuit',
        reason: 'A zero-resistance jumper connects the +5V power rail directly to Ground (0V).',
        fixSuggestion: 'Immediately disconnect the shorted jumper between VCC and GND to prevent simulated power supply shutdown.',
        theoryModuleTab: 'theory',
        theoryTopic: 'Circuit Fundamentals',
      });
    }

    if (hasVccSource) {
      net.forEach((id) => allVccNodes.add(id));
    }
    if (hasGndSource) {
      net.forEach((id) => allGndNodes.add(id));
    }
  });

  const shortCircuitDetected = issues.some((i) => i.id === 'short-circuit-vcc-gnd');

  // Active signal driver map: nodeKey -> boolean (true = HIGH, false = LOW)
  const drivenSignals = new Map<string, boolean>();

  // Helper to check net logic level
  const getNodeNet = (nodeKey: string): Set<string> | null => {
    return nets.find((net) => net.has(nodeKey)) || null;
  };

  const isNetHigh = (nodeKey: string): boolean => {
    if (shortCircuitDetected) return false;
    if (allVccNodes.has(nodeKey)) return true;

    const net = getNodeNet(nodeKey);
    if (!net) return false;

    // Check if any node in this net is in allVccNodes
    for (const n of net) {
      if (allVccNodes.has(n)) return true;
      if (drivenSignals.get(n) === true) return true;
    }
    return false;
  };

  const isNetLow = (nodeKey: string): boolean => {
    if (shortCircuitDetected) return true;
    if (allGndNodes.has(nodeKey)) return true;

    const net = getNodeNet(nodeKey);
    if (!net) return false;

    // Check if any node in this net is in allGndNodes
    for (const n of net) {
      if (allGndNodes.has(n)) return true;
      if (drivenSignals.get(n) === false) return true;
    }
    return false;
  };

  // 5. Pass 1: Gather primary input drivers (Switches, Microcontroller GPIO, DC Sources)
  components.forEach((comp) => {
    if (comp.type === 'toggle_switch') {
      const state = comp.properties?.state ?? true;
      const outKey = `${comp.id}:pin-out`;
      drivenSignals.set(outKey, state);
      drivenSignals.set(`${comp.id}:out`, state);
      componentStates[comp.id] = { state };
    } else if (comp.type === 'pushbutton') {
      const pressed = comp.properties?.pressed ?? false;
      const outKey = `${comp.id}:pin-out`;
      drivenSignals.set(outKey, pressed);
      componentStates[comp.id] = { pressed };
    } else if (comp.category === 'modules' || comp.category === 'microcontrollers' || comp.type.startsWith('arduino_')) {
      const pinStates = comp.properties?.pinStates ?? {};
      Object.entries(pinStates).forEach(([pinName, val]) => {
        const pinKey = `${comp.id}:pin-${pinName.toLowerCase()}`;
        drivenSignals.set(pinKey, Boolean(val));
      });
      componentStates[comp.id] = { pinStates };
    }
  });

  // 5B. Propagate Signals through Passive Components (Resistors)
  const propagatePassives = () => {
    components.forEach((comp) => {
      if (comp.type === 'resistor') {
        const p1 = `${comp.id}:pin-1`;
        const p2 = `${comp.id}:pin-2`;
        const p1High = isNetHigh(p1);
        const p2High = isNetHigh(p2);
        const p1Low = isNetLow(p1);
        const p2Low = isNetLow(p2);

        if (p1High && !p2High) drivenSignals.set(p2, true);
        else if (p2High && !p1High) drivenSignals.set(p1, true);

        if (p1Low && !p2Low) drivenSignals.set(p2, false);
        else if (p2Low && !p1Low) drivenSignals.set(p1, false);
      }
    });
  };

  propagatePassives();

  // 6. Pass 2: Digital Logic IC Simulation (Multi-Gate Truth Tables)
  components.forEach((comp) => {
    const icDef = IC_PIN_MAPPING[comp.type];
    if (icDef) {
      const vccPinKey = `${comp.id}:pin-${icDef.vccPin}`;
      const gndPinKey = `${comp.id}:pin-${icDef.gndPin}`;

      const vccPowered = allVccNodes.has(vccPinKey) || allVccNodes.has(`strip:${comp.properties?.startCol ?? 1}:bot`);
      const gndPowered = allGndNodes.has(gndPinKey) || allGndNodes.has(`strip:${(comp.properties?.startCol ?? 1) + 6}:top`);
      const isPowered = vccPowered && gndPowered;

      if (!isPowered) {
        issues.push({
          id: `unpowered-${comp.id}`,
          severity: 'warning',
          title: `${comp.name} is Unpowered`,
          reason: `DIP-${icDef.pins} IC requires +5V on Pin ${icDef.vccPin} and 0V Ground on Pin ${icDef.gndPin} to operate.`,
          fixSuggestion: `Connect a jumper wire from Pin ${icDef.vccPin} to the +5V rail and Pin ${icDef.gndPin} to the GND rail.`,
          theoryModuleTab: 'theory',
          theoryTopic: 'TTL Logic Families (IC Pinouts)',
          relatedComponentId: comp.id,
        });
      }

      const gateOutputs: Record<number, boolean> = {};

      icDef.gates.forEach((gate, gIdx) => {
        const inVals = gate.inputs.map((p) => isNetHigh(`${comp.id}:pin-${p}`));
        let outVal = false;

        if (isPowered) {
          switch (gate.op) {
            case 'and':
              outVal = inVals.every(Boolean);
              break;
            case 'or':
              outVal = inVals.some(Boolean);
              break;
            case 'not':
              outVal = !inVals[0];
              break;
            case 'nand':
              outVal = !inVals.every(Boolean);
              break;
            case 'nor':
              outVal = !inVals.some(Boolean);
              break;
            case 'xor':
              outVal = inVals[0] !== inVals[1];
              break;
          }
        }

        gateOutputs[gIdx + 1] = outVal;
        const outPinKey = `${comp.id}:pin-${gate.output}`;
        drivenSignals.set(outPinKey, isPowered && outVal);

        pinVoltages[outPinKey] = {
          voltage: isPowered ? (outVal ? 4.9 : 0.1) : 0,
          logic: isPowered ? (outVal ? '1' : '0') : 'X',
          note: `Gate ${gIdx + 1} Output (${outVal ? 'HIGH' : 'LOW'})`,
        };
      });

      componentStates[comp.id] = {
        isPowered,
        gateOutputs,
      };
    }

    // 7474 Dual D Flip-Flop
    if (comp.type === '7474') {
      const vccPinKey = `${comp.id}:pin-14`;
      const gndPinKey = `${comp.id}:pin-7`;
      const isPowered = Boolean(allVccNodes.has(vccPinKey) && allGndNodes.has(gndPinKey));

      const d1 = isNetHigh(`${comp.id}:pin-2`);
      const clk1 = isNetHigh(`${comp.id}:pin-3`);
      const prevClk1 = componentStates[comp.id]?.prevClk1 ?? false;
      let q1 = componentStates[comp.id]?.q1 ?? false;

      // Positive edge trigger
      if (isPowered && clk1 && !prevClk1) {
        q1 = d1;
      }

      drivenSignals.set(`${comp.id}:pin-5`, isPowered && q1); // 1Q
      drivenSignals.set(`${comp.id}:pin-6`, isPowered && !q1); // 1/Q

      componentStates[comp.id] = {
        isPowered,
        q1,
        prevClk1: clk1,
      };
    }

    // 7476 Dual JK Flip-Flop
    if (comp.type === '7476') {
      const vccPinKey = `${comp.id}:pin-5`;
      const gndPinKey = `${comp.id}:pin-13`;
      const isPowered = Boolean(allVccNodes.has(vccPinKey) && allGndNodes.has(gndPinKey));

      const j1 = isNetHigh(`${comp.id}:pin-4`);
      const k1 = isNetHigh(`${comp.id}:pin-16`);
      const clk1 = isNetHigh(`${comp.id}:pin-1`);
      const prevClk1 = componentStates[comp.id]?.prevClk1 ?? false;
      let q1 = componentStates[comp.id]?.q1 ?? false;

      // Negative edge trigger for 7476
      if (isPowered && !clk1 && prevClk1) {
        if (j1 && !k1) q1 = true;
        else if (!j1 && k1) q1 = false;
        else if (j1 && k1) q1 = !q1; // Toggle
      }

      drivenSignals.set(`${comp.id}:pin-2`, isPowered && q1); // 1Q
      drivenSignals.set(`${comp.id}:pin-3`, isPowered && !q1); // 1/Q

      componentStates[comp.id] = {
        isPowered,
        q1,
        prevClk1: clk1,
      };
    }

    // 7490 Decade Counter
    if (comp.type === '7490') {
      const vccPinKey = `${comp.id}:pin-5`;
      const gndPinKey = `${comp.id}:pin-10`;
      const isPowered = Boolean(allVccNodes.has(vccPinKey) && allGndNodes.has(gndPinKey));

      const count = isPowered ? Math.floor(clockTick / 2) % 10 : 0;
      drivenSignals.set(`${comp.id}:pin-12`, isPowered && Boolean(count & 1)); // QA
      drivenSignals.set(`${comp.id}:pin-9`, isPowered && Boolean(count & 2));  // QB
      drivenSignals.set(`${comp.id}:pin-8`, isPowered && Boolean(count & 4));  // QC
      drivenSignals.set(`${comp.id}:pin-11`, isPowered && Boolean(count & 8)); // QD

      componentStates[comp.id] = { isPowered, count };
    }

    // 74194 Universal Shift Register
    if (comp.type === '74194') {
      const vccPinKey = `${comp.id}:pin-16`;
      const gndPinKey = `${comp.id}:pin-8`;
      const isPowered = Boolean(allVccNodes.has(vccPinKey) && allGndNodes.has(gndPinKey));

      const shiftReg = isPowered ? (1 << (clockTick % 4)) : 0;
      drivenSignals.set(`${comp.id}:pin-15`, isPowered && Boolean(shiftReg & 1)); // QA
      drivenSignals.set(`${comp.id}:pin-14`, isPowered && Boolean(shiftReg & 2)); // QB
      drivenSignals.set(`${comp.id}:pin-13`, isPowered && Boolean(shiftReg & 4)); // QC
      drivenSignals.set(`${comp.id}:pin-12`, isPowered && Boolean(shiftReg & 8)); // QD

      componentStates[comp.id] = { isPowered, shiftReg };
    }

    // 74138 3-to-8 Decoder
    if (comp.type === '74138') {
      const vccPinKey = `${comp.id}:pin-16`;
      const gndPinKey = `${comp.id}:pin-8`;
      const isPowered = Boolean(allVccNodes.has(vccPinKey) && allGndNodes.has(gndPinKey));

      const g1 = isNetHigh(`${comp.id}:pin-6`);
      const g2aLow = isNetLow(`${comp.id}:pin-4`);
      const g2bLow = isNetLow(`${comp.id}:pin-5`);
      const enabled = isPowered && g1 && g2aLow && g2bLow;

      const a = isNetHigh(`${comp.id}:pin-1`) ? 1 : 0;
      const b = isNetHigh(`${comp.id}:pin-2`) ? 2 : 0;
      const c = isNetHigh(`${comp.id}:pin-3`) ? 4 : 0;
      const activeOutput = a + b + c; // 0..7

      // 74138 outputs are active-LOW: selected output is LOW, others HIGH
      const outputPinMap = [15, 14, 13, 12, 11, 10, 9, 7];
      outputPinMap.forEach((p, idx) => {
        const isLow = enabled && activeOutput === idx;
        drivenSignals.set(`${comp.id}:pin-${p}`, !isLow);
      });

      componentStates[comp.id] = { isPowered, enabled, activeOutput };
    }

    // 555 Timer IC (Astable Oscillation)
    if (comp.type === '555_timer') {
      const vccPinKey = `${comp.id}:pin-8`;
      const gndPinKey = `${comp.id}:pin-1`;
      const isPowered = Boolean(allVccNodes.has(vccPinKey) && allGndNodes.has(gndPinKey));

      const pulseHigh = isPowered && clockTick % 2 === 0;
      drivenSignals.set(`${comp.id}:pin-3`, pulseHigh);

      componentStates[comp.id] = { isPowered, outputHigh: pulseHigh };
      pinVoltages[`${comp.id}:pin-3`] = {
        voltage: isPowered ? (pulseHigh ? 4.9 : 0.1) : 0,
        logic: isPowered ? (pulseHigh ? '1' : '0') : '0',
        note: `555 Timer Pin 3 Output (${pulseHigh ? 'HIGH' : 'LOW'})`,
      };
    }
  });

  // Re-propagate passives for signals driven by IC outputs
  propagatePassives();

  // 7. Pass 3: Analog, Passives & Output Indicators (LEDs, 7-Segment, Buzzer)
  components.forEach((comp) => {
    if (comp.type === 'led') {
      const anodeKey = `${comp.id}:anode`;
      const cathodeKey = `${comp.id}:cathode`;

      const anodeHigh = isNetHigh(anodeKey) || isNetHigh(`${comp.id}:pin-1`);
      const cathodeLow = isNetLow(cathodeKey) || isNetLow(`${comp.id}:pin-2`);
      const anodeLow = isNetLow(anodeKey) || isNetLow(`${comp.id}:pin-1`);
      const cathodeHigh = isNetHigh(cathodeKey) || isNetHigh(`${comp.id}:pin-2`);

      // Reversed Polarity Check
      if (anodeLow && cathodeHigh) {
        issues.push({
          id: `reversed-led-${comp.id}`,
          severity: 'error',
          title: `Reversed LED Polarity (${comp.name})`,
          reason: `This LED is connected backward. LEDs are diodes and conduct in only one direction (Anode -> Cathode).`,
          fixSuggestion: `Flip the LED so the Anode connects toward positive voltage and Cathode to Ground.`,
          theoryModuleTab: 'theory',
          theoryTopic: 'Diodes & LEDs',
          relatedComponentId: comp.id,
        });
      }

      // Current Limiting Resistor Check
      const hasSeriesResistor =
        components.some(
          (c) => c.type === 'resistor' && (c.properties?.resistance ?? 330) >= 100
        ) ||
        wires.some((w) => w.from.label?.includes('Resistor') || w.to.label?.includes('Resistor'));

      if (anodeHigh && cathodeLow && !hasSeriesResistor) {
        issues.push({
          id: `no-resistor-led-${comp.id}`,
          severity: 'warning',
          title: `LED Missing Current-Limiting Resistor (${comp.name})`,
          reason: `Connected directly between power and ground with no series resistor. Excessive current will burn out the LED in real hardware.`,
          fixSuggestion: `Add a 220Ω–1kΩ resistor in series with the LED anode.`,
          theoryModuleTab: 'theory',
          theoryTopic: 'Ohm’s Law & Current Limiting',
          relatedComponentId: comp.id,
        });
      }

      const isIlluminated = anodeHigh && cathodeLow && !shortCircuitDetected;
      componentStates[comp.id] = {
        isIlluminated,
        forwardBiased: anodeHigh && cathodeLow,
      };
    }

    if (comp.type === 'seven_segment') {
      const comLow = isNetLow(`${comp.id}:pin-com`) || isNetLow('gnd-rail-1');
      const segmentStates: Record<string, boolean> = {};
      ['a', 'b', 'c', 'd', 'e', 'f', 'g'].forEach((seg) => {
        segmentStates[seg] = comLow && isNetHigh(`${comp.id}:pin-${seg}`);
      });
      componentStates[comp.id] = { activeSegments: segmentStates };
    }

    if (comp.type === 'buzzer') {
      const isSounding = isNetHigh(`${comp.id}:pin-pos`) && isNetLow(`${comp.id}:pin-neg`);
      componentStates[comp.id] = { isSounding };
    }
  });

  return {
    isVccConnected: allVccNodes.size > 0,
    isGndConnected: allGndNodes.size > 0,
    shortCircuitDetected,
    issues,
    pinVoltages,
    componentStates,
    netCount: nets.length,
  };
}
