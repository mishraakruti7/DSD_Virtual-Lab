import { ProgramOutcome, ProgramSpecificOutcome, MatrixRow } from '../types/course';

export const PROGRAM_OUTCOMES: ProgramOutcome[] = [
  { id: 'PO1', title: 'Engineering Knowledge', description: 'Apply knowledge of mathematics, science, and engineering fundamentals to complex engineering problems.' },
  { id: 'PO2', title: 'Problem Analysis', description: 'Identify, formulate, review research literature, and analyze complex engineering problems reaching substantiated conclusions.' },
  { id: 'PO3', title: 'Design/Development of Solutions', description: 'Design solutions for complex engineering problems and design system components or processes that meet specified needs.' },
  { id: 'PO4', title: 'Conduct Investigations of Complex Problems', description: 'Use research-based knowledge and methods including design of experiments, analysis and interpretation of data.' },
  { id: 'PO5', title: 'Modern Tool Usage', description: 'Create, select, and apply appropriate techniques, resources, and modern engineering and IT tools including simulation software (EDA/Verilog).' },
  { id: 'PO6', title: 'The Engineer and Society', description: 'Apply reasoning informed by contextual knowledge to assess societal, health, safety, legal and cultural issues.' },
  { id: 'PO7', title: 'Environment and Sustainability', description: 'Understand the impact of professional engineering solutions in societal and environmental contexts.' },
  { id: 'PO8', title: 'Ethics', description: 'Apply ethical principles and commit to professional ethics and responsibilities and norms of engineering practice.' },
  { id: 'PO9', title: 'Individual and Team Work', description: 'Function effectively as an individual, and as a member or leader in diverse teams and multidisciplinary settings.' },
  { id: 'PO10', title: 'Communication', description: 'Communicate effectively on complex engineering activities with the engineering community and society at large.' },
  { id: 'PO11', title: 'Project Management and Finance', description: 'Demonstrate knowledge and understanding of engineering and management principles to manage projects.' },
  { id: 'PO12', title: 'Life-long Learning', description: 'Recognize the need for, and have the preparation and ability to engage in independent and life-long learning in technological change.' },
];

export const PROGRAM_SPECIFIC_OUTCOMES: ProgramSpecificOutcome[] = [
  {
    id: 'PSO1',
    title: 'Hardware-Software Co-Design',
    description: 'Design and synthesize digital hardware systems and embedded architectures using modern HDLs and programmable logic devices.',
  },
  {
    id: 'PSO2',
    title: 'VLSI & Computing Systems',
    description: 'Analyze, troubleshoot, and optimize digital integrated circuits and computer organization hardware for efficiency and fault resilience.',
  },
];

export const ARTICULATION_MATRIX: MatrixRow[] = [
  {
    coId: 'CO1',
    poScores: { PO1: 3, PO2: 3, PO3: 3, PO4: 2, PO5: 2, PO6: 0, PO7: 0, PO8: 1, PO9: 2, PO10: 1, PO11: 0, PO12: 2 },
    psoScores: { PSO1: 3, PSO2: 3 },
    justification: 'In-depth analysis of flip-flops, registers, and counters directly maps to engineering fundamentals (PO1), problem analysis (PO2), and hardware synthesis (PO3/PSO1/PSO2).',
  },
  {
    coId: 'CO2',
    poScores: { PO1: 3, PO2: 2, PO3: 2, PO4: 1, PO5: 1, PO6: 0, PO7: 1, PO8: 0, PO9: 1, PO10: 1, PO11: 0, PO12: 2 },
    psoScores: { PSO1: 2, PSO2: 3 },
    justification: 'Logic family characteristics (speed-power product, fan-out, noise margin) emphasize physical electronic boundaries and chip-level interfacing requirements.',
  },
  {
    coId: 'CO3',
    poScores: { PO1: 3, PO2: 3, PO3: 3, PO4: 2, PO5: 2, PO6: 1, PO7: 0, PO8: 1, PO9: 2, PO10: 1, PO11: 1, PO12: 2 },
    psoScores: { PSO1: 3, PSO2: 2 },
    justification: 'FSM and ASM chart design requires methodical algorithmic thinking, state reduction, and hardware state machine control unit synthesis.',
  },
  {
    coId: 'CO4',
    poScores: { PO1: 2, PO2: 2, PO3: 3, PO4: 1, PO5: 3, PO6: 0, PO7: 0, PO8: 0, PO9: 1, PO10: 1, PO11: 1, PO12: 2 },
    psoScores: { PSO1: 3, PSO2: 2 },
    justification: 'Configuring PLAs, PALs, and exploring FPGA architectures links digital design with reconfigurable computing hardware technologies.',
  },
  {
    coId: 'CO5',
    poScores: { PO1: 3, PO2: 3, PO3: 3, PO4: 2, PO5: 3, PO6: 0, PO7: 0, PO8: 1, PO9: 2, PO10: 2, PO11: 1, PO12: 3 },
    psoScores: { PSO1: 3, PSO2: 3 },
    justification: 'Verilog HDL simulation and synthesis provides high-level hardware modeling experience using industry-standard EDA tools and testbench verification.',
  },
  {
    coId: 'CO6',
    poScores: { PO1: 3, PO2: 3, PO3: 2, PO4: 3, PO5: 2, PO6: 1, PO7: 0, PO8: 1, PO9: 1, PO10: 1, PO11: 0, PO12: 2 },
    psoScores: { PSO1: 2, PSO2: 3 },
    justification: 'Fault modeling and path sensitization instill rigorous testing and quality assurance paradigms essential for safety-critical digital integrated circuits.',
  },
];
