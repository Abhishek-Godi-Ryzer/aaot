// Market Analytics and Related Services for ACOT Dubai Platform
// Implements local mock JSON data, and scalable API signatures.

export interface Community {
  id: string;
  name: string;
  type: string;
  avgPrice: number; // AED/sqft
  growth: number; // percentage (e.g. 28.4)
  growthString: string; // e.g. "↑ 28.4%"
  volume: number; // count
  value: number; // in billions AED
  occupancy: number; // percentage
  yield: number; // percentage
  description: string;
  image: string;
  keyMetric: string;
  developer: string;
  ownership: string;
  status: string;
  completion: string;
}

export interface SubArea {
  id: string;
  name: string;
  communityId: string;
  avgPrice: number;
  growth: number;
  transactions: number;
  image: string;
  developer: string;
  status: string;
  buildings: number;
  typicalUse: string;
  completion: string;
}

export interface Project {
  id: string;
  name: string;
  subAreaId: string;
  communityId: string;
  avgPrice: number;
  growth: number;
  transactions: number;
  image: string;
  developer: string;
  status: string;
  completionYear: number;
  propertyTypes: string;
  towers: number;
  totalUnits: number;
  ownership: string;
  marketTrend: string;
  availableUnits: number;
  lastTransaction: string;
  studioPrice: number;
  studioGrowth: number;
  oneBedPrice: number;
  oneBedGrowth: number;
  twoBedPrice: number;
  twoBedGrowth: number;
  threeBedPrice: number;
  threeBedGrowth: number;
  penthousePrice: number;
  penthouseGrowth: number;
}

export interface PriceHistoryPoint {
  year: number;
  price: number; // AED / sqft
  volume: number; // Count
  label: string; // Event or milestone description
}

export interface CycleMetric {
  period: string; // "Annual" | "Monthly" | "YTD" | "Last 30 Days" | "Last 7 Days" | "QoQ"
  medianPrice: number;
  priceSqft: number;
  transactions: number;
  volume: string; // "4.89B"
  momentum: string; // "Strong" | "Moderate" | "Stabilizing"
  trendData: { name: string; price: number; volume: number }[];
}

export interface MethodologyComparison {
  period: string;
  previousPrice: number;
  currentPrice: number;
  changePercent: number;
  previousPriceSqft: number;
  currentPriceSqft: number;
  previousPeriodLabel: string;
  currentPeriodLabel: string;
  chartData: { name: string; prevVal: number; currVal: number }[];
}

export interface LeaderboardItem {
  rank: number;
  id: string;
  name: string;
  image: string;
  metric: string;
  trend: string;
  trendDirection: 'up' | 'down';
}

// ==========================================
// MOCK DATA STORAGE
// ==========================================

