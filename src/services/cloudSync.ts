// ==============================================================================
// Cloud Sync Service: Synchronizes student progress and circuits with Supabase
// ==============================================================================

import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { StudentProgress } from '../store/useCourseStore';

export interface CloudSyncResult {
  success: boolean;
  importedItems?: number;
  error?: string;
}

// 1. Fetch progress from Supabase for a logged-in student
export async function fetchCloudProgress(userId: string): Promise<Partial<StudentProgress> | null> {
  if (!isSupabaseConfigured() || !userId) return null;

  try {
    // A. Fetch completed topics & labs from progress table
    const { data: progressRows, error: pErr } = await supabase
      .from('progress')
      .select('topic_id, completed, progress_data')
      .eq('user_id', userId);

    if (pErr) {
      console.warn('Error fetching cloud progress:', pErr.message);
      return null;
    }

    // B. Fetch quiz attempts
    const { data: quizRows, error: qErr } = await supabase
      .from('quiz_attempts')
      .select('quiz_id, score, total, taken_at')
      .eq('user_id', userId)
      .order('taken_at', { ascending: false });

    if (qErr) {
      console.warn('Error fetching quiz attempts:', qErr.message);
    }

    if (!progressRows || progressRows.length === 0) {
      return null; // No cloud progress exists yet
    }

    const completedLabs: number[] = [];
    const bookmarkedTerms: string[] = [];
    const achievements: string[] = [];

    for (const row of progressRows) {
      if (row.topic_id.startsWith('lab_')) {
        const labNum = parseInt(row.topic_id.replace('lab_', ''), 10);
        if (!isNaN(labNum)) completedLabs.push(labNum);
      } else if (row.topic_id.startsWith('term_')) {
        bookmarkedTerms.push(row.topic_id.replace('term_', ''));
      } else if (row.topic_id.startsWith('achievement_')) {
        achievements.push(row.topic_id.replace('achievement_', ''));
      }
    }

    const completedQuizzes = (quizRows || []).map((q: any) => ({
      quizId: q.quiz_id,
      score: q.score,
      total: q.total,
      date: new Date(q.taken_at).toLocaleDateString(),
    }));

    return {
      completedLabs: Array.from(new Set(completedLabs)),
      bookmarkedTerms: Array.from(new Set(bookmarkedTerms)),
      achievements: Array.from(new Set(achievements.length > 0 ? achievements : ['first_visit'])),
      completedQuizzes,
    };
  } catch (err: any) {
    console.error('Exception fetching cloud progress:', err);
    return null;
  }
}

