import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar, MainHubTab } from './components/layout/Navbar';
import { AccessibilityBar } from './components/layout/AccessibilityBar';
import { CommandPalette } from './components/layout/CommandPalette';
import { Footer } from './components/common/Footer';
import { useCourseStore } from './store/useCourseStore';

// Hub Pages
import { HomePage } from './pages/HomePage';
import { TheoryModulesPage } from './pages/TheoryModulesPage';
import { LabManualPage } from './pages/LabManualPage';
import { BreadboardLabPage } from './pages/BreadboardLabPage';
import { SimulatorsPage } from './pages/SimulatorsPage';
import { CircuitGalleryPage } from './pages/CircuitGalleryPage';
import { QuizHubPage } from './pages/QuizHubPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { MiniProjectsPage } from './pages/MiniProjectsPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { GlossaryPage } from './pages/GlossaryPage';
import { ProgressDashboardPage } from './pages/ProgressDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { LogicAnalyzerScope } from './components/stations/Station4LogicAnalyzer/LogicAnalyzerScope';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/auth/AuthModal';
import { DsdTutorChat } from './components/tutor/DsdTutorChat';

function AppContent() {
  const [activeTab, setActiveTab] = useState<MainHubTab>('home');
  const [extraParam, setExtraParam] = useState<string | number | undefined>(undefined);

  const {
    theme,
    highContrast,
    fontSize,
    commandPaletteOpen,
    setCommandPaletteOpen,
  } = useCourseStore();

  const { openAuthModal } = useAuth();

  useEffect(() => {
    if (activeTab === ('login' as any)) {
      openAuthModal('signin');
      setActiveTab('home');
    } else if (activeTab === ('signup' as any)) {
      openAuthModal('signup');
      setActiveTab('home');
    }
  }, [activeTab, openAuthModal]);

  // Initialize theme, contrast, and font scale on mount
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    const root = document.documentElement;
    root.classList.remove('text-sm', 'text-base', 'text-lg', 'text-xl');
    root.classList.add(`text-${fontSize}`);
  }, [theme, highContrast, fontSize]);

  const handleNavigate = (tab: string, extraId?: string | number) => {
    setActiveTab(tab as MainHubTab);
    setExtraParam(extraId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen ambient-soft-bg text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white relative transition-colors duration-300">
      {/* Top Accessibility & Institutional Bar */}
      <AccessibilityBar />

      {/* Primary Sticky Header */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab, extra) => handleNavigate(tab, extra)}
      />

      {/* Global Quick Search (Ctrl+K) Modal */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Main Content Area with Page Transition Animation */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + (extraParam !== undefined ? `-${extraParam}` : '')}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {activeTab === 'home' && <HomePage onSelectTab={handleNavigate} />}
            {activeTab === 'theory' && (
              <TheoryModulesPage initialModuleId={extraParam as number} />
            )}
            {activeTab === 'lab' && (
              <LabManualPage
                initialLabId={extraParam as number}
                onNavigateToBreadboard={(preset) => handleNavigate('breadboard', preset)}
                onNavigateToSimulator={(sim) => handleNavigate('simulators', sim)}
              />
            )}
            {activeTab === 'breadboard' && (
              <BreadboardLabPage
                onNavigateToLab={(labId) => handleNavigate('lab', labId)}
              />
            )}
            {activeTab === 'simulators' && (
              <SimulatorsPage initialSimId={extraParam as string} />
            )}
            {activeTab === 'analyzer' && <LogicAnalyzerScope />}
            {activeTab === 'gallery' && <CircuitGalleryPage />}
            {activeTab === 'quiz' && <QuizHubPage />}
            {activeTab === 'assessment' && <AssessmentPage />}
            {activeTab === 'projects' && <MiniProjectsPage />}
            {activeTab === 'resources' && <ResourcesPage />}
            {activeTab === 'glossary' && <GlossaryPage />}
            {activeTab === 'progress' && (
              <ProgressDashboardPage onNavigateTab={handleNavigate} />
            )}
            {![
              'home',
              'theory',
              'lab',
              'breadboard',
              'simulators',
              'analyzer',
              'gallery',
              'quiz',
              'assessment',
              'projects',
              'resources',
              'glossary',
              'progress',
            ].includes(activeTab) && (
              <NotFoundPage onGoHome={() => handleNavigate('home')} onNavigateTab={handleNavigate} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Course Credits & Institutional Footer */}
      <Footer />

      {/* "Ask the DSD Tutor" AI Chatbot (Persistent Trigger + Slide-in Drawer) */}
      <DsdTutorChat activeTab={activeTab} extraParam={extraParam} />

      {/* Global Student Authentication Dialog */}
      <AuthModal />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