export const MOCK_COMMUNITIES: Community[] = [
  {
    id: 'dubai-marina',
    name: 'Dubai Marina',
    type: 'Waterfront Community',
    avgPrice: 1654,
    growth: 28.4,
    growthString: '↑ 28.4%',
    volume: 12845,
    value: 8.4,
    occupancy: 92,
    yield: 7.2,
    description: 'A world-famous luxury waterfront community known for its high-rise residential towers, vibrant promenade, and upscale retail offerings.',
    image: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?auto=format&fit=crop&w=600&h=400&q=80',
    keyMetric: '92% Occupancy Rate',
    developer: 'Emaar, Dubai Properties, Select Group & more',
    ownership: 'Freehold',
    status: 'Established Community',
    completion: '2003 - Present'
  },
  {
    id: 'business-bay',
    name: 'Business Bay',
    type: 'Central Business District',
    avgPrice: 1512,
    growth: 23.7,
    growthString: '↑ 23.7%',
    volume: 11420,
    value: 6.2,
    occupancy: 88,
    yield: 6.8,
    description: 'Dubai\'s central business district, featuring highly styled skyscrapers, canal-side walks, corporate headquarters, and high-end hotels.',
    image: 'https://images.unsplash.com/photo-1546412414-8035e1776c9a?auto=format&fit=crop&w=600&h=400&q=80',
    keyMetric: '88% Occupancy Rate',
    developer: 'Dubai Properties, Omniyat, DAMAC',
    ownership: 'Freehold',
    status: 'High Growth',
    completion: '2008 - Present'
  },
  {
    id: 'downtown-dubai',
    name: 'Downtown Dubai',
    type: 'Prime Urban Hub',
    avgPrice: 2349,
    growth: 31.2,
    growthString: '↑ 31.2%',
    volume: 9872,
    value: 12.1,
    occupancy: 94,
    yield: 5.9,
    description: 'The spectacular tourism and urban lifestyle heart of Dubai, surrounding the iconic Burj Khalifa, Dubai Mall, and Dubai Fountain.',
    image: 'https://images.unsplash.com/photo-1526495124232-a04e18491f5a?auto=format&fit=crop&w=600&h=400&q=80',
    keyMetric: '94% Occupancy Rate',
    developer: 'Emaar Properties',
    ownership: 'Freehold',
    status: 'Prime Established',
    completion: '2004 - Present'
  },
  {
    id: 'palm-jumeirah',
    name: 'Palm Jumeirah',
    type: 'Luxury Island Living',
    avgPrice: 2101,
    growth: 27.1,
    growthString: '↑ 27.1%',
    volume: 7654,
    value: 15.6,
    occupancy: 96,
    yield: 6.1,
    description: 'The world-famous palm-shaped luxury resort island, hosting ultra-wealthy residents, pristine beaches, and premier high-end residential estates.',
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=600&h=400&q=80',
    keyMetric: '96% Occupancy Rate',
    developer: 'Nakheel',
    ownership: 'Freehold',
    status: 'Ultra Premium',
    completion: '2006 - Present'
  },
  {
    id: 'jumeirah-village-circle',
    name: 'Jumeirah Village Circle',
    type: 'Family Community',
    avgPrice: 1067,
    growth: 19.8,
    growthString: '↑ 19.8%',
    volume: 6230,
    value: 4.8,
    occupancy: 91,
    yield: 8.4,
    description: 'A quiet, rapidly appreciating suburban family master-development offering modern housing, lush parks, and incredibly strong rental yields.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&h=400&q=80',
    keyMetric: '91% Occupancy Rate',
    developer: 'Nakheel, Binghatti, Ellington',
    ownership: 'Freehold',
    status: 'Active Expansion',
    completion: '2012 - Present'
  },
  {
    id: 'dubai-hills-estate',
    name: 'Dubai Hills Estate',
    type: 'Master Planned Community',
    avgPrice: 1280,
    growth: 21.6,
    growthString: '↑ 21.6%',
    volume: 5410,
    value: 5.6,
    occupancy: 93,
    yield: 6.5,
    description: 'A premium green master-development centered around an 18-hole championship golf course, hosting beautiful parks, villas, and modern apartments.',
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=600&h=400&q=80',
    keyMetric: '93% Occupancy Rate',
    developer: 'Emaar Properties & Meraas',
    ownership: 'Freehold',
    status: 'Established Residential',
    completion: '2016 - Present'
  },
  {
    id: 'jumeirah-lakes-towers',
    name: 'Jumeirah Lakes Towers',
    type: 'Mixed Use Community',
    avgPrice: 1138,
    growth: 18.9,
    growthString: '↑ 18.9%',
    volume: 4890,
    value: 3.9,
    occupancy: 90,
    yield: 7.5,
    description: 'A dense high-rise district structured around three scenic artificial lakes, offering excellent mid-to-high market residential investments.',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&h=400&q=80',
    keyMetric: '90% Occupancy Rate',
    developer: 'DMCC, Various Developers',
    ownership: 'Freehold',
    status: 'Highly Liquid',
    completion: '2006 - Present'
  },
  {
    id: 'dubai-creek-harbour',
    name: 'Dubai Creek Harbour',
    type: 'Waterfront Community',
    avgPrice: 1599,
    growth: 23.4,
    growthString: '↑ 23.4%',
    volume: 4120,
    value: 4.2,
    occupancy: 89,
    yield: 6.3,
    description: 'A futuristic luxury waterfront community along the historic Dubai Creek, offering outstanding views of the city skyline and smart infrastructure.',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&h=400&q=80',
    keyMetric: '89% Occupancy Rate',
    developer: 'Emaar Properties',
    ownership: 'Freehold',
    status: 'Rapid Growth',
    completion: '2019 - Present'
  }
];

