import { useAnalysisContext } from '../../context/AnalysisContext';
import { useMarketAnalytics } from '../../context/MarketAnalyticsContext';
import {
  ArrowLeft,
  Settings,
  Layers,
  Database,
  ShieldCheck,
  Cpu,
  Info
} from 'lucide-react';

interface ModulePlaceholderProps {
  moduleName: string;
  moduleIcon?: any;
  onBackToAnalytics: () => void;
}

export default function ModulePlaceholder({
  moduleName,
  moduleIcon: Icon = Cpu,
  onBackToAnalytics
}: ModulePlaceholderProps) {
  const { communityId, subAreaId, projectId } = useAnalysisContext();
  const { selectedCommunity, selectedSubArea, selectedProject } = useMarketAnalytics();

  // Prepare Received Parameters representation payload
  const receivedParameters = {
    payloadVersion: '2.1.0-alpha',
    handshakeToken: 'ACOT_SECURE_JWT_SAMPLE_7782',
    timestamp: new Date().toISOString(),
    sourceModule: 'Market Analytics & Cycles',
    destinationModule: moduleName,
    analysisContext: {
      communityId,
      subAreaId,
      projectId,
      resolvedNames: {
        communityName: selectedCommunity?.name || 'All Dubai (Macro)',
        subAreaName: subAreaId === 'all' ? 'All Sub-Areas' : selectedSubArea?.name || subAreaId,
        projectName: projectId === 'all' ? 'All Projects' : selectedProject?.name || projectId
      }
    },
    platformDefaults: {
      currency: 'AED',
      unit: 'sqft',
      market: 'Dubai'
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Back button link */}
      <div>
        <button
          onClick={onBackToAnalytics}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Market Analytics & Cycles</span>
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 shadow-xs shadow-indigo-600/5">
              <Icon className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                {moduleName} Module
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Active Context Gateway • Milestone Handoff Sync Approved
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 font-mono">
            Gateway Active
          </span>
        </div>

        {/* Informational Box */}
        <div className="p-4 bg-indigo-50/20 rounded-2xl border border-indigo-100/20 text-xs text-slate-600 leading-relaxed flex items-start gap-3">
          <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-slate-800">Operational Milestone Phase 2 Context Handoff</p>
            <p>
              This screen is a live architectural gateway validating routing pipeline registers. The current global Analysis Context state has been verified and successfully synchronized to the <strong>{moduleName}</strong> registry parameters.
            </p>
          </div>
        </div>

        {/* Context Information & Payload */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          {/* Context Details */}
          <div className="lg:col-span-5 bg-slate-50/50 rounded-2xl border border-slate-100 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                Received Analysis Context
              </h4>
            </div>

            <div className="space-y-3 font-mono text-xs pt-1">
              <div className="py-2 border-b border-slate-100 flex justify-between items-center">
                <span className="text-slate-400 text-[10px] uppercase">COMMUNITY</span>
                <span className="font-bold text-slate-800">
                  {selectedCommunity?.name || 'All Dubai (Macro)'}
                </span>
              </div>

              <div className="py-2 border-b border-slate-100 flex justify-between items-center">
                <span className="text-slate-400 text-[10px] uppercase">SUB-AREA</span>
                <span className="font-bold text-slate-800">
                  {subAreaId === 'all' ? 'All Sub-Areas' : selectedSubArea?.name || subAreaId}
                </span>
              </div>

              <div className="py-2 flex justify-between items-center">
                <span className="text-slate-400 text-[10px] uppercase">PROJECT</span>
                <span className="font-bold text-slate-800">
                  {projectId === 'all' ? 'All Projects' : selectedProject?.name || projectId}
                </span>
              </div>
            </div>
          </div>

          {/* JSON Received Parameters Payload */}
          <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-850 p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2 text-indigo-400">
                <Database className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider font-mono">
                  JSON Parameters Package
                </h4>
              </div>
              <span className="text-[9px] font-mono text-slate-500">
                APPLICATION_JSON
              </span>
            </div>

            <pre className="text-[10px] font-mono text-indigo-200 overflow-x-auto leading-relaxed max-h-48 p-2 rounded bg-slate-950/40">
              {JSON.stringify(receivedParameters, null, 2)}
            </pre>
          </div>
        </div>

        {/* Action button CTA */}
        <div className="pt-4 flex flex-wrap gap-3 border-t border-slate-100">
          <button
            onClick={onBackToAnalytics}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
          >
            Return to Market Analytics
          </button>
        </div>
      </div>

      {/* Trust Badge footer */}
      <div className="bg-emerald-50/20 border border-emerald-100/30 rounded-3xl p-6 flex items-start gap-4 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm shadow-emerald-600/5">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-sm font-bold text-emerald-950">Gateway Sync Secured</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            All parameters undergo encrypted transit checks, ensuring 100% data integrity and consistency across your research workspace.
          </p>
        </div>
      </div>
    </div>
  );
}
