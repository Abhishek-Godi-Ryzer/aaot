import { useState, useEffect } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Settings,
  Mail,
  Smartphone,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileText,
  Home,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import { WorkspaceService, NotificationItem } from '../../services/workspaceService';

interface NotificationsContextPanelProps {
  onNavigateToModule?: (moduleName: string) => void;
  triggerToast?: (message: string) => void;
}

export default function NotificationsContextPanel({ onNavigateToModule, triggerToast }: NotificationsContextPanelProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [inAppNotif, setInAppNotif] = useState(true);

  const loadNotifications = () => {
    setNotifications(WorkspaceService.getNotifications());
    const prefs = WorkspaceService.getPreferences();
    setEmailNotif(prefs.emailNotifications);
    setPushNotif(prefs.pushNotifications);
    setInAppNotif(prefs.inAppNotifications);
  };

  useEffect(() => {
    loadNotifications();
    window.addEventListener('acot_notifications_updated', loadNotifications);
    window.addEventListener('acot_preferences_updated', loadNotifications);
    return () => {
      window.removeEventListener('acot_notifications_updated', loadNotifications);
      window.removeEventListener('acot_preferences_updated', loadNotifications);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    WorkspaceService.markAllRead();
    if (triggerToast) {
      triggerToast('All notifications marked as read.');
    }
  };

  const handleClearAll = () => {
    WorkspaceService.clearAll();
    if (triggerToast) {
      triggerToast('All notifications cleared.');
    }
  };

  const handlePreferenceToggle = (key: 'emailNotifications' | 'pushNotifications' | 'inAppNotifications', val: boolean) => {
    WorkspaceService.updatePreferences({ [key]: val });
    if (triggerToast) {
      triggerToast(`Notification channels updated.`);
    }
  };

  // Static stats as mock aggregates alongside dynamic unread count
  const thisWeekCount = notifications.filter(n => n.timeGroup === 'Today' || n.timeGroup === 'Yesterday' || n.timeGroup === 'This Week').length;

  return (
    <div className="space-y-5" id="notifications-context-panel">
      {/* CARD 1: NOTIFICATION SUMMARY */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full blur-2xl opacity-45"></div>
        
        <div className="relative z-10 space-y-3.5">
          <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5 text-indigo-600" />
            Notification Summary
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
              <span className="text-2xl font-black text-rose-600 block">{unreadCount}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5 block">Unread</span>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
              <span className="text-2xl font-black text-slate-800 block">{thisWeekCount + 16}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5 block">This Week</span>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
              <span className="text-2xl font-black text-slate-800 block">108</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5 block">This Month</span>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
              <span className="text-2xl font-black text-slate-800 block">356</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5 block">All Time</span>
            </div>
          </div>
        </div>
      </div>

      {/* CARD 2: BY CATEGORY */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-sm">
        <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
          By Category
        </h3>

        <div className="space-y-3">
          {[
            { label: 'Market Updates', count: 12, icon: TrendingUp, color: 'text-indigo-600 bg-indigo-50/50' },
            { label: 'Transaction Alerts', count: 8, icon: FileText, color: 'text-emerald-600 bg-emerald-50/50' },
            { label: 'Rental Alerts', count: 6, icon: Home, color: 'text-amber-600 bg-amber-50/50' },
            { label: 'AI Insights', count: 5, icon: Sparkles, color: 'text-indigo-600 bg-indigo-50/50' },
            { label: 'Project Updates', count: 3, icon: FileText, color: 'text-emerald-600 bg-emerald-50/50' },
            { label: 'System Notifications', count: 2, icon: RefreshCw, color: 'text-teal-600 bg-teal-50/50' }
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg ${item.color} flex items-center justify-center shrink-0`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold">{item.label}</span>
                </div>
                <span className="font-extrabold text-slate-900 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
                  {item.count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* CARD 3: QUICK ACTIONS */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-sm">
        <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
          Quick Actions
        </h3>

        <div className="space-y-2">
          <button
            onClick={handleMarkAllRead}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-slate-50 border border-slate-100/50 text-xs font-semibold text-slate-700 transition-all cursor-pointer group"
          >
            <CheckCheck className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            <span>Mark all as read</span>
          </button>
          
          <button
            onClick={handleClearAll}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-rose-50 border border-slate-100/50 text-xs font-semibold text-slate-700 transition-all cursor-pointer group"
          >
            <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition-colors" />
            <span>Clear all notifications</span>
          </button>
        </div>
      </div>

      {/* CARD 4: NOTIFICATION PREFERENCES CHANNEL */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-sm">
        <div>
          <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
            Notification Preferences
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Manage how and when you receive notifications.
          </p>
        </div>

        <div className="space-y-3">
          {/* Email Notifications toggle */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-semibold">Email Notifications</span>
            <button
              onClick={() => {
                setEmailNotif(!emailNotif);
                handlePreferenceToggle('emailNotifications', !emailNotif);
              }}
              className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                emailNotif ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'
              }`}
            >
              {emailNotif ? 'On' : 'Off'}
            </button>
          </div>

          {/* Push Notifications toggle */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-semibold">Push Notifications</span>
            <button
              onClick={() => {
                setPushNotif(!pushNotif);
                handlePreferenceToggle('pushNotifications', !pushNotif);
              }}
              className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                pushNotif ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'
              }`}
            >
              {pushNotif ? 'On' : 'Off'}
            </button>
          </div>

          {/* In-app Notifications toggle */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-semibold">In-app Notifications</span>
            <button
              onClick={() => {
                setInAppNotif(!inAppNotif);
                handlePreferenceToggle('inAppNotifications', !inAppNotif);
              }}
              className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                inAppNotif ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-400'
              }`}
            >
              {inAppNotif ? 'On' : 'Off'}
            </button>
          </div>
        </div>

        <button
          onClick={() => {
            if (onNavigateToModule) onNavigateToModule('Account & Preferences');
          }}
          className="w-full mt-1 inline-flex items-center justify-between text-xs font-bold text-indigo-600 hover:text-indigo-700 group cursor-pointer"
        >
          <span>Manage Preferences</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
