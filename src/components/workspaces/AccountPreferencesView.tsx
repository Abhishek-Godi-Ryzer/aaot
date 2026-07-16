import { useState, useEffect, FormEvent } from 'react';
import {
  User,
  Shield,
  Database,
  History,
  Check,
  CheckCircle,
  Eye,
  EyeOff,
  Plus,
  X,
  Smartphone,
  ChevronRight,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  Lock,
  Camera
} from 'lucide-react';
import { WorkspaceService, UserProfile, UserPreferences } from '../../services/workspaceService';

interface AccountPreferencesViewProps {
  onNavigateToModule?: (moduleName: string) => void;
  triggerToast?: (message: string) => void;
}

export default function AccountPreferencesView({ onNavigateToModule, triggerToast }: AccountPreferencesViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'security' | 'sources' | 'activity'>('profile');
  
  // Profile state
  const [profile, setProfile] = useState<UserProfile>({
    fullName: '', email: '', phone: '', country: '', language: '', role: '', company: '', timezone: '', avatarInitials: ''
  });

  // Preferences state
  const [prefs, setPrefs] = useState<UserPreferences>({
    defaultMarket: '', defaultCurrency: '', defaultAreaType: '', areasOfInterest: [],
    unitOfMeasurement: 'sqft', numberFormat: '', dateFormat: '', theme: 'Light',
    inAppNotifications: true, emailNotifications: true, pushNotifications: true,
    marketAlerts: true, aiInsightsReports: true, productUpdates: false
  });

  // Security Form States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);

  // Interest Area Select helper
  const [newInterestInput, setNewInterestInput] = useState('');

  useEffect(() => {
    setProfile(WorkspaceService.getProfile());
    setPrefs(WorkspaceService.getPreferences());
  }, []);

  const handleProfileSave = (e: FormEvent) => {
    e.preventDefault();
    WorkspaceService.updateProfile(profile);
    WorkspaceService.updatePreferences(prefs);
    if (triggerToast) {
      triggerToast('Your profile information and platform preferences have been updated!');
    }
  };

  const handlePasswordChange = (e: FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      if (triggerToast) triggerToast('Passwords do not match.');
      return;
    }
    if (triggerToast) {
      triggerToast('Password updated successfully!');
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleRemoveInterest = (area: string) => {
    const updated = prefs.areasOfInterest.filter(a => a !== area);
    setPrefs({ ...prefs, areasOfInterest: updated });
  };

  const handleAddInterest = () => {
    if (!newInterestInput) return;
    if (prefs.areasOfInterest.includes(newInterestInput)) {
      setNewInterestInput('');
      return;
    }
    const updated = [...prefs.areasOfInterest, newInterestInput];
    setPrefs({ ...prefs, areasOfInterest: updated });
    setNewInterestInput('');
  };

  return (
    <div className="space-y-6 animate-fade-in" id="account-preferences-view">
      {/* 1. VIEW SUB-TABS (Profile & Prefs, Security, Connected Sources, Activity & Sessions) */}
      <div className="flex border-b border-slate-100 pb-0.5 overflow-x-auto gap-2">
        {[
          { id: 'profile', label: 'Profile & Preferences', icon: User },
          { id: 'security', label: 'Security', icon: Shield },
          { id: 'sources', label: 'Connected Sources', icon: Database },
          { id: 'activity', label: 'Activity & Sessions', icon: History }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-extrabold transition-all relative whitespace-nowrap ${
                activeSubTab === tab.id
                  ? 'text-indigo-600 bg-indigo-50/50'
                  : 'text-slate-500 hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {activeSubTab === tab.id && (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-indigo-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* 2. SUB-TAB CONTENT SPLIT */}
      <form onSubmit={handleProfileSave} className="space-y-6">
        
        {/* TAB 1: PROFILE & PREFERENCES */}
        {activeSubTab === 'profile' && (
          <div className="space-y-6">
            
            {/* PROFILE SECTION CARD */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 space-y-6 shadow-xs">
              <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Profile Information</h3>
              
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pb-2">
                {/* Avatar circle with initials */}
                <div className="relative group shrink-0">
                  <div className="w-24 h-24 rounded-full bg-slate-900 text-white font-black text-3xl flex items-center justify-center shadow-md select-none">
                    {profile.avatarInitials || 'AM'}
                  </div>
                  <button
                    type="button"
                    onClick={() => triggerToast && triggerToast('Profile avatar upload process triggered.')}
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white text-slate-700 hover:text-indigo-600 flex items-center justify-center shadow-md border border-slate-100 transition-colors cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-black text-slate-900 leading-none">{profile.fullName || 'Ahmed Mohamed'}</h4>
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">Investor • Member since Jan 12, 2026</p>
                </div>
              </div>

              {/* Form Input fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200/80 rounded-xl text-xs bg-white text-slate-950 focus:outline-hidden focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 shadow-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full pl-4 pr-16 py-2.5 border border-slate-200/80 rounded-xl text-xs bg-white text-slate-950 focus:outline-hidden focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 shadow-xs"
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-1.5 py-0.5 rounded-md">
                      Verified
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Phone Number</label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200/80 rounded-xl text-xs bg-white text-slate-950 focus:outline-hidden focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Country</label>
                  <select
                    value={profile.country}
                    onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200/80 rounded-xl text-xs bg-white text-slate-950 focus:outline-hidden focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 shadow-xs"
                  >
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Language</label>
                  <select
                    value={profile.language}
                    onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200/80 rounded-xl text-xs bg-white text-slate-950 focus:outline-hidden focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 shadow-xs"
                  >
                    <option value="English (US)">English (US)</option>
                    <option value="English (UK)">English (UK)</option>
                    <option value="Arabic">Arabic (العربية)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Role</label>
                  <select
                    value={profile.role}
                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200/80 rounded-xl text-xs bg-white text-slate-950 focus:outline-hidden focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 shadow-xs"
                  >
                    <option value="Investor">Investor</option>
                    <option value="Broker">Broker / Agent</option>
                    <option value="Developer">Developer Analyst</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Company (Optional)</label>
                  <input
                    type="text"
                    value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200/80 rounded-xl text-xs bg-white text-slate-950 focus:outline-hidden focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Timezone</label>
                  <select
                    value={profile.timezone}
                    onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200/80 rounded-xl text-xs bg-white text-slate-950 focus:outline-hidden focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600 shadow-xs"
                  >
                    <option value="(GMT+4) Asia/Dubai">(GMT+4) Asia/Dubai</option>
                    <option value="(GMT+0) London / Western Europe">(GMT+0) London / Western Europe</option>
                    <option value="(GMT-5) Eastern Time (US)">(GMT-5) Eastern Time (US)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* PREFERENCES SECTION BENTO GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* BLOCK 1: MARKET PREFERENCES */}
              <div className="bg-white border border-slate-100 rounded-[2rem] p-6 space-y-4 shadow-xs">
                <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Market Preferences</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Default Market</label>
                    <select
                      value={prefs.defaultMarket}
                      onChange={(e) => setPrefs({ ...prefs, defaultMarket: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600"
                    >
                      <option value="Dubai">Dubai</option>
                      <option value="Abu Dhabi">Abu Dhabi</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Default Currency</label>
                    <select
                      value={prefs.defaultCurrency}
                      onChange={(e) => setPrefs({ ...prefs, defaultCurrency: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600"
                    >
                      <option value="AED">AED (د.إ) - UAE Dirham</option>
                      <option value="USD">USD ($) - US Dollar</option>
                      <option value="EUR">EUR (€) - Euro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Default Area Type</label>
                    <select
                      value={prefs.defaultAreaType}
                      onChange={(e) => setPrefs({ ...prefs, defaultAreaType: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600"
                    >
                      <option value="Community">Community</option>
                      <option value="Sub-area">Sub-area</option>
                      <option value="Project">Project</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Areas of Interest (Optional)</label>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {prefs.areasOfInterest.map(area => (
                        <span key={area} className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg text-xs font-semibold">
                          <span>{area}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveInterest(area)}
                            className="text-indigo-400 hover:text-indigo-900 font-bold"
                          >
                            ✕
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <select
                        value={newInterestInput}
                        onChange={(e) => setNewInterestInput(e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-hidden"
                      >
                        <option value="">-- Add Community --</option>
                        <option value="Dubai Marina">Dubai Marina</option>
                        <option value="Business Bay">Business Bay</option>
                        <option value="Palm Jumeirah">Palm Jumeirah</option>
                        <option value="Downtown Dubai">Downtown Dubai</option>
                        <option value="Jumeirah Village Circle">JVC</option>
                      </select>
                      <button
                        type="button"
                        onClick={handleAddInterest}
                        className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* BLOCK 2: DISPLAY PREFERENCES */}
              <div className="bg-white border border-slate-100 rounded-[2rem] p-6 space-y-4 shadow-xs">
                <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Display Preferences</h3>
                
                <div className="space-y-4">
                  {/* Units of measurement toggle */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Unit of Measurement</label>
                    <div className="flex gap-2 bg-slate-100 p-0.5 rounded-xl border border-slate-200/20 max-w-xs">
                      <button
                        type="button"
                        onClick={() => setPrefs({ ...prefs, unitOfMeasurement: 'sqft' })}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          prefs.unitOfMeasurement === 'sqft' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        sq ft
                      </button>
                      <button
                        type="button"
                        onClick={() => setPrefs({ ...prefs, unitOfMeasurement: 'sqm' })}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          prefs.unitOfMeasurement === 'sqm' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        sqm
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Number Format</label>
                    <select
                      value={prefs.numberFormat}
                      onChange={(e) => setPrefs({ ...prefs, numberFormat: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600"
                    >
                      <option value="1,234.56">1,234.56 (Standard)</option>
                      <option value="1.234,56">1.234,56 (European)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Date Format</label>
                    <select
                      value={prefs.dateFormat}
                      onChange={(e) => setPrefs({ ...prefs, dateFormat: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-600 focus:border-indigo-600"
                    >
                      <option value="DD MMM YYYY">DD MMM YYYY (e.g. 14 Jul 2026)</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Theme</label>
                    <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200/20 max-w-xs">
                      {['Light', 'Dark', 'System'].map(themeOption => (
                        <button
                          key={themeOption}
                          type="button"
                          onClick={() => setPrefs({ ...prefs, theme: themeOption as any })}
                          className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            prefs.theme === themeOption ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          {themeOption}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* BLOCK 3: NOTIFICATION INLINE PREFERENCES */}
            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 space-y-4 shadow-xs">
              <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Notification Preferences</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  { key: 'inAppNotifications', label: 'In-app Notifications', desc: 'Alerts in the application header feed.' },
                  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Summaries sent directly to your inbox.' },
                  { key: 'pushNotifications', label: 'Push Notifications', desc: 'Desktop alerts for critical threshold updates.' },
                  { key: 'marketAlerts', label: 'Market Alerts', desc: 'Instant pricing or supply volume shifts.' },
                  { key: 'aiInsightsReports', label: 'AI Insights & Reports', desc: 'Get updates when analytical reports generate.' },
                  { key: 'productUpdates', label: 'Product Updates', desc: 'Stay updated with new features and releases.' }
                ].map(item => (
                  <div key={item.key} className="flex items-start justify-between gap-4 p-3 rounded-2xl border border-slate-50 hover:bg-slate-50/40 transition-colors">
                    <div className="space-y-1">
                      <span className="text-xs font-extrabold text-slate-800">{item.label}</span>
                      <p className="text-[10px] text-slate-400 leading-normal">{item.desc}</p>
                    </div>
                    {/* Simulated Switch toggle */}
                    <button
                      type="button"
                      onClick={() => setPrefs({ ...prefs, [item.key]: !((prefs as any)[item.key]) })}
                      className={`w-10 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 mt-0.5 ${
                        (prefs as any)[item.key] ? 'bg-indigo-600' : 'bg-slate-200'
                      }`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow-xs transition-transform transform ${
                        (prefs as any)[item.key] ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* SAVE BUTTONS */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-indigo-600/10 active:scale-98 transition-all cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: SECURITY */}
        {activeSubTab === 'security' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* CHANGE PASSWORD */}
              <div className="bg-white border border-slate-100 rounded-[2rem] p-6 space-y-4 shadow-xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Lock className="w-4 h-4 text-indigo-600" />
                  <span>Change Password</span>
                </div>
                <p className="text-xs text-slate-400">Ensure security by updating password parameters regularly.</p>
                
                <div className="space-y-4 pt-1">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-hidden"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-hidden"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-hidden"
                      placeholder="••••••••"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handlePasswordChange}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Update Password
                  </button>
                </div>
              </div>

              {/* TWO FACTOR AUTH */}
              <div className="bg-white border border-slate-100 rounded-[2rem] p-6 space-y-4 shadow-xs flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <Shield className="w-4 h-4 text-indigo-600" />
                      Two-Factor Authentication (2FA)
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[8.5px] font-bold bg-emerald-50 text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                      Enabled
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Two-factor authentication adds an extra layer of protection to your profile account. In addition to password access, you will be prompted to supply a secure code generated by authenticator apps during sign-in attempts.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">Method: Google Authenticator</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIs2FAEnabled(!is2FAEnabled);
                      triggerToast && triggerToast(is2FAEnabled ? '2FA Disabled.' : '2FA Configured.');
                    }}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-xs font-extrabold text-slate-700 rounded-xl cursor-pointer"
                  >
                    Configure 2FA
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: CONNECTED GOVERNMENT SOURCES */}
        {activeSubTab === 'sources' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Connected Verified Government Sources</h3>
                  <p className="text-xs text-slate-400 mt-1">Official state integrations dynamically queried for investment and rental intelligence</p>
                </div>
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-100/30">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Synchronized
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {[
                  { name: 'Dubai Land Department (DLD)', desc: 'Official transactional history registry.', status: 'Active', color: 'bg-indigo-50 border-indigo-100' },
                  { name: 'Ejari Rental Registry', desc: 'Dubai rental contract records.', status: 'Active', color: 'bg-emerald-50 border-emerald-100' },
                  { name: 'Oqood (Dubai REST)', desc: 'Off-plan developments catalog indices.', status: 'Active', color: 'bg-amber-50 border-amber-100' },
                  { name: 'RERA Regulations Board', desc: 'Verified broker indices and regulatory caps.', status: 'Active', color: 'bg-teal-50 border-teal-100' }
                ].map(source => (
                  <div key={source.name} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-xs font-extrabold text-slate-900">{source.name}</h4>
                      <p className="text-[11px] text-slate-400">{source.desc}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 fill-emerald-50 text-emerald-600" />
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ACTIVITY LOG & DEVICE SESSIONS */}
        {activeSubTab === 'activity' && (
          <div className="space-y-6">
            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 space-y-4 shadow-xs">
              <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Active Devices & Sessions</h3>
              <p className="text-xs text-slate-400">Manage device authorizations and active login tokens.</p>

              <div className="divide-y divide-slate-50">
                {[
                  { device: 'MacBook Pro • Chrome Web Browser', location: 'Dubai, UAE (Current Session)', ip: '194.212.180.12', time: 'Active Now' },
                  { device: 'iPhone 15 Pro Max • iOS App', location: 'Dubai, UAE', ip: '194.212.180.44', time: 'Yesterday, 10:20 PM' }
                ].map((sess, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between text-xs gap-4">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-indigo-600 shrink-0" />
                      <div>
                        <h4 className="font-extrabold text-slate-900">{sess.device}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">{sess.location} • {sess.ip}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-slate-400 font-semibold">{sess.time}</span>
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => triggerToast && triggerToast('Revoking device session authorization...')}
                          className="px-2.5 py-1 text-slate-500 hover:text-rose-600 hover:bg-rose-50 text-[10px] font-bold rounded-lg border border-slate-100/50 cursor-pointer"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </form>
    </div>
  );
}