export const MOCK_SUB_AREAS: SubArea[] = [
  // Dubai Marina Sub-areas
  {
    id: 'marina-walk',
    name: 'Marina Walk',
    communityId: 'dubai-marina',
    avgPrice: 1732,
    growth: 26.2,
    transactions: 1245,
    image: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?auto=format&fit=crop&w=400&h=300&q=80',
    developer: 'Emaar Properties',
    status: 'Completed',
    buildings: 12,
    typicalUse: 'Residential & Retail',
    completion: '2004 - 2008'
  },
  {
    id: 'marina-promenade',
    name: 'Marina Promenade',
    communityId: 'dubai-marina',
    avgPrice: 1612,
    growth: 24.8,
    transactions: 987,
    image: 'https://images.unsplash.com/photo-1546412414-8035e1776c9a?auto=format&fit=crop&w=400&h=300&q=80',
    developer: 'Emaar Properties',
    status: 'Completed',
    buildings: 6,
    typicalUse: 'Premium Residential',
    completion: '2008'
  },
  {
    id: 'marina-gate',
    name: 'Marina Gate',
    communityId: 'dubai-marina',
    avgPrice: 1701,
    growth: 27.5,
    transactions: 1102,
    image: 'https://images.unsplash.com/photo-1526495124232-a04e18491f5a?auto=format&fit=crop&w=400&h=300&q=80',
    developer: 'Select Group',
    status: 'Completed',
    buildings: 3,
    typicalUse: 'Premium Waterfront Cluster',
    completion: '2016 - 2020'
  },
  {
    id: 'emaar-six-towers',
    name: 'Emaar Six Towers',
    communityId: 'dubai-marina',
    avgPrice: 1588,
    growth: 22.9,
    transactions: 876,
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=400&h=300&q=80',
    developer: 'Emaar Properties',
    status: 'Completed',
    buildings: 6,
    typicalUse: 'Established Residential',
    completion: '2003'
  },
  {
    id: 'al-sahab',
    name: 'Al Sahab',
    communityId: 'dubai-marina',
    avgPrice: 1543,
    growth: 21.4,
    transactions: 754,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&h=300&q=80',
    developer: 'Emaar Properties',
    status: 'Completed',
    buildings: 2,
    typicalUse: 'Residential',
    completion: '2004'
  }
];

