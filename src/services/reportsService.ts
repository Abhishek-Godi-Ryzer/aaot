// Reports Engine Service for ACOT Dubai Platform
// Implements client-approved MVP reporting, templates, custom builder logic, and structured metadata.

// =========================================================================
// FUTURE INTEGRATION: WHITELABELING AND BRANDING CONSUMPTION PLACEHOLDER
// =========================================================================
// This placeholder handles retrieving and applying saved Company Branding 
// configurations to generated PDF reports, Property Proposals, and Client Documents.
// Whitelabel reports will automatically read Agent & Brokerage configuration once.
export function getReportBrandingConfigPlaceholder() {
  // In the next phase: 
  // const branding = AgentService.getBranding();
  // return {
  //   companyLogo: branding.companyInfo.companyLogo,
  //   companyName: branding.companyInfo.companyName,
  //   agentPhoto: branding.agentInfo.agentPhoto,
  //   agentName: branding.agentInfo.agentName,
  //   reraNumber: branding.agentInfo.reraNumber,
  //   reportSettings: branding.reportSettings
  // };
  return {
    ready: true,
    description: "Branding placeholder prepared for PDF and Proposal whitelabel generation"
  };
}

import { MOCK_COMMUNITIES, MarketAnalyticsService } from './marketAnalyticsService';
import { TransactionService } from './transactionService';
import { RentalService } from './rentalService';
import { InvestmentService, MortgageService, DecisionService } from './investmentService';
import { RetrieverService } from './aiService';

// ==========================================
// DATA TYPES
// ==========================================

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  estimatedPages: number;
  isPopular?: boolean;
}

export interface ReportMetadata {
  reportId: string;
  generatedOn: string;
  generatedBy: string;
  version: string;
  originModule: string;
  verifiedSources: string[];
  context: {
    communityId: string;
    communityName: string;
    subAreaId?: string;
    subAreaName?: string;
    projectId?: string;
    projectName?: string;
  };
}

export interface ReportPayload {
  metadata: ReportMetadata;
  selectedSections: string[];
  data: {
    marketSummary?: {
      averagePrice: number;
      yield: number;
      growth: number;
      demandIndex: string;
    };
    transactions?: {
      totalCount: number;
      totalVolume: number;
      avgPricePerSqft: number;
      cashRatio: string;
      mortgageRatio: string;
      highestSale: number;
    };
    rental?: {
      averageRent: number;
      grossYield: number;
      netYield: number;
      occupancy: string;
      annualChange: number;
    };
    investment?: {
      purchasePrice: number;
      annualRent: number;
      roi: number;
      annualizedReturn: number;
      monthlyEMI: number;
      annualCashFlow: number;
      rentalCoverage: number;
      rating: string;
      affordability: string;
      summary: string;
    };
    aiSummary?: {
      originalQuestion?: string;
      executiveSummary: string;
      recommendations: string[];
      risks: string[];
      opportunities: string[];
    };
  };
}

export interface GeneratedReport {
  id: string;
  name: string;
  type: string;
  contextName: string;
  generatedOn: string;
  status: 'Completed' | 'Pending' | 'Failed';
  payload: ReportPayload;
}

// ==========================================
// TEMPLATE SECTIONS
// ==========================================

export const ALL_REPORT_SECTIONS = [
  { id: 'executive_summary', name: 'Executive Summary', category: 'Summary' },
  { id: 'market_analytics', name: 'Market Analytics', category: 'Market' },
  { id: 'community_analysis', name: 'Community Analysis', category: 'Market' },
  { id: 'maps_snapshot', name: 'Maps Snapshot', category: 'Market' },
  { id: 'transaction_intelligence', name: 'Transaction Intelligence', category: 'Transactions' },
  { id: 'rental_intelligence', name: 'Rental Intelligence', category: 'Rentals' },
  { id: 'investment_tools', name: 'Investment Tools & Financing', category: 'Finance' },
  { id: 'ai_executive_summary', name: 'AI Executive Summary', category: 'AI' },
  { id: 'deal_score', name: 'Deal Score Analysis', category: 'AI' },
  { id: 'supporting_evidence', name: 'Supporting Evidence (DLD Logs)', category: 'Audit' },
  { id: 'risk_assessment', name: 'Risk Assessment', category: 'Audit' },
  { id: 'recommendations', name: 'Strategic Recommendations', category: 'Audit' },
  { id: 'appendix', name: 'Platform Appendix', category: 'Audit' }
];

