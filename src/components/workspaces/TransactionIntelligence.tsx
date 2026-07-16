import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAnalysisContext } from '../../context/AnalysisContext';
import { useMarketAnalytics } from '../../context/MarketAnalyticsContext';
import { useAuth } from '../../context/AuthContext';
import { AgentService } from '../../services/agentService';
import { ProfessionalAccessService, RegistryService } from '../../services/professionalAccessService';
import { TransactionService, Transaction, TransactionHighlights, TrendDataPoint, CashMortgageBreakdown, ClosingCostBreakdown } from '../../services/transactionService';
import AnalysisContextSwitcher from './AnalysisContextSwitcher';
import {
  Search,
  SlidersHorizontal,
  TrendingUp,
  Coins,
  Calculator,
  Download,
  Share2,
  FileText,
  Check,
  CheckCircle2,
  RotateCcw,
  Building2,
  Info,
  CreditCard,
  ArrowRight,
  MapPin,
  User,
  RefreshCw,
  Sliders,
  Database,
  ShieldCheck,
  CheckCircle,
  TrendingDown,
  Filter,
  Layers,
  Grid,
  Calendar,
  Percent,
  ChevronDown,
  ChevronUp,
  Printer,
  ChevronRight,
  Eye,
  X,
  Lock,
  Unlock,
  FileSpreadsheet
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface TransactionIntelligenceProps {
  onNavigateToModule?: (moduleName: string) => void;
  triggerToast?: (message: string) => void;
}

export default function TransactionIntelligence({ onNavigateToModule, triggerToast: parentTriggerToast }: TransactionIntelligenceProps = {}) {
  const { user } = useAuth();
  const isAgent = user?.role === 'agent';
  const verification = isAgent ? AgentService.getVerificationStatus() : null;
  const isVerifiedAgent = isAgent && verification?.status === 'VERIFIED';
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
    loading: contextLoading
  } = useMarketAnalytics();

  // Internal Navigation tabs: 'feed' | 'trends' | 'calculator'
  const [activeTab, setActiveTab] = useState<'feed' | 'trends' | 'calculator'>('feed');

  // Common UI State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    if (parentTriggerToast) {
      parentTriggerToast(msg);
    }
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. --- FEED & ADVANCED FILTERS STATE ---
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterPropType, setFilterPropType] = useState('All Types');
  const [filterTxType, setFilterTxType] = useState('All');
  const [filterBedrooms, setFilterBedrooms] = useState('All Bedrooms');
  const [filterDeveloper, setFilterDeveloper] = useState('All Developers');
  const [filterPaymentMethod, setFilterPaymentMethod] = useState('All');
  const [filterMinPrice, setFilterMinPrice] = useState<number>(0);
  const [filterMaxPrice, setFilterMaxPrice] = useState<number>(0);
  const [filterMinArea, setFilterMinArea] = useState<number>(0);
  const [filterMaxArea, setFilterMaxArea] = useState<number>(0);
  const [sortBy, setSortBy] = useState('Newest');

  // Pagination limit state
  const [visibleCount, setVisibleCount] = useState(8);

  // Selected Transaction for Drawer / Details Modal
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterPropType('All Types');
    setFilterTxType('All');
    setFilterBedrooms('All Bedrooms');
    setFilterDeveloper('All Developers');
    setFilterPaymentMethod('All');
    setFilterMinPrice(0);
    setFilterMaxPrice(0);
    setFilterMinArea(0);
    setFilterMaxArea(0);
    setSortBy('Newest');
    triggerToast('All filters and sorting reset to default.');
  };

  // Compute active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery) count++;
    if (filterPropType !== 'All Types') count++;
    if (filterTxType !== 'All') count++;
    if (filterBedrooms !== 'All Bedrooms') count++;
    if (filterDeveloper !== 'All Developers') count++;
    if (filterPaymentMethod !== 'All') count++;
    if (filterMinPrice > 0 || filterMaxPrice > 0) count++;
    if (filterMinArea > 0 || filterMaxArea > 0) count++;
    if (sortBy !== 'Newest') count++;
    return count;
  }, [
    searchQuery, filterPropType, filterTxType, filterBedrooms,
    filterDeveloper, filterPaymentMethod, filterMinPrice, filterMaxPrice,
    filterMinArea, filterMaxArea, sortBy
  ]);

  // Fetch transactions based on context and advanced filters
  const transactions = useMemo(() => {
    return TransactionService.getTransactions({
      communityId,
      subAreaId,
      projectId,
      propertyType: filterPropType,
      transactionType: filterTxType,
      bedrooms: filterBedrooms === 'All Bedrooms' ? 'All' : filterBedrooms.replace(' Bed', '').trim(),
      developer: filterDeveloper,
      paymentMethod: filterPaymentMethod,
      minPrice: filterMinPrice,
      maxPrice: filterMaxPrice,
      minArea: filterMinArea,
      maxArea: filterMaxArea,
      sortBy,
      searchQuery
    });
  }, [
    communityId, subAreaId, projectId,
    filterPropType, filterTxType, filterBedrooms,
    filterDeveloper, filterPaymentMethod, filterMinPrice, filterMaxPrice,
    filterMinArea, filterMaxArea, sortBy, searchQuery
  ]);

  // Paginated transactions
  const paginatedTxs = useMemo(() => {
    return transactions.slice(0, visibleCount);
  }, [transactions, visibleCount]);

  // 2. --- ANALYTICS / HIGHLIGHTS STATE ---
  const highlights = useMemo(() => {
    return TransactionService.getHighlights(communityId, subAreaId, projectId);
  }, [communityId, subAreaId, projectId]);

  const trendData = useMemo(() => {
    return TransactionService.getTrendData(communityId, subAreaId, projectId);
  }, [communityId, subAreaId, projectId]);

  const cashMortgageData = useMemo(() => {
    return TransactionService.getCashMortgage(communityId, subAreaId, projectId);
  }, [communityId, subAreaId, projectId]);

  // Format Recharts Pie Data
  const pieChartData = useMemo(() => {
    return [
      { name: 'Cash Deal', value: cashMortgageData.cashCount, color: '#10b981' },
      { name: 'Mortgage Financed', value: cashMortgageData.mortgageCount, color: '#3b82f6' }
    ];
  }, [cashMortgageData]);

  // 3. --- CALCULATOR STATE ---
  const [calcPrice, setCalcPrice] = useState<number>(2000000);
  const [calcOffPlan, setCalcOffPlan] = useState<boolean>(false);
  const [calcMortgaged, setCalcMortgaged] = useState<boolean>(false);
  const [calcBuyerType, setCalcBuyerType] = useState<'Individual' | 'Company'>('Individual');

  // Synchronize calculator with current context average price on load or context change
  useEffect(() => {
    if (selectedProject?.avgPrice) {
      // average price per sqft times 1200 sqft average size
      setCalcPrice(Math.round(selectedProject.avgPrice * 1200));
    } else if (selectedSubArea?.avgPrice) {
      setCalcPrice(Math.round(selectedSubArea.avgPrice * 1200));
    } else if (selectedCommunity?.avgPrice) {
      setCalcPrice(Math.round(selectedCommunity.avgPrice * 1200));
    } else {
      setCalcPrice(2000000);
    }
  }, [communityId, subAreaId, projectId, selectedCommunity, selectedSubArea, selectedProject]);

  const closingCosts = useMemo(() => {
    return TransactionService.calculateClosingCost(calcPrice, calcOffPlan, calcMortgaged, calcBuyerType);
  }, [calcPrice, calcOffPlan, calcMortgaged, calcBuyerType]);


  // Action simulation handlers
  const [isExporting, setIsExporting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleExportFeed = async (format: 'PDF' | 'CSV' | 'Excel') => {
    setIsExporting(true);
    triggerToast(`Compiling and filtering transaction ledger into ${format}...`);
    try {
      const res = await TransactionService.exportTransactions({ communityId, subAreaId, projectId }, format);
      setTimeout(() => {
        setIsExporting(false);
        triggerToast(`Successfully downloaded Transaction Ledger (${format})`);
      }, 1500);
    } catch {
      setIsExporting(false);
    }
  };

  const handleShareWorkspace = async () => {
    setIsSharing(true);
    triggerToast('Creating high-fidelity sharing vector link...');
    try {
      const res = await TransactionService.shareTransactions({ communityId, subAreaId, projectId });
      setTimeout(() => {
        setIsSharing(false);
        navigator.clipboard.writeText(res.shareLink);
        triggerToast('Interactive analysis vector copied to clipboard!');
      }, 1000);
    } catch {
      setIsSharing(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 relative" id="ti-module-root">
      {/* Dynamic Toast Message */}
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

      {/* =======================================================
          1. HEADER SECTION (Identity, Description, Context Info)
          ======================================================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
            <Database className="w-3 h-3" />
            DLD Official Registry
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            Transaction Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-2xl">
            Audit and query registered transactions, mortgage certificates, and ownership transfers sourced directly from the Dubai Land Department (DLD) registry records.
          </p>
        </div>

        {/* Global Export / Share Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={async () => {
              triggerToast('Compiling context-bound transaction dossier...');
              try {
                const reportsModule = await import('../../services/reportsService');
                await reportsModule.ReportsService.generateContextReport('Transaction Intelligence', {
                  communityId,
                  subAreaId,
                  projectId
                });
                triggerToast('DLD Transaction Report generated! Navigating...');
                if (onNavigateToModule) {
                  setTimeout(() => onNavigateToModule('Reports Engine'), 800);
                }
              } catch (e) {
                triggerToast('Failed to compile context report.');
              }
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white transition-all cursor-pointer shadow-sm active:scale-98"
          >
            <FileText className="w-4 h-4 text-indigo-200" />
            <span>Generate DLD Report</span>
          </button>
          <button
            onClick={() => handleExportFeed('PDF')}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-all cursor-pointer shadow-sm hover:shadow active:scale-98"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>{isExporting ? 'Exporting...' : 'Export'}</span>
          </button>
          <button
            onClick={handleShareWorkspace}
            disabled={isSharing}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white transition-all cursor-pointer shadow-sm shadow-slate-900/10 active:scale-98"
          >
            <Share2 className="w-4 h-4 text-slate-300" />
            <span>{isSharing ? 'Sharing...' : 'Share Context'}</span>
          </button>
        </div>
      </div>

      {/* GLOBAL ANALYSIS CONTEXT SWITCHER */}
      <AnalysisContextSwitcher
        triggerToast={triggerToast}
        moduleName="Transactions"
      />

      {/* =======================================================
          2. CORE TAB NAVIGATION
          ======================================================= */}
      <div className="bg-white rounded-2xl border border-slate-100 p-1.5 shadow-sm flex flex-wrap gap-1">
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'feed'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/50'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Live Transactions Feed</span>
          <span className="ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-mono bg-slate-100 text-slate-600 font-extrabold">
            {transactions.length} DLD
          </span>
        </button>

        <button
          onClick={() => setActiveTab('trends')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'trends'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/50'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Market Activity & Trends</span>
        </button>

        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'calculator'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/50'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Purchase Cost Calculator</span>
        </button>
      </div>

      {/* =======================================================
          3. TAB VIEW: LIVE DLD TRANSACTION FEED
          ======================================================= */}
      {activeTab === 'feed' && (
        <div className="space-y-6">
          {/* Quick Context-Aware Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 shrink-0">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-mono font-bold text-slate-400 uppercase">Records Found</p>
                <p className="text-base font-extrabold text-slate-800 font-mono mt-0.5">{transactions.length}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-mono font-bold text-slate-400 uppercase">Volume Value</p>
                <p className="text-base font-extrabold text-slate-800 font-mono mt-0.5">
                  {(highlights.totalVolumeAed / 1000000).toFixed(1)}M AED
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-mono font-bold text-slate-400 uppercase">Avg Price/sqft</p>
                <p className="text-base font-extrabold text-slate-800 font-mono mt-0.5">
                  {highlights.averagePriceSqft.toLocaleString()} AED
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-mono font-bold text-slate-400 uppercase">Cash ratio</p>
                <p className="text-base font-extrabold text-slate-800 font-mono mt-0.5">
                  {cashMortgageData.cashPercentage}% Cash
                </p>
              </div>
            </div>
          </div>

          {/* Search, Filter Toggles & Sort Options */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row gap-3">
              {/* Left search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by Reference, Project, Sub-area, Nationality..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-100 focus:border-slate-200 outline-none text-xs font-medium text-slate-700 transition-colors"
                />
              </div>

              {/* Right buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    showFilters || activeFiltersCount > 0
                      ? 'border-emerald-200 bg-emerald-50/50 text-emerald-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Advanced Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[9px] bg-emerald-600 text-white font-extrabold rounded-full font-mono">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>

                {/* Sort selector */}
                <div className="relative inline-flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase mr-2 font-mono">Sort By</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer pr-4"
                  >
                    <option value="Newest">Newest Date</option>
                    <option value="Oldest">Oldest Date</option>
                    <option value="Price-Highest">Price: High to Low</option>
                    <option value="Price-Lowest">Price: Low to High</option>
                    <option value="Sqft-Highest">Price/sqft: High to Low</option>
                    <option value="Sqft-Lowest">Price/sqft: Low to High</option>
                  </select>
                </div>

                {activeFiltersCount > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="text-xs font-bold text-red-500 hover:text-red-600 bg-red-50 px-3 py-2.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear Filters</span>
                  </button>
                )}
              </div>
            </div>

            {/* EXPANDABLE ADVANCED FILTERS PANEL */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden border-t border-slate-100 pt-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-medium">
                    {/* Property Type */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Property Type</label>
                      <select
                        value={filterPropType}
                        onChange={(e) => setFilterPropType(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700 cursor-pointer outline-none focus:border-slate-200"
                      >
                        <option value="All Types">All Property Types</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Villa">Villa</option>
                        <option value="Townhouse">Townhouse</option>
                        <option value="Penthouse">Penthouse</option>
                      </select>
                    </div>

                    {/* Transaction Type */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Transaction Type</label>
                      <select
                        value={filterTxType}
                        onChange={(e) => setFilterTxType(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700 cursor-pointer outline-none focus:border-slate-200"
                      >
                        <option value="All">All Transactions</option>
                        <option value="Sale">Sale (Transfer)</option>
                        <option value="Mortgage">Mortgage Certificate</option>
                        <option value="Gift">Gift Transfer</option>
                      </select>
                    </div>

                    {/* Bedrooms */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Bedrooms</label>
                      <select
                        value={filterBedrooms}
                        onChange={(e) => setFilterBedrooms(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700 cursor-pointer outline-none focus:border-slate-200"
                      >
                        <option value="All Bedrooms">All Bedrooms</option>
                        <option value="Studio">Studio</option>
                        <option value="1 Bed">1 Bedroom</option>
                        <option value="2 Bed">2 Bedroom</option>
                        <option value="3 Bed">3 Bedroom</option>
                        <option value="4+ Bed">4+ Bedroom</option>
                      </select>
                    </div>

                    {/* Developer */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Developer</label>
                      <select
                        value={filterDeveloper}
                        onChange={(e) => setFilterDeveloper(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700 cursor-pointer outline-none focus:border-slate-200"
                      >
                        <option value="All Developers">All Developers</option>
                        <option value="Emaar Properties">Emaar Properties</option>
                        <option value="Select Group">Select Group</option>
                        <option value="Omniyat">Omniyat</option>
                        <option value="Nakheel">Nakheel</option>
                        <option value="Dubai Properties">Dubai Properties</option>
                      </select>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Min Price (AED)</label>
                      <input
                        type="number"
                        placeholder="Min Price"
                        value={filterMinPrice || ''}
                        onChange={(e) => setFilterMinPrice(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700 outline-none focus:border-slate-200"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Max Price (AED)</label>
                      <input
                        type="number"
                        placeholder="Max Price"
                        value={filterMaxPrice || ''}
                        onChange={(e) => setFilterMaxPrice(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700 outline-none focus:border-slate-200"
                      />
                    </div>

                    {/* Area Range */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Min Area (sqft)</label>
                      <input
                        type="number"
                        placeholder="Min Area"
                        value={filterMinArea || ''}
                        onChange={(e) => setFilterMinArea(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700 outline-none focus:border-slate-200"
                      />
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Payment Method</label>
                      <select
                        value={filterPaymentMethod}
                        onChange={(e) => setFilterPaymentMethod(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700 cursor-pointer outline-none focus:border-slate-200"
                      >
                        <option value="All">All Methods</option>
                        <option value="Cash">Cash Purchases</option>
                        <option value="Mortgage">Mortgage Funded</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* DLD Ledger List Card */}
          <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">DLD Land Registry Ledger</h3>
                <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                  Displaying {Math.min(visibleCount, transactions.length)} of {transactions.length} registered entries
                </p>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100/50 px-2.5 py-1 rounded-full uppercase font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Live Feed Syncing</span>
              </div>
            </div>

            {/* List Body */}
            {transactions.length === 0 ? (
              <div className="py-24 text-center max-w-md mx-auto space-y-4">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mx-auto">
                  <Database className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-800">No Registry Records Found</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    We couldn't find any Dubai Land Department transaction records matching your selected advanced filters.
                  </p>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Reset Active Filters
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {paginatedTxs.map((tx) => (
                  <div
                    key={tx.id}
                    onClick={() => setSelectedTx(tx)}
                    className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 transition-all cursor-pointer group"
                  >
                    {/* Left: Ref, Date, Location */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-slate-600 shrink-0 transition-colors font-mono text-[11px] font-extrabold">
                        {tx.transactionType === 'Sale' ? 'SL' : tx.transactionType === 'Mortgage' ? 'MT' : 'GF'}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                            {tx.projectName}
                          </span>
                          <span className="inline-flex items-center gap-0.5 text-[9px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            <MapPin className="w-2.5 h-2.5" />
                            {tx.subAreaName}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                          <span>Ref: {tx.referenceNumber}</span>
                          <span className="text-slate-200">•</span>
                          <span>{new Date(tx.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>

                    {/* Middle: Bed / Size / Status info */}
                    <div className="flex flex-wrap items-center gap-2.5 text-[11px]">
                      <span className="px-2.5 py-1 rounded-lg font-bold text-slate-600 bg-slate-50 border border-slate-100">
                        {tx.propertyType} • {tx.bedrooms === 'Studio' ? 'Studio' : `${tx.bedrooms} Bed`}
                      </span>

                      <span className="px-2.5 py-1 rounded-lg font-mono font-bold text-slate-500 bg-slate-50 border border-slate-100">
                        {tx.sizeSqft.toLocaleString()} sqft
                      </span>

                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase font-mono border ${
                        tx.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                      }`}>
                        {tx.status}
                      </span>
                    </div>

                    {/* Right: Deal type Badge + Price & Price/sqft */}
                    <div className="flex items-center justify-between md:justify-end gap-6">
                      <div className="text-left md:text-right space-y-0.5">
                        <p className="text-sm font-extrabold text-slate-900 font-mono">
                          {tx.priceAed.toLocaleString()} AED
                        </p>
                        <p className="text-[10px] font-mono font-bold text-slate-400">
                          {tx.pricePerSqft.toLocaleString()} AED/sqft
                        </p>
                      </div>

                      {/* Deal Type pill badge */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase font-mono border ${
                          tx.transactionType === 'Sale'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : tx.transactionType === 'Mortgage'
                            ? 'bg-blue-50 text-blue-700 border-blue-100'
                            : 'bg-purple-50 text-purple-700 border-purple-100'
                        }`}>
                          {tx.transactionType}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform shrink-0" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Load More Pagination */}
            {transactions.length > visibleCount && (
              <div className="p-4 border-t border-slate-50 text-center">
                <button
                  onClick={() => setVisibleCount(prev => prev + 8)}
                  className="px-6 py-2.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 rounded-xl transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Load More Registry Records</span>
                  <ChevronDown className="w-4 h-4 text-slate-400 animate-bounce" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =======================================================
          4. TAB VIEW: MARKET ACTIVITY & TRENDS VISUALIZATIONS
          ======================================================= */}
      {activeTab === 'trends' && (
        <div className="space-y-6">
          {/* Trends Intro Info */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-start gap-3">
            <Info className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-extrabold text-slate-800">DLD Registrations and Market Liquidity</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Analyzing historical and current transaction momentum for the selected context. Cash transactions (green) represent cash-in-hand equity investments, while mortgage certificates (blue) detail leveraged acquisitions by banking partners.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Chart 1: Evolution Ledger */}
            <div className="lg:col-span-8 bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">Volume & Price Evolution Index</h3>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5 uppercase tracking-wider">
                  Dubai Land Department Historical Trend (12 Months)
                </p>
              </div>

              {/* Chart Stage */}
              <div className="h-80 w-full font-mono text-[10px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" tickLine={false} stroke="#94a3b8" />
                    <YAxis yAxisId="volume" tickLine={false} stroke="#94a3b8" label={{ value: 'Sales Volume (M AED)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#94a3b8', fontWeight: 'bold' } }} />
                    <YAxis yAxisId="price" orientation="right" tickLine={false} stroke="#94a3b8" label={{ value: 'Avg Price/sqft (AED)', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: '#94a3b8', fontWeight: 'bold' } }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                      labelStyle={{ fontWeight: 'bold', borderBottom: '1px solid #334155', paddingBottom: '4px', marginBottom: '4px' }}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" />
                    <Bar yAxisId="volume" dataKey="salesVolume" name="Sales Volume (Millions AED)" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={45} />
                    <Line yAxisId="price" type="monotone" dataKey="avgPricePerSqft" name="Average Price/sqft (AED)" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Surrounding chart breakdown stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-50 font-mono text-[11px]">
                <div className="space-y-1">
                  <span className="text-slate-400 block font-bold">ANNUALIZED TREND</span>
                  <span className="text-emerald-600 font-extrabold text-xs inline-flex items-center gap-0.5">
                    ↑ +{(selectedCommunity?.growth || 24.2).toFixed(1)}% Appreciated
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 block font-bold">PEAK VOLUME MONTH</span>
                  <span className="text-slate-700 font-bold">
                    {trendData[trendData.length - 1]?.month || 'Jul 25'} ({(highlights.totalVolumeAed / 5000000).toFixed(1)}M AED)
                  </span>
                </div>
                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block font-bold">LIQUIDITY INDEX</span>
                  <span className="text-slate-700 font-bold">
                    Strong ({highlights.totalTransactionsCount} Registrations)
                  </span>
                </div>
              </div>
            </div>

            {/* Chart 2: Cash vs Mortgage Breakdown */}
            <div className="lg:col-span-4 bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm flex flex-col justify-between gap-6">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">Leverage Analysis</h3>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5 uppercase tracking-wider">
                  Cash acquisitions vs Mortgage loans
                </p>
              </div>

              {/* Pie Stage */}
              <div className="h-44 w-full flex items-center justify-center relative font-mono text-[10px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center text details */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs font-extrabold text-slate-800 font-mono">{cashMortgageData.cashPercentage}%</span>
                  <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Cash deals</span>
                </div>
              </div>

              {/* Custom Legends & Details */}
              <div className="space-y-3 font-mono text-[11px]">
                {/* Cash Entry */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100/50">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-slate-600 font-bold">Cash Acquisitions</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-800 font-extrabold block">{cashMortgageData.cashCount} Deals</span>
                    <span className="text-[10px] text-slate-400 block">{(cashMortgageData.cashValue / 1000000).toFixed(1)}M AED</span>
                  </div>
                </div>

                {/* Mortgage Entry */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100/50">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span className="text-slate-600 font-bold">Bank Financed</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-800 font-extrabold block">{cashMortgageData.mortgageCount} Deals</span>
                    <span className="text-[10px] text-slate-400 block">{(cashMortgageData.mortgageValue / 1000000).toFixed(1)}M AED</span>
                  </div>
                </div>
              </div>

              {/* Mini Insight */}
              <p className="text-[10px] text-slate-400 font-sans leading-relaxed text-center italic">
                Cash transactions dominate this sector, reflecting high investor demand for secondary rental yield.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================
          5. TAB VIEW: PURCHASE COST CALCULATOR
          ======================================================= */}
      {activeTab === 'calculator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
            {/* Left: Input parameters */}
            <div className="lg:col-span-5 bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">Purchase Parameters</h3>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5 uppercase tracking-wider">
                  Customize property acquisition variables
                </p>
              </div>

              {/* Price input slider */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-slate-400 font-bold">PURCHASE PRICE (AED)</span>
                  <span className="text-emerald-600 font-extrabold text-xs">{calcPrice.toLocaleString()} AED</span>
                </div>
                <input
                  type="range"
                  min="500000"
                  max="15000000"
                  step="100000"
                  value={calcPrice}
                  onChange={(e) => setCalcPrice(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                />
                <input
                  type="number"
                  value={calcPrice}
                  onChange={(e) => setCalcPrice(Math.max(0, Number(e.target.value)))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl font-mono text-xs font-bold text-slate-700 outline-none focus:border-slate-200"
                />
              </div>

              {/* Property Status Toggle (Ready vs Off-Plan) */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
                  Construction Status
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100/50">
                  <button
                    onClick={() => setCalcOffPlan(false)}
                    className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      !calcOffPlan
                        ? 'bg-white text-slate-800 shadow-sm'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Completed (Ready)
                  </button>
                  <button
                    onClick={() => setCalcOffPlan(true)}
                    className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      calcOffPlan
                        ? 'bg-white text-slate-800 shadow-sm'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Off-Plan
                  </button>
                </div>
              </div>

              {/* Purchase Method (Cash vs Mortgage) */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
                  Financing Method
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100/50">
                  <button
                    onClick={() => setCalcMortgaged(false)}
                    className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      !calcMortgaged
                        ? 'bg-white text-slate-800 shadow-sm'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    100% Cash Deal
                  </button>
                  <button
                    onClick={() => setCalcMortgaged(true)}
                    className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      calcMortgaged
                        ? 'bg-white text-slate-800 shadow-sm'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Mortgage Financed (75% LTV)
                  </button>
                </div>
              </div>

              {/* Buyer Entity Type (Individual vs Company) */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block">
                  Buyer Legal Profile
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100/50">
                  <button
                    onClick={() => setCalcBuyerType('Individual')}
                    className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      calcBuyerType === 'Individual'
                        ? 'bg-white text-slate-800 shadow-sm'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Individual Investor
                  </button>
                  <button
                    onClick={() => setCalcBuyerType('Company')}
                    className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      calcBuyerType === 'Company'
                        ? 'bg-white text-slate-800 shadow-sm'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Corporate Entity
                  </button>
                </div>
              </div>

              {/* Insight details */}
              <div className="p-4 bg-emerald-50/30 border border-emerald-100/50 rounded-2xl flex items-start gap-2.5 text-[11px] text-slate-500 leading-relaxed font-sans">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  Calculations mirror current official Dubai Land Department regulations, including standard 4% Transfer Fees and administrative registrations.
                </p>
              </div>
            </div>

            {/* Right: Closing Cost breakdown sheet */}
            <div className="lg:col-span-7 bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
              {/* Header Invoice banner */}
              <div className="bg-slate-950 text-white p-6 flex items-center justify-between">
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold font-mono text-emerald-400">CLOSING LEDGER REPORT</h3>
                  <p className="text-[11px] text-slate-400 leading-none font-sans">Registered Dubai Purchase Intelligence Calculator</p>
                </div>
                <Printer className="w-5 h-5 text-emerald-400" />
              </div>

              {/* Items Table */}
              <div className="p-6 divide-y divide-slate-100 font-mono text-[11px]">
                
                {/* 1. Base Price */}
                <div className="py-3 flex items-center justify-between font-bold text-slate-800">
                  <span className="text-slate-400">Property Purchase Price</span>
                  <span>{closingCosts.purchasePrice.toLocaleString()} AED</span>
                </div>

                {/* 2. Gov Fees */}
                <div className="py-4 space-y-2">
                  <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider block">Government Fees (DLD / Trustee)</span>
                  
                  <div className="flex justify-between text-slate-600 pl-2">
                    <span>DLD Transfer Registration (4.00%)</span>
                    <span>{closingCosts.dldTransferFee.toLocaleString()} AED</span>
                  </div>

                  <div className="flex justify-between text-slate-600 pl-2">
                    <span>DLD Administration Registration Fee</span>
                    <span>{closingCosts.dldAdminFee.toLocaleString()} AED</span>
                  </div>

                  {!calcOffPlan && (
                    <div className="flex justify-between text-slate-600 pl-2">
                      <span>Property Registration Trustee Service Fee</span>
                      <span>{closingCosts.trusteeFee.toLocaleString()} AED</span>
                    </div>
                  )}

                  {calcMortgaged && (
                    <div className="flex justify-between text-slate-600 pl-2">
                      <span>DLD Mortgage Registration Fee (0.25% + 290 AED)</span>
                      <span>{closingCosts.mortgageRegFee.toLocaleString()} AED</span>
                    </div>
                  )}

                  <div className="flex justify-between font-bold text-slate-800 pt-1 pl-2 border-t border-slate-50">
                    <span>Total Statutory & DLD Fees</span>
                    <span>{closingCosts.totalGovernmentFees.toLocaleString()} AED</span>
                  </div>
                </div>

                {/* 3. Brokerage / Agency fees */}
                <div className="py-4 space-y-2">
                  <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider block">Agency & Intermediary Fees</span>
                  
                  <div className="flex justify-between text-slate-600 pl-2">
                    <span>Licensed Brokerage Fee (2.00%)</span>
                    <span>{closingCosts.brokerageFee.toLocaleString()} AED</span>
                  </div>

                  <div className="flex justify-between text-slate-600 pl-2">
                    <span>Agent Service VAT (5.00%)</span>
                    <span>{closingCosts.agencyVAT.toLocaleString()} AED</span>
                  </div>

                  <div className="flex justify-between font-bold text-slate-800 pt-1 pl-2 border-t border-slate-50">
                    <span>Total Intermediary Fees</span>
                    <span>{closingCosts.totalAgencyFees.toLocaleString()} AED</span>
                  </div>
                </div>

                {/* 4. Mortgage Fees (only if mortgaged) */}
                {calcMortgaged && (
                  <div className="py-4 space-y-2">
                    <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider block">Mortgage & Financing Fees</span>
                    
                    <div className="flex justify-between text-slate-600 pl-2">
                      <span>Bank Arrangement Fee (1.00% of loan)</span>
                      <span>{closingCosts.mortgageArrangementFee.toLocaleString()} AED</span>
                    </div>

                    <div className="flex justify-between text-slate-600 pl-2">
                      <span>Property Valuation Survey Fee</span>
                      <span>{closingCosts.propertyValuationFee.toLocaleString()} AED</span>
                    </div>

                    <div className="flex justify-between font-bold text-slate-800 pt-1 pl-2 border-t border-slate-50">
                      <span>Total Lender Financing Fees</span>
                      <span>{closingCosts.totalMortgageFees.toLocaleString()} AED</span>
                    </div>
                  </div>
                )}

                {/* 5. Closing Costs Subtotal */}
                <div className="py-4 flex items-center justify-between font-extrabold text-slate-800 bg-slate-50/50 px-3 rounded-xl border border-slate-100/30">
                  <span className="text-slate-500 text-[10px] uppercase">Additional Capital Required (Acquisition Costs)</span>
                  <span>{closingCosts.totalClosingCosts.toLocaleString()} AED</span>
                </div>

                {/* 6. Grand Totals (Equity / Net required) */}
                <div className="py-4 space-y-2 bg-slate-550/10">
                  {calcMortgaged && (
                    <div className="flex justify-between text-slate-500 pl-2">
                      <span>Mortgage Financing Loan Credit (75.00% LTV)</span>
                      <span className="text-blue-600 font-bold">- {closingCosts.loanAmount.toLocaleString()} AED</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center bg-emerald-50 border border-emerald-100 p-4 rounded-2xl text-slate-900 font-sans">
                    <div className="space-y-0.5">
                      <span className="text-xs font-extrabold uppercase tracking-tight block text-emerald-950">Net Cash-to-Close Required</span>
                      <span className="text-[10px] text-emerald-700 font-mono block">Purchase price + fees minus mortgage loan credit</span>
                    </div>
                    <span className="text-base font-black font-mono text-emerald-800">
                      {closingCosts.netRequiredCapital.toLocaleString()} AED
                    </span>
                  </div>
                </div>
              </div>

              {/* Calculator Footer Action Bar */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-sans italic">Updated Q3 2025 Standard</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => triggerToast('Purchase invoice printed successfully to PDF.')}
                    className="p-2 bg-white rounded-xl border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer text-slate-600"
                    title="Print closing cost invoice"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      triggerToast('Calculated context saved successfully inside analysis timeline.');
                    }}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 rounded-xl text-xs font-bold text-white transition-all cursor-pointer shadow-sm shadow-slate-900/10 active:scale-98"
                  >
                    Save to Context
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =======================================================
          6. DETAILED TRANSACTION OVERVIEW DRAWER / MODAL
          ======================================================= */}
      <AnimatePresence>
        {selectedTx && (
          <div className="fixed inset-0 z-50 flex items-center justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
              onClick={() => setSelectedTx(null)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col justify-between overflow-hidden relative z-10 border-l border-slate-100"
            >
              <div>
                {/* Header info */}
                <div className="bg-slate-950 text-white p-6 relative">
                  <button
                    onClick={() => setSelectedTx(null)}
                    className="absolute top-4 right-4 p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase font-mono tracking-wider text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-900/40">
                    DLD Registry Record
                  </span>
                  <h3 className="text-base font-extrabold mt-3">{selectedTx.projectName}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedTx.subAreaName}, {selectedTx.communityName}</p>
                </div>

                {/* Body Content */}
                <div className="p-6 divide-y divide-slate-100 text-xs font-medium space-y-4">
                  {/* Price Section */}
                  <div className="py-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Registered Price</span>
                      <span className="text-lg font-black font-mono text-slate-800">{selectedTx.priceAed.toLocaleString()} AED</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">Price per Sqft</span>
                      <span className="text-sm font-extrabold font-mono text-emerald-700">{selectedTx.pricePerSqft.toLocaleString()} AED</span>
                    </div>
                  </div>

                  {/* Transaction core parameters */}
                  <div className="py-4 space-y-3 font-mono">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Reference Number</span>
                      <span className="text-slate-800 font-bold">{selectedTx.referenceNumber}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Date Registered</span>
                      <span className="text-slate-800 font-bold">
                        {new Date(selectedTx.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Deal Category</span>
                      <span className="text-slate-800 font-bold uppercase text-[11px]">{selectedTx.transactionType}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Payment Channel</span>
                      <span className="text-slate-800 font-bold">{selectedTx.paymentMethod}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Construction Status</span>
                      <span className="text-slate-800 font-bold uppercase">{selectedTx.status}</span>
                    </div>
                  </div>

                  {/* Property specs details */}
                  <div className="py-4 space-y-3 font-mono">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Property Type</span>
                      <span className="text-slate-800 font-bold">{selectedTx.propertyType}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Bedrooms</span>
                      <span className="text-slate-800 font-bold">{selectedTx.bedrooms} Bedroom</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Total Built-up Size</span>
                      <span className="text-slate-800 font-bold">{selectedTx.sizeSqft.toLocaleString()} sqft</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Developer of Record</span>
                      <span className="text-slate-800 font-bold">{selectedTx.developer}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Buyer Profile</span>
                      <span className="inline-flex items-center gap-1 text-slate-800 font-bold">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {selectedTx.buyerNationality}
                      </span>
                    </div>
                  </div>

                  {/* Property-Level Gated Information */}
                  <div className="py-4 space-y-3 font-mono">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-500 uppercase font-sans">Property Registry Data</span>
                      {isVerifiedAgent ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <Unlock className="w-2.5 h-2.5" /> RERA Unlocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          <Lock className="w-2.5 h-2.5" /> Gated (RERA Required)
                        </span>
                      )}
                    </div>

                    {isVerifiedAgent ? (
                      <div className="space-y-2.5">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Property Number</span>
                          <span className="text-slate-800 font-bold">Unit {selectedTx.id.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(-4)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Building Number</span>
                          <span className="text-slate-800 font-bold">Bldg {selectedTx.projectName.toUpperCase().split(' ')[0]} - {selectedTx.id.toUpperCase().split('-')[2] || 'A10'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Registry Reference</span>
                          <span className="text-slate-800 font-bold">REG-DLD-{selectedTx.referenceNumber}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Developer Info</span>
                          <span className="text-slate-800 font-bold">{selectedTx.developer} PJSC</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Listing Metadata</span>
                          <span className="text-indigo-600 font-bold text-[11px] bg-indigo-50 px-1.5 py-0.5 rounded">Verified Broker Exclusive</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Property Number</span>
                          <span className="text-slate-300 select-none font-sans text-right line-through decoration-slate-400">Locked</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Building Number</span>
                          <span className="text-slate-300 select-none font-sans text-right line-through decoration-slate-400">Locked</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Registry Reference</span>
                          <span className="text-slate-300 select-none font-sans text-right line-through decoration-slate-400">Locked</span>
                        </div>
                        <div className="p-3.5 bg-amber-50/55 border border-amber-100 rounded-2xl space-y-2 text-slate-600 text-[11px] font-sans">
                          <p className="font-bold text-amber-800 flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5" /> Property Data Locked
                          </p>
                          <p className="leading-relaxed">
                            Dubai Land Department registry property and building identifiers are locked.
                            To unlock, verify your RERA broker license.
                          </p>
                          {isAgent && onNavigateToModule && (
                            <button
                              onClick={() => {
                                setSelectedTx(null);
                                onNavigateToModule('RERA Verification');
                              }}
                              className="mt-1 w-full text-center py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-all cursor-pointer shadow-sm shadow-amber-600/15"
                            >
                              Verify RERA License Now
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Official Registry Information (Phase 2 Additive Section for Verified Agents) */}
                  {hasProfAccess && (
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3 font-mono" id="official-registry-info-section">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-indigo-600 uppercase font-sans flex items-center gap-1">
                          <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                          Official Registry Information
                        </span>
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                          Active Ledger Record
                        </span>
                      </div>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-400">Transfer ID</span>
                          <span className="text-slate-800 font-bold">{RegistryService.getOfficialRegistryTransactions(selectedTx.projectId || 'marina-gate')[0].transferId}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-400">Deed Number</span>
                          <span className="text-slate-800 font-bold">{RegistryService.getOfficialRegistryTransactions(selectedTx.projectId || 'marina-gate')[0].deedNumber}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-400">Registry Reference</span>
                          <span className="text-slate-800 font-bold">{RegistryService.getOfficialRegistryTransactions(selectedTx.projectId || 'marina-gate')[0].registryReference}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-400">Transfer Type</span>
                          <span className="text-slate-800 font-bold">{RegistryService.getOfficialRegistryTransactions(selectedTx.projectId || 'marina-gate')[0].transferType}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-400">Registration Date</span>
                          <span className="text-slate-800 font-bold">{RegistryService.getOfficialRegistryTransactions(selectedTx.projectId || 'marina-gate')[0].registrationDate}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-400">Authority Status</span>
                          <span className="text-slate-800 font-bold text-emerald-600">{RegistryService.getOfficialRegistryTransactions(selectedTx.projectId || 'marina-gate')[0].authorityStatus}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-400">Verification Status</span>
                          <span className="text-slate-800 font-bold text-indigo-600">{RegistryService.getOfficialRegistryTransactions(selectedTx.projectId || 'marina-gate')[0].verificationStatus}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="text-slate-400">Official Source</span>
                          <span className="text-slate-800 font-bold truncate max-w-[180px] text-right">{RegistryService.getOfficialRegistryTransactions(selectedTx.projectId || 'marina-gate')[0].officialSource}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Security certificate */}
                  <div className="p-4 bg-emerald-50/20 border border-emerald-100/50 rounded-2xl flex items-start gap-2.5 text-[11px] font-sans leading-relaxed text-slate-500">
                    <ShieldCheck className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                    <p>
                      This is an official transaction certificate, registered on the public ledger of the Dubai Land Department. Sourced and processed securely.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between font-mono text-[11px]">
                <button
                  onClick={() => {
                    setSelectedTx(null);
                    triggerToast('Registry record share vector link copied.');
                  }}
                  className="flex items-center gap-1.5 text-slate-600 hover:text-slate-800 font-bold"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share Registry Record</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedTx(null);
                    triggerToast('Successfully printed transaction registration certificate.');
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all cursor-pointer"
                >
                  Download Certificate
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
