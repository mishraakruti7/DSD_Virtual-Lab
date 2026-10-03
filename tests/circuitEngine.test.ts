import { describe, it, expect } from 'vitest';
import { simulateCircuit, getDIPPinHoleKey, normalizeTerminalKey } from '../src/utils/circuitEngine';
import { CircuitComponent, BreadboardWire } from '../src/types/breadboard';

describe('Circuit Engine — Electrical Continuity and Breadboard Mapping', () => {
  it('correctly maps DIP-14 pins to breadboard column tie-strips across the trough', () => {
    // Start at column 10:
    // Pin 1 -> strip:10:top
    // Pin 7 -> strip:16:top
    // Pin 8 -> strip:16:bot
    // Pin 14 -> strip:10:bot
    expect(getDIPPinHoleKey(10, 1, 14)).toBe('strip:10:top');
    expect(getDIPPinHoleKey(10, 7, 14)).toBe('strip:16:top');
    expect(getDIPPinHoleKey(10, 8, 14)).toBe('strip:16:bot');
    expect(getDIPPinHoleKey(10, 14, 14)).toBe('strip:10:bot');
  });

  it('normalizes hole coordinates from row/col or labels', () => {
    expect(normalizeTerminalKey({ col: 12, row: 'C' })).toBe('strip:12:top');
    expect(normalizeTerminalKey({ col: 12, row: 'G' })).toBe('strip:12:bot');
    expect(normalizeTerminalKey({ label: 'Hole A15' })).toBe('strip:15:top');
    expect(normalizeTerminalKey({ label: 'Hole J15' })).toBe('strip:15:bot');
    expect(normalizeTerminalKey({ rail: 'top_plus' })).toBe('rail:top_plus');
  });

  it('detects a catastrophic direct VCC-to-GND short circuit', () => {
    const components: CircuitComponent[] = [];
    const wires: BreadboardWire[] = [
      {
        id: 'w-short',
        color: 'red',
        from: { type: 'power_rail', rail: 'top_plus', label: '+5V Rail', x: 100, y: 50 },
        to: { type: 'power_rail', rail: 'top_minus', label: 'GND Rail', x: 100, y: 76 },
      },
    ];

    const result = simulateCircuit(components, wires);
    expect(result.shortCircuitDetected).toBe(true);
    expect(result.issues.some((i) => i.id === 'short-circuit-vcc-gnd')).toBe(true);
  });
});

