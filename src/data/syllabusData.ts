import { CourseOutcome } from '../types/dsd';

export const COURSE_INFO = {
  institution: "Shah & Anchor Kutchhi Engineering College",
  affiliation: "Autonomous, Affiliated to University of Mumbai",
  program: "Second Year B.Tech. Electronics and Computer Science",
  courseName: "Digital System Design",
  courseCode: "ECCOR2PC203",
  semester: "Semester III",
  credits: 3,
  hoursTheory: 30,
  hoursLab: 30,
  teachingScheme: {
    lecture: "2 Hrs/Week",
    practical: "2 Hrs/Week",
    credits: 3,
  },
  bloomDistribution: [
    { level: "BL1 - Remembering", percentage: 10, count: 2, color: "bg-sky-100 text-sky-800 border-sky-300" },
    { level: "BL2 - Understanding", percentage: 10, count: 2, color: "bg-amber-100 text-amber-800 border-amber-300" },
    { level: "BL3 - Applying / Analyzing", percentage: 52, count: 11, color: "bg-sage-100 text-sage-800 border-sage-300" },
    { level: "BL4 - Evaluating / Designing", percentage: 28, count: 5, color: "bg-rose-100 text-rose-800 border-rose-300" },
  ]
};

export const COURSE_OUTCOMES: CourseOutcome[] = [
  {
    code: "CO1",
    statement: "Apply the concepts of sequential logic to implement circuits such as flip-flops, registers, counters and finite state machines for digital systems.",
    bloomLevel: "BL3",
    hours: 8,
    theoryModule: 1,
    labExperiments: [1, 2, 3, 4, 5, 6],
    color: "sky"
  },
  {
    code: "CO2",
    statement: "Analyze the working of shift registers and counters using MSI ICs.",
    bloomLevel: "BL3",
    hours: 6,
    theoryModule: 1,
    labExperiments: [1, 2, 11, 12],
    color: "amber"
  },
  {
    code: "CO3",
    statement: "Calculate Minimization Problems using PLA and PAL Devices, and characterize Logic Families (TTL/CMOS).",
    bloomLevel: "BL3",
    hours: 6,
    theoryModule: 2,
    labExperiments: [3, 4],
    color: "amber"
  },
  {
    code: "CO4",
    statement: "Analyze Real-time circuits and Sequence Detectors using ASM and FSM Charts.",
    bloomLevel: "BL3",
    hours: 9,
    theoryModule: 3,
    labExperiments: [5, 6, 12],
    color: "lavender"
  },
  {
    code: "CO5",
    statement: "Design Combinational and Sequential circuits using Verilog Hardware Description Language.",
    bloomLevel: "BL4",
    hours: 7,
    theoryModule: 4,
    labExperiments: [7, 8, 9, 10],
    color: "sage"
  }
];
