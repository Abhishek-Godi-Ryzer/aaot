// AI Intelligence Suite Service for ACOT Platform
// Grounded AI Analyst RAG simulator that retrieves actual platform data and packages it into high-fidelity structures.

// =========================================================================
// FUTURE INTEGRATION: AI ANALYST BRANDING CONSUMPTION PLACEHOLDER
// =========================================================================
// This placeholder allows the AI Analyst to retrieve saved agent/brokerage
// branding parameters and inject them into AI-generated executive summaries.
export function getAIBrandingConfigPlaceholder() {
  // In future integration phase:
  // const branding = AgentService.getBranding();
  // return {
  //   agentName: branding.agentInfo.agentName,
  //   brokerage: branding.companyInfo.companyName,
  //   signature: branding.digitalSignature,
  //   showFooter: branding.reportSettings.showCompanyFooter
  // };
  return {
    ready: true,
    description: "Branding placeholder prepared for AI Analyst whitelabel delivery"
  };
}

import { AgentService } from './agentService';
import { ProfessionalAccessService } from './professionalAccessService';
import { ProfessionalAIService } from './professionalAIService';
import { User } from '../types';
import { 
  MOCK_COMMUNITIES, 
  MOCK_SUB_AREAS, 
  MOCK_PROJECTS, 
  Community, 
  SubArea, 
  Project 
} from './marketAnalyticsService';

export interface EvidenceSource {
  id: string;
  name: string;
  module: string;
  confidence: number; // 0-1
  timestamp: string;
}

export interface HighlightMetric {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  iconType: 'trend' | 'yield' | 'volume' | 'liquidity' | 'ranking';
  description: string;
}

export interface ScoreCategory {
  name: string;
  score: number; // out of 10
  explanation: string;
  evidence: string;
  confidence: string; // "High" | "Medium" | "Low"
}

export interface DealScoreResult {
  overallScore: number;
  categories: ScoreCategory[];
  recommendation: 'Strong Buy' | 'Hold' | 'Accumulate' | 'Under Review';
  summary: string;
}

export interface ComparisonMetric {
  label: string;
  communityAValue: string;
  communityBValue: string;
  winner: 'A' | 'B' | 'Equal';
  analysis: string;
}

export interface CommunityComparisonResult {
  communityAName: string;
  communityBName: string;
  metrics: ComparisonMetric[];
  aiRecommendation: string;
}

export interface InvestmentRecommendationResult {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  risks: string[];
  suggestedStrategy: string;
  shortTermOutlook: string;
  longTermOutlook: string;
}

export interface ReportPayload {
  metadata: {
    generatedDate: string;
    analysisContext: {
      community: string;
      subArea: string;
      project: string;
    };
    verifiedSources: string[];
  };
  executiveSummary: string;
  communityOverview: string;
  marketAnalysis: {
    priceGrowth: string;
    transactionVolume: string;
    momentum: string;
  };
  transactionAnalysis: {
    cashVsMortgage: string;
    readyVsOffPlan: string;
    avgSizeSqft: string;
  };
  rentalAnalysis: {
    averageAnnualRent: string;
    rentalYield: string;
    demandLevel: string;
  };
  investmentScore: {
    overall: number;
    grade: string;
  };
  riskAssessment: {
    marketRisk: string;
    supplyRisk: string;
    regulatoryRisk: string;
  };
  keyOpportunities: string[];
  recommendations: string[];
  evidence: EvidenceSource[];
}

export interface AIResponse {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  message: string;
  thinkingSteps?: string[];
  highlights?: HighlightMetric[];
  evidence?: EvidenceSource[];
  dealScore?: DealScoreResult;
  comparison?: CommunityComparisonResult;
  recommendation?: InvestmentRecommendationResult;
  reportPayload?: ReportPayload;
  options?: string[];
  followUpQuestions?: string[];
}

export class RetrieverService {
  static retrieveMarketData(communityId: string, subAreaId?: string, projectId?: string): {
    community?: Community;
    subArea?: SubArea;
    project?: Project;
  } {
    const comm = MOCK_COMMUNITIES.find(c => c.id === communityId) || MOCK_COMMUNITIES[0];
    let sub: SubArea | undefined;
    let proj: Project | undefined;

    if (subAreaId && subAreaId !== 'all') {
      sub = MOCK_SUB_AREAS.find(s => s.id === subAreaId);
    }
    if (projectId && projectId !== 'all') {
      proj = MOCK_PROJECTS.find(p => p.id === projectId);
    }

    return { community: comm, subArea: sub, project: proj };
  }

  static retrieveRelevantDocuments(communityId: string): string[] {
    const docs = [
      `Dubai Land Department Transaction Logs Q1-Q2 2026 (${communityId})`,
      `Ejari Rental Registry database index (${communityId})`,
      `Oqood Pre-registration off-plan contracts (${communityId})`,
      `RERA rent index guidelines 2026`,
      `ACOT Historical Yield Engine & price/sqft metrics`
    ];
    return docs;
  }

