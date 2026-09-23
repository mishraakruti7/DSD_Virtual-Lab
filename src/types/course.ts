export type BloomLevel = 'BL1: Remember' | 'BL2: Understand' | 'BL3: Apply' | 'BL4: Analyze' | 'BL5: Evaluate' | 'BL6: Create';

export interface CourseOutcomeDef {
  id: string; // e.g., 'CO1'
  title: string;
  statement: string;
  bloomLevel: BloomLevel;
  theoryHours: number;
  theoryModule: number;
  labExperiments: number[];
  color: string;
  weightagePercent: number;
}

export interface ProgramOutcome {
  id: string; // 'PO1' to 'PO12'
  title: string;
  description: string;
}

export interface ProgramSpecificOutcome {
  id: string; // 'PSO1', 'PSO2'
  title: string;
  description: string;
}

export interface MatrixRow {
  coId: string;
  poScores: { [poId: string]: 0 | 1 | 2 | 3 };
  psoScores: { [psoId: string]: 0 | 1 | 2 | 3 };
  justification: string;
}

export interface BloomDistribution {
  module: string;
  rememberWeight: number;   // Marks or %
  understandWeight: number;
  applyWeight: number;
  analyzeWeight: number;
  totalMarks: number;
}

export interface ModuleSection {
  subtopicId: string;
  title: string;
  hours: number;
  summary: string;
  keyFormulasAndConcepts: string[];
  schematicId?: string;
  examTips?: string[];
}

export interface TheoryModuleDef {
  id: number;
  code: string;
  title: string;
  hours: number;
  weightageMarks: number;
  description: string;
  coTarget: string;
  sections: ModuleSection[];
  textbookRef: string;
  sampleQuestions: {
    marks: 5 | 10;
    question: string;
    bloom: string;
    solutionOutline: string;
  }[];
}

export interface LabExperimentDef {
  id: number;
  title: string;
  shortTitle: string;
  co: string;
  bloom: string;
  hours: number;
  category: 'Hardware TTL' | 'Verilog HDL' | 'System Design';
  objective: string;
  apparatus: string[];
  pinoutDiagramId?: string;
  theory: string;
  circuitSummary: string;
  procedure: string[];
  truthTableOrObservations: {
    headers: string[];
    rows: (string | number)[][];
  };
  vivaQuestions: {
    question: string;
    answer: string;
    tip?: string;
  }[];
  breadboardPresetId?: string;
  simulatorId?: string;
}

export interface MiniProjectDef {
  id: number;
  title: string;
  category: 'Security' | 'Industrial Automation' | 'Gaming & Entertainment' | 'Measurement' | 'Digital Computing';
  targetCO: string;
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  abstract: string;
  specifications: string[];
  requiredICs: string[];
  schematicConcept: string;
  testingSteps: string[];
  rubric: {
    criterion: string;
    weight: number;
    description: string;
  }[];
}

export interface ReferenceBook {
  id: number;
  title: string;
  authors: string;
  publisher: string;
  edition: string;
  category: 'Textbook' | 'Reference' | 'Laboratory Manual';
  relevantModules: number[];
  notes: string;
}

export interface WebResource {
  id: number;
  title: string;
  provider: 'NPTEL' | 'Virtual Labs (IITB)' | 'AllAboutCircuits' | 'IEEE Xplore';
  url: string;
  description: string;
  relevantModules: number[];
}

export interface GlossaryTerm {
  id: string;
  term: string;
  acronym?: string;
  category: 'Sequential' | 'Logic Families' | 'FSM & PLD' | 'Verilog & Testing' | 'General';
  definition: string;
  formulaOrExample?: string;
  relatedTerms: string[];
  moduleRef: number;
}
