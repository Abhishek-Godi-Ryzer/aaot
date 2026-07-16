import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { useAuth } from './AuthContext';
import { useAnalysisContext } from './AnalysisContext';
import { AgentService, AgentVerification, CompanyBranding } from '../services/agentService';
import { ProfessionalAccessService } from '../services/professionalAccessService';
import { ProfessionalSessionManager, ProfessionalSessionState } from '../services/professionalIntegrationService';

export interface ProfessionalContextType {
  verification: AgentVerification | null;
  branding: CompanyBranding | null;
  hasProfAccess: boolean;
  currentCommunity: string;
  currentProject: string;
  currentProperty: string;
  conversationContext: any;
  currentReport: any;
  currentProposal: any;
  setVerification: (v: AgentVerification | null) => void;
  setBranding: (b: CompanyBranding | null) => void;
  setCurrentCommunity: (commId: string) => void;
  setCurrentProject: (projId: string) => void;
  setCurrentProperty: (propId: string) => void;
  setConversationContext: (ctx: any) => void;
  setCurrentReport: (rpt: any) => void;
  setCurrentProposal: (prop: any) => void;
  syncSession: () => void;
}

const ProfessionalContext = createContext<ProfessionalContextType | undefined>(undefined);

export const ProfessionalContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { communityId, projectId, setCommunityId, setProjectId } = useAnalysisContext();

  const [verification, setVerificationState] = useState<AgentVerification | null>(() => {
    return AgentService.getVerificationStatus();
  });

  const [branding, setBrandingState] = useState<CompanyBranding | null>(() => {
    return AgentService.getBranding();
  });

  const [currentCommunity, setCurrentCommunityState] = useState<string>(communityId || 'dubai-marina');
  const [currentProject, setCurrentProjectState] = useState<string>(projectId || 'marina-gate-1');
  const [currentProperty, setCurrentPropertyState] = useState<string>('all');
  const [conversationContext, setConversationContextState] = useState<any>(null);
  const [currentReport, setCurrentReportState] = useState<any>(null);
  const [currentProposal, setCurrentProposalState] = useState<any>(null);

  const hasProfAccess = ProfessionalAccessService.hasProfessionalAccess(user, verification);

  // Load from persisted session on mount
  useEffect(() => {
    const saved = ProfessionalSessionManager.loadSession();
    if (saved) {
      if (saved.verification) setVerificationState(saved.verification);
      if (saved.branding) setBrandingState(saved.branding);
      if (saved.currentCommunity) {
        setCurrentCommunityState(saved.currentCommunity);
        setCommunityId(saved.currentCommunity);
      }
      if (saved.currentProject) {
        setCurrentProjectState(saved.currentProject);
        setProjectId(saved.currentProject);
      }
    }
  }, []);

  // Synchronize from AnalysisContext
  useEffect(() => {
    if (communityId) {
      setCurrentCommunityState(communityId);
    }
  }, [communityId]);

  useEffect(() => {
    if (projectId) {
      setCurrentProjectState(projectId);
    }
  }, [projectId]);

  const syncSession = () => {
    const state: ProfessionalSessionState = {
      verification,
      branding,
      currentCommunity,
      currentProject,
      professionalAccess: hasProfAccess,
      timestamp: new Date().toISOString()
    };
    ProfessionalSessionManager.saveSession(state);
  };

  // Auto-persist session changes
  useEffect(() => {
    syncSession();
  }, [verification, branding, currentCommunity, currentProject, hasProfAccess]);

  const setVerification = (v: AgentVerification | null) => {
    setVerificationState(v);
    if (v) {
      localStorage.setItem('acot_agent_verification_info', JSON.stringify(v));
      window.dispatchEvent(new Event('acot_agent_verification_updated'));
    }
  };

  const setBranding = (b: CompanyBranding | null) => {
    setBrandingState(b);
    if (b) {
      AgentService.saveBranding(b);
    }
  };

  const setCurrentCommunity = (commId: string) => {
    setCurrentCommunityState(commId);
    setCommunityId(commId);
  };

  const setCurrentProject = (projId: string) => {
    setCurrentProjectState(projId);
    setProjectId(projId);
  };

  const setCurrentProperty = (propId: string) => {
    setCurrentPropertyState(propId);
  };

  const setConversationContext = (ctx: any) => {
    setConversationContextState(ctx);
  };

  const setCurrentReport = (rpt: any) => {
    setCurrentReportState(rpt);
  };

  const setCurrentProposal = (prop: any) => {
    setCurrentProposalState(prop);
  };

  return (
    <ProfessionalContext.Provider
      value={{
        verification,
        branding,
        hasProfAccess,
        currentCommunity,
        currentProject,
        currentProperty,
        conversationContext,
        currentReport,
        currentProposal,
        setVerification,
        setBranding,
        setCurrentCommunity,
        setCurrentProject,
        setCurrentProperty,
        setConversationContext,
        setCurrentReport,
        setCurrentProposal,
        syncSession
      }}
    >
      {children}
    </ProfessionalContext.Provider>
  );
};

export const useProfessionalContext = () => {
  const context = useContext(ProfessionalContext);
  if (context === undefined) {
    throw new Error('useProfessionalContext must be used within a ProfessionalContextProvider');
  }
  return context;
};
