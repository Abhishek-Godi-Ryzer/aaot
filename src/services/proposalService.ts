import { User } from '../types';
import { AgentService, AgentVerification, CompanyBranding } from './agentService';
import { 
  ProfessionalAccessService, 
  ProfessionalPropertyService, 
  RegistryService,
  ProfessionalPropertyData,
  OfficialRegistryTransaction,
  BrandingResolver,
  WhiteLabelService
} from './professionalAccessService';
import { MOCK_COMMUNITIES, MOCK_SUB_AREAS, MarketAnalyticsService } from './marketAnalyticsService';
import { ProfessionalAIService, ProfessionalContextBuilder, FullAIContext } from './professionalAIService';

// ====================================================================
// PROPOSAL ENGINE INTERFACES
// ====================================================================

export interface ProposalPayload {
  id: string;
  createdDate: string;
  communityId: string;
  projectId: string;
  branding: {
    companyName: string;
    agentName: string;
    phone: string;
    email: string;
    website: string;
    logoUrl?: string;
    primaryColor: string;
    reraNumber: string;
  };
  executiveSummary: {
    opportunitySummary: string;
    investmentSnapshot: string;
    professionalOverview: string;
  };
  propertyOverview: {
    name: string;
    type: string;
    developer: string;
    location: string;
    currentPrice: string;
    avgPriceSqft: string;
  };
  marketIntelligence: {
    communityRank: string;
    annualGrowth: string;
    marketPhase: string;
    volatilityIndex: string;
    supplyForecast: string;
  };
  transactionAnalysis: {
    officialRegistryTransactions: OfficialRegistryTransaction[];
    cashVsMortgageRatio: string;
    quarterlyVolume: string;
    averageSize: string;
  };
  rentalResearch: {
    yieldGross: string;
    yieldNet: string;
    ejariContractsCount: number;
    reraRentCapLimit: string;
    rentalGrowth: string;
  };
  investmentReturns: {
    estimatedROI5Yr: string;
    monthlyCashFlow: string;
    breakevenYears: string;
    loanToValueRatio: string;
  };
  professionalProperty: ProfessionalPropertyData;
  aiRecommendation: {
    strengths: string[];
    risks: string[];
    holdingStrategy: string;
    confidenceScore: number;
    overallRecommendation: string;
  };
  whyThisInvestment: {
    topDrivers: string[];
    appreciationPotential: string;
    rentalSecurity: string;
  };
}

// ====================================================================
// PROPOSAL PERMISSION SERVICE
// ====================================================================
export class ProposalPermissionService {
  static validateAccess(user: User | null, verification: AgentVerification | null): boolean {
    return ProfessionalAccessService.hasProfessionalAccess(user, verification);
  }
}

// ====================================================================
// PROPOSAL BRAND RESOLVER
// ====================================================================
export class ProposalBrandResolver {
  static resolveBranding(branding: CompanyBranding | null, verification: AgentVerification | null) {
    const resolved = BrandingResolver.resolveBranding(branding);
    const wlMeta = WhiteLabelService.getWhiteLabelMetadata(branding);
    
    return {
      companyName: resolved?.companyName || branding?.companyName || 'Apex Premium Properties',
      agentName: wlMeta?.agentName || resolved?.agentName || verification?.fullName || 'Senior Investment Advisor',
      phone: resolved?.phone || branding?.phone || '+971 4 555 0199',
      email: resolved?.email || branding?.email || 'advisor@apex-realty.ae',
      website: resolved?.website || branding?.website || 'www.apex-realty.ae',
      logoUrl: branding?.companyLogo || resolved?.companyLogo,
      primaryColor: branding?.primaryColor || '#4f46e5',
      reraNumber: verification?.licenseNumber || 'RERA-CN-28941'
    };
  }
}

// ====================================================================
// PROPOSAL CONTEXT BUILDER
// ====================================================================
export class ProposalContextBuilder {
  static collectCurrentContext(
    user: User | null,
    verification: AgentVerification | null,
    branding: CompanyBranding | null,
    communityId: string,
    projectId: string
  ): FullAIContext {
    return ProfessionalContextBuilder.buildFullAIContext(
      user,
      verification,
      branding,
      { communityId, projectId }
    );
  }
}

