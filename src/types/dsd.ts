export type GateType = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR';

export interface GateInfo {
  id: GateType;
  name: string;
  expression: string;
  icCode: string;
  description: string;
  academicNote: string;
  inputs: number;
  truthTable: {
    a: number;
    b?: number;
    y: number;
  }[];
}

export interface MsiChipInfo {
  icNumber: string;
  name: string;
  type: 'Counter' | 'Shift Register';
  syncType: 'Asynchronous' | 'Synchronous';
  pins: { pin: number; name: string; desc: string; type: 'input' | 'output' | 'power' | 'clock' | 'control' }[];
  description: string;
  keyFeatures: string[];
  truthTableSummary?: { [key: string]: string }[];
  coMapping: string;
}

export interface CourseOutcome {
  code: string;
  statement: string;
  bloomLevel: 'BL1' | 'BL2' | 'BL3' | 'BL4';
  hours: number;
  theoryModule: number;
  labExperiments: number[];
  color: string;
}

export interface Experiment {
  id: number;
  title: string;
  shortTitle: string;
  courseOutcome: string;
  bloomLevel: 'BL2' | 'BL3' | 'BL4';
  objective: string;
  apparatus: string[];
  theory: string;
  circuitSummary: string;
  procedure: string[];
  observationHeaders: string[];
  vivaQuestions: { question: string; answer: string }[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  co: 'CO1' | 'CO2' | 'CO3' | 'CO4' | 'CO5';
  bloomLevel: 'BL1' | 'BL2' | 'BL3' | 'BL4';
  explanation: string;
}

export interface ChallengeBench {
  id: number;
  title: string;
  co: string;
  scenario: string;
  objective: string;
  initialState: any;
  hint: string;
}

export interface BreadboardWire {
  id: string;
  color: string;
  from: { x: number; y: number; label: string };
  to: { x: number; y: number; label: string };
}
