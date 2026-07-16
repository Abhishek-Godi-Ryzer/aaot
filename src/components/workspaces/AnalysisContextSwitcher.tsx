import { useState, useEffect, ChangeEvent } from 'react';
import { useAnalysisContext } from '../../context/AnalysisContext';
import { useMarketAnalytics } from '../../context/MarketAnalyticsContext';
import {
  MarketAnalyticsService,
  Community,
  SubArea,
  Project
} from '../../services/marketAnalyticsService';
import { ChevronDown, MapPin, Layers, Sparkles, Check, RefreshCw } from 'lucide-react';

interface AnalysisContextSwitcherProps {
  onApplyChanges?: () => void;
  triggerToast?: (msg: string) => void;
  moduleName?: string;
}

export default function AnalysisContextSwitcher({
  onApplyChanges,
  triggerToast,
  moduleName = 'Rental Intelligence'
}: AnalysisContextSwitcherProps) {
  const {
    communityId,
    subAreaId,
    projectId,
    setCommunityId,
    setSubAreaId,
    setProjectId
  } = useAnalysisContext();

  const { communities } = useMarketAnalytics();

  // Local state for the dropdowns (before clicking Apply)
  const [localCommunityId, setLocalCommunityId] = useState(communityId || '');
  const [localSubAreaId, setLocalSubAreaId] = useState(subAreaId || 'all');
  const [localProjectId, setLocalProjectId] = useState(projectId || 'all');

  // Available options based on selection
  const [availableSubAreas, setAvailableSubAreas] = useState<SubArea[]>([]);
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  // Sync local state when global context changes externally
  useEffect(() => {
    setLocalCommunityId(communityId || '');
    setLocalSubAreaId(subAreaId || 'all');
    setLocalProjectId(projectId || 'all');
  }, [communityId, subAreaId, projectId]);

  // Load subareas and projects when community changes
  useEffect(() => {
    if (!localCommunityId) {
      setAvailableSubAreas([]);
      setAvailableProjects([]);
      return;
    }

    let active = true;
    setIsLoadingOptions(true);

    Promise.all([
      MarketAnalyticsService.getSubAreas(localCommunityId),
      MarketAnalyticsService.getProjects(localCommunityId, 'all')
    ]).then(([subs, projs]) => {
      if (!active) return;
      setAvailableSubAreas(subs);
      
      // If the currently selected subarea is valid for this community, load matching projects
      if (localSubAreaId !== 'all') {
        const filteredProjs = projs.filter(p => p.subAreaId === localSubAreaId);
        setAvailableProjects(filteredProjs);
      } else {
        setAvailableProjects(projs);
      }
      setIsLoadingOptions(false);
    });

    return () => {
      active = false;
    };
  }, [localCommunityId]);

  // Handle local subarea change
  const handleCommunityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setLocalCommunityId(val);
    setLocalSubAreaId('all');
    setLocalProjectId('all');
  };

  const handleSubAreaChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setLocalSubAreaId(val);
    setLocalProjectId('all');

    // Filter projects locally for speed
    if (val === 'all') {
      MarketAnalyticsService.getProjects(localCommunityId, 'all').then(projs => {
        setAvailableProjects(projs);
      });
    } else {
      MarketAnalyticsService.getProjects(localCommunityId, 'all').then(projs => {
        setAvailableProjects(projs.filter(p => p.subAreaId === val));
      });
    }
  };

  const handleProjectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setLocalProjectId(e.target.value);
  };

  const handleApply = () => {
    setIsApplying(true);
    
    // Smooth loader delay to simulate high-fidelity enterprise service query
    const selectedCommName = communities.find(c => c.id === localCommunityId)?.name || 'Dubai Marina';
    if (triggerToast) {
      triggerToast(`Refining analysis context to ${selectedCommName}...`);
    }

    setTimeout(() => {
      // Commit to global context
      setCommunityId(localCommunityId);
      setSubAreaId(localSubAreaId);
      setProjectId(localProjectId);
      
      setIsApplying(false);
      
      if (triggerToast) {
        triggerToast(`✓ Analysis Context Updated: ${selectedCommName}`);
      }

      if (onApplyChanges) {
        onApplyChanges();
      }

      // Dispatch global event for other components
      window.dispatchEvent(new CustomEvent('acot-context-updated', {
        detail: { communityId: localCommunityId, subAreaId: localSubAreaId, projectId: localProjectId }
      }));
    }, 1000);
  };

  const isChanged = localCommunityId !== communityId || localSubAreaId !== subAreaId || localProjectId !== projectId;

  return (
    <div className="bg-slate-50/70 border border-slate-100 rounded-2xl md:rounded-[1.75rem] p-4 md:p-5 relative overflow-hidden transition-all duration-300">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/30 rounded-full blur-2xl pointer-events-none"></div>
      
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
        
        {/* Left Indicator Info */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/10">
            <Layers className="w-4.5 h-4.5" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5">
              <span>Global Analysis Context</span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
            </h4>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Updating syncs {moduleName}
            </p>
          </div>
        </div>

        {/* Dropdowns Group */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full lg:w-auto flex-1 max-w-4xl lg:mx-6">
          
          {/* COMMUNITY DROPDOWN */}
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <MapPin className="w-3.5 h-3.5" />
            </span>
            <select
              value={localCommunityId}
              onChange={handleCommunityChange}
              className="w-full bg-white border border-slate-200 hover:border-slate-300 pl-9 pr-8 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-950 shadow-sm appearance-none focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer transition-colors"
            >
              <option value="" disabled>Select Community</option>
              {communities.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <ChevronDown className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* SUB-AREA DROPDOWN */}
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Layers className="w-3.5 h-3.5" />
            </span>
            <select
              value={localSubAreaId}
              onChange={handleSubAreaChange}
              disabled={!localCommunityId || isLoadingOptions}
              className="w-full bg-white border border-slate-200 hover:border-slate-300 pl-9 pr-8 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-950 shadow-sm appearance-none focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              <option value="all">All Sub-Areas</option>
              {availableSubAreas.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <ChevronDown className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* PROJECT DROPDOWN */}
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <select
              value={localProjectId}
              onChange={handleProjectChange}
              disabled={!localCommunityId || isLoadingOptions}
              className="w-full bg-white border border-slate-200 hover:border-slate-300 pl-9 pr-8 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-950 shadow-sm appearance-none focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              <option value="all">All Projects</option>
              {availableProjects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <ChevronDown className="w-3.5 h-3.5" />
            </span>
          </div>

        </div>

        {/* APPLY BUTTON */}
        <button
          onClick={handleApply}
          disabled={isApplying || !localCommunityId}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer shrink-0 w-full lg:w-auto justify-center ${
            isChanged
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/15'
              : 'bg-slate-200 text-slate-500 border border-slate-300'
          }`}
        >
          {isApplying ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Applying...</span>
            </>
          ) : (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Apply Changes</span>
            </>
          )}
        </button>

      </div>
    </div>
  );
}
