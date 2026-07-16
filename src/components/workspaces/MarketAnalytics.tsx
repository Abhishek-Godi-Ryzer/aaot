import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAnalysisContext } from '../../context/AnalysisContext';
import { useMarketAnalytics } from '../../context/MarketAnalyticsContext';
import { useAuth } from '../../context/AuthContext';
import { AgentService } from '../../services/agentService';
import { ProfessionalAuditService } from '../../services/professionalIntegrationService';
import { ProfessionalAccessService, ProfessionalPropertyService } from '../../services/professionalAccessService';
import AnalysisContextSwitcher from './AnalysisContextSwitcher';
import {
  MOCK_COMMUNITIES,
  MOCK_SUB_AREAS,
  MOCK_PROJECTS,
  MarketAnalyticsService,
  Community,
  SubArea,
  Project,
  PriceHistoryPoint,
  CycleMetric,
  MethodologyComparison,
  LeaderboardItem
} from '../../services/marketAnalyticsService';
import {
  Search,
  TrendingUp,
  MapPin,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Calendar,
  Building2,
  Percent,
  Layers,
  Sparkles,
  FileText,
  Home,
  FileDown,
  ArrowRight,
  Grid,
  CheckCircle,
  HelpCircle,
  Clock,
  Briefcase,
  ExternalLink,
  ChevronLeft,
  Crown,
  DollarSign,
  ShieldCheck,
  ArrowLeft,
  Share2,
  FileSpreadsheet
} from 'lucide-react';

