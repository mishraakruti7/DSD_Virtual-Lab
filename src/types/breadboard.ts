export type LogicLevel = '0' | '1' | 'Z' | 'X';

export interface BreadboardPinCoord {
  type: 'tie_point' | 'power_rail' | 'switch_input' | 'led_output' | 'clock_generator';
  // Terminal strip: row: 'A'|'B'|'C'|'D'|'E' | 'F'|'G'|'H'|'I'|'J', col: 1..30 (or 1..60)
  row?: string;
  col?: number;
  // Power rail: rail: 'top_plus' | 'top_minus' | 'bottom_plus' | 'bottom_minus', index: 1..25
  rail?: 'top_plus' | 'top_minus' | 'bottom_plus' | 'bottom_minus';
  pinIndex?: number;
  label: string;
  x: number; // SVG pixel coordinate
  y: number; // SVG pixel coordinate
}

export type WireColor =
  | 'red'
  | 'black'
  | 'blue'
  | 'green'
  | 'yellow'
  | 'orange'
  | 'purple'
  | 'white';

export interface BreadboardWire {
  id: string;
  color: WireColor;
  from: BreadboardPinCoord;
  to: BreadboardPinCoord;
}

export type DIPPackageType = 'DIP14' | 'DIP16';

export interface PlacedIC {
  id: string;
  icCode: string; // e.g. '7408', '7432', '7404', '7400', '7486', '7474', '7476', '7490', '7493', '74163', '74194'
  name: string;
  packageType: DIPPackageType;
  startCol: number; // Breadboard column where pin 1 begins (spanning trough)
}

export interface CircuitDiagnostic {
  status: 'optimal' | 'warning' | 'error' | 'floating';
  headline: string;
  details: string[];
  vccConnected: boolean;
  gndConnected: boolean;
  shortCircuitDetected: boolean;
  activeOutputsCount: number;
}

export interface ExperimentTestbench {
  presetId: string;
  experimentNum: number;
  title: string;
  expectedOutputs: {
    inputs: { [switchName: string]: LogicLevel };
    expectedLEDs: { [ledName: string]: LogicLevel };
  }[];
  passMessage: string;
  hintOnFail: string;
}

export interface ProbeReading {
  targetLabel: string;
  logic: LogicLevel;
  voltage: number; // e.g. 5.0, 0.0, 1.4 (floating TTL)
  frequencyHz?: number;
  netId?: number;
}
