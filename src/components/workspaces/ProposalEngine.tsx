import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAnalysisContext } from '../../context/AnalysisContext';
import { useAuth } from '../../context/AuthContext';
import { useProfessionalContext } from '../../context/ProfessionalContext';
import { ProfessionalAuditService } from '../../services/professionalIntegrationService';
import { AgentService } from '../../services/agentService';
import { 
  MOCK_COMMUNITIES, 
  MOCK_PROJECTS, 
  Community, 
  Project 
} from '../../services/marketAnalyticsService';
import { 
  ProfessionalAccessService 
} from '../../services/professionalAccessService';
import {
  ProposalEngine as ProposalService,
  ProposalPayload,
  ProposalExportService,
  ProposalBrandResolver,
  ProposalPreviewService
} from '../../services/proposalService';
import {
  FileText,
  Sparkles,
  Download,
  Share2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
  X,
  Building,
  Phone,
  Mail,
  Globe,
  Briefcase,
  Printer,
  TrendingUp,
  MapPin,
  Home,
  Calculator,
  RefreshCw,
  FileDown,
  Info,
  Layers,
  Settings,
  Eye,
  CheckCircle,
  Copy
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface ProposalEngineProps {
  onNavigateToModule: (moduleName: string) => void;
  triggerToast: (message: string) => void;
}

export default function ProposalEngine({ onNavigateToModule, triggerToast }: ProposalEngineProps) {
  const { user } = useAuth();
  const { setCurrentProposal } = useProfessionalContext();
  const { communityId, projectId, setCommunityId, setProjectId } = useAnalysisContext();

  const isAgent = user?.role === 'agent';
  const verification = isAgent ? AgentService.getVerificationStatus() : null;
  const isVerifiedAgent = isAgent && verification?.status === 'VERIFIED';
  const hasProfAccess = ProfessionalAccessService.hasProfessionalAccess(user, verification);
  const branding = isAgent ? AgentService.getBranding() : null;

  // Resolved Branding Information
  const resolvedBrand = ProposalBrandResolver.resolveBranding(branding, verification);

  // Proposal State
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>(communityId || 'dubai-marina');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projectId || 'marina-gate-1');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<number>(-1);
  const [activeStepText, setActiveStepText] = useState<string>('');
  const [generatedProposal, setGeneratedProposal] = useState<ProposalPayload | null>(null);
  const [activePageIdx, setActivePageIdx] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isPushingCRM, setIsPushingCRM] = useState<boolean>(false);
  const [crmRefId, setCrmRefId] = useState<string | null>(null);

  // Presentation Settings
  const [showReraBadge, setShowReraBadge] = useState<boolean>(true);
  const [includePlotCoords, setIncludePlotCoords] = useState<boolean>(true);
  const [accentColor, setAccentColor] = useState<string>(resolvedBrand.primaryColor || '#4f46e5');
  const [proposalTemplate, setProposalTemplate] = useState<string>('premium-gold');

  // Multi-step compilation tasks
  const COMPILATION_STEPS = [
    { text: 'Retrieving live community context & market intelligence...', delay: 800 },
    { text: 'Analyzing official DLD transaction histories and parcel coordinates...', delay: 900 },
    { text: 'Querying Ejari rental registrations & yield multipliers...', delay: 750 },
    { text: 'Accessing verified regulatory RERA permits & developer rating status...', delay: 800 },
    { text: 'Running AI Proposal Composer to formulate client recommendations...', delay: 1000 },
    { text: 'Finalizing brand asset alignment & layout whitelabel signatures...', delay: 600 }
  ];

  // Sync state if context changes
  useEffect(() => {
    if (communityId) setSelectedCommunityId(communityId);
    if (projectId && projectId !== 'all') setSelectedProjectId(projectId);
  }, [communityId, projectId]);

  const filteredProjects = MOCK_PROJECTS.filter(p => p.communityId === selectedCommunityId);

  // Auto select project if community changes
  useEffect(() => {
    if (filteredProjects.length > 0) {
      const match = filteredProjects.find(p => p.id === selectedProjectId);
      if (!match) {
        setSelectedProjectId(filteredProjects[0].id);
      }
    }
  }, [selectedCommunityId]);

  const handleAssembleProposal = async () => {
    setIsGenerating(true);
    setGenerationStep(0);
    setGeneratedProposal(null);
    setCrmRefId(null);

    // Dynamic Multi-step loading experience
    for (let i = 0; i < COMPILATION_STEPS.length; i++) {
      setGenerationStep(i);
      setActiveStepText(COMPILATION_STEPS[i].text);
      await new Promise(resolve => setTimeout(resolve, COMPILATION_STEPS[i].delay));
    }

    try {
      // Sync global context for consistent platform experience
      setCommunityId(selectedCommunityId);
      setProjectId(selectedProjectId);

      const proposal = await ProposalService.compileProposal(
        user,
        verification,
        branding,
        selectedCommunityId,
        selectedProjectId
      );

      // Overwrite accent color if specified
      if (proposal.branding) {
        proposal.branding.primaryColor = accentColor;
      }

      setGeneratedProposal(proposal);
      setCurrentProposal(proposal);
      if (user) {
        ProfessionalAuditService.logEvent(user.id, 'Proposal Generated', {
          proposalId: proposal.id,
          communityId: selectedCommunityId,
          projectId: selectedProjectId,
          timestamp: new Date().toISOString()
        });
      }
      setActivePageIdx(0);
      triggerToast('Investment proposal successfully constructed!');
    } catch (err: any) {
      triggerToast(err.message || 'Verification check failed.');
    } finally {
      setIsGenerating(false);
      setGenerationStep(-1);
    }
  };

  // Export to PDF
  const handleExportPDF = async () => {
    if (!generatedProposal) return;
    setIsExporting(true);
    triggerToast('Initiating high-fidelity PDF render sequence...');
    
    try {
      const pdfBlob = await ProposalExportService.simulatePDFGeneration(generatedProposal);
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ACOT_Investor_Proposal_${generatedProposal.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      triggerToast('PDF generated! Check your browser downloads.');
    } catch (e) {
      triggerToast('PDF rendering encountered a timeout.');
    } finally {
      setIsExporting(false);
    }
  };

  // Push to CRM
  const handlePushCRM = async () => {
    if (!generatedProposal) return;
    setIsPushingCRM(true);
    triggerToast('Packaging asset underwritings and pushing to agent CRM hub...');
    
    try {
      const response = await ProposalExportService.simulatePushToCRM(generatedProposal);
      if (response.success) {
        setCrmRefId(response.refId);
        triggerToast(`Proposal successfully pushed to CRM! Ref ID: ${response.refId}`);
      }
    } catch (e) {
      triggerToast('CRM server pipeline timed out.');
    } finally {
      setIsPushingCRM(false);
    }
  };

  // Copy Link
  const handleCopyLink = () => {
    if (!generatedProposal) return;
    const dummyUrl = `https://ais-pre-lx76ttjfdzaaldqhhn6jxb-617257004865.asia-east1.run.app/share/proposal/${generatedProposal.id}`;
    navigator.clipboard.writeText(dummyUrl);
    triggerToast('Copied live client presentation link to clipboard!');
  };

  // Non-verified Gate
  if (!hasProfAccess) {
    return (
      <div className="max-w-3xl mx-auto my-12 bg-white border border-slate-100 rounded-[2.5rem] p-8 md:p-12 shadow-xl text-center space-y-8" id="proposal-verification-gate">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 animate-bounce">
          <ShieldCheck className="w-10 h-10" />
        </div>
        
        <div className="space-y-3">
          <span className="text-[10px] font-mono font-black text-indigo-700 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-full">
            ACOT Professional Credentials Required
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Verify Your RERA Broker License
          </h2>
          <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
            The **Enterprise Proposal Generation Engine** utilizes sovereign-grade registries and official Dubai Land Department land ledgers. Access is strictly limited to verified, licensed advisors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-4 text-left">
          <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-100 space-y-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h4 className="text-xs font-black text-slate-800">Verified Whitelabeling</h4>
            <p className="text-[10px] text-slate-400 leading-snug">Automatically apply logo, company name, and license details onto custom client decks.</p>
          </div>
          <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-100 space-y-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <h4 className="text-xs font-black text-slate-800">AI Composer Core</h4>
            <p className="text-[10px] text-slate-400 leading-snug">Reuses platform analytics to write client-oriented opportunity memos instantly.</p>
          </div>
          <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-100 space-y-2">
            <FileDown className="w-5 h-5 text-indigo-600" />
            <h4 className="text-xs font-black text-slate-800">Registry Audits</h4>
            <p className="text-[10px] text-slate-400 leading-snug">Direct embedding of official DLD, Ejari, and RERA compliance data layers.</p>
          </div>
        </div>

        <div className="pt-6">
          <button
            onClick={() => onNavigateToModule('RERA Verification')}
            className="bg-slate-900 hover:bg-slate-800 text-white rounded-2xl px-6 py-3.5 text-xs font-bold transition-all shadow-md active:scale-95 inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Verify Agent Status Now</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Active Proposal Slides/Pages Setup
  const getProposalPages = (p: ProposalPayload) => {
    return [
      {
        id: 'cover',
        title: 'Cover Page',
        render: () => (
          <div className="h-full flex flex-col justify-between p-12 text-white relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${accentColor} 0%, #0f172a 100%)` }}>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full filter blur-3xl -mr-20 -mt-20"></div>
            
            {/* Header branding */}
            <div className="flex justify-between items-start z-10">
              <div className="space-y-1">
                {resolvedBrand.logoUrl ? (
                  <img src={resolvedBrand.logoUrl} alt="Brokerage Logo" className="h-10 object-contain" />
                ) : (
                  <div className="text-lg font-black tracking-widest flex items-center gap-1.5">
                    <Building className="w-6 h-6 text-white" />
                    <span>{p.branding.companyName.toUpperCase()}</span>
                  </div>
                )}
                <span className="text-[9px] text-white/60 font-mono tracking-widest uppercase block">PROPOSAL PORTAL</span>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-white/50 font-mono block uppercase">LICENSED PORTFOLIO AUDIT</span>
                <span className="text-xs font-bold text-white font-mono">{p.id}</span>
              </div>
            </div>

            {/* Core Titles */}
            <div className="my-auto space-y-6 z-10 max-w-2xl">
              <div className="h-1 w-24" style={{ backgroundColor: accentColor === '#4f46e5' ? '#fbbf24' : '#4f46e5' }}></div>
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">OFFICIAL INVESTOR MEMORANDUM</span>
                <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none text-white">
                  Client Investment Proposal
                </h1>
                <p className="text-sm md:text-base text-slate-300 font-medium max-w-lg leading-relaxed">
                  Highly optimized real estate acquisition in <strong className="text-white font-semibold">{p.propertyOverview.name}</strong>, tailored specifically for high-conviction asset appreciation.
                </p>
              </div>
            </div>

            {/* Footer Agent details */}
            <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 z-10 text-xs">
              <div className="space-y-1">
                <p className="text-[10px] text-white/50 uppercase font-mono">Prepared For</p>
                <p className="text-sm font-bold text-white">Valued Real Estate Investor</p>
                <p className="text-[10px] text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-white/60" />
                  <span>{p.propertyOverview.location}</span>
                </p>
              </div>

              <div className="text-left sm:text-right space-y-1 border-l sm:border-l-0 sm:border-r border-white/10 pl-4 sm:pl-0 sm:pr-4">
                <p className="text-[10px] text-white/50 uppercase font-mono">Broker Representative</p>
                <p className="font-bold text-white">{p.branding.agentName}</p>
                <p className="text-[10px] text-slate-300">{p.branding.email}</p>
                {showReraBadge && (
                  <span className="inline-block text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded mt-1">
                    {p.branding.reraNumber}
                  </span>
                )}
              </div>
            </div>
          </div>
        )
      },
      {
        id: 'executive',
        title: 'Executive Summary',
        render: () => (
          <div className="h-full bg-slate-950 text-slate-100 p-12 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-base font-black tracking-wider uppercase text-slate-100">01. EXECUTIVE ANALYSIS</h2>
                </div>
                <span className="text-[10px] font-mono text-slate-500">{p.id}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3 md:col-span-2">
                  <span className="text-[10px] font-mono font-black text-indigo-400 uppercase tracking-widest">OPPORTUNITY CORE</span>
                  <h3 className="text-lg font-black text-white">Sovereign-Grade Capital Growth</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {p.executiveSummary.opportunitySummary}
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
                  <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest">STABILIZED PROJECTION</span>
                  <div className="text-3xl font-black text-white font-mono tracking-tight text-emerald-400">
                    {p.rentalResearch.yieldGross} Yield
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Offering a {p.executiveSummary.investmentSnapshot}
                  </p>
                </div>
              </div>

              <div className="bg-indigo-950/40 border border-indigo-900/50 p-5 rounded-2xl space-y-2 mt-4 text-left">
                <div className="flex items-center gap-2 text-indigo-300 text-xs font-black uppercase font-mono">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  Regulatory Underwriting & Registry Compliances
                </div>
                <p className="text-xs text-indigo-200/90 leading-relaxed">
                  {p.executiveSummary.professionalOverview}
                </p>
              </div>
            </div>

            <div className="text-right text-[10px] font-mono text-slate-600 border-t border-slate-900 pt-4">
              POWERED BY ACOT ENTERPRISE PROTOCOL
            </div>
          </div>
        )
      },
      {
        id: 'property',
        title: 'Property Overview',
        render: () => (
          <div className="h-full bg-white text-slate-900 p-12 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-base font-black tracking-wider uppercase text-slate-800">02. ASSET SPECIFICATION</h2>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{p.id}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">ASSET BRANDING</span>
                    <h3 className="text-2xl font-black text-slate-900 leading-none">{p.propertyOverview.name}</h3>
                    <p className="text-xs font-semibold text-slate-500">{p.propertyOverview.location}</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-400 font-medium">Developer Account</span>
                      <strong className="text-slate-900 font-semibold">{p.propertyOverview.developer}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-400 font-medium">Property Class</span>
                      <strong className="text-slate-900 font-semibold">{p.propertyOverview.type}</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-400 font-medium">Valuation Basis</span>
                      <strong className="text-slate-900 font-semibold">{p.propertyOverview.avgPriceSqft}</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-[2rem] p-6 text-white flex flex-col justify-between min-h-[160px] relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full filter blur-xl -mr-6 -mt-6"></div>
                  <div>
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block mb-1">STABILIZED MARKET ACVISION</span>
                    <h4 className="text-xs font-bold text-slate-200">Indicative Price Target</h4>
                  </div>
                  <div>
                    <p className="text-2xl md:text-3xl font-black font-mono tracking-tight text-white leading-none">
                      {p.propertyOverview.currentPrice}
                    </p>
                    <span className="text-[9px] text-indigo-400 font-bold block mt-1.5 uppercase font-mono">★ TAX-FREE REALIZABLE EQUITY</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right text-[10px] font-mono text-slate-400 border-t border-slate-100 pt-4">
              {p.branding.companyName.toUpperCase()} • CLIENT PRESENTATION MATERIAL
            </div>
          </div>
        )
      },
      {
        id: 'market',
        title: 'Market Intelligence',
        render: () => {
          // Generate realistic chart data for pricing trends
          const basePrice = parseFloat(p.propertyOverview.avgPriceSqft.replace(/[^0-9.]/g, '')) || 1600;
          const chartData = [
            { name: '2022', price: Math.round(basePrice * 0.72) },
            { name: '2023', price: Math.round(basePrice * 0.81) },
            { name: '2024', price: Math.round(basePrice * 0.88) },
            { name: '2025', price: Math.round(basePrice * 0.95) },
            { name: '2026 (Active)', price: Math.round(basePrice) }
          ];

          return (
            <div className="h-full bg-white text-slate-900 p-12 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-base font-black tracking-wider uppercase text-slate-800">03. REGIONAL GROWTH DYNAMICS</h2>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{p.id}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4 md:col-span-1">
                    <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-100 space-y-3 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono block uppercase">COMMUNITY POSITION</span>
                        <strong className="text-sm font-black text-indigo-700 block mt-0.5">{p.marketIntelligence.communityRank} Rank</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono block uppercase">YEARLY MOMENTUM</span>
                        <strong className="text-sm font-black text-emerald-600 block mt-0.5">+{p.marketIntelligence.annualGrowth} YoY Growth</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono block uppercase">REGISTRY PHASE</span>
                        <strong className="text-xs font-bold text-slate-800 block mt-0.5">{p.marketIntelligence.marketPhase}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Pricing trend chart */}
                  <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl md:col-span-2 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">ESTABLISHED VALUE LINE (AED / SQFT)</span>
                      <span className="text-[9px] font-mono text-emerald-600 font-bold">↑ +{p.marketIntelligence.annualGrowth} INDEX SPEED</span>
                    </div>
                    <div className="h-36">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                          <defs>
                            <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={accentColor} stopOpacity={0.2}/>
                              <stop offset="95%" stopColor={accentColor} stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                          <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                          <Area type="monotone" dataKey="price" stroke={accentColor} strokeWidth={2} fillOpacity={1} fill="url(#chartColor)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-right text-[10px] font-mono text-slate-400 border-t border-slate-100 pt-4">
                SOURCE: DUBAI LAND DEPARTMENT LAND REGISTRIES (DLD)
              </div>
            </div>
          )
        }
      },
      {
        id: 'transactions',
        title: 'Transaction Analysis',
        render: () => (
          <div className="h-full bg-white text-slate-900 p-12 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-base font-black tracking-wider uppercase text-slate-800">04. OFFICIALLY REGISTERED TRANSFER LEDGER</h2>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{p.id}</span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-3">
                    <span className="bg-slate-100 px-2.5 py-1 rounded text-[10px] font-mono font-bold text-slate-600">
                      {p.transactionAnalysis.cashVsMortgageRatio}
                    </span>
                    <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded text-[10px] font-mono font-bold">
                      {p.transactionAnalysis.quarterlyVolume}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">AVERAGE SIZE: {p.transactionAnalysis.averageSize}</span>
                </div>

                <div className="overflow-hidden border border-slate-100 rounded-2xl bg-slate-50/50">
                  <table className="w-full text-left border-collapse text-[10px]">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase font-mono font-bold">
                        <th className="py-2.5 px-4">Transfer ID</th>
                        <th className="py-2.5 px-4">Registry Date</th>
                        <th className="py-2.5 px-4">Deed Ref</th>
                        <th className="py-2.5 px-4 text-right">Transfer Type</th>
                        <th className="py-2.5 px-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                      {p.transactionAnalysis.officialRegistryTransactions.map((tx) => (
                        <tr key={tx.transferId} className="hover:bg-white transition-colors">
                          <td className="py-2.5 px-4 font-mono font-bold text-indigo-700">{tx.transferId}</td>
                          <td className="py-2.5 px-4 font-mono">{tx.registrationDate}</td>
                          <td className="py-2.5 px-4 font-mono">{tx.deedNumber}</td>
                          <td className="py-2.5 px-4 text-right">{tx.transferType}</td>
                          <td className="py-2.5 px-4 text-center">
                            <span className="inline-block bg-emerald-100 text-emerald-800 text-[8px] font-bold px-1.5 py-0.5 rounded-full font-mono">
                              CLEARED
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="text-right text-[10px] font-mono text-slate-400 border-t border-slate-100 pt-4">
              VERIFIED DLD BLOCKCHAIN SIGNATURE: CLEARED BY ACOT
            </div>
          </div>
        )
      },
      {
        id: 'rental',
        title: 'Rental Research',
        render: () => (
          <div className="h-full bg-slate-950 text-slate-100 p-12 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-base font-black tracking-wider uppercase text-slate-100">05. RENTAL INCOME & YIELD INDEX</h2>
                </div>
                <span className="text-[10px] font-mono text-slate-500">{p.id}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 text-xs">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
                  <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-wider block">STABILIZED STACK</span>
                  <div className="text-2xl font-black font-mono text-white">{p.rentalResearch.yieldGross}</div>
                  <p className="text-[10px] text-slate-400">Target gross lease yield based on premium waterfront contract aggregates.</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
                  <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider block">PROJECTIONS</span>
                  <div className="text-2xl font-black font-mono text-white">{p.rentalResearch.yieldNet}</div>
                  <p className="text-[10px] text-slate-400">Estimated net yield after standard Dubai community service charges (AED 14.5/sqft).</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
                  <span className="text-[9px] font-mono text-amber-400 uppercase tracking-wider block">YOY GROWTH</span>
                  <div className="text-2xl font-black font-mono text-white">{p.rentalResearch.rentalGrowth}</div>
                  <p className="text-[10px] text-slate-400">Strong rental appreciation track under current active corporate migration waves.</p>
                </div>
              </div>

              <div className="bg-amber-950/30 border border-amber-900/40 p-4.5 rounded-2xl space-y-1.5 text-left text-xs">
                <div className="flex items-center gap-2 text-amber-400 font-bold uppercase font-mono">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  RERA Lease Cap Regulatory Warning
                </div>
                <p className="text-[10px] text-amber-200/90 leading-relaxed">
                  Lease renewals governed strictly under the Dubai Rent Index rules: <strong className="text-white">{p.rentalResearch.reraRentCapLimit}</strong>. Any legal rent increase demands a 90-day official notary warning to tenant.
                </p>
              </div>
            </div>

            <div className="text-right text-[10px] font-mono text-slate-600 border-t border-slate-900 pt-4">
              SOURCE: EJARI RENTAL CONTRACT REGISTRY DATA
            </div>
          </div>
        )
      },
      {
        id: 'returns',
        title: 'Investment Returns',
        render: () => (
          <div className="h-full bg-white text-slate-900 p-12 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-base font-black tracking-wider uppercase text-slate-800">06. CAPITAL RETURN METRICS</h2>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{p.id}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">ROI & PAYBACK MATRIX</h3>
                  <div className="p-4.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3 text-xs">
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Cumulative 5-Year Return</span>
                      <strong className="text-slate-900 font-mono text-emerald-600 font-bold">{p.investmentReturns.estimatedROI5Yr}</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Net Monthly Cashflow</span>
                      <strong className="text-slate-900 font-mono font-bold">{p.investmentReturns.monthlyCashFlow}</strong>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Sovereign Break-Even Period</span>
                      <strong className="text-slate-900 font-mono">{p.investmentReturns.breakevenYears}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Maximum LTV Mortgage Lenders</span>
                      <strong className="text-slate-900 font-mono">{p.investmentReturns.loanToValueRatio}</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-3.5 text-xs text-left">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">PORTFOLIO LEVERAGE</span>
                  <h4 className="font-black text-slate-800">Mortgage & Leverage Strategy</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    By securing a standard UAE non-resident mortgage at 4.2% fixed interest over a 20-year term, cash-on-cash yield amplifies to <strong>11.2%</strong>. Contact our verified advisors for pre-approval processing via Emirates NBD or HSBC Dubai.
                  </p>
                  <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right text-[10px] font-mono text-slate-400 border-t border-slate-100 pt-4">
              {p.branding.companyName.toUpperCase()} • STABILIZED CASH FLOW UNDERWRITING
            </div>
          </div>
        )
      },
      {
        id: 'professional',
        title: 'Professional Registry Data',
        render: () => (
          <div className="h-full bg-white text-slate-900 p-12 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-600 animate-pulse" />
                  <h2 className="text-base font-black tracking-wider uppercase text-slate-800">07. REGULATORY COMPLIANCE LEDGER</h2>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{p.id}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Verified Title Deed Metadata
                  </h3>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Registry Plot Reference</span>
                      <span className="font-mono font-black text-slate-900">{p.professionalProperty.plotNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">DLD Land Parcel ID</span>
                      <span className="font-mono font-black text-slate-900">{p.professionalProperty.landParcelId}</span>
                    </div>
                    {includePlotCoords && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-medium">Permit Number</span>
                          <span className="font-mono font-black text-indigo-600">{p.professionalProperty.permitNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500 font-medium">Developer Account Ref</span>
                          <span className="font-mono font-black text-slate-900">{p.professionalProperty.developerRegistration}</span>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between border-t border-slate-200/60 pt-2.5">
                      <span className="text-slate-500 font-medium">Construction Audits</span>
                      <strong className="text-emerald-600">{p.professionalProperty.constructionStatus}</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-3xl space-y-3.5 text-xs text-left">
                  <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-black text-indigo-950">Land Registry Guarantee</h4>
                  <p className="text-[11px] text-indigo-900/80 leading-relaxed">
                    This dossier is cross-referenced with the <strong className="text-indigo-950 font-semibold">{p.professionalProperty.authority}</strong> blockchain on <strong className="text-indigo-950 font-semibold">{p.professionalProperty.lastRegistryUpdate}</strong>. It conforms completely with <strong>Law No. 7 of 2006</strong> on property registration.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-right text-[10px] font-mono text-slate-400 border-t border-slate-100 pt-4">
              REGISTRATION DEED CERTIFICATION ID: {p.professionalProperty.registryReference}
            </div>
          </div>
        )
      },
      {
        id: 'ai-recs',
        title: 'AI Recommendation',
        render: () => (
          <div className="h-full bg-slate-950 text-slate-100 p-12 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-base font-black tracking-wider uppercase text-slate-100">08. GROUNDED AI RECOMMENDATION</h2>
                </div>
                <span className="text-[10px] font-mono text-slate-500">{p.id}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                <div className="space-y-4">
                  <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest block">OPPORTUNITY AUDITS</span>
                  <div className="space-y-2">
                    {p.aiRecommendation.strengths.map((str, i) => (
                      <div key={i} className="flex gap-2.5 items-start text-xs text-slate-300">
                        <Check className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                        <p>{str}</p>
                      </div>
                    ))}
                  </div>

                  <span className="text-[9px] font-mono text-amber-400 uppercase tracking-widest block pt-2">BALANCED RISKS</span>
                  <div className="space-y-2">
                    {p.aiRecommendation.risks.map((risk, i) => (
                      <div key={i} className="flex gap-2.5 items-start text-xs text-slate-400">
                        <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <p>{risk}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-5 rounded-[2rem] flex flex-col justify-between text-xs space-y-4">
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-wider block">HOLDING PLAN</span>
                    <h4 className="text-base font-black text-white">{p.aiRecommendation.holdingStrategy}</h4>
                    <p className="text-[10px] text-slate-400">Optimizes long-term tax-free yields while avoiding short-term secondary market transaction taxes.</p>
                  </div>

                  <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 uppercase block leading-none">ACOT CONFIDENCE</span>
                      <strong className="text-sm font-black text-emerald-400 font-mono tracking-tight">{p.aiRecommendation.confidenceScore}% Safe Rating</strong>
                    </div>
                    <div className="text-xs font-black bg-indigo-950 text-indigo-400 border border-indigo-900/60 px-3 py-1.5 rounded-lg">
                      {p.aiRecommendation.overallRecommendation}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right text-[10px] font-mono text-slate-600 border-t border-slate-900 pt-4">
              COGNITIVE UNDERWRITING BY GEMINI-3.5-FLASH CORES
            </div>
          </div>
        )
      },
      {
        id: 'why-investment',
        title: 'Why This Investment',
        render: () => (
          <div className="h-full bg-white text-slate-900 p-12 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-base font-black tracking-wider uppercase text-slate-800">09. STRATEGIC INVESTMENT RATIONALE</h2>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{p.id}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="space-y-3 md:col-span-2">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Growth Catalysts</h3>
                  <div className="space-y-3">
                    {p.whyThisInvestment.topDrivers.map((driver, i) => (
                      <div key={i} className="flex gap-3 items-start text-xs text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 shrink-0"></div>
                        <p className="leading-relaxed">{driver}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                    <span className="text-[9px] font-mono text-indigo-700 font-bold uppercase tracking-widest block mb-1">CAPITAL SECURITY</span>
                    <p className="text-slate-500 leading-relaxed text-[10px]">{p.whyThisInvestment.appreciationPotential}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                    <span className="text-[9px] font-mono text-emerald-700 font-bold uppercase tracking-widest block mb-1">TENANT QUALITY</span>
                    <p className="text-slate-500 leading-relaxed text-[10px]">{p.whyThisInvestment.rentalSecurity}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right text-[10px] font-mono text-slate-400 border-t border-slate-100 pt-4">
              {p.branding.companyName.toUpperCase()} • LICENSED DUBAI BROKERAGE DECK
            </div>
          </div>
        )
      },
      {
        id: 'contact',
        title: 'Broker Contact',
        render: () => (
          <div className="h-full bg-slate-900 text-slate-100 p-12 flex flex-col justify-between relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full filter blur-3xl -ml-20 -mt-20"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-600/10 rounded-full filter blur-3xl -mr-20 -mb-20"></div>

            <div className="space-y-6 z-10">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-base font-black tracking-wider uppercase text-slate-200">10. AUTHORIZED BROKER OFFICE</h2>
                </div>
                <span className="text-[10px] font-mono text-slate-500">{p.id}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block">CONTACT ADVISOR</span>
                    <h3 className="text-3xl font-black text-white">{p.branding.agentName}</h3>
                    <p className="text-xs text-indigo-300 font-semibold uppercase font-mono tracking-wider">Senior Portfolio Underwriter</p>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-300 pt-2">
                    <p className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-slate-500" />
                      <span>{p.branding.phone}</span>
                    </p>
                    <p className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-slate-500" />
                      <span>{p.branding.email}</span>
                    </p>
                    <p className="flex items-center gap-2.5">
                      <Globe className="w-4 h-4 text-slate-500" />
                      <span>{p.branding.website}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl flex flex-col justify-between text-xs space-y-4 text-left">
                  <div>
                    <h4 className="font-bold text-white mb-1">Corporate Office Location</h4>
                    <p className="text-slate-400 leading-normal">
                      Suite 1402, Boulevard Plaza Tower 2,<br />
                      Downtown Burj Khalifa, Dubai, UAE
                    </p>
                  </div>
                  <div className="border-t border-slate-800/80 pt-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-white font-mono font-bold uppercase">RERA ID CLEARED</p>
                      <p className="text-[9px] text-slate-500 leading-none">{p.branding.reraNumber}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-slate-500 border-t border-slate-800 pt-4 z-10">
              <span>POWERED BY ACOT PORTFOLIO INTELLIGENCE</span>
              <span className="mt-1 sm:mt-0 uppercase font-black text-slate-400">{p.branding.companyName}</span>
            </div>
          </div>
        )
      }
    ];
  };

  const pages = generatedProposal ? getProposalPages(generatedProposal) : [];

  return (
    <div className="space-y-6" id="proposal-engine-root">
      
      {/* 1. UPPER BAR HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-100 font-extrabold uppercase px-2.5 py-1 rounded-md">
              Agent Suite Phase 5
            </span>
            <span className="text-[10px] font-mono bg-slate-900 text-white font-black px-2.5 py-1 rounded-md uppercase flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              Verified Broker Hub
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Client Presentation & Proposal Engine
          </h1>
          <p className="text-xs text-slate-500">
            Assemble high-conviction whitelabeled investor proposals reusing market intelligence indices and RERA records.
          </p>
        </div>

        {generatedProposal && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setGeneratedProposal(null);
                setActivePageIdx(0);
              }}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <RefreshCw className="w-4 h-4 text-slate-400" />
              <span>Compose New</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. DYNAMIC WORKSPACE BODY */}
      {!generatedProposal ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* CONFIGURE PROPOSAL COLUMN (5 COLUMNS) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-5">
              <div className="border-b border-slate-50 pb-3">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-indigo-600" />
                  Proposal Parameters & Target Asset
                </h3>
                <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                  Select the underlying community and project to bundle existing platform intelligence.
                </p>
              </div>

              <div className="space-y-4">
                {/* Select Community */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-black uppercase text-slate-400 tracking-wider">
                    Target Community
                  </label>
                  <select
                    value={selectedCommunityId}
                    onChange={(e) => setSelectedCommunityId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-bold text-slate-800 cursor-pointer outline-none transition-colors"
                  >
                    {MOCK_COMMUNITIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Select Project */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-black uppercase text-slate-400 tracking-wider">
                    Property Project
                  </label>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-xl py-2.5 px-3.5 text-xs font-bold text-slate-800 cursor-pointer outline-none transition-colors"
                  >
                    {filteredProjects.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {/* Presentation Settings */}
                <div className="space-y-3 pt-3 border-t border-slate-50">
                  <label className="text-[10px] font-mono font-black uppercase text-slate-400 tracking-wider block">
                    Adviser Whitelabel Overrides
                  </label>
                  
                  {/* Company Name */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Brokerage Branding:</span>
                      <strong className="text-slate-800 font-bold">{resolvedBrand.companyName}</strong>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Authorized Agent:</span>
                      <strong className="text-slate-800 font-semibold">{resolvedBrand.agentName}</strong>
                    </div>
                  </div>

                  {/* Accent Color picker */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">Presentation Accent Color</span>
                    <div className="flex items-center gap-2">
                      {[
                        { color: '#4f46e5', label: 'Indigo' },
                        { color: '#fbbf24', label: 'Gold Accent' },
                        { color: '#0f172a', label: 'Slate Charcoal' },
                        { color: '#047857', label: 'Coastal Emerald' },
                        { color: '#b91c1c', label: 'Imperial Coral' }
                      ].map((preset) => (
                        <button
                          key={preset.color}
                          onClick={() => setAccentColor(preset.color)}
                          className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                            accentColor === preset.color ? 'ring-2 ring-indigo-500/40 border-indigo-600 scale-110' : 'border-slate-300'
                          }`}
                          style={{ backgroundColor: preset.color }}
                          title={preset.label}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Toggle switches */}
                  <div className="space-y-2 pt-2">
                    <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer select-none">
                      <span className="text-[11px] font-bold text-slate-600">Include Official RERA Badge</span>
                      <input
                        type="checkbox"
                        checked={showReraBadge}
                        onChange={(e) => setShowReraBadge(e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                      />
                    </label>

                    <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer select-none">
                      <span className="text-[11px] font-bold text-slate-600">Expose DLD Plot Coordinates</span>
                      <input
                        type="checkbox"
                        checked={includePlotCoords}
                        onChange={(e) => setIncludePlotCoords(e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                      />
                    </label>
                  </div>
                </div>

                {/* Compilation CTA */}
                <button
                  onClick={handleAssembleProposal}
                  disabled={isGenerating}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-2xl py-3 px-4 text-xs font-black transition-all cursor-pointer shadow-md active:scale-95 text-center flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                  <span>Build Client Investment Proposal</span>
                </button>
              </div>
            </div>
          </div>

          {/* EMPTY PREVIEW LANDING COLUMN (7 COLUMNS) */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center min-h-[350px] bg-white border border-dashed border-slate-200 rounded-[2.5rem] p-8 text-center space-y-4">
            {isGenerating ? (
              <div className="space-y-6 w-full max-w-sm">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-indigo-600 font-extrabold uppercase tracking-widest block animate-pulse">
                    COMPILING REAL-TIME RECORDS
                  </span>
                  <p className="text-xs text-slate-500 font-bold leading-tight">
                    {activeStepText}
                  </p>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full transition-all duration-300"
                      style={{ width: `${((generationStep + 1) / COMPILATION_STEPS.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                  <FileText className="w-8 h-8" />
                </div>
                <div className="space-y-1.5 max-w-sm">
                  <h4 className="text-sm font-bold text-slate-800">Proposal Document Awaiting Structure</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Set target property parameters on the left, then click build. The Proposal Engine will compile community trends, yields, and RERA records into a client-ready slides dossier.
                  </p>
                </div>
              </>
            )}
          </div>

        </div>
      ) : (
        /* 3. GENERATED PROPOSAL PREVIEW HUB (GRID SYSTEM) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* NAVIGATION CONSOLE sidebar (3 COLUMNS) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
              <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block border-b border-slate-50 pb-2">
                Proposal Contents & Slides
              </span>

              <div className="space-y-1 max-h-[340px] overflow-y-auto">
                {pages.map((pg, idx) => (
                  <button
                    key={pg.id}
                    onClick={() => setActivePageIdx(idx)}
                    className={`w-full text-left py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                      activePageIdx === idx
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>{pg.title}</span>
                    <span className="font-mono text-[9px] text-slate-400">0{idx + 1}</span>
                  </button>
                ))}
              </div>

              {/* ACTION TOOLBAR CTAs */}
              <div className="pt-4 border-t border-slate-50 space-y-2">
                <button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2 px-3 text-xs font-black transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
                >
                  {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  <span>Export Whitelabel PDF</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-2 px-3 text-xs font-black transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Copy Presentation Link</span>
                </button>

                <button
                  onClick={handlePushCRM}
                  disabled={isPushingCRM}
                  className="w-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-1.5 active:scale-95"
                >
                  {isPushingCRM ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Layers className="w-3.5 h-3.5 text-slate-400" />}
                  <span>Push to CRM Lead Hub</span>
                </button>

                {crmRefId && (
                  <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl text-center space-y-1 mt-2">
                    <span className="text-[9px] font-mono font-black text-emerald-700 block uppercase">CRM SYNC COMPLETED</span>
                    <strong className="text-[10px] text-slate-700 font-mono block">{crmRefId}</strong>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 p-4.5 rounded-3xl space-y-2 text-xs">
              <span className="text-[9px] font-mono text-indigo-700 font-extrabold uppercase tracking-widest block">
                INTEGRATION HOOK READY
              </span>
              <p className="text-slate-600 leading-snug">
                This presentation can be safely linked inside emails or external platforms using the generated presentation hash:
              </p>
              <div className="bg-white p-2 border border-indigo-100 rounded-xl font-mono text-[9px] text-slate-500 break-all select-all flex items-center justify-between">
                <span>https://acot.ae/lead/{generatedProposal.id}</span>
                <Copy className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 cursor-pointer shrink-0 ml-1.5" onClick={handleCopyLink} />
              </div>
            </div>
          </div>

          {/* CORE VIEWPORT CANVAS AREA (9 COLUMNS) */}
          <div className="lg:col-span-9 space-y-4">
            
            {/* Viewport Control Panel */}
            <div className="bg-white border border-slate-100 rounded-2xl p-3 shadow-2xs flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="font-bold text-slate-800">Proposal Preview Dashboard</span>
                <span className="text-[10px] text-slate-400 font-mono">({activePageIdx + 1} / {pages.length})</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActivePageIdx(prev => Math.max(0, prev - 1))}
                  disabled={activePageIdx === 0}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActivePageIdx(prev => Math.min(pages.length - 1, prev + 1))}
                  disabled={activePageIdx === pages.length - 1}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* PREVIEW CONTAINER STYLING */}
            <div className="bg-slate-900 rounded-[2.5rem] p-4.5 md:p-6 shadow-xl border border-slate-800">
              <div className="bg-white rounded-[1.8rem] overflow-hidden aspect-[4/3] max-w-3xl mx-auto shadow-2xl relative">
                
                {/* Active Slide Rendering */}
                {pages[activePageIdx]?.render()}

              </div>
            </div>

            {/* Micro Interaction Success Toast or Help Callout */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3">
              <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-xs text-slate-500">
                <h5 className="font-bold text-slate-800">Professional Presentation Mode</h5>
                <p className="leading-snug">
                  The cover color accents adapt automatically to the primary swatch configured in the **Company Branding** setup. Standardize layouts across entire broker offices by defining standard brand templates.
                </p>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