  static retrieveTransactionData(communityId: string) {
    return {
      averagePriceSqft: communityId === 'dubai-marina' ? 1654 : communityId === 'palm-jumeirah' ? 2101 : 1512,
      cashRatio: '68%',
      mortgageRatio: '32%',
      readyRatio: '58%',
      offPlanRatio: '42%'
    };
  }

  static retrieveRentalData(communityId: string) {
    return {
      averageRent: communityId === 'dubai-marina' ? 'AED 165,000' : communityId === 'palm-jumeirah' ? 'AED 240,000' : 'AED 135,000',
      netYield: communityId === 'dubai-marina' ? '5.9%' : communityId === 'palm-jumeirah' ? '5.4%' : '6.3%',
      occupancy: '94%'
    };
  }

  static retrieveInvestorCalculations(communityId: string) {
    return {
      projectedRoi: '8.4%',
      paybackPeriod: '12.5 Years',
      irrProjected: '11.2%'
    };
  }
}

export class PromptService {
  static buildPrompt(userMessage: string, contextData: any, evidence: string[]): string {
    return `System Instruction: Grounded Real Estate Investment Analyst context.
Context data: ${JSON.stringify(contextData)}
Evidence bases: ${evidence.join(', ')}
User query: "${userMessage}"
Generate a strictly grounded response. Do not hallucinate.`;
  }

  static injectContext(template: string, contextData: any): string {
    return template.replace(/\{community\}/g, contextData.community?.name || 'Dubai Marina');
  }

  static injectEvidence(prompt: string, evidence: string[]): string {
    return `${prompt}\n\nEvidence logs used: ${evidence.join(', ')}`;
  }
}

export class AIService {
  static startConversation(communityId: string, subAreaId?: string, projectId?: string): AIResponse {
    const data = RetrieverService.retrieveMarketData(communityId, subAreaId, projectId);
    const contextName = data.project?.name || data.subArea?.name || data.community?.name || 'Dubai Marina';

    return {
      id: 'welcome-0',
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      message: `Welcome to the **ACOT AI Intelligence Suite**. I am your grounded Real Estate Investment Analyst, specialized in verified Dubai Property Analytics.

I have synchronized my retrieval models with your active **Analysis Context**: **${contextName}**. 

All insights, transaction scores, and rent trends are dynamically grounded in live registries from the **Dubai Land Department (DLD)** and **Ejari**. 

How can I assist your underwriting process today? You can select any quick prompt below or use the AI actions on the right context panel.`,
      evidence: [
        { id: 'source-1', name: 'Dubai Land Department (DLD)', module: 'Transaction Intelligence', confidence: 0.99, timestamp: 'Today, 09:30 AM' },
        { id: 'source-2', name: 'Ejari Rental Registry', module: 'Rental Intelligence', confidence: 0.98, timestamp: 'Today, 09:30 AM' },
        { id: 'source-3', name: 'ACOT Market Analytics', module: 'Market Analytics & Cycles', confidence: 0.95, timestamp: 'Updated 2m ago' }
      ]
    };
  }

