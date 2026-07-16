import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PagePath } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnalysisContextProvider } from './context/AnalysisContext';
import { ThemeProvider } from './context/ThemeContext';
import { MarketAnalyticsProvider } from './context/MarketAnalyticsContext';

// Public Landing Components
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Solutions from './components/Solutions';
import AIIntelligence from './components/AIIntelligence';
import Pricing from './components/Pricing';
import About from './components/About';
import Contact from './components/Contact';

// Auth Components
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import VerifyEmail from './components/auth/VerifyEmail';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import RoleSelection from './components/auth/RoleSelection';
import SubscriptionSelection from './components/auth/SubscriptionSelection';
import ProfileSetup from './components/auth/ProfileSetup';

// Workspace Components
import InvestorWorkspace from './components/workspaces/InvestorWorkspace';
import AgentWorkspace from './components/workspaces/AgentWorkspace';
import AdminWorkspace from './components/workspaces/AdminWorkspace';

// Icons for onboarding sub-header
import { Building2, LogOut, Loader2 } from 'lucide-react';

import { ProfessionalContextProvider } from './context/ProfessionalContext';

export default function App() {
  return (
    <AuthProvider>
      <AnalysisContextProvider>
        <ProfessionalContextProvider>
          <ThemeProvider>
            <MarketAnalyticsProvider>
              <MainApp />
            </MarketAnalyticsProvider>
          </ThemeProvider>
        </ProfessionalContextProvider>
      </AnalysisContextProvider>
    </AuthProvider>
  );
}

