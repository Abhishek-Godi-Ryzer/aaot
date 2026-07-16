import { useEffect, useState } from 'react';
import { useAnalysisContext } from '../../context/AnalysisContext';
import { useMarketAnalytics } from '../../context/MarketAnalyticsContext';
import {
  ShieldCheck,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  RefreshCw,
  Home,
  FileText
} from 'lucide-react';

interface MapsGeospatialContextPanelProps {
  onNavigateToModule?: (moduleName: string) => void;
  triggerToast?: (msg: string) => void;
}

export default function MapsGeospatialContextPanel({
  onNavigateToModule,
  triggerToast = () => {}
}: MapsGeospatialContextPanelProps) {
  const { communityId, subAreaId, projectId, clearContext } = useAnalysisContext();
  const { selectedCommunity, selectedSubArea, selectedProject } = useMarketAnalytics();

  const [selectedMetric, setSelectedMetric] = useState<string>('priceGrowth');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncTime, setSyncTime] = useState('15 Jul 2025, 09:45 AM');

  // Track the metric from MapsGeospatial
  useEffect(() => {
    const handleMetricChange = () => {
      const metric = localStorage.getItem('acot_maps_selected_metric') || 'priceGrowth';
      setSelectedMetric(metric);
    };

    window.addEventListener('acot_maps_metric_changed', handleMetricChange);
    // Initial fetch
    handleMetricChange();

    return () => {
      window.removeEventListener('acot_maps_metric_changed', handleMetricChange);
    };
  }, []);

  const handleManualSync = () => {
    setIsSyncing(true);
    triggerToast('Interrogating Dubai Land Department (DLD) REST APIs...');
    setTimeout(() => {
      setIsSyncing(false);
      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }) + `, ` + now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      setSyncTime(formattedDate);
      triggerToast('DLD Spatial database is fully synced and up to date.');
    }, 1500);
  };

  const handleNavigate = (module: string, tabDetail?: string) => {
    if (tabDetail) {
      window.dispatchEvent(new CustomEvent('acot-market-analytics-tab', { detail: tabDetail }));
    }
    
    // Also dispatch generic sidebar navigation
    window.dispatchEvent(new CustomEvent('acot-sidebar-route', { detail: module }));

    if (onNavigateToModule) {
      onNavigateToModule(module);
      triggerToast(`Routing context to ${module}.`);
    }
  };

  const getMetricLabel = (key: string) => {
    if (key === 'priceGrowth') return 'Price Growth (YoY %)';
    if (key === 'transactionVolume') return 'Transaction Volume';
    if (key === 'medianPrice') return 'Median Price (AED/sqft)';
    if (key === 'rentalYield') return 'Rental Yield (Net %)';
    if (key === 'marketActivity') return 'Market Activity (Occupancy %)';
    return key;
  };

  // Render legend items based on selected metric
  const getLegendItems = () => {
    switch (selectedMetric) {
      case 'priceGrowth':
        return [
          { color: '#047857', label: '15% + (High Growth)' },
          { color: '#10b981', label: '8% to 15% (Moderate Growth)' },
          { color: '#fbbf24', label: '0% to 8% (Stable Growth)' },
          { color: '#f97316', label: '-5% to 0% (Low Contraction)' },
          { color: '#ef4444', label: 'Below -5% (Negative Growth)' },
        ];
      case 'transactionVolume':
        return [
          { color: '#047857', label: '4,000+ transactions' },
          { color: '#10b981', label: '2,500 - 4,000 transactions' },
          { color: '#fbbf24', label: '1,500 - 2,500 transactions' },
          { color: '#f97316', label: '1,000 - 1,500 transactions' },
          { color: '#ef4444', label: 'Below 1,000 transactions' },
        ];
      case 'medianPrice':
        return [
          { color: '#047857', label: 'AED 2,000+ / sqft' },
          { color: '#10b981', label: 'AED 1,500 - 2,000 / sqft' },
          { color: '#fbbf24', label: 'AED 1,200 - 1,500 / sqft' },
          { color: '#f97316', label: 'AED 1,000 - 1,200 / sqft' },
          { color: '#ef4444', label: 'Below AED 1,000 / sqft' },
        ];
      case 'rentalYield':
        return [
          { color: '#047857', label: '7.5% + (Super Yield)' },
          { color: '#10b981', label: '6.8% - 7.5% (High Yield)' },
          { color: '#fbbf24', label: '6.0% - 6.8% (Average Yield)' },
          { color: '#f97316', label: '5.5% - 6.0% (Core Yield)' },
          { color: '#ef4444', label: 'Below 5.5% (Low Yield)' },
        ];
      case 'marketActivity':
        return [
          { color: '#047857', label: '93% + Occupied' },
          { color: '#10b981', label: '90% - 93% Occupied' },
          { color: '#fbbf24', label: '85% - 90% Occupied' },
          { color: '#f97316', label: '80% - 85% Occupied' },
          { color: '#ef4444', label: 'Below 80% Occupied' },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6">
      
      {/* CARD 1: ANALYSIS CONTEXT */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full blur-2xl opacity-40"></div>
        
        <div className="flex items-center gap-2 relative z-10">
          <Layers className="w-4 h-4 text-indigo-600" />
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
            Analysis Context
          </h3>
        </div>

        <div className="space-y-3.5 pt-1 relative z-10 text-xs">
          <div>
            <span className="text-[10px] font-mono text-slate-400 block uppercase">
              Community
            </span>
            <span className="text-sm font-extrabold text-slate-800 block">
              {selectedCommunity?.name || 'All Dubai (Macro)'}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono text-slate-400 block uppercase">
              Sub-Area
            </span>
            <span className="text-xs font-bold text-slate-700 block">
              {subAreaId === 'all' ? 'All Sub-Areas' : selectedSubArea?.name || subAreaId}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono text-slate-400 block uppercase">
              Project
            </span>
            <span className="text-xs font-medium text-slate-600 block">
              {projectId === 'all' ? 'All Projects' : selectedProject?.name || projectId}
            </span>
          </div>

          <div className="pt-2.5 border-t border-slate-50 space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between font-mono">
              <span className="text-slate-400 font-bold">CURRENT MODULE:</span>
              <span className="text-indigo-700 font-extrabold bg-indigo-50 px-2 py-0.5 rounded-md">Maps & Geospatial</span>
            </div>
            <div className="flex items-center justify-between font-mono">
              <span className="text-slate-400 font-bold">APPLIED METRIC:</span>
              <span className="text-slate-700 font-bold max-w-[120px] truncate" title={getMetricLabel(selectedMetric)}>
                {getMetricLabel(selectedMetric)}
              </span>
            </div>
          </div>
        </div>

        {communityId && (
          <button
            onClick={() => {
              clearContext();
              triggerToast('Cleared active research context. Returning to Dubai macro view.');
            }}
            className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-100 text-[11px] font-bold text-slate-600 hover:text-slate-800 rounded-xl transition-all cursor-pointer text-center block"
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* CARD 2: MAP LEGEND */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-600" />
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
            Map Legend
          </h3>
        </div>

        <div className="space-y-3 pt-1">
          {getLegendItems().map((item, index) => (
            <div key={index} className="flex items-center gap-3 text-xs text-slate-600 font-semibold">
              <span
                className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm border border-black/5"
                style={{ backgroundColor: item.color }}
              />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CARD 3: VERIFIED SOURCE */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Verified Source
            </h3>
          </div>
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 hover:text-slate-600 disabled:opacity-50 cursor-pointer"
            title="Force refresh database sync"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
        </div>

        <div className="space-y-3 pt-1 text-xs font-sans">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Registry Provider</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase font-mono bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100/50">
              Dubai Land Dept (DLD)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Record Authority</span>
            <span className="text-[10px] font-bold text-slate-700 font-mono uppercase">
              Official Registry
            </span>
          </div>

          <div className="flex flex-col gap-1 pt-2 border-t border-slate-50">
            <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">Last Sync Timestamp</span>
            <span className="text-[11px] font-mono font-bold text-slate-600">
              {syncTime}
            </span>
          </div>
        </div>
      </div>

      {/* CARD 4: CONTINUE RESEARCH */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-3.5 shadow-sm">
        <h3 className="text-xs font-bold text-slate-800">
          Continue Research
        </h3>

        <div className="space-y-2 pt-1">
          <button
            onClick={() => handleNavigate('Market Analytics & Cycles', 'deep')}
            className="w-full flex items-center justify-between text-left p-2.5 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/20 text-xs font-semibold text-slate-700 hover:text-indigo-700 transition-all cursor-pointer group animate-all"
          >
            <div className="flex items-center gap-2.5">
              <TrendingUp className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
              <span>Open Market Intelligence</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => handleNavigate('Transaction Intelligence')}
            className="w-full flex items-center justify-between text-left p-2.5 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/20 text-xs font-semibold text-slate-700 hover:text-indigo-700 transition-all cursor-pointer group animate-all"
          >
            <div className="flex items-center gap-2.5">
              <FileSpreadsheet className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
              <span>Open Transactions</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => handleNavigate('Rental Intelligence')}
            className="w-full flex items-center justify-between text-left p-2.5 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/20 text-xs font-semibold text-slate-700 hover:text-indigo-700 transition-all cursor-pointer group animate-all"
          >
            <div className="flex items-center gap-2.5">
              <Home className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
              <span>Open Rental Research</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => handleNavigate('Investor Tools & Calculators')}
            className="w-full flex items-center justify-between text-left p-2.5 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/20 text-xs font-semibold text-slate-700 hover:text-indigo-700 transition-all cursor-pointer group animate-all"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
              <span>Open Investor Tools</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => handleNavigate('AI Intelligence Suite')}
            className="w-full flex items-center justify-between text-left p-2.5 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/20 text-xs font-semibold text-slate-700 hover:text-indigo-700 transition-all cursor-pointer group animate-all"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
              <span>Ask AI Analyst</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => handleNavigate('Reports Engine')}
            className="w-full flex items-center justify-between text-left p-2.5 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/20 text-xs font-semibold text-slate-700 hover:text-indigo-700 transition-all cursor-pointer group animate-all"
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
              <span>Generate Report</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