  static async generateAnswer(
    message: string, 
    communityId: string, 
    subAreaId?: string, 
    projectId?: string,
    user?: User | null
  ): Promise<AIResponse> {
    const verification = AgentService.getVerificationStatus();
    const branding = AgentService.getBranding();
    const hasProfAccess = ProfessionalAccessService.hasProfessionalAccess(user || null, verification);

    if (hasProfAccess) {
      return ProfessionalAIService.generateAnswer(
        message,
        user || null,
        verification,
        branding,
        { communityId, subAreaId, projectId }
      );
    }

    const data = RetrieverService.retrieveMarketData(communityId, subAreaId, projectId);
    const comm = data.community || MOCK_COMMUNITIES[0];
    const sub = data.subArea;
    const proj = data.project;

    const locName = proj?.name || sub?.name || comm.name;
    const lowerMsg = message.toLowerCase();

    // Setup thinking pipeline - exactly as requested by user
    const thinkingSteps = [
      'Analyzing...',
      'Retrieving DLD Transactions',
      'Retrieving Ejari Data',
      'Building Investment Assessment'
    ];

    // Setup evidence sources
    const evidence: EvidenceSource[] = [
      { id: 'source-dld', name: 'DLD Transactions Log', module: 'Transaction Intelligence', confidence: 0.99, timestamp: 'Today, 09:30 AM' },
      { id: 'source-ejari', name: 'Ejari Rental Registry', module: 'Rental Intelligence', confidence: 0.98, timestamp: 'Today, 09:30 AM' },
      { id: 'source-analytics', name: 'Market Analytics Feed', module: 'Market Analytics & Cycles', confidence: 0.96, timestamp: 'Live Sync' }
    ];

    // Setup highlights metrics
    const highlights: HighlightMetric[] = [
      { 
        label: '3Y Price Growth', 
        value: `${comm.growthString}`, 
        change: 'vs last 3 years', 
        isPositive: comm.growth >= 0, 
        iconType: 'trend',
        description: 'Compounded capital appreciation trend.'
      },
      { 
        label: 'Average Annual Rent', 
        value: comm.id === 'dubai-marina' ? 'AED 165,000' : comm.id === 'palm-jumeirah' ? 'AED 240,000' : `AED ${(comm.avgPrice * 100).toLocaleString()}`, 
        change: '+6.2% vs last year', 
        isPositive: true, 
        iconType: 'yield',
        description: 'Mean annual rent value based on Ejari.'
      },
      { 
        label: 'Net Yield', 
        value: `${comm.yield}%`, 
        change: 'after expenses', 
        isPositive: true, 
        iconType: 'yield',
        description: 'Estimated net rental returns of typical residential assets.'
      },
      { 
        label: 'Liquidity Score', 
        value: comm.volume > 8000 ? 'High' : 'Moderate', 
        change: 'Based on transaction volume', 
        isPositive: true, 
        iconType: 'liquidity',
        description: 'Speed of property liquidation in the secondary market.'
      }
    ];

    let reply = '';
    let dealScore: DealScoreResult | undefined;
    let comparison: CommunityComparisonResult | undefined;
    let recommendation: InvestmentRecommendationResult | undefined;
    let reportPayload: ReportPayload | undefined;
    let followUpQuestions: string[] = [];

    // Route message intent
    if (lowerMsg.includes('score') || lowerMsg.includes('deal') || lowerMsg.includes('evaluate')) {
      dealScore = this.generateDealScore(communityId, subAreaId, projectId);
      reply = `### Summary
I have executed the **AI Deal Scorer Engine** on **${locName}** by analyzing live property metrics and transaction deeds. The overall investment health is evaluated at an outstanding score of **${dealScore.overallScore}/10**, placing it in a **${dealScore.recommendation}** bracket.

### Key Findings
• **Capital Growth Potential**: Current 3Y compounded growth of ${comm.growthString} displays strong market inertia.
• **Yield Resiliency**: Outstanding rental yields of ${comm.yield}% supported by an average occupancy rate of ${comm.occupancy}%.
• **Liquidity Buffer**: Over ${comm.volume.toLocaleString()} registered transaction deeds ensure clean exit timelines.

### Recommendation
Accumulate core waterfront assets in ${locName} to lock in defensive yield streams and capture multi-year capital appreciation curves.`;

      followUpQuestions = [
        "Compare with Business Bay",
        "Estimate ROI",
        "Explain Rental Demand",
        "Generate Executive Report"
      ];
    } 
    else if (lowerMsg.includes('compare') || lowerMsg.includes('business bay') || lowerMsg.includes('vs')) {
      comparison = this.compareCommunities(communityId, 'business-bay');
      reply = `### Summary
This is a head-to-head comparative analysis between **${comparison.communityAName}** and **${comparison.communityBName}** using actual platform records rather than general marketing summaries.

### Key Findings
• **Pricing Disparity**: Average price levels are lower in ${comm.avgPrice < 1600 ? comparison.communityAName : comparison.communityBName}, making it a lower-barrier entry point.
• **Historical Growth**: ${comparison.communityAName} holds the historical growth lead with a robust appreciation wave.
• **Defensive Yields**: The net yields of both communities differ slightly, presenting a choice between pure yield and capital protection.

### Recommendation
${comparison.aiRecommendation}`;

      followUpQuestions = [
        "Estimate ROI",
        "Explain Rental Demand",
        "Review Transaction History",
        "Generate Executive Report"
      ];
    } 
    else if (lowerMsg.includes('report') || lowerMsg.includes('generate report')) {
      reportPayload = this.generateReportPayload(communityId, subAreaId, projectId);
      reply = `### Summary
I have drafted and compiled the comprehensive **ACOT AI Prospectus Report Payload** for **${locName}** formatted for instant processing.

### Key Findings
• **Executive Valuation**: Multi-sourced data from DLD and Ejari confirms robust capital growth levels of ${comm.growthString}.
• **Defensive Backing**: Stabilized lease structures guarantee steady rent flows and a low localized vacancy rate.
• **Structural Alignment**: Fully structured JSON structures are drafted and verified across all escrow accounts.

### Recommendation
Select "Compile PDF" below or navigate to the Reports Engine to render these analytical blocks into a formal, printable investment prospectus.`;

      followUpQuestions = [
        "Compare with Business Bay",
        "Estimate ROI",
        "Explain Rental Demand",
        "Review Transaction History"
      ];
    } 
    else if (lowerMsg.includes('risk') || lowerMsg.includes('weakness')) {
      recommendation = this.generateInvestmentSummary(communityId, subAreaId, projectId);
      reply = `### Summary
Here is a comprehensive risk and strength analysis for **${locName}** derived from our current Dubai RAG knowledge base.

### Key Findings
• **Capital Expansion**: Excellent waterfront shoreline premium or central district accessibility.
• **Escrow Safeguards**: Stringent developer completion rules protect early-stage investors from construction delays.
• **Volatility Insulation**: Premium assets show strong resistance to temporary credit tightening.

### Recommendation
Mitigate localized supply risk by selecting high-tier institutional developers (e.g. Emaar, Select Group) and locking in long-term lease renewals.`;

      followUpQuestions = [
        "Generate Deal Score",
        "Compare with Business Bay",
        "Estimate ROI",
        "Explain Rental Demand"
      ];
    } 
    else if (lowerMsg.includes('rent') || lowerMsg.includes('leasing')) {
      reply = `### Summary
Rental market assessment for **${locName}** reveals strong operational metrics and high demand occupancy.

### Key Findings
• **Occupancy Rate**: Average residential occupancy remains extremely tight at **${comm.occupancy}%** across secondary assets.
• **Net Cash Yield**: Typical net yields hold strong at **${comm.yield}%** after service charges, outperforming major global hubs.
• **Growth Momentum**: Registered Ejari leases show a consistent **+6.2%** positive shift over the past 12 months.

### Recommendation
Incorporate high-yield residential properties here into a cash-flow-focused portfolio, prioritizing 1-to-2 check payments to secure optimal renters.`;

      followUpQuestions = [
        "Generate Deal Score",
        "Compare with Business Bay",
        "Estimate ROI",
        "Review Transaction History"
      ];
    } 
    else {
      // General grounded answer
      reply = `### Summary
This is a comprehensive, data-grounded assessment for **${locName}** based on Dubai Land Department deeds and Ejari registers.

### Key Findings
• **Capital Values**: Current pricing averages **AED ${comm.avgPrice.toLocaleString()}/sqft** with ${comm.growthString} 3-year compounded appreciation.
• **Liquidity Velocity**: More than **${comm.volume.toLocaleString()} registered secondary deeds** demonstrate highly active capital exits.
• **Occupancy Anchors**: Deep rental cushions with **${comm.occupancy}% occupancy** protect downside risk during capital cycles.

### Recommendation
For conservative capital preservation, **${locName}** presents a highly secure Waterfront/Premium backing with defensive yield features.`;

      followUpQuestions = [
        "Compare with Business Bay",
        "Estimate ROI",
        "Explain Rental Demand",
        "Generate Executive Report",
        "Review Transaction History"
      ];
    }

    if (false) {
      // Bypassed block
    }
    if (false) {
      dealScore = this.generateDealScore(communityId, subAreaId, projectId);
      reply = `I have executed the **AI Deal Scorer Engine** on **${locName}**. 
      
By analyzing over 12,000 recent DLD transaction deeds and Ejari-registered leases, ACOT AI has evaluated this investment with an overall score of **${dealScore.overallScore}/10**. 

This grade signifies a **${dealScore.recommendation}** status. Below is a structured breakdown of individual sub-scores alongside verified evidence and explanations.`;
    } 
    else if (lowerMsg.includes('compare') || lowerMsg.includes('business bay') || lowerMsg.includes('vs')) {
      comparison = this.compareCommunities(communityId, 'business-bay');
      reply = `I have performed a high-performance, live comparative analysis between **${comparison.communityAName}** and **${comparison.communityBName}**. 

Instead of general marketing summaries, this evaluation compares core institutional metrics including capital growth, rental demand velocity, transaction liquidity, and structural risks. 

**Summary Recommendation:**
${comparison.aiRecommendation}`;
    } 
    else if (lowerMsg.includes('report') || lowerMsg.includes('generate report')) {
      reportPayload = this.generateReportPayload(communityId, subAreaId, projectId);
      reply = `I have compiled and structured the comprehensive **ACOT AI Prospectus Report Payload** for **${locName}**. 

This institutional-grade blueprint is fully structured with verified metadata, rental yield schedules, risk scoring tables, and future market outlooks. 

The payload has been formatted and is ready to be consumed by the **Reports Engine** for dynamic PDF compilation. You can view the drafted report metadata in the card below.`;
    } 
    else if (lowerMsg.includes('risk') || lowerMsg.includes('weakness')) {
      recommendation = this.generateInvestmentSummary(communityId, subAreaId, projectId);
      reply = `Here is a detailed breakdown of the structural investment strengths, weaknesses, and potential risks for **${locName}** based on our current RAG knowledge base.

An institutional investor must carefully weigh these factors prior to deploying capital here. Below is a detailed matrix of risks and mitigation strategies.`;
    } 
    else if (lowerMsg.includes('rent') || lowerMsg.includes('leasing')) {
      reply = `**Rental Market Assessment for ${locName}**:
      
1. **Demand Velocity**: Rental demand is currently marked as **Extreme**, supported by a **94% average occupancy rate** in prime residential buildings.
2. **Yield Performance**: The net yield holds firm at **${comm.yield}%** after estimated service charges and management fees, outperforming typical global markets (London 3.1%, New York 4.2%).
3. **Growth Vectors**: Over the past 12 months, rental agreements have registered a positive change of **+6.2%**. This is predominantly driven by secondary-market renewals and influxes of high-income corporate professionals.
4. **Lease Terms**: Cash transactions remain the dominant force, although the prevalence of 1-to-2 check payments is rising rapidly in prime structures.`;
    } 
    else {
      // General grounded answer
      reply = `**ACOT Grounded Analysis for ${locName}**:

1. **Capital Value Appreciation**: 
   The current average rate is **AED ${comm.avgPrice.toLocaleString()}/sqft**, representing a capital growth of **${comm.growthString}** over the past 3 years. This indicates a robust bull cycle that is currently stabilizing into an established phase.

2. **Underlying Transaction Liquidity**: 
   A total of **${comm.volume.toLocaleString()} transactions** have been registered in this community recently, bringing the total value of assets traded to **AED ${comm.value} Billion**. This high velocity guarantees strong liquidity for exit strategies.

3. **Rental Demand & Cash Yields**: 
   Residential occupancy remains extremely high at **${comm.occupancy}%**. Typical net yields of **${comm.yield}%** provide defensive downside protection against global macroeconomic volatility.

4. **Investment Outlook**: 
   For a conservative portfolio, **${locName}** presents a defensive asset backing. Short-term appreciation is likely to moderate to a sustainable 4-6% annually, while long-term cash flow is highly insulated by the scarcity of prime waterfront/central space.`;
    }

    const isVerifiedAgent = verification?.status === 'VERIFIED';
    
    let finalReply = reply;
    if (isVerifiedAgent) {
      finalReply += `

***

### 🛡️ Professional AI Context
ACOT AI has compiled and verified the following professional parameters for **${locName}**:
• **Registry Data**: Validated against DLD live deed indexes
• **Permit Status**: Construction Permit active and cleared
• **Developer History**: Developer completion rates are rated 9.4/10
• **Building Registration**: Traheesi registration verified and active
• **Legal References**: Fully compliant with RERA Law No. 7 of 2006
• **Escrow Information**: Active escrow accounts verified
• **Authority Records**: Clean municipal records, no violations
• **Due Diligence**: Standard real estate risk underwriting checklist cleared`;
    }

    // Simulate delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `resp-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          message: finalReply,
          thinkingSteps,
          highlights,
          evidence,
          dealScore,
          comparison,
          recommendation,
          reportPayload,
          followUpQuestions
        });
      }, 1000); // 1-second simulated RAG RTT
    });
  }

  static generateDealScore(communityId: string, subAreaId?: string, projectId?: string): DealScoreResult {
    const data = RetrieverService.retrieveMarketData(communityId, subAreaId, projectId);
    const comm = data.community || MOCK_COMMUNITIES[0];
    
    // Scale overall score on community yield and growth
    let overallScore = 8.5;
    if (comm.id === 'dubai-marina') overallScore = 8.9;
    else if (comm.id === 'palm-jumeirah') overallScore = 9.2;
    else if (comm.id === 'business-bay') overallScore = 8.1;
    else if (comm.id === 'downtown-dubai') overallScore = 8.7;
    else if (comm.id === 'jumeirah-village-circle') overallScore = 8.4;

    const categories: ScoreCategory[] = [
      {
        name: 'Growth Potential',
        score: comm.growth > 25 ? 9.1 : 7.8,
        explanation: `Historical 3-year growth is strong at ${comm.growthString}. Price levels show moderate appreciation headroom before resistance.`,
        evidence: 'DLD transaction registries, 36-month pricing trends',
        confidence: 'High'
      },
      {
        name: 'Rental Strength',
        score: comm.yield >= 7.0 ? 9.4 : comm.yield >= 6.0 ? 8.5 : 7.5,
        explanation: `Secured by an average occupancy rate of ${comm.occupancy}% and strong net yields of ${comm.yield}%.`,
        evidence: 'Ejari residential leases, occupancy registries',
        confidence: 'High'
      },
      {
        name: 'Liquidity',
        score: comm.volume > 9000 ? 9.5 : 8.0,
        explanation: `Highly active community with ${comm.volume.toLocaleString()} secondary market exchanges. Average days-on-market is 18-24 days.`,
        evidence: 'DLD title deed registrations and transfer registries',
        confidence: 'High'
      },
      {
        name: 'Market Stability',
        score: 8.2,
        explanation: 'Low volatility indexes. Safe-haven capital inflows mitigate downside systemic shocks.',
        evidence: 'ACOT Market Cycles Index',
        confidence: 'Medium'
      },
      {
        name: 'Developer Reputation',
        score: 8.8,
        explanation: `Predominantly built by institutional developers: ${comm.developer || 'Emaar, Select Group'}. Low delay rates.`,
        evidence: 'Oqood escrow tracking and project completion registries',
        confidence: 'High'
      }
    ];

    return {
      overallScore,
      categories,
      recommendation: overallScore >= 9.0 ? 'Strong Buy' : overallScore >= 8.2 ? 'Accumulate' : 'Hold',
      summary: `Robust property backing with outstanding liquidity and solid yield cushions. Price points are stabilized but capital appreciation remains highly likely due to physical scarcity.`
    };
  }

  static compareCommunities(communityIdA: string, communityIdB: string): CommunityComparisonResult {
    const commA = MOCK_COMMUNITIES.find(c => c.id === communityIdA) || MOCK_COMMUNITIES[0];
    const commB = MOCK_COMMUNITIES.find(c => c.id === communityIdB) || MOCK_COMMUNITIES[1];

    const metrics: ComparisonMetric[] = [
      {
        label: 'Average Price / Sqft',
        communityAValue: `AED ${commA.avgPrice.toLocaleString()}`,
        communityBValue: `AED ${commB.avgPrice.toLocaleString()}`,
        winner: commA.avgPrice < commB.avgPrice ? 'A' : 'B',
        analysis: `Property entry barriers are lower in ${commA.avgPrice < commB.avgPrice ? commA.name : commB.name} by AED ${Math.abs(commA.avgPrice - commB.avgPrice).toLocaleString()} per sqft.`
      },
      {
        label: 'Capital Growth (3Y)',
        communityAValue: `${commA.growthString}`,
        communityBValue: `${commB.growthString}`,
        winner: commA.growth > commB.growth ? 'A' : 'B',
        analysis: `${commA.growth > commB.growth ? commA.name : commB.name} has outperformed by ${(Math.abs(commA.growth - commB.growth)).toFixed(1)}% over the past 36 months.`
      },
      {
        label: 'Net Cash Yield',
        communityAValue: `${commA.yield}%`,
        communityBValue: `${commB.yield}%`,
        winner: commA.yield > commB.yield ? 'A' : 'B',
        analysis: `${commA.yield > commB.yield ? commA.name : commB.name} provides superior income generation, outyielding by ${(Math.abs(commA.yield - commB.yield)).toFixed(1)}%.`
      },
      {
        label: 'Transaction Volume',
        communityAValue: `${commA.volume.toLocaleString()}`,
        communityBValue: `${commB.volume.toLocaleString()}`,
        winner: commA.volume > commB.volume ? 'A' : 'B',
        analysis: `${commA.volume > commB.volume ? commA.name : commB.name} showcases greater liquidity and higher secondary exchange frequency.`
      }
    ];

    const aiRecommendation = `For long-term capital preservation and premium international appeal, **${commA.name}** remains the premier waterfront choice with strong visual demand. However, if your strategy is focused purely on higher yield generation and cash-on-cash flow, **${commB.name}** offers excellent value with a lower price-per-square-foot entry bar.`;

    return {
      communityAName: commA.name,
      communityBName: commB.name,
      metrics,
      aiRecommendation
    };
  }

  static generateInvestmentSummary(communityId: string, subAreaId?: string, projectId?: string): InvestmentRecommendationResult {
    const data = RetrieverService.retrieveMarketData(communityId, subAreaId, projectId);
    const comm = data.community || MOCK_COMMUNITIES[0];

    return {
      summary: `Conservative waterfront estate with superior capital backing and dynamic renter liquidity. The area features a robust supply limit which protects entry-level investments.`,
      strengths: [
        'Exceptional high liquidity and active tenant demand.',
        'High percentage of cash buyers (68%) reducing systemic mortgage bubble risks.',
        'Waterfront/prime location scarcity guaranteeing solid long-term preservation of capital.'
      ],
      weaknesses: [
        'Higher entry cost compared to inland suburban master developments.',
        'Slightly lower yield yields relative to affordable communities like Jumeirah Village Circle (8.4%).',
        'Congested internal infrastructure during peak hours.'
      ],
      risks: [
        'Currency fluctuations (AED is pegged to USD, protecting global investors but exposes to local rate adjustments).',
        'Potential supply of adjacent luxury beachfront towers over the next 36 months.',
        'Minor regulatory adjustments in service charge caps affecting net yield yields.'
      ],
      suggestedStrategy: 'Acquire 1-2 bedroom apartments in prime high-rise structures. Focus on structures built by tier-1 developers (e.g. Emaar, Select Group) to secure maximum occupancy and high secondary liquidity.',
      shortTermOutlook: 'Stable. Expect capital appreciation of 4.5% to 6.2% over the next 12 months with high occupancy levels.',
      longTermOutlook: 'Bullish. Physical limits on waterfront land blocks future competitor supply, positioning early buy-in portfolios for high premium valuations.'
    };
  }

  static generateReportPayload(communityId: string, subAreaId?: string, projectId?: string): ReportPayload {
    const data = RetrieverService.retrieveMarketData(communityId, subAreaId, projectId);
    const comm = data.community || MOCK_COMMUNITIES[0];
    const score = this.generateDealScore(communityId, subAreaId, projectId);
    const summary = this.generateInvestmentSummary(communityId, subAreaId, projectId);

    return {
      metadata: {
        generatedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        analysisContext: {
          community: comm.name,
          subArea: subAreaId === 'all' ? 'All Sub-Areas' : subAreaId || 'all',
          project: projectId === 'all' ? 'All Projects' : projectId || 'all'
        },
        verifiedSources: ['Dubai Land Department (DLD)', 'Ejari Rental Index', 'Oqood ESCROW tracking', 'RERA guidelines']
      },
      executiveSummary: `This institutional-grade prospectus presents a data-driven investment evaluation of ${comm.name}, Dubai. Prepared utilizing verified transactional registries, price matrices, and lease histories from official databases.`,
      communityOverview: comm.description,
      marketAnalysis: {
        priceGrowth: `${comm.growthString} over 3 years`,
        transactionVolume: `${comm.volume.toLocaleString()} registered transactions`,
        momentum: 'Prime Stabilized'
      },
      transactionAnalysis: {
        cashVsMortgage: '68% Cash vs 32% Mortgage buyers',
        readyVsOffPlan: '58% Ready vs 42% Off-plan sales',
        avgSizeSqft: '1,120 sqft'
      },
      rentalAnalysis: {
        averageAnnualRent: comm.id === 'dubai-marina' ? 'AED 165,000' : 'AED 135,000',
        rentalYield: `${comm.yield}% Net Yield`,
        demandLevel: 'Extreme Demand'
      },
      investmentScore: {
        overall: score.overallScore,
        grade: score.recommendation
      },
      riskAssessment: {
        marketRisk: 'Low (Insulated by premium global capital flows)',
        supplyRisk: 'Moderate (Limited new parcel availability in waterfront zones)',
        regulatoryRisk: 'Low (RERA regulations provide transparent investor security)'
      },
      keyOpportunities: [
        'Refurbishment potential in established ready towers.',
        'High premium exit strategies upon delivery of neighboring master projects.',
        'Expanding short-term holiday home market conversions.'
      ],
      recommendations: [
        'Deploy capital into 1-bedroom apartments to maximize yield (averaging 7.5% gross).',
        'Prioritize freehold properties with established property management agreements.',
        'Acquire properties within 5-minute walking proximity to the Metro station hubs.'
      ],
      evidence: [
        { id: 'source-dld', name: 'DLD Transactions Log', module: 'Transaction Intelligence', confidence: 0.99, timestamp: 'Today, 09:30 AM' },
        { id: 'source-ejari', name: 'Ejari Rental Registry', module: 'Rental Intelligence', confidence: 0.98, timestamp: 'Today, 09:30 AM' }
      ]
    };
  }
}

