import { supabase } from '../lib/supabaseClient';
import { ModuleRecord, LessonRecord, QuizRecord, QuizQuestionRecord, Profile } from '../types/database.types';

export const adminService = {
  // --- User Management ---
  async getAllStudents(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'student');
    if (error) throw error;
    return data || [];
  },

  // --- Module Management ---
  async createModule(module: Omit<ModuleRecord, 'id' | 'created_at' | 'updated_at'>): Promise<ModuleRecord> {
    const { data, error } = await supabase.from('modules').insert([module]).select().single();
    if (error) throw error;
    return data;
  },

  async updateModule(id: string, updates: Partial<ModuleRecord>): Promise<ModuleRecord> {
    const { data, error } = await supabase.from('modules').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  async deleteModule(id: string): Promise<void> {
    const { error } = await supabase.from('modules').delete().eq('id', id);
    if (error) throw error;
  },

  // --- Quiz Management ---
  async createQuiz(quiz: Omit<QuizRecord, 'id' | 'created_at'>): Promise<QuizRecord> {
    const { data, error } = await supabase.from('quizzes').insert([quiz]).select().single();
    if (error) throw error;
    return data;
  },

  async addQuizQuestion(question: Omit<QuizQuestionRecord, 'id'>): Promise<QuizQuestionRecord> {
    const { data, error } = await supabase.from('quiz_questions').insert([question]).select().single();
    if (error) throw error;
    return data;
  }
};