function MainApp() {
  const { user, isLoading, logout } = useAuth();

  // Simple state router synced with hash for back/forward compatibility
  const [currentPath, setCurrentPath] = useState<PagePath>(() => {
    const hash = window.location.hash.replace('#', '') as PagePath;
    const validPaths: PagePath[] = [
      '/',
      '/solutions',
      '/ai-intelligence',
      '/pricing',
      '/about',
      '/contact',
      '/login',
      '/signup',
      '/verify-email',
      '/forgot-password',
      '/reset-password',
      '/select-role',
      '/select-subscription',
      '/setup-profile',
      '/investor',
      '/agent',
      '/admin',
    ];
    return validPaths.includes(hash) ? hash : '/';
  });

  const handleNavigate = (path: PagePath) => {
    setCurrentPath(path);
    window.location.hash = path;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as PagePath;
      const validPaths: PagePath[] = [
        '/',
        '/solutions',
        '/ai-intelligence',
        '/pricing',
        '/about',
        '/contact',
        '/login',
        '/signup',
        '/verify-email',
        '/forgot-password',
        '/reset-password',
        '/select-role',
        '/select-subscription',
        '/setup-profile',
        '/investor',
        '/agent',
        '/admin',
      ];
      if (validPaths.includes(hash)) {
        setCurrentPath(hash);
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // --- ROUTE GUARD AND AUTHENTICATION FLOW STATE MACHINE ---
  useEffect(() => {
    if (isLoading) return;

    const publicPaths: PagePath[] = ['/', '/solutions', '/ai-intelligence', '/pricing', '/about', '/contact'];
    const authPaths: PagePath[] = ['/login', '/signup', '/forgot-password', '/reset-password'];
    const onboardingPaths: PagePath[] = ['/verify-email', '/select-role', '/select-subscription', '/setup-profile'];
    const workspacePaths: PagePath[] = ['/investor', '/agent', '/admin'];

    // 1. Unauthenticated users trying to access protected paths
    if (!user) {
      if (onboardingPaths.includes(currentPath) || workspacePaths.includes(currentPath)) {
        handleNavigate('/login');
      }
      return;
    }

    // 2. Authenticated users with incomplete onboarding
    if (user.setupStage !== 'completed') {
      const stageToPathMap: Record<string, PagePath> = {
        'email-verification': '/verify-email',
        'role-selection': '/select-role',
        'subscription-selection': '/select-subscription',
        'profile-setup': '/setup-profile',
      };

      const correctPath = stageToPathMap[user.setupStage];
      if (currentPath !== correctPath) {
        handleNavigate(correctPath);
      }
      return;
    }

    // 3. Authenticated users with completed onboarding
    if (user.setupStage === 'completed') {
      // Trying to access login/signup or onboarding -> Redirect to their correct workspace
      if (authPaths.includes(currentPath) || onboardingPaths.includes(currentPath)) {
        const correctWorkspace = `/${user.role}` as PagePath;
        handleNavigate(correctWorkspace);
        return;
      }

      // Trying to access another role's workspace
      if (workspacePaths.includes(currentPath)) {
        const correctWorkspace = `/${user.role}` as PagePath;
        if (currentPath !== correctWorkspace) {
          handleNavigate(correctWorkspace);
        }
      }
    }
  }, [user, currentPath, isLoading]);

  // Loading indicator for restoring persistent sessions
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
        <p className="text-sm text-gray-500 font-medium">Securing ACOT Platform session...</p>
      </div>
    );
  }

  // Layout boundaries
  const isWorkspacePath = ['/investor', '/agent', '/admin'].includes(currentPath);
  const isOnboardingPath = ['/verify-email', '/select-role', '/select-subscription', '/setup-profile'].includes(currentPath);
  const isAuthOnlyPath = ['/login', '/signup', '/forgot-password', '/reset-password'].includes(currentPath);

  return (
    <div id="app-root" className="min-h-screen flex flex-col bg-white">
      {/* 1. NAVIGATION HEADER DECISION RAIL */}
      {!isWorkspacePath && !isOnboardingPath && (
        <Header currentPath={currentPath} onNavigate={handleNavigate} />
      )}

      {/* Simplified Header for Onboarding */}
      {isOnboardingPath && (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 py-4 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <button
              onClick={() => handleNavigate('/')}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-gray-900">
                ACOT<span className="text-indigo-600">.</span>
              </span>
            </button>

            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-400 font-mono hidden sm:block">
                Onboarding: {user?.email}
              </span>
              <button
                onClick={() => {
                  logout();
                  handleNavigate('/login');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-600 hover:text-red-600 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Abort & Log Out</span>
              </button>
            </div>
          </div>
        </header>
      )}

      {/* 2. MAIN PAGE ROUTER WITH TRANSITIONS */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPath}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {/* Public Pages */}
            {currentPath === '/' && <Home onNavigate={handleNavigate} />}
            {currentPath === '/solutions' && <Solutions onNavigate={handleNavigate} />}
            {currentPath === '/ai-intelligence' && <AIIntelligence onNavigate={handleNavigate} />}
            {currentPath === '/pricing' && <Pricing onNavigate={handleNavigate} />}
            {currentPath === '/about' && <About onNavigate={handleNavigate} />}
            {currentPath === '/contact' && <Contact />}

            {/* Authentication Pages */}
            {currentPath === '/login' && <Login onNavigate={handleNavigate} />}
            {currentPath === '/signup' && <SignUp onNavigate={handleNavigate} />}
            {currentPath === '/forgot-password' && <ForgotPassword onNavigate={handleNavigate} />}
            {currentPath === '/reset-password' && <ResetPassword onNavigate={handleNavigate} />}

            {/* Onboarding Pages */}
            {currentPath === '/verify-email' && <VerifyEmail onNavigate={handleNavigate} />}
            {currentPath === '/select-role' && <RoleSelection onNavigate={handleNavigate} />}
            {currentPath === '/select-subscription' && <SubscriptionSelection onNavigate={handleNavigate} />}
            {currentPath === '/setup-profile' && <ProfileSetup onNavigate={handleNavigate} />}

            {/* Workspaces */}
            {currentPath === '/investor' && <InvestorWorkspace onNavigate={handleNavigate} />}
            {currentPath === '/agent' && <AgentWorkspace onNavigate={handleNavigate} />}
            {currentPath === '/admin' && <AdminWorkspace onNavigate={handleNavigate} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. PERSISTENT FOOTER DECISION RAIL */}
      {!isWorkspacePath && !isOnboardingPath && !isAuthOnlyPath && (
        <Footer onNavigate={handleNavigate} />
      )}
    </div>
  );
}