// 2. Upload local progress to the cloud (import migration)
export async function migrateLocalStorageToCloud(
  userId: string,
  localProgress: StudentProgress
): Promise<CloudSyncResult> {
  if (!isSupabaseConfigured() || !userId) {
    return { success: false, error: 'Supabase is not configured or user is not logged in.' };
  }

  try {
    let importedCount = 0;

    // A. Sync completed labs
    for (const labId of localProgress.completedLabs) {
      await supabase.from('progress').upsert(
        {
          user_id: userId,
          topic_id: `lab_${labId}`,
          completed: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,topic_id' }
      );
      importedCount++;
    }

    // B. Sync bookmarked terms
    for (const termId of localProgress.bookmarkedTerms) {
      await supabase.from('progress').upsert(
        {
          user_id: userId,
          topic_id: `term_${termId}`,
          completed: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,topic_id' }
      );
      importedCount++;
    }

    // C. Sync achievements
    for (const achId of localProgress.achievements) {
      await supabase.from('progress').upsert(
        {
          user_id: userId,
          topic_id: `achievement_${achId}`,
          completed: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,topic_id' }
      );
      importedCount++;
    }

    // D. Sync quiz attempts
    for (const quiz of localProgress.completedQuizzes) {
      await supabase.from('quiz_attempts').insert({
        user_id: userId,
        quiz_id: quiz.quizId,
        score: quiz.score,
        total: quiz.total,
        taken_at: new Date().toISOString(),
      });
      importedCount++;
    }

    return { success: true, importedItems: importedCount };
  } catch (err: any) {
    console.error('Migration error:', err);
    return { success: false, error: err?.message || 'Failed to migrate progress to cloud' };
  }
}

// 3. Save single lab completion to cloud
export async function syncLabCompletionToCloud(userId: string, labId: number, completed: boolean) {
  if (!isSupabaseConfigured() || !userId) return;

  try {
    if (completed) {
      await supabase.from('progress').upsert(
        {
          user_id: userId,
          topic_id: `lab_${labId}`,
          completed: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,topic_id' }
      );
    } else {
      await supabase
        .from('progress')
        .delete()
        .eq('user_id', userId)
        .eq('topic_id', `lab_${labId}`);
    }
  } catch (e) {
    console.warn('Failed to sync lab completion to cloud:', e);
  }
}

// 4. Save quiz attempt to cloud
export async function syncQuizAttemptToCloud(
  userId: string,
  quizId: string,
  score: number,
  total: number,
  bloomBreakdown?: Record<string, any>
) {
  if (!isSupabaseConfigured() || !userId) return;

  try {
    await supabase.from('quiz_attempts').insert({
      user_id: userId,
      quiz_id: quizId,
      score,
      total,
      bloom_breakdown: bloomBreakdown || {},
      taken_at: new Date().toISOString(),
    });
  } catch (e) {
    console.warn('Failed to sync quiz attempt to cloud:', e);
  }
}

// 5. Breadboard Saved Circuits Management
export interface SavedCircuitItem {
  id: string;
  name: string;
  description?: string;
  circuit_json: any;
  created_at: string;
}

export async function fetchSavedCircuits(userId: string): Promise<SavedCircuitItem[]> {
  if (!isSupabaseConfigured() || !userId) {
    // Fallback to local storage for guest
    try {
      const local = localStorage.getItem('dsd_saved_circuits_local');
      return local ? JSON.parse(local) : [];
    } catch {
      return [];
    }
  }

  try {
    const { data, error } = await supabase
      .from('saved_circuits')
      .select('id, name, description, circuit_json, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Error fetching cloud circuits:', err);
    return [];
  }
}

export async function saveCircuit(
  userId: string | null,
  name: string,
  circuitData: any,
  description?: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  // If user is logged in and Supabase is configured:
  if (userId && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('saved_circuits')
        .insert({
          user_id: userId,
          name,
          description: description || null,
          circuit_json: circuitData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (error) throw error;
      return { success: true, id: data?.id };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to save circuit to cloud' };
    }
  }

  // Otherwise, save to localStorage
  try {
    const existing = localStorage.getItem('dsd_saved_circuits_local');
    const list: SavedCircuitItem[] = existing ? JSON.parse(existing) : [];
    const newCircuit: SavedCircuitItem = {
      id: `local_${Date.now()}`,
      name,
      description,
      circuit_json: circuitData,
      created_at: new Date().toISOString(),
    };
    list.unshift(newCircuit);
    localStorage.setItem('dsd_saved_circuits_local', JSON.stringify(list.slice(0, 30)));
    return { success: true, id: newCircuit.id };
  } catch (e: any) {
    return { success: false, error: e?.message || 'Failed to save circuit locally' };
  }
}

export async function deleteSavedCircuit(userId: string | null, circuitId: string) {
  if (userId && isSupabaseConfigured() && !circuitId.startsWith('local_')) {
    try {
      await supabase.from('saved_circuits').delete().eq('id', circuitId).eq('user_id', userId);
    } catch (e) {
      console.warn('Failed to delete cloud circuit:', e);
    }
  } else {
    try {
      const existing = localStorage.getItem('dsd_saved_circuits_local');
      if (existing) {
        const list: SavedCircuitItem[] = JSON.parse(existing);
        const filtered = list.filter((c) => c.id !== circuitId);
        localStorage.setItem('dsd_saved_circuits_local', JSON.stringify(filtered));
      }
    } catch (e) {
      console.warn('Failed to delete local circuit:', e);
    }
  }
}