// ==========================================
// REPORT PAYLOAD SERVICE
// ==========================================

export class ReportPayloadService {
  static prepareMetadata(
    context: { communityId: string; subAreaId?: string; projectId?: string },
    originModule: string = 'Reports Engine'
  ): ReportMetadata {
    const reportId = 'REP-' + Math.floor(100000 + Math.random() * 900000);
    const comm = MOCK_COMMUNITIES.find(c => c.id === context.communityId) || MOCK_COMMUNITIES[0];
    
    return {
      reportId,
      generatedOn: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit' }),
      generatedBy: 'ACOT Investor Platform',
      version: 'v2.4.0-mvp',
      originModule,
      verifiedSources: ['Dubai Land Department (DLD)', 'Ejari Rental Registry', 'RERA Index', 'ACOT Grounded AI Core'],
      context: {
        communityId: context.communityId,
        communityName: comm.name,
        subAreaId: context.subAreaId,
        subAreaName: context.subAreaId && context.subAreaId !== 'all' ? 'Sub-area ' + context.subAreaId : 'All Sub-areas',
        projectId: context.projectId,
        projectName: context.projectId && context.projectId !== 'all' ? 'Project ' + context.projectId : 'All Projects'
      }
    };
  }

  static async buildPayload(
    context: { communityId: string; subAreaId?: string; projectId?: string },
    originModule: string,
    sections: string[]
  ): Promise<ReportPayload> {
    const metadata = this.prepareMetadata(context, originModule);
    const commId = context.communityId;
    const communityObj = MOCK_COMMUNITIES.find(c => c.id === commId) || MOCK_COMMUNITIES[0];

    // 1. Gather Market Analytics
    const marketSummary = {
      averagePrice: communityObj.avgPrice,
      yield: communityObj.yield,
      growth: communityObj.growth,
      demandIndex: communityObj.growth > 15 ? 'High Demand' : 'Moderate'
    };

    // 2. Gather Transaction Highlights (Synchronous from TransactionService)
    const txHighlights = TransactionService.getHighlights(commId, context.subAreaId, context.projectId);
    const txData = {
      totalCount: txHighlights.totalTransactionsCount || 140,
      totalVolume: txHighlights.totalVolumeAed || 342000000,
      avgPricePerSqft: txHighlights.averagePriceSqft || communityObj.avgPrice,
      cashRatio: '68%',
      mortgageRatio: '32%',
      highestSale: txHighlights.highestSalePrice || 14500000
    };

    // 3. Gather Rental Highlights (Asynchronous from RentalService)
    const rentalOverview = await RentalService.getOverview(commId, context.subAreaId, context.projectId);
    const rentalData = {
      averageRent: rentalOverview.averageAnnualRent || 142500,
      grossYield: rentalOverview.grossYield || communityObj.yield,
      netYield: rentalOverview.netYield || (rentalOverview.grossYield ? rentalOverview.grossYield - 1.2 : 5.8),
      occupancy: '94.2%',
      annualChange: rentalOverview.annualRentChange || 12.4
    };

    // 4. Gather Investor Tools Metrics
    const purchasePrice = txData.avgPricePerSqft * 1200; // standard 1200 sqft apartment
    const annualRent = rentalData.averageRent;
    const roiResults = InvestmentService.calculateROI({
      purchasePrice,
      annualRent,
      holdingPeriod: 5,
      expectedAppreciation: 5.5,
      serviceCharges: 5,
      maintenanceCost: 2,
      managementFee: 5,
      vacancyRate: 5
    });
    const mortgageResults = MortgageService.calculateMortgage({
      purchasePrice,
      downPaymentPercent: 25,
      interestRate: 4.25,
      loanTenure: 25,
      processingFeePercent: 1,
      bankFee: 2500
    });
    const decisionResults = DecisionService.generateInvestmentDecision(roiResults, mortgageResults, annualRent);

    const investment = {
      purchasePrice,
      annualRent,
      roi: roiResults.roi,
      annualizedReturn: roiResults.annualizedReturn,
      monthlyEMI: mortgageResults.monthlyEMI,
      annualCashFlow: decisionResults.estimatedAnnualCashFlow,
      rentalCoverage: decisionResults.rentalIncomeCoverage,
      rating: decisionResults.investmentRating,
      affordability: decisionResults.affordabilityIndicator,
      summary: decisionResults.executiveSummary
    };

    // 5. Gather AI Insights (Simulated from RetrieverService)
    const aiSummary = {
      executiveSummary: `${metadata.context.communityName} displays robust micro-market stability. With a Gross Yield of ${rentalData.grossYield}% and solid 3-year historical growth of ${marketSummary.growth}%, the asset class represents an institutional-grade core holding.`,
      recommendations: [
        'Prioritize high-floor 2-bedroom configurations for maximal rental coverage.',
        'Optimize leverage to a maximum of 65% LTV to maintain comfortable cash-flow safety boundaries.',
        'Reinvest rental yield into debt-reduction cycles to compound net yield bounds.'
      ],
      risks: [
        'New premium residential handovers scheduled for late 2027 may lead to temporary supply elasticity.',
        'Interest rate volatility could compress marginal cash-flow cushions.'
      ],
      opportunities: [
        'Strong capital migration from European markets continues to bolster prime property values.',
        'High short-term lease premiums (holiday homes) offer an additional 15-20% gross yield uplift.'
      ]
    };

    return {
      metadata,
      selectedSections: sections,
      data: {
        marketSummary,
        transactions: txData,
        rental: rentalData,
        investment,
        aiSummary
      }
    };
  }
}

