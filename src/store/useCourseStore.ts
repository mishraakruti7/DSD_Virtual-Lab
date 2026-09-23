import { create } from 'zustand';
import { syncLabCompletionToCloud, syncQuizAttemptToCloud } from '../services/cloudSync';
import { getActiveUserId } from '../lib/supabaseClient';

export type ThemeMode = 'light' | 'dark';
export type FontSize = 'sm' | 'base' | 'lg' | 'xl';

export interface StudentProgress {
  completedLabs: number[];
  completedQuizzes: {
    quizId: string;
    score: number;
    total: number;
    date: string;
  }[];
  bookmarkedTerms: string[];
  bookmarkedSchematics: string[];
  lastVisitedRoute: string;
  studyStreakDays: number;
  lastActiveDate: string;
  achievements: string[];
}

interface CourseStoreState {
  theme: ThemeMode;
  highContrast: boolean;
  fontSize: FontSize;
  activeNavTab: string;
  commandPaletteOpen: boolean;
  soundEnabled: boolean;
  partyMode: boolean;
  studentProgress: StudentProgress;

  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setHighContrast: (enabled: boolean) => void;
  toggleHighContrast: () => void;
  setFontSize: (size: FontSize) => void;
  setActiveNavTab: (tab: string) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleSound: () => void;
  togglePartyMode: () => void;

  toggleLabComplete: (labId: number) => void;
  saveQuizResult: (quizId: string, score: number, total: number) => void;
  toggleBookmarkTerm: (termId: string) => void;
  setLastVisitedRoute: (route: string) => void;
  unlockAchievement: (achievementId: string) => boolean;
  resetProgress: () => void;
}

const STORAGE_KEY = 'dsd_course_storage_v2';

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

function computeStreak(lastDate: string, currentStreak: number): { streak: number; today: string } {
  const today = getTodayString();
  if (!lastDate) return { streak: 1, today };
  if (lastDate === today) return { streak: Math.max(1, currentStreak), today };

  const last = new Date(lastDate);
  const now = new Date(today);
  const diffDays = Math.round((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return { streak: currentStreak + 1, today };
  } else if (diffDays > 1) {
    return { streak: 1, today };
  }
  return { streak: currentStreak, today };
}

function loadStoredState(): Partial<CourseStoreState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not read from localStorage:', e);
    return {};
  }
}

function persistState(state: Partial<CourseStoreState>) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        theme: state.theme,
        highContrast: state.highContrast,
        fontSize: state.fontSize,
        soundEnabled: state.soundEnabled,
        studentProgress: state.studentProgress,
      })
    );
  } catch (e) {
    console.warn('Could not write to localStorage:', e);
  }
}

const initialSaved = loadStoredState();
const initialSavedProgress = initialSaved.studentProgress;
const streakCalc = computeStreak(
  initialSavedProgress?.lastActiveDate || '',
  initialSavedProgress?.studyStreakDays || 1
);

function getInitialTheme(): ThemeMode {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.theme === 'dark' || parsed.theme === 'light') {
        return parsed.theme;
      }
    }
  } catch {
    // Ignore storage parse error
  }
  return 'light'; // Explicitly light/soft/bright as the default theme
}

