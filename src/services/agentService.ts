import { User } from '../types';

export type VerificationStatus = 'NOT_SUBMITTED' | 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';

export interface AgentVerification {
  status: VerificationStatus;
  fullName: string;
  companyName: string;
  designation: string;
  brokerageName: string;
  licenseNumber: string;
  expiryDate: string;
  certificateName?: string;
  emiratesIdName?: string;
  submittedAt?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  professionalAccess?: boolean;
  verifiedAgent?: boolean;
}

export interface CompanyInformation {
  companyLogo: string; // Base64 or URL
  companyName: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
}

export interface AgentInformation {
  agentPhoto: string; // Base64 or URL
  agentName: string;
  designation: string;
  reraNumber: string;
  mobile: string;
  email: string;
}

export interface ReportBrandingSettings {
  showCompanyLogo: boolean;
  showAgentPhoto: boolean;
  showAgentContactDetails: boolean;
  showReraNumber: boolean;
  showCompanyFooter: boolean;
  poweredByAcot: boolean;
}

export interface CompanyBranding {
  // Legacy root fields for backward compatibility
  companyName: string;
  companyLogo: string;
  primaryColor: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  digitalSignature: string;

  // New nested models matching the spec
  companyInfo: CompanyInformation;
  agentInfo: AgentInformation;
  reportSettings: ReportBrandingSettings;
  createdAt: string;
  updatedAt: string;
  verifiedAgentId: string;
  brokerageId: string;
}

const DEFAULT_BRANDING: CompanyBranding = {
  // Legacy fields
  companyName: 'ABC Realty',
  companyLogo: '',
  primaryColor: '#4f46e5', // Indigo accent
  address: 'Office 1203, Marina Plaza, Dubai Marina, Dubai, UAE',
  phone: '+971 4 123 4567',
  email: 'info@abcrealty.ae',
  website: 'www.abcrealty.ae',
  digitalSignature: 'Michael Chang',

  // Nested models
  companyInfo: {
    companyLogo: '',
    companyName: 'ABC Realty',
    address: 'Office 1203, Marina Plaza, Dubai Marina, Dubai, UAE',
    phone: '+971 4 123 4567',
    email: 'info@abcrealty.ae',
    website: 'www.abcrealty.ae'
  },
  agentInfo: {
    agentPhoto: '',
    agentName: 'Michael Chang',
    designation: 'Senior Property Consultant',
    reraNumber: 'CN-123456',
    mobile: '+971 50 123 4567',
    email: 'michael.chang@abcrealty.ae'
  },
  reportSettings: {
    showCompanyLogo: true,
    showAgentPhoto: true,
    showAgentContactDetails: true,
    showReraNumber: true,
    showCompanyFooter: true,
    poweredByAcot: true
  },
  createdAt: '2026-01-12T08:00:00.000Z',
  updatedAt: '2026-07-15T11:21:32.000Z',
  verifiedAgentId: 'agent_michael_chang',
  brokerageId: 'brokerage_abc_realty'
};

const DEFAULT_VERIFICATION: AgentVerification = {
  status: 'VERIFIED',
  fullName: 'Ahmed Mohammed',
  companyName: 'ABC Realty',
  designation: 'Senior Investment Director',
  brokerageName: 'ABC Realty Dubai',
  licenseNumber: '123456',
  expiryDate: '2027-03-28',
  submittedAt: '2025-01-12',
  verifiedAt: '2025-01-12',
  professionalAccess: true,
  verifiedAgent: true
};

export class AgentService {
  private static STORAGE_KEY_VERIFICATION = 'acot_agent_verification_info';
  private static STORAGE_KEY_BRANDING = 'acot_agent_branding_info';

  // Configurable DEMO_MODE flag
  static getDemoMode(): boolean {
    const envVal = (import.meta as any).env?.VITE_DEMO_MODE;
    if (envVal !== undefined) {
      return envVal === 'true';
    }
    const stored = localStorage.getItem('acot_demo_mode');
    return stored !== 'false'; // defaults to true
  }