// ==========================================
// TEMPLATE SERVICE
// ==========================================

export class TemplateService {
  static loadTemplate(templateId: string): { name: string; defaultSections: string[] } {
    switch (templateId) {
      case 'exec-invest':
        return {
          name: 'Executive Investment Report',
          defaultSections: ['executive_summary', 'market_analytics', 'investment_tools', 'ai_executive_summary', 'deal_score', 'risk_assessment']
        };
      case 'comm-intel':
        return {
          name: 'Community Intelligence Report',
          defaultSections: ['community_analysis', 'market_analytics', 'maps_snapshot', 'supporting_evidence', 'appendix']
        };
      case 'tx-activity':
        return {
          name: 'Transaction Activity Report',
          defaultSections: ['transaction_intelligence', 'supporting_evidence', 'market_analytics', 'appendix']
        };
      case 'rental-perf':
        return {
          name: 'Rental Performance Report',
          defaultSections: ['rental_intelligence', 'market_analytics', 'risk_assessment', 'appendix']
        };
      case 'invest-decision':
        return {
          name: 'Investment Decision Report',
          defaultSections: ['investment_tools', 'deal_score', 'risk_assessment', 'recommendations', 'executive_summary']
        };
      default:
        return {
          name: 'Custom Portfolio Report',
          defaultSections: ['executive_summary', 'market_analytics', 'appendix']
        };
    }
  }

  static compileReport(payload: ReportPayload, sections: string[]): ReportPayload {
    return {
      ...payload,
      selectedSections: sections
    };
  }

  static exportPDF(report: GeneratedReport): string {
    return `/downloads/ACOT_Report_${report.payload.metadata.reportId}_${Date.now()}.pdf`;
  }

  static exportDOCX(report: GeneratedReport): string {
    return `/downloads/ACOT_Report_${report.payload.metadata.reportId}_${Date.now()}.docx`;
  }
}

// ==========================================
// REPORTS CENTRALIZED SERVICE
// ==========================================

const INITIAL_REPORTS_KEY = 'acot_recent_reports_v1';