describe('Circuit Engine — TTL Logic IC Truth Tables & Power Enforcement', () => {
  const createPowered7408 = (startCol = 10): { comp: CircuitComponent; powerWires: BreadboardWire[] } => {
    const comp: CircuitComponent = {
      id: 'ic-7408',
      name: '7408 Quad AND',
      type: '7408',
      category: 'logic_ic',
      x: 110 + (startCol - 1) * 26 + 3 * 26,
      y: 240,
      rotation: 0,
      pins: [
        { id: 'pin-1', label: '1A', role: 'input', xOffset: -40, yOffset: -20 },
        { id: 'pin-2', label: '1B', role: 'input', xOffset: -20, yOffset: -20 },
        { id: 'pin-3', label: '1Y', role: 'output', xOffset: 0, yOffset: -20 },
        { id: 'pin-7', label: 'GND', role: 'gnd', xOffset: 40, yOffset: -20 },
        { id: 'pin-14', label: 'VCC', role: 'vcc', xOffset: -40, yOffset: 20 },
      ],
      properties: { startCol },
    };

    // Power Pin 14 (col 10 bot) to VCC, and Pin 7 (col 16 top) to GND
    const powerWires: BreadboardWire[] = [
      {
        id: 'w-vcc',
        color: 'red',
        from: { type: 'tie_point', col: startCol, row: 'J', label: `Hole J${startCol}`, x: 0, y: 0 },
        to: { type: 'power_rail', rail: 'top_plus', label: '+5V Rail', x: 0, y: 0 },
      },
      {
        id: 'w-gnd',
        color: 'black',
        from: { type: 'tie_point', col: startCol + 6, row: 'A', label: `Hole A${startCol + 6}`, x: 0, y: 0 },
        to: { type: 'power_rail', rail: 'top_minus', label: 'GND Rail', x: 0, y: 0 },
      },
    ];

    return { comp, powerWires };
  };

  it('flags an unpowered IC when VCC or GND is missing', () => {
    const { comp } = createPowered7408();
    const result = simulateCircuit([comp], []); // No power wires
    expect(result.componentStates[comp.id]?.isPowered).toBe(false);
    expect(result.issues.some((i) => i.id === `unpowered-${comp.id}`)).toBe(true);
  });

  it('correctly simulates 7408 AND gate truth table: 0 AND 0 = 0, 1 AND 0 = 0, 1 AND 1 = 1', () => {
    const { comp, powerWires } = createPowered7408(10);

    // Switch A driving Pin 1 (col 10 top)
    const swA: CircuitComponent = {
      id: 'swA',
      name: 'Switch A',
      type: 'toggle_switch',
      category: 'switches',
      x: 50,
      y: 100,
      rotation: 0,
      pins: [{ id: 'pin-out', label: 'OUT', role: 'output', xOffset: 10, yOffset: 0 }],
      properties: { state: false },
    };

    // Switch B driving Pin 2 (col 11 top)
    const swB: CircuitComponent = {
      id: 'swB',
      name: 'Switch B',
      type: 'toggle_switch',
      category: 'switches',
      x: 50,
      y: 150,
      rotation: 0,
      pins: [{ id: 'pin-out', label: 'OUT', role: 'output', xOffset: 10, yOffset: 0 }],
      properties: { state: false },
    };

    const inputWires: BreadboardWire[] = [
      {
        id: 'w-inA',
        color: 'green',
        from: { type: 'switch_input', label: 'swA:pin-out', x: 0, y: 0 },
        to: { type: 'tie_point', col: 10, row: 'B', label: 'Hole B10', x: 0, y: 0 },
      },
      {
        id: 'w-inB',
        color: 'green',
        from: { type: 'switch_input', label: 'swB:pin-out', x: 0, y: 0 },
        to: { type: 'tie_point', col: 11, row: 'B', label: 'Hole B11', x: 0, y: 0 },
      },
    ];

    // Case 1: 0 AND 0 -> 0
    let res = simulateCircuit([comp, swA, swB], [...powerWires, ...inputWires]);
    expect(res.componentStates[comp.id]?.gateOutputs[1]).toBe(false);

    // Case 2: 1 AND 0 -> 0
    swA.properties.state = true;
    res = simulateCircuit([comp, swA, swB], [...powerWires, ...inputWires]);
    expect(res.componentStates[comp.id]?.gateOutputs[1]).toBe(false);

    // Case 3: 1 AND 1 -> 1
    swB.properties.state = true;
    res = simulateCircuit([comp, swA, swB], [...powerWires, ...inputWires]);
    expect(res.componentStates[comp.id]?.gateOutputs[1]).toBe(true);
    expect(res.pinVoltages[`${comp.id}:pin-3`]?.logic).toBe('1');
  });

  it('correctly simulates 7404 NOT Inverter: NOT 0 = 1, NOT 1 = 0', () => {
    const comp: CircuitComponent = {
      id: 'ic-7404',
      name: '7404 Hex Inverter',
      type: '7404',
      category: 'logic_ic',
      x: 200,
      y: 240,
      rotation: 0,
      pins: [
        { id: 'pin-1', label: '1A', role: 'input', xOffset: -40, yOffset: -20 },
        { id: 'pin-2', label: '1Y', role: 'output', xOffset: -20, yOffset: -20 },
        { id: 'pin-7', label: 'GND', role: 'gnd', xOffset: 40, yOffset: -20 },
        { id: 'pin-14', label: 'VCC', role: 'vcc', xOffset: -40, yOffset: 20 },
      ],
      properties: { startCol: 5 },
    };

    const powerWires: BreadboardWire[] = [
      {
        id: 'w-vcc',
        color: 'red',
        from: { type: 'tie_point', col: 5, row: 'J', label: 'Hole J5', x: 0, y: 0 },
        to: { type: 'power_rail', rail: 'top_plus', label: '+5V Rail', x: 0, y: 0 },
      },
      {
        id: 'w-gnd',
        color: 'black',
        from: { type: 'tie_point', col: 11, row: 'A', label: 'Hole A11', x: 0, y: 0 },
        to: { type: 'power_rail', rail: 'top_minus', label: 'GND Rail', x: 0, y: 0 },
      },
    ];

    const sw: CircuitComponent = {
      id: 'sw1',
      name: 'Switch 1',
      type: 'toggle_switch',
      category: 'switches',
      x: 0,
      y: 0,
      rotation: 0,
      pins: [{ id: 'pin-out', label: 'OUT', role: 'output', xOffset: 0, yOffset: 0 }],
      properties: { state: false },
    };

    const inputWire: BreadboardWire = {
      id: 'w-in',
      color: 'blue',
      from: { type: 'switch_input', label: 'sw1:pin-out', x: 0, y: 0 },
      to: { type: 'tie_point', col: 5, row: 'C', label: 'Hole C5', x: 0, y: 0 },
    };

    // When Switch is LOW (0), 7404 Gate 1 output is HIGH (1)
    let res = simulateCircuit([comp, sw], [...powerWires, inputWire]);
    expect(res.componentStates[comp.id]?.gateOutputs[1]).toBe(true);

    // When Switch is HIGH (1), 7404 Gate 1 output is LOW (0)
    sw.properties.state = true;
    res = simulateCircuit([comp, sw], [...powerWires, inputWire]);
    expect(res.componentStates[comp.id]?.gateOutputs[1]).toBe(false);
  });

  it('correctly simulates 7402 NOR Gate with exact datasheet pinout (Pin 1 is Output, Pins 2 & 3 are Inputs)', () => {
    const comp: CircuitComponent = {
      id: 'ic-7402',
      name: '7402 Quad NOR',
      type: '7402',
      category: 'logic_ic',
      x: 200,
      y: 240,
      rotation: 0,
      pins: [
        { id: 'pin-1', label: '1Y', role: 'output', xOffset: -40, yOffset: -20 },
        { id: 'pin-2', label: '1A', role: 'input', xOffset: -20, yOffset: -20 },
        { id: 'pin-3', label: '1B', role: 'input', xOffset: 0, yOffset: -20 },
        { id: 'pin-7', label: 'GND', role: 'gnd', xOffset: 40, yOffset: -20 },
        { id: 'pin-14', label: 'VCC', role: 'vcc', xOffset: -40, yOffset: 20 },
      ],
      properties: { startCol: 5 },
    };

    const powerWires: BreadboardWire[] = [
      {
        id: 'w-vcc',
        color: 'red',
        from: { type: 'tie_point', col: 5, row: 'J', label: 'Hole J5', x: 0, y: 0 },
        to: { type: 'power_rail', rail: 'top_plus', label: '+5V Rail', x: 0, y: 0 },
      },
      {
        id: 'w-gnd',
        color: 'black',
        from: { type: 'tie_point', col: 11, row: 'A', label: 'Hole A11', x: 0, y: 0 },
        to: { type: 'power_rail', rail: 'top_minus', label: 'GND Rail', x: 0, y: 0 },
      },
    ];

    // NOR truth table: 0 NOR 0 = 1; 1 NOR 0 = 0; 0 NOR 1 = 0; 1 NOR 1 = 0
    let res = simulateCircuit([comp], powerWires);
    // Inputs are unasserted/low, output 1Y (Pin 1) must be HIGH (1)
    expect(res.componentStates[comp.id]?.gateOutputs[1]).toBe(true);
    expect(res.pinVoltages[`${comp.id}:pin-1`]?.logic).toBe('1');
  });

  it('correctly simulates 7474 D Flip-Flop positive clock edge triggering', () => {
    const comp: CircuitComponent = {
      id: 'ic-7474',
      name: '7474 Dual D Flip-Flop',
      type: '7474',
      category: 'sequential_ic',
      x: 200,
      y: 240,
      rotation: 0,
      pins: [
        { id: 'pin-1', label: '1/CLR', role: 'input', xOffset: -40, yOffset: -20 },
        { id: 'pin-2', label: '1D', role: 'input', xOffset: -20, yOffset: -20 },
        { id: 'pin-3', label: '1CLK', role: 'input', xOffset: 0, yOffset: -20 },
        { id: 'pin-5', label: '1Q', role: 'output', xOffset: 40, yOffset: -20 },
        { id: 'pin-6', label: '1/Q', role: 'output', xOffset: 60, yOffset: -20 },
        { id: 'pin-7', label: 'GND', role: 'gnd', xOffset: 80, yOffset: -20 },
        { id: 'pin-14', label: 'VCC', role: 'vcc', xOffset: -40, yOffset: 20 },
      ],
      properties: { startCol: 5 },
    };

    const powerWires: BreadboardWire[] = [
      { id: 'w-vcc', color: 'red', from: { type: 'tie_point', col: 5, row: 'J', label: 'Hole J5', x: 0, y: 0 }, to: { type: 'power_rail', rail: 'top_plus', label: '+5V Rail', x: 0, y: 0 } },
      { id: 'w-gnd', color: 'black', from: { type: 'tie_point', col: 11, row: 'A', label: 'Hole A11', x: 0, y: 0 }, to: { type: 'power_rail', rail: 'top_minus', label: 'GND Rail', x: 0, y: 0 } },
    ];

    // Connect D to +5V (HIGH)
    const dWire: BreadboardWire = {
      id: 'w-d',
      color: 'blue',
      from: { type: 'tie_point', col: 6, row: 'B', label: 'Hole B6', x: 0, y: 0 },
      to: { type: 'power_rail', rail: 'top_plus', label: '+5V Rail', x: 0, y: 0 },
    };

    // Low clock before pulse
    let res = simulateCircuit([comp], [...powerWires, dWire], 0, { [comp.id]: { q1: false, prevClk1: false } });
    expect(res.componentStates[comp.id]?.q1).toBe(false);

    // Clock pulse HIGH (positive edge transition: clk1 was false, now true)
    const clkWire: BreadboardWire = {
      id: 'w-clk',
      color: 'yellow',
      from: { type: 'tie_point', col: 7, row: 'B', label: 'Hole B7', x: 0, y: 0 },
      to: { type: 'power_rail', rail: 'top_plus', label: '+5V Rail', x: 0, y: 0 },
    };

    res = simulateCircuit([comp], [...powerWires, dWire, clkWire], 1, { [comp.id]: { q1: false, prevClk1: false } });
    expect(res.componentStates[comp.id]?.q1).toBe(true);
  });

  it('correctly simulates 74138 3-to-8 Decoder active-LOW output decoding', () => {
    const comp: CircuitComponent = {
      id: 'ic-74138',
      name: '74138 3-to-8 Decoder',
      type: '74138',
      category: 'logic_ic',
      x: 200,
      y: 240,
      rotation: 0,
      pins: [
        { id: 'pin-1', label: 'A', role: 'input', xOffset: -40, yOffset: -20 },
        { id: 'pin-2', label: 'B', role: 'input', xOffset: -20, yOffset: -20 },
        { id: 'pin-3', label: 'C', role: 'input', xOffset: 0, yOffset: -20 },
        { id: 'pin-4', label: '/G2A', role: 'input', xOffset: 20, yOffset: -20 },
        { id: 'pin-5', label: '/G2B', role: 'input', xOffset: 40, yOffset: -20 },
        { id: 'pin-6', label: 'G1', role: 'input', xOffset: 60, yOffset: -20 },
        { id: 'pin-8', label: 'GND', role: 'gnd', xOffset: 80, yOffset: -20 },
        { id: 'pin-16', label: 'VCC', role: 'vcc', xOffset: -40, yOffset: 20 },
      ],
      properties: { startCol: 5 },
    };

    // Power pins: Pin 16 is VCC, Pin 8 is GND
    const wires: BreadboardWire[] = [
      { id: 'w-vcc', color: 'red', from: { type: 'tie_point', label: 'ic-74138:pin-16', x: 0, y: 0 }, to: { type: 'power_rail', rail: 'top_plus', label: '+5V Rail', x: 0, y: 0 } },
      { id: 'w-gnd', color: 'black', from: { type: 'tie_point', label: 'ic-74138:pin-8', x: 0, y: 0 }, to: { type: 'power_rail', rail: 'top_minus', label: 'GND Rail', x: 0, y: 0 } },
      // Enable pins: G1=HIGH, /G2A=LOW, /G2B=LOW
      { id: 'w-g1', color: 'red', from: { type: 'tie_point', label: 'ic-74138:pin-6', x: 0, y: 0 }, to: { type: 'power_rail', rail: 'top_plus', label: '+5V Rail', x: 0, y: 0 } },
      { id: 'w-g2a', color: 'black', from: { type: 'tie_point', label: 'ic-74138:pin-4', x: 0, y: 0 }, to: { type: 'power_rail', rail: 'top_minus', label: 'GND Rail', x: 0, y: 0 } },
      { id: 'w-g2b', color: 'black', from: { type: 'tie_point', label: 'ic-74138:pin-5', x: 0, y: 0 }, to: { type: 'power_rail', rail: 'top_minus', label: 'GND Rail', x: 0, y: 0 } },
      // Set input A=HIGH (1), B=LOW, C=LOW -> selects line 1 (output /Y1 is LOW)
      { id: 'w-a', color: 'blue', from: { type: 'tie_point', label: 'ic-74138:pin-1', x: 0, y: 0 }, to: { type: 'power_rail', rail: 'top_plus', label: '+5V Rail', x: 0, y: 0 } },
    ];

    const res = simulateCircuit([comp], wires);
    expect(res.componentStates[comp.id]?.enabled).toBe(true);
    expect(res.componentStates[comp.id]?.activeOutput).toBe(1);
  });

  it('correctly simulates 555 Timer astable output oscillation', () => {
    const timer: CircuitComponent = {
      id: 'ic-555',
      name: 'NE555 Timer',
      type: '555_timer',
      category: 'sequential_ic',
      x: 100,
      y: 100,
      rotation: 0,
      pins: [
        { id: 'pin-1', label: 'GND', role: 'gnd', xOffset: -20, yOffset: -20 },
        { id: 'pin-3', label: 'OUT', role: 'output', xOffset: 20, yOffset: -20 },
        { id: 'pin-8', label: 'VCC', role: 'vcc', xOffset: -20, yOffset: 20 },
      ],
      properties: {},
    };

    const powerWires: BreadboardWire[] = [
      { id: 'w-vcc', color: 'red', from: { type: 'tie_point', label: 'ic-555:pin-8', x: 0, y: 0 }, to: { type: 'power_rail', rail: 'top_plus', label: '+5V Rail', x: 0, y: 0 } },
      { id: 'w-gnd', color: 'black', from: { type: 'tie_point', label: 'ic-555:pin-1', x: 0, y: 0 }, to: { type: 'power_rail', rail: 'top_minus', label: 'GND Rail', x: 0, y: 0 } },
    ];

    // Clock tick 0 (even tick -> HIGH)
    let res = simulateCircuit([timer], powerWires, 0);
    expect(res.componentStates[timer.id]?.outputHigh).toBe(true);
    expect(res.pinVoltages[`${timer.id}:pin-3`]?.logic).toBe('1');

    // Clock tick 1 (odd tick -> LOW)
    res = simulateCircuit([timer], powerWires, 1);
    expect(res.componentStates[timer.id]?.outputHigh).toBe(false);
    expect(res.pinVoltages[`${timer.id}:pin-3`]?.logic).toBe('0');
  });
});

