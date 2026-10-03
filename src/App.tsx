import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { Navbar, MainHubTab } from './components/layout/Navbar';
import { AccessibilityBar } from './components/layout/AccessibilityBar';
import { CommandPalette } from './components/layout/CommandPalette';
import { Footer } from './components/common/Footer';
import { SkipLink } from './components/common/SkipLink';
import { StorageNoticeBanner } from './components/common/StorageNoticeBanner';
import { useCourseStore } from './store/useCourseStore';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/auth/AuthModal';
import { DsdTutorChat } from './components/tutor/DsdTutorChat';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { IS_PROD_UNCONFIGURED } from './lib/supabaseClient';

// Core Immediate Pages
import { HomePage } from './pages/HomePage';
import { TheoryModulesPage } from './pages/TheoryModulesPage';
import { LabManualPage } from './pages/LabManualPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Lazy-loaded heavy modules for bundle optimization and instant initial page load
const BreadboardLabPage = lazy(() => import('./pages/BreadboardLabPage').then((m) => ({ default: m.BreadboardLabPage })));
const SimulatorsPage = lazy(() => import('./pages/SimulatorsPage').then((m) => ({ default: m.SimulatorsPage })));
const LogicAnalyzerScope = lazy(() =>
  import('./components/stations/Station4LogicAnalyzer/LogicAnalyzerScope').then((m) => ({ default: m.LogicAnalyzerScope }))
);
const CircuitGalleryPage = lazy(() => import('./pages/CircuitGalleryPage').then((m) => ({ default: m.CircuitGalleryPage })));
const QuizHubPage = lazy(() => import('./pages/QuizHubPage').then((m) => ({ default: m.QuizHubPage })));
const AssessmentPage = lazy(() => import('./pages/AssessmentPage').then((m) => ({ default: m.AssessmentPage })));
const MiniProjectsPage = lazy(() => import('./pages/MiniProjectsPage').then((m) => ({ default: m.MiniProjectsPage })));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage').then((m) => ({ default: m.ResourcesPage })));
const GlossaryPage = lazy(() => import('./pages/GlossaryPage').then((m) => ({ default: m.GlossaryPage })));
const ProgressDashboardPage = lazy(() => import('./pages/ProgressDashboardPage').then((m) => ({ default: m.ProgressDashboardPage })));
const FacultyDashboardPage = lazy(() => import('./pages/FacultyDashboardPage').then((m) => ({ default: m.FacultyDashboardPage })));
const AdminPanelPage = lazy(() => import('./pages/AdminPanelPage').then((m) => ({ default: m.AdminPanelPage })));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })));
const AdminSystemDatabasePage = lazy(() =>
  import('./pages/AdminSystemDatabasePage').then((m) => ({ default: m.AdminSystemDatabasePage }))
);
const StudentDashboardPage = lazy(() => import('./pages/StudentDashboardPage').then((m) => ({ default: m.StudentDashboardPage })));
const FeedbackPage = lazy(() => import('./pages/FeedbackPage').then((m) => ({ default: m.FeedbackPage })));
const HelpPage = lazy(() => import('./pages/HelpPage').then((m) => ({ default: m.HelpPage })));
const ContactUsPage = lazy(() => import('./pages/ContactUsPage').then((m) => ({ default: m.ContactUsPage })));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage })));

// Legal & Compliance Pages (India DPDP Act 2023 / Rules 2025 & WCAG 2.2 AA)
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then((m) => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then((m) => ({ default: m.TermsPage })));
const CookiesPage = lazy(() => import('./pages/CookiesPage').then((m) => ({ default: m.CookiesPage })));
const AccessibilityPage = lazy(() => import('./pages/AccessibilityPage').then((m) => ({ default: m.AccessibilityPage })));
const MyDataPage = lazy(() => import('./pages/MyDataPage').then((m) => ({ default: m.MyDataPage })));

function PageLoadingFallback() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[45vh] p-8 text-center space-y-3"
      role="status"
      aria-live="polite"
    >
      <div className="w-10 h-10 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 rounded-full animate-spin" />
      <p className="text-xs font-mono font-bold text-slate-500 dark:text-stone-400">Loading virtual workbench module...</p>
      <span className="sr-only">Loading</span>
    </div>
  );
}

