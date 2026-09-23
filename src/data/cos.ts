import { CourseOutcomeDef } from '../types/course';

export const COURSE_OUTCOMES: CourseOutcomeDef[] = [
  {
    id: 'CO1',
    title: 'Sequential Logic Circuits',
    statement:
      'Analyze, design, and verify sequential logic circuits including Latches, Flip-Flops (SR, JK, D, T, Master-Slave), Shift Registers, and Synchronous/Asynchronous Counters.',
    bloomLevel: 'BL4: Analyze',
    theoryHours: 8,
    theoryModule: 1,
    labExperiments: [2, 3, 4, 5, 6],
    color: '#0284c7', // Sky Blue
    weightagePercent: 28,
  },
  {
    id: 'CO2',
    title: 'Digital Logic Families & Interfacing',
    statement:
      'Evaluate performance parameters (propagation delay, power dissipation, fan-in, fan-out, noise margin) of TTL and CMOS logic families and design bidirectional interfacing circuits.',
    bloomLevel: 'BL5: Evaluate',
    theoryHours: 6,
    theoryModule: 2,
    labExperiments: [1],
    color: '#059669', // Emerald Green
    weightagePercent: 20,
  },
  {
    id: 'CO3',
    title: 'Finite State Machines & ASM Charts',
    statement:
      'Design synchronous Finite State Machines (Mealy and Moore models), perform state reduction, state assignment, and synthesize digital control units using Algorithmic State Machine (ASM) charts.',
    bloomLevel: 'BL6: Create',
    theoryHours: 5,
    theoryModule: 3,
    labExperiments: [12],
    color: '#7c3aed', // Purple
    weightagePercent: 18,
  },
  {
    id: 'CO4',
    title: 'Programmable Logic Devices',
    statement:
      'Implement combinational and sequential complex logic architectures using Programmable Logic Devices including PROMs, PALs, PLAs, and modern FPGA/CPLD architectures.',
    bloomLevel: 'BL3: Apply',
    theoryHours: 3,
    theoryModule: 3,
    labExperiments: [7, 8],
    color: '#d97706', // Amber
    weightagePercent: 12,
  },
  {
    id: 'CO5',
    title: 'Hardware Description Language (Verilog HDL)',
    statement:
      'Model, simulate, test, and synthesize combinational and sequential digital systems using Verilog HDL across structural, dataflow, and behavioral abstraction levels.',
    bloomLevel: 'BL3: Apply',
    theoryHours: 5,
    theoryModule: 4,
    labExperiments: [9, 10, 12],
    color: '#dc2626', // Crimson Red
    weightagePercent: 14,
  },
  {
    id: 'CO6',
    title: 'Fault Modeling & Digital Testing',
    statement:
      'Identify and analyze physical faults in digital circuits using single stuck-at fault models, fault equivalence, fault dominance, and path sensitization test generation methods.',
    bloomLevel: 'BL4: Analyze',
    theoryHours: 3,
    theoryModule: 4,
    labExperiments: [11],
    color: '#0891b2', // Cyan
    weightagePercent: 8,
  },
];