const DEFAULT_RECENT_REPORTS: GeneratedReport[] = [
  {
    id: '1',
    name: 'Executive Investment Report - Dubai Marina',
    type: 'Executive',
    contextName: 'Dubai Marina • All Projects',
    generatedOn: '14 Jul 2026, 09:30 AM',
    status: 'Completed',
    payload: {
      metadata: {
        reportId: 'REP-741029',
        generatedOn: '14 Jul 2026, 09:30 AM',
        generatedBy: 'ACOT Investor Platform',
        version: 'v2.4.0-mvp',
        originModule: 'Reports Engine',
        verifiedSources: ['Dubai Land Department (DLD)', 'Ejari Rental Registry'],
        context: {
          communityId: 'dubai-marina',
          communityName: 'Dubai Marina'
        }
      },
      selectedSections: ['executive_summary', 'market_analytics', 'investment_tools', 'ai_executive_summary', 'deal_score'],
      data: {
        marketSummary: { averagePrice: 1654, yield: 7.2, growth: 28.4, demandIndex: 'High Demand' },
        transactions: { totalCount: 182, totalVolume: 423000000, avgPricePerSqft: 1654, cashRatio: '68%', mortgageRatio: '32%', highestSale: 24000000 },
        rental: { averageRent: 142500, grossYield: 7.2, netYield: 5.9, occupancy: '94%', annualChange: 14.2 },
        investment: {
          purchasePrice: 1980000,
          annualRent: 142500,
          roi: 58.4,
          annualizedReturn: 11.68,
          monthlyEMI: 8350,
          annualCashFlow: 14200,
          rentalCoverage: 112.5,
          rating: 'Excellent',
          affordability: 'Low Risk',
          summary: 'Excellent Investment profile. Recommended holding period exceeds 5 years.'
        }
      }
    }
  },
  {
    id: '2',
    name: 'Rental Performance Report - Dubai Marina',
    type: 'Rental',
    contextName: 'Dubai Marina • All Projects',
    generatedOn: '12 Jul 2026, 04:20 PM',
    status: 'Completed',
    payload: {
      metadata: {
        reportId: 'REP-194052',
        generatedOn: '12 Jul 2026, 04:20 PM',
        generatedBy: 'ACOT Investor Platform',
        version: 'v2.4.0-mvp',
        originModule: 'Rental Intelligence',
        verifiedSources: ['Ejari Rental Registry', 'RERA Index'],
        context: {
          communityId: 'dubai-marina',
          communityName: 'Dubai Marina'
        }
      },
      selectedSections: ['rental_intelligence', 'market_analytics', 'appendix'],
      data: {
        marketSummary: { averagePrice: 1654, yield: 7.2, growth: 28.4, demandIndex: 'High Demand' },
        rental: { averageRent: 142500, grossYield: 7.2, netYield: 5.9, occupancy: '94%', annualChange: 14.2 }
      }
    }
  },
  {
    id: '3',
    name: 'Transaction Activity Report - Downtown Dubai',
    type: 'Transaction',
    contextName: 'Downtown Dubai • All Projects',
    generatedOn: '10 Jul 2026, 11:15 AM',
    status: 'Completed',
    payload: {
      metadata: {
        reportId: 'REP-810592',
        generatedOn: '10 Jul 2026, 11:15 AM',
        generatedBy: 'ACOT Investor Platform',
        version: 'v2.4.0-mvp',
        originModule: 'Transaction Intelligence',
        verifiedSources: ['Dubai Land Department (DLD)'],
        context: {
          communityId: 'downtown-dubai',
          communityName: 'Downtown Dubai'
        }
      },
      selectedSections: ['transaction_intelligence', 'supporting_evidence', 'appendix'],
      data: {
        marketSummary: { averagePrice: 2245, yield: 6.1, growth: 18.2, demandIndex: 'Moderate' },
        transactions: { totalCount: 142, totalVolume: 512000000, avgPricePerSqft: 2245, cashRatio: '72%', mortgageRatio: '28%', highestSale: 39000000 }
      }
    }
  }
];

