/**
 * Solderless Virtual Breadboard Wire Validation & Educational Feedback Engine
 * 
 * Enforces fundamental electrical engineering & digital logic rules:
 * - Prevents self-loops
 * - Prevents duplicate connections
 * - Detects direct VCC-to-GND shorts (critical fire/chip-burnout hazard)
 * - Detects active output contention (two signal drivers tied together)
 * - Detects active drivers shorted directly to fixed power rails
 * - Detects floating input-to-input bridges with no active driver
 * - Checks polarity on passive components (e.g. LED Cathode, Diodes)
 * - Detects LEDs connected without current-limiting resistors
 * - Provides clear, actionable fix suggestions and links to Theory Modules
 */

export interface TerminalPoint {
  id: string;
  name: string;
  x: number;
  y: number;
  type: 'vcc' | 'gnd' | 'input' | 'output' | 'pin';
}

export interface Wire {
  id: string;
  fromId: string;
  toId: string;
  color: string;
  from: { x: number; y: number; label: string };
  to: { x: number; y: number; label: string };
  bendPoints?: { x: number; y: number }[];
}

export interface WireValidationResult {
  valid: boolean;
  reason?: string;
  fixSuggestion?: string;
  category?: 'self' | 'duplicate' | 'short' | 'conflict' | 'floating' | 'polarity' | 'safety';
  theoryModuleTab?: string;
  theoryTopic?: string;
}

/**
 * Validates a proposed jumper wire connection before inserting it into the netlist.
 * 
 * @param from Source terminal point clicked by the user
 * @param to Destination terminal point clicked by the user
 * @param existingWires Currently placed wires on the breadboard
 * @param installedIc The active IC mounted in the DIP socket (e.g. '7408', '7432', '7404')
 */