  static setDemoMode(val: boolean) {
    localStorage.setItem('acot_demo_mode', val ? 'true' : 'false');
    window.dispatchEvent(new Event('acot_demo_mode_changed'));
  }

  static getAgentProfile(user: User | null) {
    const verification = this.getVerificationStatus();
    return {
      fullName: verification.fullName || user?.name || 'Ahmed Mohammed',
      companyName: verification.companyName || user?.company || 'ABC Realty',
      designation: verification.designation || 'Premium Property Consultant',
      licenseNumber: verification.licenseNumber || '123456',
      status: verification.status,
      membershipSince: '12 Jan 2025',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80'
    };
  }

  static getDashboard() {
    return {
      kpis: {
        reportsGenerated: 18,
        savedCommunities: 32,
        clientReportsShared: 14,
        propertyLevelAccess: this.getVerificationStatus().status === 'VERIFIED' ? 'Unlocked' : 'Locked'
      },
      recentActivity: [
        {
          id: 'act-1',
          type: 'report',
          title: 'Marina Gate 1 – Investment Proposal',
          meta: 'Created for: John Smith',
          date: '16 Apr 2026',
          category: 'Executive'
        },
        {
          id: 'act-2',
          type: 'report',
          title: 'Dubai Hills Estate – Market Report',
          meta: 'Created for: Sarah Johnson',
          date: '14 Apr 2026',
          category: 'Market'
        },
        {
          id: 'act-3',
          type: 'report',
          title: 'Downtown Dubai – Comparative Analysis',
          meta: 'Created for: Client Presentation',
          date: '12 Apr 2026',
          category: 'Custom'
        },
        {
          id: 'act-4',
          type: 'report',
          title: 'Palm Jumeirah – Rental Overview',
          meta: 'Created for: Michael Brown',
          date: '10 Apr 2026',
          category: 'Rental'
        }
      ],
      aiInsights: [
        {
          id: 'insight-1',
          community: 'Dubai Marina',
          text: 'Dubai Marina average price increased by 2.4% this month.',
          detail: 'Transaction velocity is up 12% in central clusters.'
        },
        {
          id: 'insight-2',
          community: 'Business Bay',
          text: 'Business Bay rental demand is higher than last month.',
          detail: 'Corporate lease renewals surged by 15.4% YoY.'
        },
        {
          id: 'insight-3',
          community: 'Downtown Dubai',
          text: 'Downtown Dubai showing strong capital growth.',
          detail: 'High net worth buyer interest remains exceptionally resilient.'
        }
      ]
    };
  }

  static getVerificationStatus(): AgentVerification {
    const isDemo = this.getDemoMode();
    const data = localStorage.getItem(this.STORAGE_KEY_VERIFICATION);
    
    if (!data) {
      if (isDemo) {
        localStorage.setItem(this.STORAGE_KEY_VERIFICATION, JSON.stringify(DEFAULT_VERIFICATION));
        return DEFAULT_VERIFICATION;
      } else {
        const empty: AgentVerification = {
          status: 'NOT_SUBMITTED',
          fullName: '',
          companyName: '',
          designation: '',
          brokerageName: '',
          licenseNumber: '',
          expiryDate: ''
        };
        return empty;
      }
    }
    
    const parsed = JSON.parse(data) as AgentVerification;
    return parsed;
  }

  static submitVerification(info: Omit<AgentVerification, 'status' | 'submittedAt'>): AgentVerification {
    const updated: AgentVerification = {
      ...info,
      status: 'PENDING',
      submittedAt: new Date().toISOString().split('T')[0]
    };
    localStorage.setItem(this.STORAGE_KEY_VERIFICATION, JSON.stringify(updated));
    window.dispatchEvent(new Event('acot_agent_verification_updated'));
    return updated;
  }

