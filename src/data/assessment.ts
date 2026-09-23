export interface AssessmentScheme {
  component: string;
  maxMarks: number;
  passingMarks: number;
  weightagePercent: number;
  description: string;
  subComponents?: {
    name: string;
    marks: number;
    description: string;
  }[];
}

export const ASSESSMENT_COMPONENTS: AssessmentScheme[] = [
  {
    component: 'Internal Assessment (IA)',
    maxMarks: 20,
    passingMarks: 8,
    weightagePercent: 13.3,
    description:
      'Continuous evaluation consisting of two compulsory written class tests. The final IA score is the mathematical average of Test 1 and Test 2.',
    subComponents: [
      {
        name: 'Internal Test 1',
        marks: 20,
        description: 'Conducted at mid-semester, covering Module 1 (Sequential Circuits) and Module 2 (Logic Families). Duration: 1 hour.',
      },
      {
        name: 'Internal Test 2',
        marks: 20,
        description: 'Conducted towards semester end, covering Module 3 (FSM & PLDs) and Module 4 (Verilog HDL & Testing). Duration: 1 hour.',
      },
    ],
  },
  {
    component: 'End Semester Examination (ESE)',
    maxMarks: 80,
    passingMarks: 32,
    weightagePercent: 53.3,
    description:
      'Comprehensive university theoretical examination covering the entire syllabus (Modules 1 to 4). Question 1 is compulsory (20 marks: short questions from all modules). Out of remaining five questions (20 marks each), any three must be answered. Duration: 3 hours.',
  },
  {
    component: 'Term Work (TW)',
    maxMarks: 25,
    passingMarks: 10,
    weightagePercent: 16.7,
    description:
      'Continuous assessment of laboratory performance throughout the semester evaluated across 12 practical sessions and mini-project execution.',
    subComponents: [
      {
        name: 'Laboratory Experiment Performance & Timely Journal Writeups',
        marks: 15,
        description: 'Quality of circuit wiring, debugging autonomy, observation accuracy, and weekly journal submission.',
      },
      {
        name: 'Mini-Project / Hardware Prototype Demonstration',
        marks: 5,
        description: 'Design, execution, and presentation of a functional digital electronics mini-project.',
      },
      {
        name: 'Attendance & Class Conduct',
        marks: 5,
        description: 'Minimum 75% attendance mandatory as per University of Mumbai academic regulations.',
      },
    ],
  },
  {
    component: 'Practical / Oral Examination (PR/OR)',
    maxMarks: 25,
    passingMarks: 10,
    weightagePercent: 16.7,
    description:
      'Conducted jointly by an Internal Examiner and an External Examiner appointed by the University of Mumbai. Consists of a hardware implementation task / Verilog simulation and viva voce questions on theory and practical applications.',
  },
];

export interface StudentScoreInput {
  test1: number; // 0..20
  test2: number; // 0..20
  ese: number;   // 0..80
  twLab: number; // 0..15
  twProject: number; // 0..5
  twAttendance: number; // 0..5
  prOr: number;  // 0..25
}

export interface CalculatedResult {
  iaAvg: number;
  twTotal: number;
  grandTotal: number;
  percentage: number;
  grade: string;
  gradePoint: number;
  status: 'Passed' | 'Failed' | 'Incomplete';
  remarks: string;
}

export function calculateDSDGrade(scores: StudentScoreInput): CalculatedResult {
  const t1 = Math.max(0, Math.min(20, scores.test1));
  const t2 = Math.max(0, Math.min(20, scores.test2));
  const iaAvg = Math.round(((t1 + t2) / 2) * 10) / 10;

  const twLab = Math.max(0, Math.min(15, scores.twLab));
  const twProj = Math.max(0, Math.min(5, scores.twProject));
  const twAtt = Math.max(0, Math.min(5, scores.twAttendance));
  const twTotal = twLab + twProj + twAtt;

  const ese = Math.max(0, Math.min(80, scores.ese));
  const prOr = Math.max(0, Math.min(25, scores.prOr));

  const grandTotal = iaAvg + ese + twTotal + prOr;
  const percentage = Math.round((grandTotal / 150) * 1000) / 10;

  // Passing criteria:
  // ESE >= 32 (40%)
  // IA >= 8 (40%)
  // TW >= 10 (40%)
  // PR/OR >= 10 (40%)
  const isFailed = ese < 32 || iaAvg < 8 || twTotal < 10 || prOr < 10;

  let grade = 'F';
  let gradePoint = 0;

  if (!isFailed) {
    if (percentage >= 80) {
      grade = 'O (Outstanding)';
      gradePoint = 10;
    } else if (percentage >= 75) {
      grade = 'A (Excellent)';
      gradePoint = 9;
    } else if (percentage >= 70) {
      grade = 'B (Very Good)';
      gradePoint = 8;
    } else if (percentage >= 60) {
      grade = 'C (Good)';
      gradePoint = 7;
    } else if (percentage >= 50) {
      grade = 'D (Fair)';
      gradePoint = 6;
    } else if (percentage >= 45) {
      grade = 'E (Average)';
      gradePoint = 5;
    } else if (percentage >= 40) {
      grade = 'P (Pass)';
      gradePoint = 4;
    }
  }

  const status = isFailed ? 'Failed' : 'Passed';
  let remarks = 'Congratulations! You have satisfied all passing heads.';
  if (isFailed) {
    const reasons: string[] = [];
    if (ese < 32) reasons.push('ESE below minimum 32/80');
    if (iaAvg < 8) reasons.push('IA average below minimum 8/20');
    if (twTotal < 10) reasons.push('Term work below minimum 10/25');
    if (prOr < 10) reasons.push('Practical/Oral below minimum 10/25');
    remarks = `Did not meet passing criteria: ${reasons.join('; ')}`;
  }

  return {
    iaAvg,
    twTotal,
    grandTotal,
    percentage,
    grade,
    gradePoint,
    status,
    remarks,
  };
}
