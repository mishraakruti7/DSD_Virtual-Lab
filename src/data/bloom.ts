import { BloomDistribution } from '../types/course';

export const BLOOM_LEVELS_INFO = [
  { level: 'BL1', name: 'Remember', verb: 'Define, State, List, Recall', color: '#64748b', desc: 'Recalling digital logic definitions, pin numbers, and circuit symbols.' },
  { level: 'BL2', name: 'Understand', verb: 'Explain, Compare, Illustrate', color: '#0ea5e9', desc: 'Explaining operation of flip-flops, race-around conditions, and logic parameters.' },
  { level: 'BL3', name: 'Apply', verb: 'Calculate, Construct, Implement', color: '#10b981', desc: 'Constructing counters, registers, and synthesizable Verilog modules.' },
  { level: 'BL4', name: 'Analyze', verb: 'Examine, Differentiate, Test', color: '#8b5cf6', desc: 'Analyzing state graphs, diagnosing timing hazards, and detecting stuck-at faults.' },
  { level: 'BL5', name: 'Evaluate', verb: 'Compare, Justify, Assess', color: '#f59e0b', desc: 'Evaluating speed-power trade-offs between TTL, ECL, and CMOS logic families.' },
  { level: 'BL6', name: 'Create', verb: 'Design, Synthesize, Formulate', color: '#ec4899', desc: 'Designing complete FSM controller units and complex ASM hardware systems.' },
];

export const BLOOM_SPECIFICATION_TABLE: BloomDistribution[] = [
  {
    module: 'M1: Sequential Logic Design',
    rememberWeight: 4,
    understandWeight: 8,
    applyWeight: 10,
    analyzeWeight: 8,
    totalMarks: 30,
  },
  {
    module: 'M2: Digital Logic Families',
    rememberWeight: 4,
    understandWeight: 6,
    applyWeight: 6,
    analyzeWeight: 4,
    totalMarks: 20,
  },
  {
    module: 'M3: FSM & Programmable Logic',
    rememberWeight: 2,
    understandWeight: 6,
    applyWeight: 10,
    analyzeWeight: 7,
    totalMarks: 25,
  },
  {
    module: 'M4: Verilog HDL & Testing',
    rememberWeight: 2,
    understandWeight: 6,
    applyWeight: 10,
    analyzeWeight: 7,
    totalMarks: 25,
  },
];
