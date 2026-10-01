// ==============================================================================
// Database Type Definitions for Supabase (Virtual DSD Lab)
// ==============================================================================

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  role: 'student' | 'teacher' | 'admin';
  institution?: string;
  department?: string;
  created_at: string;
  updated_at: string;
}

export interface ProgressRecord {
  id: string;
  user_id: string;
  topic_id: string;
  completed: boolean;
  progress_data?: Record<string, any>;
  updated_at: string;
}

export interface QuizAttemptRecord {
  id: string;
  user_id: string;
  quiz_id: string;
  score: number;
  total: number;
  bloom_breakdown?: Record<string, any>;
  taken_at: string;
}

export interface SavedCircuitRecord {
  id: string;
  user_id: string;
  name: string;
  description?: string | null;
  circuit_json: Record<string, any>;
  thumbnail?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatHistoryRecord {
  id: string;
  user_id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  topic_context?: string | null;
  created_at: string;
}

export interface ChatUsageRecord {
  id: string;
  user_id?: string | null;
  client_identifier?: string | null;
  message_count: number;
  window_start: string;
  updated_at: string;
}

export interface ChatFeedbackRecord {
  id: string;
  user_id?: string | null;
  message_id: string;
  rating: 'positive' | 'negative';
  feedback_text?: string | null;
  topic_context?: string | null;
  created_at: string;
}

export interface ModuleRecord {
  id: string;
  title: string;
  description?: string | null;
  content: any;
  order_number: number;
  created_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface LessonRecord {
  id: string;
  module_id: string;
  title: string;
  content: string;
  order_number: number;
  created_at: string;
  updated_at: string;
}

export interface QuizRecord {
  id: string;
  module_id: string;
  title: string;
  created_at: string;
}

export interface QuizQuestionRecord {
  id: string;
  quiz_id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  marks: number;
}