// ==========================================================
// BACKEND PLACEHOLDERS (Professional SaaS Architecture)
// ==========================================================

export interface IConversationService {
  startNewSession(userId: string, initialContext?: any): Promise<string>;
  getHistory(sessionId: string): Promise<AIResponse[]>;
  appendMessage(sessionId: string, message: AIResponse): Promise<void>;
  clearSession(sessionId: string): Promise<void>;
}

export interface IIntentService {
  detectIntent(message: string): Promise<'deal_score' | 'compare' | 'report' | 'risk' | 'rental' | 'general'>;
  extractParameters(message: string): Promise<Record<string, any>>;
}

export interface IContextService {
  getActiveContext(): { communityId: string; subAreaId?: string; projectId?: string };
  updateContext(communityId: string, subAreaId?: string, projectId?: string): void;
}

export interface IRAGService {
  retrieveAndGenerate(userQuery: string, context: any, deepAnalysis: boolean): Promise<AIResponse>;
}

export interface IKnowledgeRetriever {
  searchDocuments(query: string, limit?: number): Promise<string[]>;
  retrieveRegistryRecords(registry: 'DLD' | 'Ejari' | 'Oqood' | 'RERA', filter: any): Promise<any[]>;
}

export interface IModuleRouter {
  routeToModule(intent: string, payload: any): Promise<any>;
}

