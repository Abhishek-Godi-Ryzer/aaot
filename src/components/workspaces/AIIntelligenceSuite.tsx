import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAnalysisContext } from '../../context/AnalysisContext';
import { useMarketAnalytics } from '../../context/MarketAnalyticsContext';
import { useAuth } from '../../context/AuthContext';
import { useProfessionalContext } from '../../context/ProfessionalContext';
import { AgentService } from '../../services/agentService';
import { ProfessionalAuditService } from '../../services/professionalIntegrationService';
import { ProfessionalAccessService } from '../../services/professionalAccessService';
import {
  AIService,
  AIResponse,
  DealScoreResult,
  CommunityComparisonResult,
  InvestmentRecommendationResult,
  ReportPayload,
  EvidenceSource,
  HighlightMetric
} from '../../services/aiService';
import { ProfessionalMemoryService } from '../../services/professionalAIService';
import {
  MarketAnalyticsService,
  Community,
  SubArea,
  Project
} from '../../services/marketAnalyticsService';
import {
  Sparkles,
  Send,
  CheckCircle2,
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Target,
  FileText,
  MapPin,
  TrendingUp,
  Percent,
  Layers,
  FileDown,
  Info,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Flame,
  LineChart,
  HelpCircle,
  Undo,
  Paperclip,
  Mic,
  X,
  ChevronDown,
  History,
  Check,
  Building,
  ArrowRight,
  Loader2,
  Calculator,
  Home
} from 'lucide-react';

interface AIIntelligenceSuiteProps {
  onNavigateToModule: (moduleName: string) => void;
  triggerToast: (msg: string) => void;
}

interface AttachedFile {
  name: string;
  size: string;
  type: string;
}

interface HistoricalSession {
  id: string;
  title: string;
  timestamp: string;
  context: string;
  history: AIResponse[];
}