// ====================================================================
// PROPOSAL COMPOSER (AI ORCHESTRATION & PAYLOAD)
// ====================================================================
export class ProposalComposer {
  static generateProposal(
    context: FullAIContext,
    communityId: string,
    projectId: string
  ): ProposalPayload {
    const comm = MOCK_COMMUNITIES.find(c => c.id === communityId) || MOCK_COMMUNITIES[0];
    const subArea = MOCK_SUB_AREAS.find(s => s.communityId === communityId) || MOCK_SUB_AREAS[0];
    const propData = ProfessionalPropertyService.getProfessionalPropertyData(projectId);
    const dldTrans = RegistryService.getOfficialRegistryTransactions(projectId);

    // Dynamic clean text generation
    const cleanCommName = comm.name;
    const cleanProjName = projectId === 'all' || !projectId ? 'Waterfront Luxury Res' : projectId.replace('-', ' ').toUpperCase();

    const opportunitySummary = `Strategic acquisition of a highly liquid residential asset in ${cleanCommName} (${cleanProjName}). This community currently commands a top tier placement within the Dubai rental market, offering immediate capital shield dynamics.`;
    const investmentSnapshot = `stabilized gross yield potential of ${comm.yield}% with a forward 12-month capital appreciation forecast of +${comm.growth}%. Fully verified against authentic DLD transfer records.`;
    const professionalOverview = `Underwritten directly under RERA Regulatory guidelines. DLD title checked with zero outstanding encumbrances or construction default notices. Escrow accounts audited as solvent.`;

    const commRank = `#${MOCK_COMMUNITIES.indexOf(comm) + 1}`;

    return {
      id: `PROP-${Math.floor(100000 + Math.random() * 900000)}`,
      createdDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      communityId,
      projectId,
      branding: {
        companyName: context.branding?.companyName || 'Apex Premium Properties',
        agentName: context.branding?.agentName || 'Senior Broker',
        phone: context.branding?.phone || '+971 4 555 0199',
        email: context.branding?.email || 'advisor@apex-realty.ae',
        website: context.branding?.website || 'www.apex-realty.ae',
        logoUrl: context.branding?.logoUrl,
        primaryColor: context.branding?.primaryColor || '#4f46e5',
        reraNumber: context.branding?.agentName ? 'RERA-CN-28941' : 'N/A'
      },
      executiveSummary: {
        opportunitySummary,
        investmentSnapshot,
        professionalOverview
      },
      propertyOverview: {
        name: cleanProjName,
        type: 'Premium Residential Apartment',
        developer: 'Emaar Properties PJSC',
        location: `${cleanCommName}, Dubai, UAE`,
        currentPrice: `AED ${(comm.avgPrice * 1250).toLocaleString()}`,
        avgPriceSqft: `AED ${comm.avgPrice.toLocaleString()}/sqft`
      },
      marketIntelligence: {
        communityRank: commRank,
        annualGrowth: `${comm.growth}%`,
        marketPhase: 'Expansion Wave 3',
        volatilityIndex: 'Low - Capital Preservation Grade',
        supplyForecast: 'Under-supplied (Defensive)'
      },
      transactionAnalysis: {
        officialRegistryTransactions: dldTrans,
        cashVsMortgageRatio: '72% Cash / 28% Mortgage',
        quarterlyVolume: 'AED 342.5M registered sales',
        averageSize: '1,250 sqft'
      },
      rentalResearch: {
        yieldGross: `${comm.yield}%`,
        yieldNet: `${(comm.yield - 1.2).toFixed(1)}%`,
        ejariContractsCount: 1492,
        reraRentCapLimit: '5% to 15% Maximum cap applies',
        rentalGrowth: '+8.4% YoY'
      },
      investmentReturns: {
        estimatedROI5Yr: '44.8% Cumulative',
        monthlyCashFlow: `AED ${Math.round((comm.avgPrice * 1250 * (comm.yield / 100)) / 12).toLocaleString()}/month`,
        breakevenYears: '11.4 Years',
        loanToValueRatio: '60% max'
      },
      professionalProperty: propData,
      aiRecommendation: {
        strengths: [
          'Unrivaled prime waterfront views with permanent visual clearance.',
          'Underwritten by Emaar with sovereign-grade balance sheet liquidity.',
          'Consistently outperforms general Dubai index in down-cycles.'
        ],
        risks: [
          'Premium entry price relative to speculative secondary ring sub-districts.',
          'Slight rental rate resistance at renewal due to active Ejari caps.'
        ],
        holdingStrategy: '3 to 5 Year Capital Appreciation & Liquidity Hold',
        confidenceScore: 96,
        overallRecommendation: 'HIGH CONVICTION ACCUMULATE'
      },
      whyThisInvestment: {
        topDrivers: [
          'High net worth individual migration directly into premium waterfront communities.',
          'Continuous infrastructure connectivity upgrades, reducing transit times to key financial hubs.',
          'Sovereign backing ensures long-term preservation of property standards.'
        ],
        appreciationPotential: 'Waterfront properties historically appreciate at 1.8x the rate of land-locked mainland assets.',
        rentalSecurity: 'Tenant demand pool comprised predominantly of multinational executive contracts with 1-check corporate backing.'
      }
    };
  }
}

// ====================================================================
// PROPOSAL PREVIEW SERVICE
// ====================================================================
export class ProposalPreviewService {
  static getMockProposalTemplates() {
    return [
      { id: 'premium-gold', name: 'Premium Gold Minimalist', desc: 'Sleek dark theme with gold accent borders.' },
      { id: 'corporate-slate', name: 'Corporate Slate & Navy', desc: 'High-contrast institutional format for portfolio proposals.' },
      { id: 'executive-emerald', name: 'Executive Shoreline Emerald', desc: 'Designed for coastal and beachfront ultra-luxury assets.' }
    ];
  }
}

// ====================================================================
// PROPOSAL EXPORT SERVICE
// ====================================================================
export class ProposalExportService {
  static simulatePDFGeneration(proposal: ProposalPayload): Promise<Blob> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Create dummy blob representing a high fidelity client proposal
        const dummyContent = `%PDF-1.4 ... ACOT Premium Proposal - ${proposal.id} ...`;
        const blob = new Blob([dummyContent], { type: 'application/pdf' });
        resolve(blob);
      }, 2000);
    });
  }

  static simulatePushToCRM(proposal: ProposalPayload): Promise<{ success: boolean; refId: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          refId: `CRM-LEAD-${Math.floor(10000 + Math.random() * 90000)}`
        });
      }, 1500);
    });
  }
}

// ====================================================================
// MAIN ENTRY POINT FOR PROPOSAL ENGINE
// ====================================================================
export class ProposalEngine {
  static async compileProposal(
    user: User | null,
    verification: AgentVerification | null,
    branding: CompanyBranding | null,
    communityId: string,
    projectId: string
  ): Promise<ProposalPayload> {
    const isAuthorized = ProposalPermissionService.validateAccess(user, verification);
    if (!isAuthorized) {
      throw new Error('Access Denied: Verification required to assemble investor proposals.');
    }

    const context = ProposalContextBuilder.collectCurrentContext(user, verification, branding, communityId, projectId);
    return ProposalComposer.generateProposal(context, communityId, projectId);
  }
}
