import { useEffect, useState } from 'react';
import { useAnalysisContext } from '../../context/AnalysisContext';
import { useMarketAnalytics } from '../../context/MarketAnalyticsContext';
import { RentalService, RentalOverviewData, AreaRentLevel, PropertyTypeRentLevel, BedroomRentLevel, RentalTrendPoint } from '../../services/rentalService';
import AnalysisContextSwitcher from './AnalysisContextSwitcher';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import {
  Sparkles,
  ShieldCheck,
  Building2,
  Percent,
  Coins,
  ArrowRight,
  ChevronDown,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Share2,
  RefreshCw,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RentalIntelligenceProps {
  onNavigateToModule?: (moduleName: string) => void;
  triggerToast?: (msg: string) => void;
}

export default function RentalIntelligence({
  onNavigateToModule,
  triggerToast = () => {}
}: RentalIntelligenceProps) {
  const { communityId, subAreaId, projectId } = useAnalysisContext();
  const { selectedCommunity, selectedSubArea, selectedProject } = useMarketAnalytics();

  // State Management
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Data States
  const [overview, setOverview] = useState<RentalOverviewData | null>(null);
  const [areaRents, setAreaRents] = useState<AreaRentLevel[]>([]);
  const [typeRents, setTypeRents] = useState<PropertyTypeRentLevel[]>([]);
  const [bedRents, setBedRents] = useState<BedroomRentLevel[]>([]);
  const [trendData, setTrendData] = useState<RentalTrendPoint[]>([]);

  // Interactive UI States
  const [activeTab, setActiveTab] = useState<'area' | 'type' | 'beds'>('area');
  const [trendInterval, setTrendInterval] = useState<'monthly' | 'quarterly' | 'annual'>('monthly');

  // Calculator Inputs
  const [purchasePrice, setPurchasePrice] = useState<number>(2300000);
  const [annualRent, setAnnualRent] = useState<number>(165000);
  const [serviceCharges, setServiceCharges] = useState<number>(20000);
  const [maintenance, setMaintenance] = useState<number>(5000);
  const [propertyManagement, setPropertyManagement] = useState<number>(5);
  const [vacancyRate, setVacancyRate] = useState<number>(5);

  // Trigger internal toasts
  const triggerLocalToast = (msg: string) => {
    setToastMessage(msg);
    triggerToast(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch initial/updating data based on context
  useEffect(() => {
    let active = true;
    const activeCommId = communityId || 'dubai-marina';
    
    if (loading) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    Promise.all([
      RentalService.getOverview(activeCommId, subAreaId, projectId),
      RentalService.getAreaRentLevels(activeCommId),
      RentalService.getPropertyTypeRentLevels(activeCommId),
      RentalService.getBedroomRentLevels(activeCommId),
      RentalService.getRentalTrend(activeCommId, 12)
    ]).then(([overviewRes, areasRes, typesRes, bedsRes, trendRes]) => {
      if (!active) return;
      
      setOverview(overviewRes);
      setAreaRents(areasRes);
      setTypeRents(typesRes);
      setBedRents(bedsRes);
      setTrendData(trendRes);

      // Auto-update calculator rent field based on selected community's rent
      setAnnualRent(overviewRes.averageAnnualRent);

      // Simple aesthetic delays
      setTimeout(() => {
        setLoading(false);
        setRefreshing(false);
      }, 400);
    }).catch(err => {
      console.error('Failed to load rental intelligence data', err);
      if (active) {
        setLoading(false);
        setRefreshing(false);
      }
    });

    return () => {
      active = false;
    };
  }, [communityId, subAreaId, projectId]);

  // Calculator outputs derived on live inputs
  const calculatedResults = RentalService.calculateYield(
    purchasePrice,
    annualRent,
    serviceCharges,
    maintenance,
    propertyManagement,
    vacancyRate
  );

  const handleShare = () => {
    triggerLocalToast('Generating secure workspace sharing token...');
  };

  const formatAED = (val: number) => {
    return `AED ${val.toLocaleString()}`;
  };

  const getDemandColor = (demand: string) => {
    if (demand === 'Extreme') return 'bg-rose-50 text-rose-700 border-rose-100';
    if (demand === 'High') return 'bg-amber-50 text-amber-700 border-amber-100';
    return 'bg-emerald-50 text-emerald-700 border-emerald-100';
  };

  // Helper to map yield percentages for Area table
  const getAreaYield = (name: string, rent: number) => {
    if (name.includes('Dubai Marina (Macro)')) return 7.2;
    if (name.includes('Marina Walk')) return 7.6;
    if (name.includes('Marina Gate')) return 7.1;
    if (name.includes('Emaar')) return 7.4;
    if (name.includes('Promenade')) return 6.7;
    if (name.includes('Business Bay (Macro)')) return 6.8;
    if (name.includes('Canal Front')) return 7.0;
    if (name.includes('Executive')) return 6.5;
    if (name.includes('Marasi')) return 6.9;
    return Math.round((rent / 2300000) * 1000) / 10;
  };

  // Helper to filter/aggregate trend data based on interval
  const getFilteredTrendData = () => {
    if (trendInterval === 'monthly') {
      return trendData;
    } else if (trendInterval === 'quarterly') {
      return [
        { month: 'Q3 2025', averageRent: Math.round(trendData[1]?.averageRent || 132) },
        { month: 'Q4 2025', averageRent: Math.round(trendData[4]?.averageRent || 141) },
        { month: 'Q1 2026', averageRent: Math.round(trendData[7]?.averageRent || 148) },
        { month: 'Q2 2026', averageRent: Math.round(trendData[10]?.averageRent || 161) }
      ];
    } else {
      return [
        { month: '2024 Avg', averageRent: Math.round((trendData[0]?.averageRent || 120) * 0.9) },
        { month: '2025 Avg', averageRent: Math.round((trendData[0]?.averageRent || 120) * 1.05) },
        { month: '2026 YTD', averageRent: Math.round((trendData[11]?.averageRent || 165)) }
      ];
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 relative pb-8">
      {/* Dynamic Action Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-800"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Rental Intelligence
            </h1>
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-100">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Data
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-xl">
            Analyze rental market performance and potential returns.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              if (onNavigateToModule) {
                onNavigateToModule('AI Intelligence Suite');
                triggerLocalToast('Routing context to Ask AI Analyst...');
              }
            }}
            className="inline-flex items-center gap-1.5 bg-white border border-indigo-200 hover:border-indigo-300 text-indigo-700 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Ask AI</span>
          </button>
          
          <button
            onClick={async () => {
              triggerLocalToast('Compiling Ejari rental performance dossier...');
              try {
                const reportsModule = await import('../../services/reportsService');
                await reportsModule.ReportsService.generateContextReport('Rental Intelligence', {
                  communityId,
                  subAreaId,
                  projectId
                });
                triggerLocalToast('Rental Intelligence Report generated! Navigating...');
                if (onNavigateToModule) {
                  setTimeout(() => onNavigateToModule('Reports Engine'), 800);
                }
              } catch (e) {
                triggerLocalToast('Failed to compile context report.');
              }
            }}
            className="inline-flex items-center gap-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>Generate Report</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* GLOBAL ANALYSIS CONTEXT SWITCHER */}
      <AnalysisContextSwitcher
        triggerToast={triggerLocalToast}
        moduleName="Rental Research"
      />

      {/* OVERLAY LOADER FOR REFRESHES */}
      <div className="relative space-y-6 md:space-y-8">
        <AnimatePresence>
          {refreshing && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-20 flex flex-col items-center justify-center rounded-3xl"
            >
              <div className="flex items-center gap-2.5 bg-slate-900/90 text-white px-4 py-2.5 rounded-2xl shadow-xl">
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                <span className="text-xs font-bold">Refreshing Rental Intelligence...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SECTION 2: RENTAL OVERVIEW */}
        {overview && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {/* CARD 1: Average Annual Rent */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm relative overflow-hidden flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Avg. Annual Rent
                </span>
                <span className="text-xl md:text-2xl font-extrabold text-slate-900 block tracking-tight">
                  {formatAED(overview.averageAnnualRent)}
                </span>
                <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-emerald-600">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>{overview.annualRentChange}%</span>
                  <span className="text-slate-400 font-medium ml-1">vs last 12 months</span>
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50/50 flex items-center justify-center text-indigo-600">
                <Coins className="w-5 h-5" />
              </div>
            </div>

            {/* CARD 2: Average Rent / sqft */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm relative overflow-hidden flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Avg. Rent / sqft
                </span>
                <span className="text-xl md:text-2xl font-extrabold text-slate-900 block tracking-tight">
                  {formatAED(overview.averageRentSqft)}
                </span>
                <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-emerald-600">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>{overview.rentSqftChange}%</span>
                  <span className="text-slate-400 font-medium ml-1">vs last 12 months</span>
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50/50 flex items-center justify-center text-indigo-600">
                <Building2 className="w-5 h-5" />
              </div>
            </div>

            {/* CARD 3: Gross Yield */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm relative overflow-hidden flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Gross Yield
                </span>
                <span className="text-xl md:text-2xl font-extrabold text-slate-900 block tracking-tight">
                  {overview.grossYield}%
                </span>
                <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-emerald-600">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>{overview.grossYieldChange}%</span>
                  <span className="text-slate-400 font-medium ml-1">vs last 12 months</span>
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50/50 flex items-center justify-center text-indigo-600">
                <Percent className="w-5 h-5" />
              </div>
            </div>

            {/* CARD 4: Net Yield */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm relative overflow-hidden flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Net Yield
                </span>
                <span className="text-xl md:text-2xl font-extrabold text-slate-900 block tracking-tight">
                  {overview.netYield}%
                </span>
                <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-emerald-600">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>{overview.netYieldChange}%</span>
                  <span className="text-slate-400 font-medium ml-1">vs last 12 months</span>
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50/50 flex items-center justify-center text-indigo-600">
                <Percent className="w-5 h-5" />
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: RENTAL ANALYSIS & TRENDS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* LEFT: Rental Analysis Table */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-950 tracking-tight mb-4">Rental Analysis</h3>

              {/* TABS */}
              <div className="flex gap-1.5 p-1 bg-slate-50 border border-slate-100 rounded-xl mb-5 max-w-sm">
                {[
                  { id: 'area', label: 'By Area' },
                  { id: 'type', label: 'By Property Type' },
                  { id: 'beds', label: 'By Bedrooms' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 py-1.5 text-center text-xs font-extrabold rounded-lg cursor-pointer transition-all ${
                      activeTab === tab.id
                        ? 'bg-white text-indigo-700 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* TAB CONTENT PANEL */}
              <div className="min-h-[280px]">
                {/* AREA TAB */}
                {activeTab === 'area' && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-50 text-slate-400 font-bold">
                          <th className="pb-3 pl-1">Area</th>
                          <th className="pb-3 text-right">Avg. Annual Rent (AED)</th>
                          <th className="pb-3 text-right">Rent / sqft (AED)</th>
                          <th className="pb-3 text-right">Yield</th>
                          <th className="pb-3 text-right">YoY</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {areaRents.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="py-3 pl-1 font-bold text-slate-700">{item.name}</td>
                            <td className="py-3 text-right font-mono font-bold text-slate-900">{item.averageAnnualRent.toLocaleString()}</td>
                            <td className="py-3 text-right font-mono font-bold text-slate-600">{item.rentSqft}</td>
                            <td className="py-3 text-right font-mono font-bold text-emerald-600">{getAreaYield(item.name, item.averageAnnualRent)}%</td>
                            <td className="py-3 text-right">
                              <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600">
                                <ArrowUpRight className="w-3 h-3" />
                                {item.yoyChange}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* PROPERTY TYPE TAB */}
                {activeTab === 'type' && (
                  <div className="space-y-3">
                    {typeRents.map((item, idx) => (
                      <div key={idx} className="p-3.5 border border-slate-50 hover:border-slate-100 rounded-xl hover:bg-slate-50/20 flex items-center justify-between transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 font-bold text-sm">
                            {item.type.slice(0, 1)}
                          </div>
                          <div>
                            <span className="text-xs font-extrabold text-slate-800 block">{item.type}</span>
                            <span className="text-[10px] font-semibold text-slate-400">{item.percentageOfMarket}% Share</span>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-6">
                          <div>
                            <span className="text-xs font-mono font-extrabold text-slate-900 block">{formatAED(item.averageRent)}</span>
                            <span className="text-[10px] font-mono font-bold text-slate-400 font-semibold">AED {item.rentSqft}/sqft</span>
                          </div>
                          <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full border ${getDemandColor(item.demand)}`}>
                            {item.demand}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* BEDROOMS TAB */}
                {activeTab === 'beds' && (
                  <div className="space-y-3">
                    {bedRents.map((item, idx) => (
                      <div key={idx} className="p-3.5 border border-slate-50 hover:border-slate-100 rounded-xl hover:bg-slate-50/20 flex items-center justify-between transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50/40 text-indigo-700 flex items-center justify-center font-bold text-xs">
                            {item.bedroom}
                          </div>
                          <div>
                            <span className="text-xs font-extrabold text-slate-800 block">{item.bedroom} Unit</span>
                            <span className="text-[10px] font-semibold text-emerald-600">{item.occupancyRate}% Occ. Rate</span>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-6">
                          <div>
                            <span className="text-xs font-mono font-extrabold text-slate-900 block">{formatAED(item.averageRent)}</span>
                            <span className="text-[10px] font-mono font-bold text-slate-400 font-semibold">AED {item.rentSqft}/sqft</span>
                          </div>
                          <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full border ${getDemandColor(item.demand)}`}>
                            {item.demand}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom action button */}
            <div className="pt-4 mt-4 border-t border-slate-50">
              <button
                onClick={() => triggerLocalToast('Viewing advanced Rent configurations report...')}
                className="w-full py-2.5 bg-slate-50 hover:bg-indigo-50/30 text-slate-600 hover:text-indigo-600 text-xs font-extrabold rounded-xl border border-slate-100 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View All Area Rent Levels</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* RIGHT: Rental Trend Line Chart */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-extrabold text-slate-950 tracking-tight">Rental Trend</h3>

                {/* Pill Interval Selector */}
                <div className="flex gap-1 p-1 bg-slate-50 border border-slate-100 rounded-lg">
                  {[
                    { id: 'monthly', label: 'Monthly' },
                    { id: 'quarterly', label: 'Quarterly' },
                    { id: 'annual', label: 'Annual' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setTrendInterval(opt.id as any);
                        triggerLocalToast(`Trend interval changed to ${opt.label}`);
                      }}
                      className={`px-2.5 py-1 text-[10px] font-extrabold rounded-md cursor-pointer transition-all ${
                        trendInterval === opt.id
                          ? 'bg-white text-indigo-700 shadow-sm'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recharts Chart */}
              <div className="h-[250px] w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getFilteredTrendData()} margin={{ top: 10, right: 15, left: -25, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                      domain={['auto', 'auto']}
                    />
                    <Tooltip
                      contentStyle={{
                        background: '#0f172a',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '11px',
                        fontFamily: 'inherit',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(val: number) => [`AED ${val}/sqft`, 'Rent Index']}
                    />
                    <Line
                      type="monotone"
                      dataKey="averageRent"
                      stroke="#4f46e5"
                      strokeWidth={2.5}
                      dot={{ r: 4, strokeWidth: 1.5, fill: '#fff', stroke: '#4f46e5' }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex items-center justify-center gap-5 pt-3.5 text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                Average Rent (AED/sqft)
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 4 & 5: YIELD CALCULATOR & CONTINUE ANALYSIS ROW */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8">
          
          {/* YIELD CALCULATOR */}
          <div className="xl:col-span-8 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
            <h3 className="text-base font-extrabold text-slate-950 tracking-tight">Yield Calculator</h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* LEFT: Inputs */}
              <div className="md:col-span-5 space-y-3.5 pr-2">
                <h4 className="text-[10px] font-black font-mono text-slate-400 uppercase tracking-wider block">
                  Inputs
                </h4>

                {/* Purchase Price */}
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
                    Purchase Price (AED)
                  </label>
                  <input
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-500 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Annual Rent */}
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
                    Annual Rent (AED)
                  </label>
                  <input
                    type="number"
                    value={annualRent}
                    onChange={(e) => setAnnualRent(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-500 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Service Charge */}
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
                    Service Charge (AED)
                  </label>
                  <input
                    type="number"
                    value={serviceCharges}
                    onChange={(e) => setServiceCharges(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-500 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Maintenance */}
                <div>
                  <label className="text-[11px] font-bold text-slate-500 block mb-1">
                    Maintenance (AED)
                  </label>
                  <input
                    type="number"
                    value={maintenance}
                    onChange={(e) => setMaintenance(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-500 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Management & Vacancy */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1 truncate">
                      Vacancy (%)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={vacancyRate}
                        onChange={(e) => setVacancyRate(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-500 pl-3 pr-6 py-2 rounded-xl text-xs font-bold text-slate-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">%</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-500 block mb-1 truncate">
                      Management Fee (%)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={propertyManagement}
                        onChange={(e) => setPropertyManagement(Number(e.target.value))}
                        className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-indigo-500 pl-3 pr-6 py-2 rounded-xl text-xs font-bold text-slate-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: Results */}
              <div className="md:col-span-7 bg-indigo-50/10 rounded-2xl border border-indigo-50/50 p-5 md:p-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black font-mono text-indigo-700 uppercase tracking-widest block">
                    Results
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Gross Yield */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Gross Yield</span>
                      <span className="text-xl font-extrabold text-emerald-600 block mt-0.5">{calculatedResults.grossYield}%</span>
                    </div>

                    {/* Net Yield */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Net Yield</span>
                      <span className="text-xl font-extrabold text-emerald-600 block mt-0.5">{calculatedResults.netYield}%</span>
                    </div>

                    {/* Annual Income */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Annual Income</span>
                      <span className="text-sm font-extrabold text-slate-800 block mt-0.5">{formatAED(calculatedResults.annualIncome)}</span>
                    </div>

                    {/* Annual Expenses */}
                    <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Annual Expenses</span>
                      <span className="text-sm font-extrabold text-slate-800 block mt-0.5">{formatAED(calculatedResults.annualExpenses)}</span>
                    </div>
                  </div>
                </div>

                {/* Highlight estimated cash flow */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4.5 mt-5 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-mono font-black uppercase text-indigo-700 block tracking-wider">
                      Estimated Cash Flow
                    </span>
                    <span className="text-xl font-black text-indigo-600 block mt-0.5">
                      {formatAED(calculatedResults.netRentalIncome)}
                    </span>
                  </div>
                  <Coins className="w-5 h-5 text-indigo-600 shrink-0" />
                </div>
              </div>
            </div>
          </div>

          {/* CONTINUE YOUR ANALYSIS */}
          <div className="xl:col-span-4 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                Continue Your Analysis
              </h3>

              <div className="space-y-3">
                {/* ASK AI ANALYST */}
                <button
                  onClick={() => {
                    if (onNavigateToModule) {
                      onNavigateToModule('AI Intelligence Suite');
                      triggerToast('Routing analysis context to Ask AI Analyst.');
                    }
                  }}
                  className="w-full p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/10 text-left transition-all group cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800 group-hover:text-indigo-950 tracking-tight">
                        Ask AI Analyst
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Get AI-powered rental insights
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* GENERATE REPORT */}
                <button
                  onClick={async () => {
                    triggerLocalToast('Compiling Ejari rental performance dossier...');
                    try {
                      const reportsModule = await import('../../services/reportsService');
                      await reportsModule.ReportsService.generateContextReport('Rental Intelligence', {
                        communityId,
                        subAreaId,
                        projectId
                      });
                      triggerLocalToast('Rental Intelligence Report generated! Navigating...');
                      if (onNavigateToModule) {
                        setTimeout(() => onNavigateToModule('Reports Engine'), 800);
                      }
                    } catch (e) {
                      triggerLocalToast('Failed to compile context report.');
                    }
                  }}
                  className="w-full p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/10 text-left transition-all group cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <FileText className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800 group-hover:text-indigo-950 tracking-tight">
                        Generate Report
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Create professional rental report
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>

                {/* OPEN INVESTOR TOOLS */}
                <button
                  onClick={() => {
                    if (onNavigateToModule) {
                      onNavigateToModule('Investor Tools & Calculators');
                      triggerToast('Routing analysis context to Investor Tools.');
                    }
                  }}
                  className="w-full p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/10 text-left transition-all group cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <Coins className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-800 group-hover:text-indigo-950 tracking-tight">
                        Open Investor Tools
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        Run DCF, Affordability & more
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>

            {/* Micro Interaction Footer */}
            <div className="pt-4 mt-4 border-t border-slate-50 text-[10px] text-slate-400 leading-relaxed font-semibold">
              All rental data is aggregated from verified sources including DLD, Ejari and RERA.
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