export class ReportsService {
  private static getStoredReports(): GeneratedReport[] {
    try {
      const stored = localStorage.getItem(INITIAL_REPORTS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to parse stored reports', e);
    }
    // Seed default records
    localStorage.setItem(INITIAL_REPORTS_KEY, JSON.stringify(DEFAULT_RECENT_REPORTS));
    return DEFAULT_RECENT_REPORTS;
  }

  private static setStoredReports(reports: GeneratedReport[]) {
    localStorage.setItem(INITIAL_REPORTS_KEY, JSON.stringify(reports));
  }

  static getTemplates(): ReportTemplate[] {
    return [
      {
        id: 'exec-invest',
        name: 'Executive Investment Report',
        description: 'Complete investment analysis with market, rental, financials and AI recommendation.',
        estimatedPages: 6,
        isPopular: true
      },
      {
        id: 'comm-intel',
        name: 'Community Intelligence Report',
        description: 'In-depth community analysis including market trends, growth and performance.',
        estimatedPages: 4
      },
      {
        id: 'tx-activity',
        name: 'Transaction Activity Report',
        description: 'Detailed transactions analysis with price trends, volumes, liquidity and buyer insights.',
        estimatedPages: 5
      },
      {
        id: 'rental-perf',
        name: 'Rental Performance Report',
        description: 'Comprehensive rental analysis including yields, demand, supply and performance metrics.',
        estimatedPages: 4
      },
      {
        id: 'invest-decision',
        name: 'Investment Decision Report',
        description: 'Financial analysis with ROI, cash flow, mortgage and AI investment recommendation.',
        estimatedPages: 4
      }
    ];
  }

  static getRecentReports(): GeneratedReport[] {
    return this.getStoredReports();
  }

  static async generateReport(
    templateId: string,
    context: { communityId: string; subAreaId?: string; projectId?: string }
  ): Promise<GeneratedReport> {
    const template = this.getTemplates().find(t => t.id === templateId) || this.getTemplates()[0];
    const { name, defaultSections } = TemplateService.loadTemplate(templateId);

    const payload = await ReportPayloadService.buildPayload(context, 'Reports Engine', defaultSections);
    const commName = payload.metadata.context.communityName;
    const subName = payload.metadata.context.subAreaId && payload.metadata.context.subAreaId !== 'all' ? ` • Sub-area` : '';
    
    const newReport: GeneratedReport = {
      id: 'REP-' + Date.now(),
      name: `${name} - ${commName}`,
      type: templateId === 'exec-invest' ? 'Executive' : templateId === 'rental-perf' ? 'Rental' : templateId === 'tx-activity' ? 'Transaction' : templateId === 'comm-intel' ? 'Community' : 'Investment',
      contextName: `${commName}${subName || ' • All Projects'}`,
      generatedOn: new Date().toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }) + ', ' + new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      status: 'Completed',
      payload
    };

    const current = this.getStoredReports();
    const updated = [newReport, ...current];
    this.setStoredReports(updated);

