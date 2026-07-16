import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { useProfessionalContext } from '../../context/ProfessionalContext';
import { PagePath } from '../../types';
import { AgentService, AgentVerification, CompanyBranding, VerificationStatus } from '../../services/agentService';
import { ProfessionalAuditService, ProfessionalPermissionService } from '../../services/professionalIntegrationService';

// Import existing investor modules for full reuse
import MarketAnalytics from './MarketAnalytics';
import TransactionIntelligence from './TransactionIntelligence';
import MapsGeospatial from './MapsGeospatial';
import RentalIntelligence from './RentalIntelligence';
import AIIntelligenceSuite from './AIIntelligenceSuite';
import InvestorTools from './InvestorTools';
import ReportsEngine from './ReportsEngine';
import ProposalEngine from './ProposalEngine';
import WatchlistsView from './WatchlistsView';
import NotificationsView from './NotificationsView';
import AccountPreferencesView from './AccountPreferencesView';

import {
  LayoutDashboard,
  TrendingUp,
  FileText,
  Map,
  Home,
  Sparkles,
  Calculator,
  FileDown,
  Star,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  Search,
  Building2,
  ChevronDown,
  CheckCircle2,
  Circle,
  ShieldCheck,
  ArrowRight,
  Globe,
  X,
  Menu,
  Check,
  ExternalLink,
  Lock,
  Unlock,
  Plus,
  RefreshCw,
  Trash2,
  Eye,
  Mail,
  Phone,
  MapPin,
  Clock,
  Briefcase,
  AlertTriangle,
  Upload,
  File,
  Paintbrush
} from 'lucide-react';

import ReraVerification from './ReraVerification';
import { CompanyBrandingConfig } from './CompanyBrandingConfig';

interface AgentWorkspaceProps {
  onNavigate: (path: PagePath) => void;
}

