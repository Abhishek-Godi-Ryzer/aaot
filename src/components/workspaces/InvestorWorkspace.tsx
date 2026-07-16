import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { PagePath } from '../../types';
import MarketAnalytics from './MarketAnalytics';
import MarketAnalyticsContextPanel from './MarketAnalyticsContextPanel';
import ModulePlaceholder from './ModulePlaceholder';
import TransactionIntelligence from './TransactionIntelligence';
import TransactionIntelligenceContextPanel from './TransactionIntelligenceContextPanel';
import MapsGeospatial from './MapsGeospatial';
import MapsGeospatialContextPanel from './MapsGeospatialContextPanel';
import RentalIntelligence from './RentalIntelligence';
import RentalIntelligenceContextPanel from './RentalIntelligenceContextPanel';
import AIIntelligenceSuite from './AIIntelligenceSuite';
import AIIntelligenceContextPanel from './AIIntelligenceContextPanel';
import InvestorTools from './InvestorTools';
import InvestorToolsContextPanel from './InvestorToolsContextPanel';
import ReportsEngine from './ReportsEngine';
import ReportsContextPanel from './ReportsContextPanel';
import WatchlistsView from './WatchlistsView';
import WatchlistsContextPanel from './WatchlistsContextPanel';
import NotificationsView from './NotificationsView';
import NotificationsContextPanel from './NotificationsContextPanel';
import AccountPreferencesView from './AccountPreferencesView';
import AccountPreferencesContextPanel from './AccountPreferencesContextPanel';
import { WorkspaceService } from '../../services/workspaceService';
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
  Cpu,
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
  ArrowUpRight,
  Maximize2,
  MessageSquare
} from 'lucide-react';

interface InvestorWorkspaceProps {
  onNavigate: (path: PagePath) => void;
}

interface Community {
  id: string;
  name: string;
  avgPrice: number;
  growth: string;
  image: string;
  description: string;
  keyMetric: string;
  yield: string;
}

const COMMUNITIES: Community[] = [
  {
    id: 'dubai-marina',
    name: 'Dubai Marina',
    avgPrice: 1654,
    growth: '↑ 4.8%',
    image: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?auto=format&fit=crop&w=600&h=400&q=80',
    description: 'A world-famous waterfront master development known for its iconic luxury residential skyscrapers, upscale dining, and leisure attractions along the marina canal.',
    keyMetric: '92% Occupancy Rate',
    yield: '7.2% Avg Yield'
  },
  {
    id: 'business-bay',
    name: 'Business Bay',
    avgPrice: 1512,
    growth: '↑ 3.6%',
    image: 'https://images.unsplash.com/photo-1546412414-8035e1776c9a?auto=format&fit=crop&w=600&h=400&q=80',
    description: 'The contemporary commercial and residential hub of Dubai, nestled alongside the Dubai Canal, featuring stylish high-rises and seamless connectivity.',
    keyMetric: '88% Occupancy Rate',
    yield: '6.8% Avg Yield'
  },
  {
    id: 'downtown-dubai',
    name: 'Downtown Dubai',
    avgPrice: 2349,
    growth: '↑ 5.2%',
    image: 'https://images.unsplash.com/photo-1526495124232-a04e18491f5a?auto=format&fit=crop&w=600&h=400&q=80',
    description: 'The ultra-luxury heart of the city, surrounding the world\'s tallest tower (Burj Khalifa), the Dubai Mall, and Dubai Opera, yielding exceptional capital growth.',
    keyMetric: '94% Occupancy Rate',
    yield: '5.9% Avg Yield'
  },
  {
    id: 'palm-jumeirah',
    name: 'Palm Jumeirah',
    avgPrice: 2101,
    growth: '↑ 2.7%',
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=600&h=400&q=80',
    description: 'The spectacular palm-shaped archipelago offering prime beachfront villas, high-end penthouses, super-luxury beach clubs, and ultra-premium resort amenities.',
    keyMetric: '96% Occupancy Rate',
    yield: '6.1% Avg Yield'
  },
  {
    id: 'jumeirah-village-circle',
    name: 'Jumeirah Village Circle',
    avgPrice: 1067,
    growth: '↑ 3.1%',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&h=400&q=80',
    description: 'A serene family-centric sub-market presenting beautiful landscaped parks, modern townhouses, and competitive entry prices coupled with unmatched rental yields.',
    keyMetric: '91% Occupancy Rate',
    yield: '8.4% Avg Yield'
  }
];