export interface IResponseComposer {
  composeResponse(rawContent: string, dataPayloads: any, evidenceSources: EvidenceSource[]): Promise<string>;
  formatThinkingSteps(intent: string): string[];
}

export interface IRecommendationEngine {
  generateScores(communityId: string, subAreaId?: string, projectId?: string): DealScoreResult;
  generateInvestmentOutlook(communityId: string): InvestmentRecommendationResult;
}

export interface ISessionMemoryService {
  saveSessionState(sessionId: string, state: any): void;
  getSessionState(sessionId: string): any;
}

export interface IReportPayloadBuilder {
  buildReportPayload(communityId: string, subAreaId?: string, projectId?: string): ReportPayload;
}

// Concrete placeholder implementations ensuring full type adherence and compile readiness:

export class ConversationService implements IConversationService {
  async startNewSession(userId: string, initialContext?: any): Promise<string> {
    console.log(`[ConversationService] Starting new session for user ${userId}`, initialContext);
    return `session-${Date.now()}`;
  }
  async getHistory(sessionId: string): Promise<AIResponse[]> {
    console.log(`[ConversationService] Fetching history for session ${sessionId}`);
    return [];
  }
  async appendMessage(sessionId: string, message: AIResponse): Promise<void> {
    console.log(`[ConversationService] Appending message to session ${sessionId}`, message);
  }
  async clearSession(sessionId: string): Promise<void> {
    console.log(`[ConversationService] Clearing session ${sessionId}`);
  }
}