export default function AIIntelligenceSuite({
  onNavigateToModule,
  triggerToast
}: AIIntelligenceSuiteProps) {
  const { user } = useAuth();
  const { setCurrentReport, setCurrentProposal, setConversationContext } = useProfessionalContext();
  const [conversationId, setConversationId] = useState(() => 'convo-' + Date.now());
  const isAgent = user?.role === 'agent';
  const verification = isAgent ? AgentService.getVerificationStatus() : null;
  const hasProfAccess = ProfessionalAccessService.hasProfessionalAccess(user, verification);

  const { communityId, subAreaId, projectId, setCommunityId, setSubAreaId, setProjectId } = useAnalysisContext();
  const { selectedCommunity, selectedSubArea, selectedProject, communities } = useMarketAnalytics();

  const [inputMessage, setInputMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<AIResponse[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingStepIdx, setThinkingStepIdx] = useState(0);
  const [deepAnalysis, setDeepAnalysis] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  
  // Local state for Context Changer Slide-Down Drawer
  const [isChangerOpen, setIsChangerOpen] = useState(false);
  const [localCommunityId, setLocalCommunityId] = useState(communityId || 'dubai-marina');
  const [localSubAreaId, setLocalSubAreaId] = useState(subAreaId || 'all');
  const [localProjectId, setLocalProjectId] = useState(projectId || 'all');
  const [availableSubAreas, setAvailableSubAreas] = useState<SubArea[]>([]);
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  const [isApplyingContext, setIsApplyingContext] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Active Context Name calculation
  const currentContextName = selectedProject?.name || selectedSubArea?.name || selectedCommunity?.name || 'Dubai Marina';

  const thinkingStepsList = [
    `Analyzing active Market Analytics for ${currentContextName}...`,
    `Interrogating official Dubai Land Department (DLD) transaction deeds...`,
    `Running Ejari residential yield calculation sequences...`,
    `Evaluating capital cycles and developer reputation matrices...`,
    `Synthesizing final evidence-backed underwriting recommendations...`
  ];

  // List of mock historical sessions to give high-fidelity depth
  const [sessions, setSessions] = useState<HistoricalSession[]>([
    {
      id: 'session-1',
      title: 'Palm Jumeirah Capital Growth Appraisal',
      timestamp: 'Today, 10:14 AM',
      context: 'Palm Jumeirah',
      history: [
        {
          id: 'h1',
          sender: 'user',
          timestamp: '10:12 AM',
          message: 'What is the growth outlook and capital appreciation on Palm Jumeirah?'
        },
        {
          id: 'h2',
          sender: 'assistant',
          timestamp: '10:13 AM',
          message: 'Palm Jumeirah resides in an expansionary phase of Cycle Wave 3, characterized by sustained transaction volume and a year-on-year capital appreciation rate of +2.7%. Demand is driven primarily by international high-net-worth individuals and capital seeking stable safe-havens.'
        }
      ]
    },
    {
      id: 'session-2',
      title: 'Business Bay vs Marina Yield Comparison',
      timestamp: 'Yesterday, 04:30 PM',
      context: 'Dubai Marina',
      history: [
        {
          id: 'h3',
          sender: 'user',
          timestamp: '04:28 PM',
          message: 'Compare Dubai Marina with Business Bay'
        },
        {
          id: 'h4',
          sender: 'assistant',
          timestamp: '04:30 PM',
          message: 'For long-term capital preservation and premium international appeal, Dubai Marina remains the premier waterfront choice with strong visual demand. However, if your strategy is focused purely on higher yield generation and cash-on-cash flow, Business Bay offers excellent value with a lower price-per-square-foot entry bar.'
        }
      ]
    }
  ]);

  // Load sub-areas and projects when local community selection changes in the slide drawer
  useEffect(() => {
    if (!localCommunityId) return;
    
    MarketAnalyticsService.getSubAreas(localCommunityId).then(subs => {
      setAvailableSubAreas(subs);
      // default local subarea selection
      setLocalSubAreaId('all');
    });

    MarketAnalyticsService.getProjects(localCommunityId, 'all').then(projs => {
      setAvailableProjects(projs);
      setLocalProjectId('all');
    });
  }, [localCommunityId]);

  // Filter local projects if local sub-area changes
  useEffect(() => {
    if (localSubAreaId === 'all') {
      MarketAnalyticsService.getProjects(localCommunityId, 'all').then(projs => {
        setAvailableProjects(projs);
      });
    } else {
      MarketAnalyticsService.getProjects(localCommunityId, 'all').then(projs => {
        setAvailableProjects(projs.filter(p => p.subAreaId === localSubAreaId));
      });
    }
    setLocalProjectId('all');
  }, [localSubAreaId]);

  // Initialize conversation based on context
  useEffect(() => {
    // Start empty to respect user's request for a clean conversational landing page
    setChatHistory([]);
  }, [communityId, subAreaId, projectId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isThinking]);

  // Handle cross-module custom AI actions
  useEffect(() => {
    const handleCustomAIAction = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.prompt) {
        triggerAIMessage(customEvent.detail.prompt);
      }
    };
    window.addEventListener('acot-ai-trigger-action', handleCustomAIAction);
    return () => {
      window.removeEventListener('acot-ai-trigger-action', handleCustomAIAction);
    };
  }, [communityId, subAreaId, projectId]);

  // Handle thinking sequence animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isThinking) {
      setThinkingStepIdx(0);
      interval = setInterval(() => {
        setThinkingStepIdx((prev) => {
          if (prev >= thinkingStepsList.length - 1) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 700);
    }
    return () => clearInterval(interval);
  }, [isThinking, currentContextName]);

  const classifyIntent = (text: string): string => {
    const lower = text.trim().toLowerCase().replace(/[?,.!]/g, '');

    // 1. Greeting
    const greetingWords = [
      'hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 
      'hi there', 'greetings', 'yo', 'whats up', "what's up", 'howdy'
    ];
    if (greetingWords.some(w => lower === w || lower.startsWith(w + ' '))) {
      return 'Greeting';
    }

    // 2. Identity
    const identityPhrases = [
      'who are you', 'what is your name', 'what are you', 'who is this', 
      'who am i speaking to', 'introduce yourself', 'tell me about yourself',
      "who's this"
    ];
    if (identityPhrases.some(phrase => lower.includes(phrase))) {
      return 'Identity';
    }

    // 3. Help
    const helpPhrases = [
      'help', 'help me', 'what can you do', 'what are your capabilities', 
      'show capabilities', 'how to use', 'commands', 'guide', 'instructions', 
      'what can i ask', 'features', 'how does this work'
    ];
    if (helpPhrases.some(phrase => lower === phrase || lower.includes(phrase))) {
      return 'Help';
    }

    // 4. Small Talk
    const smallTalkPhrases = [
      'how are you', 'how is it going', 'how are you doing', 'nice', 'okay', 
      'ok', 'cool', 'thank you', 'thanks', 'great', 'awesome', 'perfect', 
      'good', 'bye', 'goodbye', 'fine'
    ];
    if (smallTalkPhrases.some(phrase => lower === phrase || lower.includes(phrase))) {
      return 'Small Talk';
    }

    // 5. Comparison
    if (lower.includes('compare') || lower.includes(' vs ') || lower.includes('versus') || lower.includes('comparison')) {
      return 'Comparison';
    }

    // 6. Report Generation
    if (lower.includes('report') || lower.includes('prospectus') || lower.includes('generate report') || lower.includes('executive report')) {
      return 'Report Generation';
    }

    // 7. ROI Calculation
    if (lower.includes('roi') || lower.includes('yield') || lower.includes('yields') || lower.includes('return on investment') || lower.includes('cap rate') || lower.includes('payback')) {
      return 'ROI Calculation';
    }

    // 8. Transaction Query
    if (lower.includes('transaction') || lower.includes('transactions') || lower.includes('deed') || lower.includes('deeds') || lower.includes('sale') || lower.includes('sales') || lower.includes('sold') || lower.includes('buyer') || lower.includes('seller') || lower.includes('cash vs mortgage') || lower.includes('ready vs off-plan')) {
      return 'Transaction Query';
    }

    // 9. Rental Query
    if (lower.includes('rental') || lower.includes('rent') || lower.includes('rents') || lower.includes('ejari') || lower.includes('leasing') || lower.includes('lease') || lower.includes('tenant')) {
      return 'Rental Query';
    }

    // 10. Community Analysis
    if (lower.includes('analyze') || lower.includes('analysis') || lower.includes('community') || lower.includes('area') || lower.includes('sub-area') || lower.includes('project') || lower.includes('district') || lower.includes('neighborhood')) {
      return 'Community Analysis';
    }

    // 11. Investment Query
    const investmentKeywords = [
      'invest', 'investment', 'investing', 'buy', 'deal', 'deal score', 
      'underwriting', 'portfolio', 'asset', 'valuation', 'capital', 'growth',
      'appreciation', 'market', 'emaar', 'developer', 'escrow', 'score'
    ];
    if (investmentKeywords.some(w => lower.includes(w))) {
      return 'Investment Query';
    }

    return 'Unknown';
  };

  const triggerAIMessage = async (text: string) => {
    if (!text.trim() || isThinking) return;

    // Construct user message object
    const userMsg: AIResponse = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      message: text
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsThinking(true);

    if (user) {
      ProfessionalAuditService.logEvent(user.id, 'Professional AI Query', {
        query: text,
        communityId,
        projectId,
        timestamp: new Date().toISOString()
      });
    }

    const intent = classifyIntent(text);

    // Conversational Intents (Greeting, Small Talk, Identity, Help, Unknown) -> DO NOT execute RAG
    if (intent === 'Greeting') {
      setTimeout(() => {
        const aiReply: AIResponse = {
          id: `resp-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          message: `Hello!\n\nI'm ACOT AI Analyst.\n\nI specialize in verified Dubai real estate intelligence using Dubai Land Department (DLD), Ejari and ACOT analytics.\n\nHow can I help you today?`,
          followUpQuestions: [
            "Analyze a Community",
            "Compare Areas",
            "Review Transactions",
            "Estimate ROI",
            "Generate Executive Report"
          ]
        };
        setChatHistory((prev) => [...prev, aiReply]);
        setIsThinking(false);
      }, 800);
      return;
    }

    if (intent === 'Small Talk') {
      setTimeout(() => {
        const aiReply: AIResponse = {
          id: `resp-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          message: `I'm doing well, thank you for asking! I'm here and ready to help you with any Dubai real estate analytics, transaction checks, or investment models you'd like to run. What are we exploring today?`,
          followUpQuestions: [
            "Analyze a Community",
            "Compare Areas",
            "Review Transactions",
            "Estimate ROI",
            "Generate Executive Report"
          ]
        };
        setChatHistory((prev) => [...prev, aiReply]);
        setIsThinking(false);
      }, 800);
      return;
    }

    if (intent === 'Identity') {
      setTimeout(() => {
        const aiReply: AIResponse = {
          id: `resp-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          message: `I am the **ACOT AI Analyst**, your premium real estate investment companion. I specialize in cross-referencing live Dubai Land Department (DLD) transaction deeds, Ejari rental agreements, and ACOT proprietary market analytics to provide broker-grade underwriting and risk assessment.\n\nHere are a few questions you can ask me:\n• What is the investment score for Dubai Marina?\n• Compare Dubai Marina with Palm Jumeirah.\n• Analyze rental yields and ROI for active projects.`,
          followUpQuestions: [
            "Analyze a Community",
            "Compare Areas",
            "Review Transactions",
            "Estimate ROI",
            "Generate Executive Report"
          ]
        };
        setChatHistory((prev) => [...prev, aiReply]);
        setIsThinking(false);
      }, 800);
      return;
    }

    if (intent === 'Help') {
      setTimeout(() => {
        const aiReply: AIResponse = {
          id: `resp-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          message: `I am here to guide your Dubai real estate investments. Here is a summary of my core capabilities:\n\n• **Community Analysis**: Underwrite any district's price history and transaction volume.\n• **Area Comparison**: Side-by-side transaction and yield comparisons.\n• **Transaction Auditing**: Audit ready vs off-plan ratios and cash vs mortgage transaction profiles.\n• **ROI Calculation**: Track cap rates and net yields using actual Ejari indices.\n• **Client Proposals**: Prepare formal white-labeled PDF-ready reports.\n\nWould you like to try one of these?`,
          followUpQuestions: [
            "Analyze a Community",
            "Compare Areas",
            "Review Transactions",
            "Estimate ROI",
            "Generate Executive Report"
          ]
        };
        setChatHistory((prev) => [...prev, aiReply]);
        setIsThinking(false);
      }, 800);
      return;
    }

    if (intent === 'Unknown') {
      setTimeout(() => {
        const aiReply: AIResponse = {
          id: `resp-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          message: `I'm not quite sure how to answer that with our real estate data. I specialize in Dubai real estate intelligence, transaction auditing, and investment scoring. Would you like me to analyze a community or estimate ROI for a specific sub-area instead?`,
          followUpQuestions: [
            "Analyze a Community",
            "Compare Areas",
            "Review Transactions",
            "Estimate ROI",
            "Generate Executive Report"
          ]
        };
        setChatHistory((prev) => [...prev, aiReply]);
        setIsThinking(false);
      }, 800);
      return;
    }

    // Check if message is a broad query (asking about community broadly without specific metric)
    const lowerText = text.trim().toLowerCase();
    const isBroadCommunityQuery = 
      (lowerText === 'dubai marina' || lowerText === 'palm jumeirah' || lowerText === 'business bay' || lowerText === 'marina' || lowerText === 'palm') ||
      (lowerText.length < 25 && (lowerText.includes('marina') || lowerText.includes('palm') || lowerText.includes('business bay') || lowerText.includes('community')) && 
       !lowerText.includes('score') && !lowerText.includes('deal') && !lowerText.includes('evaluate') && 
       !lowerText.includes('compare') && !lowerText.includes('vs') && !lowerText.includes('report') && 
       !lowerText.includes('risk') && !lowerText.includes('weakness') && !lowerText.includes('rent') && 
       !lowerText.includes('leasing') && !lowerText.includes('yield') && !lowerText.includes('roi'));

    if (isBroadCommunityQuery) {
      setTimeout(() => {
        const aiReply: AIResponse = {
          id: `resp-${Date.now()}`,
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          message: `I can help you evaluate **${currentContextName}** with verified Land Department records. Which specific perspective would you like to focus on first?`,
          options: [
            "Evaluate Deal Score",
            "Assess Rental Yields & ROI",
            "Review Transaction History",
            "Generate Comprehensive Report"
          ]
        };
        setChatHistory((prev) => [...prev, aiReply]);
        setIsThinking(false);
      }, 800);
      return;
    }

    try {
      // Simulate RAG generation with context
      const aiReply = await AIService.generateAnswer(
        text,
        communityId || 'dubai-marina',
        subAreaId,
        projectId,
        user
      );
      
      setChatHistory((prev) => [...prev, aiReply]);
    } catch (err) {
      console.error(err);
      triggerToast('AI pipeline timed out. Please retry.');
    } finally {
      setIsThinking(false);
    }
  };

  const handleCopy = (txt: string) => {
    navigator.clipboard.writeText(txt);
    triggerToast('Copied analysis to clipboard.');
  };

  const handleClearHistory = () => {
    // 1. Create new Conversation ID
    const newConvoId = 'convo-' + Date.now();
    setConversationId(newConvoId);

    // 2. Clear current chat history
    setChatHistory([]);

    // 3. Reset AI conversation memory
    if (user?.id) {
      ProfessionalMemoryService.clearSession(user.id);
    } else {
      ProfessionalMemoryService.clearSession('anonymous');
    }

    // 4. Reset retrieved evidence & report context & reasoning context
    setAttachments([]);
    setDeepAnalysis(false);
    setCurrentReport(null);
    setCurrentProposal(null);
    setConversationContext(null);

    // 5. Preserve Current Analysis Context is naturally preserved since we don't clear communityId, subAreaId, projectId

    triggerToast('New conversation initialized. Landing state ready.');
  };

  // Simulates standard attachment selection
  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newAttachment: AttachedFile = {
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        type: file.type || 'document'
      };
      setAttachments(prev => [...prev, newAttachment]);
      triggerToast(`Attached file: ${file.name}`);
    }
  };

  const handleRemoveAttachment = (idx: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== idx));
  };

  // Simulates microphone dictation
  const handleVoiceClick = () => {
    if (isListening) {
      setIsListening(false);
      setInputMessage('Analyze rental yields and Ejari occupancy rates in this community');
      triggerToast('Voice input processed successfully.');
    } else {
      setIsListening(true);
      triggerToast('Dictation active. Speak underwriting instructions...');
      setTimeout(() => {
        setIsListening(false);
        setInputMessage('Evaluate historical compound appreciation cycles');
        triggerToast('Voice input processed successfully.');
      }, 3500);
    }
  };

  // Switch context from local changer drawer
  const applyLocalContext = () => {
    setIsApplyingContext(true);
    triggerToast(`Applying selected context...`);
    
    setTimeout(() => {
      setCommunityId(localCommunityId);
      setSubAreaId(localSubAreaId);
      setProjectId(localProjectId);
      
      setIsChangerOpen(false);
      setIsApplyingContext(false);
      triggerToast(`Working Context Updated successfully.`);
    }, 900);
  };

  // Swap to historic investment session
  const selectSession = (session: HistoricalSession) => {
    setChatHistory(session.history);
    setShowHistory(false);
    triggerToast(`Restored appraisal session: "${session.title}"`);
  };

  // Render icons dynamically for highlights
  const renderHighlightIcon = (type: string) => {
    switch (type) {
      case 'trend':
        return <TrendingUp className="w-5 h-5 text-emerald-600 animate-pulse" />;
      case 'yield':
        return <Percent className="w-5 h-5 text-indigo-600" />;
      case 'volume':
        return <Layers className="w-5 h-5 text-indigo-600" />;
      case 'liquidity':
        return <Flame className="w-5 h-5 text-amber-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-purple-600" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto relative">
      
      {/* 1. TOP PREMIUM WORKSPACE CONTROL HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              AI Analyst
              <span className="bg-indigo-50 text-indigo-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase border border-indigo-100">
                RAG Core
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Verified Real Estate investment analyst grounded on Dubai Land Department (DLD) deeds.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:self-auto self-end">
          <button
            onClick={async () => {
              triggerToast('Compiling executive investment recommendations...');
              try {
                const reportsModule = await import('../../services/reportsService');
                await reportsModule.ReportsService.generateContextReport('AI Intelligence Suite', {
                  communityId,
                  subAreaId,
                  projectId
                });
                triggerToast('Executive Prospectus generated successfully. Loading report...');
                setTimeout(() => onNavigateToModule('Reports Engine'), 850);
              } catch (e) {
                triggerToast('Failed to compile executive prospectus.');
              }
            }}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-4.5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/10 cursor-pointer active:scale-95"
            id="btn-gen-executive-report"
          >
            <FileText className="w-4 h-4 text-white" />
            <span>Generate Executive Report</span>
          </button>

          <button
            onClick={handleClearHistory}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-extrabold text-xs px-4.5 py-2.5 rounded-xl transition-all cursor-pointer active:scale-95 shadow-xs"
            id="btn-new-convo"
          >
            <Undo className="w-4 h-4 text-slate-400" />
            <span>New Conversation</span>
          </button>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-xl transition-all shadow-xs cursor-pointer relative"
            title="Appraisal History"
            id="btn-convo-history"
          >
            <History className="w-4.5 h-4.5 text-slate-500" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500"></span>
          </button>
        </div>
      </div>

      {/* 2. SLIDE-OUT APPRASIAL SESSIONS PANEL */}
      <AnimatePresence>
        {showHistory && (
          <div className="fixed inset-y-0 right-0 w-80 bg-white border-l border-slate-200 shadow-2xl z-50 p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Appraisal History</h3>
                </div>
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-1 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">
                  Past Underwriting Sessions
                </span>
                
                <div className="space-y-2.5 max-h-[70vh] overflow-y-auto">
                  {sessions.map((sess) => (
                    <button
                      key={sess.id}
                      onClick={() => selectSession(sess)}
                      className="w-full text-left p-3.5 bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 rounded-2xl transition-all cursor-pointer group space-y-1.5"
                    >
                      <h4 className="text-xs font-bold text-slate-800 group-hover:text-indigo-950 transition-colors line-clamp-1">
                        {sess.title}
                      </h4>
                      <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                        <span className="bg-slate-200/60 text-slate-600 px-1.5 py-0.5 rounded-sm">{sess.context}</span>
                        <span>{sess.timestamp}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 text-center">
              <p className="text-[10px] font-medium text-slate-400">
                ACOT Conversational Analyst Memory Server
              </p>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. COMPACT REAL-TIME CONTEXT SELECTOR BAR */}
      <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3 md:px-4.5 flex flex-col md:flex-row md:items-center justify-between gap-3 relative z-20">
        <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs">
          <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 font-extrabold px-2.5 py-1 rounded-lg uppercase text-[10px] tracking-wide font-mono shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
            <span>ACTIVE ANALYSIS CONTEXT</span>
          </div>

          <div className="flex items-center gap-2 font-bold text-slate-700">
            <span className="text-slate-400 font-medium">Analyzing:</span>
            
            <div className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800">
              <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>{selectedCommunity?.name || 'All Dubai'}</span>
            </div>

            <span className="text-slate-300">|</span>

            <div className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800">
              <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{subAreaId === 'all' ? 'All Sub-Areas' : selectedSubArea?.name || subAreaId}</span>
            </div>

            <span className="text-slate-300">|</span>

            <div className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800">
              <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{projectId === 'all' ? 'All Projects' : selectedProject?.name || projectId}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsChangerOpen(!isChangerOpen)}
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer self-end md:self-auto bg-white hover:bg-indigo-50/30 border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-xs"
          id="btn-toggle-changer"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-indigo-500 ${isChangerOpen ? 'animate-spin' : ''}`} />
          <span>Change Context</span>
        </button>

        {/* Dropdown context changer animation */}
        <AnimatePresence>
          {isChangerOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}
              className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 md:p-5 z-40 grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              {/* Community select */}
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Community</label>
                <div className="relative">
                  <select
                    value={localCommunityId}
                    onChange={(e) => setLocalCommunityId(e.target.value)}
                    className="w-full bg-white border border-slate-200 hover:border-slate-300 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer appearance-none"
                  >
                    {communities.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Sub-Area select */}
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Sub-Area</label>
                <div className="relative">
                  <select
                    value={localSubAreaId}
                    onChange={(e) => setLocalSubAreaId(e.target.value)}
                    className="w-full bg-white border border-slate-200 hover:border-slate-300 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer appearance-none"
                  >
                    <option value="all">All Sub-Areas</option>
                    {availableSubAreas.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Project select */}
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-mono text-slate-400 font-bold uppercase block">Project</label>
                <div className="relative">
                  <select
                    value={localProjectId}
                    onChange={(e) => setLocalProjectId(e.target.value)}
                    className="w-full bg-white border border-slate-200 hover:border-slate-300 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer appearance-none"
                  >
                    <option value="all">All Projects</option>
                    {availableProjects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-end text-left">
                <button
                  onClick={applyLocalContext}
                  disabled={isApplyingContext}
                  className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-2.5 rounded-xl shadow-md shadow-indigo-600/10 hover:shadow-lg transition-all active:scale-95 cursor-pointer disabled:opacity-75"
                >
                  {isApplyingContext ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Applying...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Apply Context</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. CONVERSATIONAL MAIN HERO PANEL */}
      {chatHistory.length === 0 && !isThinking && (
        <div className="bg-white rounded-[2.25rem] border border-slate-100 p-8 md:p-12 shadow-xs relative overflow-hidden text-center max-w-5xl mx-auto my-4">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-50/40 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-purple-50/40 rounded-full blur-3xl pointer-events-none"></div>
 
          <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-sm border border-indigo-100">
              <Sparkles className="w-8 h-8 animate-pulse text-indigo-600" />
            </div>
 
            <div className="space-y-3.5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-700 font-mono">
                Real Estate Underwriting Suite
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                How can I assist your underwriting process today?
              </h2>
              <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-xl mx-auto">
                Directly synchronized with the active context: <strong className="text-slate-800 underline underline-offset-3">{currentContextName}</strong>. Ask professional underwriting questions regarding capital cycles, Ejari registries, deal scores, or structural property risks.
              </p>
            </div>
 
            {hasProfAccess && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left font-sans space-y-2.5 max-w-2xl mx-auto" id="professional-ai-context-banner">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-700 uppercase tracking-wide">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  Professional AI Context Active
                </div>
                <p className="text-[11px] text-slate-500 leading-normal font-medium">
                  Because you are a verified agent, your AI queries are automatically enriched with professional DLD, Ejari, and municipal registry parameters.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Registry Data',
                    'Permit Status',
                    'Developer History',
                    'Building Registration',
                    'Legal References',
                    'Escrow Information',
                    'Authority Records',
                    'Due Diligence'
                  ].map((ctx) => (
                    <span key={ctx} className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-indigo-100 shadow-3xs">
                      <Check className="w-3 h-3 text-indigo-500 animate-pulse" />
                      {ctx}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Prompt Box */}
            <div className="relative bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 flex flex-col sm:flex-row items-center focus-within:ring-2 focus-within:ring-indigo-100 focus-within:bg-white transition-all shadow-xs gap-2">
              <input
                type="text"
                placeholder={`Ask about capital cycles, deal scores, or yield assessments for ${currentContextName}...`}
                className="w-full bg-transparent px-3 py-2.5 text-xs font-semibold text-slate-800 outline-none placeholder-slate-400"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && triggerAIMessage(inputMessage)}
              />
              
              <div className="flex items-center gap-1.5 self-stretch justify-end shrink-0">
                {/* Voice Record dictation button */}
                <button
                  onClick={handleVoiceClick}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-200/50 hover:bg-slate-200 text-slate-500'
                  } cursor-pointer`}
                  title="Voice Underwriting"
                >
                  <Mic className="w-4 h-4" />
                </button>
 
                {/* Attachment file selector button */}
                <button
                  onClick={handleAttachmentClick}
                  className="w-10 h-10 rounded-xl bg-slate-200/50 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-all"
                  title="Attach Property Deed or Excel"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".csv,.xls,.xlsx,.pdf,.png,.jpg"
                />
 
                <button
                  onClick={() => triggerAIMessage(inputMessage)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 font-extrabold text-xs active:scale-95 shadow-sm cursor-pointer shrink-0 transition-all"
                >
                  <span>Query Analyst</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
 
            {/* Attachment preview pills */}
            {attachments.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 pt-1">
                {attachments.map((file, fileIdx) => (
                  <div
                    key={fileIdx}
                    className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg text-[10px] font-bold text-slate-700 shadow-2xs"
                  >
                    <FileText className="w-3 h-3 text-indigo-500" />
                    <span>{file.name}</span>
                    <span className="text-[8px] text-slate-400 font-mono">({file.size})</span>
                    <button
                      onClick={() => handleRemoveAttachment(fileIdx)}
                      className="text-slate-400 hover:text-red-500 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
 
            {/* SUGGESTED QUESTIONS (Under the prompt box on landing) */}
            <div className="space-y-3 pt-4 text-left max-w-2xl mx-auto">
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block text-center">
                Suggested Questions
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  "Generate Deal Score",
                  "Compare with Business Bay",
                  "Estimate ROI",
                  "What are the main investment risks?",
                  "Explain Rental Demand"
                ].map((q, qIdx) => (
                  <button
                    key={qIdx}
                    onClick={() => triggerAIMessage(q)}
                    className="bg-slate-50 hover:bg-slate-100/80 text-slate-600 hover:text-indigo-600 border border-slate-200/60 hover:border-indigo-200 rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. ACTIVE CHAT CONVERSATION WORKSPACE */}
      {chatHistory.length > 0 && (
        <div className="space-y-6 md:space-y-8">
          {chatHistory.map((chat) => (
            <div
              key={chat.id}
              className={`flex flex-col space-y-4 rounded-3xl p-5 md:p-6 border transition-all ${
                chat.sender === 'user'
                  ? 'bg-slate-50 border-slate-200/70 ml-auto max-w-[85%]'
                  : 'bg-white border-slate-100 shadow-sm'
              }`}
            >
              {/* Header metadata row */}
              <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold ${
                      chat.sender === 'user'
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                    }`}
                  >
                    {chat.sender === 'user' ? 'You' : <Sparkles className="w-4.5 h-4.5 text-indigo-600" />}
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      {chat.sender === 'user' ? 'You' : 'ACOT Conversational Analyst'}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono">{chat.timestamp}</p>
                  </div>
                </div>

                {chat.sender === 'assistant' && (
                  <div className="flex items-center gap-1 text-slate-400">
                    <button
                      onClick={() => handleCopy(chat.message)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
                      title="Copy Analysis"
                    >
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    <button
                      onClick={() => triggerToast('Logged feedback. Thank you!')}
                      className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
                      title="Helpful"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    <button
                      onClick={() => triggerToast('Logged adjustments flag for RAG engines.')}
                      className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
                      title="Not helpful"
                    >
                      <ThumbsDown className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                )}
              </div>

              {/* Message markup prose */}
              <div className="text-xs md:text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-line relative z-10 prose prose-slate max-w-none">
                {chat.message}
              </div>

              {/* KEY HIGHLIGHTS EMBEDS */}
              {chat.highlights && chat.highlights.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 pt-3.5 border-t border-slate-50">
                  {chat.highlights.map((m, mIdx) => (
                    <div
                      key={mIdx}
                      className="bg-slate-50/60 rounded-2xl border border-slate-100 p-3.5 space-y-1.5 hover:border-slate-200 hover:bg-white transition-all shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] text-slate-400 font-extrabold uppercase font-mono tracking-wider">
                          {m.label}
                        </span>
                        {renderHighlightIcon(m.iconType)}
                      </div>
                      <div>
                        <span className="text-base font-black text-slate-900 tracking-tight">
                          {m.value}
                        </span>
                        <span
                          className={`text-[9px] font-bold block ${
                            m.isPositive ? 'text-emerald-600' : 'text-red-500'
                          }`}
                        >
                          {m.change}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium leading-normal pt-1">
                        {m.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* DEAL SCORE INTERACTIVE CARD EMBED */}
              {chat.dealScore && (
                <div className="mt-4 bg-linear-to-b from-indigo-50/40 to-white rounded-3xl border border-indigo-100/60 p-5 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-100/40 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-500 text-white flex items-center justify-center">
                        <Target className="w-5.5 h-5.5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-800 tracking-tight">ACOT AI Investment Deal Score</h4>
                        <p className="text-[10px] text-slate-400 font-semibold font-mono">RETRIEVED FROM DLD/EJARI REGISTRY LOGS</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider font-mono">Overall Score</span>
                      <span className="text-2xl font-black text-indigo-600 tracking-tight">
                        {chat.dealScore.overallScore} <span className="text-xs text-slate-400 font-medium">/ 10</span>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {chat.dealScore.categories.map((c, cIdx) => (
                      <div key={cIdx} className="bg-white rounded-2xl border border-slate-100 p-4 space-y-2 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-800">{c.name}</span>
                          <span className="bg-indigo-50 text-indigo-700 text-xs font-black px-2 py-0.5 rounded-lg">
                            {c.score}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-normal font-medium">{c.explanation}</p>
                        <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 border-t border-slate-50 pt-2 mt-1">
                          <span>Evidence Base: <span className="text-slate-600 font-semibold">{c.evidence}</span></span>
                          <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-bold uppercase">Confidence: {c.confidence}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-indigo-500/5 rounded-2xl border border-indigo-500/10 p-4">
                    <div className="flex items-start gap-2.5">
                      <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-black text-indigo-800 block uppercase tracking-wide">Investment Verdict</span>
                        <p className="text-xs text-slate-600 leading-relaxed mt-1 font-medium">{chat.dealScore.summary}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* COMPARATIVE METRICS INTERACTIVE EMBED */}
              {chat.comparison && (
                <div className="mt-4 bg-white rounded-3xl border border-slate-100 p-5 space-y-4">
                  <div className="flex items-center gap-2.5 border-b border-slate-50 pb-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-indigo-600">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-800">Community Head-to-Head Comparative Profile</h4>
                      <p className="text-[10px] text-slate-400 font-semibold font-mono">Verified Dual-Market Exchange</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100">
                          <th className="py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Metric Scope</th>
                          <th className="py-2.5 text-xs font-black text-indigo-600">{chat.comparison.communityAName}</th>
                          <th className="py-2.5 text-xs font-black text-slate-700">{chat.comparison.communityBName}</th>
                          <th className="py-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono text-right">Algorithmic Advantage</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {chat.comparison.metrics.map((m, mIdx) => (
                          <tr key={mIdx} className="hover:bg-slate-50/40">
                            <td className="py-3 font-semibold text-slate-600">{m.label}</td>
                            <td className={`py-3 font-black ${m.winner === 'A' ? 'text-indigo-600 bg-indigo-50/25 px-2 rounded-xl' : 'text-slate-800'}`}>
                              {m.communityAValue}
                            </td>
                            <td className={`py-3 font-black ${m.winner === 'B' ? 'text-indigo-600 bg-indigo-50/25 px-2 rounded-xl' : 'text-slate-700'}`}>
                              {m.communityBValue}
                            </td>
                            <td className="py-3 text-[10px] text-slate-500 text-right leading-relaxed max-w-xs font-medium">{m.analysis}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4">
                    <h5 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider font-mono">AI Comparative recommendation</h5>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1.5 font-medium">{chat.comparison.aiRecommendation}</p>
                  </div>
                </div>
              )}

              {/* RISK MATRIX EMBED */}
              {chat.recommendation && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Strengths & Weaknesses */}
                  <div className="bg-white rounded-3xl border border-slate-200/80 p-5 space-y-4 shadow-2xs">
                    <div className="flex items-center gap-2 border-b border-slate-50 pb-2.5">
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Investment Strengths</h4>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-600 font-medium">
                      {chat.recommendation.strengths.map((str, sIdx) => (
                        <li key={sIdx} className="flex gap-2">
                          <span className="text-emerald-500 font-bold shrink-0">✓</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center gap-2 border-b border-slate-50 pb-2.5 pt-2">
                      <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Investment Weaknesses</h4>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-600 font-medium">
                      {chat.recommendation.weaknesses.map((weak, wIdx) => (
                        <li key={wIdx} className="flex gap-2">
                          <span className="text-red-500 font-bold shrink-0">•</span>
                          <span>{weak}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Risks & Mitigation Strategies */}
                  <div className="bg-white rounded-3xl border border-slate-200/80 p-5 space-y-4 shadow-2xs">
                    <div className="flex items-center gap-2 border-b border-slate-50 pb-2.5">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Identified Risks</h4>
                    </div>
                    <ul className="space-y-3 text-xs text-slate-600 font-medium">
                      {chat.recommendation.risks.map((risk, rIdx) => (
                        <li key={rIdx} className="flex items-start gap-2.5">
                          <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded font-mono">R{rIdx+1}</span>
                          <div>
                            <p className="text-slate-700 font-semibold leading-normal">{risk}</p>
                          </div>
                        </li>
                      ))}
                    </ul>

                    <div className="bg-indigo-500/5 rounded-2xl p-3.5 border border-indigo-500/10">
                      <h5 className="text-[10px] font-mono text-indigo-700 font-bold uppercase tracking-wider mb-1">Suggested Underwriting Strategy</h5>
                      <p className="text-xs text-slate-600 leading-relaxed font-bold">{chat.recommendation.suggestedStrategy}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* PDF REPORT PAYLOAD METADATA EMBED */}
              {chat.reportPayload && (
                <div className="mt-4 bg-slate-50 rounded-3xl border border-slate-200 p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                        <FileDown className="w-5 h-5 text-white animate-bounce" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">ACOT AI Intelligence Prospectus Payload</h4>
                        <p className="text-[10px] text-slate-400 font-semibold font-mono">Format: APPLICATION/JSON • Ready for PDF Engine</p>
                      </div>
                    </div>
                    <div className="text-xs font-mono text-slate-400">
                      Generated: <span className="text-slate-700 font-semibold">{chat.reportPayload.metadata.generatedDate}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">Executive Summary</span>
                      <p className="text-slate-600 mt-1.5 leading-normal font-medium">{chat.reportPayload.executiveSummary}</p>
                    </div>
                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 space-y-2 shadow-2xs">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono block">Analytical Scores</span>
                      <div className="space-y-1 text-slate-600 font-bold">
                        <div className="flex justify-between">
                          <span>DLD Growth:</span>
                          <span className="text-slate-900">{chat.reportPayload.marketAnalysis.priceGrowth}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Rental Yield:</span>
                          <span className="text-indigo-600">{chat.reportPayload.rentalAnalysis.rentalYield}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Volume:</span>
                          <span className="text-slate-950">{chat.reportPayload.marketAnalysis.transactionVolume}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 space-y-1.5 shadow-2xs">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono block">Actionable Recommendations</span>
                      <ul className="space-y-1 text-slate-600 list-disc list-inside font-medium">
                        {chat.reportPayload.recommendations.map((rec, rIdx) => (
                          <li key={rIdx} className="truncate">{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono font-semibold">
                      <Info className="w-3.5 h-3.5 text-indigo-500" />
                      <span>The Reports Engine will parse this structured array into dynamic layouts.</span>
                    </div>
                    <button
                      onClick={() => {
                        triggerToast('Executing Reports PDF compiler context...');
                        setTimeout(() => triggerToast('Successfully exported ACOT_Grounded_Prospectus.pdf'), 1300);
                      }}
                      className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 text-indigo-700 font-extrabold text-xs px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-2xs"
                    >
                      <span>Compile PDF</span>
                      <ChevronRight className="w-3.5 h-3.5 text-indigo-600" />
                    </button>
                  </div>
                </div>
              )}

              {/* VERIFIED EVIDENCE USED PILLS (Handoffs) */}
              {chat.evidence && chat.evidence.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-50">
                  <span className="text-[10px] font-mono font-extrabold uppercase text-slate-400 mr-1.5">Evidence Used</span>
                  {chat.evidence.map((ev, evIdx) => (
                    <button
                      key={evIdx}
                      onClick={() => {
                        onNavigateToModule(ev.module);
                        triggerToast(`RAG verified handoff. Opening ${ev.module} with ${currentContextName} context.`);
                      }}
                      className="bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-100 hover:border-indigo-100 rounded-lg px-2.5 py-1 text-[10px] font-bold text-slate-600 inline-flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>{ev.name}</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60 text-slate-400" />
                    </button>
                  ))}
                  
                  <button
                    onClick={() => triggerToast('All compiled sources are verified to active DLD deeds.')}
                    className="text-[10px] text-indigo-600 hover:text-indigo-700 font-extrabold flex items-center gap-0.5 ml-auto"
                  >
                    <span>View all evidence (12)</span>
                    <ChevronRight className="w-3 h-3 text-indigo-500" />
                  </button>
                </div>
              )}

              {/* INTERACTIVE CLARIFICATION OPTIONS */}
              {chat.sender === 'assistant' && chat.options && chat.options.length > 0 && (
                <div className="space-y-2.5 pt-3.5 border-t border-slate-100 text-left">
                  <span className="text-[10px] font-mono font-extrabold uppercase text-slate-400 block tracking-wider">
                    Select a Perspective to focus RAG Evaluation
                  </span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {chat.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => triggerAIMessage(`${opt} for ${currentContextName}`)}
                        className="bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-100/50 hover:border-indigo-600 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* DYNAMIC FOLLOW-UP QUESTIONS */}
              {chat.sender === 'assistant' && chat.followUpQuestions && chat.followUpQuestions.length > 0 && (
                <div className="space-y-2.5 pt-3.5 border-t border-slate-100 text-left">
                  <span className="text-[10px] font-mono font-extrabold uppercase text-slate-400 block tracking-wider">
                    Suggested Follow-up Underwriting Actions
                  </span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {chat.followUpQuestions.map((q, qIdx) => (
                      <button
                        key={qIdx}
                        onClick={() => triggerAIMessage(q)}
                        className="bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 border border-slate-200/60 hover:border-indigo-100 rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* PROFESSIONAL WORKSPACE ACTIONS PANEL */}
              {chat.sender === 'assistant' && hasProfAccess && (
                <div className="space-y-3 pt-4 border-t border-slate-100 text-left" id="professional-ai-actions-panel">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-extrabold uppercase text-indigo-700 tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-indigo-600 animate-pulse" />
                    Professional Suite Handoffs
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 pt-1">
                    <button
                      onClick={() => {
                        onNavigateToModule('Reports Engine');
                        triggerToast('Transferring AI underwriting payload to white-label Reports Engine...');
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-600 rounded-xl px-3 py-2 text-xs font-black transition-all cursor-pointer shadow-sm active:scale-95 text-center flex items-center justify-center gap-1.5"
                    >
                      <FileDown className="w-3.5 h-3.5 text-white" />
                      <span>Generate Executive Report</span>
                    </button>
                    <button
                      onClick={() => {
                        onNavigateToModule('Tools & Calculators');
                        triggerToast('Converting assessment payload into interactive Investor Proposal...');
                      }}
                      className="bg-slate-900 hover:bg-slate-800 text-white border border-slate-900 rounded-xl px-3 py-2 text-xs font-black transition-all cursor-pointer shadow-sm active:scale-95 text-center flex items-center justify-center gap-1.5"
                    >
                      <Calculator className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Create Client Proposal</span>
                    </button>
                    <button
                      onClick={() => {
                        onNavigateToModule('Market Analytics & Cycles');
                        triggerToast('Navigating to head-to-head community comparison...');
                      }}
                      className="bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95 text-center flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                      <span>Compare Another Property</span>
                    </button>
                    <button
                      onClick={() => {
                        onNavigateToModule('Market Analytics & Cycles');
                        triggerToast('Opening Market Intelligence for active community context...');
                      }}
                      className="bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95 text-center flex items-center justify-center gap-1.5"
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                      <span>Open Market Intelligence</span>
                    </button>
                    <button
                      onClick={() => {
                        onNavigateToModule('Transaction Intelligence');
                        triggerToast('Opening sales transactions ledger matching community parameters...');
                      }}
                      className="bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95 text-center flex items-center justify-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>Open Transactions</span>
                    </button>
                    <button
                      onClick={() => {
                        onNavigateToModule('Rental Intelligence');
                        triggerToast('Redirecting to Ejari rental yield index logs...');
                      }}
                      className="bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95 text-center flex items-center justify-center gap-1.5"
                    >
                      <Home className="w-3.5 h-3.5 text-slate-400" />
                      <span>Open Rental Research</span>
                    </button>
                    <button
                      onClick={() => triggerAIMessage("Please elaborate further on this underwriter's analysis with deeper registry insights.")}
                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-800 border border-indigo-100 rounded-xl px-3 py-2 text-xs font-extrabold transition-all cursor-pointer shadow-2xs active:scale-95 text-center flex items-center justify-center gap-1.5 sm:col-span-2 md:col-span-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Explain Further</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 6. REAL-TIME REASONING PIPELINE SEQUENCE */}
      <AnimatePresence>
        {isThinking && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-slate-50/50 rounded-3xl border border-slate-200/80 p-5 md:p-6 space-y-4"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
                <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">ACOT AI Analyst Reasoning Sequence</h4>
                <p className="text-[10px] text-slate-400 font-medium">Interrogating retrieval repositories</p>
              </div>
            </div>

            {/* Thinking Step Matrix */}
            <div className="space-y-2.5 pl-1.5 pt-1 text-xs font-medium">
              {thinkingStepsList.map((step, idx) => {
                const isCompleted = idx < thinkingStepIdx;
                const isCurrent = idx === thinkingStepIdx;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 transition-opacity duration-300 ${
                      isCompleted ? 'text-slate-800' : isCurrent ? 'text-indigo-600 font-bold animate-pulse' : 'text-slate-300'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : isCurrent ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-200" />
                    )}
                    <span>{step}</span>
                    {isCompleted && (
                      <span className="text-[9px] font-mono text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded-md uppercase">
                        Completed
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={chatEndRef} />

      {/* 7. DOCKED DYNAMIC PROMPT INPUT AND ACCESSIBILITY FEATURES */}
      {chatHistory.length > 1 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs space-y-2.5 sticky bottom-0 z-30">
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-xl p-2 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <input
              type="text"
              placeholder={`Ask follow-up underwriters for ${currentContextName}...`}
              className="w-full bg-transparent px-3 text-xs font-bold text-slate-800 outline-none placeholder-slate-400"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && triggerAIMessage(inputMessage)}
            />
            
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Dictation Trigger */}
              <button
                onClick={handleVoiceClick}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                  isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-200/40 hover:bg-slate-200 text-slate-500'
                } cursor-pointer`}
                title="Voice Appraisal"
              >
                <Mic className="w-3.5 h-3.5" />
              </button>

              {/* Attachment Trigger */}
              <button
                onClick={handleAttachmentClick}
                className="w-9 h-9 rounded-lg bg-slate-200/40 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-all"
                title="Attach Document"
              >
                <Paperclip className="w-3.5 h-3.5" />
              </button>
              
              <button
                onClick={() => triggerAIMessage(inputMessage)}
                disabled={isThinking || !inputMessage.trim()}
                className="w-9 h-9 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shrink-0 disabled:opacity-50 cursor-pointer transition-all active:scale-95"
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>

          {/* Attachment list if any */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 px-2 pb-1">
              {attachments.map((file, fileIdx) => (
                <div
                  key={fileIdx}
                  className="flex items-center gap-1 bg-slate-100 border border-slate-200 px-2 py-1 rounded text-[9px] font-bold text-slate-600 shadow-2xs"
                >
                  <FileText className="w-3 h-3 text-indigo-500" />
                  <span className="truncate max-w-[120px]">{file.name}</span>
                  <button onClick={() => handleRemoveAttachment(fileIdx)} className="text-slate-400 hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input details footer bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2">
            <div className="flex items-center gap-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={deepAnalysis}
                  onChange={(e) => {
                    setDeepAnalysis(e.target.checked);
                    triggerToast(e.target.checked ? 'Enabled Deep Analysis mode. Cross-referencing external Oqood matrices.' : 'Disabled Deep Analysis mode.');
                  }}
                  className="sr-only peer"
                />
                <div className="w-8 h-4 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-indigo-600"></div>
                <span className="ml-2 text-[9px] font-black text-slate-400 uppercase tracking-wide">
                  Deep Analysis Registry Mode
                </span>
              </label>
              <button
                onClick={() => triggerToast('Deep Analysis verifies historical escalation waves against live escrow registers.')}
                className="text-slate-400 hover:text-slate-600"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[9px] text-slate-400 font-bold flex items-center gap-1.5">
              {hasProfAccess && (
                <span className="inline-flex items-center gap-1 text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 font-extrabold uppercase">
                  🛡️ Professional Context Active
                </span>
              )}
              <span>All outputs are algorithmically cross-verified with Ejari lease logs.</span>
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
