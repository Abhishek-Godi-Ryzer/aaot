import { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileText,
  Bookmark,
  Building2,
  FolderOpen,
  Info
} from 'lucide-react';
import { WorkspaceService, WatchlistItem } from '../../services/workspaceService';

interface WatchlistsContextPanelProps {
  onNavigateToModule?: (moduleName: string) => void;
  triggerToast?: (message: string) => void;
}

export default function WatchlistsContextPanel({ onNavigateToModule, triggerToast }: WatchlistsContextPanelProps) {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  const loadItems = () => {
    setItems(WorkspaceService.getWatchlists());
  };

  useEffect(() => {
    loadItems();
    window.addEventListener('acot_watchlist_updated', loadItems);
    return () => {
      window.removeEventListener('acot_watchlist_updated', loadItems);
    };
  }, []);

  const communitiesCount = items.filter(i => i.type === 'Community').length;
  const projectsCount = items.filter(i => i.type === 'Project').length;
  const totalCount = items.length;

  const communityPercentage = totalCount > 0 ? Math.round((communitiesCount / totalCount) * 100) : 0;
  const projectPercentage = totalCount > 0 ? Math.round((projectsCount / totalCount) * 100) : 0;

  // SVG Donut Chart Calculation
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const communityOffset = circumference - (communityPercentage / 100) * circumference;

  const handleGenerateReport = () => {
    if (triggerToast) {
      triggerToast('Generating Watchlist summary dossier...');
    }
    if (onNavigateToModule) {
      setTimeout(() => onNavigateToModule('Reports Engine'), 800);
    }
  };

  const handleAskAI = () => {
    if (triggerToast) {
      triggerToast('Analyzing watchlists context for AI advisory...');
    }
    if (onNavigateToModule) {
      setTimeout(() => onNavigateToModule('AI Intelligence Suite'), 800);
    }
  };

  const tips = [
    'Save communities and projects you\'re researching to easily track price trends, rental yields, and market performance over time.',
    'Use the Compare tool to review average price per sqft side-by-side between communities and secondary project listings.',
    'Click the AI Advisor shortcut to instantly run smart evaluations on your entire active watchlist collection.'
  ];

  return (
    <div className="space-y-5" id="watchlists-context-panel">
      {/* CARD 1: WATCHLIST SUMMARY & DONUT CHART */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full blur-2xl opacity-45"></div>
        
        <div className="relative z-10 space-y-4">
          <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5 text-indigo-600" />
            Watchlist Summary
          </h3>
          
          <div className="grid grid-cols-3 gap-2 py-1">
            <div className="text-center p-2 rounded-2xl bg-slate-50 border border-slate-100/50">
              <span className="text-2xl font-black text-slate-900 block">{totalCount}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5 block">Total</span>
            </div>
            <div className="text-center p-2 rounded-2xl bg-indigo-50/30 border border-indigo-100/20">
              <span className="text-2xl font-black text-indigo-600 block">{communitiesCount}</span>
              <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-wider mt-0.5 block">Comm.</span>
            </div>
            <div className="text-center p-2 rounded-2xl bg-teal-50/30 border border-teal-100/20">
              <span className="text-2xl font-black text-teal-600 block">{projectsCount}</span>
              <span className="text-[9px] font-bold text-teal-400 uppercase tracking-wider mt-0.5 block">Projects</span>
            </div>
          </div>

          {/* Portfolio of Interests Donut Chart */}
          <div className="border-t border-slate-50 pt-4">
            <h4 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-3">
              Portfolio of Interests
            </h4>

            {totalCount > 0 ? (
              <div className="flex items-center justify-between gap-4">
                {/* SVG Donut */}
                <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Circle Background */}
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      className="stroke-slate-100"
                      strokeWidth="11"
                      fill="transparent"
                    />
                    {/* Projects segment (green) */}
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      className="stroke-teal-500"
                      strokeWidth="11"
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={0}
                    />
                    {/* Communities segment (purple) overlay */}
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      className="stroke-indigo-600"
                      strokeWidth="11"
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={communityOffset}
                    />
                  </svg>
                  {/* Central Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-base font-black text-slate-900 tracking-tighter leading-none">{totalCount}</span>
                    <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider mt-0.5">Total</span>
                  </div>
                </div>

                {/* Legend list */}
                <div className="space-y-2.5 flex-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0" />
                      <span className="text-slate-600 font-medium">Communities</span>
                    </div>
                    <span className="font-extrabold text-slate-900">{communitiesCount} <span className="text-[10px] font-bold text-slate-400">({communityPercentage}%)</span></span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-500 shrink-0" />
                      <span className="text-slate-600 font-medium">Projects</span>
                    </div>
                    <span className="font-extrabold text-slate-900">{projectsCount} <span className="text-[10px] font-bold text-slate-400">({projectPercentage}%)</span></span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-2">Add items to watchlists to see breakdown chart.</p>
            )}
          </div>
        </div>
      </div>

      {/* CARD 2: QUICK ACTIONS */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-sm">
        <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
          Quick Actions
        </h3>

        <div className="space-y-2.5">
          {/* Action 1: Compare */}
          <button
            onClick={() => setShowCompareModal(true)}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-white transition-colors">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-800">Compare Watchlist Items</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Compare up to 4 items side-by-side</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* Action 2: Report */}
          <button
            onClick={handleGenerateReport}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-white transition-colors">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-800">Generate Watchlist Report</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Get a compiled report of saved items</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* Action 3: Ask AI */}
          <button
            onClick={handleAskAI}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-white transition-colors">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-800">Ask AI About Watchlist</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Get automatic AI analytics insights</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>
      </div>

      {/* CARD 3: DYNAMIC TIPS WITH DOT NAVIGATION */}
      <div className="bg-slate-50 rounded-3xl border border-slate-100 p-5 space-y-3 shadow-xs">
        <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-950 uppercase tracking-wider">
          <Info className="w-4 h-4 text-indigo-600" />
          <span>Tips</span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed min-h-[4.5rem]">
          {tips[tipIndex]}
        </p>
        <div className="flex items-center justify-center gap-1.5 pt-1">
          {tips.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setTipIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                tipIndex === idx ? 'bg-indigo-600 w-4' : 'bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* WATCHLIST COMPARISON POPUP MODAL */}
      {showCompareModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 w-full max-w-4xl p-6 md:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900">Compare Watchlist Items</h3>
                <p className="text-xs text-slate-400">Head-to-head metrics comparison of bookmarked areas</p>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {items.length < 2 ? (
              <p className="text-sm text-slate-400 py-6 text-center">Please bookmark at least two items to compare.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="py-3 px-4 font-extrabold text-slate-500 uppercase tracking-wider w-1/4">Metric</th>
                      {items.slice(0, 4).map(item => (
                        <th key={item.id} className="py-3 px-4 font-extrabold text-indigo-950 w-1/4">
                          <div className="space-y-1">
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-wider text-white ${
                              item.type === 'Community' ? 'bg-indigo-600' : 'bg-teal-600'
                            }`}>
                              {item.type}
                            </span>
                            <div className="font-extrabold text-slate-900 mt-1">{item.name}</div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    <tr>
                      <td className="py-4 px-4 font-bold text-slate-500">Avg Price / sqft</td>
                      {items.slice(0, 4).map(item => (
                        <td key={item.id} className="py-4 px-4 font-extrabold text-slate-900">
                          AED {item.avgPrice.toLocaleString()}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-bold text-slate-500">Gross Yield</td>
                      {items.slice(0, 4).map(item => (
                        <td key={item.id} className="py-4 px-4 font-extrabold text-emerald-600">
                          {item.yield}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-bold text-slate-500">3Y Growth</td>
                      {items.slice(0, 4).map(item => (
                        <td key={item.id} className="py-4 px-4 font-extrabold text-indigo-600">
                          {item.growth}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-bold text-slate-500">Location</td>
                      {items.slice(0, 4).map(item => (
                        <td key={item.id} className="py-4 px-4 text-slate-600">
                          {item.location}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-4 px-4 font-bold text-slate-500">Last Sync</td>
                      {items.slice(0, 4).map(item => (
                        <td key={item.id} className="py-4 px-4 text-slate-400 text-[10px]">
                          {item.lastUpdated}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowCompareModal(false)}
                className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all active:scale-98 cursor-pointer"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