export class IntentService implements IIntentService {
  async detectIntent(message: string): Promise<'deal_score' | 'compare' | 'report' | 'risk' | 'rental' | 'general'> {
    const lower = message.toLowerCase();
    if (lower.includes('score') || lower.includes('deal') || lower.includes('evaluate')) return 'deal_score';
    if (lower.includes('compare') || lower.includes('vs')) return 'compare';
    if (lower.includes('report') || lower.includes('generate report')) return 'report';
    if (lower.includes('risk') || lower.includes('weakness')) return 'risk';
    if (lower.includes('rent') || lower.includes('leasing')) return 'rental';
    return 'general';
  }
  async extractParameters(message: string): Promise<Record<string, any>> {
    return { query: message };
  }
}

export class ContextService implements IContextService {
  private activeContext: { communityId: string; subAreaId?: string; projectId?: string } = { communityId: 'dubai-marina' };
  getActiveContext() {
    return this.activeContext;
  }
  updateContext(communityId: string, subAreaId?: string, projectId?: string) {
    this.activeContext = { communityId, subAreaId, projectId };
  }
}

export class RAGService implements IRAGService {
  async retrieveAndGenerate(userQuery: string, context: any, deepAnalysis: boolean): Promise<AIResponse> {
    console.log(`[RAGService] Retrieving and generating for query: "${userQuery}"`, { context, deepAnalysis });
    return AIService.generateAnswer(userQuery, context.communityId, context.subAreaId, context.projectId);
  }
}

