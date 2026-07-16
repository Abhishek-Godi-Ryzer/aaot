export interface WatchlistItem {
  id: string;
  type: 'Community' | 'Project';
  name: string;
  location: string;
  avgPrice: number;
  growth: string;
  yield: string;
  lastUpdated: string;
  savedDate: string;
  image: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  category: 'Market Update' | 'Transaction Alert' | 'Rental Alert' | 'AI Insight' | 'Project Update' | 'System';
  priority: 'High' | 'Medium' | 'Low';
  time: string;
  timeGroup: 'Today' | 'Yesterday' | 'This Week' | 'Older';
  read: boolean;
}

export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  language: string;
  role: string;
  company: string;
  timezone: string;
  avatarInitials: string;
}

export interface UserPreferences {
  defaultMarket: string;
  defaultCurrency: string;
  defaultAreaType: string;
  areasOfInterest: string[];
  unitOfMeasurement: 'sqft' | 'sqm';
  numberFormat: string;
  dateFormat: string;
  theme: 'Light' | 'Dark' | 'System';
  inAppNotifications: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketAlerts: boolean;
  aiInsightsReports: boolean;
  productUpdates: boolean;
}

const DEFAULT_WATCHLISTS: WatchlistItem[] = [
  {
    id: 'dubai-marina',
    type: 'Community',
    name: 'Dubai Marina',
    location: 'Dubai, UAE',
    avgPrice: 2210,
    growth: '+24.2%',
    yield: '6.12%',
    lastUpdated: 'Today, 09:30 AM',
    savedDate: '2026-07-10',
    image: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?auto=format&fit=crop&w=600&h=400&q=80'
  },
  {
    id: 'business-bay',
    type: 'Community',
    name: 'Business Bay',
    location: 'Dubai, UAE',
    avgPrice: 1690,
    growth: '+18.7%',
    yield: '5.48%',
    lastUpdated: 'Today, 08:45 AM',
    savedDate: '2026-07-11',
    image: 'https://images.unsplash.com/photo-1546412414-8035e1776c9a?auto=format&fit=crop&w=600&h=400&q=80'
  },
  {
    id: 'palm-jumeirah',
    type: 'Community',
    name: 'Palm Jumeirah',
    location: 'Dubai, UAE',
    avgPrice: 4520,
    growth: '+15.3%',
    yield: '5.45%',
    lastUpdated: 'Yesterday, 11:20 PM',
    savedDate: '2026-07-12',
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=600&h=400&q=80'
  },
  {
    id: 'marina-gate-1',
    type: 'Project',
    name: 'Marina Gate 1',
    location: 'Dubai Marina, Dubai',
    avgPrice: 2450,
    growth: '+21.6%',
    yield: '4.01%',
    lastUpdated: 'Today, 09:10 AM',
    savedDate: '2026-07-13',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&h=400&q=80'
  },
  {
    id: 'marina-gate-2',
    type: 'Project',
    name: 'Marina Gate 2',
    location: 'Dubai Marina, Dubai',
    avgPrice: 2380,
    growth: '+20.4%',
    yield: '6.00%',
    lastUpdated: 'Today, 09:30 AM',
    savedDate: '2026-07-13',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&h=400&q=80'
  },
  {
    id: 'emaar-beachfront',
    type: 'Project',
    name: 'Emaar Beachfront',
    location: 'Dubai Harbour, Dubai',
    avgPrice: 3100,
    growth: '+16.8%',
    yield: '5.25%',
    lastUpdated: 'Yesterday, 10:30 PM',
    savedDate: '2026-07-13',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&h=400&q=80'
  },
  {
    id: 'address-jbr',
    type: 'Project',
    name: 'Address JBR',
    location: 'Jumeirah Beach Residence, Dubai',
    avgPrice: 3780,
    growth: '+14.2%',
    yield: '4.25%',
    lastUpdated: '16 Apr 2026, 06:40 PM',
    savedDate: '2026-07-14',
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=600&h=400&q=80'
  },
  {
    id: 'bluewaters-residences',
    type: 'Project',
    name: 'Bluewaters Residences',
    location: 'Bluewaters Island, Dubai',
    avgPrice: 3050,
    growth: '+13.1%',
    yield: '5.10%',
    lastUpdated: '15 Apr 2026, 07:15 PM',
    savedDate: '2026-07-14',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&h=400&q=80'
  }
];

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Price Update - Dubai Marina',
    description: 'Average price increased by +2.4% this week. Current avg. price is AED 2,210 / sqft.',
    category: 'Market Update',
    priority: 'High',
    time: '10:30 AM',
    timeGroup: 'Today',
    read: false
  },
  {
    id: 'notif-2',
    title: 'New Transaction Recorded',
    description: 'A new sale transaction has been recorded in Marina Gate 1 for AED 2,450 / sqft.',
    category: 'Transaction Alert',
    priority: 'Medium',
    time: '09:15 AM',
    timeGroup: 'Today',
    read: false
  },
  {
    id: 'notif-3',
    title: 'Rental Yield Update - Business Bay',
    description: 'Gross rental yield updated to 6.21% based on latest Ejari data.',
    category: 'Rental Alert',
    priority: 'Medium',
    time: '08:45 AM',
    timeGroup: 'Today',
    read: true
  },
  {
    id: 'notif-4',
    title: 'AI Report Ready',
    description: 'Your AI Investment Report for Palm Jumeirah is ready to view.',
    category: 'AI Insight',
    priority: 'High',
    time: '08:20 AM',
    timeGroup: 'Today',
    read: false
  },
  {
    id: 'notif-5',
    title: 'Market Cycle Update',
    description: 'New market cycle analysis for Dubai is now available.',
    category: 'Market Update',
    priority: 'Medium',
    time: 'Yesterday, 06:30 PM',
    timeGroup: 'Yesterday',
    read: true
  },
  {
    id: 'notif-6',
    title: 'Data Synchronization Completed',
    description: 'All data sources synchronized successfully.',
    category: 'System',
    priority: 'Low',
    time: 'Yesterday, 04:10 PM',
    timeGroup: 'Yesterday',
    read: true
  },
  {
    id: 'notif-7',
    title: 'New Project Added',
    description: 'Address JBR has been added to the platform.',
    category: 'Project Update',
    priority: 'Low',
    time: '16 Apr 2026, 03:25 PM',
    timeGroup: 'This Week',
    read: true
  },
  {
    id: 'notif-8',
    title: 'Alert: Price Change Threshold',
    description: 'Business Bay price increased above your set threshold of +2%.',
    category: 'System',
    priority: 'High',
    time: '15 Apr 2026, 11:40 AM',
    timeGroup: 'This Week',
    read: true
  }
];

