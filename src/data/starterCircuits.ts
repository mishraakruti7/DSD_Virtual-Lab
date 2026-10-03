import { CircuitModel, CircuitComponent, BreadboardWire } from '../types/breadboard';

export interface StarterCircuitTemplate extends CircuitModel {
  id: string;
  name: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  whatCanILearn: string;
  tags: string[];
  sketchCode?: string;
}

export const STARTER_CIRCUITS: StarterCircuitTemplate[] = [
  // ==========================================
  // 1. Basic AND Gate Demo (7408)
  // ==========================================
  {
    id: 'starter-and-gate',
    name: 'Basic AND Gate Demo',
    category: 'Combinational Logic',
    difficulty: 'Beginner',
    tags: ['7408', 'TTL', 'Truth Table', 'LED'],
    whatCanILearn:
      'This circuit demonstrates fundamental Boolean conjunction using the 7408 Quad 2-Input TTL AND gate. Two digital logic switches drive inputs 1A (Pin 1) and 1B (Pin 2). The output 1Y (Pin 3) only drives HIGH (+5V) when both switches are ON simultaneously, lighting the red indicator LED through a 330Ω protective resistor. Experiment by toggling either switch to verify all four states of the AND truth table.',
    components: [
      {
        id: 'comp-7408',
        type: '7408',
        name: '7408 Quad AND Gate',
        category: 'logic_ic',
        x: 300,
        y: 200,
        rotation: 0,
        pins: [
          { id: 'pin-1', label: '1A', role: 'input', xOffset: -60, yOffset: 30 },
          { id: 'pin-2', label: '1B', role: 'input', xOffset: -40, yOffset: 30 },
          { id: 'pin-3', label: '1Y', role: 'output', xOffset: -20, yOffset: 30 },
          { id: 'pin-7', label: 'GND', role: 'gnd', xOffset: 60, yOffset: 30 },
          { id: 'pin-14', label: 'VCC', role: 'vcc', xOffset: -60, yOffset: -30 },
        ],
        properties: { pinCount: 14 },
      },
      {
        id: 'comp-sw-a',
        type: 'toggle_switch',
        name: 'Switch A',
        category: 'switches',
        x: 130,
        y: 190,
        rotation: 0,
        pins: [{ id: 'out', label: 'OUT', role: 'output', xOffset: 0, yOffset: 25 }],
        properties: { state: true, label: 'SW A' },
      },
      {
        id: 'comp-sw-b',
        type: 'toggle_switch',
        name: 'Switch B',
        category: 'switches',
        x: 130,
        y: 270,
        rotation: 0,
        pins: [{ id: 'out', label: 'OUT', role: 'output', xOffset: 0, yOffset: 25 }],
        properties: { state: true, label: 'SW B' },
      },
      {
        id: 'comp-res-1',
        type: 'resistor',
        name: '330Ω Resistor',
        category: 'passives',
        x: 430,
        y: 200,
        rotation: 0,
        pins: [
          { id: 'pin-1', label: '1', role: 'passive', xOffset: -35, yOffset: 0 },
          { id: 'pin-2', label: '2', role: 'passive', xOffset: 35, yOffset: 0 },
        ],
        properties: { resistance: 330 },
      },
      {
        id: 'comp-led-1',
        type: 'led',
        name: 'Red LED',
        category: 'outputs',
        x: 520,
        y: 200,
        rotation: 0,
        pins: [
          { id: 'anode', label: 'A (+)', role: 'input', xOffset: -12, yOffset: 25 },
          { id: 'cathode', label: 'K (-)', role: 'gnd', xOffset: 12, yOffset: 25 },
        ],
        properties: { color: 'red' },
      },
    ],
    wires: [
      {
        id: 'w1',
        color: 'red',
        from: { type: 'power_rail', rail: 'top_plus', label: '+5V Rail', x: 90, y: 40 },
        to: { type: 'tie_point', label: '7408 VCC (Pin 14)', x: 240, y: 170 },
      },
      {
        id: 'w2',
        color: 'black',
        from: { type: 'power_rail', rail: 'bottom_minus', label: 'GND Rail', x: 90, y: 355 },
        to: { type: 'tie_point', label: '7408 GND (Pin 7)', x: 360, y: 230 },
      },
      {
        id: 'w3',
        color: 'blue',
        from: { type: 'switch_input', label: 'Switch A Out', x: 130, y: 215 },
        to: { type: 'tie_point', label: '7408 1A (Pin 1)', x: 240, y: 230 },
      },
      {
        id: 'w4',
        color: 'blue',
        from: { type: 'switch_input', label: 'Switch B Out', x: 130, y: 295 },
        to: { type: 'tie_point', label: '7408 1B (Pin 2)', x: 260, y: 230 },
      },
      {
        id: 'w5',
        color: 'green',
        from: { type: 'tie_point', label: '7408 1Y (Pin 3)', x: 280, y: 230 },
        to: { type: 'tie_point', label: 'Resistor In', x: 395, y: 200 },
      },
      {
        id: 'w6',
        color: 'yellow',
        from: { type: 'tie_point', label: 'Resistor Out', x: 465, y: 200 },
        to: { type: 'tie_point', label: 'LED Anode (+)', x: 508, y: 225 },
      },
      {
        id: 'w7',
        color: 'black',
        from: { type: 'tie_point', label: 'LED Cathode (-)', x: 532, y: 225 },
        to: { type: 'power_rail', rail: 'bottom_minus', label: 'GND Rail', x: 380, y: 355 },
      },
    ],
  },

  // ==========================================
  // 2. 555 Astable LED Blinker
  // ==========================================
  {
    id: 'starter-555-blinker',
    name: '555 Astable LED Blinker',
    category: 'Timers & Oscillators',
    difficulty: 'Intermediate',
    tags: ['555 Timer', 'Astable', 'RC Timing', 'Oscillator'],
    whatCanILearn:
      'The 555 timer configured in astable multivibrator mode acts as a self-running square wave clock generator with no stable resting state. An RC timing network charges capacitor C1 through resistors R1 and R2 until threshold voltage (2/3 VCC) is reached, and discharges through R2 until trigger voltage (1/3 VCC) is crossed. Pin 3 continuously toggles between HIGH and LOW, producing rhythmic flashing on the connected green LED. This circuit forms the clock pulse heart for counters and registers in digital systems.',
    components: [
      {
        id: 'comp-555',
        type: '555_timer',
        name: '555 Precision Timer',
        category: 'sequential_ic',
        x: 280,
        y: 200,
        rotation: 0,
        pins: [
          { id: 'pin-1', label: 'GND', role: 'gnd', xOffset: -30, yOffset: 30 },
          { id: 'pin-2', label: 'TRIG', role: 'input', xOffset: -10, yOffset: 30 },
          { id: 'pin-3', label: 'OUT', role: 'output', xOffset: 10, yOffset: 30 },
          { id: 'pin-4', label: 'RESET', role: 'input', xOffset: 30, yOffset: 30 },
          { id: 'pin-8', label: 'VCC', role: 'vcc', xOffset: -30, yOffset: -30 },
          { id: 'pin-7', label: 'DISCH', role: 'passive', xOffset: -10, yOffset: -30 },
          { id: 'pin-6', label: 'THRES', role: 'input', xOffset: 10, yOffset: -30 },
        ],
        properties: { pinCount: 8 },
      },
      {
        id: 'comp-c1',
        type: 'capacitor_electrolytic',
        name: '10µF Capacitor',
        category: 'passives',
        x: 170,
        y: 230,
        rotation: 0,
        pins: [
          { id: 'anode', label: '+', role: 'passive', xOffset: -15, yOffset: 20 },
          { id: 'cathode', label: '-', role: 'gnd', xOffset: 15, yOffset: 20 },
        ],
        properties: { capacitance: '10uF' },
      },
      {
        id: 'comp-res-r1',
        type: 'resistor',
        name: '10kΩ Resistor (R1)',
        category: 'passives',
        x: 200,
        y: 110,
        rotation: 0,
        pins: [
          { id: 'pin-1', label: '1', role: 'passive', xOffset: -35, yOffset: 0 },
          { id: 'pin-2', label: '2', role: 'passive', xOffset: 35, yOffset: 0 },
        ],
        properties: { resistance: 10000 },
      },
      {
        id: 'comp-led-green',
        type: 'led',
        name: 'Green LED',
        category: 'outputs',
        x: 440,
        y: 230,
        rotation: 0,
        pins: [
          { id: 'anode', label: 'A (+)', role: 'input', xOffset: -12, yOffset: 25 },
          { id: 'cathode', label: 'K (-)', role: 'gnd', xOffset: 12, yOffset: 25 },
        ],
        properties: { color: 'green' },
      },
    ],
    wires: [
      {
        id: 'w-555-vcc',
        color: 'red',
        from: { type: 'power_rail', rail: 'top_plus', label: '+5V Rail', x: 90, y: 40 },
        to: { type: 'tie_point', label: '555 VCC (Pin 8)', x: 250, y: 170 },
      },
      {
        id: 'w-555-gnd',
        color: 'black',
        from: { type: 'power_rail', rail: 'bottom_minus', label: 'GND Rail', x: 90, y: 355 },
        to: { type: 'tie_point', label: '555 GND (Pin 1)', x: 250, y: 230 },
      },
      {
        id: 'w-555-out',
        color: 'green',
        from: { type: 'tie_point', label: '555 OUT (Pin 3)', x: 290, y: 230 },
        to: { type: 'tie_point', label: 'LED Anode', x: 428, y: 255 },
      },
      {
        id: 'w-led-gnd',
        color: 'black',
        from: { type: 'tie_point', label: 'LED Cathode', x: 452, y: 255 },
        to: { type: 'power_rail', rail: 'bottom_minus', label: 'GND Rail', x: 380, y: 355 },
      },
    ],
  },

  // ==========================================
  // 3. 4017 Decade Counter — Sequential LED Chaser
  // ==========================================
  {
    id: 'starter-4017-chaser',
    name: '4017 Decade Counter — Sequential LED Chaser',
    category: 'Sequential Logic',
    difficulty: 'Intermediate',
    tags: ['4017', 'Johnson Counter', 'Clock Pulse', 'LED Chaser'],
    whatCanILearn:
      'The CD4017 is a 5-stage divide-by-10 Johnson decade counter with 10 decoded outputs. On each rising clock edge received on Pin 14, the counter advances the active HIGH signal from output Q0 to Q9 in consecutive sequence. Here, 5 colored LEDs light up one after another in a visual running "chaser" pattern. This architecture is widely studied in Module 1 for digital sequencers, traffic light controllers, and display scanners.',
    components: [
      {
        id: 'comp-4017',
        type: '4017',
        name: '4017 Decade Counter',
        category: 'sequential_ic',
        x: 260,
        y: 200,
        rotation: 0,
        pins: [
          { id: 'pin-3', label: 'Q0', role: 'output', xOffset: -70, yOffset: 30 },
          { id: 'pin-2', label: 'Q1', role: 'output', xOffset: -50, yOffset: 30 },
          { id: 'pin-4', label: 'Q2', role: 'output', xOffset: -30, yOffset: 30 },
          { id: 'pin-7', label: 'Q3', role: 'output', xOffset: -10, yOffset: 30 },
          { id: 'pin-8', label: 'GND', role: 'gnd', xOffset: 70, yOffset: 30 },
          { id: 'pin-16', label: 'VDD', role: 'vcc', xOffset: -70, yOffset: -30 },
          { id: 'pin-14', label: 'CLK', role: 'clock', xOffset: -30, yOffset: -30 },
        ],
        properties: { pinCount: 16 },
      },
      {
        id: 'comp-led-q0',
        type: 'led',
        name: 'LED 0 (Blue)',
        category: 'outputs',
        x: 420,
        y: 130,
        rotation: 0,
        pins: [
          { id: 'anode', label: 'A (+)', role: 'input', xOffset: -12, yOffset: 25 },
          { id: 'cathode', label: 'K (-)', role: 'gnd', xOffset: 12, yOffset: 25 },
        ],
        properties: { color: 'blue' },
      },
      {
        id: 'comp-led-q1',
        type: 'led',
        name: 'LED 1 (Yellow)',
        category: 'outputs',
        x: 420,
        y: 200,
        rotation: 0,
        pins: [
          { id: 'anode', label: 'A (+)', role: 'input', xOffset: -12, yOffset: 25 },
          { id: 'cathode', label: 'K (-)', role: 'gnd', xOffset: 12, yOffset: 25 },
        ],
        properties: { color: 'yellow' },
      },
      {
        id: 'comp-led-q2',
        type: 'led',
        name: 'LED 2 (Red)',
        category: 'outputs',
        x: 420,
        y: 270,
        rotation: 0,
        pins: [
          { id: 'anode', label: 'A (+)', role: 'input', xOffset: -12, yOffset: 25 },
          { id: 'cathode', label: 'K (-)', role: 'gnd', xOffset: 12, yOffset: 25 },
        ],
        properties: { color: 'red' },
      },
    ],
    wires: [
      {
        id: 'w-4017-vdd',
        color: 'red',
        from: { type: 'power_rail', rail: 'top_plus', label: '+5V Rail', x: 90, y: 40 },
        to: { type: 'tie_point', label: '4017 VDD (Pin 16)', x: 190, y: 170 },
      },
      {
        id: 'w-4017-gnd',
        color: 'black',
        from: { type: 'power_rail', rail: 'bottom_minus', label: 'GND Rail', x: 90, y: 355 },
        to: { type: 'tie_point', label: '4017 GND (Pin 8)', x: 330, y: 230 },
      },
      {
        id: 'w-4017-q0',
        color: 'blue',
        from: { type: 'tie_point', label: 'Q0 (Pin 3)', x: 190, y: 230 },
        to: { type: 'tie_point', label: 'LED 0 Anode', x: 408, y: 155 },
      },
      {
        id: 'w-4017-q1',
        color: 'yellow',
        from: { type: 'tie_point', label: 'Q1 (Pin 2)', x: 210, y: 230 },
        to: { type: 'tie_point', label: 'LED 1 Anode', x: 408, y: 225 },
      },
    ],
  },

  // ==========================================
  // 4. D Flip-Flop Toggle Circuit (7474)
  // ==========================================
  {
    id: 'starter-d-flip-flop',
    name: 'D Flip-Flop Toggle Circuit (Divide-by-2)',
    category: 'Sequential Logic',
    difficulty: 'Intermediate',
    tags: ['7474', 'D Flip-Flop', 'Frequency Divider', 'Toggle'],
    whatCanILearn:
      'This circuit configures a 7474 positive-edge-triggered D flip-flop into a T (Toggle) frequency divider. By feeding the inverted output Q̅ (Pin 6) directly back into the D data input (Pin 2), each rising clock pulse causes the state to flip (0 -> 1 -> 0). The resulting output frequency on Q is exactly half the input clock frequency. This is the foundational building block for binary ripple counters and digital clock prescalers.',
    components: [
      {
        id: 'comp-7474',
        type: '7474',
        name: '7474 Dual D Flip-Flop',
        category: 'sequential_ic',
        x: 300,
        y: 200,
        rotation: 0,
        pins: [
          { id: 'pin-1', label: '1CLR', role: 'input', xOffset: -60, yOffset: 30 },
          { id: 'pin-2', label: '1D', role: 'input', xOffset: -40, yOffset: 30 },
          { id: 'pin-3', label: '1CLK', role: 'clock', xOffset: -20, yOffset: 30 },
          { id: 'pin-4', label: '1PRE', role: 'input', xOffset: 0, yOffset: 30 },
          { id: 'pin-5', label: '1Q', role: 'output', xOffset: 20, yOffset: 30 },
          { id: 'pin-6', label: '1Q̅', role: 'output', xOffset: 40, yOffset: 30 },
          { id: 'pin-7', label: 'GND', role: 'gnd', xOffset: 60, yOffset: 30 },
          { id: 'pin-14', label: 'VCC', role: 'vcc', xOffset: -60, yOffset: -30 },
        ],
        properties: { pinCount: 14, q1: false },
      },
      {
        id: 'comp-clock-pb',
        type: 'pushbutton',
        name: 'Clock Pushbutton',
        category: 'switches',
        x: 130,
        y: 210,
        rotation: 0,
        pins: [
          { id: 'p1a', label: '1A', role: 'passive', xOffset: -20, yOffset: -20 },
          { id: 'p2a', label: '2A', role: 'passive', xOffset: -20, yOffset: 20 },
        ],
        properties: { pressed: false },
      },
      {
        id: 'comp-led-q',
        type: 'led',
        name: 'Output Q LED',
        category: 'outputs',
        x: 460,
        y: 200,
        rotation: 0,
        pins: [
          { id: 'anode', label: 'A (+)', role: 'input', xOffset: -12, yOffset: 25 },
          { id: 'cathode', label: 'K (-)', role: 'gnd', xOffset: 12, yOffset: 25 },
        ],
        properties: { color: 'blue' },
      },
    ],
    wires: [
      {
        id: 'w-7474-vcc',
        color: 'red',
        from: { type: 'power_rail', rail: 'top_plus', label: '+5V Rail', x: 90, y: 40 },
        to: { type: 'tie_point', label: '7474 VCC (Pin 14)', x: 240, y: 170 },
      },
      {
        id: 'w-7474-gnd',
        color: 'black',
        from: { type: 'power_rail', rail: 'bottom_minus', label: 'GND Rail', x: 90, y: 355 },
        to: { type: 'tie_point', label: '7474 GND (Pin 7)', x: 360, y: 230 },
      },
      {
        id: 'w-qbar-to-d',
        color: 'purple',
        from: { type: 'tie_point', label: '1Q̅ (Pin 6)', x: 340, y: 230 },
        to: { type: 'tie_point', label: '1D (Pin 2)', x: 260, y: 230 },
      },
      {
        id: 'w-q-to-led',
        color: 'blue',
        from: { type: 'tie_point', label: '1Q (Pin 5)', x: 320, y: 230 },
        to: { type: 'tie_point', label: 'LED Anode', x: 448, y: 225 },
      },
    ],
  },

  // ==========================================
  // 5. 74LS194 Universal Shift Register Demo
  // ==========================================
  {
    id: 'starter-74194-shift-reg',
    name: '74LS194 Universal Shift Register Demo',
    category: 'Sequential Logic',
    difficulty: 'Advanced',
    tags: ['74194', 'Shift Register', 'Parallel Load', 'S0/S1 Modes'],
    whatCanILearn:
      'The 74LS194 is a 4-bit bidirectional universal shift register capable of four distinct operations governed by mode pins S1 and S0: Hold (00), Shift Right (01), Shift Left (10), and Parallel Load (11). In this lab demonstration, a 4-bit nibble can be loaded simultaneously or shifted across adjacent outputs QA through QD. Universal shift registers are the core mechanism behind serial communication interfaces (UART, SPI) and digital arithmetic multipliers.',
    components: [
      {
        id: 'comp-74194',
        type: '74194',
        name: '74LS194 Shift Register',
        category: 'sequential_ic',
        x: 270,
        y: 200,
        rotation: 0,
        pins: [
          { id: 'pin-1', label: 'CLR', role: 'input', xOffset: -70, yOffset: 30 },
          { id: 'pin-8', label: 'GND', role: 'gnd', xOffset: 70, yOffset: 30 },
          { id: 'pin-16', label: 'VCC', role: 'vcc', xOffset: -70, yOffset: -30 },
          { id: 'pin-15', label: 'QA', role: 'output', xOffset: -50, yOffset: -30 },
          { id: 'pin-14', label: 'QB', role: 'output', xOffset: -30, yOffset: -30 },
          { id: 'pin-11', label: 'CLK', role: 'clock', xOffset: 30, yOffset: -30 },
        ],
        properties: { pinCount: 16 },
      },
      {
        id: 'comp-led-qa',
        type: 'led',
        name: 'QA Output LED',
        category: 'outputs',
        x: 440,
        y: 140,
        rotation: 0,
        pins: [
          { id: 'anode', label: 'A (+)', role: 'input', xOffset: -12, yOffset: 25 },
          { id: 'cathode', label: 'K (-)', role: 'gnd', xOffset: 12, yOffset: 25 },
        ],
        properties: { color: 'green' },
      },
    ],
    wires: [
      {
        id: 'w-74194-vcc',
        color: 'red',
        from: { type: 'power_rail', rail: 'top_plus', label: '+5V Rail', x: 90, y: 40 },
        to: { type: 'tie_point', label: '74194 VCC (Pin 16)', x: 200, y: 170 },
      },
      {
        id: 'w-74194-gnd',
        color: 'black',
        from: { type: 'power_rail', rail: 'bottom_minus', label: 'GND Rail', x: 90, y: 355 },
        to: { type: 'tie_point', label: '74194 GND (Pin 8)', x: 340, y: 230 },
      },
      {
        id: 'w-qa-led',
        color: 'green',
        from: { type: 'tie_point', label: 'QA (Pin 15)', x: 220, y: 170 },
        to: { type: 'tie_point', label: 'QA LED Anode', x: 428, y: 165 },
      },
    ],
  },

  // ==========================================
  // 6. 7-Segment Display Counter
  // ==========================================
  {
    id: 'starter-7-segment-counter',
    name: '7-Segment Display Manual Decoder',
    category: 'Displays & Readouts',
    difficulty: 'Intermediate',
    tags: ['7-Segment', 'Common Cathode', 'LED Display', 'BCD'],
    whatCanILearn:
      'A 7-segment display arranges seven bar-shaped LEDs (labeled a through g) in a figure-8 layout to represent decimal digits 0 through 9. In this common-cathode (CC) model, all negative terminals share a common Ground pin, while individual segments light up when driven HIGH (+5V) through current-limiting resistors. Experiment with enabling combinations (e.g. a, b, c for digit "7", or b, c for digit "1") to understand how BCD-to-7-segment decoders (like the 7447/7448) drive numeric instrumentation.',
    components: [
      {
        id: 'comp-7seg',
        type: 'seven_segment',
        name: '7-Segment Display',
        category: 'outputs',
        x: 350,
        y: 190,
        rotation: 0,
        pins: [
          { id: 'pin-a', label: 'a', role: 'input', xOffset: -30, yOffset: -50 },
          { id: 'pin-b', label: 'b', role: 'input', xOffset: -10, yOffset: -50 },
          { id: 'pin-c', label: 'c', role: 'input', xOffset: 10, yOffset: -50 },
          { id: 'pin-d', label: 'd', role: 'input', xOffset: 30, yOffset: -50 },
          { id: 'pin-com', label: 'COM', role: 'gnd', xOffset: -30, yOffset: 50 },
        ],
        properties: {
          activeSegmentStates: { a: true, b: true, c: true, d: false, e: false, f: false, g: false }
        },
      },
      {
        id: 'comp-sw-seg-a',
        type: 'toggle_switch',
        name: 'Segment A Drive',
        category: 'switches',
        x: 150,
        y: 140,
        rotation: 0,
        pins: [{ id: 'out', label: 'OUT', role: 'output', xOffset: 0, yOffset: 25 }],
        properties: { state: true, label: 'Seg A' },
      },
      {
        id: 'comp-sw-seg-b',
        type: 'toggle_switch',
        name: 'Segment B Drive',
        category: 'switches',
        x: 150,
        y: 220,
        rotation: 0,
        pins: [{ id: 'out', label: 'OUT', role: 'output', xOffset: 0, yOffset: 25 }],
        properties: { state: true, label: 'Seg B' },
      },
    ],
    wires: [
      {
        id: 'w-seg-com',
        color: 'black',
        from: { type: 'tie_point', label: 'Display COM', x: 320, y: 240 },
        to: { type: 'power_rail', rail: 'bottom_minus', label: 'GND Rail', x: 260, y: 355 },
      },
      {
        id: 'w-seg-a',
        color: 'blue',
        from: { type: 'switch_input', label: 'Seg A Out', x: 150, y: 165 },
        to: { type: 'tie_point', label: 'Segment a In', x: 320, y: 140 },
      },
      {
        id: 'w-seg-b',
        color: 'blue',
        from: { type: 'switch_input', label: 'Seg B Out', x: 150, y: 245 },
        to: { type: 'tie_point', label: 'Segment b In', x: 340, y: 140 },
      },
    ],
  },

  // ==========================================
  // MICROCONTROLLER STARTER PROJECT 1: BLINK
  // ==========================================
  {
    id: 'mcu-blink',
    name: 'Arduino Blink (Builtin & External LED)',
    category: 'Microcontrollers',
    difficulty: 'Beginner',
    tags: ['Arduino', 'Blink', 'GPIO', 'D13', 'LED'],
    whatCanILearn:
      'Understand basic digital output interfacing by flashing both the onboard Pin 13 "L" LED and an external red LED through a 330Ω protective resistor with timed 1-second delay intervals.',
    sketchCode: `// Project 1: Arduino Blink
const int ledPin = 13;

void setup() {
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
  Serial.println("System Initialized: Blink Active");
}

void loop() {
  digitalWrite(ledPin, HIGH);
  Serial.println("LED ON");
  delay(1000);
  digitalWrite(ledPin, LOW);
  Serial.println("LED OFF");
  delay(1000);
}`,
    components: [
      {
        id: 'comp-mcu-uno',
        type: 'arduino_uno',
        name: 'Arduino Uno R3',
        category: 'microcontrollers',
        x: 220,
        y: 240,
        rotation: 0,
        pins: [
          { id: 'pin-d13', label: 'D13', role: 'output', xOffset: -110, yOffset: -65 },
          { id: 'pin-gnd3', label: 'GND', role: 'gnd', xOffset: -125, yOffset: -65 },
          { id: 'pin-5v', label: '5V', role: 'vcc', xOffset: -75, yOffset: 65 },
        ],
        properties: { pin13LedState: true },
      },
      {
        id: 'comp-blink-res',
        type: 'resistor',
        name: '330Ω Resistor',
        category: 'passives',
        x: 480,
        y: 190,
        rotation: 0,
        pins: [
          { id: 'pin-1', label: '1', role: 'passive', xOffset: -35, yOffset: 0 },
          { id: 'pin-2', label: '2', role: 'passive', xOffset: 35, yOffset: 0 },
        ],
        properties: { resistance: 330 },
      },
      {
        id: 'comp-blink-led',
        type: 'led',
        name: 'Red LED',
        category: 'outputs',
        x: 580,
        y: 190,
        rotation: 0,
        pins: [
          { id: 'anode', label: 'A (+)', role: 'input', xOffset: -12, yOffset: 25 },
          { id: 'cathode', label: 'K (-)', role: 'gnd', xOffset: 12, yOffset: 25 },
        ],
        properties: { color: 'red' },
      },
    ],
    wires: [
      {
        id: 'w-mcu-d13',
        color: 'yellow',
        from: { type: 'tie_point', label: 'Uno D13', x: 110, y: 175 },
        to: { type: 'tie_point', label: 'Resistor In', x: 445, y: 190 },
      },
      {
        id: 'w-mcu-res-led',
        color: 'red',
        from: { type: 'tie_point', label: 'Resistor Out', x: 515, y: 190 },
        to: { type: 'led_output', label: 'LED Anode', x: 568, y: 215 },
      },
      {
        id: 'w-mcu-led-gnd',
        color: 'black',
        from: { type: 'led_output', label: 'LED Cathode', x: 592, y: 215 },
        to: { type: 'power_rail', rail: 'top_minus', label: 'GND Rail', x: 95, y: 175 },
      },
    ],
  },

  // ==========================================
  // MICROCONTROLLER STARTER PROJECT 2: TRAFFIC LIGHT
  // ==========================================
  {
    id: 'mcu-traffic',
    name: 'Smart Traffic Light Controller',
    category: 'Microcontrollers',
    difficulty: 'Beginner',
    tags: ['Arduino', 'Traffic Light', 'State Machine', 'LEDs'],
    whatCanILearn:
      'Implements a 3-phase automated traffic light sequence (Red: Stop, Yellow: Caution, Green: Go) using digital pins D8, D9, and D10.',
    sketchCode: `// Project 2: Traffic Light Sequence
const int redPin = 10;
const int yellowPin = 9;
const int greenPin = 8;

void setup() {
  pinMode(redPin, OUTPUT);
  pinMode(yellowPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  // RED Phase
  digitalWrite(redPin, HIGH);
  digitalWrite(yellowPin, LOW);
  digitalWrite(greenPin, LOW);
  Serial.println("State: RED (Stop)");
  delay(3000);

  // GREEN Phase
  digitalWrite(redPin, LOW);
  digitalWrite(greenPin, HIGH);
  Serial.println("State: GREEN (Go)");
  delay(3000);

  // YELLOW Phase
  digitalWrite(greenPin, LOW);
  digitalWrite(yellowPin, HIGH);
  Serial.println("State: YELLOW (Caution)");
  delay(1000);
}`,
    components: [
      {
        id: 'comp-mcu-uno',
        type: 'arduino_uno',
        name: 'Arduino Uno R3',
        category: 'microcontrollers',
        x: 220,
        y: 240,
        rotation: 0,
        pins: [
          { id: 'pin-d8', label: 'D8', role: 'output', xOffset: -35, yOffset: -65 },
          { id: 'pin-d9', label: 'D9', role: 'output', xOffset: -50, yOffset: -65 },
          { id: 'pin-d10', label: 'D10', role: 'output', xOffset: -65, yOffset: -65 },
          { id: 'pin-gnd3', label: 'GND', role: 'gnd', xOffset: -125, yOffset: -65 },
        ],
        properties: {},
      },
      { id: 'led-red', type: 'led', name: 'Red Stop', category: 'outputs', x: 500, y: 160, rotation: 0, pins: [{ id: 'anode', label: 'A', role: 'input', xOffset: -12, yOffset: 25 }, { id: 'cathode', label: 'K', role: 'gnd', xOffset: 12, yOffset: 25 }], properties: { color: 'red' } },
      { id: 'led-yellow', type: 'led', name: 'Yellow Caution', category: 'outputs', x: 500, y: 240, rotation: 0, pins: [{ id: 'anode', label: 'A', role: 'input', xOffset: -12, yOffset: 25 }, { id: 'cathode', label: 'K', role: 'gnd', xOffset: 12, yOffset: 25 }], properties: { color: 'yellow' } },
      { id: 'led-green', type: 'led', name: 'Green Go', category: 'outputs', x: 500, y: 320, rotation: 0, pins: [{ id: 'anode', label: 'A', role: 'input', xOffset: -12, yOffset: 25 }, { id: 'cathode', label: 'K', role: 'gnd', xOffset: 12, yOffset: 25 }], properties: { color: 'green' } },
    ],
    wires: [
      { id: 'w-red', color: 'red', from: { type: 'tie_point', label: 'D10', x: 155, y: 175 }, to: { type: 'led_output', label: 'Red Anode', x: 488, y: 185 } },
      { id: 'w-yellow', color: 'yellow', from: { type: 'tie_point', label: 'D9', x: 170, y: 175 }, to: { type: 'led_output', label: 'Yellow Anode', x: 488, y: 265 } },
      { id: 'w-green', color: 'green', from: { type: 'tie_point', label: 'D8', x: 185, y: 175 }, to: { type: 'led_output', label: 'Green Anode', x: 488, y: 345 } },
    ],
  },

  // ==========================================
  // MICROCONTROLLER STARTER PROJECT 3: BUTTON TOGGLE
  // ==========================================
  {
    id: 'mcu-toggle',
    name: 'Pushbutton State Toggle with Debounce',
    category: 'Microcontrollers',
    difficulty: 'Intermediate',
    tags: ['Arduino', 'Button', 'Debounce', 'Toggle'],
    whatCanILearn:
      'Reads an external momentary tactile switch on Pin D2 using INPUT_PULLUP and software edge detection to toggle an output LED on Pin D13 on each press.',
    sketchCode: `// Project 3: Button Toggle
const int buttonPin = 2;
const int ledPin = 13;

int ledState = LOW;
int lastButtonState = HIGH;

void setup() {
  pinMode(buttonPin, INPUT_PULLUP);
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int currentButtonState = digitalRead(buttonPin);

  // Transition from HIGH to LOW (button pressed)
  if (lastButtonState == HIGH && currentButtonState == LOW) {
    ledState = !ledState;
    digitalWrite(ledPin, ledState);
    Serial.println(ledState ? "Output: TOGGLED ON" : "Output: TOGGLED OFF");
    delay(50); // Debounce delay
  }

  lastButtonState = currentButtonState;
}`,
    components: [
      {
        id: 'comp-mcu-uno',
        type: 'arduino_uno',
        name: 'Arduino Uno R3',
        category: 'microcontrollers',
        x: 220,
        y: 240,
        rotation: 0,
        pins: [
          { id: 'pin-d2', label: 'D2', role: 'input', xOffset: 60, yOffset: -65 },
          { id: 'pin-d13', label: 'D13', role: 'output', xOffset: -110, yOffset: -65 },
          { id: 'pin-gnd1', label: 'GND', role: 'gnd', xOffset: -45, yOffset: 65 },
        ],
        properties: {},
      },
      {
        id: 'comp-btn',
        type: 'pushbutton',
        name: 'Tactile Button',
        category: 'switches',
        x: 460,
        y: 200,
        rotation: 0,
        pins: [{ id: 'pin-out', label: 'OUT', role: 'output', xOffset: 0, yOffset: 20 }],
        properties: { pressed: false },
      },
    ],
    wires: [
      { id: 'w-btn', color: 'blue', from: { type: 'tie_point', label: 'Uno D2', x: 280, y: 175 }, to: { type: 'switch_input', label: 'Button In', x: 460, y: 220 } },
    ],
  },

  // ==========================================
  // MICROCONTROLLER STARTER PROJECT 4: PWM DIMMER
  // ==========================================
  {
    id: 'mcu-dimmer',
    name: 'Potentiometer LED Dimmer (PWM)',
    category: 'Microcontrollers',
    difficulty: 'Intermediate',
    tags: ['Arduino', 'PWM', 'analogRead', 'analogWrite', 'Potentiometer'],
    whatCanILearn:
      'Reads an analog voltage (0–5V) from a 10k potentiometer on pin A0 and maps the 10-bit ADC reading (0–1023) to 8-bit PWM duty cycle (0–255) on pin D9.',
    sketchCode: `// Project 4: Potentiometer PWM Dimmer
const int potPin = A0;
const int ledPin = 9;

void setup() {
  pinMode(ledPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int sensorValue = analogRead(potPin);
  int brightness = sensorValue / 4; // Map 0-1023 to 0-255

  analogWrite(ledPin, brightness);
  Serial.print("Sensor: ");
  Serial.print(sensorValue);
  Serial.print(" | PWM Duty: ");
  Serial.println(brightness);
  delay(100);
}`,
    components: [
      {
        id: 'comp-mcu-uno',
        type: 'arduino_uno',
        name: 'Arduino Uno R3',
        category: 'microcontrollers',
        x: 220,
        y: 240,
        rotation: 0,
        pins: [
          { id: 'pin-a0', label: 'A0', role: 'input', xOffset: 15, yOffset: 65 },
          { id: 'pin-d9', label: 'D9', role: 'output', xOffset: -50, yOffset: -65 },
          { id: 'pin-5v', label: '5V', role: 'vcc', xOffset: -75, yOffset: 65 },
          { id: 'pin-gnd1', label: 'GND', role: 'gnd', xOffset: -45, yOffset: 65 },
        ],
        properties: {},
      },
      {
        id: 'comp-pot',
        type: 'potentiometer',
        name: '10kΩ Potentiometer',
        category: 'passives',
        x: 480,
        y: 310,
        rotation: 0,
        pins: [
          { id: 'term-1', label: '1', role: 'passive', xOffset: -25, yOffset: 25 },
          { id: 'wiper', label: 'W', role: 'output', xOffset: 0, yOffset: 25 },
          { id: 'term-2', label: '2', role: 'passive', xOffset: 25, yOffset: 25 },
        ],
        properties: { resistance: 10000, value: 65 },
      },
    ],
    wires: [
      { id: 'w-wiper', color: 'green', from: { type: 'tie_point', label: 'Uno A0', x: 235, y: 305 }, to: { type: 'tie_point', label: 'Pot Wiper', x: 480, y: 335 } },
    ],
  },

  // ==========================================
  // MICROCONTROLLER STARTER PROJECT 5: 7-SEGMENT COUNTER
  // ==========================================
  {
    id: 'mcu-7segment',
    name: '7-Segment 0–9 Decimal Counter',
    category: 'Microcontrollers',
    difficulty: 'Advanced',
    tags: ['Arduino', '7-Segment', 'Display', 'Array'],
    whatCanILearn:
      'Drives common-cathode 7-segment display segments (a through g) from digital pins D2 through D8 to count sequentially from digit 0 through 9.',
    sketchCode: `// Project 5: 7-Segment 0-9 Decimal Counter
const int segPins[7] = {2, 3, 4, 5, 6, 7, 8}; // a, b, c, d, e, f, g

// Segment bitmaps for digits 0 through 9
const byte digits[10] = {
  0b00111111, // 0
  0b00000110, // 1
  0b01011011, // 2
  0b01001111, // 3
  0b01100110, // 4
  0b01101101, // 5
  0b01111101, // 6
  0b00000111, // 7
  0b01111111, // 8
  0b01101111  // 9
};

void setup() {
  for (int i = 0; i < 7; i++) {
    pinMode(segPins[i], OUTPUT);
  }
  Serial.begin(9600);
}

void loop() {
  for (int count = 0; count <= 9; count++) {
    Serial.print("Display Digit: ");
    Serial.println(count);

    byte mask = digits[count];
    for (int s = 0; s < 7; s++) {
      digitalWrite(segPins[s], (mask >> s) & 1);
    }
    delay(1000);
  }
}`,
    components: [
      {
        id: 'comp-mcu-uno',
        type: 'arduino_uno',
        name: 'Arduino Uno R3',
        category: 'microcontrollers',
        x: 200,
        y: 240,
        rotation: 0,
        pins: [
          { id: 'pin-d2', label: 'D2', role: 'output', xOffset: 60, yOffset: -65 },
          { id: 'pin-d3', label: 'D3', role: 'output', xOffset: 45, yOffset: -65 },
          { id: 'pin-d4', label: 'D4', role: 'output', xOffset: 30, yOffset: -65 },
          { id: 'pin-d5', label: 'D5', role: 'output', xOffset: 15, yOffset: -65 },
          { id: 'pin-d6', label: 'D6', role: 'output', xOffset: 0, yOffset: -65 },
          { id: 'pin-d7', label: 'D7', role: 'output', xOffset: -15, yOffset: -65 },
          { id: 'pin-d8', label: 'D8', role: 'output', xOffset: -35, yOffset: -65 },
          { id: 'pin-gnd1', label: 'GND', role: 'gnd', xOffset: -45, yOffset: 65 },
        ],
        properties: {},
      },
      {
        id: 'comp-seg',
        type: 'seven_segment',
        name: '7-Segment Display',
        category: 'outputs',
        x: 480,
        y: 240,
        rotation: 0,
        pins: [
          { id: 'pin-a', label: 'a', role: 'input', xOffset: -15, yOffset: -40 },
          { id: 'pin-b', label: 'b', role: 'input', xOffset: 0, yOffset: -40 },
          { id: 'pin-c', label: 'c', role: 'input', xOffset: 15, yOffset: -40 },
          { id: 'pin-com', label: 'COM', role: 'gnd', xOffset: 0, yOffset: 40 },
        ],
        properties: {},
      },
    ],
    wires: [
      { id: 'w-com', color: 'black', from: { type: 'tie_point', label: 'Uno GND', x: 155, y: 305 }, to: { type: 'tie_point', label: 'COM GND', x: 480, y: 280 } },
    ],
  },

  // ==========================================
  // MICROCONTROLLER STARTER PROJECT 6: ULTRASONIC & LDR
  // ==========================================
  {
    id: 'mcu-ultrasonic',
    name: 'Ultrasonic Distance & LDR Light Reader',
    category: 'Microcontrollers',
    difficulty: 'Intermediate',
    tags: ['Arduino', 'Sensor', 'HC-SR04', 'LDR'],
    whatCanILearn:
      'Reads ambient illuminance from an LDR on analog pin A1 and triggers ultrasonic range sensing pulses on digital pins D11 (TRIG) and D12 (ECHO).',
    sketchCode: `// Project 6: Ultrasonic & Light Sensor
const int trigPin = 11;
const int echoPin = 12;
const int ldrPin = A1;

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  Serial.begin(9600);
}

void loop() {
  // Read Light Level
  int lightLevel = analogRead(ldrPin);

  // Trigger Sonar Pulse
  digitalWrite(trigPin, LOW);
  delay(2);
  digitalWrite(trigPin, HIGH);
  delay(10);
  digitalWrite(trigPin, LOW);

  Serial.print("Ambient Light: ");
  Serial.print(lightLevel);
  Serial.println(" lux | Range Scan OK");
  delay(1000);
}`,
    components: [
      {
        id: 'comp-mcu-uno',
        type: 'arduino_uno',
        name: 'Arduino Uno R3',
        category: 'microcontrollers',
        x: 200,
        y: 240,
        rotation: 0,
        pins: [
          { id: 'pin-a1', label: 'A1', role: 'input', xOffset: 30, yOffset: 65 },
          { id: 'pin-d11', label: 'D11', role: 'output', xOffset: -80, yOffset: -65 },
          { id: 'pin-d12', label: 'D12', role: 'input', xOffset: -95, yOffset: -65 },
        ],
        properties: {},
      },
      {
        id: 'comp-sonar',
        type: 'ultrasonic_sensor',
        name: 'HC-SR04 Sonar',
        category: 'sensors',
        x: 480,
        y: 190,
        rotation: 0,
        pins: [
          { id: 'pin-vcc', label: 'VCC', role: 'vcc', xOffset: -25, yOffset: 18 },
          { id: 'pin-trig', label: 'TRIG', role: 'input', xOffset: -8, yOffset: 18 },
          { id: 'pin-echo', label: 'ECHO', role: 'output', xOffset: 8, yOffset: 18 },
          { id: 'pin-gnd', label: 'GND', role: 'gnd', xOffset: 25, yOffset: 18 },
        ],
        properties: {},
      },
    ],
    wires: [
      { id: 'w-trig', color: 'yellow', from: { type: 'tie_point', label: 'Uno D11', x: 120, y: 175 }, to: { type: 'tie_point', label: 'TRIG', x: 472, y: 208 } },
      { id: 'w-echo', color: 'blue', from: { type: 'tie_point', label: 'Uno D12', x: 105, y: 175 }, to: { type: 'tie_point', label: 'ECHO', x: 488, y: 208 } },
    ],
  },

  // ==========================================
  // MICROCONTROLLER STARTER PROJECT 7: LOGIC EMULATOR
  // ==========================================
  {
    id: 'mcu-logic-emulator',
    name: 'Programmable Multi-Gate Logic Emulator',
    category: 'Microcontrollers',
    difficulty: 'Advanced',
    tags: ['Arduino', 'Logic Gate', 'Boolean', 'AND', 'OR', 'XOR'],
    whatCanILearn:
      'Emulates hardware logic gates purely in C++ firmware! Reads two switch inputs on pins D2 and D3, computes AND, OR, and XOR, and drives output LEDs on pins D8, D9, and D10.',
    sketchCode: `// Project 7: Digital Logic Emulator
const int inA = 2;
const int inB = 3;
const int outAND = 8;
const int outOR = 9;
const int outXOR = 10;

void setup() {
  pinMode(inA, INPUT);
  pinMode(inB, INPUT);
  pinMode(outAND, OUTPUT);
  pinMode(outOR, OUTPUT);
  pinMode(outXOR, OUTPUT);
  Serial.begin(9600);
  Serial.println("Virtual Logic Gate Co-Processor Online");
}

void loop() {
  int a = digitalRead(inA);
  int b = digitalRead(inB);

  int andVal = a & b;
  int orVal = a | b;
  int xorVal = a ^ b;

  digitalWrite(outAND, andVal);
  digitalWrite(outOR, orVal);
  digitalWrite(outXOR, xorVal);

  Serial.print("Inputs: [A=");
  Serial.print(a);
  Serial.print(", B=");
  Serial.print(b);
  Serial.print("] -> AND=");
  Serial.print(andVal);
  Serial.print(" OR=");
  Serial.print(orVal);
  Serial.print(" XOR=");
  Serial.println(xorVal);

  delay(200);
}`,
    components: [
      {
        id: 'comp-mcu-uno',
        type: 'arduino_uno',
        name: 'Arduino Uno R3',
        category: 'microcontrollers',
        x: 220,
        y: 240,
        rotation: 0,
        pins: [
          { id: 'pin-d2', label: 'D2', role: 'input', xOffset: 60, yOffset: -65 },
          { id: 'pin-d3', label: 'D3', role: 'input', xOffset: 45, yOffset: -65 },
          { id: 'pin-d8', label: 'D8', role: 'output', xOffset: -35, yOffset: -65 },
          { id: 'pin-d9', label: 'D9', role: 'output', xOffset: -50, yOffset: -65 },
          { id: 'pin-d10', label: 'D10', role: 'output', xOffset: -65, yOffset: -65 },
        ],
        properties: {},
      },
    ],
    wires: [],
  },
];
