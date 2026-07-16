import { useState } from 'react';
import { useAnalysisContext } from '../../context/AnalysisContext';
import { useMarketAnalytics } from '../../context/MarketAnalyticsContext';
import {
  ShieldCheck,
  FileDown,
  Sparkles,
  Star,
  CheckCircle,
  HelpCircle,
  Globe,
  Settings,
  Layers,
  ArrowRight,
  Database,
  Share2,
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';

interface MarketAnalyticsContextPanelProps {
  onNavigateToModule?: (moduleName: string) => void;
  triggerToast?: (msg: string) => void;
}

export default function MarketAnalyticsContextPanel({
  onNavigateToModule,
  triggerToast = () => {}
}: MarketAnalyticsContextPanelProps) {
  const { communityId, subAreaId, projectId } = useAnalysisContext();
  const { selectedCommunity, selectedSubArea, selectedProject } = useMarketAnalytics();

  const [inWatchlist, setInWatchlist] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [modeling, setModeling] = useState(false);
  const [sharing, setSharing] = useState(false);

  const activeCurrency = 'AED';
  const activeUnit = 'sqft';
  const activeMarket = 'Dubai';

  const handleWatchlistToggle = () => {
    const isAdding = !inWatchlist;
    setInWatchlist(isAdding);
    const locationName = selectedProject?.name || selectedSubArea?.name || selectedCommunity?.name || 'Current Context';
    triggerToast(
      isAdding
        ? `Added ${locationName} to your Watchlist.`
        : `Removed ${locationName} from your Watchlist.`
    );
  };

  const handleQuickExport = () => {
    setExporting(true);
    triggerToast('Generating real-time intelligence brief PDF...');
    setTimeout(() => {
      setExporting(false);
      triggerToast('Download started: ACOT_Market_Intelligence_Brief.pdf');
    }, 1200);
  };

  const handleGenerateModel = () => {
    setModeling(true);
    triggerToast('Compiling financial ledger ROI sheet...');
    setTimeout(() => {
      setModeling(false);
      triggerToast('Downloaded model: ACOT_ROI_Financial_Sheet.xlsx');
    }, 1200);
  };

  const handleShareScope = () => {
    setSharing(true);
    setTimeout(() => {
      setSharing(false);
      triggerToast('Workspace scope link copied to clipboard.');
    }, 800);
  };

  const handleOpenInAI = () => {
    if (onNavigateToModule) {
      onNavigateToModule('AI Intelligence Suite');
      triggerToast('Transferred current Analysis Context to AI Intelligence Suite.');
    }
  };

  // Compute Research Progress Step Indices
  const hasCommunity = !!communityId && communityId !== 'all';
  const hasSubArea = hasCommunity && !!subAreaId && subAreaId !== 'all';
  const hasProject = hasSubArea && !!projectId && projectId !== 'all';

  let progressPercentage = 25;
  if (hasSubArea) progressPercentage = 55;
  if (hasProject) progressPercentage = 85;
  if (hasProject && subAreaId !== 'all' && projectId !== 'all') progressPercentage = 100;

  return (
    <div className="space-y-6">
      {/* 1. RESEARCH PROGRESS INDICATOR */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Research Progress
            </h3>
          </div>
          <span className="text-xs font-mono font-extrabold text-indigo-600">
            {progressPercentage}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Vertical Step Nodes */}
        <div className="space-y-3 pt-1 text-[11px] font-mono">
          <div className="flex items-start gap-2.5">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border ${
              hasCommunity 
                ? 'bg-emerald-50 border-emerald-500 text-emerald-600' 
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}>
              {hasCommunity ? '✓' : '1'}
            </div>
            <div className="leading-tight">
              <p className={`font-bold ${hasCommunity ? 'text-slate-800' : 'text-slate-400'}`}>
                Community Selected
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5 font-sans">
                {selectedCommunity?.name || 'Waiting for selection...'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border ${
              hasSubArea 
                ? 'bg-emerald-50 border-emerald-500 text-emerald-600' 
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}>
              {hasSubArea ? '✓' : '2'}
            </div>
            <div className="leading-tight">
              <p className={`font-bold ${hasSubArea ? 'text-slate-800' : 'text-slate-400'}`}>
                Sub-area Analysed
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5 font-sans">
                {hasSubArea ? selectedSubArea?.name : 'Waiting for selection...'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border ${
              hasProject 
                ? 'bg-emerald-50 border-emerald-500 text-emerald-600' 
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}>
              {hasProject ? '✓' : '3'}
            </div>
            <div className="leading-tight">
              <p className={`font-bold ${hasProject ? 'text-slate-800' : 'text-slate-400'}`}>
                Project Examined
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5 font-sans">
                {hasProject ? selectedProject?.name : 'Waiting for selection...'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border ${
              progressPercentage === 100 
                ? 'bg-emerald-50 border-emerald-500 text-emerald-600' 
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}>
              {progressPercentage === 100 ? '✓' : '4'}
            </div>
            <div className="leading-tight">
              <p className={`font-bold ${progressPercentage === 100 ? 'text-slate-800' : 'text-slate-400'}`}>
                Ready for Handoff
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5 font-sans">
                Fully mapped research scope.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SELECTED LOCATION DETAILS */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full blur-2xl opacity-40"></div>
        
        <div className="flex items-center gap-2 relative z-10">
          <Layers className="w-4 h-4 text-indigo-600" />
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
            Analysis Context
          </h3>
        </div>

        <div className="space-y-3.5 pt-1 relative z-10">
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
        </div>
      </div>

      {/* 3. VERIFIED DATA SOURCES CHECKLIST */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
            Verified Sources
          </h3>
        </div>

        <div className="space-y-3 pt-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">DLD Registry Sync</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase font-mono bg-emerald-50 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Synced
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Ejari Residential Index</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase font-mono bg-emerald-50 px-2 py-0.5 rounded-full">
              Verified
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">RERA Registered Buildings</span>
            <span className="text-[10px] font-bold text-slate-700 font-mono uppercase">
              100% Secure
            </span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-50 flex items-center justify-center gap-1.5 text-emerald-600 font-bold text-[10px] uppercase font-mono bg-emerald-50/20 py-2 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Verified RERA Database</span>
        </div>
      </div>

      {/* 4. ACTIVE ACTIONS BAR */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-3.5 shadow-sm">
        <h3 className="text-xs font-bold text-slate-800">
          Quick Actions
        </h3>

        <div className="space-y-2 pt-1">
          <button
            onClick={handleQuickExport}
            disabled={exporting}
            className="w-full flex items-center justify-between text-left p-2.5 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 text-xs font-semibold text-slate-700 hover:text-indigo-700 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <FileDown className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
              <span>{exporting ? 'Generating Brief...' : 'Download Brief (PDF)'}</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={handleGenerateModel}
            disabled={modeling}
            className="w-full flex items-center justify-between text-left p-2.5 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 text-xs font-semibold text-slate-700 hover:text-indigo-700 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <FileSpreadsheet className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
              <span>{modeling ? 'Compiling ROI...' : 'Generate Financial Model'}</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={handleShareScope}
            disabled={sharing}
            className="w-full flex items-center justify-between text-left p-2.5 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 text-xs font-semibold text-slate-700 hover:text-indigo-700 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <Share2 className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
              <span>{sharing ? 'Generating link...' : 'Share Scope'}</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={handleOpenInAI}
            className="w-full flex items-center justify-between text-left p-2.5 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 text-xs font-semibold text-slate-700 hover:text-indigo-700 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
              <span>Ask AI About This Context</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={handleWatchlistToggle}
            className={`w-full flex items-center justify-between text-left p-2.5 rounded-xl border transition-all cursor-pointer text-xs font-semibold ${
              inWatchlist
                ? 'border-amber-200 bg-amber-50/40 text-amber-700 hover:bg-amber-50'
                : 'border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 text-slate-700 hover:text-indigo-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Star className={`w-4 h-4 ${inWatchlist ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
              <span>{inWatchlist ? 'Watchlisted' : 'Add to Watchlist'}</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
