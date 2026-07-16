// Maps & Geospatial Backend Preparation Services
// Implements MapService and CommunityService returning mock JSON data.

export interface MapCommunityBoundary {
  id: string;
  name: string;
  center: [number, number];
  polygon: [number, number][];
}

export interface MapCommunityMetrics {
  id: string;
  name: string;
  priceGrowth: number;       // YoY %
  transactionVolume: number; // Count
  medianPrice: number;       // AED/sqft
  rentalYield: number;       // %
  marketActivity: number;    // Score 0-100 or occupancy
}

export interface MapCommunitySummary {
  id: string;
  name: string;
  medianPrice: number;
  priceGrowth: number;
  transactionVolume: number;
  rentalYield: number;
  image: string;
  description: string;
  keyMetric: string;
  developer: string;
  status: string;
}

// Pre-defined centers for Dubai real estate master developments
export const COMMUNITY_CENTERS: Record<string, { center: [number, number]; radiusLat: number; radiusLng: number }> = {
  'dubai-marina': { center: [25.0784, 55.1314], radiusLat: 0.010, radiusLng: 0.012 },
  'jumeirah-lakes-towers': { center: [25.0712, 55.1432], radiusLat: 0.009, radiusLng: 0.010 },
  'palm-jumeirah': { center: [25.1124, 55.1390], radiusLat: 0.018, radiusLng: 0.018 },
  'business-bay': { center: [25.1843, 55.2733], radiusLat: 0.011, radiusLng: 0.013 },
  'downtown-dubai': { center: [25.1972, 55.2744], radiusLat: 0.009, radiusLng: 0.010 },
  'jumeirah-village-circle': { center: [25.0682, 55.2064], radiusLat: 0.012, radiusLng: 0.012 },
  'dubai-hills-estate': { center: [25.1052, 55.2680], radiusLat: 0.013, radiusLng: 0.014 },
  'dubai-creek-harbour': { center: [25.1994, 55.3402], radiusLat: 0.011, radiusLng: 0.012 },
  'jumeirah': { center: [25.2003, 55.2443], radiusLat: 0.013, radiusLng: 0.015 },
  'al-barsha': { center: [25.1134, 55.2132], radiusLat: 0.011, radiusLng: 0.012 },
  'al-sufouh': { center: [25.1102, 55.1812], radiusLat: 0.010, radiusLng: 0.011 },
  'arabian-ranches': { center: [25.0504, 55.2813], radiusLat: 0.014, radiusLng: 0.014 },
  'meydan': { center: [25.1581, 55.3005], radiusLat: 0.012, radiusLng: 0.013 },
  'damac-hills': { center: [25.0180, 55.2482], radiusLat: 0.013, radiusLng: 0.013 },
};

// Generates an organic looking polygon boundary around a center point
function generatePolygon(center: [number, number], rLat: number, rLng: number, vertices = 6, seed = 1): [number, number][] {
  const coords: [number, number][] = [];
  for (let i = 0; i < vertices; i++) {
    const angle = (i / vertices) * 2 * Math.PI;
    // Standardized stable noise based on vertex index and seed to keep it consistent
    const noise = 0.85 + Math.abs(Math.sin(i * 1.7 + seed)) * 0.25;
    const lat = center[0] + rLat * Math.cos(angle) * noise;
    const lng = center[1] + rLng * Math.sin(angle) * noise;
    coords.push([lat, lng]);
  }
  // Close the polygon
  coords.push(coords[0]);
  return coords;
}