export default function InvestorWorkspace({ onNavigate }: InvestorWorkspaceProps) {
  const { user, logout } = useAuth();

  // Navigation and Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSidebarItem, setActiveSidebarItem] = useState('Dashboard');

  // Preferences
  const [selectedMarket, setSelectedMarket] = useState('Dubai');
  const [selectedCurrency, setSelectedCurrency] = useState('AED');
  const [selectedUnit, setSelectedUnit] = useState('sqft');

  // UI state overlays
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(() => 
    WorkspaceService.getNotifications().filter(n => !n.read).length
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modular active preview states
  const [activeTransitionModule, setActiveTransitionModule] = useState<{
    name: string;
    description: string;
    scope: string;
    status: string;
  } | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiChatQuery, setAiChatQuery] = useState('');
  const [aiChatReply, setAiChatReply] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const getPlaceholderIcon = (itemName: string) => {
    switch (itemName) {
      case 'Transaction Intelligence': return FileText;
      case 'Maps & Geospatial': return Map;
      case 'Rental Intelligence': return Home;
      case 'AI Intelligence Suite': return Sparkles;
      case 'Investor Tools & Calculators': return Calculator;
      case 'Reports Engine': return FileDown;
      default: return Cpu;
    }
  };

  // Preference Dropdown toggles
  const [marketDrop, setMarketDrop] = useState(false);
  const [currencyDrop, setCurrencyDrop] = useState(false);
  const [unitDrop, setUnitDrop] = useState(false);

  // Interactive Checklist (Getting Started)
  const [checklist, setChecklist] = useState([
    { id: 'profile', label: 'Complete your profile', desc: 'Tell us about yourself', done: true },
    { id: 'search', label: 'Search your first community', desc: 'Discover market opportunities', done: false },
    { id: 'watchlist', label: 'Save your first watchlist', desc: 'Track communities or projects', done: false },
    { id: 'report', label: 'Generate your first report', desc: 'Create a market report', done: false },
    { id: 'ai', label: 'Ask the AI Analyst', desc: 'Get AI-powered insights', done: false }
  ]);

  // Command-K keyboard event listener for Global Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync Notifications unread count dynamically
  useEffect(() => {
    const syncUnreadCount = () => {
      const list = WorkspaceService.getNotifications();
      setUnreadCount(list.filter(n => !n.read).length);
    };
    syncUnreadCount();
    window.addEventListener('acot_notifications_updated', syncUnreadCount);
    return () => window.removeEventListener('acot_notifications_updated', syncUnreadCount);
  }, []);

  // Event listener for cross-module bottom-panel handoff routing
  useEffect(() => {
    const handleSidebarRoute = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setActiveSidebarItem(customEvent.detail);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('acot-sidebar-route', handleSidebarRoute);
    return () => window.removeEventListener('acot-sidebar-route', handleSidebarRoute);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleSidebarClick = (item: string, lockedInfo?: { description: string; scope: string; status: string }) => {
    setActiveSidebarItem(item);
    setActiveTransitionModule(null);
  };

  const markChecklistDone = (id: string) => {
    setChecklist(prev =>
      prev.map(item => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  const handleCommunityExplore = (community: Community) => {
    setSelectedCommunity(community);
    // Auto-complete the search checklist item
    setChecklist(prev =>
      prev.map(item => (item.id === 'search' ? { ...item, done: true } : item))
    );
  };

  const handleWatchlistAction = (communityName: string) => {
    triggerToast(`Added ${communityName} to your Watchlist.`);
    setChecklist(prev =>
      prev.map(item => (item.id === 'watchlist' ? { ...item, done: true } : item))
    );
  };

  const handleSimulateReport = () => {
    triggerToast('Preparing PDF Report... Download will begin shortly.');
    setTimeout(() => {
      triggerToast('Report downloaded: ACOT_Dubai_Market_Brief_Q2_2026.pdf');
      setChecklist(prev =>
        prev.map(item => (item.id === 'report' ? { ...item, done: true } : item))
      );
    }, 1500);
  };

  const handleAskAIAnalyst = (question: string) => {
    setAiLoading(true);
    setAiChatReply(null);
    setAiChatQuery(question);
    setChecklist(prev =>
      prev.map(item => (item.id === 'ai' ? { ...item, done: true } : item))
    );

    // Simulate smart real estate response with a short delay
    setTimeout(() => {
      let answer = '';
      if (question.includes('yield')) {
        answer = 'According to our Q2 2026 transaction audits, Jumeirah Village Circle (JVC) leads major Dubai master communities with an average net rental yield of 8.4% for mid-market studios and 1-bed apartments, followed by Business Bay at 6.8%.';
      } else if (question.includes('Downtown') || question.includes('cycle')) {
        answer = 'Downtown Dubai resides in an expansionary phase of Cycle Wave 3, characterized by sustained transaction volume and a year-on-year capital appreciation rate of +5.2%. Demand is driven primarily by international high-net-worth individuals and capital seeking stable safe-havens.';
      } else if (question.includes('Palm')) {
        answer = 'The Palm Jumeirah luxury villa sector continues to trade at a premium ceiling. Current average transaction pricing stands at AED 2,101 per sqft. While capital appreciation has stabilized to +2.7% per annum, luxury tenant demand has kept occupancy at an exceptional 96%.';
      } else {
        answer = 'ACOT\'s AI Engine analyzes over 120,000 official DLD records weekly. For best results, ask our model about community yields, historical price cycles, or transaction trends.';
      }
      setAiChatReply(answer);
      setAiLoading(false);
    }, 1200);
  };

  // Compute checklist progress
  const completedCount = checklist.filter(item => item.done).length;

  // Filtered search results for Global Search
  const filteredCommunities = COMMUNITIES.filter(comm =>
    comm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comm.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex relative overflow-hidden font-sans">
      
      {/* 1. LEFT SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-100 flex flex-col justify-between transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Top Branding Header */}
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/10">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900 block leading-none">
                  ACOT<span className="text-indigo-600">.</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block mt-1">
                  Investor Platform
                </span>
              </div>
            </div>
            {/* Mobile close sidebar button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-180px)]">
            
            {/* Main Dashboard item */}
            <div>
              <button
                onClick={() => {
                  setActiveSidebarItem('Dashboard');
                  setActiveTransitionModule(null);
                }}
                className={`w-full flex items-center gap-3 py-2.5 px-3.5 rounded-xl text-sm font-medium transition-all ${
                  activeSidebarItem === 'Dashboard'
                    ? 'bg-indigo-50/80 text-indigo-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
            </div>

            {/* GROUP 1: MARKET RESEARCH */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-slate-400 tracking-wider px-3 uppercase">
                Market Research
              </p>
              
              <button
                onClick={() => {
                  setActiveSidebarItem('Market Analytics & Cycles');
                  setActiveTransitionModule(null);
                }}
                className={`w-full flex items-center justify-between py-2.5 px-3.5 rounded-xl text-sm font-medium transition-all ${
                  activeSidebarItem === 'Market Analytics & Cycles'
                    ? 'bg-indigo-50/80 text-indigo-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                }`}
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5" />
                  <span>Market Intelligence</span>
                </div>
              </button>

              <button
                onClick={() => handleSidebarClick('Transaction Intelligence')}
                className={`w-full flex items-center justify-between py-2.5 px-3.5 rounded-xl text-sm font-medium transition-all ${
                  activeSidebarItem === 'Transaction Intelligence'
                    ? 'bg-indigo-50/80 text-indigo-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5" />
                  <span>Transactions</span>
                </div>
              </button>

              <button
                onClick={() => handleSidebarClick('Maps & Geospatial')}
                className={`w-full flex items-center justify-between py-2.5 px-3.5 rounded-xl text-sm font-medium transition-all ${
                  activeSidebarItem === 'Maps & Geospatial'
                    ? 'bg-indigo-50/80 text-indigo-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Map className="w-5 h-5" />
                  <span>Maps</span>
                </div>
              </button>

              <button
                onClick={() => handleSidebarClick('Rental Intelligence')}
                className={`w-full flex items-center justify-between py-2.5 px-3.5 rounded-xl text-sm font-medium transition-all ${
                  activeSidebarItem === 'Rental Intelligence'
                    ? 'bg-indigo-50/80 text-indigo-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Home className="w-5 h-5" />
                  <span>Rental Research</span>
                </div>
              </button>
            </div>

            {/* GROUP 2: INVESTMENT TOOLS */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-slate-400 tracking-wider px-3 uppercase">
                Investment Tools
              </p>

              <button
                onClick={() => handleSidebarClick('AI Intelligence Suite', {
                  description: 'Natural language interface with Dubai Land Department records. Ask complex real estate investment queries.',
                  scope: 'Interactive AI-powered analytical workspace.',
                  status: 'Scheduled for Milestone 2'
                })}
                className={`w-full flex items-center justify-between py-2.5 px-3.5 rounded-xl text-sm font-medium transition-all ${
                  activeSidebarItem === 'AI Intelligence Suite'
                    ? 'bg-indigo-50/80 text-indigo-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5" />
                  <span>AI Analyst</span>
                </div>
                <Lock className="w-3.5 h-3.5 text-slate-300" />
              </button>

              <button
                onClick={() => handleSidebarClick('Investor Tools & Calculators')}
                className={`w-full flex items-center justify-between py-2.5 px-3.5 rounded-xl text-sm font-medium transition-all ${
                  activeSidebarItem === 'Investor Tools & Calculators'
                    ? 'bg-indigo-50/80 text-indigo-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Calculator className="w-5 h-5" />
                  <span>Investor Tools</span>
                </div>
              </button>

              <button
                onClick={() => handleSidebarClick('Reports Engine')}
                className={`w-full flex items-center justify-between py-2.5 px-3.5 rounded-xl text-sm font-medium transition-all ${
                  activeSidebarItem === 'Reports Engine'
                    ? 'bg-indigo-50/80 text-indigo-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileDown className="w-5 h-5" />
                  <span>Reports</span>
                </div>
              </button>
            </div>

            {/* GROUP 3: MY WORKSPACE */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-slate-400 tracking-wider px-3 uppercase">
                My Workspace
              </p>

              <button
                onClick={() => {
                  setActiveSidebarItem('Watchlists');
                  triggerToast('Watchlists panel is ready. Toggle communities below to bookmark.');
                }}
                className={`w-full flex items-center justify-between py-2.5 px-3.5 rounded-xl text-sm font-medium transition-all ${
                  activeSidebarItem === 'Watchlists'
                    ? 'bg-indigo-50/80 text-indigo-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5" />
                  <span>Watchlists</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowNotifications(true);
                  setActiveSidebarItem('Notifications');
                }}
                className={`w-full flex items-center justify-between py-2.5 px-3.5 rounded-xl text-sm font-medium transition-all ${
                  activeSidebarItem === 'Notifications'
                    ? 'bg-indigo-50/80 text-indigo-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5" />
                  <span>Notifications</span>
                </div>
                {unreadCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setActiveSidebarItem('Account & Preferences');
                  triggerToast('Your personal settings and preference details are managed here.');
                }}
                className={`w-full flex items-center justify-between py-2.5 px-3.5 rounded-xl text-sm font-medium transition-all ${
                  activeSidebarItem === 'Account & Preferences'
                    ? 'bg-indigo-50/80 text-indigo-600 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5" />
                  <span>Account & Preferences</span>
                </div>
              </button>
            </div>

          </div>
        </div>

        {/* Bottom Panel */}
        <div className="p-4 border-t border-slate-50 space-y-2">
          <button
            onClick={() => triggerToast('ACOT Support: Please email support@acot-platform.com for assistance.')}
            className="w-full flex items-center gap-3 py-2 px-3 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <HelpCircle className="w-4.5 h-4.5" />
            <span>Help & Support</span>
          </button>
          
          <button
            onClick={() => {
              logout();
              onNavigate('/');
            }}
            className="w-full flex items-center gap-3 py-2 px-3 rounded-lg text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main container to the right of the sidebar */}
      <div className="flex-1 min-h-screen flex flex-col lg:pl-64">
        
        {/* 2. TOP HEADER */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-100 h-16 px-4 md:px-6 flex items-center justify-between shadow-sm">
          
          {/* Left section: Toggle and Search area */}
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-50 text-slate-500"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Global Search box */}
            <div className="relative max-w-md w-full hidden md:block">
              <button
                onClick={() => setSearchOpen(true)}
                className="w-full bg-slate-50 border border-slate-100 hover:border-slate-200 text-slate-400 hover:text-slate-600 rounded-xl py-2 px-4.5 text-xs text-left flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-slate-400" />
                  <span>Search area, community, project or property...</span>
                </div>
                <kbd className="hidden lg:inline-flex items-center gap-0.5 bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px] text-slate-400 font-mono font-medium shadow-sm leading-none">
                  ⌘ K
                </kbd>
              </button>
            </div>
          </div>

          {/* Right section: Selectors, Bell, Profile */}
          <div className="flex items-center gap-2 md:gap-4.5">
            
            {/* Mobile search button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="md:hidden p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Market selector drop */}
            <div className="relative">
              <button
                onClick={() => {
                  setMarketDrop(!marketDrop);
                  setCurrencyDrop(false);
                  setUnitDrop(false);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-medium text-slate-700 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline text-slate-400">Market</span>
                <span className="text-slate-800 font-semibold">{selectedMarket}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {marketDrop && (
                <div className="absolute right-0 mt-1.5 w-36 bg-white border border-slate-100 rounded-xl shadow-lg py-1 z-50">
                  {['Dubai', 'Abu Dhabi', 'Riyadh'].map(m => (
                    <button
                      key={m}
                      onClick={() => {
                        setSelectedMarket(m);
                        setMarketDrop(false);
                        triggerToast(`Switched market scope to ${m}.`);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-50 text-slate-700 font-medium"
                    >
                      {m}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Currency selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setCurrencyDrop(!currencyDrop);
                  setMarketDrop(false);
                  setUnitDrop(false);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-medium text-slate-700 transition-colors"
              >
                <span className="hidden sm:inline text-slate-400">Currency</span>
                <span className="text-slate-800 font-semibold">{selectedCurrency}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {currencyDrop && (
                <div className="absolute right-0 mt-1.5 w-28 bg-white border border-slate-100 rounded-xl shadow-lg py-1 z-50">
                  {['AED', 'USD', 'EUR', 'GBP'].map(c => (
                    <button
                      key={c}
                      onClick={() => {
                        setSelectedCurrency(c);
                        setCurrencyDrop(false);
                        triggerToast(`Base currency set to ${c}.`);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-50 text-slate-700 font-medium"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Unit selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setUnitDrop(!unitDrop);
                  setMarketDrop(false);
                  setCurrencyDrop(false);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs font-medium text-slate-700 transition-colors"
              >
                <span className="hidden sm:inline text-slate-400">Unit</span>
                <span className="text-slate-800 font-semibold">{selectedUnit}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {unitDrop && (
                <div className="absolute right-0 mt-1.5 w-24 bg-white border border-slate-100 rounded-xl shadow-lg py-1 z-50">
                  {['sqft', 'sqm'].map(u => (
                    <button
                      key={u}
                      onClick={() => {
                        setSelectedUnit(u);
                        setUnitDrop(false);
                        triggerToast(`Display unit updated to ${u}.`);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-50 text-slate-700 font-medium"
                    >
                      {u}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Bell icon and dropdown notifications */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors relative cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-indigo-600 rounded-full ring-2 ring-white"></span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl p-4 z-50 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                      <span className="text-xs font-bold text-slate-950">Recent Updates</span>
                      <button
                        onClick={() => {
                          setUnreadCount(0);
                          triggerToast('All notifications marked as read.');
                        }}
                        className="text-[10px] text-indigo-600 font-bold hover:underline"
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div className="space-y-2.5 max-h-60 overflow-y-auto">
                      <div className="p-2 hover:bg-slate-50 rounded-lg text-left transition-colors">
                        <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <span>DLD TRANSACTION ALERT</span>
                        </div>
                        <p className="text-[11px] text-slate-700 mt-0.5 leading-relaxed">
                          Off-plan premium apartment sold in Downtown Dubai for AED 4,200,000.
                        </p>
                      </div>
                      <div className="p-2 hover:bg-slate-50 rounded-lg text-left transition-colors">
                        <div className="flex items-center gap-1 text-[10px] font-semibold text-indigo-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                          <span>MARKET CYCLE TREND</span>
                        </div>
                        <p className="text-[11px] text-slate-700 mt-0.5 leading-relaxed">
                          JVC rental yields registered an average uptick of 0.3% this quarter.
                        </p>
                      </div>
                      <div className="p-2 hover:bg-slate-50 rounded-lg text-left transition-colors">
                        <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                          <span>SYSTEM WELCOME</span>
                        </div>
                        <p className="text-[11px] text-slate-700 mt-0.5 leading-relaxed">
                          Your premium investor workspace has been successfully provisioned.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Avatar / Menu */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 px-1.5 py-1 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer text-left"
              >
                <div className="w-8.5 h-8.5 rounded-full bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shadow-md shadow-indigo-600/15">
                  {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'AM'}
                </div>
                <div className="hidden lg:block">
                  <p className="text-xs font-bold text-slate-900 leading-none">
                    {user?.name || 'Ahmed Mohammed'}
                  </p>
                  <p className="text-[9px] text-slate-400 font-medium tracking-wider uppercase mt-1">
                    {user?.role || 'Investor'}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl py-1 z-50"
                  >
                    <div className="px-3.5 py-2 border-b border-slate-50">
                      <p className="text-[10px] text-slate-400 font-mono">Logged in as</p>
                      <p className="text-xs font-semibold text-slate-800 truncate">{user?.email}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        triggerToast('Settings update module is part of the next milestone.');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                    >
                      Account Settings
                    </button>
                    <button
                      onClick={() => {
                        triggerToast('Billing will be enabled on subscription upgrade module.');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                    >
                      Subscription Plan
                    </button>
                    
                    <div className="border-t border-slate-50 my-1"></div>
                    
                    <button
                      onClick={() => {
                        logout();
                        onNavigate('/');
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs text-red-600 hover:bg-red-50 font-bold transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </header>

        {/* 3. MAIN WORKSPACE CONTENT */}
        <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 overflow-y-auto">
          
          {/* LEFT COLUMN (MAIN CARDS) */}
          <main className={(activeSidebarItem === 'Rental Intelligence' || activeSidebarItem === 'AI Intelligence Suite' || activeSidebarItem === 'Investor Tools & Calculators') ? "lg:col-span-12 xl:col-span-12 space-y-6 md:space-y-8" : "lg:col-span-8 xl:col-span-9 space-y-6 md:space-y-8"}>
            {activeSidebarItem === 'Market Analytics & Cycles' ? (
              <MarketAnalytics
                onNavigateToModule={(mod) => handleSidebarClick(mod)}
                triggerToast={triggerToast}
              />
            ) : activeSidebarItem === 'Transaction Intelligence' ? (
              <TransactionIntelligence
                onNavigateToModule={(mod) => handleSidebarClick(mod)}
                triggerToast={triggerToast}
              />
            ) : activeSidebarItem === 'Maps & Geospatial' ? (
              <MapsGeospatial
                onNavigateToModule={(mod) => handleSidebarClick(mod)}
                triggerToast={triggerToast}
              />
            ) : activeSidebarItem === 'Rental Intelligence' ? (
              <RentalIntelligence
                onNavigateToModule={(mod) => handleSidebarClick(mod)}
                triggerToast={triggerToast}
              />
            ) : activeSidebarItem === 'AI Intelligence Suite' ? (
              <AIIntelligenceSuite
                onNavigateToModule={(mod) => handleSidebarClick(mod)}
                triggerToast={triggerToast}
              />
            ) : activeSidebarItem === 'Investor Tools & Calculators' ? (
              <InvestorTools
                onNavigateToModule={(mod) => handleSidebarClick(mod)}
                triggerToast={triggerToast}
              />
            ) : activeSidebarItem === 'Reports Engine' ? (
              <ReportsEngine
                onNavigateToModule={(mod) => handleSidebarClick(mod)}
                triggerToast={triggerToast}
              />
            ) : activeSidebarItem === 'Watchlists' ? (
              <WatchlistsView
                onNavigateToModule={(mod) => handleSidebarClick(mod)}
                triggerToast={triggerToast}
              />
            ) : activeSidebarItem === 'Notifications' ? (
              <NotificationsView
                onNavigateToModule={(mod) => handleSidebarClick(mod)}
                triggerToast={triggerToast}
              />
            ) : activeSidebarItem === 'Account & Preferences' ? (
              <AccountPreferencesView
                onNavigateToModule={(mod) => handleSidebarClick(mod)}
                triggerToast={triggerToast}
              />
            ) : (
              <>
                {/* SECTION 1: WELCOME HERO */}
            <section className="bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-50 rounded-full blur-3xl opacity-40"></div>
              
              <div className="space-y-4 md:max-w-md relative z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700">
                  <Sparkles className="w-3 h-3 animate-pulse" />
                  Welcome to ACOT
                </span>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight tracking-tight">
                  Let's start your investment journey in Dubai.
                </h1>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Access verified real estate intelligence and make confident, data-driven investment decisions.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs px-5 py-3 rounded-xl transition-all shadow-md shadow-indigo-600/10 active:scale-[0.98] cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    <span>Start Searching</span>
                  </button>
                  <button
                    onClick={() => handleSidebarClick('Market Analytics & Cycles', {
                      description: 'Track supply volumes, rental thresholds, price curves, and investment waves.',
                      scope: 'Customisable chart indexing and price analytics.',
                      status: 'Scheduled for Milestone 2'
                    })}
                    className="inline-flex items-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs px-5 py-3 rounded-xl transition-all cursor-pointer"
                  >
                    <span>Explore Market</span>
                    <TrendingUp className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Skyline Masked Image */}
              <div className="w-full md:w-[320px] lg:w-[420px] h-[180px] md:h-[240px] rounded-2xl overflow-hidden relative shadow-md shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80"
                  alt="Dubai Skyline Panorama"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
              </div>
            </section>

            {/* SECTION 2: QUICK ACCESS */}
            <section className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Quick Access</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                
                {/* CARD 1 */}
                <button
                  onClick={() => setSearchOpen(true)}
                  className="group bg-white p-5 rounded-2xl border border-slate-100 hover:border-indigo-100 text-left transition-all hover:shadow-md cursor-pointer flex flex-col justify-between min-h-[160px]"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Search className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">Search Dubai Market</h3>
                      <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                        Find communities, projects and properties.
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 flex items-center justify-between text-indigo-600 font-semibold text-[10px]">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">Launch Search</span>
                    <ArrowRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* CARD 2 */}
                <button
                  onClick={() => handleSidebarClick('Market Analytics & Cycles', {
                    description: 'Explore market trends, community performance, and price history in real-time.',
                    scope: 'Visual charts and historical trend indices.',
                    status: 'Scheduled for Milestone 2'
                  })}
                  className="group bg-white p-5 rounded-2xl border border-slate-100 hover:border-indigo-100 text-left transition-all hover:shadow-md cursor-pointer flex flex-col justify-between min-h-[160px]"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">Market Intelligence</h3>
                      <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                        Explore market trends, community performance, and price history.
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 flex items-center justify-between text-indigo-600 font-semibold text-[10px]">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">View Trends</span>
                    <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* CARD 3 */}
                <button
                  onClick={() => handleSidebarClick('Transaction Intelligence', {
                    description: 'Browse official Dubai transactions, daily real estate registrations, and market activity logs.',
                    scope: 'DLD property sales and purchase ledger.',
                    status: 'Scheduled for Milestone 2'
                  })}
                  className="group bg-white p-5 rounded-2xl border border-slate-100 hover:border-indigo-100 text-left transition-all hover:shadow-md cursor-pointer flex flex-col justify-between min-h-[160px]"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">Transactions</h3>
                      <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                        Browse official Dubai transactions and market activity.
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 flex items-center justify-between text-indigo-600 font-semibold text-[10px]">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">DLD Records</span>
                    <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* CARD 4 */}
                <button
                  onClick={() => handleSidebarClick('Rental Intelligence', {
                    description: 'Estimate rental yield on long term versus short term rentals backed by Ejari data.',
                    scope: 'Rental yield audits and historical rent indexes.',
                    status: 'Scheduled for Milestone 2'
                  })}
                  className="group bg-white p-5 rounded-2xl border border-slate-100 hover:border-indigo-100 text-left transition-all hover:shadow-md cursor-pointer flex flex-col justify-between min-h-[160px]"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Home className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">Rental Research</h3>
                      <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                        Analyze rental trends and estimate rental yield.
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 flex items-center justify-between text-indigo-600 font-semibold text-[10px]">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">Lease Trends</span>
                    <ArrowRight className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* CARD 5 */}
                <button
                  onClick={() => {
                    setAiChatOpen(true);
                    setAiChatReply(null);
                    setAiChatQuery('');
                  }}
                  className="group bg-white p-5 rounded-2xl border border-slate-100 hover:border-indigo-100 text-left transition-all hover:shadow-md cursor-pointer flex flex-col justify-between min-h-[160px]"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">AI Analyst</h3>
                      <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                        Get AI-powered market insights and investment recommendations.
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 flex items-center justify-between text-indigo-600 font-semibold text-[10px]">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">Consult AI</span>
                    <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

                {/* CARD 6 */}
                <button
                  onClick={() => {
                    handleSimulateReport();
                  }}
                  className="group bg-white p-5 rounded-2xl border border-slate-100 hover:border-indigo-100 text-left transition-all hover:shadow-md cursor-pointer flex flex-col justify-between min-h-[160px]"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                      <FileDown className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">Reports</h3>
                      <p className="text-[11px] text-slate-400 leading-relaxed mt-1">
                        Generate professional investment reports.
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 flex items-center justify-between text-indigo-600 font-semibold text-[10px]">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">Download PDF</span>
                    <ArrowRight className="w-4 h-4 text-sky-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>

              </div>
            </section>

            {/* SECTION 3: POPULAR COMMUNITIES */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Popular Communities in Dubai</h2>
                <button
                  onClick={() => {
                    triggerToast('Community listing directory scheduled for development in Milestone 2.');
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 group"
                >
                  <span>View all communities</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
                {COMMUNITIES.map(comm => (
                  <div
                    key={comm.id}
                    className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Image thumbnail */}
                      <div className="h-32 relative overflow-hidden bg-slate-100">
                        <img
                          src={comm.image}
                          alt={comm.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                        <button
                          onClick={() => handleWatchlistAction(comm.name)}
                          className="absolute top-2.5 right-2.5 p-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-400 hover:text-amber-500 transition-colors shadow-sm"
                        >
                          <Star className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Info body */}
                      <div className="p-3.5 space-y-2">
                        <h3 className="text-xs font-bold text-slate-900 truncate">{comm.name}</h3>
                        
                        <div className="space-y-1">
                          <p className="text-[10px] font-mono text-slate-400">Avg. Price (AED/sqft)</p>
                          <div className="flex items-baseline justify-between">
                            <span className="text-sm font-extrabold font-mono text-slate-800">
                              {comm.avgPrice.toLocaleString()}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                              {comm.growth}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer explore action */}
                    <div className="p-3.5 pt-0">
                      <button
                        onClick={() => handleCommunityExplore(comm)}
                        className="w-full inline-flex items-center justify-between text-slate-600 hover:text-indigo-600 text-[11px] font-bold py-2 border-t border-slate-50 hover:border-indigo-100 transition-colors cursor-pointer"
                      >
                        <span>Explore</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </section>

            {/* SECTION 4: TRUST SECTION */}
            <section className="bg-indigo-50/20 border border-indigo-100/30 rounded-3xl p-6 md:p-8 flex items-start gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 shadow-sm shadow-indigo-600/5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-indigo-950">Your trusted partner for real estate intelligence</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  ACOT brings together official data, advanced analytics and AI to help you make smarter investment decisions in Dubai real estate market.
                </p>
              </div>
            </section>
              </>
            )}
          </main>

          {/* RIGHT COLUMN (CONTEXT PANEL) */}
          {activeSidebarItem !== 'Rental Intelligence' && activeSidebarItem !== 'AI Intelligence Suite' && activeSidebarItem !== 'Investor Tools & Calculators' && (
            <aside className="lg:col-span-4 xl:col-span-3 space-y-6">
            {activeSidebarItem === 'Market Analytics & Cycles' ? (
              <MarketAnalyticsContextPanel
                onNavigateToModule={(mod) => handleSidebarClick(mod)}
                triggerToast={triggerToast}
              />
            ) : activeSidebarItem === 'Transaction Intelligence' ? (
              <TransactionIntelligenceContextPanel
                onNavigateToModule={(mod) => handleSidebarClick(mod)}
                triggerToast={triggerToast}
              />
            ) : activeSidebarItem === 'Maps & Geospatial' ? (
              <MapsGeospatialContextPanel
                onNavigateToModule={(mod) => handleSidebarClick(mod)}
                triggerToast={triggerToast}
              />
            ) : activeSidebarItem === 'Rental Intelligence' ? (
              <RentalIntelligenceContextPanel
                onNavigateToModule={(mod) => handleSidebarClick(mod)}
                triggerToast={triggerToast}
              />
            ) : activeSidebarItem === 'AI Intelligence Suite' ? (
              <AIIntelligenceContextPanel
                onNavigateToModule={(mod) => handleSidebarClick(mod)}
                triggerToast={triggerToast}
              />
            ) : activeSidebarItem === 'Investor Tools & Calculators' ? (
              <InvestorToolsContextPanel
                onNavigateToModule={(mod) => handleSidebarClick(mod)}
                triggerToast={triggerToast}
              />
            ) : activeSidebarItem === 'Reports Engine' ? (
              <ReportsContextPanel
                onNavigateToModule={(mod) => handleSidebarClick(mod)}
                triggerToast={triggerToast}
              />
            ) : activeSidebarItem === 'Watchlists' ? (
              <WatchlistsContextPanel
                onNavigateToModule={(mod) => handleSidebarClick(mod)}
                triggerToast={triggerToast}
              />
            ) : activeSidebarItem === 'Notifications' ? (
              <NotificationsContextPanel
                onNavigateToModule={(mod) => handleSidebarClick(mod)}
                triggerToast={triggerToast}
              />
            ) : activeSidebarItem === 'Account & Preferences' ? (
              <AccountPreferencesContextPanel
                onNavigateToModule={(mod) => handleSidebarClick(mod)}
                triggerToast={triggerToast}
              />
            ) : (
              <>
                {/* CARD 1: GETTING STARTED */}
                <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-full blur-2xl opacity-40"></div>
                  
                  <div className="flex items-start justify-between relative z-10">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Getting Started</h3>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Complete these steps to get the most out of ACOT.
                      </p>
                    </div>
                    {/* Rocket Icon replacement */}
                    <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                  </div>

                  {/* Checklist items */}
                  <div className="space-y-3 pt-2">
                    {checklist.map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          if (item.id === 'search') {
                            setSearchOpen(true);
                          } else if (item.id === 'watchlist') {
                            handleWatchlistAction('Dubai Marina');
                          } else if (item.id === 'report') {
                            handleSimulateReport();
                          } else if (item.id === 'ai') {
                            setAiChatOpen(true);
                          } else {
                            markChecklistDone(item.id);
                          }
                        }}
                        className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors cursor-pointer group"
                      >
                        <div className="shrink-0 mt-0.5">
                          {item.done ? (
                            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 fill-emerald-50" />
                          ) : (
                            <Circle className="w-4.5 h-4.5 text-slate-300 group-hover:text-slate-400" />
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <p className={`text-[11px] font-bold ${item.done ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                            {item.label}
                          </p>
                          <p className="text-[9px] text-slate-400">
                            {item.desc}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Progress Tracker */}
                  <div className="space-y-1.5 pt-3 border-t border-slate-50">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>Interactive Progress</span>
                      <span className="font-bold text-indigo-600">{completedCount} of 5 completed</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 transition-all duration-500"
                        style={{ width: `${(completedCount / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                </div>

                {/* CARD 2: TRUSTED DATA SOURCES */}
                <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-sm">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Trusted Data Sources</h3>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Our intelligence is powered by official and verified sources.
                    </p>
                  </div>

                  {/* Sources list */}
                  <div className="space-y-3.5 pt-2">
                    
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-extrabold text-[11px] font-mono shrink-0">
                        DLD
                      </div>
                      <div>
                        <h4 className="text-[11px] font-bold text-slate-800">Dubai Land Department</h4>
                        <p className="text-[9px] text-slate-400 mt-0.5">Official Property Sales Records</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-extrabold text-[11px] font-mono shrink-0">
                        EJARI
                      </div>
                      <div>
                        <h4 className="text-[11px] font-bold text-slate-800">Ejari Rental Index</h4>
                        <p className="text-[9px] text-slate-400 mt-0.5">Rental Registration Data</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-extrabold text-[11px] font-mono shrink-0">
                        OQOOD
                      </div>
                      <div>
                        <h4 className="text-[11px] font-bold text-slate-800">Oqood Portal</h4>
                        <p className="text-[9px] text-slate-400 mt-0.5">Off-plan Property Escrow Registry</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-extrabold text-[11px] font-mono shrink-0">
                        RERA
                      </div>
                      <div>
                        <h4 className="text-[11px] font-bold text-slate-800">RERA Dubai</h4>
                        <p className="text-[9px] text-slate-400 mt-0.5">Broker Licensing & Agency registry</p>
                      </div>
                    </div>

                  </div>

                  {/* Verification stamp */}
                  <div className="pt-3 border-t border-slate-50 flex items-center justify-center gap-1.5 text-emerald-600 font-bold text-[10px] uppercase font-mono bg-emerald-50/30 py-2 rounded-xl">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>100% Verified & Official</span>
                  </div>

                </div>
              </>
            )}
          </aside>
          )}

        </div>

      </div>

      {/* --- GLOBAL SEARCH COMMAND DIALOG (MODAL) --- */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setSearchOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden relative z-10 space-y-4"
            >
              {/* Search Bar Input */}
              <div className="flex items-center gap-3 px-4.5 py-3.5 border-b border-slate-100">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Type to search communities (e.g. Marina, Business Bay)..."
                  className="w-full text-slate-800 placeholder-slate-400 text-sm outline-none bg-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-50 text-slate-400"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Search results body */}
              <div className="px-4 pb-4 max-h-80 overflow-y-auto space-y-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Communities in Dubai
                </p>

                {filteredCommunities.length === 0 ? (
                  <div className="py-8 text-center space-y-1.5">
                    <p className="text-xs text-slate-500">No results found for "{searchQuery}"</p>
                    <p className="text-[10px] text-slate-400">Try searching for Downtown, Marina, or Palm</p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {filteredCommunities.map(comm => (
                      <button
                        key={comm.id}
                        onClick={() => {
                          setSearchOpen(false);
                          handleCommunityExplore(comm);
                        }}
                        className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={comm.image}
                            alt={comm.name}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-800">{comm.name}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[280px]">
                              {comm.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-mono font-extrabold text-slate-800">{comm.avgPrice.toLocaleString()} AED</p>
                          <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1 py-0.5 rounded-md inline-block mt-1">
                            {comm.growth}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- COMMUNITY SELECTED PREVIEW MODAL --- */}
      <AnimatePresence>
        {selectedCommunity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setSelectedCommunity(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25 }}
              className="bg-white w-full max-w-2xl rounded-[2rem] border border-slate-100 overflow-hidden relative z-10 shadow-2xl flex flex-col md:flex-row"
            >
              {/* Left Image half */}
              <div className="md:w-5/12 h-48 md:h-auto relative bg-slate-100 shrink-0">
                <img
                  src={selectedCommunity.image}
                  alt={selectedCommunity.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950/40 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="text-[9px] font-bold text-white uppercase tracking-wider bg-indigo-600 px-2 py-0.5 rounded-md">
                    Verified Community
                  </span>
                  <h3 className="text-lg font-extrabold text-white mt-1">{selectedCommunity.name}</h3>
                </div>
              </div>

              {/* Right content half */}
              <div className="p-6 md:p-8 flex-1 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-600 font-mono tracking-wider uppercase bg-indigo-50 px-2.5 py-1 rounded-md">
                      Market Insights Q2 2026
                    </span>
                    <button
                      onClick={() => setSelectedCommunity(null)}
                      className="p-1 rounded-lg hover:bg-slate-50 text-slate-400"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {selectedCommunity.description}
                  </p>

                  {/* Quantitative metrics grid */}
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-50">
                    <div>
                      <span className="text-[9px] text-slate-400 font-mono block">AVERAGE PRICE</span>
                      <span className="text-sm font-extrabold font-mono text-slate-800">
                        {selectedCommunity.avgPrice.toLocaleString()} <span className="text-[10px] text-slate-400 font-sans font-medium">AED/sqft</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-mono block">GROWTH INDEX</span>
                      <span className="text-sm font-extrabold text-emerald-600">
                        {selectedCommunity.growth}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-mono block">RENTAL OCCUPANCY</span>
                      <span className="text-sm font-extrabold font-mono text-indigo-700">
                        {selectedCommunity.keyMetric}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-mono block">AVERAGE NET YIELD</span>
                      <span className="text-sm font-extrabold font-mono text-indigo-700">
                        {selectedCommunity.yield}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Simulated action overlay */}
                <div className="pt-4 border-t border-slate-50 flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedCommunity(null);
                      handleSidebarClick('Market Analytics & Cycles', {
                        description: `Comprehensive price indexing, historical cycles analytics and transaction grids for ${selectedCommunity.name}.`,
                        scope: `Deep data dive of ${selectedCommunity.name}.`,
                        status: 'Scheduled for Milestone 2'
                      });
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs py-2.5 rounded-xl transition-colors shadow-md shadow-indigo-600/5 cursor-pointer"
                  >
                    <span>Full Analytics</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleWatchlistAction(selectedCommunity.name)}
                    className="px-3 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-amber-500 rounded-xl transition-colors"
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- ROADMAP / MILESTONE TRANSITION DRAWER --- */}
      <AnimatePresence>
        {activeTransitionModule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setActiveTransitionModule(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="bg-white w-full max-w-md rounded-[2rem] border border-slate-100 overflow-hidden relative z-10 shadow-2xl p-6 md:p-8 space-y-6"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md uppercase font-mono tracking-wider">
                  {activeTransitionModule.status}
                </span>
                <button
                  onClick={() => setActiveTransitionModule(null)}
                  className="p-1 rounded-lg hover:bg-slate-50 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                  {activeTransitionModule.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {activeTransitionModule.description}
                </p>
              </div>

              {/* Sandbox preview representation */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2 text-left">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Module Blueprint Includes:
                </p>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                    <span>Live Dubai Land Department API stream</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                    <span>Ejari rental contracts historical ledger</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                    <span>Price indexation charts & statistical tables</span>
                  </div>
                </div>
              </div>

              {/* Alert Toggler */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    triggerToast(`Subscription Alert set for ${activeTransitionModule.name}.`);
                    setActiveTransitionModule(null);
                  }}
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-3 rounded-xl transition-colors shadow-md shadow-indigo-600/5 cursor-pointer"
                >
                  <span>Notify Me When Live</span>
                  <Bell className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- CHAT WITH AI ANALYST FLOATING COMPONENT --- */}
      <AnimatePresence>
        {aiChatOpen && (
          <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[480px]"
            >
              {/* Header */}
              <div className="bg-indigo-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  <div>
                    <h4 className="text-xs font-bold leading-none">ACOT AI Analyst</h4>
                    <span className="text-[9px] text-indigo-200 font-mono mt-1 block">Verified Real Estate Intelligence</span>
                  </div>
                </div>
                <button
                  onClick={() => setAiChatOpen(false)}
                  className="p-1 rounded-lg hover:bg-indigo-700 text-white/80 hover:text-white"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Body / Replies */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-72">
                
                {/* Intro bubble */}
                <div className="flex gap-2.5 items-start">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl text-[11px] text-slate-700 leading-relaxed max-w-[80%]">
                    Welcome, <strong>{user?.name || 'Investor'}</strong>. I can supply official Dubai yield rates and cycle trends in real time. Choose a query or type your request below.
                  </div>
                </div>

                {/* User query bubble */}
                {aiChatQuery && (
                  <div className="flex gap-2.5 items-start justify-end">
                    <div className="bg-indigo-50 p-3 rounded-2xl text-[11px] text-slate-800 leading-relaxed max-w-[80%] text-right font-medium">
                      {aiChatQuery}
                    </div>
                  </div>
                )}

                {/* AI loader */}
                {aiLoading && (
                  <div className="flex gap-2.5 items-start">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 animate-spin" />
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl text-[11px] text-slate-400">
                      Typing insights from DLD registries...
                    </div>
                  </div>
                )}

                {/* AI reply */}
                {aiChatReply && (
                  <div className="flex gap-2.5 items-start">
                    <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl text-[11px] text-slate-700 leading-relaxed max-w-[80%]">
                      {aiChatReply}
                    </div>
                  </div>
                )}

              </div>

              {/* Recommended Pre-set Queries */}
              <div className="px-4 py-2 border-t border-slate-50 bg-slate-50/50 space-y-1">
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Suggested Queries</p>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => handleAskAIAnalyst('Where is the best rental yield in Dubai currently?')}
                    className="text-[9px] bg-white border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30 text-slate-600 px-2 py-1 rounded-lg transition-colors text-left"
                  >
                    Dubai yield hotspots?
                  </button>
                  <button
                    onClick={() => handleAskAIAnalyst('Give me a cycle summary of Downtown Dubai.')}
                    className="text-[9px] bg-white border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30 text-slate-600 px-2 py-1 rounded-lg transition-colors text-left"
                  >
                    Downtown market cycle?
                  </button>
                  <button
                    onClick={() => handleAskAIAnalyst('Explain the current off-plan price trend in Palm Jumeirah.')}
                    className="text-[9px] bg-white border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30 text-slate-600 px-2 py-1 rounded-lg transition-colors text-left"
                  >
                    Palm Jumeirah luxury index?
                  </button>
                </div>
              </div>

              {/* Message Input box */}
              <div className="p-3 border-t border-slate-50 bg-white flex gap-2">
                <input
                  type="text"
                  placeholder="Ask a custom question..."
                  className="w-full text-xs text-slate-800 placeholder-slate-400 outline-none border border-slate-100 rounded-xl px-3 py-2 bg-slate-50 focus:bg-white focus:border-indigo-200 transition-colors"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const query = (e.target as HTMLInputElement).value;
                      if (query.trim()) {
                        handleAskAIAnalyst(query);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                />
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- NOTIFICATION TOAST --- */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-medium py-3 px-6 rounded-2xl shadow-xl flex items-center gap-2.5 border border-slate-800"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
