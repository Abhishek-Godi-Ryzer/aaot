import { useAnalysisContext } from '../../context/AnalysisContext';
import { useMarketAnalytics } from '../../context/MarketAnalyticsContext';
import {
  FileText,
  Check,
  TrendingUp,
  Briefcase,
  Layers,
  Sparkles,
  AlertTriangle,
  Download,
  Printer,
  ChevronRight,
  Database,
  BarChart2
} from 'lucide-react';

interface ReportsContextPanelProps {
  onNavigateToModule?: (moduleName: string) => void;
  triggerToast?: (message: string) => void;
}

export default function ReportsContextPanel({ onNavigateToModule, triggerToast }: ReportsContextPanelProps) {
  const { communityId } = useAnalysisContext();
  const { communities } = useMarketAnalytics();

  const activeComm = communities.find(c => c.id === communityId) || communities[0] || { name: 'Dubai Marina' };

  const handleExport = (format: string) => {
    if (triggerToast) {
      triggerToast(`Exporting current context to ${format}...`);
    }
  };

  return (
    <div className="space-y-5" id="reports-context-panel">
      
      {/* CARD 1: REPORT SUMMARY */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full blur-2xl opacity-45"></div>
        
        <div className="relative z-10">
          <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
            Report Summary
          </h3>
          
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight block">24</span>
              <span className="text-[10px] font-medium text-slate-400 mt-0.5 block">Reports Generated</span>
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-extrabold text-slate-900">8</span>
                <span className="text-[10px] text-emerald-600 font-bold">↑ 33%</span>
              </div>
              <span className="text-[10px] font-medium text-slate-400 mt-1 block">vs last month</span>
            </div>
          </div>

          {/* Micro chart proxy */}
          <div className="flex items-end justify-between gap-1 h-12 pt-3">
            {[20, 45, 35, 55, 75, 40, 65, 80, 50, 60, 40, 45].map((val, idx) => (
              <div
                key={idx}
                className={`w-full rounded-t-sm ${
                  idx === 7 ? 'bg-indigo-600' : 'bg-indigo-200'
                }`}
                style={{ height: `${val}%` }}
                title={`Period ${idx + 1}: ${val} generated`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CARD 2: INCLUDED DATA SOURCES */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-sm">
        <div>
          <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-indigo-600" />
            Included Data Sources
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Verified registries actively queried:
          </p>
        </div>

        <div className="space-y-2.5">
          {[
            { label: 'Dubai Land Department (DLD)', status: 'Active' },
            { label: 'Ejari Rental Registry', status: 'Active' },
            { label: 'Market Intelligence', status: 'Active' },
            { label: 'Transactions', status: 'Active' },
            { label: 'Rental Research', status: 'Active' },
            { label: 'Investor Tools', status: 'Active' },
            { label: 'AI Analyst', status: 'Active' }
          ].map(source => (
            <div key={source.label} className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">{source.label}</span>
              <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CARD 3: REPORT INCLUDES */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-sm">
        <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
          Report Includes
        </h3>

        <div className="space-y-3">
          {[
            { label: 'Market Analysis', icon: TrendingUp },
            { label: 'Transaction Analysis', icon: Briefcase },
            { label: 'Rental Analysis', icon: Layers },
            { label: 'Investment Analysis', icon: FileText },
            { label: 'AI Recommendation', icon: Sparkles },
            { label: 'Risk Assessment', icon: AlertTriangle },
            { label: 'Supporting Evidence', icon: Database }
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-3 text-xs text-slate-600">
                <div className="w-7 h-7 rounded-lg bg-indigo-50/50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* CARD 4: EXPORT FORMATS */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-sm">
        <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
          Export Formats
        </h3>

        <div className="grid grid-cols-3 gap-2.5">
          <button
            onClick={() => handleExport('PDF')}
            className="flex flex-col items-center justify-center py-3 px-1.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 transition-all text-center group"
          >
            <FileText className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold text-slate-700 mt-1.5 block">PDF</span>
          </button>

          <button
            onClick={() => handleExport('DOCX')}
            className="flex flex-col items-center justify-center py-3 px-1.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 transition-all text-center group"
          >
            <FileText className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold text-slate-700 mt-1.5 block">DOCX</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex flex-col items-center justify-center py-3 px-1.5 rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 transition-all text-center group"
          >
            <Printer className="w-4 h-4 text-slate-600 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold text-slate-700 mt-1.5 block">Print</span>
          </button>
        </div>
      </div>

    </div>
  );
}
