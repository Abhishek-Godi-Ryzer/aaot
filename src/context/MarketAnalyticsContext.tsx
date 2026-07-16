import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAnalysisContext } from './AnalysisContext';
import {
  MarketAnalyticsService,
  Community,
  SubArea,
  Project
} from '../services/marketAnalyticsService';

interface MarketAnalyticsContextType {
  communities: Community[];
  subAreas: SubArea[];
  projects: Project[];
  selectedCommunity: Community | null;
  selectedSubArea: SubArea | null;
  selectedProject: Project | null;
  loading: boolean;
  refreshData: () => Promise<void>;
}

const MarketAnalyticsContext = createContext<MarketAnalyticsContextType | undefined>(undefined);

export function MarketAnalyticsProvider({ children }: { children: ReactNode }) {
  const { communityId, subAreaId, projectId } = useAnalysisContext();

  const [communities, setCommunities] = useState<Community[]>([]);
  const [subAreas, setSubAreas] = useState<SubArea[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const comms = await MarketAnalyticsService.getCommunities();
      setCommunities(comms);

      if (communityId) {
        const subs = await MarketAnalyticsService.getSubAreas(communityId);
        setSubAreas(subs);

        const projs = await MarketAnalyticsService.getProjects(communityId, 'all');
        setProjects(projs);
      } else {
        setSubAreas([]);
        setProjects([]);
      }
    } catch (e) {
      console.error('Failed to fetch market analytics data', e);
    } finally {
      setLoading(false);
    }
  }, [communityId]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const selectedCommunity = communities.find(c => c.id === communityId) || null;
  const selectedSubArea = subAreas.find(s => s.id === subAreaId) || null;
  const selectedProject = projects.find(p => p.id === projectId) || null;

  return (
    <MarketAnalyticsContext.Provider
      value={{
        communities,
        subAreas,
        projects,
        selectedCommunity,
        selectedSubArea,
        selectedProject,
        loading,
        refreshData: fetchAllData
      }}
    >
      {children}
    </MarketAnalyticsContext.Provider>
  );
}

export function useMarketAnalytics() {
  const context = useContext(MarketAnalyticsContext);
  if (context === undefined) {
    throw new Error('useMarketAnalytics must be used within a MarketAnalyticsProvider');
  }
  return context;
}
