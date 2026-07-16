import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AnalysisContextService } from '../services/marketAnalyticsService';

interface AnalysisContextType {
  communityId: string;
  subAreaId: string;
  projectId: string;
  setCommunityId: (id: string) => void;
  setSubAreaId: (id: string) => void;
  setProjectId: (id: string) => void;
  clearContext: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisContextProvider({ children }: { children: ReactNode }) {
  const [context, setContextState] = useState(() => AnalysisContextService.getContext());

  useEffect(() => {
    const handleStorageChange = () => {
      setContextState(AnalysisContextService.getContext());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const setCommunityId = (id: string) => {
    const updated = AnalysisContextService.setCommunity(id);
    setContextState(updated);
  };

  const setSubAreaId = (id: string) => {
    const updated = AnalysisContextService.setSubArea(id);
    setContextState(updated);
  };

  const setProjectId = (id: string) => {
    const updated = AnalysisContextService.setProject(id);
    setContextState(updated);
  };

  const clearContext = () => {
    const updated = AnalysisContextService.clearContext();
    setContextState(updated);
  };

  return (
    <AnalysisContext.Provider
      value={{
        communityId: context.community,
        subAreaId: context.subArea,
        projectId: context.project,
        setCommunityId,
        setSubAreaId,
        setProjectId,
        clearContext
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysisContext() {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysisContext must be used within an AnalysisContextProvider');
  }
  return context;
}