    return newReport;
  }

  static async generateCustomReport(
    name: string,
    sections: string[],
    context: { communityId: string; subAreaId?: string; projectId?: string }
  ): Promise<GeneratedReport> {
    const payload = await ReportPayloadService.buildPayload(context, 'Custom Report Builder', sections);
    const commName = payload.metadata.context.communityName;

    const newReport: GeneratedReport = {
      id: 'REP-' + Date.now(),
      name: name || `Custom Portfolio Report - ${commName}`,
      type: 'Custom',
      contextName: `${commName} • Custom Selection`,
      generatedOn: new Date().toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }) + ', ' + new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      status: 'Completed',
      payload
    };

    const current = this.getStoredReports();
    const updated = [newReport, ...current];
    this.setStoredReports(updated);

    return newReport;
  }

  static async generateContextReport(
    originModule: string,
    context: { communityId: string; subAreaId?: string; projectId?: string },
    additionalData?: any
  ): Promise<GeneratedReport> {
    let sections: string[] = ['executive_summary', 'market_analytics', 'appendix'];
    let typeName = 'Context';
    let reportNamePrefix = 'Market Intelligence Report';

    if (originModule === 'Transaction Intelligence') {
      sections = ['transaction_intelligence', 'supporting_evidence', 'market_analytics', 'appendix'];
      typeName = 'Transaction';
      reportNamePrefix = 'Transaction Performance Report';
    } else if (originModule === 'Rental Intelligence') {
      sections = ['rental_intelligence', 'market_analytics', 'risk_assessment', 'appendix'];
      typeName = 'Rental';
      reportNamePrefix = 'Rental Intelligence Report';
    } else if (originModule === 'Investor Tools') {
      sections = ['investment_tools', 'deal_score', 'risk_assessment', 'recommendations'];
      typeName = 'Investment';
      reportNamePrefix = 'Investment Portfolio Report';
    }

    const payload = await ReportPayloadService.buildPayload(context, originModule, sections);
    if (additionalData) {
      payload.data = { ...payload.data, ...additionalData };
    }
    
    const commName = payload.metadata.context.communityName;

    const newReport: GeneratedReport = {
      id: 'REP-' + Date.now(),
      name: `${reportNamePrefix} - ${commName}`,
      type: typeName,
      contextName: `${commName} • ${originModule} Link`,
      generatedOn: new Date().toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }) + ', ' + new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      status: 'Completed',
      payload
    };

    const current = this.getStoredReports();
    const updated = [newReport, ...current];
    this.setStoredReports(updated);

    return newReport;
  }

  static async generateAIReport(
    originalQuestion: string,
    aiSummaryText: string,
    context: { communityId: string; subAreaId?: string; projectId?: string }
  ): Promise<GeneratedReport> {
    const sections = ['ai_executive_summary', 'deal_score', 'risk_assessment', 'recommendations', 'executive_summary'];
    const payload = await ReportPayloadService.buildPayload(context, 'AI Intelligence Suite', sections);
    
    payload.data.aiSummary = {
      originalQuestion,
      executiveSummary: aiSummaryText || payload.data.aiSummary?.executiveSummary || 'AI Summary of historical trends and risk assessments.',
      recommendations: [
        'Perform stress-testing based on the specified parameters.',
        'Compare multi-community performance vectors to minimize local beta exposure.'
      ],
      risks: [
        'Geographic concentration risks on secondary residential sectors.',
        'Fluctuating leverage rates inside high-spec sub-areas.'
      ],
      opportunities: [
        'Core development phase updates present discount entry coordinates.'
      ]
    };

    const commName = payload.metadata.context.communityName;

    const newReport: GeneratedReport = {
      id: 'REP-' + Date.now(),
      name: `AI Executive Report - ${commName}`,
      type: 'AI',
      contextName: `${commName} • AI Briefing`,
      generatedOn: new Date().toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }) + ', ' + new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      status: 'Completed',
      payload
    };

    const current = this.getStoredReports();
    const updated = [newReport, ...current];
    this.setStoredReports(updated);

    return newReport;
  }

  static downloadReport(id: string, format: 'PDF' | 'DOCX' | 'Print'): string {
    const report = this.getStoredReports().find(r => r.id === id);
    if (!report) return '';
    return format === 'PDF' ? TemplateService.exportPDF(report) : format === 'DOCX' ? TemplateService.exportDOCX(report) : 'print';
  }

  static duplicateReport(id: string): GeneratedReport | null {
    const current = this.getStoredReports();
    const target = current.find(r => r.id === id);
    if (!target) return null;

    const duplicated: GeneratedReport = {
      ...target,
      id: 'REP-' + Date.now(),
      name: `${target.name} (Copy)`,
      generatedOn: new Date().toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }) + ', ' + new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    };

    this.setStoredReports([duplicated, ...current]);
    return duplicated;
  }

  static deleteReport(id: string): boolean {
    const current = this.getStoredReports();
    const filtered = current.filter(r => r.id !== id);
    this.setStoredReports(filtered);
    return filtered.length < current.length;
  }
}