function TheoryRouteWrapper() {
  const { moduleId } = useParams<{ moduleId?: string }>();
  return <TheoryModulesPage initialModuleId={moduleId ? parseInt(moduleId, 10) : undefined} />;
}

function LabsRouteWrapper({ onNavigate }: { onNavigate: (tab: string, extra?: any) => void }) {
  const { labId } = useParams<{ labId?: string }>();
  return (
    <LabManualPage
      initialLabId={labId ? parseInt(labId, 10) : undefined}
      onNavigateToBreadboard={(preset) => onNavigate('breadboard', preset)}
      onNavigateToSimulator={(sim) => onNavigate('simulators', sim)}
    />
  );
}

function BreadboardRouteWrapper({ onNavigate }: { onNavigate: (tab: string, extra?: any) => void }) {
  const [searchParams] = useSearchParams();
  const preset = searchParams.get('preset') || undefined;
  return (
    <BreadboardLabPage
      initialPresetId={preset}
      onNavigateToLab={(labId) => onNavigate('lab', labId)}
    />
  );
}

function SimulatorsRouteWrapper() {
  const [searchParams] = useSearchParams();
  const sim = searchParams.get('sim') || undefined;
  return <SimulatorsPage initialSimId={sim} />;
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { openAuthModal } = useAuth();

  const {
    theme,
    highContrast,
    fontSize,
    commandPaletteOpen,
    setCommandPaletteOpen,
  } = useCourseStore();

  // Detect Supabase password recovery link (#type=recovery)
  useEffect(() => {
    if (window.location.hash && window.location.hash.includes('type=recovery')) {
      navigate('/reset-password');
    }
  }, [navigate]);

  // Sync theme, contrast, and font scale to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    root.classList.remove('text-sm', 'text-base', 'text-lg', 'text-xl');
    root.classList.add(`text-${fontSize}`);
  }, [theme, highContrast, fontSize]);

  // Compute activeTab for Navbar based on current pathname
  const getActiveTab = (pathname: string): MainHubTab => {
    if (pathname === '/') return 'home';
    if (pathname.startsWith('/theory')) return 'theory';
    if (pathname.startsWith('/lab')) return 'lab';
    if (pathname.startsWith('/breadboard')) return 'breadboard';
    if (pathname.startsWith('/simulators')) return 'simulators';
    if (pathname.startsWith('/analyzer')) return 'analyzer';
    if (pathname.startsWith('/gallery')) return 'gallery';
    if (pathname.startsWith('/quiz')) return 'quiz';
    if (pathname.startsWith('/assessment')) return 'assessment';
    if (pathname.startsWith('/projects')) return 'projects';
    if (pathname.startsWith('/resources')) return 'resources';
    if (pathname.startsWith('/glossary')) return 'glossary';
    if (pathname.startsWith('/progress')) return 'progress';
    if (pathname === '/admin/system-database') return 'database-showcase';
    if (pathname.startsWith('/faculty')) return 'faculty';
    if (pathname.startsWith('/admin')) return 'admin';
    if (pathname.startsWith('/feedback')) return 'feedback';
    if (pathname.startsWith('/help')) return 'help';
    if (pathname.startsWith('/contact')) return 'contact';
    if (pathname.startsWith('/reset-password')) return 'reset-password';
    return 'home';
  };

  const activeTab = getActiveTab(location.pathname);

  const handleNavigate = (tab: string, extraId?: string | number) => {
    if (tab === 'login') {
      openAuthModal('signin');
      return;
    }
    if (tab === 'signup') {
      openAuthModal('signup');
      return;
    }

    if (tab === 'home') {
      navigate('/');
    } else if (tab === 'theory') {
      navigate(extraId !== undefined ? `/theory/${extraId}` : '/theory');
    } else if (tab === 'lab' || tab === 'labs') {
      navigate(extraId !== undefined ? `/labs/${extraId}` : '/labs');
    } else if (tab === 'breadboard') {
      navigate(extraId !== undefined ? `/breadboard?preset=${extraId}` : '/breadboard');
    } else if (tab === 'simulators') {
      navigate(extraId !== undefined ? `/simulators?sim=${extraId}` : '/simulators');
    } else if (tab === 'database-showcase') {
      navigate('/admin/system-database');
    } else {
      navigate(`/${tab}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen ambient-soft-bg text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white relative transition-colors duration-300">
      {/* WCAG 2.2 Skip to Main Content Link */}
      <SkipLink />

      {/* Production Configuration Notice (if deployed without environment variables) */}
      {IS_PROD_UNCONFIGURED && (
        <div className="bg-amber-500 text-slate-950 font-bold px-4 py-2 text-center text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md z-50">
          <span>⚠️ Site Notice: Backend service configuration required. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your hosting environment.</span>
        </div>
      )}

      {/* Top Accessibility & Institutional Bar */}
      <AccessibilityBar />

      {/* Primary Sticky Header */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleNavigate}
      />

      {/* Global Quick Search (Ctrl+K) Modal */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Main Content Area with React Router & Suspense */}
      <main id="main-content" tabIndex={-1} className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 focus:outline-none">
        <Suspense fallback={<PageLoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage onSelectTab={handleNavigate} />} />
            <Route path="/theory" element={<TheoryRouteWrapper />} />
            <Route path="/theory/:moduleId" element={<TheoryRouteWrapper />} />
            <Route path="/labs" element={<LabsRouteWrapper onNavigate={handleNavigate} />} />
            <Route path="/labs/:labId" element={<LabsRouteWrapper onNavigate={handleNavigate} />} />
            <Route path="/lab" element={<LabsRouteWrapper onNavigate={handleNavigate} />} />
            <Route path="/lab/:labId" element={<LabsRouteWrapper onNavigate={handleNavigate} />} />
            <Route path="/breadboard" element={<BreadboardRouteWrapper onNavigate={handleNavigate} />} />
            <Route path="/simulators" element={<SimulatorsRouteWrapper />} />
            <Route path="/analyzer" element={<LogicAnalyzerScope />} />
            <Route path="/gallery" element={<CircuitGalleryPage />} />
            <Route path="/quiz" element={<QuizHubPage />} />
            <Route path="/assessment" element={<AssessmentPage />} />
            <Route path="/projects" element={<MiniProjectsPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/glossary" element={<GlossaryPage />} />
            <Route path="/progress" element={<ProgressDashboardPage onNavigateTab={handleNavigate} />} />
            
            {/* Protected Management Consoles */}
            <Route
              path="/faculty"
              element={
                <ProtectedRoute roles={['teacher', 'admin']}>
                  <FacultyDashboardPage onNavigateTab={handleNavigate} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={['teacher', 'admin']}>
                  <AdminPanelPage onNavigateTab={handleNavigate} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute roles={['teacher', 'admin']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/system-database"
              element={
                <ProtectedRoute roles={['teacher', 'admin']}>
                  <AdminSystemDatabasePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student"
              element={
                <ProtectedRoute roles={['student']}>
                  <StudentDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Support & Academic Contact */}
            <Route path="/feedback" element={<FeedbackPage onNavigateTab={handleNavigate} />} />
            <Route path="/help" element={<HelpPage onNavigateTab={handleNavigate} />} />
            <Route path="/contact" element={<ContactUsPage onNavigateTab={handleNavigate} />} />
            <Route path="/reset-password" element={<ResetPasswordPage onNavigateTab={handleNavigate} />} />

            {/* Legal & Compliance (India DPDP Act 2023 & WCAG 2.2 AA) */}
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/cookies" element={<CookiesPage />} />
            <Route path="/accessibility" element={<AccessibilityPage />} />
            <Route path="/my-data" element={<MyDataPage />} />

            {/* Catch-all Not Found Route */}
            <Route path="*" element={<NotFoundPage onGoHome={() => handleNavigate('home')} onNavigateTab={handleNavigate} />} />
          </Routes>
        </Suspense>
      </main>

      {/* Course Credits & Institutional Footer */}
      <Footer />

      {/* Zero-Tracker Storage Notice Banner (Dismissible) */}
      <StorageNoticeBanner />

      {/* "Ask the DSD Tutor" AI Chatbot (Persistent Trigger + Slide-in Drawer) */}
      <DsdTutorChat activeTab={activeTab} />

      {/* Global Student Authentication Dialog */}
      <AuthModal onNavigateTab={handleNavigate} />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
