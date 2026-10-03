// ==============================================================================
// Database Type Definitions for Supabase (Virtual DSD Lab)
// ==============================================================================

export type UserRole = 'student' | 'faculty' | 'admin';

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_active?: boolean;
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

export interface FacultyReportRecord {
  id: string;
  generated_by: string;
  report_type: 'class_progress' | 'quiz_summary' | 'full';
  format: 'csv' | 'pdf';
  filters?: Record<string, any>;
  generated_at: string;
  file_url?: string | null;
}

export type SupportMessageType = 'feedback' | 'help_request' | 'contact' | 'bug_report' | 'feature_request';
export type SupportMessageStatus = 'new' | 'open' | 'in_progress' | 'in_review' | 'resolved' | 'closed';

export interface SupportMessageRecord {
  id: string;
  user_id: string | null;
  user_email?: string | null;
  user_name?: string | null;
  contact_email?: string | null;
  category?: string | null;
  type: SupportMessageType;
  subject: string;
  message: string;
  status: SupportMessageStatus;
  admin_reply?: string | null;
  rating?: number | null;
  created_at: string;
  updated_at: string;
}

export interface ModuleRecord {
  id: string;
  title: string;
  description?: string | null;
  order_index?: number;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

export interface LessonRecord {
  id: string;
  module_id: string;
  title: string;
  content?: string | null;
  order_index?: number;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

export interface QuizRecord {
  id: string;
  module_id?: string | null;
  title: string;
  description?: string | null;
  time_limit?: number | null;
  created_at: string;
  [key: string]: any;
}

export interface QuizQuestionRecord {
  id: string;
  quiz_id: string;
  question: string;
  options: string[] | any;
  correct_answer: string | number;
  explanation?: string | null;
  [key: string]: any;
}