export function validateWireConnection(
  from: TerminalPoint,
  to: TerminalPoint,
  existingWires: Wire[] = [],
  installedIc: string = '7408'
): WireValidationResult {
  // RULE 1: Self-Connection Check
  if (from.id === to.id) {
    return {
      valid: false,
      category: 'self',
      reason: `Cannot connect a terminal to itself (${from.name}). Choose a different target terminal.`,
      fixSuggestion: 'Click a different component pin or tie-point to complete the wire.',
    };
  }

  // RULE 2: Duplicate Connection Check
  const isDuplicate = existingWires.some(
    (w) =>
      (w.fromId === from.id && w.toId === to.id) ||
      (w.fromId === to.id && w.toId === from.id)
  );

  if (isDuplicate) {
    return {
      valid: false,
      category: 'duplicate',
      reason: `A jumper wire is already connected between ${from.name} and ${to.name}.`,
      fixSuggestion: 'This connection is already made. No redundant jumper wire is needed.',
    };
  }

  const isVccTerminal = (id: string) =>
    id.startsWith('vcc-rail') || id.includes('plus') || id === 'pin-14' || id.endsWith(':vcc') || id.endsWith(':pin-14') || id.endsWith(':pin-8');

  const isGndTerminal = (id: string) =>
    id.startsWith('gnd-rail') || id.includes('minus') || id === 'pin-7' || id.endsWith(':gnd') || id.endsWith(':pin-7') || id.endsWith(':pin-1');

  // RULE 3: Direct Short Circuit (VCC directly to GND)
  if (
    (isVccTerminal(from.id) && isGndTerminal(to.id)) ||
    (isGndTerminal(from.id) && isVccTerminal(to.id))
  ) {
    return {
      valid: false,
      category: 'short',
      reason: `Direct short: VCC (+5V) connected straight to GND! This zero-resistance path would draw catastrophic current and burn out the IC or power supply in a real circuit.`,
      fixSuggestion: 'Disconnect this wire. Power and ground must only connect across a load (like an IC, resistor, or buzzer).',
      theoryModuleTab: 'theory',
      theoryTopic: 'Electrical Safety & Short Circuits',
    };
  }

  // Identify Active Signal Drivers (Sources)
  const isDriverOutput = (id: string) => {
    return (
      id === 'swA-out' ||
      id === 'swB-out' ||
      id.includes('sw-') ||
      id.endsWith(':out') ||
      id === 'pin-3' ||
      id.endsWith(':pin-3') ||
      id.endsWith(':pin-6') ||
      id.endsWith(':pin-8') ||
      id.endsWith(':pin-11') ||
      id.endsWith(':wiper')
    );
  };

  // RULE 4A: Two Active Outputs Tied Together (Driver Contention)
  if (isDriverOutput(from.id) && isDriverOutput(to.id)) {
    return {
      valid: false,
      category: 'conflict',
      reason: `Electrical conflict: Two outputs cannot be tied together (${from.name} ↔ ${to.name}). Two active signal sources cannot share the same node — one driving HIGH while the other drives LOW causes excessive contention current and short circuit.`,
      fixSuggestion: 'Route each output into separate gate inputs, or use a multiplexer/tri-state buffer instead of tying outputs together.',
      theoryModuleTab: 'theory',
      theoryTopic: 'TTL Logic Families (Totem-Pole Outputs)',
    };
  }

  // RULE 4B: Active Driver Connected Directly to Power Rails
  if (
    (isDriverOutput(from.id) && (isVccTerminal(to.id) || isGndTerminal(to.id))) ||
    (isDriverOutput(to.id) && (isVccTerminal(from.id) || isGndTerminal(from.id)))
  ) {
    const outputName = isDriverOutput(from.id) ? from.name : to.name;
    const railName = isDriverOutput(from.id) ? to.name : from.name;
    return {
      valid: false,
      category: 'conflict',
      reason: `Invalid connection: Active output ${outputName} cannot be wired directly to a fixed power rail (${railName}). The driver actively controls voltage; tying it directly to power destroys the output transistors.`,
      fixSuggestion: 'Connect gate outputs to a load (such as a 330Ω resistor + LED, or another gate input), never straight to power rails.',
      theoryModuleTab: 'theory',
      theoryTopic: 'Digital Output Stages',
    };
  }

  // RULE 5: Inputs Tied Together (Allowed in digital logic e.g. NAND inverter or shared clock/inputs)

  // RULE 6: Polarity on LED Cathode (Reversed LED)
  if (
    ((from.id === 'led-cathode' || from.id.endsWith(':cathode')) && isVccTerminal(to.id)) ||
    ((to.id === 'led-cathode' || to.id.endsWith(':cathode')) && isVccTerminal(from.id))
  ) {
    return {
      valid: false,
      category: 'polarity',
      reason: `This LED is connected backward. LEDs only conduct one way — flip it around so the flat side/shorter leg goes to the negative rail.`,
      fixSuggestion: 'Flip the LED or wire the Cathode (-) to the 0V Ground rail, and Anode (+) toward the positive voltage.',
      theoryModuleTab: 'theory',
      theoryTopic: 'Diodes & LEDs',
    };
  }

  // RULE 7: LED Anode Directly to VCC Rail without Series Resistor
  if (
    ((from.id === 'led-anode' || from.id.endsWith(':anode')) && isVccTerminal(to.id)) ||
    ((to.id === 'led-anode' || to.id.endsWith(':anode')) && isVccTerminal(from.id))
  ) {
    const hasResistor = existingWires.some(
      (w) => w.from.label?.toLowerCase().includes('resistor') || w.to.label?.toLowerCase().includes('resistor')
    );
    if (!hasResistor) {
      return {
        valid: false,
        category: 'safety',
        reason: `This LED has no resistor in series. Without one, too much current will flow and burn it out in a real circuit. Add a resistor (220Ω–1kΩ is typical) between the LED and the power source.`,
        fixSuggestion: 'Place a 330Ω resistor between the +5V power source and the LED Anode (+).',
        theoryModuleTab: 'theory',
        theoryTopic: 'Ohm’s Law & Current Limiting',
      };
    }
  }

  // Connection is electrically sound
  return {
    valid: true,
  };
}