describe('Circuit Engine — Analog Safety & LED Protection Rules', () => {
  it('flags a warning when an LED is missing a series current-limiting resistor', () => {
    const led: CircuitComponent = {
      id: 'led-1',
      name: 'Red LED',
      type: 'led',
      category: 'outputs',
      x: 300,
      y: 100,
      rotation: 0,
      pins: [
        { id: 'anode', label: 'Anode', role: 'input', xOffset: -10, yOffset: 0 },
        { id: 'cathode', label: 'Cathode', role: 'gnd', xOffset: 10, yOffset: 0 },
      ],
      properties: {},
    };

    const wires: BreadboardWire[] = [
      {
        id: 'w1',
        color: 'red',
        from: { type: 'power_rail', rail: 'top_plus', label: '+5V Rail', x: 0, y: 0 },
        to: { type: 'led_output', label: 'led-1:anode', x: 0, y: 0 },
      },
      {
        id: 'w2',
        color: 'black',
        from: { type: 'led_output', label: 'led-1:cathode', x: 0, y: 0 },
        to: { type: 'power_rail', rail: 'top_minus', label: 'GND Rail', x: 0, y: 0 },
      },
    ];

    const res = simulateCircuit([led], wires);
    expect(res.componentStates['led-1']?.isIlluminated).toBe(true);
    expect(res.issues.some((i) => i.id === 'no-resistor-led-led-1')).toBe(true);
  });

  it('operates safely without warnings when a 330Ω resistor is placed in series', () => {
    const led: CircuitComponent = {
      id: 'led-1',
      name: 'Red LED',
      type: 'led',
      category: 'outputs',
      x: 300,
      y: 100,
      rotation: 0,
      pins: [
        { id: 'anode', label: 'Anode', role: 'input', xOffset: -10, yOffset: 0 },
        { id: 'cathode', label: 'Cathode', role: 'gnd', xOffset: 10, yOffset: 0 },
      ],
      properties: {},
    };

    const resistor: CircuitComponent = {
      id: 'res-1',
      name: '330Ω Resistor',
      type: 'resistor',
      category: 'passives',
      x: 250,
      y: 100,
      rotation: 0,
      pins: [
        { id: 'pin-1', label: '1', role: 'passive', xOffset: -15, yOffset: 0 },
        { id: 'pin-2', label: '2', role: 'passive', xOffset: 15, yOffset: 0 },
      ],
      properties: { resistance: 330 },
    };

    const wires: BreadboardWire[] = [
      {
        id: 'w1',
        color: 'red',
        from: { type: 'power_rail', rail: 'top_plus', label: '+5V Rail', x: 0, y: 0 },
        to: { type: 'tie_point', label: 'res-1:pin-1', x: 0, y: 0 },
      },
      {
        id: 'w2',
        color: 'yellow',
        from: { type: 'tie_point', label: 'res-1:pin-2', x: 0, y: 0 },
        to: { type: 'led_output', label: 'led-1:anode', x: 0, y: 0 },
      },
      {
        id: 'w3',
        color: 'black',
        from: { type: 'led_output', label: 'led-1:cathode', x: 0, y: 0 },
        to: { type: 'power_rail', rail: 'top_minus', label: 'GND Rail', x: 0, y: 0 },
      },
    ];

    const res = simulateCircuit([led, resistor], wires);
    expect(res.componentStates['led-1']?.isIlluminated).toBe(true);
    expect(res.issues.some((i) => i.id === 'no-resistor-led-led-1')).toBe(false);
  });

  it('detects reversed LED polarity when cathode is wired to VCC and anode to GND', () => {
    const led: CircuitComponent = {
      id: 'led-1',
      name: 'Red LED',
      type: 'led',
      category: 'outputs',
      x: 300,
      y: 100,
      rotation: 0,
      pins: [
        { id: 'anode', label: 'Anode', role: 'input', xOffset: -10, yOffset: 0 },
        { id: 'cathode', label: 'Cathode', role: 'gnd', xOffset: 10, yOffset: 0 },
      ],
      properties: {},
    };

    const wires: BreadboardWire[] = [
      {
        id: 'w1',
        color: 'black',
        from: { type: 'power_rail', rail: 'top_minus', label: 'GND Rail', x: 0, y: 0 },
        to: { type: 'led_output', label: 'led-1:anode', x: 0, y: 0 },
      },
      {
        id: 'w2',
        color: 'red',
        from: { type: 'power_rail', rail: 'top_plus', label: '+5V Rail', x: 0, y: 0 },
        to: { type: 'led_output', label: 'led-1:cathode', x: 0, y: 0 },
      },
    ];

    const res = simulateCircuit([led], wires);
    expect(res.componentStates['led-1']?.isIlluminated).toBe(false);
    expect(res.issues.some((i) => i.id === 'reversed-led-led-1')).toBe(true);
  });
});