export const useCourseStore = create<CourseStoreState>((set, get) => ({
  theme: getInitialTheme(),
  highContrast: initialSaved.highContrast || false,
  fontSize: (initialSaved.fontSize as FontSize) || 'base',
  activeNavTab: 'home',
  commandPaletteOpen: false,
  soundEnabled: initialSaved.soundEnabled || false, // off by default as requested
  partyMode: false,
  studentProgress: {
    completedLabs: initialSavedProgress?.completedLabs || [1],
    completedQuizzes: initialSavedProgress?.completedQuizzes || [],
    bookmarkedTerms: initialSavedProgress?.bookmarkedTerms || ['latch', 'totem-pole-output'],
    bookmarkedSchematics: initialSavedProgress?.bookmarkedSchematics || [],
    lastVisitedRoute: initialSavedProgress?.lastVisitedRoute || '/',
    studyStreakDays: streakCalc.streak,
    lastActiveDate: streakCalc.today,
    achievements: initialSavedProgress?.achievements || ['first_visit'],
  },

  setTheme: (theme) => {
    set({ theme });
    persistState(get());
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  toggleTheme: () => {
    const nextTheme = get().theme === 'light' ? 'dark' : 'light';
    get().setTheme(nextTheme);
  },

  setHighContrast: (highContrast) => {
    set({ highContrast });
    persistState(get());
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  },

  toggleHighContrast: () => {
    get().setHighContrast(!get().highContrast);
  },

  setFontSize: (fontSize) => {
    set({ fontSize });
    persistState(get());
    const root = document.documentElement;
    root.classList.remove('text-sm', 'text-base', 'text-lg', 'text-xl');
    root.classList.add(`text-${fontSize}`);
  },

  setActiveNavTab: (activeNavTab) => set({ activeNavTab }),
  setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),

  toggleSound: () => {
    const next = !get().soundEnabled;
    set({ soundEnabled: next });
    persistState(get());
  },

  togglePartyMode: () => {
    set((state) => ({ partyMode: !state.partyMode }));
  },

  toggleLabComplete: (labId) => {
    const current = get().studentProgress.completedLabs;
    const isCompleted = current.includes(labId);
    const next = isCompleted
      ? current.filter((id) => id !== labId)
      : [...current, labId];

    set({
      studentProgress: {
        ...get().studentProgress,
        completedLabs: next,
      },
    });

    if (!isCompleted && next.length >= 1) {
      get().unlockAchievement('first_lab');
    }
    if (next.length === 12) {
      get().unlockAchievement('all_labs');
    }

    persistState(get());

    // Asynchronous Cloud Sync for Logged-In Students
    getActiveUserId().then((uid) => {
      if (uid) syncLabCompletionToCloud(uid, labId, !isCompleted);
    });
  },

  saveQuizResult: (quizId, score, total) => {
    const newEntry = {
      quizId,
      score,
      total,
      date: new Date().toLocaleDateString(),
    };
    const nextQuizzes = [newEntry, ...get().studentProgress.completedQuizzes].slice(0, 20);
    set({
      studentProgress: {
        ...get().studentProgress,
        completedQuizzes: nextQuizzes,
      },
    });

    if (nextQuizzes.length >= 1) {
      get().unlockAchievement('first_quiz');
    }
    if (score === total && total >= 5) {
      get().unlockAchievement('perfect_score');
    }

    persistState(get());

    // Asynchronous Cloud Sync for Logged-In Students
    getActiveUserId().then((uid) => {
      if (uid) syncQuizAttemptToCloud(uid, quizId, score, total);
    });
  },

  toggleBookmarkTerm: (termId) => {
    const current = get().studentProgress.bookmarkedTerms;
    const next = current.includes(termId)
      ? current.filter((t) => t !== termId)
      : [...current, termId];
    set({
      studentProgress: {
        ...get().studentProgress,
        bookmarkedTerms: next,
      },
    });
    if (next.length >= 3) {
      get().unlockAchievement('term_collector');
    }
    persistState(get());
  },

  setLastVisitedRoute: (lastVisitedRoute) => {
    set({
      studentProgress: {
        ...get().studentProgress,
        lastVisitedRoute,
      },
    });
    persistState(get());
  },

  unlockAchievement: (achievementId) => {
    const current = get().studentProgress.achievements;
    if (current.includes(achievementId)) return false;
    const next = [...current, achievementId];
    set({
      studentProgress: {
        ...get().studentProgress,
        achievements: next,
      },
    });
    persistState(get());
    return true;
  },

  resetProgress: () => {
    set({
      studentProgress: {
        completedLabs: [],
        completedQuizzes: [],
        bookmarkedTerms: [],
        bookmarkedSchematics: [],
        lastVisitedRoute: '/',
        studyStreakDays: 1,
        lastActiveDate: getTodayString(),
        achievements: ['first_visit'],
      },
    });
    persistState(get());
  },
}));