export default function AgentWorkspace({ onNavigate }: AgentWorkspaceProps) {
  const { user, logout } = useAuth();
  
  // Sidebar state
  const [activeSidebarItem, setActiveSidebarItem] = useState<string>('Agent Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const {
    verification: contextVerification,
    setVerification: setContextVerification,
    branding: contextBranding,
    setBranding: setContextBranding,
    hasProfAccess,
  } = useProfessionalContext();

  const [verification, setVerificationState] = useState<AgentVerification>(contextVerification || AgentService.getVerificationStatus());
  const [branding, setBrandingState] = useState<CompanyBranding>(contextBranding || AgentService.getBranding());

  const setVerification = (v: AgentVerification) => {
    setVerificationState(v);
    setContextVerification(v);
  };

  const setBranding = (b: CompanyBranding) => {
    setBrandingState(b);
    setContextBranding(b);
  };

  const [demoMode, setDemoMode] = useState<boolean>(AgentService.getDemoMode());

  // Toast notifications state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerToast = (message: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(message);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Sync state on mount and register listeners
  useEffect(() => {
    if (contextVerification) {
      setVerificationState(contextVerification);
    }
  }, [contextVerification]);

  useEffect(() => {
    if (contextBranding) {
      setBrandingState(contextBranding);
    }
  }, [contextBranding]);

  useEffect(() => {
    const handleBrandingUpdate = () => {
      setBranding(AgentService.getBranding());
    };
    const handleVerificationUpdate = () => {
      setVerification(AgentService.getVerificationStatus());
    };
    const handleDemoModeUpdate = () => {
      setDemoMode(AgentService.getDemoMode());
    };

    window.addEventListener('acot_agent_branding_updated', handleBrandingUpdate);
    window.addEventListener('acot_agent_verification_updated', handleVerificationUpdate);
    window.addEventListener('acot_demo_mode_changed', handleDemoModeUpdate);

    return () => {
      window.removeEventListener('acot_agent_branding_updated', handleBrandingUpdate);
      window.removeEventListener('acot_agent_verification_updated', handleVerificationUpdate);
      window.removeEventListener('acot_demo_mode_changed', handleDemoModeUpdate);
    };
  }, []);

  // Audit log for Professional Login on mount
  useEffect(() => {
    if (user) {
      ProfessionalAuditService.logEvent(user.id, 'Professional Login', {
        email: user.email,
        role: user.role,
        timestamp: new Date().toISOString()
      });
    }
  }, [user]);

  // Audit log for Verification Completed
  useEffect(() => {
    if (user && verification && verification.status === 'VERIFIED') {
      ProfessionalAuditService.logEvent(user.id, 'Verification Completed', {
        fullName: verification.fullName,
        licenseNumber: verification.licenseNumber,
        companyName: verification.companyName,
        timestamp: new Date().toISOString()
      });
    }
  }, [verification?.status, user]);

  const handleLogout = () => {
    logout();
    onNavigate('/');
  };

  const isVerified = verification.status === 'VERIFIED';
  const isPending = verification.status === 'PENDING';

  // Quick helper to bypass verification for testing
  const triggerDemoBypass = () => {
    const updated: AgentVerification = {
      ...verification,
      status: 'VERIFIED',
      fullName: 'Ahmed Mohammed',
      brokerageName: 'ABC Realty Dubai',
      licenseNumber: 'RERA-123456',
      designation: 'Senior Investment Director',
      companyName: 'ABC Realty',
      expiryDate: '2028-06-15',
      verifiedAt: new Date().toISOString().split('T')[0],
      professionalAccess: true,
      verifiedAgent: true
    };
    AgentService.submitVerification(updated);
    // Auto-approve in local storage
    localStorage.setItem('acot_agent_verification_info', JSON.stringify(updated));
    setVerification(updated);
    window.dispatchEvent(new Event('acot_agent_verification_updated'));
    triggerToast('Demo Bypass: Account verified instantly!');
  };

  // Reset verification for demo
  const resetVerificationStatus = () => {
    const updated: AgentVerification = {
      status: 'NOT_SUBMITTED',
      fullName: '',
      companyName: '',
      designation: '',
      brokerageName: '',
      licenseNumber: '',
      expiryDate: '',
    };
    localStorage.setItem('acot_agent_verification_info', JSON.stringify(updated));
    setVerification(updated);
    window.dispatchEvent(new Event('acot_agent_verification_updated'));
    triggerToast('Verification reset for demonstration.');
  };

  // Active module navigation callback for children
  const handleChildNavigation = (moduleName: string) => {
    setActiveSidebarItem(moduleName);
  };

  // ==========================================
  // RENDER MODULES
  // ==========================================

  // 3. Agent Bento Dashboard Module
  const renderAgentDashboard = () => {
    return (
      <div className="space-y-6">
        {/* Dynamic header welcome section */}
        <div className="bg-slate-900 rounded-[2.5rem] p-6 md:p-8 text-white relative overflow-hidden shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
          
          <div className="space-y-3 relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-1 bg-indigo-500/15 text-indigo-300 font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border border-indigo-500/25">
              <Sparkles className="w-3 h-3" />
              Central Broker Control Room
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
              Welcome Back, {user?.name || 'Ahmed Mohammed'}
            </h1>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              Access grounded real estate analytics, property registry gates, and customize white-label dossiers to drive global institutional capital.
            </p>
          </div>

          <div className="shrink-0 relative z-10 bg-slate-800/80 border border-slate-700/50 p-4.5 rounded-2xl flex flex-col gap-2 min-w-[200px]">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Account Status</span>
            <div className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${isVerified ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
              <span className="text-xs font-extrabold">{isVerified ? 'Verified RERA Broker' : 'Verification Gated'}</span>
            </div>
            {!isVerified && (
              <button
                onClick={() => setActiveSidebarItem('RERA Verification')}
                className="mt-2 text-center py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[10px] uppercase rounded-xl transition-colors cursor-pointer"
              >
                Submit License
              </button>
            )}
          </div>
        </div>

        {/* DEMO ACCENT INFO BANNER */}
        {demoMode && (
          <div className="bg-indigo-50/60 border border-indigo-100/50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-900">Demo Active (`Ahmed Mohammed` at ABC Realty)</span>
                <p className="text-[11px] text-slate-500">
                  You are logged into a demo agent account. Use the buttons below or top bar to simulate RERA verification status checks instantly.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isVerified ? (
                <button
                  onClick={triggerDemoBypass}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg cursor-pointer transition-colors"
                >
                  Auto-Verify Account
                </button>
              ) : (
                <button
                  onClick={resetVerificationStatus}
                  className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-[10px] font-bold py-1.5 px-3 rounded-lg cursor-pointer transition-colors"
                >
                  Simulate Gated Lock
                </button>
              )}
            </div>
          </div>
        )}

        {/* BENTO STATS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Client Dossiers Exported', val: '18', color: 'indigo', subtitle: 'Automated white-label reports' },
            { label: 'Verified Listing Access', val: isVerified ? 'UNLOCKED' : 'GATED', color: isVerified ? 'emerald' : 'amber', subtitle: 'RERA registry keys' },
            { label: 'Active Capital Queries', val: '4.2M AED', color: 'indigo', subtitle: 'Investor watchlist value' },
            { label: 'DLD Registry Sync', val: '100% OK', color: 'emerald', subtitle: 'Real-time sales feed online' },
          ].map((s, idx) => (
            <div key={idx} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">{s.label}</span>
              <p className={`text-xl font-black ${
                s.color === 'emerald' ? 'text-emerald-600' : s.color === 'amber' ? 'text-amber-600 animate-pulse' : 'text-slate-900'
              }`}>{s.val}</p>
              <span className="text-[10px] text-slate-400 block leading-tight">{s.subtitle}</span>
            </div>
          ))}
        </div>

        {/* MAIN SPLIT PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* QUICK LINKS PANEL (7 Columns) */}
          <div className="lg:col-span-7 bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-50 pb-3 flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-indigo-600" />
              Central Module Routing Index
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Transactions', desc: 'Browse official sales registry transactions with RERA level gating.', icon: FileText, active: 'Transaction Intelligence' },
                { title: 'Market Intelligence', desc: 'Analyze capital growth vectors, volume triggers, and yields.', icon: TrendingUp, active: 'Market Analytics & Cycles' },
                { title: 'Maps', desc: 'Spatially track transactions with location intelligence filters.', icon: Map, active: 'Maps & Geospatial' },
                { title: 'Reports', desc: 'Compile professional PDF investment portfolios instantly.', icon: FileText, active: 'Reports Engine' },
                { title: 'Branding Configurator', desc: 'Upload brokerage logo, define customized reports accent colors.', icon: Paintbrush, active: 'Company Branding' },
                { title: 'RERA Broker Registry', desc: 'Manage your active broker card and verification lineage details.', icon: ShieldCheck, active: 'RERA Verification' },
              ].map((m, idx) => {
                const Icon = m.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveSidebarItem(m.active)}
                    className="group text-left p-4 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl transition-all hover:scale-[1.01] flex items-start gap-3 cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white text-indigo-600 flex items-center justify-center shrink-0 border border-slate-100 shadow-sm group-hover:text-indigo-700">
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{m.title}</h4>
                      <p className="text-[10px] text-slate-500 leading-relaxed">{m.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RECENT ACTIVITIES & PREVIEW FEED (5 Columns) */}
          <div className="lg:col-span-5 bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-50 pb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              Live Broker Registry Activity
            </h3>

            <div className="space-y-3">
              {[
                { actor: 'Ahmed Mohammed', action: 'Customized Dossier Cover Accent to Gold Swatch', time: '14 mins ago' },
                { actor: 'ACOT Ledger Node', action: 'Synced 148 sales transactions from DLD Hub', time: '1 hour ago' },
                { actor: 'Ahmed Mohammed', action: 'Downloaded Downtown Dubai Investment Dossier (PDF)', time: '3 hours ago' },
                { actor: 'RERA Registry System', action: 'Verification check passed successfully (BR-123456)', time: 'Yesterday' },
              ].map((act, idx) => (
                <div key={idx} className="flex gap-3 items-start border-b border-slate-50 pb-3 last:border-b-0 last:pb-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0"></div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-800">{act.actor}</p>
                    <p className="text-[10px] text-slate-500 leading-tight">{act.action}</p>
                    <span className="text-[9px] text-slate-400 block font-mono">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* QUICK BRAND PREVIEW BUTTON */}
            <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50 text-center space-y-2">
              <span className="text-[10px] font-mono text-indigo-700 font-extrabold uppercase block">LIVE WHITELABEL ENGINE READY</span>
              <p className="text-[10px] text-slate-500 leading-tight">
                Your report cover is currently accented in <strong className="text-indigo-950 font-mono">{branding.primaryColor}</strong> with logo: <strong className="truncate block text-[9px] text-slate-400">{branding.companyName}</strong>
              </p>
              <button
                onClick={() => setActiveSidebarItem('Company Branding')}
                className="inline-flex items-center gap-1 text-[10px] font-black text-indigo-600 bg-white hover:bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
              >
                <span>Edit Branding Parameters</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  };

  // ==========================================
  // SIDEBAR NAVIGATION LIST
  // ==========================================
  const navigationGroups = [
    {
      group: 'Main Office',
      items: [
        { name: 'Agent Dashboard', icon: LayoutDashboard },
      ]
    },
    {
      group: 'Market Intelligence',
      items: [
        { name: 'Market Analytics & Cycles', label: 'Market Intelligence', icon: TrendingUp },
        { name: 'Transaction Intelligence', label: 'Transactions', icon: FileText },
        { name: 'Maps & Geospatial', label: 'Maps', icon: Map },
        { name: 'Rental Intelligence', label: 'Rental Research', icon: Home },
      ]
    },
    {
      group: 'Brokerage Utilities',
      items: [
        { name: 'AI Intelligence Suite', label: 'AI Analyst', icon: Sparkles },
        { name: 'Tools & Calculators', label: 'Investor Tools', icon: Calculator },
        { name: 'Proposal Engine', label: 'Client Proposals', icon: FileText },
        { name: 'Reports Engine', label: 'Reports', icon: FileDown },
      ]
    },
    {
      group: 'Agency Credentials',
      items: [
        { name: 'RERA Verification', icon: ShieldCheck, badge: isVerified ? 'VERIFIED' : isPending ? 'PENDING' : 'LOCKED' },
        { name: 'Company Branding', icon: Paintbrush },
      ]
    },
    {
      group: 'My Workspace',
      items: [
        { name: 'Watchlists', icon: Star },
        { name: 'Notifications', icon: Bell },
        { name: 'Account & Preferences', icon: Settings },
      ]
    }
  ];

  // Active view router logic
  const renderActiveModule = () => {
    switch (activeSidebarItem) {
      case 'Agent Dashboard':
        return renderAgentDashboard();
      case 'Market Analytics & Cycles':
        return <MarketAnalytics onNavigateToModule={handleChildNavigation} triggerToast={triggerToast} />;
      case 'Transaction Intelligence':
        return <TransactionIntelligence onNavigateToModule={handleChildNavigation} triggerToast={triggerToast} />;
      case 'Maps & Geospatial':
        return <MapsGeospatial onNavigateToModule={handleChildNavigation} triggerToast={triggerToast} />;
      case 'Rental Intelligence':
        return <RentalIntelligence onNavigateToModule={handleChildNavigation} triggerToast={triggerToast} />;
      case 'AI Intelligence Suite':
        return <AIIntelligenceSuite onNavigateToModule={handleChildNavigation} triggerToast={triggerToast} />;
      case 'Tools & Calculators':
        return <InvestorTools onNavigateToModule={handleChildNavigation} triggerToast={triggerToast} />;
      case 'Proposal Engine':
        return <ProposalEngine onNavigateToModule={handleChildNavigation} triggerToast={triggerToast} />;
      case 'Reports Engine':
        return <ReportsEngine onNavigateToModule={handleChildNavigation} triggerToast={triggerToast} />;
      case 'RERA Verification':
        return (
          <ReraVerification
            verification={verification}
            setVerification={setVerification}
            triggerToast={triggerToast}
            user={user}
            triggerDemoBypass={triggerDemoBypass}
            resetVerificationStatus={resetVerificationStatus}
            setActiveSidebarItem={setActiveSidebarItem}
          />
        );
      case 'Company Branding':
        return (
          <CompanyBrandingConfig
            branding={branding}
            onBrandingSave={(updated) => {
              AgentService.saveBranding(updated);
              setBranding(updated);
              if (user) {
                ProfessionalAuditService.logEvent(user.id, 'Company Branding Updated', {
                  companyName: updated.companyName,
                  primaryColor: updated.primaryColor,
                  timestamp: new Date().toISOString()
                });
              }
              window.dispatchEvent(new Event('acot_agent_branding_updated'));
            }}
            triggerToast={triggerToast}
            verification={verification}
          />
        );
      case 'Watchlists':
        return <WatchlistsView onNavigateToModule={handleChildNavigation} triggerToast={triggerToast} />;
      case 'Notifications':
        return <NotificationsView onNavigateToModule={handleChildNavigation} triggerToast={triggerToast} />;
      case 'Account & Preferences':
        return <AccountPreferencesView onNavigateToModule={handleChildNavigation} triggerToast={triggerToast} />;
      default:
        return renderAgentDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans relative antialiased">
      
      {/* 1. ASYNC FLOATING TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-slate-800 text-white font-sans text-xs font-bold py-3.5 px-6 rounded-2xl shadow-xl flex items-center gap-2.5 max-w-sm w-full"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></div>
            <p className="flex-1 text-left leading-relaxed">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. SIDEBAR NAVIGATION */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-100 flex flex-col transition-transform duration-300 transform lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Sidebar Header Logo */}
        <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-slate-900/10">
              A
            </div>
            <div>
              <span className="font-sans font-black tracking-wider text-slate-900 text-xs uppercase block">ACOT Platform</span>
              <span className="font-mono text-[9px] text-slate-400 block uppercase tracking-widest font-black leading-none mt-0.5">Central Hub</span>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Card Summary Widget */}
        <div className="p-4.5 border-b border-slate-50 bg-slate-50/20 shrink-0">
          <div className="flex items-center gap-3 bg-white border border-slate-100 p-3 rounded-2xl">
            <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs shrink-0 border border-indigo-100">
              {user?.name?.slice(0, 2).toUpperCase() || 'AM'}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-black text-slate-800 block truncate">{user?.name || 'Ahmed Mohammed'}</span>
              <span className="text-[9px] text-slate-400 font-mono block truncate uppercase">{user?.role} Access Mode</span>
            </div>
          </div>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {navigationGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1.5">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-3.5 block mb-1">
                {group.group}
              </span>
              <div className="space-y-0.5">
                {group.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  const isActive = activeSidebarItem === item.name;
                  return (
                    <button
                      key={itemIdx}
                      onClick={() => {
                        setActiveSidebarItem(item.name);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between py-2 px-3.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label || item.name}</span>
                      </div>
                      
                      {item.badge && (
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md ${
                          item.badge === 'VERIFIED'
                            ? isActive ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700'
                            : item.badge === 'PENDING'
                            ? isActive ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700'
                            : isActive ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Sidebar Operations */}
        <div className="p-4 border-t border-slate-50 space-y-2 shrink-0">
          <button
            onClick={() => triggerToast('Central Help Support Desk: Please message support@acot-analytics.ae')}
            className="w-full flex items-center gap-3 py-2 px-3.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Support Desk</span>
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 py-2 px-3.5 rounded-xl text-xs font-semibold text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out Account</span>
          </button>
        </div>
      </aside>

      {/* 3. RIGHT PANEL CONTAINER */}
      <div className="flex-1 min-h-screen flex flex-col lg:pl-64">
        
        {/* Header toolbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-100 h-16 px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-50 text-slate-500 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Quick module state search proxy */}
            <div className="relative max-w-md w-full hidden md:block">
              <button
                onClick={() => setSearchOpen(true)}
                className="w-full bg-slate-50 border border-slate-100 hover:border-slate-200 text-slate-400 hover:text-slate-600 rounded-xl py-2 px-4 text-xs text-left flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-slate-400" />
                  <span>Search registry, areas, reports, or assets...</span>
                </div>
                <kbd className="hidden lg:inline-flex items-center gap-0.5 bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px] text-slate-400 font-mono font-medium shadow-sm leading-none">
                  ⌘ K
                </kbd>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Demo Verification Bypass Switch */}
            {demoMode && (
              <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Demo Bypass:</span>
                <button
                  onClick={isVerified ? resetVerificationStatus : triggerDemoBypass}
                  className={`text-[9px] font-black px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                    isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {isVerified ? 'VERIFIED (Auto)' : 'LOCKED (Click)'}
                </button>
              </div>
            )}

            {/* Notifications Button */}
            <button
              onClick={() => setActiveSidebarItem('Notifications')}
              className="p-2.5 rounded-xl bg-slate-50 border border-slate-100/50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all cursor-pointer relative"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-600"></span>
            </button>

            {/* Profile Avatar Trigger */}
            <button
              onClick={() => setActiveSidebarItem('Account & Preferences')}
              className="flex items-center gap-2.5 text-left hover:opacity-90 cursor-pointer"
            >
              <div className="w-8.5 h-8.5 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs border border-slate-800">
                {user?.name?.slice(0, 1).toUpperCase() || 'A'}
              </div>
              <div className="hidden sm:block">
                <span className="text-xs font-black text-slate-800 block truncate leading-tight">{user?.name || 'Ahmed Mohammed'}</span>
                <span className="text-[9px] text-slate-400 block leading-none truncate">{branding.companyName}</span>
              </div>
            </button>
          </div>
        </header>

        {/* Global Search Dialog Modal */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-start justify-center pt-24 p-4"
              onClick={() => setSearchOpen(false)}
            >
              <motion.div
                initial={{ y: -16 }}
                animate={{ y: 0 }}
                exit={{ y: -16 }}
                className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-100 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                  <Search className="w-5 h-5 text-slate-400" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search modules, registry logs, or assets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-sm font-medium text-slate-800 transition-all outline-none"
                  />
                  <button onClick={() => setSearchOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>
                
                <div className="p-4.5 max-h-64 overflow-y-auto space-y-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Recommended Modules</span>
                  <div className="space-y-1">
                    {[
                      { name: 'Transactions', desc: 'Browse sales registry logs and parcel IDs.', route: 'Transaction Intelligence' },
                      { name: 'Market Intelligence', desc: 'Sovereign-grade pricing cycles and growth charts.', route: 'Market Analytics & Cycles' },
                      { name: 'Reports', desc: 'White-label PDF document export configurations.', route: 'Reports Engine' },
                      { name: 'Company Branding', desc: 'Define your company logos, accent colors, and websites.', route: 'Company Branding' },
                    ].map((rec) => (
                      <button
                        key={rec.name}
                        onClick={() => {
                          setActiveSidebarItem(rec.route);
                          setSearchOpen(false);
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer"
                      >
                        <div>
                          <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 block">{rec.name}</span>
                          <span className="text-[10px] text-slate-400 block">{rec.desc}</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600" />
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. DYNAMIC MODULE OUTLET AREA */}
        <main className="flex-1 p-6 md:p-8 max-w-[1400px] w-full mx-auto">
          {renderActiveModule()}
        </main>
      </div>
    </div>
  );
}
