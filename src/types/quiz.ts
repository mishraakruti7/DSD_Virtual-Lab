import { z } from 'zod';

export const QuizQuestionSchema = z.object({
  id: z.number(),
  question: z.string().min(5),
  options: z.array(z.string()).min(2).max(4),
  correctIndex: z.number().int().min(0).max(3),
  module: z.number().int().min(1).max(4),
  co: z.enum(['CO1', 'CO2', 'CO3', 'CO4', 'CO5', 'CO6']),
  bloomLevel: z.enum(['BL1', 'BL2', 'BL3', 'BL4']),
  difficulty: z.enum(['Easy', 'Medium', 'Hard']),
  explanation: z.string().min(5),
  hint: z.string().optional(),
  diagramSvgId: z.string().optional(),
});

export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

export type QuizMode =
  | 'module'
  | 'co'
  | 'mock_exam'
  | 'viva_prep'
  | 'flashcards'
  | 'daily_challenge';

export interface QuizSessionState {
  mode: QuizMode;
  selectedModule?: number;
  selectedCO?: string;
  questions: QuizQuestion[];
  currentIndex: number;
  userAnswers: { [questionId: number]: number };
  markedForReview: number[];
  startTime: number;
  endTime?: number;
  isSubmitted: boolean;
}

export interface QuizResultReport {
  totalQuestions: number;
  attempted: number;
  correctCount: number;
  incorrectCount: number;
  scorePercentage: number;
  timeSpentSeconds: number;
  bloomBreakdown: {
    [key in 'BL1' | 'BL2' | 'BL3' | 'BL4']?: { total: number; correct: number };
  };
  coBreakdown: {
    [coId: string]: { total: number; correct: number };
  };
}