export const MapService = {
  getCommunityBoundaries(): Promise<MapCommunityBoundary[]> {
    return new Promise((resolve) => {
      const boundaries = Object.entries(COMMUNITY_CENTERS).map(([id, meta], idx) => {
        const name = id
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
          .replace('Jumeirah Lakes Towers', 'Jumeirah Lake Towers (JLT)');
        
        return {
          id,
          name,
          center: meta.center,
          polygon: generatePolygon(meta.center, meta.radiusLat, meta.radiusLng, 7, idx)
        };
      });
      resolve(boundaries);
    });
  },

  getCommunityMetrics(): Promise<MapCommunityMetrics[]> {
    return new Promise((resolve) => {
      const metrics: MapCommunityMetrics[] = [
        { id: 'dubai-marina', name: 'Dubai Marina', priceGrowth: 12.4, transactionVolume: 2341, medianPrice: 2102, rentalYield: 7.2, marketActivity: 92 },
        { id: 'jumeirah-lakes-towers', name: 'Jumeirah Lake Towers (JLT)', priceGrowth: 9.1, transactionVolume: 1890, medianPrice: 1138, rentalYield: 7.5, marketActivity: 90 },
        { id: 'palm-jumeirah', name: 'Palm Jumeirah', priceGrowth: 8.7, transactionVolume: 1654, medianPrice: 2101, rentalYield: 6.1, marketActivity: 96 },
        { id: 'business-bay', name: 'Business Bay', priceGrowth: 14.6, transactionVolume: 3120, medianPrice: 1512, rentalYield: 6.8, marketActivity: 88 },
        { id: 'downtown-dubai', name: 'Downtown Dubai', priceGrowth: 10.2, transactionVolume: 2872, medianPrice: 2349, rentalYield: 5.9, marketActivity: 94 },
        { id: 'jumeirah-village-circle', name: 'JVC (Jumeirah Village Circle)', priceGrowth: 19.8, transactionVolume: 6230, medianPrice: 1067, rentalYield: 8.4, marketActivity: 91 },
        { id: 'dubai-hills-estate', name: 'Dubai Hills Estate', priceGrowth: 4.9, transactionVolume: 5410, medianPrice: 1280, rentalYield: 6.5, marketActivity: 93 },
        { id: 'dubai-creek-harbour', name: 'Dubai Creek Harbour', priceGrowth: 7.8, transactionVolume: 2120, medianPrice: 1599, rentalYield: 6.3, marketActivity: 89 },
        { id: 'jumeirah', name: 'Jumeirah', priceGrowth: 3.2, transactionVolume: 1102, medianPrice: 1850, rentalYield: 5.4, marketActivity: 82 },
        { id: 'al-barsha', name: 'Al Barsha', priceGrowth: -1.3, transactionVolume: 1850, medianPrice: 1250, rentalYield: 6.9, marketActivity: 85 },
        { id: 'al-sufouh', name: 'Al Sufouh', priceGrowth: 2.1, transactionVolume: 950, medianPrice: 1600, rentalYield: 6.0, marketActivity: 80 },
        { id: 'arabian-ranches', name: 'Arabian Ranches', priceGrowth: 1.6, transactionVolume: 1400, medianPrice: 1450, rentalYield: 5.8, marketActivity: 84 },
        { id: 'meydan', name: 'Meydan', priceGrowth: -3.6, transactionVolume: 2100, medianPrice: 1400, rentalYield: 6.2, marketActivity: 86 },
        { id: 'damac-hills', name: 'DAMAC Hills', priceGrowth: -2.4, transactionVolume: 1950, medianPrice: 1100, rentalYield: 7.0, marketActivity: 87 }
      ];
      resolve(metrics);
    });
  },

  getCommunitySummary(communityId: string): Promise<MapCommunitySummary | null> {
    return new Promise(async (resolve) => {
      const metricsList = await this.getCommunityMetrics();
      const metrics = metricsList.find(m => m.id === communityId);
      
      if (!metrics) {
        resolve(null);
        return;
      }

      // Default mock images & descriptions
      const summaries: Record<string, { image: string; description: string; keyMetric: string; developer: string; status: string }> = {
        'dubai-marina': {
          image: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?auto=format&fit=crop&w=600&h=400&q=80',
          description: 'A world-famous luxury waterfront master development known for its iconic luxury residential skyscrapers, upscale dining, and leisure attractions along the marina canal.',
          keyMetric: '92% Occupancy Rate',
          developer: 'Emaar Properties, Select Group',
          status: 'Established Community'
        },
        'jumeirah-lakes-towers': {
          image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&h=400&q=80',
          description: 'A dense high-rise district structured around artificial lakes, offering excellent mid-to-high market residential apartments and retail spaces.',
          keyMetric: '90% Occupancy Rate',
          developer: 'DMCC & Various Developers',
          status: 'Established Community'
        },
        'palm-jumeirah': {
          image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=600&h=400&q=80',
          description: 'The spectacular palm-shaped island offering prime beachfront villas, high-end penthouses, super-luxury beach clubs, and ultra-premium resort amenities.',
          keyMetric: '96% Occupancy Rate',
          developer: 'Nakheel',
          status: 'Ultra Premium'
        },
        'business-bay': {
          image: 'https://images.unsplash.com/photo-1546412414-8035e1776c9a?auto=format&fit=crop&w=600&h=400&q=80',
          description: 'The contemporary commercial and residential hub of Dubai, nestled alongside the Dubai Canal, featuring stylish high-rises and seamless connectivity.',
          keyMetric: '88% Occupancy Rate',
          developer: 'Dubai Properties, DAMAC',
          status: 'High Growth Business Hub'
        },
        'downtown-dubai': {
          image: 'https://images.unsplash.com/photo-1526495124232-a04e18491f5a?auto=format&fit=crop&w=600&h=400&q=80',
          description: 'The ultra-luxury heart of the city, surrounding the world\'s tallest tower (Burj Khalifa), the Dubai Mall, and Dubai Opera, yielding exceptional capital growth.',
          keyMetric: '94% Occupancy Rate',
          developer: 'Emaar Properties',
          status: 'Prime Established'
        },
        'jumeirah-village-circle': {
          image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&h=400&q=80',
          description: 'A quiet, rapidly appreciating suburban family master-development offering modern housing, lush parks, and incredibly strong rental yields.',
          keyMetric: '91% Occupancy Rate',
          developer: 'Nakheel & Binghatti',
          status: 'Active Expansion'
        },
        'dubai-hills-estate': {
          image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=600&h=400&q=80',
          description: 'A premium green master-development centered around an 18-hole championship golf course, hosting beautiful parks, villas, and modern apartments.',
          keyMetric: '93% Occupancy Rate',
          developer: 'Emaar Properties',
          status: 'Established Residential'
        },
        'dubai-creek-harbour': {
          image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&h=400&q=80',
          description: 'A futuristic luxury waterfront community along the historic Dubai Creek, offering outstanding views of the city skyline and smart infrastructure.',
          keyMetric: '89% Occupancy Rate',
          developer: 'Emaar Properties',
          status: 'Rapid Growth Waterfront'
        }
      };

      const defaultMeta = {
        image: 'https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?auto=format&fit=crop&w=600&h=400&q=80',
        description: 'An elite residential development in Dubai, providing high class infrastructure, easy commute options, and a high-yielding environment.',
        keyMetric: '87% Occupancy Rate',
        developer: 'Nakheel / Various Developers',
        status: 'Active Community'
      };

      const meta = summaries[communityId] || defaultMeta;

      resolve({
        id: communityId,
        name: metrics.name,
        medianPrice: metrics.medianPrice,
        priceGrowth: metrics.priceGrowth,
        transactionVolume: metrics.transactionVolume,
        rentalYield: metrics.rentalYield,
        ...meta
      });
    });
  },

  centerMap(map: any, center: [number, number], zoom = 12) {
    if (map && typeof map.setView === 'function') {
      map.setView(center, zoom);
    }
  },

  zoomToCommunity(map: any, communityId: string) {
    const meta = COMMUNITY_CENTERS[communityId];
    if (meta && map) {
      this.centerMap(map, meta.center, 13);
    }
  }
};

