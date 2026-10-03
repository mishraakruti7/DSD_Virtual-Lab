// ==============================================================================
// ConsentManager: Lightweight privacy and browser storage consent manager
// Guarantees zero non-essential scripts execute without prior opt-in consent.
// ==============================================================================

export interface ConsentPreferences {
  strictlyNecessary: boolean; // Always true
  analytics: boolean;         // Default false
  marketing: boolean;         // Default false
  updatedAt: string;
}

const STORAGE_KEY = 'dsd_consent_preferences_v1';

export const ConsentManager = {
  getPreferences(): ConsentPreferences {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // Fallback
    }
    return {
      strictlyNecessary: true,
      analytics: false,
      marketing: false,
      updatedAt: new Date().toISOString(),
    };
  },

  setPreferences(prefs: Partial<ConsentPreferences>): void {
    try {
      const current = this.getPreferences();
      const updated: ConsentPreferences = {
        ...current,
        ...prefs,
        strictlyNecessary: true, // Immutable
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Storage unavailable fallback
    }
  },

  isNoticeDismissed(): boolean {
    return localStorage.getItem('dsd_storage_notice_dismissed') === 'true';
  },

  dismissNotice(): void {
    localStorage.setItem('dsd_storage_notice_dismissed', 'true');
  },

  // Gatekeeper: only executes callback if corresponding consent category is granted
  runIfAllowed(category: 'analytics' | 'marketing', callback: () => void): void {
    const prefs = this.getPreferences();
    if (category === 'analytics' && prefs.analytics) {
      callback();
    } else if (category === 'marketing' && prefs.marketing) {
      callback();
    }
  },
};