export const MOCK_PROJECTS: Project[] = [
  // Marina Gate projects
  {
    id: 'marina-gate-1',
    name: 'Marina Gate 1',
    subAreaId: 'marina-gate',
    communityId: 'dubai-marina',
    avgPrice: 1732,
    growth: 27.5,
    transactions: 412,
    image: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?auto=format&fit=crop&w=400&h=300&q=80',
    developer: 'Emaar Properties',
    status: 'Completed',
    completionYear: 2016,
    propertyTypes: 'Residential Tower • 64 Floors',
    towers: 1,
    totalUnits: 412,
    ownership: 'Freehold',
    marketTrend: 'Strong Growth',
    availableUnits: 34,
    lastTransaction: 'AED 1.65M (2 days ago)',
    studioPrice: 1100000,
    studioGrowth: 24.3,
    oneBedPrice: 1580000,
    oneBedGrowth: 27.5,
    twoBedPrice: 2400000,
    twoBedGrowth: 26.8,
    threeBedPrice: 3800000,
    threeBedGrowth: 25.1,
    penthousePrice: 8500000,
    penthouseGrowth: 31.6
  },
  {
    id: 'marina-gate-2',
    name: 'Marina Gate 2',
    subAreaId: 'marina-gate',
    communityId: 'dubai-marina',
    avgPrice: 1684,
    growth: 25.4,
    transactions: 356,
    image: 'https://images.unsplash.com/photo-1546412414-8035e1776c9a?auto=format&fit=crop&w=400&h=300&q=80',
    developer: 'Select Group',
    status: 'Completed',
    completionYear: 2018,
    propertyTypes: 'Residential Tower • 54 Floors',
    towers: 1,
    totalUnits: 356,
    ownership: 'Freehold',
    marketTrend: 'Growth',
    availableUnits: 28,
    lastTransaction: 'AED 1.52M (4 days ago)',
    studioPrice: 1050000,
    studioGrowth: 22.1,
    oneBedPrice: 1480000,
    oneBedGrowth: 25.4,
    twoBedPrice: 2250000,
    twoBedGrowth: 24.9,
    threeBedPrice: 3500000,
    threeBedGrowth: 23.4,
    penthousePrice: 7900000,
    penthouseGrowth: 29.2
  },
  {
    id: 'marina-gate-3',
    name: 'Marina Gate 3',
    subAreaId: 'marina-gate',
    communityId: 'dubai-marina',
    avgPrice: 1688,
    growth: 26.1,
    transactions: 334,
    image: 'https://images.unsplash.com/photo-1526495124232-a04e18491f5a?auto=format&fit=crop&w=400&h=300&q=80',
    developer: 'Select Group',
    status: 'Completed',
    completionYear: 2020,
    propertyTypes: 'Residential Tower • 57 Floors',
    towers: 1,
    totalUnits: 334,
    ownership: 'Freehold',
    marketTrend: 'Strong Growth',
    availableUnits: 19,
    lastTransaction: 'AED 1.71M (1 day ago)',
    studioPrice: 1080000,
    studioGrowth: 23.5,
    oneBedPrice: 1520000,
    oneBedGrowth: 26.1,
    twoBedPrice: 2300000,
    twoBedGrowth: 25.7,
    threeBedPrice: 3650000,
    threeBedGrowth: 24.2,
    penthousePrice: 8200000,
    penthouseGrowth: 30.5
  }
];

export const MOCK_PRICE_HISTORY: Record<string, PriceHistoryPoint[]> = {
  'dubai-marina': [
    { year: 2015, price: 950, volume: 3800, label: 'Market Recovery: Post 2008 global financial recovery' },
    { year: 2016, price: 1020, volume: 4200, label: 'Steady Growth: Infrastructure development boosts demand' },
    { year: 2017, price: 1100, volume: 4400, label: 'Pre-Expo Momentum: Investor confidence strengthens' },
    { year: 2018, price: 1280, volume: 3900, label: 'Pandemic Impact: Temporary slowdown in sales activity' },
    { year: 2019, price: 1340, volume: 3500, label: 'Market Rebound: Strong recovery driven by demand' },
    { year: 2020, price: 1280, volume: 3100, label: 'Pandemic Impact: Global lockdown restricts travel & real estate visits' },
    { year: 2021, price: 1520, volume: 5100, label: 'Post-Covid Boom: Golden Visa policies & safe haven capital inflows' },
    { year: 2022, price: 1850, volume: 6800, label: 'High Demand: Record luxury villa sales and institutional funding' },
    { year: 2023, price: 2150, volume: 7400, label: 'Limited Supply: Low inventory of premium waterfront properties' },
    { year: 2024, price: 2520, volume: 7900, label: 'Record Highs: Unprecedented global capital migration and off-plan demand' },
    { year: 2025, price: 2700, volume: 8400, label: 'Sustained Growth: Continued migration of high net-worth families' }
  ],
  'business-bay': [
    { year: 2015, price: 820, volume: 2900, label: 'Commercial Expansion' },
    { year: 2016, price: 870, volume: 3100, label: 'Canal Project Commences' },
    { year: 2017, price: 910, volume: 3300, label: 'Canal Opening Highs' },
    { year: 2018, price: 1020, volume: 3000, label: 'Mid-market pressure' },
    { year: 2019, price: 1060, volume: 2700, label: 'Revitalization' },
    { year: 2020, price: 980, volume: 2500, label: 'Pandemic Slowdown' },
    { year: 2021, price: 1150, volume: 4100, label: 'Rapid Residential shift' },
    { year: 2022, price: 1320, volume: 4900, label: 'Waterfront premiums' },
    { year: 2023, price: 1480, volume: 5400, label: 'Branded Residence Launches' },
    { year: 2024, price: 1610, volume: 5700, label: 'Strong secondary activity' },
    { year: 2025, price: 1720, volume: 6200, label: 'Consolidation' }
  ]
};