export const CommunityService = {
  getCommunity(id: string): Promise<any> {
    return MapService.getCommunitySummary(id);
  },
  getProjects(communityId: string): Promise<any[]> {
    return new Promise((resolve) => {
      resolve([
        { id: `${communityId}-proj-1`, name: 'Signature Tower A', developer: 'Premium Devs' },
        { id: `${communityId}-proj-2`, name: 'The Crest Residence', developer: 'Premium Devs' },
        { id: `${communityId}-proj-3`, name: 'Lagoon Heights', developer: 'Signature Holdings' }
      ]);
    });
  },
  getSubAreas(communityId: string): Promise<any[]> {
    return new Promise((resolve) => {
      resolve([
        { id: `${communityId}-sub-1`, name: 'Waterfront Promenade' },
        { id: `${communityId}-sub-2`, name: 'Marina East' },
        { id: `${communityId}-sub-3`, name: 'Central District' }
      ]);
    });
  }
};

export const AnalysisContextService = {
  setCommunity(id: string) {
    localStorage.setItem('acot_community_id', id);
    localStorage.setItem('acot_subarea_id', 'all');
    localStorage.setItem('acot_project_id', 'all');
    window.dispatchEvent(new Event('storage'));
  },
  setSubArea(id: string) {
    localStorage.setItem('acot_subarea_id', id);
    localStorage.setItem('acot_project_id', 'all');
    window.dispatchEvent(new Event('storage'));
  },
  setProject(id: string) {
    localStorage.setItem('acot_project_id', id);
    window.dispatchEvent(new Event('storage'));
  },
  clearContext() {
    localStorage.removeItem('acot_community_id');
    localStorage.removeItem('acot_subarea_id');
    localStorage.removeItem('acot_project_id');
    window.dispatchEvent(new Event('storage'));
  }
};