const DEFAULT_PROFILE: UserProfile = {
  fullName: 'Ahmed Mohamed',
  email: 'ahmed.mohamed@acot.com',
  phone: '+971 50 123 4567',
  country: 'United Arab Emirates',
  language: 'English (US)',
  role: 'Investor',
  company: 'ACME Investments',
  timezone: '(GMT+4) Asia/Dubai',
  avatarInitials: 'AM'
};

const DEFAULT_PREFERENCES: UserPreferences = {
  defaultMarket: 'Dubai',
  defaultCurrency: 'AED',
  defaultAreaType: 'Community',
  areasOfInterest: ['Dubai Marina', 'Business Bay', 'Palm Jumeirah'],
  unitOfMeasurement: 'sqft',
  numberFormat: '1,234.56',
  dateFormat: 'DD MMM YYYY',
  theme: 'Light',
  inAppNotifications: true,
  emailNotifications: true,
  pushNotifications: true,
  marketAlerts: true,
  aiInsightsReports: true,
  productUpdates: false
};

export class WorkspaceService {
  private static STORAGE_KEY_WATCHLIST = 'acot_watchlist_items';
  private static STORAGE_KEY_NOTIFICATIONS = 'acot_notification_items';
  private static STORAGE_KEY_PROFILE = 'acot_profile_info';
  private static STORAGE_KEY_PREFERENCES = 'acot_preferences';

  // --- Watchlist Functions ---
  static getWatchlists(): WatchlistItem[] {
    const data = localStorage.getItem(this.STORAGE_KEY_WATCHLIST);
    if (!data) {
      localStorage.setItem(this.STORAGE_KEY_WATCHLIST, JSON.stringify(DEFAULT_WATCHLISTS));
      return DEFAULT_WATCHLISTS;
    }
    return JSON.parse(data);
  }