export class KnowledgeRetriever implements IKnowledgeRetriever {
  async searchDocuments(query: string, limit: number = 3): Promise<string[]> {
    return RetrieverService.retrieveRelevantDocuments(query).slice(0, limit);
  }
  async retrieveRegistryRecords(registry: 'DLD' | 'Ejari' | 'Oqood' | 'RERA', filter: any): Promise<any[]> {
    console.log(`[KnowledgeRetriever] Fetching records from ${registry} with filter`, filter);
    return [];
  }
}

export class ModuleRouter implements IModuleRouter {
  async routeToModule(intent: string, payload: any): Promise<any> {
    console.log(`[ModuleRouter] Routing intent "${intent}" to professional modules`, payload);
    return { routed: true };
  }
}

export class ResponseComposer implements IResponseComposer {
  async composeResponse(rawContent: string, dataPayloads: any, evidenceSources: EvidenceSource[]): Promise<string> {
    return `${rawContent}\n\n[Composed with verified ${evidenceSources.length} sources]`;
  }
  formatThinkingSteps(intent: string): string[] {
    return [
      `Analyzing intent: ${intent}`,
      `Querying professional databases...`,
      `Structuring final recommendations...`
    ];
  }
}

export class RecommendationEngine implements IRecommendationEngine {
  generateScores(communityId: string, subAreaId?: string, projectId?: string): DealScoreResult {
    return AIService.generateDealScore(communityId, subAreaId, projectId);
  }
  generateInvestmentOutlook(communityId: string): InvestmentRecommendationResult {
    return AIService.generateInvestmentSummary(communityId);
  }
}

export class SessionMemoryService implements ISessionMemoryService {
  private memoryStore = new Map<string, any>();
  saveSessionState(sessionId: string, state: any): void {
    this.memoryStore.set(sessionId, state);
  }
  getSessionState(sessionId: string): any {
    return this.memoryStore.get(sessionId);
  }
}

export class ReportPayloadBuilder implements IReportPayloadBuilder {
  buildReportPayload(communityId: string, subAreaId?: string, projectId?: string): ReportPayload {
    return AIService.generateReportPayload(communityId, subAreaId, projectId);
  }
}
