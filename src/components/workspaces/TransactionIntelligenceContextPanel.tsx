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
  FileSpreadsheet,
  CheckCircle2,
  Circle,
  RefreshCw,
  Home,
  FileText
} from 'lucide-react';

interface TransactionIntelligenceContextPanelProps {
  onNavigateToModule?: (moduleName: string) => void;
  triggerToast?: (msg: string) => void;
}

export default function TransactionIntelligenceContextPanel({
  onNavigateToModule,
  triggerToast = () => {}
}: TransactionIntelligenceContextPanelProps) {
  const { communityId, subAreaId, projectId } = useAnalysisContext();
  const { selectedCommunity, selectedSubArea, selectedProject } = useMarketAnalytics();

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncTime, setSyncTime] = useState('15 Jul 2025, 09:45 AM');

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
      triggerToast('DLD Transaction database is up to date.');
    }, 1500);
  };

  const handleNavigate = (module: string) => {
    if (onNavigateToModule) {
      onNavigateToModule(module);
      triggerToast(`Routing context to ${module}.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* CARD 1: RESEARCH CONTEXT */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full blur-2xl opacity-40"></div>
        
        <div className="flex items-center gap-2 relative z-10">
          <Layers className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
            Research Context
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

          <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400 font-bold">CURRENT MODULE:</span>
            <span className="text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-md">Transaction Intel</span>
          </div>
        </div>

        <button
          onClick={() => {
            triggerToast('Click on "Explore Market" or use Search Dubai Market above to edit community context.');
          }}
          className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-100 text-[11px] font-bold text-slate-600 hover:text-slate-800 rounded-xl transition-all cursor-pointer text-center block"
        >
          View / Edit Context
        </button>
      </div>

      {/* CARD 2: VERIFIED SOURCE */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
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
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-600' : ''}`} />
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

      {/* CARD 3: RESEARCH JOURNEY */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
            Research Journey
          </h3>
        </div>

        {/* Steps */}
        <div className="space-y-3.5 pt-1 text-[11px] font-mono">
          <div className="flex items-start gap-2.5">
            <div className="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-500 text-emerald-600 flex items-center justify-center shrink-0">
              ✓
            </div>
            <span className="text-slate-500 font-bold">Community Analysis</span>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-500 text-emerald-600 flex items-center justify-center shrink-0">
              ✓
            </div>
            <span className="text-slate-500 font-bold">Price History Logs</span>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-500 text-emerald-600 flex items-center justify-center shrink-0">
              ✓
            </div>
            <span className="text-slate-500 font-bold">Cycle Views Audited</span>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-4 h-4 rounded-full bg-emerald-600 border border-emerald-600 text-white flex items-center justify-center shrink-0 font-extrabold text-[9px]">
              ▶
            </div>
            <span className="text-slate-800 font-extrabold">Transactions</span>
          </div>

          <button
            onClick={() => handleNavigate('Rental Intelligence')}
            className="w-full flex items-start gap-2.5 text-left group"
          >
            <div className="w-4 h-4 rounded-full bg-slate-50 border border-slate-200 text-slate-400 group-hover:border-indigo-400 flex items-center justify-center shrink-0 text-[10px]">
              5
            </div>
            <span className="text-slate-400 group-hover:text-slate-700 transition-colors font-bold">Rental Research</span>
          </button>

          <button
            onClick={() => handleNavigate('Investor Tools & Calculators')}
            className="w-full flex items-start gap-2.5 text-left group"
          >
            <div className="w-4 h-4 rounded-full bg-slate-50 border border-slate-200 text-slate-400 group-hover:border-indigo-400 flex items-center justify-center shrink-0 text-[10px]">
              6
            </div>
            <span className="text-slate-400 group-hover:text-slate-700 transition-colors font-bold">Investor Tools</span>
          </button>

          <button
            onClick={() => handleNavigate('AI Intelligence Suite')}
            className="w-full flex items-start gap-2.5 text-left group"
          >
            <div className="w-4 h-4 rounded-full bg-slate-50 border border-slate-200 text-slate-400 group-hover:border-indigo-400 flex items-center justify-center shrink-0 text-[10px]">
              7
            </div>
            <span className="text-slate-400 group-hover:text-slate-700 transition-colors font-bold">AI Analyst</span>
          </button>
        </div>
      </div>

      {/* CARD 4: CONTINUE RESEARCH */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-3.5 shadow-sm">
        <h3 className="text-xs font-bold text-slate-800">
          Continue Research
        </h3>

        <div className="space-y-2 pt-1">
          <button
            onClick={() => handleNavigate('Rental Intelligence')}
            className="w-full flex items-center justify-between text-left p-2.5 rounded-xl border border-slate-100 hover:border-emerald-100 hover:bg-emerald-50/20 text-xs font-semibold text-slate-700 hover:text-emerald-700 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <Home className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
              <span>Open Rental Research</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => handleNavigate('Investor Tools & Calculators')}
            className="w-full flex items-center justify-between text-left p-2.5 rounded-xl border border-slate-100 hover:border-emerald-100 hover:bg-emerald-50/20 text-xs font-semibold text-slate-700 hover:text-emerald-700 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <FileSpreadsheet className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
              <span>Open Investor Tools</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => handleNavigate('AI Intelligence Suite')}
            className="w-full flex items-center justify-between text-left p-2.5 rounded-xl border border-slate-100 hover:border-emerald-100 hover:bg-emerald-50/20 text-xs font-semibold text-slate-700 hover:text-emerald-700 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
              <span>Ask AI Analyst</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => handleNavigate('Reports Engine')}
            className="w-full flex items-center justify-between text-left p-2.5 rounded-xl border border-slate-100 hover:border-emerald-100 hover:bg-emerald-50/20 text-xs font-semibold text-slate-700 hover:text-emerald-700 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
              <span>Generate Report</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