export const MOCK_CYCLE_VIEWS: Record<string, CycleMetric[]> = {
  'dubai-marina': [
    {
      period: 'Annual',
      medianPrice: 1720000,
      priceSqft: 1612,
      transactions: 2842,
      volume: '4.89B',
      momentum: 'Strong',
      trendData: [
        { name: 'Jan 2025', price: 1.12, volume: 1.2 },
        { name: 'Feb 2025', price: 1.15, volume: 1.4 },
        { name: 'Mar 2025', price: 1.18, volume: 1.3 },
        { name: 'Apr 2025', price: 1.21, volume: 1.5 },
        { name: 'May 2025', price: 1.25, volume: 1.8 },
        { name: 'Jun 2025', price: 1.28, volume: 1.7 },
        { name: 'Jul 2025', price: 1.32, volume: 1.9 },
        { name: 'Aug 2025', price: 1.35, volume: 2.1 },
        { name: 'Sep 2025', price: 1.39, volume: 2.2 },
        { name: 'Oct 2025', price: 1.42, volume: 2.3 },
        { name: 'Nov 2025', price: 1.45, volume: 2.4 },
        { name: 'Dec 2025', price: 1.49, volume: 2.6 }
      ]
    },
    {
      period: 'Monthly',
      medianPrice: 1740000,
      priceSqft: 1630,
      transactions: 245,
      volume: '412M',
      momentum: 'Moderate',
      trendData: [
        { name: 'Week 1', price: 1.61, volume: 50 },
        { name: 'Week 2', price: 1.63, volume: 62 },
        { name: 'Week 3', price: 1.62, volume: 58 },
        { name: 'Week 4', price: 1.65, volume: 75 }
      ]
    },
    {
      period: 'YTD',
      medianPrice: 1710000,
      priceSqft: 1598,
      transactions: 1420,
      volume: '2.41B',
      momentum: 'Strong',
      trendData: [
        { name: 'Q1 2025', price: 1.15, volume: 380 },
        { name: 'Q2 2025', price: 1.28, volume: 520 },
        { name: 'Q3 2025', price: 1.39, volume: 680 }
      ]
    }
  ]
};

export const MOCK_METHODOLOGY_COMPARISON: Record<string, MethodologyComparison[]> = {
  'dubai-marina': [
    {
      period: 'Last 30 Days',
      previousPrice: 1520000,
      currentPrice: 1630000,
      changePercent: 7.2,
      previousPriceSqft: 1612,
      currentPriceSqft: 1728,
      previousPeriodLabel: 'Previous 30 Days (16 Jun - 15 Jul 2025)',
      currentPeriodLabel: 'Current 30 Days (16 Jul - 14 Aug 2025)',
      chartData: [
        { name: 'Jun 16', prevVal: 1.52, currVal: 1.61 },
        { name: 'Jun 20', prevVal: 1.54, currVal: 1.63 },
        { name: 'Jun 24', prevVal: 1.51, currVal: 1.62 },
        { name: 'Jun 28', prevVal: 1.53, currVal: 1.65 },
        { name: 'Jul 02', prevVal: 1.55, currVal: 1.64 },
        { name: 'Jul 06', prevVal: 1.54, currVal: 1.68 },
        { name: 'Jul 10', prevVal: 1.56, currVal: 1.71 },
        { name: 'Jul 15', prevVal: 1.58, currVal: 1.73 }
      ]
    }
  ]
};

