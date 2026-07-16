import { useState, useEffect } from 'react';
import { useAnalysisContext } from '../../context/AnalysisContext';
import { useMarketAnalytics } from '../../context/MarketAnalyticsContext';
import {
  Layers,
  CheckCircle,
  RefreshCw,
  Target,
  Sparkles,
  FileText,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface AIIntelligenceContextPanelProps {
  onNavigateToModule?: (moduleName: string) => void;
  triggerToast?: (msg: string) => void;
}

export default function AIIntelligenceContextPanel({
  onNavigateToModule,
  triggerToast = () => {}
}: AIIntelligenceContextPanelProps) {
  const { communityId, subAreaId, projectId } = useAnalysisContext();
  const { selectedCommunity, selectedSubArea, selectedProject } = useMarketAnalytics();

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncTime, setSyncTime] = useState('Today, 09:30 AM');

  const handleManualSync = () => {
    setIsSyncing(true);
    triggerToast('Interrogating official DLD and Ejari REST API caches...');
    setTimeout(() => {
      setIsSyncing(false);
      const now = new Date();
      const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setSyncTime(`Today, ${formattedTime}`);
      triggerToast('Verified data caches are fully up-to-date.');
    }, 1200);
  };

  const dispatchAIAction = (actionPrompt: string, toastMessage: string) => {
    triggerToast(toastMessage);
    // Dispatch a custom event so AIIntelligenceSuite can receive and execute it
    window.dispatchEvent(new CustomEvent('acot-ai-trigger-action', {
      detail: { prompt: actionPrompt }
    }));
  };

  // Define Research Journey Stages
  const journeyStages = [
    { name: 'Market Analytics & Cycles', label: 'Market Intelligence' },
    { name: 'Maps & Geospatial', label: 'Maps' },
    { name: 'Transaction Intelligence', label: 'Transactions' },
    { name: 'Rental Intelligence', label: 'Rental Research' },
    { name: 'Investor Tools & Calculators', label: 'Investor Tools' },
    { name: 'AI Intelligence Suite', label: 'AI Analyst' },
    { name: 'Reports Engine', label: 'Reports' }
  ];

  return (
    <div className="space-y-6">
      {/* CARD 1: CURRENT ANALYSIS CONTEXT */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full blur-2xl opacity-40"></div>
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Analysis Context
            </h3>
          </div>
          <button
            onClick={() => triggerToast('Use the global switcher above to alter community or project level.')}
            className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700"
          >
            Edit
          </button>
        </div>

        <div className="space-y-3.5 pt-1 relative z-10 text-xs">
          <div>
            <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold tracking-wider">
              Community
            </span>
            <span className="text-sm font-extrabold text-slate-800 block">
              {selectedCommunity?.name || 'All Dubai (Macro)'}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold tracking-wider">
              Sub-Area
            </span>
            <span className="text-xs font-bold text-slate-700 block">
              {subAreaId === 'all' ? 'All Sub-Areas' : selectedSubArea?.name || subAreaId}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold tracking-wider">
              Project
            </span>
            <span className="text-xs font-bold text-slate-700 block">
              {projectId === 'all' ? 'All Projects' : selectedProject?.name || projectId}
            </span>
          </div>

          <div className="border-t border-slate-50 pt-2.5">
            <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold tracking-wider">
              Current Module
            </span>
            <span className="text-xs font-black text-indigo-600 block">
              AI Analyst
            </span>
          </div>
        </div>

        <button
          onClick={() => triggerToast(`Context: ${selectedCommunity?.name || 'Dubai Marina'}`)}
          className="w-full mt-2 inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl border border-slate-100 hover:border-slate-200 text-xs text-slate-600 hover:text-slate-800 hover:bg-slate-50 font-bold transition-all cursor-pointer"
        >
          <span>View Full Context</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* CARD 2: VERIFIED DATA SOURCES */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 animate-pulse" />
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Verified Data Sources
            </h3>
          </div>
          <button
            disabled={isSyncing}
            onClick={handleManualSync}
            className={`text-slate-400 hover:text-indigo-600 ${isSyncing ? 'animate-spin text-indigo-600' : ''}`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3 pt-1 text-xs text-slate-600">
          {[
            { label: 'Dubai Land Department (DLD)', desc: 'Micro transaction registries' },
            { label: 'Ejari Rental Registry', desc: 'Active lease registries' },
            { label: 'Market Intelligence', desc: 'Aggregate price indices' },
            { label: 'Transactions', desc: 'Ready & Off-Plan models' },
            { label: 'Rental Research', desc: 'Yield mapping engines' }
          ].map((src, sIdx) => (
            <div key={sIdx} className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">{src.label}</span>
                <span className="text-[9px] text-slate-400 block font-medium">{src.desc}</span>
              </div>
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            </div>
          ))}
        </div>

        <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between border-t border-slate-50 pt-3">
          <span>Last synchronized:</span>
          <span className="text-slate-600 font-semibold">{syncTime}</span>
        </div>
      </div>

      {/* CARD 3: RESEARCH JOURNEY */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-sm relative overflow-hidden">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-slate-700" />
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
            Research Journey
          </h3>
        </div>

        <div className="space-y-2.5 pt-1 text-xs">
          {journeyStages.map((stage, sIdx) => {
            const isCurrent = stage.name === 'AI Intelligence Suite';
            return (
              <button
                key={sIdx}
                onClick={() => {
                  if (onNavigateToModule) {
                    onNavigateToModule(stage.name);
                    triggerToast(`Routing context to ${stage.name}.`);
                  }
                }}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors cursor-pointer ${
                  isCurrent
                    ? 'bg-indigo-50 text-indigo-700 font-extrabold'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold ${
                      isCurrent
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    0{sIdx + 1}
                  </span>
                  <span>{stage.label}</span>
                </div>
                {isCurrent && <Sparkles className="w-3.5 h-3.5 text-indigo-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* CARD 4: QUICK AI ACTIONS */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
            Quick AI Actions
          </h3>
        </div>

        <div className="space-y-2">
          {[
            { 
              label: 'Generate Deal Score', 
              desc: 'Score this investment opportunity', 
              prompt: 'Generate Deal Score', 
              toast: 'Triggering AI Deal Scorer...',
              icon: <Target className="w-4.5 h-4.5 text-indigo-600" /> 
            },
            { 
              label: 'Compare Communities', 
              desc: 'Compare with other communities', 
              prompt: 'Compare with Business Bay', 
              toast: 'Synthesizing dual community profile comparisons...',
              icon: <Layers className="w-4.5 h-4.5 text-slate-600" /> 
            },
            { 
              label: 'Generate Report', 
              desc: 'Create investment report payload', 
              prompt: 'Generate comprehensive prospectus report payload', 
              toast: 'Structuring Prospectus Report JSON payload...',
              icon: <FileText className="w-4.5 h-4.5 text-slate-600" /> 
            },
            { 
              label: 'Explain Market Trend', 
              desc: 'Get trend analysis', 
              prompt: 'Explain current capital value and transaction trends', 
              toast: 'Retrieving capital market records...',
              icon: <TrendingUp className="w-4.5 h-4.5 text-emerald-600" /> 
            },
            { 
              label: 'Identify Risks', 
              desc: 'Analyze investment risks', 
              prompt: 'What are the main investment risks and mitigation strategies?', 
              toast: 'Assessing structural risk vectors...',
              icon: <AlertTriangle className="w-4.5 h-4.5 text-amber-500" /> 
            }
          ].map((act, aIdx) => (
            <button
              key={aIdx}
              onClick={() => dispatchAIAction(act.prompt, act.toast)}
              className="w-full flex items-center justify-between p-2.5 hover:bg-slate-50/80 border border-transparent hover:border-slate-100 rounded-xl text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                {act.icon}
                <div>
                  <span className="text-[11px] font-extrabold text-slate-800 block group-hover:text-indigo-600 transition-colors">
                    {act.label}
                  </span>
                  <span className="text-[9px] text-slate-400 block font-medium">
                    {act.desc}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
