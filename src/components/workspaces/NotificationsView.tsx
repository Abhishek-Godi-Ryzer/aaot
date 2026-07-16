import { useState, useEffect } from 'react';
import {
  Bell,
  CheckCheck,
  Trash2,
  ChevronDown,
  Search,
  Grid,
  List,
  Calendar,
  MoreVertical,
  Circle,
  TrendingUp,
  FileText,
  Home,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  SlidersHorizontal
} from 'lucide-react';
import { WorkspaceService, NotificationItem } from '../../services/workspaceService';

interface NotificationsViewProps {
  onNavigateToModule?: (moduleName: string) => void;
  triggerToast?: (message: string) => void;
}

export default function NotificationsView({ onNavigateToModule, triggerToast }: NotificationsViewProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'mentions' | 'system'>('all');
  
  // Filtering States
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [selectedPriority, setSelectedPriority] = useState<string>('All Priorities');
  const [selectedStatus, setSelectedStatus] = useState<string>('All Status');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dropdown Toggles
  const [showCategoryDrop, setShowCategoryDrop] = useState(false);
  const [showPriorityDrop, setShowPriorityDrop] = useState(false);
  const [showStatusDrop, setShowStatusDrop] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [visibleCount, setVisibleCount] = useState(8);

  const loadNotifications = () => {
    setNotifications(WorkspaceService.getNotifications());
  };

  useEffect(() => {
    loadNotifications();
    window.addEventListener('acot_notifications_updated', loadNotifications);
    return () => {
      window.removeEventListener('acot_notifications_updated', loadNotifications);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkRead = (id: string) => {
    WorkspaceService.markRead(id);
    if (triggerToast) {
      triggerToast('Notification marked as read.');
    }
  };

  const handleMarkAllRead = () => {
    WorkspaceService.markAllRead();
    if (triggerToast) {
      triggerToast('All notifications marked as read.');
    }
  };

  const handleDelete = (id: string) => {
    WorkspaceService.deleteNotification(id);
    if (triggerToast) {
      triggerToast('Notification deleted.');
    }
  };

  const handleClearAll = () => {
    WorkspaceService.clearAll();
    if (triggerToast) {
      triggerToast('All notifications cleared.');
    }
  };

  const handleNotificationAction = (item: NotificationItem) => {
    // Auto mark read when clicked
    if (!item.read) {
      WorkspaceService.markRead(item.id);
    }

    if (triggerToast) {
      triggerToast(`Opening context for: ${item.title}`);
    }

    // Context Handoff logic based on notification category
    if (onNavigateToModule) {
      if (item.category === 'Market Update') {
        onNavigateToModule('Market Analytics & Cycles');
      } else if (item.category === 'Transaction Alert') {
        onNavigateToModule('Transaction Intelligence');
      } else if (item.category === 'Rental Alert') {
        onNavigateToModule('Rental Intelligence');
      } else if (item.category === 'AI Insight') {
        onNavigateToModule('AI Intelligence Suite');
      } else if (item.category === 'Project Update') {
        onNavigateToModule('Transaction Intelligence');
      } else {
        onNavigateToModule('Dashboard');
      }
    }
  };

  // Filter application
  const filteredNotifs = notifications.filter(item => {
    // 1. Tab filters
    if (activeTab === 'unread' && item.read) return false;
    if (activeTab === 'mentions' && !item.title.toLowerCase().includes('report') && !item.description.toLowerCase().includes('ready')) return false;
    if (activeTab === 'system' && item.category !== 'System') return false;

    // 2. Select Dropdowns
    if (selectedCategory !== 'All Categories' && item.category !== selectedCategory) return false;
    if (selectedPriority !== 'All Priorities' && item.priority !== selectedPriority) return false;
    if (selectedStatus !== 'All Status') {
      if (selectedStatus === 'Unread' && item.read) return false;
      if (selectedStatus === 'Read' && !item.read) return false;
    }

    // 3. Search query
    const query = searchQuery.toLowerCase();
    if (query) {
      return (
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Market Update':
        return <TrendingUp className="w-4 h-4 text-indigo-600" />;
      case 'Transaction Alert':
        return <FileText className="w-4 h-4 text-emerald-600" />;
      case 'Rental Alert':
        return <Home className="w-4 h-4 text-amber-600" />;
      case 'AI Insight':
        return <Sparkles className="w-4 h-4 text-indigo-600" />;
      case 'System':
        return <RefreshCw className="w-4 h-4 text-teal-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Market Update': return 'bg-indigo-50 border-indigo-100 text-indigo-700';
      case 'Transaction Alert': return 'bg-emerald-50 border-emerald-100 text-emerald-700';
      case 'Rental Alert': return 'bg-amber-50 border-amber-100 text-amber-700';
      case 'AI Insight': return 'bg-indigo-50 border-indigo-100 text-indigo-700';
      case 'System': return 'bg-teal-50 border-teal-100 text-teal-700';
      default: return 'bg-slate-50 border-slate-100 text-slate-700';
    }
  };

  // Grouping notifications by Time Frame
  const groups: { [key: string]: NotificationItem[] } = {
    Today: [],
    Yesterday: [],
    'This Week': [],
    Older: []
  };

  filteredNotifs.slice(0, visibleCount).forEach(notif => {
    if (groups[notif.timeGroup]) {
      groups[notif.timeGroup].push(notif);
    } else {
      groups['Older'].push(notif);
    }
  });

  return (
    <div className="space-y-6" id="notifications-view">
      {/* 1. TOP FILTERS ROW */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-3xl border border-slate-100 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Categories Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowCategoryDrop(!showCategoryDrop);
                setShowPriorityDrop(false);
                setShowStatusDrop(false);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-100 text-xs font-bold text-slate-700 bg-slate-50/50 hover:bg-slate-50 transition-colors"
            >
              <span>{selectedCategory}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showCategoryDrop && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowCategoryDrop(false)} />
                <div className="absolute left-0 mt-1.5 w-48 rounded-2xl bg-white border border-slate-100 shadow-lg p-1 z-20 space-y-0.5">
                  {['All Categories', 'Market Update', 'Transaction Alert', 'Rental Alert', 'AI Insight', 'Project Update', 'System'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setShowCategoryDrop(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-medium rounded-xl transition-colors ${
                        selectedCategory === cat ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Priorities Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowPriorityDrop(!showPriorityDrop);
                setShowCategoryDrop(false);
                setShowStatusDrop(false);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-100 text-xs font-bold text-slate-700 bg-slate-50/50 hover:bg-slate-50 transition-colors"
            >
              <span>{selectedPriority}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showPriorityDrop && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowPriorityDrop(false)} />
                <div className="absolute left-0 mt-1.5 w-40 rounded-2xl bg-white border border-slate-100 shadow-lg p-1 z-20 space-y-0.5">
                  {['All Priorities', 'High', 'Medium', 'Low'].map(prio => (
                    <button
                      key={prio}
                      onClick={() => {
                        setSelectedPriority(prio);
                        setShowPriorityDrop(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-medium rounded-xl transition-colors ${
                        selectedPriority === prio ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {prio}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowStatusDrop(!showStatusDrop);
                setShowCategoryDrop(false);
                setShowPriorityDrop(false);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-100 text-xs font-bold text-slate-700 bg-slate-50/50 hover:bg-slate-50 transition-colors"
            >
              <span>{selectedStatus}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showStatusDrop && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowStatusDrop(false)} />
                <div className="absolute left-0 mt-1.5 w-40 rounded-2xl bg-white border border-slate-100 shadow-lg p-1 z-20 space-y-0.5">
                  {['All Status', 'Unread', 'Read'].map(st => (
                    <button
                      key={st}
                      onClick={() => {
                        setSelectedStatus(st);
                        setShowStatusDrop(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-medium rounded-xl transition-colors ${
                        selectedStatus === st ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-100/30 text-xs font-bold text-indigo-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all as read</span>
          </button>

          {/* More options menu */}
          <div className="relative">
            <button
              onClick={() => setActiveMenuId(activeMenuId === 'global' ? null : 'global')}
              className="w-9 h-9 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {activeMenuId === 'global' && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)} />
                <div className="absolute right-0 mt-1 w-44 rounded-2xl bg-white border border-slate-100 shadow-lg p-1 z-20 space-y-0.5">
                  <button
                    onClick={() => {
                      handleClearAll();
                      setActiveMenuId(null);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold rounded-xl text-rose-600 hover:bg-rose-50 flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear all notifications</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. TAB CONTROLS + SEARCH */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-1">
        {/* Tabs */}
        <div className="flex gap-1">
          {[
            { id: 'all', label: 'All Notifications' },
            { id: 'unread', label: `Unread (${unreadCount})` },
            { id: 'mentions', label: 'Mentions' },
            { id: 'system', label: 'System' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
                activeTab === tab.id
                  ? 'text-indigo-600 bg-indigo-50/50'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-indigo-600 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200/80 rounded-xl text-xs bg-white text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 shadow-xs"
            />
          </div>

          <div className="flex bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/40 shrink-0">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'list' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
          </div>

          <button className="w-9 h-9 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-600 flex items-center justify-center shadow-xs">
            <Calendar className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. FEED FEED */}
      {filteredNotifs.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
            <Bell className="w-6 h-6 stroke-[1.5]" />
          </div>
          <div className="space-y-1.5 max-w-sm mx-auto">
            <h4 className="text-sm font-bold text-slate-900">No notifications found</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              No notifications matching your active filters. Enjoy the peace or expand your filter criteria!
            </p>
          </div>
        </div>
      ) : viewMode === 'list' ? (
        /* LIST FEED */
        <div className="space-y-6">
          {(['Today', 'Yesterday', 'This Week', 'Older'] as const).map(groupName => {
            const list = groups[groupName];
            if (!list || list.length === 0) return null;

            return (
              <div key={groupName} className="space-y-3">
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest px-1">
                  {groupName}
                </h3>
                
                <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs divide-y divide-slate-50">
                  {list.map(item => (
                    <div
                      key={item.id}
                      className={`p-4 flex items-start gap-4 transition-colors hover:bg-slate-50/40 relative ${
                        !item.read ? 'bg-indigo-50/10' : ''
                      }`}
                    >
                      {/* Active Indicator purple dot */}
                      {!item.read && (
                        <div className="absolute left-2.5 top-1/2 -translate-y-1/2">
                          <Circle className="w-2.5 h-2.5 fill-indigo-600 text-indigo-600" />
                        </div>
                      )}

                      {/* Icon circle */}
                      <div className="w-10 h-10 rounded-2xl bg-slate-50/80 border border-slate-100/50 flex items-center justify-center shrink-0 ml-1">
                        {getCategoryIcon(item.category)}
                      </div>

                      {/* Content block */}
                      <div className="flex-1 space-y-1 cursor-pointer" onClick={() => handleNotificationAction(item)}>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className={`text-xs text-slate-900 tracking-tight ${!item.read ? 'font-extrabold' : 'font-semibold'}`}>
                            {item.title}
                          </h4>
                          <span className={`px-2 py-0.5 rounded-md text-[8.5px] font-bold border ${getCategoryColor(item.category)}`}>
                            {item.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                          {item.description}
                        </p>
                        <div className="text-[10px] text-slate-400 flex items-center gap-3 pt-0.5">
                          <span>{item.time}</span>
                          <span>•</span>
                          <span className={`font-bold uppercase tracking-wider ${
                            item.priority === 'High' ? 'text-rose-500' : item.priority === 'Medium' ? 'text-amber-500' : 'text-slate-400'
                          }`}>
                            {item.priority} Priority
                          </span>
                        </div>
                      </div>

                      {/* Action trigger options */}
                      <div className="relative shrink-0 self-center">
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                          className="w-8 h-8 rounded-lg border border-slate-100/50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>

                        {activeMenuId === item.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)} />
                            <div className="absolute right-0 mt-1 w-36 rounded-xl bg-white border border-slate-100 shadow-lg p-1 z-20 space-y-0.5">
                              {!item.read && (
                                <button
                                  onClick={() => {
                                    handleMarkRead(item.id);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full text-left px-2.5 py-1.5 text-xs font-semibold rounded-lg hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 transition-colors"
                                >
                                  <Circle className="w-2.5 h-2.5 fill-indigo-600 text-indigo-600" />
                                  <span>Mark Read</span>
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  handleDelete(item.id);
                                  setActiveMenuId(null);
                                }}
                                className="w-full text-left px-2.5 py-1.5 text-xs font-bold rounded-lg hover:bg-rose-50 text-rose-600 flex items-center gap-1.5 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* GRID VIEW OF CARDS */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotifs.slice(0, visibleCount).map(item => (
            <div
              key={item.id}
              className={`bg-white rounded-3xl border p-5 space-y-4 shadow-xs transition-all relative group hover:shadow-md ${
                !item.read ? 'border-indigo-100 bg-indigo-50/5' : 'border-slate-100'
              }`}
            >
              {!item.read && (
                <div className="absolute top-4 left-4">
                  <Circle className="w-2.5 h-2.5 fill-indigo-600 text-indigo-600" />
                </div>
              )}

              <div className="flex items-center justify-between gap-2 pl-4">
                <span className={`px-2 py-0.5 rounded-md text-[8.5px] font-bold border ${getCategoryColor(item.category)}`}>
                  {item.category}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">{item.time}</span>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                  {item.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-50 flex items-center justify-between gap-2 text-xs">
                <span className={`font-bold uppercase tracking-wider text-[9px] ${
                  item.priority === 'High' ? 'text-rose-500' : item.priority === 'Medium' ? 'text-amber-500' : 'text-slate-400'
                }`}>
                  {item.priority} Priority
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleNotificationAction(item)}
                    className="p-1 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    title="Open Context"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. LOAD MORE */}
      {filteredNotifs.length > visibleCount && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setVisibleCount(prev => prev + 6)}
            className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