export default function MarketAnalytics() {
  const { user } = useAuth();
  const isAgent = user?.role === 'agent';
  const verification = isAgent ? AgentService.getVerificationStatus() : null;
  const hasProfAccess = ProfessionalAccessService.hasProfessionalAccess(user, verification);

  const {
    communityId,
    subAreaId,
    projectId,
    setCommunityId,
    setSubAreaId,
    setProjectId,
    clearContext
  } = useAnalysisContext();

  const {
    communities,
    subAreas,
    projects,
    selectedCommunity,
    selectedSubArea,
    selectedProject,
    loading
  } = useMarketAnalytics();

  // Navigation states for our 6 pages
  // 'explorer' | 'deep' | 'history' | 'cycles' | 'methodology' | 'leaderboards'
  const [activeTab, setActiveTab] = useState<'explorer' | 'deep' | 'history' | 'cycles' | 'methodology' | 'leaderboards'>('explorer');

  // Page 1 Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');
  const [selectedYieldFilter, setSelectedYieldFilter] = useState('all');

  // Page 3 Price History State
  const [priceHistoryData, setPriceHistoryData] = useState<PriceHistoryPoint[]>([]);
  const [activeHistoryMetric, setActiveHistoryMetric] = useState<'median' | 'sqft'>('sqft');
  const [hoveredHistoryPoint, setHoveredHistoryPoint] = useState<PriceHistoryPoint | null>(null);

  // Page 4 Cycle Views State
  const [cyclePeriod, setCyclePeriod] = useState<string>('Annual');
  const [cycleMetric, setCycleMetric] = useState<CycleMetric | undefined>(undefined);

  // Page 5 Methodology State
  const [methodologyPeriod, setMethodologyPeriod] = useState<'Last 30 Days' | 'Last 90 Days' | 'Last Year'>('Last 30 Days');
  const [methodologyComp, setMethodologyComp] = useState<MethodologyComparison | undefined>(undefined);

  // Page 6 Leaderboard State
  const [leaderboardCategory, setLeaderboardCategory] = useState<'Areas' | 'Developers'>('Areas');
  const [leaderboardMetric, setLeaderboardMetric] = useState<'Volume' | 'Value' | 'Growth'>('Volume');
  const [leaderboardItems, setLeaderboardItems] = useState<LeaderboardItem[]>([]);

  // Toast / Status Message triggered from child buttons
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Listen for external navigation instructions (like from Maps)
  useEffect(() => {
    const handleTabChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setActiveTab(customEvent.detail);
      }
    };
    window.addEventListener('acot-market-analytics-tab', handleTabChange);
    return () => window.removeEventListener('acot-market-analytics-tab', handleTabChange);
  }, []);

  // Log Professional Property Viewed audit event
  useEffect(() => {
    if (user && (communityId || projectId)) {
      ProfessionalAuditService.logEvent(user.id, 'Professional Property Viewed', {
        communityId,
        projectId,
        timestamp: new Date().toISOString()
      });
    }
  }, [communityId, projectId, user]);

  // Fetch Page-specific mock data on context/tab changes
  useEffect(() => {
    async function loadTabSpecificData() {
      const activeCommId = communityId || 'dubai-marina';
      if (activeTab === 'history') {
        const history = await MarketAnalyticsService.getPriceHistory(activeCommId);
        setPriceHistoryData(history);
      } else if (activeTab === 'cycles') {
        const metric = await MarketAnalyticsService.getCycleView(activeCommId, cyclePeriod);
        setCycleMetric(metric);
      } else if (activeTab === 'methodology') {
        const comp = await MarketAnalyticsService.getMethodologyComparison(activeCommId, 'Last 30 Days');
        setMethodologyComp(comp);
      } else if (activeTab === 'leaderboards') {
        const items = await MarketAnalyticsService.getLeaderboards(leaderboardCategory, leaderboardMetric);
        setLeaderboardItems(items);
      }
    }
    loadTabSpecificData();
  }, [activeTab, communityId, cyclePeriod, leaderboardCategory, leaderboardMetric]);

  // Handle Community Card selection
  const handleSelectCommunity = (id: string) => {
    setCommunityId(id);
    setSubAreaId('all');
    setProjectId('all');
    setActiveTab('deep');
    triggerToast(`Context established: ${MOCK_COMMUNITIES.find(c => c.id === id)?.name || id}`);
  };

  // Filtered communities for Page 1
  const filteredCommunities = MOCK_COMMUNITIES.filter(comm => {
    const matchesSearch = comm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          comm.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          comm.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedTypeFilter === 'all' || 
                        (selectedTypeFilter === 'waterfront' && comm.type.includes('Waterfront')) ||
                        (selectedTypeFilter === 'business' && comm.type.includes('Central Business')) ||
                        (selectedTypeFilter === 'family' && comm.type.includes('Family'));

    const matchesYield = selectedYieldFilter === 'all' ||
                         (selectedYieldFilter === 'high' && comm.yield >= 7.0) ||
                         (selectedYieldFilter === 'mid' && comm.yield >= 6.0 && comm.yield < 7.0) ||
                         (selectedYieldFilter === 'core' && comm.yield < 6.0);

    return matchesSearch && matchesType && matchesYield;
  });

  // Filter projects relative to the selected sub-area
  const subAreaProjects = subAreaId !== 'all' 
    ? projects.filter(p => p.subAreaId === subAreaId) 
    : projects;

  return (
    <div className="space-y-6 md:space-y-8 relative">
      {/* Dynamic Action Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-800"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GLOBAL ANALYSIS CONTEXT SWITCHER */}
      <AnalysisContextSwitcher
        triggerToast={triggerToast}
        moduleName="Market Intelligence"
      />

      {/* =======================================================
          1. HEADER NAVIGATION (Stripe/Linear Internal Sub-tabs)
          ======================================================= */}
      <div className="bg-white rounded-3xl border border-slate-100 p-2 shadow-sm flex flex-wrap gap-1.5 md:gap-2">
        {[
          { id: 'explorer', label: 'Community Explorer' },
          { id: 'deep', label: 'Community Deep Analysis' },
          { id: 'history', label: 'Price History' },
          { id: 'cycles', label: 'Cycle Views' },
          { id: 'methodology', label: 'Change Methodology' },
          { id: 'leaderboards', label: 'Leaderboards' }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                // If switching to community-specific views without a community, default to 'dubai-marina'
                if (tab.id !== 'explorer' && tab.id !== 'leaderboards' && !communityId) {
                  setCommunityId('dubai-marina');
                  setSubAreaId('all');
                  setProjectId('all');
                }
                setActiveTab(tab.id as any);
                triggerToast(`Switched to: ${tab.label}`);
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/15'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* =======================================================
          PERSISTENT COMMUNITY CONTEXT BAR
          ======================================================= */}
      {selectedCommunity && activeTab !== 'explorer' && activeTab !== 'leaderboards' && (
        <div className="bg-white rounded-3xl border border-slate-100 p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                clearContext();
                setActiveTab('explorer');
                triggerToast('Returned to Community Explorer');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Explorer</span>
            </button>
            <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
            <div className="text-xs">
              <span className="text-slate-400 font-mono uppercase text-[10px] tracking-wider block sm:inline">Scope: </span>
              <span className="font-extrabold text-slate-800">{selectedCommunity.name}</span>
              {subAreaId !== 'all' && selectedSubArea && (
                <>
                  <span className="text-slate-300 mx-1.5 font-mono">/</span>
                  <span className="font-bold text-slate-600">{selectedSubArea.name}</span>
                </>
              )}
              {projectId !== 'all' && selectedProject && (
                <>
                  <span className="text-slate-300 mx-1.5 font-mono">/</span>
                  <span className="font-bold text-indigo-600">{selectedProject.name}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase hidden md:inline">Change Community:</span>
            <select
              value={selectedCommunity.id}
              onChange={(e) => {
                const newId = e.target.value;
                setCommunityId(newId);
                setSubAreaId('all');
                setProjectId('all');
                triggerToast(`Switched community context to: ${MOCK_COMMUNITIES.find(c => c.id === newId)?.name}`);
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 text-xs font-bold outline-none text-slate-700 cursor-pointer"
            >
              {MOCK_COMMUNITIES.map(comm => (
                <option key={comm.id} value={comm.id}>{comm.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* =======================================================
          2. VIEW ROUTER (Conditional rendering of 6 pages)
          ======================================================= */}
      <div className="min-h-[500px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-3 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-slate-400 font-mono">
              Loading Real Estate Intelligence...
            </p>
          </div>
        ) : (
          <motion.div
            key={activeTab + '-' + communityId + '-' + subAreaId + '-' + projectId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 md:space-y-8"
          >
            {/* ----------------------------------------------------
                PAGE 1: COMMUNITY EXPLORER
                ---------------------------------------------------- */}
            {activeTab === 'explorer' && (
              <div className="space-y-6 md:space-y-8">
                {/* Search & Filters block */}
                <div className="bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 space-y-6 shadow-sm">
                  <div className="space-y-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700">
                      <Sparkles className="w-3 h-3" />
                      Dubai Master Areas
                    </span>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                      Master Community Directory
                    </h2>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                      Select or search for an area to establish your dynamic research scope. Clicking explore will update your global Analysis Context.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Search Field */}
                    <div className="md:col-span-6 relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search community, area type or developers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-xs font-semibold transition-all outline-none text-slate-700 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-50"
                      />
                    </div>

                    {/* Area Type Filter */}
                    <div className="md:col-span-3">
                      <select
                        value={selectedTypeFilter}
                        onChange={(e) => setSelectedTypeFilter(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-xs font-semibold transition-all outline-none text-slate-700 cursor-pointer"
                      >
                        <option value="all">All Area Types</option>
                        <option value="waterfront">Waterfront Communities</option>
                        <option value="business">Central Business Districts</option>
                        <option value="family">Family Communities</option>
                      </select>
                    </div>

                    {/* Yield Tier Filter */}
                    <div className="md:col-span-3">
                      <select
                        value={selectedYieldFilter}
                        onChange={(e) => setSelectedYieldFilter(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-xs font-semibold transition-all outline-none text-slate-700 cursor-pointer"
                      >
                        <option value="all">All Net Yields</option>
                        <option value="high">High Yield (7.0%+ net)</option>
                        <option value="mid">Mid Tier Yield (6.0% - 6.9%)</option>
                        <option value="core">Core Yield (&lt; 6.0%)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Communities Cards Grid */}
                {filteredCommunities.length === 0 ? (
                  <div className="bg-white rounded-[2rem] border border-slate-100 py-16 text-center space-y-2 shadow-sm">
                    <Info className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-sm font-bold text-slate-700">No communities match your filters</p>
                    <p className="text-xs text-slate-400">Try adjusting your query or filters above.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCommunities.map((comm) => (
                      <div
                        key={comm.id}
                        className="bg-white border border-slate-100 hover:border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
                      >
                        <div>
                          {/* Image and Header banner */}
                          <div className="relative h-44 overflow-hidden bg-slate-100 shrink-0">
                            <img
                              src={comm.image}
                              alt={comm.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
                            <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-white/95 text-slate-800 shadow-sm backdrop-blur-xs">
                              {comm.type}
                            </span>
                          </div>

                          {/* Content block */}
                          <div className="p-5 space-y-3.5">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                  {comm.name}
                                </h3>
                                <p className="text-[10px] text-slate-400 mt-0.5">
                                  by {comm.developer.split(',')[0]}
                                </p>
                              </div>
                              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold text-emerald-600 bg-emerald-50">
                                {comm.growthString}
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                              {comm.description}
                            </p>

                            {/* Key Stats rows */}
                            <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-slate-50 font-mono">
                              <div className="bg-slate-50 p-2 rounded-xl text-center">
                                <span className="text-[9px] text-slate-400 block uppercase">
                                  Avg Price
                                </span>
                                <span className="text-xs font-bold text-slate-800">
                                  {comm.avgPrice} AED
                                </span>
                              </div>

                              <div className="bg-slate-50 p-2 rounded-xl text-center">
                                <span className="text-[9px] text-slate-400 block uppercase">
                                  Net Yield
                                </span>
                                <span className="text-xs font-bold text-slate-800">
                                  {comm.yield}%
                                </span>
                              </div>

                              <div className="bg-slate-50 p-2 rounded-xl text-center">
                                <span className="text-[9px] text-slate-400 block uppercase">
                                  Growth
                                </span>
                                <span className="text-xs font-bold text-emerald-600">
                                  +{comm.growth}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Card CTA Footer */}
                        <div className="p-4 pt-0 border-t border-slate-50/50">
                          <button
                            onClick={() => handleSelectCommunity(comm.id)}
                            className="w-full flex items-center justify-between text-left p-3 rounded-xl hover:bg-indigo-50/30 text-xs font-bold text-slate-700 hover:text-indigo-600 transition-all cursor-pointer group/btn"
                          >
                            <span>Explore Community & Sub-Areas</span>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover/btn:text-indigo-600 group-hover/btn:translate-x-0.5 transition-all" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ----------------------------------------------------
                PAGE 2: COMMUNITY DEEP ANALYSIS FLOW (WITH NESTED ROUTING)
                ---------------------------------------------------- */}
            {activeTab === 'deep' && (
              <div className="space-y-6 md:space-y-8">
                {selectedCommunity ? (
                  <div className="space-y-6 md:space-y-8">

                    {/* SUB-ROUTER: 1. PROJECT PROFILE VIEW */}
                    {projectId !== 'all' && selectedProject ? (
                      <div className="space-y-6 md:space-y-8">
                        {/* Project Header Back button & Breadcrumb */}
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-slate-400">Communities</span>
                            <span className="text-slate-300">/</span>
                            <span className="text-slate-400">{selectedCommunity.name}</span>
                            <span className="text-slate-300">/</span>
                            <span className="text-slate-400">{selectedSubArea?.name || 'Sub-area'}</span>
                            <span className="text-slate-300">/</span>
                            <span className="font-extrabold text-indigo-600">{selectedProject.name}</span>
                          </div>

                          <button
                            onClick={() => setProjectId('all')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-100 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Back to {selectedSubArea?.name || 'Sub-area'}</span>
                          </button>
                        </div>

                        {/* Project Hero Column */}
                        <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
                          <div className="h-60 overflow-hidden bg-slate-100 relative">
                            <img
                              src={selectedProject.image}
                              alt={selectedProject.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 md:left-8 right-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                              <div className="space-y-1.5 text-white">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-indigo-600 text-white shadow-sm">
                                  Project Profile
                                </span>
                                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                                  {selectedProject.name}
                                </h2>
                                <p className="text-xs text-white/80 max-w-xl font-medium leading-relaxed">
                                  Dubai Marina, Dubai • by {selectedProject.developer}
                                </p>
                              </div>
                              <span className="px-3 py-1 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 shrink-0 self-start md:self-auto">
                                {selectedProject.marketTrend}
                              </span>
                            </div>
                          </div>

                          {/* Specifications Grid */}
                          <div className="p-6 md:p-8 border-t border-slate-50 bg-slate-50/30">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-4">
                              Project Specifications & Details
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 text-xs font-mono">
                              <div className="bg-white p-3.5 rounded-2xl border border-slate-100 space-y-1 shadow-xs">
                                <span className="text-[9px] text-slate-400 block uppercase">Developer</span>
                                <span className="font-bold text-slate-800 block truncate">{selectedProject.developer}</span>
                              </div>
                              <div className="bg-white p-3.5 rounded-2xl border border-slate-100 space-y-1 shadow-xs">
                                <span className="text-[9px] text-slate-400 block uppercase">Status</span>
                                <span className="font-bold text-slate-800 block">{selectedProject.status}</span>
                              </div>
                              <div className="bg-white p-3.5 rounded-2xl border border-slate-100 space-y-1 shadow-xs">
                                <span className="text-[9px] text-slate-400 block uppercase">Completed</span>
                                <span className="font-bold text-slate-800 block">{selectedProject.completionYear}</span>
                              </div>
                              <div className="bg-white p-3.5 rounded-2xl border border-slate-100 space-y-1 shadow-xs">
                                <span className="text-[9px] text-slate-400 block uppercase">Property Types</span>
                                <span className="font-bold text-slate-800 block truncate">{selectedProject.propertyTypes.split('•')[0]}</span>
                              </div>
                              <div className="bg-white p-3.5 rounded-2xl border border-slate-100 space-y-1 shadow-xs">
                                <span className="text-[9px] text-slate-400 block uppercase">Towers Count</span>
                                <span className="font-bold text-slate-800 block">{selectedProject.towers} Tower</span>
                              </div>
                              <div className="bg-white p-3.5 rounded-2xl border border-slate-100 space-y-1 shadow-xs">
                                <span className="text-[9px] text-slate-400 block uppercase">Total Units</span>
                                <span className="font-bold text-slate-800 block">{selectedProject.totalUnits} Units</span>
                              </div>
                              <div className="bg-white p-3.5 rounded-2xl border border-slate-100 space-y-1 shadow-xs">
                                <span className="text-[9px] text-slate-400 block uppercase">Ownership</span>
                                <span className="font-bold text-slate-800 block">{selectedProject.ownership}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Market Snapshot Column */}
                        <div className="bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 space-y-6 shadow-sm">
                          <div>
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider font-mono">
                              Real-time Metrics
                            </h3>
                            <h4 className="text-lg font-extrabold text-slate-900 mt-1">
                              Project Market Snapshot
                            </h4>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 font-mono text-xs">
                            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-1">
                              <span className="text-[9px] text-slate-400 block uppercase">Average Price</span>
                              <span className="font-extrabold text-slate-800 block text-sm">{selectedProject.avgPrice} AED/sqft</span>
                            </div>
                            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-1">
                              <span className="text-[9px] text-slate-400 block uppercase">Est. 1-Bed Median</span>
                              <span className="font-extrabold text-slate-800 block text-sm">AED {selectedProject.oneBedPrice.toLocaleString()}</span>
                            </div>
                            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-1">
                              <span className="text-[9px] text-slate-400 block uppercase">Appreciation YoY</span>
                              <span className="font-extrabold text-emerald-600 block text-sm">+{selectedProject.growth}%</span>
                            </div>
                            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-1">
                              <span className="text-[9px] text-slate-400 block uppercase">Active Resales</span>
                              <span className="font-extrabold text-slate-800 block text-sm">{selectedProject.availableUnits} units available</span>
                            </div>
                            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-1 lg:col-span-2">
                              <span className="text-[9px] text-slate-400 block uppercase">Last DLD Deed Sale</span>
                              <span className="font-bold text-slate-700 block text-xs mt-1.5">{selectedProject.lastTransaction}</span>
                            </div>
                          </div>
                        </div>

                        {/* Property Types Grid Section */}
                        <div className="bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 space-y-6 shadow-sm">
                          <div>
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider font-mono">
                              Unit Configuration analysis
                            </h3>
                            <h4 className="text-lg font-extrabold text-slate-900 mt-1">
                              Like-for-Like Property Types Pricing
                            </h4>
                            <p className="text-xs text-slate-500 mt-1">
                              Mathematical medians tracked from official sales registries filtered by room configurations.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            {[
                              { label: 'Studio Apartment', price: selectedProject.studioPrice, growth: selectedProject.studioGrowth },
                              { label: '1 Bedroom Apartment', price: selectedProject.oneBedPrice, growth: selectedProject.oneBedGrowth },
                              { label: '2 Bedroom Apartment', price: selectedProject.twoBedPrice, growth: selectedProject.twoBedGrowth },
                              { label: '3 Bedroom Apartment', price: selectedProject.threeBedPrice, growth: selectedProject.threeBedGrowth },
                              { label: 'Premium Penthouse', price: selectedProject.penthousePrice, growth: selectedProject.penthouseGrowth }
                            ].map((type, idx) => (
                              <div key={idx} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/20 hover:border-indigo-100 transition-all flex flex-col justify-between min-h-[120px]">
                                <span className="text-xs font-bold text-slate-900">{type.label}</span>
                                <div className="pt-4 space-y-1 font-mono">
                                  <p className="text-[9px] text-slate-400 uppercase">Median Value</p>
                                  <p className="text-xs font-extrabold text-slate-800">AED {type.price.toLocaleString()}</p>
                                  <span className="inline-block text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md mt-1">
                                    +{type.growth}% YoY
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Professional Property Information Card */}
                        {hasProfAccess && (
                          <div className="bg-slate-900 rounded-[2rem] border border-slate-800 p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden text-white" id="prof-property-data-card">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-4">
                              <div className="space-y-1">
                                <span className="inline-flex items-center gap-1 bg-indigo-500/20 text-indigo-300 font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border border-indigo-500/35">
                                  <ShieldCheck className="w-3.5 h-3.5" />
                                  Professional Access Active
                                </span>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                  Professional Property Information
                                  <span className="text-[10px] font-mono font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md uppercase border border-emerald-500/20">
                                    Verified Registry Data
                                  </span>
                                </h3>
                                <p className="text-xs text-slate-400">
                                  Official land registry keys unlocked via secure RERA token integrations.
                                </p>
                              </div>
                              <div className="flex items-center gap-1.5 self-start md:self-auto text-[11px] font-bold text-slate-300 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                                <span>Dubai Land Department (DLD) Gateway: Connected</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs font-mono relative z-10">
                              {[
                                { label: 'Property Number', val: ProfessionalPropertyService.getProfessionalPropertyData(projectId).propertyNumber },
                                { label: 'Plot Number', val: ProfessionalPropertyService.getProfessionalPropertyData(projectId).plotNumber },
                                { label: 'Building Number', val: ProfessionalPropertyService.getProfessionalPropertyData(projectId).buildingNumber },
                                { label: 'Land Parcel ID', val: ProfessionalPropertyService.getProfessionalPropertyData(projectId).landParcelId },
                                { label: 'Registry Reference', val: ProfessionalPropertyService.getProfessionalPropertyData(projectId).registryReference },
                                { label: 'Developer Registration', val: ProfessionalPropertyService.getProfessionalPropertyData(projectId).developerRegistration },
                                { label: 'Permit Number', val: ProfessionalPropertyService.getProfessionalPropertyData(projectId).permitNumber },
                                { label: 'Construction Status', val: ProfessionalPropertyService.getProfessionalPropertyData(projectId).constructionStatus },
                              ].map((item, idx) => (
                                <div key={idx} className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800/60 space-y-1">
                                  <span className="text-[10px] text-slate-400 block uppercase font-bold">{item.label}</span>
                                  <span className="font-extrabold text-slate-200 block truncate">{item.val}</span>
                                </div>
                              ))}
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 border-t border-slate-800 text-[10px] text-slate-400 font-sans relative z-10">
                              <p>Authority: Dubai Land Department (DLD) • Real-time sales ledger</p>
                              <p>Last Registry Update: {ProfessionalPropertyService.getProfessionalPropertyData(projectId).lastRegistryUpdate}</p>
                            </div>
                          </div>
                        )}

                      </div>
                    ) : /* SUB-ROUTER: 2. SUB-AREA DETAIL VIEW */
                    subAreaId !== 'all' && selectedSubArea ? (
                      <div className="space-y-6 md:space-y-8">
                        {/* Sub-Area Header Back button & Breadcrumb */}
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-slate-400">Communities</span>
                            <span className="text-slate-300">/</span>
                            <span className="text-slate-400">{selectedCommunity.name}</span>
                            <span className="text-slate-300">/</span>
                            <span className="font-extrabold text-indigo-600">{selectedSubArea.name}</span>
                          </div>

                          <button
                            onClick={() => setSubAreaId('all')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-100 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Back to {selectedCommunity.name}</span>
                          </button>
                        </div>

                        {/* Sub-Area Hero Block */}
                        <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
                          <div className="h-60 overflow-hidden bg-slate-100 relative">
                            <img
                              src={selectedSubArea.image}
                              alt={selectedSubArea.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 md:left-8 right-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                              <div className="space-y-1.5 text-white">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-indigo-600 text-white shadow-sm">
                                  Sub-Area Sector
                                </span>
                                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                                  {selectedSubArea.name}
                                </h2>
                                <p className="text-xs text-white/80 max-w-xl font-medium leading-relaxed">
                                  {selectedCommunity.name} • {selectedSubArea.typicalUse}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Spec chips */}
                          <div className="p-6 md:p-8 border-t border-slate-50 bg-slate-50/30">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-4">
                              Sub-Area Specifications
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs font-mono">
                              <div className="bg-white p-3.5 rounded-2xl border border-slate-100 space-y-1 shadow-xs">
                                <span className="text-[9px] text-slate-400 block uppercase">Developer</span>
                                <span className="font-bold text-slate-800 block truncate">{selectedSubArea.developer}</span>
                              </div>
                              <div className="bg-white p-3.5 rounded-2xl border border-slate-100 space-y-1 shadow-xs">
                                <span className="text-[9px] text-slate-400 block uppercase">Sector Status</span>
                                <span className="font-bold text-slate-800 block">{selectedSubArea.status}</span>
                              </div>
                              <div className="bg-white p-3.5 rounded-2xl border border-slate-100 space-y-1 shadow-xs">
                                <span className="text-[9px] text-slate-400 block uppercase">Registered Structures</span>
                                <span className="font-bold text-slate-800 block">{selectedSubArea.buildings} structures</span>
                              </div>
                              <div className="bg-white p-3.5 rounded-2xl border border-slate-100 space-y-1 shadow-xs">
                                <span className="text-[9px] text-slate-400 block uppercase">Typical Use</span>
                                <span className="font-bold text-slate-800 block truncate">{selectedSubArea.typicalUse}</span>
                              </div>
                              <div className="bg-white p-3.5 rounded-2xl border border-slate-100 space-y-1 shadow-xs">
                                <span className="text-[9px] text-slate-400 block uppercase">Delivery Range</span>
                                <span className="font-bold text-slate-800 block">{selectedSubArea.completion}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Market Snapshot Stats Grid */}
                        <div className="bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 space-y-6 shadow-sm">
                          <div>
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider font-mono">
                              Performance Indices
                            </h3>
                            <h4 className="text-lg font-extrabold text-slate-900 mt-1">
                              Sub-area Market Snapshot
                            </h4>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 font-mono text-xs">
                            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-1">
                              <span className="text-[9px] text-slate-400 block uppercase">Average Price</span>
                              <span className="font-extrabold text-slate-800 block text-sm">{selectedSubArea.avgPrice} AED/sqft</span>
                            </div>
                            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-1">
                              <span className="text-[9px] text-slate-400 block uppercase">Est. 1-Bed Median</span>
                              <span className="font-extrabold text-slate-800 block text-sm">AED {(selectedSubArea.avgPrice * 920).toLocaleString()}</span>
                            </div>
                            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-1">
                              <span className="text-[9px] text-slate-400 block uppercase">Appreciation YoY</span>
                              <span className="font-extrabold text-emerald-600 block text-sm">+{selectedSubArea.growth}%</span>
                            </div>
                            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-1">
                              <span className="text-[9px] text-slate-400 block uppercase">Annual Transactions</span>
                              <span className="font-extrabold text-slate-800 block text-sm">{selectedSubArea.transactions} deeds</span>
                            </div>
                            <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-1">
                              <span className="text-[9px] text-slate-400 block uppercase">Avg Net Yield</span>
                              <span className="font-extrabold text-indigo-600 block text-sm">7.1% Net</span>
                            </div>
                          </div>
                        </div>

                        {/* Projects Sector within the Sub-area */}
                        <div className="bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 space-y-6 shadow-sm">
                          <div className="space-y-1.5">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider font-mono">
                              Localized Projects
                            </h3>
                            <h4 className="text-lg font-extrabold text-slate-900">
                              Active Projects in {selectedSubArea.name}
                            </h4>
                            <p className="text-xs text-slate-500">
                              Click a project profile card to open structural parameters and bedroom configurations pricing.
                            </p>
                          </div>

                          {subAreaProjects.length === 0 ? (
                            <div className="py-8 bg-slate-50/50 rounded-2xl text-center border border-dashed border-slate-200">
                              <p className="text-xs font-bold text-slate-500">
                                No localized projects registered in this specific sub-area.
                              </p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {subAreaProjects.map((proj) => (
                                <button
                                  key={proj.id}
                                  onClick={() => {
                                    setProjectId(proj.id);
                                    triggerToast(`Project Profile context: ${proj.name}`);
                                  }}
                                  className="p-5 rounded-3xl border border-slate-100 text-left bg-white hover:border-indigo-100 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between h-44"
                                >
                                  <div className="space-y-2 w-full">
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="text-[9px] font-mono font-bold text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded-full">
                                        {proj.developer}
                                      </span>
                                      <span className="text-[10px] font-mono font-bold text-emerald-600">
                                        +{proj.growth}% YoY
                                      </span>
                                    </div>
                                    <h5 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                      {proj.name}
                                    </h5>
                                    <p className="text-[11px] text-slate-500 line-clamp-2">
                                      Completed {proj.completionYear} • {proj.propertyTypes}
                                    </p>
                                  </div>

                                  <div className="flex items-center justify-between w-full border-t border-slate-50 pt-3 font-mono text-[10px]">
                                    <div>
                                      <span className="text-slate-400 block">Avg Price</span>
                                      <span className="text-slate-800 font-extrabold">{proj.avgPrice} AED/sqft</span>
                                    </div>
                                    <span className="text-indigo-600 font-bold inline-flex items-center gap-0.5">
                                      <span>Configure</span>
                                      <ChevronRight className="w-3.5 h-3.5" />
                                    </span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                      </div>
                    ) : /* SUB-ROUTER: 3. DEFAULT MASTER COMMUNITY VIEW */ (
                      <div className="space-y-6 md:space-y-8">
                        {/* Hero Section */}
                        <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm relative">
                          <div className="h-60 overflow-hidden bg-slate-100 relative">
                            <img
                              src={selectedCommunity.image}
                              alt={selectedCommunity.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 md:left-8 right-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                              <div className="space-y-1.5 text-white">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-xs">
                                  {selectedCommunity.type}
                                </span>
                                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                                  {selectedCommunity.name}
                                </h2>
                                <p className="text-xs text-white/80 max-w-xl font-medium leading-relaxed">
                                  {selectedCommunity.status} • {selectedCommunity.ownership} Ownership
                                </p>
                              </div>

                              <div className="flex gap-2 shrink-0">
                                <button
                                  onClick={() => {
                                    clearContext();
                                    setActiveTab('explorer');
                                    triggerToast('Cleared Analysis Context.');
                                  }}
                                  className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs rounded-xl backdrop-blur-sm border border-white/10 transition-all cursor-pointer"
                                >
                                  Change Area
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 border-t border-slate-50">
                            {/* Summary & Editorial narrative */}
                            <div className="lg:col-span-8 space-y-4">
                              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                                Editorial Analysis Brief
                              </h3>
                              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                {selectedCommunity.description}
                              </p>
                              <div className="p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100/20 text-xs text-indigo-950 font-medium leading-relaxed flex items-start gap-3">
                                <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                                <span>
                                  Our data logs show <strong>{selectedCommunity.volume.toLocaleString()} Transactions</strong> registered in this community during the current expansion cycle, commanding a total volume value of <strong>AED {selectedCommunity.value} Billion</strong>. Scarcity indices indicate strong liquidity and robust investment retention profiles.
                                </span>
                              </div>
                            </div>

                            {/* Snapshot card details */}
                            <div className="lg:col-span-4 bg-slate-50/50 rounded-2xl border border-slate-100 p-5 space-y-3.5">
                              <h3 className="text-xs font-bold text-slate-700 tracking-tight">
                                Market Snapshot
                              </h3>

                              <div className="space-y-2.5 font-mono">
                                <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
                                  <span className="text-slate-400">MEDIAN PRICE</span>
                                  <span className="font-extrabold text-slate-800">{selectedCommunity.avgPrice} AED/sqft</span>
                                </div>

                                <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
                                  <span className="text-slate-400">NET RENTAL YIELD</span>
                                  <span className="font-extrabold text-indigo-600">{selectedCommunity.yield}% net</span>
                                </div>

                                <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
                                  <span className="text-slate-400">GROWTH YoY</span>
                                  <span className="font-extrabold text-emerald-600">+{selectedCommunity.growth}%</span>
                                </div>

                                <div className="flex items-center justify-between text-xs py-1.5">
                                  <span className="text-slate-400">OCCUPANCY RATE</span>
                                  <span className="font-extrabold text-slate-800">{selectedCommunity.occupancy}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Sub-Areas and Clusters Section */}
                        <div className="bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 space-y-6 shadow-sm">
                          <div className="space-y-1.5">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider font-mono">
                              Sub-Areas & Sectors
                            </h3>
                            <h4 className="text-lg font-extrabold text-slate-900">
                              Micro-Market Clusters
                            </h4>
                            <p className="text-xs text-slate-500">
                              Select a micro-market sector cluster to refine your active sub-area scope and load its detailed analysis profile.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {subAreas.map((sub) => {
                              return (
                                <button
                                  key={sub.id}
                                  onClick={() => {
                                    setSubAreaId(sub.id);
                                    setProjectId('all'); // Reset project scope when changing subarea
                                    triggerToast(`Sub-area profile loaded: ${sub.name}`);
                                  }}
                                  className="p-4 rounded-2xl border text-left transition-all cursor-pointer group relative flex flex-col justify-between h-32 border-slate-100 hover:border-slate-200 bg-white"
                                >
                                  <div className="space-y-1">
                                    <span className="text-xs font-extrabold text-slate-900 block group-hover:text-indigo-600 transition-colors">
                                      {sub.name}
                                    </span>
                                    <span className="text-[9px] text-slate-400 block font-mono">
                                      by {sub.developer}
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-between w-full border-t border-slate-50 pt-2 font-mono text-[10px]">
                                    <span className="text-slate-500">{sub.avgPrice} AED/sqft</span>
                                    <span className="text-emerald-600 font-bold">+{sub.growth}% YoY</span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Projects Sector within the Community */}
                        <div className="bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 space-y-6 shadow-sm">
                          <div className="space-y-1.5">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider font-mono">
                              Community Projects & Towers
                            </h3>
                            <h4 className="text-lg font-extrabold text-slate-900">
                              Active Project Profiles
                            </h4>
                            <p className="text-xs text-slate-500">
                              Click a project to explore its structural specifications, unit ranges and market snapshot details.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {projects.map((proj) => {
                              return (
                                <button
                                  key={proj.id}
                                  onClick={() => {
                                    // Auto resolve subarea if clicking project directly
                                    if (proj.subAreaId) setSubAreaId(proj.subAreaId);
                                    setProjectId(proj.id);
                                    triggerToast(`Project Profile loaded: ${proj.name}`);
                                  }}
                                  className="p-4 rounded-2xl border text-left transition-all cursor-pointer border-slate-100 hover:border-slate-200 bg-white shadow-xs"
                                >
                                  <span className="text-[10px] font-mono text-slate-400 block uppercase">
                                    {proj.developer}
                                  </span>
                                  <span className="text-sm font-extrabold text-slate-800 block mt-1">
                                    {proj.name}
                                  </span>
                                  <span className="text-[10px] text-slate-500 block mt-1">
                                    {proj.propertyTypes.split('•')[0]}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="bg-white rounded-[2rem] border border-slate-100 py-24 text-center space-y-4 shadow-sm">
                    <MapPin className="w-12 h-12 text-slate-300 mx-auto" />
                    <div>
                      <h3 className="text-base font-extrabold text-slate-800">No community selected</h3>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                        Please select an area in 'Community Explorer' to review Deep Analysis.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('explorer')}
                      className="px-4 py-2.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-all cursor-pointer"
                    >
                      Open Explorer
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ----------------------------------------------------
                PAGE 3: PRICE HISTORY
                ---------------------------------------------------- */}
            {activeTab === 'history' && (
              <div className="space-y-6 md:space-y-8">
                {selectedCommunity ? (
                  <div className="bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 space-y-6 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                      <div className="space-y-1.5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700">
                          <TrendingUp className="w-3 h-3" />
                          Long-term Pricing Index
                        </span>
                        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                          Price History Registry
                        </h2>
                        <p className="text-xs text-slate-500">
                          10-year historical pricing, transaction volume trajectories, and market events for {selectedCommunity.name}.
                        </p>
                      </div>

                      {/* Metric Toggle */}
                      <div className="bg-slate-100 p-1 rounded-xl flex gap-1 self-start">
                        <button
                          onClick={() => {
                            setActiveHistoryMetric('sqft');
                            triggerToast('History axis switched to: Price/sqft');
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            activeHistoryMetric === 'sqft'
                              ? 'bg-white text-slate-900 shadow-xs'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          Price/sqft
                        </button>
                        <button
                          onClick={() => {
                            setActiveHistoryMetric('median');
                            triggerToast('History axis switched to: Annual Volume');
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            activeHistoryMetric === 'median'
                              ? 'bg-white text-slate-900 shadow-xs'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          Volume
                        </button>
                      </div>
                    </div>

                    {/* SVG Interactive Chart */}
                    <div className="border border-slate-100 rounded-[2rem] bg-slate-50/20 p-6 space-y-6">
                      <div className="h-64 w-full relative">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 200" preserveAspectRatio="none">
                          {priceHistoryData.length > 0 && (() => {
                            const paddingX = 40;
                            const paddingY = 20;
                            const chartWidth = 1000 - paddingX * 2;
                            const chartHeight = 200 - paddingY * 2;

                            const maxVal = Math.max(...priceHistoryData.map(d => activeHistoryMetric === 'sqft' ? d.price : d.volume));
                            const minVal = Math.min(...priceHistoryData.map(d => activeHistoryMetric === 'sqft' ? d.price : d.volume)) * 0.85;

                            const points = priceHistoryData.map((d, index) => {
                              const val = activeHistoryMetric === 'sqft' ? d.price : d.volume;
                              const x = paddingX + (index / (priceHistoryData.length - 1)) * chartWidth;
                              const y = paddingY + chartHeight - ((val - minVal) / (maxVal - minVal)) * chartHeight;
                              return { x, y, d };
                            });

                            const dStr = points.reduce((acc, p, i) => {
                              return acc + `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`;
                            }, '');

                            const areaDStr = points.reduce((acc, p, i) => {
                              return acc + `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`;
                            }, '') + ` L ${points[points.length - 1].x} ${200 - paddingY} L ${points[0].x} ${200 - paddingY} Z`;

                            return (
                              <>
                                {/* Grid Lines */}
                                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                                  const y = paddingY + ratio * chartHeight;
                                  return (
                                    <line
                                      key={i}
                                      x1={paddingX}
                                      y1={y}
                                      x2={1000 - paddingX}
                                      y2={y}
                                      stroke="#f1f5f9"
                                      strokeWidth="1.5"
                                      strokeDasharray="4"
                                    />
                                  );
                                })}

                                {/* Area Under Curve */}
                                <path d={areaDStr} fill="url(#chartGrad)" />

                                {/* Line path */}
                                <path d={dStr} fill="none" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" />

                                {/* Interactive Circles */}
                                {points.map((p, idx) => {
                                  const isHovered = hoveredHistoryPoint?.year === p.d.year;
                                  return (
                                    <g key={idx} className="cursor-pointer">
                                      <circle
                                        cx={p.x}
                                        cy={p.y}
                                        r={isHovered ? "8" : "5"}
                                        fill="#ffffff"
                                        stroke="#4f46e5"
                                        strokeWidth="3"
                                        onMouseEnter={() => setHoveredHistoryPoint(p.d)}
                                        onMouseLeave={() => setHoveredHistoryPoint(null)}
                                        onClick={() => {
                                          setHoveredHistoryPoint(p.d);
                                          triggerToast(`${p.d.year}: ${p.d.label}`);
                                        }}
                                        className="transition-all"
                                      />
                                    </g>
                                  );
                                })}

                                {/* Definitions */}
                                <defs>
                                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.12" />
                                    <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                                  </linearGradient>
                                </defs>
                              </>
                            );
                          })()}
                        </svg>

                        {/* Year labels at bottom */}
                        <div className="flex justify-between text-[10px] text-slate-400 font-mono font-bold pt-4 border-t border-slate-100">
                          {priceHistoryData.map((d, idx) => (
                            <span key={idx}>{d.year}</span>
                          ))}
                        </div>
                      </div>

                      {/* Interactive Point details display */}
                      <div className="p-4 bg-white rounded-2xl border border-slate-100 min-h-[90px] flex items-center justify-between">
                        {hoveredHistoryPoint ? (
                          <div className="flex items-start gap-4">
                            <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl font-extrabold text-xs font-mono shrink-0">
                              {hoveredHistoryPoint.year}
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono text-slate-400 block uppercase">Historical Narrative Event</span>
                              <p className="text-xs font-bold text-slate-800 leading-relaxed">
                                {hoveredHistoryPoint.label}
                              </p>
                              <div className="flex gap-4 pt-1 text-[11px] font-mono text-slate-500">
                                <span>Median Price: <strong>{hoveredHistoryPoint.price} AED/sqft</strong></span>
                                <span>Sales Registry Count: <strong>{hoveredHistoryPoint.volume.toLocaleString()} deeds</strong></span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 text-slate-400">
                            <Info className="w-5 h-5 text-slate-300 shrink-0" />
                            <p className="text-xs font-semibold">
                              Hover or click any node point on the trend timeline to reveal micro-market narrative audits and pricing indices.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-[2rem] border border-slate-100 py-24 text-center space-y-4 shadow-sm">
                    <MapPin className="w-12 h-12 text-slate-300 mx-auto" />
                    <div>
                      <h3 className="text-base font-extrabold text-slate-800">No community selected</h3>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                        Please select an area in 'Community Explorer' to review Price History.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('explorer')}
                      className="px-4 py-2.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-all cursor-pointer"
                    >
                      Open Explorer
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ----------------------------------------------------
                PAGE 4: CYCLE VIEWS
                ---------------------------------------------------- */}
            {activeTab === 'cycles' && (
              <div className="space-y-6 md:space-y-8">
                {selectedCommunity ? (
                  <div className="bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 space-y-6 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                      <div className="space-y-1.5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700">
                          <Layers className="w-3 h-3" />
                          Cyclical Momentum
                        </span>
                        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                          Market Cycle Positioning
                        </h2>
                        <p className="text-xs text-slate-500">
                          Track supply volume indicators, transaction velocity curves, and cyclical wave positioning.
                        </p>
                      </div>

                      {/* Horizon select toggles */}
                      <div className="bg-slate-100 p-1 rounded-xl flex gap-1 self-start">
                        {['Annual', 'Monthly', 'YTD'].map((p) => {
                          const isActive = cyclePeriod === p;
                          return (
                            <button
                              key={p}
                              onClick={() => {
                                setCyclePeriod(p);
                                triggerToast(`Switched horizon: ${p}`);
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                isActive
                                  ? 'bg-white text-slate-900 shadow-xs'
                                  : 'text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              {p}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Cycle metrics blocks */}
                    {cycleMetric && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1 font-mono text-xs">
                        <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                          <span className="text-[9px] text-slate-400 block uppercase">Median Transaction</span>
                          <span className="font-extrabold text-slate-800 block mt-1.5">
                            AED {(cycleMetric.medianPrice).toLocaleString()}
                          </span>
                        </div>

                        <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                          <span className="text-[9px] text-slate-400 block uppercase">Average Price/sqft</span>
                          <span className="font-extrabold text-indigo-600 block mt-1.5">
                            AED {cycleMetric.priceSqft}
                          </span>
                        </div>

                        <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                          <span className="text-[9px] text-slate-400 block uppercase">Transactions Count</span>
                          <span className="font-extrabold text-slate-800 block mt-1.5">
                            {cycleMetric.transactions} registry entries
                          </span>
                        </div>

                        <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                          <span className="text-[9px] text-slate-400 block uppercase">Volume Momentum</span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded-full mt-1.5">
                            {cycleMetric.momentum} Wave
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Period Trendline mini chart */}
                    {cycleMetric && (
                      <div className="border border-slate-100 rounded-2xl bg-slate-50/30 p-5 space-y-4">
                        <h3 className="text-xs font-bold text-slate-700 font-mono">
                          {cyclePeriod} Micro-Trend Velocity Curve
                        </h3>
                        <div className="h-44 w-full relative">
                          <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 120" preserveAspectRatio="none">
                            {(() => {
                              const points = cycleMetric.trendData.map((d, index) => {
                                const x = (index / (cycleMetric.trendData.length - 1)) * 1000;
                                const y = 100 - (d.price * 60); // Simple scaling helper
                                return { x, y, d };
                              });

                              const dStr = points.reduce((acc, p, i) => {
                                return acc + `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`;
                              }, '');

                              return (
                                <>
                                  <path d={dStr} fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" />
                                  {points.map((p, idx) => (
                                    <circle
                                      key={idx}
                                      cx={p.x}
                                      cy={p.y}
                                      r="4"
                                      fill="#ffffff"
                                      stroke="#4f46e5"
                                      strokeWidth="2"
                                    />
                                  ))}
                                </>
                              );
                            })()}
                          </svg>

                          {/* X labels */}
                          <div className="flex justify-between text-[8px] text-slate-400 font-mono font-bold pt-3 border-t border-slate-100">
                            {cycleMetric.trendData.map((d, idx) => (
                              <span key={idx}>{d.name}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white rounded-[2rem] border border-slate-100 py-24 text-center space-y-4 shadow-sm">
                    <MapPin className="w-12 h-12 text-slate-300 mx-auto" />
                    <div>
                      <h3 className="text-base font-extrabold text-slate-800">No community selected</h3>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                        Please select an area in 'Community Explorer' to review Cycle Views.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('explorer')}
                      className="px-4 py-2.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-all cursor-pointer"
                    >
                      Open Explorer
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ----------------------------------------------------
                PAGE 5: CHANGE METHODOLOGY (REDESIGNED FOR REVISION 2)
                ---------------------------------------------------- */}
            {activeTab === 'methodology' && (
              <div className="space-y-6 md:space-y-8">
                {selectedCommunity ? (
                  <div className="bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 space-y-8 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                      <div className="space-y-1.5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700">
                          <ShieldCheck className="w-3 h-3" />
                          Trust & Quality Standards
                        </span>
                        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                          ACOT Price Change Methodology
                        </h2>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                          ACOT utilizes a like-for-like, period-over-period median calculation system completely mitigating skewing introduced by naive averages.
                        </p>
                      </div>

                      {/* Period Selector */}
                      <div className="bg-slate-100 p-1 rounded-xl flex gap-1 self-start">
                        {['Last 30 Days', 'Last 90 Days', 'Last Year'].map((p) => {
                          const isActive = methodologyPeriod === p;
                          return (
                            <button
                              key={p}
                              onClick={() => {
                                setMethodologyPeriod(p as any);
                                triggerToast(`Switched audit horizon to: ${p}`);
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                isActive
                                  ? 'bg-white text-slate-900 shadow-xs'
                                  : 'text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              {p}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Comparison Card (Previous Period VS Current Period -> Calculated Change %) */}
                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-6 relative overflow-hidden">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                        {/* Previous Period */}
                        <div className="space-y-2 text-center md:text-left w-full md:w-auto">
                          <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider">
                            Previous Period (16 Jun - 15 Jul 2025)
                          </span>
                          <span className="text-xl md:text-2xl font-extrabold text-slate-500 block font-mono">
                            AED 1,520,000 <span className="text-xs font-normal font-sans">median</span>
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono block">
                            AED 1,612 / sqft
                          </span>
                        </div>

                        {/* Calculated Change % Badge */}
                        <div className="flex flex-col items-center justify-center py-3 px-6 bg-emerald-50 border border-emerald-100 rounded-2xl shadow-xs animate-pulse">
                          <ArrowUpRight className="w-5 h-5 text-emerald-600 mb-1" />
                          <span className="text-sm font-extrabold text-emerald-700 block font-mono">
                            +7.2% Price Growth
                          </span>
                          <span className="text-[9px] text-emerald-500 uppercase font-mono tracking-wider mt-0.5">
                            Like-for-Like Median
                          </span>
                        </div>

                        {/* Current Period */}
                        <div className="space-y-2 text-center md:text-right w-full md:w-auto">
                          <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider">
                            Current Period (16 Jul - 14 Aug 2025)
                          </span>
                          <span className="text-xl md:text-2xl font-extrabold text-indigo-600 block font-mono">
                            AED 1,630,000 <span className="text-xs font-normal font-sans">median</span>
                          </span>
                          <span className="text-[11px] text-emerald-600 font-mono block font-bold">
                            AED 1,728 / sqft (+7.2%)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Trust Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-5 border border-slate-100 rounded-2xl bg-white hover:border-indigo-100 transition-all space-y-3 shadow-xs">
                        <CheckCircle className="w-5 h-5 text-indigo-600 shrink-0" />
                        <h4 className="text-xs font-extrabold text-slate-900 font-mono uppercase tracking-wider">
                          Equal Day Comparison
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                          Analyzes identical day blocks (e.g. 30 days vs 30 days) between horizons to mathematically neutralize seasonal variations and weekend anomalies.
                        </p>
                      </div>

                      <div className="p-5 border border-slate-100 rounded-2xl bg-white hover:border-indigo-100 transition-all space-y-3 shadow-xs">
                        <CheckCircle className="w-5 h-5 text-indigo-600 shrink-0" />
                        <h4 className="text-xs font-extrabold text-slate-900 font-mono uppercase tracking-wider">
                          Median Pricing Metric
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                          Calculates direct mathematical medians rather than averages to neutralize extreme developer bulk sales, outliers, or unrepresentative transaction logs.
                        </p>
                      </div>

                      <div className="p-5 border border-slate-100 rounded-2xl bg-white hover:border-indigo-100 transition-all space-y-3 shadow-xs">
                        <CheckCircle className="w-5 h-5 text-indigo-600 shrink-0" />
                        <h4 className="text-xs font-extrabold text-slate-900 font-mono uppercase tracking-wider">
                          Official DLD Deed Sync
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                          Directly computed from verified sales deed registers of Dubai Land Department (DLD), completely bypassing speculative portal listings.
                        </p>
                      </div>
                    </div>

                    {/* Comparison Chart */}
                    <div className="border border-slate-100 rounded-2xl bg-slate-50/30 p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-700 font-mono uppercase">
                          Period-over-Period Trendline Velocity
                        </h3>
                        <div className="flex gap-4 text-[9px] font-mono text-slate-400">
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400 inline-block"></span> Previous Period</span>
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-600 inline-block"></span> Current Period</span>
                        </div>
                      </div>

                      <div className="h-44 w-full relative">
                        {methodologyComp && (
                          <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 120" preserveAspectRatio="none">
                            {(() => {
                              const points = methodologyComp.chartData.map((d, index) => {
                                const x = (index / (methodologyComp.chartData.length - 1)) * 1000;
                                const prevY = 110 - (d.prevVal * 55);
                                const currY = 110 - (d.currVal * 55);
                                return { x, prevY, currY, name: d.name };
                              });

                              const prevD = points.reduce((acc, p, i) => acc + `${i === 0 ? 'M' : 'L'} ${p.x} ${p.prevY}`, '');
                              const currD = points.reduce((acc, p, i) => acc + `${i === 0 ? 'M' : 'L'} ${p.x} ${p.currY}`, '');

                              return (
                                <>
                                  {/* Previous period dashed line */}
                                  <path d={prevD} fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" strokeLinecap="round" />
                                  
                                  {/* Current period solid line */}
                                  <path d={currD} fill="none" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" />

                                  {/* Interactive Nodes */}
                                  {points.map((p, idx) => (
                                    <g key={idx}>
                                      <circle cx={p.x} cy={p.currY} r="3" fill="#ffffff" stroke="#4f46e5" strokeWidth="2" />
                                    </g>
                                  ))}
                                </>
                              );
                            })()}
                          </svg>
                        )}

                        {/* X labels */}
                        {methodologyComp && (
                          <div className="flex justify-between text-[8px] text-slate-400 font-mono font-bold pt-3 border-t border-slate-100">
                            {methodologyComp.chartData.map((d, idx) => (
                              <span key={idx}>{d.name}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="bg-white rounded-[2rem] border border-slate-100 py-24 text-center space-y-4 shadow-sm">
                    <MapPin className="w-12 h-12 text-slate-300 mx-auto" />
                    <div>
                      <h3 className="text-base font-extrabold text-slate-800">No community selected</h3>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                        Please select an area in 'Community Explorer' to review Change Methodology.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('explorer')}
                      className="px-4 py-2.5 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 transition-all cursor-pointer"
                    >
                      Open Explorer
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ----------------------------------------------------
                PAGE 6: LEADERBOARDS
                ---------------------------------------------------- */}
            {activeTab === 'leaderboards' && (
              <div className="space-y-6 md:space-y-8">
                <div className="bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 space-y-6 shadow-sm">
                  <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                    <div className="space-y-1.5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700">
                        <Crown className="w-3 h-3" />
                        Performance League
                      </span>
                      <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        Dubai Real Estate Leaderboards
                      </h2>
                      <p className="text-xs text-slate-500">
                        Top appreciated areas and top trading master developers ranked in real-time.
                      </p>
                    </div>

                    {/* Category & Metric Toggles */}
                    <div className="flex flex-wrap gap-2">
                      {/* Class toggle */}
                      <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
                        {['Areas', 'Developers'].map((cat) => (
                          <button
                            key={cat}
                            onClick={() => {
                              setLeaderboardCategory(cat as any);
                              triggerToast(`Leaderboards filtered by: ${cat}`);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              leaderboardCategory === cat
                                ? 'bg-white text-slate-900 shadow-xs'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>

                      {/* Metric Toggle */}
                      <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
                        {['Volume', 'Value', 'Growth'].map((met) => (
                          <button
                            key={met}
                            onClick={() => {
                              setLeaderboardMetric(met as any);
                              triggerToast(`Sorted rankings by: ${met}`);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              leaderboardMetric === met
                                ? 'bg-white text-slate-900 shadow-xs'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            {met}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Leaderboards List */}
                  <div className="space-y-3 pt-2">
                    {leaderboardItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-all bg-white shadow-xs group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-700 flex items-center justify-center font-extrabold text-xs shrink-0 font-mono">
                            #{item.rank}
                          </div>
                          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                            <img
                              src={item.image}
                              alt={item.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {item.name}
                            </h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {item.trend}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-mono font-extrabold text-indigo-600 block">
                            {item.metric}
                          </span>
                          <button
                            onClick={() => {
                              if (leaderboardCategory === 'Areas') {
                                handleSelectCommunity(item.id);
                              } else {
                                triggerToast(`Selected Developer Profile: ${item.name}`);
                              }
                            }}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-colors mt-1 cursor-pointer"
                          >
                            <span>Explore</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* =======================================================
          3. CONTINUE RESEARCH SECTION (Mandatory bottom guides)
          ======================================================= */}
      <section className="bg-slate-900 text-white rounded-[2rem] p-6 md:p-8 space-y-6 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
        
        <div className="space-y-2 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-indigo-200">
            Next Action Guide
          </span>
          <h2 className="text-xl font-extrabold tracking-tight">
            Continue Your Dubai Real Estate Journey
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
            You are analyzing {selectedCommunity?.name || 'All Dubai'}. Flow into other fully synchronized modules to query live transaction deeds, Ejari rental registries, or run smart portfolio ROI calculations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10 pt-2">
          {[
            {
              name: 'Transaction Intelligence',
              desc: 'Micro-level sales & deed registries.',
              icon: FileText
            },
            {
              name: 'Rental Intelligence',
              desc: 'Ejari residential lease audits.',
              icon: Home
            },
            {
              name: 'AI Intelligence Suite',
              desc: 'Query DLD data via smart assistant.',
              icon: Sparkles
            },
            {
              name: 'Reports Engine',
              desc: 'Generate branded portfolio PDF briefs.',
              icon: FileDown
            }
          ].map((action, idx) => (
            <div
              key={idx}
              className="bg-white/5 border border-white/10 hover:border-indigo-500/50 hover:bg-white/10 p-4 rounded-2xl flex flex-col justify-between h-36 transition-all group"
            >
              <div className="space-y-1.5">
                <action.icon className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                <h4 className="text-xs font-bold text-white block">
                  {action.name}
                </h4>
                <p className="text-[10px] text-slate-400 leading-snug">
                  {action.desc}
                </p>
              </div>

              {/* Pass the action click up or simulate routing */}
              <button
                onClick={() => {
                  triggerToast(`Handoff initiated: Transferring context to ${action.name}...`);
                  // Set active tab at parent if available, or simulate handoff
                  const sidebarBtn = document.querySelector(`[data-sidebar-item="${action.name}"]`) as HTMLButtonElement;
                  if (sidebarBtn) {
                    sidebarBtn.click();
                  } else {
                    // Try exact name click simulation helper
                    window.dispatchEvent(new CustomEvent('acot-sidebar-route', { detail: action.name }));
                  }
                }}
                className="w-full inline-flex items-center justify-between text-[10px] font-bold text-indigo-400 hover:text-white transition-colors pt-2 border-t border-white/5 cursor-pointer"
              >
                <span>Handoff Context</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