  static saveItem(item: Omit<WatchlistItem, 'savedDate'>): WatchlistItem {
    const list = this.getWatchlists();
    const existing = list.find(i => i.id === item.id);
    if (existing) return existing;

    const newItem: WatchlistItem = {
      ...item,
      savedDate: new Date().toISOString().split('T')[0]
    };
    list.unshift(newItem);
    localStorage.setItem(this.STORAGE_KEY_WATCHLIST, JSON.stringify(list));
    window.dispatchEvent(new Event('acot_watchlist_updated'));
    return newItem;
  }

  static removeItem(id: string): void {
    const list = this.getWatchlists();
    const filtered = list.filter(i => i.id !== id);
    localStorage.setItem(this.STORAGE_KEY_WATCHLIST, JSON.stringify(filtered));
    window.dispatchEvent(new Event('acot_watchlist_updated'));
  }

  // --- Notifications Functions ---
  static getNotifications(): NotificationItem[] {
    const data = localStorage.getItem(this.STORAGE_KEY_NOTIFICATIONS);
    if (!data) {
      localStorage.setItem(this.STORAGE_KEY_NOTIFICATIONS, JSON.stringify(DEFAULT_NOTIFICATIONS));
      return DEFAULT_NOTIFICATIONS;
    }
    return JSON.parse(data);
  }

  static markRead(id: string): void {
    const list = this.getNotifications();
    const updated = list.map(item => item.id === id ? { ...item, read: true } : item);
    localStorage.setItem(this.STORAGE_KEY_NOTIFICATIONS, JSON.stringify(updated));
    window.dispatchEvent(new Event('acot_notifications_updated'));
  }

  static markAllRead(): void {
    const list = this.getNotifications();
    const updated = list.map(item => ({ ...item, read: true }));
    localStorage.setItem(this.STORAGE_KEY_NOTIFICATIONS, JSON.stringify(updated));
    window.dispatchEvent(new Event('acot_notifications_updated'));
  }

  static deleteNotification(id: string): void {
    const list = this.getNotifications();
    const filtered = list.filter(item => item.id !== id);
    localStorage.setItem(this.STORAGE_KEY_NOTIFICATIONS, JSON.stringify(filtered));
    window.dispatchEvent(new Event('acot_notifications_updated'));
  }

  static clearAll(): void {
    localStorage.setItem(this.STORAGE_KEY_NOTIFICATIONS, JSON.stringify([]));
    window.dispatchEvent(new Event('acot_notifications_updated'));
  }

  // --- Profile Functions ---
  static getProfile(): UserProfile {
    const data = localStorage.getItem(this.STORAGE_KEY_PROFILE);
    if (!data) {
      localStorage.setItem(this.STORAGE_KEY_PROFILE, JSON.stringify(DEFAULT_PROFILE));
      return DEFAULT_PROFILE;
    }
    return JSON.parse(data);
  }

  static updateProfile(profile: Partial<UserProfile>): UserProfile {
    const current = this.getProfile();
    const updated = { ...current, ...profile };
    localStorage.setItem(this.STORAGE_KEY_PROFILE, JSON.stringify(updated));
    window.dispatchEvent(new Event('acot_profile_updated'));
    return updated;
  }

  // --- Preferences Functions ---
  static getPreferences(): UserPreferences {
    const data = localStorage.getItem(this.STORAGE_KEY_PREFERENCES);
    if (!data) {
      localStorage.setItem(this.STORAGE_KEY_PREFERENCES, JSON.stringify(DEFAULT_PREFERENCES));
      return DEFAULT_PREFERENCES;
    }
    return JSON.parse(data);
  }

  static updatePreferences(prefs: Partial<UserPreferences>): UserPreferences {
    const current = this.getPreferences();
    const updated = { ...current, ...prefs };
    localStorage.setItem(this.STORAGE_KEY_PREFERENCES, JSON.stringify(updated));
    window.dispatchEvent(new Event('acot_preferences_updated'));
    return updated;
  }
}