  static updateVerificationStatusDirectly(status: VerificationStatus, extraFields?: Partial<AgentVerification>): AgentVerification {
    const current = this.getVerificationStatus();
    const updated: AgentVerification = {
      ...current,
      ...extraFields,
      status,
      ...(status === 'VERIFIED' ? { verifiedAt: new Date().toISOString().split('T')[0] } : {})
    };
    localStorage.setItem(this.STORAGE_KEY_VERIFICATION, JSON.stringify(updated));
    window.dispatchEvent(new Event('acot_agent_verification_updated'));
    return updated;
  }

  static renewVerification(licenseNumber: string, expiryDate: string): AgentVerification {
    return this.submitVerification({
      fullName: this.getVerificationStatus().fullName || 'Ahmed Mohammed',
      companyName: this.getVerificationStatus().companyName || 'ABC Realty',
      designation: this.getVerificationStatus().designation || 'Senior Investment Director',
      brokerageName: this.getVerificationStatus().brokerageName || 'ABC Realty Dubai',
      licenseNumber,
      expiryDate
    });
  }

  static getBranding(): CompanyBranding {
    const data = localStorage.getItem(this.STORAGE_KEY_BRANDING);
    if (!data) {
      localStorage.setItem(this.STORAGE_KEY_BRANDING, JSON.stringify(DEFAULT_BRANDING));
      return DEFAULT_BRANDING;
    }
    // Deep merge to ensure default nested values exist if loading old data formats
    try {
      const parsed = JSON.parse(data);
      if (!parsed.companyInfo || !parsed.agentInfo || !parsed.reportSettings) {
        const merged = {
          ...DEFAULT_BRANDING,
          ...parsed,
          companyInfo: { ...DEFAULT_BRANDING.companyInfo, ...(parsed.companyInfo || {}) },
          agentInfo: { ...DEFAULT_BRANDING.agentInfo, ...(parsed.agentInfo || {}) },
          reportSettings: { ...DEFAULT_BRANDING.reportSettings, ...(parsed.reportSettings || {}) }
        };
        return merged;
      }
      return parsed;
    } catch {
      return DEFAULT_BRANDING;
    }
  }

  static saveBranding(branding: CompanyBranding): CompanyBranding {
    localStorage.setItem(this.STORAGE_KEY_BRANDING, JSON.stringify(branding));
    window.dispatchEvent(new Event('acot_agent_branding_updated'));
    return branding;
  }

  // CRUD Simulated HTTP REST API Endpoints
  static async getBrandingAPI(): Promise<{ status: number; data: CompanyBranding }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = this.getBranding();
        resolve({ status: 200, data });
      }, 200); // Latency simulation
    });
  }

  static async postBrandingAPI(branding: CompanyBranding): Promise<{ status: number; data: CompanyBranding; message: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const saved = this.saveBranding(branding);
        resolve({ status: 201, data: saved, message: 'Branding created successfully' });
      }, 200);
    });
  }

  static async putBrandingAPI(branding: CompanyBranding): Promise<{ status: number; data: CompanyBranding; message: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const saved = this.saveBranding(branding);
        resolve({ status: 200, data: saved, message: 'Branding updated successfully' });
      }, 200);
    });
  }

  static async deleteBrandingAPI(): Promise<{ status: number; message: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem(this.STORAGE_KEY_BRANDING);
        window.dispatchEvent(new Event('acot_agent_branding_updated'));
        resolve({ status: 200, message: 'Branding configuration reset successfully' });
      }, 200);
    });
  }

  static checkPermissions(status: VerificationStatus, permission: string): boolean {
    // Investor has different permissions, handled by workspace
    // Pending agents cannot access: property_level_data, white_label_reports
    // Verified agents can access everything
    if (status === 'VERIFIED') return true;
    
    if (permission === 'company_branding' || permission === 'rera_verification') {
      return status === 'PENDING' || status === 'REJECTED' || status === 'EXPIRED' || status === 'NOT_SUBMITTED';
    }
    
    if (permission === 'property_level_data' || permission === 'white_label_reports') {
      return false;
    }
    
    // Shared modules like maps, rental, market are always available to all agents
    return true;
  }
}
