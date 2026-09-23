import { GateInfo } from '../types/dsd';

export const GATES_DATA: GateInfo[] = [
  {
    id: 'AND',
    name: 'AND Gate (Conjunction)',
    expression: 'Y = A · B',
    icCode: 'IC 7408 (Quad 2-Input AND)',
    description: 'Output is HIGH (1) only when all inputs are HIGH (1). Used for enabling and qualifying logic signals.',
    academicNote: 'Dual transistor series switch topology: both switches must close to allow current flow to pull output HIGH.',
    inputs: 2,
    truthTable: [
      { a: 0, b: 0, y: 0 },
      { a: 0, b: 1, y: 0 },
      { a: 1, b: 0, y: 0 },
      { a: 1, b: 1, y: 1 },
    ]
  },
  {
    id: 'OR',
    name: 'OR Gate (Disjunction)',
    expression: 'Y = A + B',
    icCode: 'IC 7432 (Quad 2-Input OR)',
    description: 'Output is HIGH (1) if at least one input is HIGH (1). Used for combining alert and priority signals.',
    academicNote: 'Parallel switch topology: either switch closing provides an active path.',
    inputs: 2,
    truthTable: [
      { a: 0, b: 0, y: 0 },
      { a: 0, b: 1, y: 1 },
      { a: 1, b: 0, y: 1 },
      { a: 1, b: 1, y: 1 },
    ]
  },
  {
    id: 'NOT',
    name: 'NOT Gate (Inverter)',
    expression: "Y = A'",
    icCode: 'IC 7404 (Hex Inverter)',
    description: 'Output is the inverse of the input. Essential for generating complementary clock phases and active-LOW asserts.',
    academicNote: 'Single transistor in common-emitter mode: HIGH input saturates transistor, pulling output to ground (LOW).',
    inputs: 1,
    truthTable: [
      { a: 0, y: 1 },
      { a: 1, y: 0 },
    ]
  },
  {
    id: 'NAND',
    name: 'NAND Gate (Universal Gate)',
    expression: "Y = (A · B)'",
    icCode: 'IC 7400 (Quad 2-Input NAND)',
    description: 'Output is LOW (0) only when all inputs are HIGH (1). Universal building block capable of implementing any Boolean function.',
    academicNote: 'Standard TTL Totem-pole basic gate; forms the basis of cross-coupled SR latches.',
    inputs: 2,
    truthTable: [
      { a: 0, b: 0, y: 1 },
      { a: 0, b: 1, y: 1 },
      { a: 1, b: 0, y: 1 },
      { a: 1, b: 1, y: 0 },
    ]
  },
  {
    id: 'NOR',
    name: 'NOR Gate (Universal Gate)',
    expression: "Y = (A + B)'",
    icCode: 'IC 7402 (Quad 2-Input NOR)',
    description: 'Output is HIGH (1) only when all inputs are LOW (0). Dual universal gate used in SR latches and memory cells.',
    academicNote: 'Note DIP-14 pinout quirk: 7402 has output on pin 1 with inputs on pins 2 and 3, unlike 7400/7408.',
    inputs: 2,
    truthTable: [
      { a: 0, b: 0, y: 1 },
      { a: 0, b: 1, y: 0 },
      { a: 1, b: 0, y: 0 },
      { a: 1, b: 1, y: 0 },
    ]
  },
  {
    id: 'XOR',
    name: 'XOR Gate (Exclusive OR)',
    expression: "Y = A ⊕ B = A'B + AB'",
    icCode: 'IC 7486 (Quad 2-Input XOR)',
    description: 'Output is HIGH (1) when inputs are different. Core building block of half-adders, full-adders, and parity generators.',
    academicNote: 'Acts as a programmable inverter: if input B is 1, Y is A inverted; if B is 0, Y follows A without inversion.',
    inputs: 2,
    truthTable: [
      { a: 0, b: 0, y: 0 },
      { a: 0, b: 1, y: 1 },
      { a: 1, b: 0, y: 1 },
      { a: 1, b: 1, y: 0 },
    ]
  },
  {
    id: 'XNOR',
    name: 'XNOR Gate (Equivalence Gate)',
    expression: "Y = (A ⊕ B)' = AB + A'B'",
    icCode: 'IC 74266 (Quad 2-Input XNOR)',
    description: 'Output is HIGH (1) when both inputs are equal. Key element in digital magnitude comparators.',
    academicNote: 'Produces 1 for matching logic states (both 0 or both 1), enabling bitwise equality checking.',
    inputs: 2,
    truthTable: [
      { a: 0, b: 0, y: 1 },
      { a: 0, b: 1, y: 0 },
      { a: 1, b: 0, y: 0 },
      { a: 1, b: 1, y: 1 },
    ]
  }
];
