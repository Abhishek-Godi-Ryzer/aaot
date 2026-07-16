import { useState, useEffect } from 'react';
import {
  Search,
  Grid,
  List,
  ChevronDown,
  Star,
  ArrowUpRight,
  TrendingUp,
  BarChart2,
  FileText,
  MoreVertical,
  MapPin,
  Trash2,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { WorkspaceService, WatchlistItem } from '../../services/workspaceService';

interface WatchlistsViewProps {
  onNavigateToModule?: (moduleName: string) => void;
  triggerToast?: (message: string) => void;
}

export default function WatchlistsView({ onNavigateToModule, triggerToast }: WatchlistsViewProps) {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [activeTab, setActiveTab] = useState<'All' | 'Communities' | 'Projects'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'recently' | 'price' | 'yield' | 'growth'>('recently');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

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

  const handleRemove = (id: string, name: string) => {
    WorkspaceService.removeItem(id);
    if (triggerToast) {
      triggerToast(`Removed "${name}" from watchlists.`);
    }
  };

  const handleOpenAnalysis = (item: WatchlistItem) => {
    if (triggerToast) {
      triggerToast(`Navigating to original analysis for "${item.name}"...`);
    }
    // Set Analysis Context
    localStorage.setItem('acot_market_analytics_community', item.id);
    window.dispatchEvent(new Event('storage'));

    if (onNavigateToModule) {
      if (item.type === 'Community') {
        onNavigateToModule('Market Analytics & Cycles');
      } else {
        onNavigateToModule('Transaction Intelligence');
      }
    }
  };

  const handleAskAI = (name: string) => {
    if (triggerToast) {
      triggerToast(`Opening AI Suite for "${name}" context...`);
    }
    if (onNavigateToModule) {
      onNavigateToModule('AI Intelligence Suite');
    }
  };

  const handleGenerateReport = (name: string) => {
    if (triggerToast) {
      triggerToast(`Compiling executive report for "${name}"...`);
    }
    if (onNavigateToModule) {
      onNavigateToModule('Reports Engine');
    }
  };

  // Filters & Sorting logic
  const filteredItems = items
    .filter(item => {
      if (activeTab === 'Communities' && item.type !== 'Community') return false;
      if (activeTab === 'Projects' && item.type !== 'Project') return false;
      
      const query = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'price') return b.avgPrice - a.avgPrice;
      if (sortBy === 'yield') return parseFloat(b.yield) - parseFloat(a.yield);
      if (sortBy === 'growth') return parseFloat(b.growth) - parseFloat(a.growth);
      // default: recently added (by savedDate desc or order saved)
      return b.savedDate.localeCompare(a.savedDate);
    });

  const getSortLabel = () => {
    switch (sortBy) {
      case 'price': return 'Highest Price';
      case 'yield': return 'Highest Yield';
      case 'growth': return 'Highest Growth';
      default: return 'Recently Added';
    }
  };

  return (
    <div className="space-y-6" id="watchlists-view">
      {/* Tab bar + search + controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-1">
        {/* Left Side: Filter Tabs */}
        <div className="flex gap-1">
          {(['All', 'Communities', 'Projects'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
                activeTab === tab
                  ? 'text-indigo-600 bg-indigo-50/50'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab === 'All' ? 'All Watchlists' : tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-indigo-600 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search watchlists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200/80 rounded-xl text-xs bg-white text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 shadow-xs"
            />
          </div>

          {/* Grid/List Toggles */}
          <div className="flex bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/40 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'list' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sort By Dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="inline-flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 shadow-xs transition-colors"
            >
              <span className="text-slate-400 font-normal">Sort by:</span>
              <span>{getSortLabel()}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {showSortDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowSortDropdown(false)} />
                <div className="absolute right-0 mt-1.5 w-44 rounded-2xl bg-white border border-slate-100 shadow-lg p-1 z-20 space-y-0.5">
                  {[
                    { val: 'recently', label: 'Recently Added' },
                    { val: 'price', label: 'Highest Price' },
                    { val: 'yield', label: 'Highest Yield' },
                    { val: 'growth', label: 'Highest Growth' }
                  ].map(option => (
                    <button
                      key={option.val}
                      onClick={() => {
                        setSortBy(option.val as any);
                        setShowSortDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-medium rounded-xl transition-colors ${
                        sortBy === option.val ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Item Counter */}
      <div className="text-xs text-slate-400 font-medium">
        {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} saved
      </div>

      {/* Grid or List items view */}
      {filteredItems.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
            <Star className="w-6 h-6 stroke-[1.5]" />
          </div>
          <div className="space-y-1.5 max-w-sm mx-auto">
            <h4 className="text-sm font-bold text-slate-900">No watchlisted items found</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Start searching for Dubai master developments or key projects, and bookmark them to keep tracking their market trends.
            </p>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 group hover:-translate-y-0.5"
            >
              {/* Card Image Block */}
              <div className="h-44 relative overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-slate-950/20 to-transparent"></div>
                
                {/* Type Badge */}
                <span className={`absolute top-4 left-4 px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest text-white shadow-sm z-10 ${
                  item.type === 'Community' ? 'bg-indigo-600/90' : 'bg-teal-600/90'
                }`}>
                  {item.type}
                </span>

                {/* Bookmark active */}
                <button
                  onClick={() => handleRemove(item.id, item.name)}
                  className="absolute top-4 right-4 w-7.5 h-7.5 rounded-full bg-white/90 backdrop-blur-xs text-amber-500 hover:text-slate-400 hover:bg-white flex items-center justify-center shadow-xs transition-all active:scale-90 cursor-pointer z-10"
                  title="Remove from watchlists"
                >
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                </button>
              </div>

              {/* Card Content */}
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center justify-between">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-300 shrink-0" />
                    <span>{item.location}</span>
                  </p>
                </div>

                {/* Grid metrics */}
                <div className="grid grid-cols-2 gap-3.5 py-3 border-y border-slate-50 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Avg. Price / sqft</span>
                    <span className="font-extrabold text-slate-900 mt-1 block">
                      AED {item.avgPrice.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">3Y Growth</span>
                    <span className="font-extrabold text-emerald-600 mt-1 flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" />
                      {item.growth}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Gross Yield</span>
                    <span className="font-extrabold text-slate-900 mt-1 block">
                      {item.yield}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Sync Status</span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-md inline-block mt-0.5">
                      Live
                    </span>
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="flex items-center justify-between gap-1.5 pt-1.5 relative">
                  <button
                    onClick={() => handleOpenAnalysis(item)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 text-xs font-bold text-slate-700 hover:text-indigo-600 transition-all cursor-pointer active:scale-98"
                  >
                    <span>Open Analysis</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleAskAI(item.name)}
                    className="w-9 h-9 rounded-xl border border-slate-100 bg-white hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                    title="Ask AI analyst about this item"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleGenerateReport(item.name)}
                    className="w-9 h-9 rounded-xl border border-slate-100 bg-white hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                    title="Generate Detailed Report"
                  >
                    <FileText className="w-4 h-4" />
                  </button>

                  {/* Options Menu Toggle */}
                  <div className="relative">
                    <button
                      onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                      className="w-9 h-9 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-600 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeMenuId === item.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)} />
                        <div className="absolute right-0 bottom-full mb-1.5 w-36 rounded-2xl bg-white border border-slate-100 shadow-lg p-1 z-20 space-y-0.5">
                          <button
                            onClick={() => {
                              handleRemove(item.id, item.name);
                              setActiveMenuId(null);
                            }}
                            className="w-full text-left px-3 py-2 text-xs font-bold rounded-xl text-rose-600 hover:bg-rose-50 flex items-center gap-1.5 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                  <span>Updated: {item.lastUpdated}</span>
                  <span>Saved: {item.savedDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs divide-y divide-slate-50">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors group"
            >
              {/* Left Section: Info */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase tracking-wider text-white ${
                      item.type === 'Community' ? 'bg-indigo-600/90' : 'bg-teal-600/90'
                    }`}>
                      {item.type}
                    </span>
                    <h3 className="text-xs font-extrabold text-slate-900">{item.name}</h3>
                  </div>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-300" />
                    <span>{item.location}</span>
                  </p>
                </div>
              </div>

              {/* Middle Section: Metrics */}
              <div className="grid grid-cols-3 gap-6 md:gap-12 text-center md:text-left">
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Avg Price</span>
                  <span className="text-xs font-bold text-slate-900 mt-0.5 block">AED {item.avgPrice.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">Yield</span>
                  <span className="text-xs font-bold text-slate-900 mt-0.5 block">{item.yield}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-medium block">3Y Growth</span>
                  <span className="text-xs font-bold text-emerald-600 mt-0.5 flex items-center gap-0.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {item.growth}
                  </span>
                </div>
              </div>

              {/* Right Section: Actions */}
              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenAnalysis(item)}
                  className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 text-xs font-bold text-slate-700 hover:text-indigo-600 transition-all flex items-center gap-1"
                >
                  <span>Analyze</span>
                  <ExternalLink className="w-3 h-3" />
                </button>

                <button
                  onClick={() => handleAskAI(item.name)}
                  className="w-8 h-8 rounded-xl border border-slate-100 bg-white hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 flex items-center justify-center transition-colors"
                  title="Ask AI"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleRemove(item.id, item.name)}
                  className="w-8 h-8 rounded-xl border border-slate-100 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors"
                  title="Remove Watchlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