// ==========================================
// SCALABLE SERVICES
// ==========================================

export class AnalysisContextService {
  private static STORAGE_KEY = 'acot_analysis_context';

  static getContext() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to get context', e);
    }
    return {
      community: 'dubai-marina',
      subArea: 'all',
      project: 'all'
    };
  }

  static setCommunity(communityId: string) {
    const context = this.getContext();
    context.community = communityId;
    context.subArea = 'all'; // Reset child levels
    context.project = 'all';
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(context));
    // Trigger storage event for reactivity
    window.dispatchEvent(new Event('storage'));
    return context;
  }

  static setSubArea(subAreaId: string) {
    const context = this.getContext();
    context.subArea = subAreaId;
    context.project = 'all'; // Reset project level
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(context));
    window.dispatchEvent(new Event('storage'));
    return context;
  }

  static setProject(projectId: string) {
    const context = this.getContext();
    context.project = projectId;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(context));
    window.dispatchEvent(new Event('storage'));
    return context;
  }

  static clearContext() {
    const context = { community: 'dubai-marina', subArea: 'all', project: 'all' };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(context));
    window.dispatchEvent(new Event('storage'));
    return context;
  }
}

export class MarketAnalyticsService {
  static async getCommunities(): Promise<Community[]> {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_COMMUNITIES), 100));
  }

  static async getCommunity(id: string): Promise<Community | undefined> {
    return new Promise((resolve) => {
      const community = MOCK_COMMUNITIES.find((c) => c.id === id);
      setTimeout(() => resolve(community), 50);
    });
  }

  static async getSubAreas(communityId: string): Promise<SubArea[]> {
    return new Promise((resolve) => {
      const subAreas = MOCK_SUB_AREAS.filter((s) => s.communityId === communityId);
      setTimeout(() => resolve(subAreas), 50);
    });
  }

  static async getProjects(communityId: string, subAreaId?: string): Promise<Project[]> {
    return new Promise((resolve) => {
      let projects = MOCK_PROJECTS.filter((p) => p.communityId === communityId);
      if (subAreaId && subAreaId !== 'all') {
        projects = projects.filter((p) => p.subAreaId === subAreaId);
      }
      setTimeout(() => resolve(projects), 50);
    });
  }

  static async getPriceHistory(communityId: string): Promise<PriceHistoryPoint[]> {
    return new Promise((resolve) => {
      const points = MOCK_PRICE_HISTORY[communityId] || MOCK_PRICE_HISTORY['dubai-marina'];
      setTimeout(() => resolve(points), 50);
    });
  }

  static async getCycleView(communityId: string, period: string): Promise<CycleMetric | undefined> {
    return new Promise((resolve) => {
      const metrics = MOCK_CYCLE_VIEWS[communityId] || MOCK_CYCLE_VIEWS['dubai-marina'];
      const metric = metrics?.find((m) => m.period === period) || metrics?.[0];
      setTimeout(() => resolve(metric), 50);
    });
  }

  static async getMethodologyComparison(communityId: string, period: string): Promise<MethodologyComparison | undefined> {
    return new Promise((resolve) => {
      const comps = MOCK_METHODOLOGY_COMPARISON[communityId] || MOCK_METHODOLOGY_COMPARISON['dubai-marina'];
      const comp = comps?.find((c) => c.period === period) || comps?.[0];
      setTimeout(() => resolve(comp), 50);
    });
  }

  static async getLeaderboards(category: 'Areas' | 'Developers', metric: 'Volume' | 'Value' | 'Growth'): Promise<LeaderboardItem[]> {
    return new Promise((resolve) => {
      let items: LeaderboardItem[] = [];
      if (category === 'Areas') {
        items = MOCK_COMMUNITIES.slice(0, 5).map((comm, idx) => {
          let metricStr = '';
          let val = 0;
          if (metric === 'Volume') {
            metricStr = `${comm.volume.toLocaleString()} Transactions`;
            val = comm.volume;
          } else if (metric === 'Value') {
            metricStr = `AED ${comm.value} Billion`;
            val = comm.value;
          } else {
            metricStr = `+${comm.growth}% YoY`;
            val = comm.growth;
          }
          return {
            rank: idx + 1,
            id: comm.id,
            name: comm.name,
            image: comm.image,
            metric: metricStr,
            trend: `+${(idx * 1.5 + 2).toFixed(1)}% vs previous 30 days`,
            trendDirection: 'up'
          };
        });
      } else {
        // Developers
        const developers = ['Emaar Properties', 'DAMAC Properties', 'Nakheel', 'Select Group', 'Sobha Realty'];
        const devImages = [
          'https://images.unsplash.com/photo-1546412414-8035e1776c9a?auto=format&fit=crop&w=400&h=300&q=80',
          'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?auto=format&fit=crop&w=400&h=300&q=80',
          'https://images.unsplash.com/photo-1526495124232-a04e18491f5a?auto=format&fit=crop&w=400&h=300&q=80',
          'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=400&h=300&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&h=300&q=80'
        ];
        items = developers.map((dev, idx) => {
          let metricStr = '';
          if (metric === 'Volume') {
            metricStr = `${(4500 - idx * 500).toLocaleString()} Bookings`;
          } else if (metric === 'Value') {
            metricStr = `AED ${(3.2 - idx * 0.4).toFixed(1)} Billion`;
          } else {
            metricStr = `+${(18.5 - idx * 2.1).toFixed(1)}% YoY`;
          }
          return {
            rank: idx + 1,
            id: `dev-${idx}`,
            name: dev,
            image: devImages[idx],
            metric: metricStr,
            trend: `+${(1.2 + idx * 0.4).toFixed(1)}% average premium`,
            trendDirection: 'up'
          };
        });
      }
      setTimeout(() => resolve(items), 50);
    });
  }
}

// ==========================================
// PREPARE FUTURE SERVICES PLACEHOLDERS
// ==========================================

export class TransactionService {
  static async getTransactions(params: any): Promise<any> {
    console.log('TransactionService.getTransactions called with params', params);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 'success',
          data: [
            { id: 'tx-001', type: 'Sales', price: 1650000, date: '2026-07-12' }
          ]
        });
      }, 100);
    });
  }
}

export class RentalService {
  static async getRentals(params: any): Promise<any> {
    console.log('RentalService.getRentals called with params', params);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 'success',
          data: [
            { id: 'rt-001', rent: 120000, frequency: 'Annual', occupancy: '92%' }
          ]
        });
      }, 100);
    });
  }
}

export class AIService {
  static async askAI(context: any): Promise<any> {
    console.log('AIService.askAI prepared with context', context);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 'success',
          reply: `Prepared AI insights for ${context.community} subArea ${context.subArea} page ${context.page}`
        });
      }, 100);
    });
  }
}

export class ReportService {
  static async generateReport(payload: any): Promise<any> {
    console.log('ReportService.generateReport prepared payload', payload);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 'success',
          reportId: 'rpt-99827',
          downloadUrl: '#'
        });
      }, 100);
    });
  }
}

export class InvestorToolsService {
  static async calculateROI(inputs: any): Promise<any> {
    console.log('InvestorToolsService.calculateROI triggered', inputs);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          roi: 8.4,
          cashFlow: 12400
        });
      }, 100);
    });
  }
}
