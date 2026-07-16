import { useState, useEffect, useMemo } from 'react';
import { useAnalysisContext } from '../../context/AnalysisContext';
import { useMarketAnalytics } from '../../context/MarketAnalyticsContext';
import {
  InvestmentService,
  MortgageService,
  DecisionService,
  ROICalculatorParams,
  MortgageCalculatorParams
} from '../../services/investmentService';
import AnalysisContextSwitcher from './AnalysisContextSwitcher';
import {
  Calculator,
  ShieldCheck,
  TrendingUp,
  Coins,
  ArrowRight,
  Sparkles,
  Download,
  Printer,
  Percent,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ChevronRight,
  Briefcase,
  X,
  Star,
  FileText,
  Building,
  Check,
  LineChart,
  ArrowUpRight,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InvestorToolsProps {
  onNavigateToModule?: (moduleName: string) => void;
  triggerToast?: (msg: string) => void;
}

export default function InvestorTools({
  onNavigateToModule,
  triggerToast = () => {}
}: InvestorToolsProps) {
  const { communityId, subAreaId, projectId } = useAnalysisContext();
  const { selectedCommunity, selectedSubArea, selectedProject, communities } = useMarketAnalytics();

  // Active geographic community details
  const activeCommunity = useMemo(() => {
    return communities.find(c => c.id === communityId) || communities[0] || {
      id: 'dubai-marina',
      name: 'Dubai Marina',
      avgPrice: 1654,
      yield: 7.2,
      growth: 28.4
    };
  }, [communityId, communities]);

  // ----------------------------------------------------------------
  // CALCULATOR STATES (Unified)
  // ----------------------------------------------------------------

  // ROI / Return Model States
  const [purchasePrice, setPurchasePrice] = useState<number>(1984800);
  const [annualRent, setAnnualRent] = useState<number>(142906);
  const [holdingPeriod, setHoldingPeriod] = useState<number>(5);
  const [expectedAppreciation, setExpectedAppreciation] = useState<number>(7.1);
  
  // OpEx percentages
  const [serviceCharges, setServiceCharges] = useState<number>(5);
  const [maintenanceCost, setMaintenanceCost] = useState<number>(2);
  const [managementFee, setManagementFee] = useState<number>(5);
  const [vacancyRate, setVacancyRate] = useState<number>(5);

  // Mortgage Financing States
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(25);
  const [interestRate, setInterestRate] = useState<number>(4.25);
  const [loanTenure, setLoanTenure] = useState<number>(25);
  const [processingFeePercent, setProcessingFeePercent] = useState<number>(1);
  const [bankFee, setBankFee] = useState<number>(2500);

  // Affordability States
  const [monthlyIncome, setMonthlyIncome] = useState<number>(35000);
  const [existingDebt, setExistingDebt] = useState<number>(0);

  // UI States
  const [activeTab, setActiveTab] = useState<'roi' | 'mortgage'>('roi');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showProspectus, setShowProspectus] = useState(false);
  const [showFormulaModal, setShowFormulaModal] = useState(false);
  const [showDetailedROI, setShowDetailedROI] = useState(false);
  const [showDetailedMortgage, setShowDetailedMortgage] = useState(false);

  // ----------------------------------------------------------------
  // AUTO-PREFILL ON ANALYSIS CONTEXT CHANGE
  // ----------------------------------------------------------------
  useEffect(() => {
    if (!activeCommunity) return;

    setIsRefreshing(true);
    const timer = setTimeout(() => {
      const typicalSize = 1200;
      const derivedPrice = Math.round(activeCommunity.avgPrice * typicalSize);
      
      const currentYield = activeCommunity.yield || 7.2;
      const derivedRent = Math.round(derivedPrice * (currentYield / 100));

      setPurchasePrice(derivedPrice);
      setAnnualRent(derivedRent);

      const growthRate = activeCommunity.growth ? Math.min(8.5, Math.max(3.5, activeCommunity.growth / 4)) : 5.5;
      setExpectedAppreciation(Number(growthRate.toFixed(1)));

      setIsRefreshing(false);
      triggerToast(`Prefilled metrics for ${activeCommunity.name}`);
    }, 400);

    return () => clearTimeout(timer);
  }, [communityId, activeCommunity, triggerToast]);

  // ----------------------------------------------------------------
  // COMPUTED RESULTS
  // ----------------------------------------------------------------

  const roiParams: ROICalculatorParams = useMemo(() => ({
    purchasePrice,
    annualRent,
    holdingPeriod,
    expectedAppreciation,
    serviceCharges,
    maintenanceCost,
    managementFee,
    vacancyRate
  }), [
    purchasePrice,
    annualRent,
    holdingPeriod,
    expectedAppreciation,
    serviceCharges,
    maintenanceCost,
    managementFee,
    vacancyRate
  ]);

  const mortgageParams: MortgageCalculatorParams = useMemo(() => ({
    purchasePrice,
    downPaymentPercent,
    interestRate,
    loanTenure,
    processingFeePercent,
    bankFee
  }), [
    purchasePrice,
    downPaymentPercent,
    interestRate,
    loanTenure,
    processingFeePercent,
    bankFee
  ]);

  const roiResults = useMemo(() => {
    return InvestmentService.calculateROI(roiParams);
  }, [roiParams]);

  const mortgageResults = useMemo(() => {
    return MortgageService.calculateMortgage(mortgageParams);
  }, [mortgageParams]);

  const decisionResults = useMemo(() => {
    return DecisionService.generateInvestmentDecision(
      roiResults,
      mortgageResults,
      annualRent
    );
  }, [roiResults, mortgageResults, annualRent]);

  // Derived Values
  const downPaymentAED = useMemo(() => {
    return purchasePrice * (downPaymentPercent / 100);
  }, [purchasePrice, downPaymentPercent]);

  const grossYield = useMemo(() => {
    return purchasePrice > 0 ? (annualRent / purchasePrice) * 100 : 0;
  }, [annualRent, purchasePrice]);

  const totalExpensesRate = useMemo(() => {
    return serviceCharges + maintenanceCost + managementFee + vacancyRate;
  }, [serviceCharges, maintenanceCost, managementFee, vacancyRate]);

  const netYield = useMemo(() => {
    if (purchasePrice <= 0) return 0;
    const netRent = annualRent * (1 - (totalExpensesRate / 100));
    return (netRent / purchasePrice) * 100;
  }, [annualRent, totalExpensesRate, purchasePrice]);

  const breakEvenYears = useMemo(() => {
    const netRent = annualRent * (1 - (totalExpensesRate / 100));
    return netRent > 0 ? purchasePrice / netRent : 99;
  }, [purchasePrice, annualRent, totalExpensesRate]);

  const dti = useMemo(() => {
    if (monthlyIncome <= 0) return 0;
    return ((mortgageResults.monthlyEMI + existingDebt) / monthlyIncome) * 100;
  }, [mortgageResults.monthlyEMI, existingDebt, monthlyIncome]);

  const affordabilityText = useMemo(() => {
    if (dti <= 35) return 'Highly Affordable (Low Risk)';
    if (dti <= 50) return 'Moderate (Medium Risk)';
    return 'Stretched (High Risk)';
  }, [dti]);

  // ----------------------------------------------------------------
  // HANDLERS
  // ----------------------------------------------------------------

  const handleDiscussWithAI = () => {
    if (!onNavigateToModule) {
      triggerToast('AI routing is disabled in this layout.');
      return;
    }

    // Prepare detailed structured calculation context payload for AI
    const aiPrompt = `Perform an institutional real estate underwriting review for the active property model in ${activeCommunity.name}:
- **Community Context**: ${selectedCommunity?.name || 'Dubai Marina'} | ${selectedSubArea?.name || 'All Sub-Areas'} | ${selectedProject?.name || 'All Projects'}
- **Purchase Price**: AED ${purchasePrice.toLocaleString()}
- **Expected Annual Rental Income**: AED ${annualRent.toLocaleString()}
- **Holding Period**: ${holdingPeriod} Years
- **Operating Expenses**: Service Charges (${serviceCharges}%), Maintenance (${maintenanceCost}%), Management Fee (${managementFee}%), Vacancy Rate (${vacancyRate}%) - Total: ${totalExpensesRate}% of Gross Rent (AED ${Math.round(roiResults.totalExpenses / holdingPeriod).toLocaleString()}/year)
- **Capital Appreciation**: ${expectedAppreciation}% p.a. (Total over Hold: AED ${roiResults.capitalAppreciation.toLocaleString()})
- **Calculated ROI Returns**:
  - Gross Yield: ${grossYield.toFixed(2)}%
  - Net Yield: ${netYield.toFixed(2)}%
  - Annual Cash Flow: AED ${Math.round(roiResults.netRentalIncome / holdingPeriod).toLocaleString()}/year (after OpEx)
  - Total ROI (Cumulative): ${roiResults.roi}%
  - Estimated Break-even: ${breakEvenYears.toFixed(1)} Years
- **Mortgage Financing Model (if leveraged)**:
  - Down Payment: ${downPaymentPercent}% (AED ${downPaymentAED.toLocaleString()})
  - Loan Principal (LTV ${mortgageResults.ltv}%): AED ${mortgageResults.loanAmount.toLocaleString()}
  - Interest Rate: ${interestRate}% p.a. over ${loanTenure} Years
  - Monthly EMI: AED ${mortgageResults.monthlyEMI.toLocaleString()}/month
  - Total Interest: AED ${mortgageResults.totalInterest.toLocaleString()}
  - Total Repayment: AED ${mortgageResults.totalRepayment.toLocaleString()}
- **Affordability Parameters**:
  - Monthly Income: AED ${monthlyIncome.toLocaleString()}
  - Existing Debt: AED ${existingDebt.toLocaleString()}
  - Debt-to-Income (DTI) Ratio: ${dti.toFixed(1)}%
  - Affordability Rating: ${affordabilityText}
- **Overall Assessment Rating**: ${decisionResults.investmentRating} (${decisionResults.affordabilityIndicator} Affordability)

Explain these financial returns in plain language, analyze underlying yield risk factors, and provide strategic advice on capital growth for an investor.`;

    // Dispatch custom event to trigger AI response
    window.dispatchEvent(new CustomEvent('acot-ai-trigger-action', {
      detail: {
        prompt: aiPrompt,
        context: {
          communityId,
          subAreaId,
          projectId,
          calculatorResults: {
            roi: roiResults.roi,
            emi: mortgageResults.monthlyEMI,
            cashFlow: decisionResults.estimatedAnnualCashFlow
          }
        }
      }
    }));

    triggerToast('Transferring financial calculation model to AI Intelligence Suite...');
    
    // Smooth route transition
    setTimeout(() => {
      onNavigateToModule('AI Intelligence Suite');
    }, 850);
  };

  const handleExportProspectus = () => {
    setShowProspectus(true);
    triggerToast('Generated Institutional Grade Property Prospectus');
  };

  const handleCompareAnother = () => {
    if (onNavigateToModule) {
      onNavigateToModule('Community Deep Analysis');
      triggerToast('Navigated to Community Deep Analysis for head-to-head appraisal.');
    } else {
      triggerToast('Module navigation is disabled.');
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto px-1">
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700">
            <Calculator className="w-3.5 h-3.5" />
            Decision Intelligence Layer
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            Investor Tools & Calculators
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Conduct Institutional-grade ROI forecasting and mortgage evaluation grounded on verified DLD records.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportProspectus}
            className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs active:scale-98"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export Prospectus
          </button>
          <button
            onClick={handleDiscussWithAI}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 cursor-pointer active:scale-98"
          >
            <Sparkles className="w-4 h-4 text-white" />
            Ask AI to Explain
          </button>
        </div>
      </div>

      {/* 2. GLOBAL CONTEXT */}
      <AnalysisContextSwitcher
        moduleName="Investor Tools"
        triggerToast={triggerToast}
      />

      {/* Main Responsive Grid Layout (Col 9 Left / Col 3 Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
        
        {/* Left Area (KPIs and Calculator Workspace) - col-span-9 */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* 3. KPI OVERVIEW - 4 CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Purchase Price */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4.5 shadow-xs relative overflow-hidden group hover:border-indigo-100 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Purchase Price</span>
                <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50/50 px-2 py-0.5 rounded-md font-mono">AED</span>
              </div>
              <div className="mt-2.5">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  {isRefreshing ? '...' : `AED ${purchasePrice.toLocaleString()}`}
                </h3>
                <p className="text-[9px] text-slate-400 font-medium mt-1 flex items-center gap-1.5 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Avg: AED {activeCommunity.avgPrice.toLocaleString()}/sqft
                </p>
              </div>
            </div>

            {/* Card 2: Annual Cash Flow */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4.5 shadow-xs relative overflow-hidden group hover:border-indigo-100 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Annual Cash Flow</span>
                <Coins className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="mt-2.5">
                <h3 className={`text-lg font-black tracking-tight ${
                  decisionResults.estimatedAnnualCashFlow >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {isRefreshing ? '...' : `${decisionResults.estimatedAnnualCashFlow >= 0 ? '+' : ''}AED ${decisionResults.estimatedAnnualCashFlow.toLocaleString()}`}
                </h3>
                <p className="text-[9px] text-slate-400 font-medium mt-1 truncate">
                  Net income after OpEx & Financing
                </p>
              </div>
            </div>

            {/* Card 3: Estimated ROI */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4.5 shadow-xs relative overflow-hidden group hover:border-indigo-100 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimated ROI</span>
                <TrendingUp className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="mt-2.5">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  {isRefreshing ? '...' : `${roiResults.roi}%`}
                </h3>
                <p className="text-[9px] text-slate-500 font-medium mt-1 font-mono flex gap-1.5 truncate">
                  <span className="text-indigo-600">{roiResults.annualizedReturn}% / year</span>
                  <span>({holdingPeriod} yr hold)</span>
                </p>
              </div>
            </div>

            {/* Card 4: Monthly Mortgage EMI */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4.5 shadow-xs relative overflow-hidden group hover:border-indigo-100 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monthly Mortgage EMI</span>
                <Percent className="w-4 h-4 text-slate-400" />
              </div>
              <div className="mt-2.5">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  {isRefreshing ? '...' : `AED ${mortgageResults.monthlyEMI.toLocaleString()}/mo`}
                </h3>
                <p className="text-[9px] text-slate-400 font-medium mt-1 truncate">
                  Loan: {100 - downPaymentPercent}% LTV @ {interestRate}% p.a.
                </p>
              </div>
            </div>

          </div>

          {/* 4. CALCULATOR WORKSPACE */}
          <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm p-6 md:p-8 space-y-6">
            
            {/* Header / Tabs Selector */}
            <div className="flex flex-col sm:flex-row border-b border-slate-100 pb-4 justify-between sm:items-center gap-3">
              <div className="flex gap-2 bg-slate-50 p-1 rounded-xl w-fit self-start">
                <button
                  onClick={() => setActiveTab('roi')}
                  className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'roi'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-950'
                  }`}
                >
                  ROI Calculator
                </button>
                <button
                  onClick={() => setActiveTab('mortgage')}
                  className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'mortgage'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-950'
                  }`}
                >
                  Mortgage Calculator
                </button>
              </div>

              {/* Core Questions Handled & Formula Link */}
              <div className="flex items-center justify-between sm:justify-end gap-4">
                <div className="text-right hidden md:block">
                  <p className="text-[10px] font-bold text-slate-400 uppercase font-mono tracking-wider">
                    {activeTab === 'roi' ? '• What returns can I expect?' : '• Can I afford this investment?'}
                  </p>
                </div>
                <button
                  onClick={() => setShowFormulaModal(true)}
                  className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  How are these calculations performed?
                </button>
              </div>
            </div>

            {/* TAB 1: ROI CALCULATOR */}
            {activeTab === 'roi' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start animate-fadeIn">
                
                {/* LEFT COLUMN: INPUTS */}
                <div className="md:col-span-7 space-y-6">
                  <div className="text-left">
                    <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block font-mono">
                      01 / INPUT METRICS
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Purchase Price */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">Purchase Price (AED)</label>
                      <div className="relative rounded-xl">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-slate-400 text-xs font-bold">AED</span>
                        </div>
                        <input
                          type="number"
                          value={purchasePrice}
                          onChange={(e) => setPurchasePrice(Math.max(0, parseInt(e.target.value) || 0))}
                          className="block w-full pl-12 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    {/* Expected Rent */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">Annual Rental Income (AED)</label>
                      <div className="relative rounded-xl">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-slate-400 text-xs font-bold">AED</span>
                        </div>
                        <input
                          type="number"
                          value={annualRent}
                          onChange={(e) => setAnnualRent(Math.max(0, parseInt(e.target.value) || 0))}
                          className="block w-full pl-12 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                  </div>

                  {/* Sliders */}
                  <div className="space-y-5">
                    
                    {/* Holding Period */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-700">Holding Period</label>
                        <span className="px-2 py-0.5 bg-indigo-50 rounded text-indigo-700 font-extrabold text-xs font-mono">
                          {holdingPeriod} Years
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        step="1"
                        value={holdingPeriod}
                        onChange={(e) => setHoldingPeriod(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 font-bold font-mono">
                        <span>1 YEAR</span>
                        <span>5 YRS</span>
                        <span>10 YRS</span>
                        <span>15 YRS</span>
                        <span>20 YRS</span>
                      </div>
                    </div>

                    {/* Expected Appreciation */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-700">Expected Capital Appreciation (% p.a.)</label>
                        <span className="px-2 py-0.5 bg-emerald-50 rounded text-emerald-700 font-extrabold text-xs font-mono">
                          {expectedAppreciation}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="15"
                        step="0.1"
                        value={expectedAppreciation}
                        onChange={(e) => setExpectedAppreciation(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 font-bold font-mono">
                        <span>0% STAGNANT</span>
                        <span>5.5% AVERAGE</span>
                        <span>10% STRONG</span>
                        <span>15% MAXIMUM</span>
                      </div>
                    </div>

                  </div>

                  {/* Operating Expenses */}
                  <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 md:p-5">
                    <h4 className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1.5 mb-3.5">
                      <Briefcase className="w-4 h-4 text-indigo-600" />
                      Annual Operating Expenses (% of Gross Rent)
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Service Chgs</label>
                        <div className="relative rounded-lg">
                          <input
                            type="number"
                            value={serviceCharges}
                            onChange={(e) => setServiceCharges(Math.max(0, parseFloat(e.target.value) || 0))}
                            className="w-full bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-lg py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-center"
                          />
                          <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-400">%</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Maintenance</label>
                        <div className="relative rounded-lg">
                          <input
                            type="number"
                            value={maintenanceCost}
                            onChange={(e) => setMaintenanceCost(Math.max(0, parseFloat(e.target.value) || 0))}
                            className="w-full bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-lg py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-center"
                          />
                          <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-400">%</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Mgmt Fee</label>
                        <div className="relative rounded-lg">
                          <input
                            type="number"
                            value={managementFee}
                            onChange={(e) => setManagementFee(Math.max(0, parseFloat(e.target.value) || 0))}
                            className="w-full bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-lg py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-center"
                          />
                          <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-400">%</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Vacancy Rate</label>
                        <div className="relative rounded-lg">
                          <input
                            type="number"
                            value={vacancyRate}
                            onChange={(e) => setVacancyRate(Math.max(0, parseFloat(e.target.value) || 0))}
                            className="w-full bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-lg py-1.5 px-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-center"
                          />
                          <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-400">%</span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Summary prefilled items */}
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="bg-indigo-50/30 border border-indigo-100/50 rounded-xl p-3 text-left">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Gross Rental Income / Year</span>
                      <span className="text-sm font-extrabold text-indigo-700 block mt-0.5">AED {annualRent.toLocaleString()}</span>
                    </div>
                    <div className="bg-emerald-50/30 border border-emerald-100/50 rounded-xl p-3 text-left">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Capital Appreciation ({holdingPeriod} Yrs)</span>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-sm font-extrabold text-emerald-700">AED {Math.round(roiResults.capitalAppreciation).toLocaleString()}</span>
                        <span className="text-[9px] font-bold text-emerald-600 font-mono">+{expectedAppreciation}% p.a.</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* RIGHT COLUMN: LIVE RESULTS */}
                <div className="md:col-span-5 bg-slate-50/30 border border-slate-100 rounded-3xl p-5 md:p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block font-mono">
                      02 / LIVE RESULTS
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                      Auto-updated
                    </span>
                  </div>

                  <div className="space-y-3">
                    
                    {/* Result 1: Gross Yield */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Gross Yield</span>
                        <span className="text-xl font-black text-slate-900 block mt-0.5">{grossYield.toFixed(2)}%</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">of Property Price</span>
                    </div>

                    {/* Result 2: Net Yield */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Net Yield</span>
                        <span className="text-xl font-black text-slate-900 block mt-0.5">{netYield.toFixed(2)}%</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">of Property Price</span>
                    </div>

                    {/* Result 3: Annual Cash Flow */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Annual Cash Flow</span>
                        <span className="text-xl font-black text-emerald-600 block mt-0.5">AED {Math.round(roiResults.netRentalIncome / holdingPeriod).toLocaleString()}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">After Operating Exp.</span>
                    </div>

                    {/* Result 4: Total ROI */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Total ROI ({holdingPeriod} Years)</span>
                        <span className="text-xl font-black text-indigo-600 block mt-0.5">{roiResults.roi}%</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">Incl. Appreciation</span>
                    </div>

                    {/* Result 5: Break-even */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Break-even</span>
                        <span className="text-xl font-black text-slate-900 block mt-0.5">{breakEvenYears.toFixed(1)} Years</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">Estimated</span>
                    </div>

                  </div>

                  {/* Toggle Detailed Breakdown */}
                  <div className="pt-2">
                    <button
                      onClick={() => setShowDetailedROI(!showDetailedROI)}
                      className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                    >
                      <span>View Detailed Breakdown</span>
                      <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${showDetailedROI ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {showDetailedROI && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden mt-3"
                        >
                          <div className="p-4 bg-white border border-slate-100 rounded-2xl text-xs space-y-2.5">
                            <div className="flex justify-between py-1 border-b border-slate-50">
                              <span className="text-slate-400">Total Purchase Value:</span>
                              <span className="font-extrabold text-slate-800">AED {purchasePrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-50">
                              <span className="text-slate-400">Cumulative Rent Received:</span>
                              <span className="font-extrabold text-slate-800">AED {roiResults.totalRentalIncome.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-50">
                              <span className="text-slate-400">Operating Expenses ({totalExpensesRate}%):</span>
                              <span className="font-extrabold text-rose-600">-AED {Math.round(roiResults.totalExpenses).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-50">
                              <span className="text-slate-400">Total Capital Value Gain:</span>
                              <span className="font-extrabold text-emerald-600">+AED {Math.round(roiResults.capitalAppreciation).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between py-1.5 pt-2 border-t border-slate-100 font-bold text-slate-900 bg-indigo-50/30 px-2 rounded-lg">
                              <span>Total Net Profit:</span>
                              <span className="text-indigo-600">AED {Math.round(roiResults.estimatedProfit).toLocaleString()}</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 2: MORTGAGE CALCULATOR */}
            {activeTab === 'mortgage' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start animate-fadeIn">
                
                {/* LEFT COLUMN: INPUTS */}
                <div className="md:col-span-7 space-y-6">
                  <div className="text-left">
                    <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block font-mono">
                      01 / FINANCING PARAMETERS
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Property Price */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">Property Price (AED)</label>
                      <div className="relative rounded-xl">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-slate-400 text-xs font-bold">AED</span>
                        </div>
                        <input
                          type="number"
                          value={purchasePrice}
                          onChange={(e) => setPurchasePrice(Math.max(0, parseInt(e.target.value) || 0))}
                          className="block w-full pl-12 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    {/* Interest Rate */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">Interest Rate (% p.a.)</label>
                      <div className="relative rounded-xl">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-slate-400 text-xs font-bold">%</span>
                        </div>
                        <input
                          type="number"
                          step="0.05"
                          value={interestRate}
                          onChange={(e) => setInterestRate(Math.max(0, parseFloat(e.target.value) || 0))}
                          className="block w-full pl-8 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                  </div>

                  {/* Sliders */}
                  <div className="space-y-5">
                    
                    {/* Down Payment */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-700">Down Payment Percentage</label>
                        <span className="px-2 py-0.5 bg-indigo-50 rounded text-indigo-700 font-extrabold text-xs font-mono">
                          {downPaymentPercent}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="80"
                        step="5"
                        value={downPaymentPercent}
                        onChange={(e) => setDownPaymentPercent(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 font-bold font-mono">
                        <span>10% MIN</span>
                        <span>25% RECOMMENDED</span>
                        <span>50% BALANCED</span>
                        <span>80% MAXIMUM</span>
                      </div>
                    </div>

                    {/* Loan Tenure / Term */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-slate-700">Loan Term (Tenure)</label>
                        <span className="px-2 py-0.5 bg-emerald-50 rounded text-emerald-700 font-extrabold text-xs font-mono">
                          {loanTenure} Years
                        </span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="30"
                        step="1"
                        value={loanTenure}
                        onChange={(e) => setLoanTenure(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400 font-bold font-mono">
                        <span>5 YEARS</span>
                        <span>15 YEARS</span>
                        <span>25 YEARS</span>
                        <span>30 YEARS</span>
                      </div>
                    </div>

                  </div>

                  {/* Affordability Input Elements (Monthly Income & Existing Debt) */}
                  <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 md:p-5 space-y-4">
                    <h4 className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-indigo-600" />
                      Client Income & Debt (Affordability Assessment)
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Monthly Income (AED)</label>
                        <div className="relative rounded-lg">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-slate-400 text-xs font-bold">AED</span>
                          </div>
                          <input
                            type="number"
                            value={monthlyIncome}
                            onChange={(e) => setMonthlyIncome(Math.max(0, parseInt(e.target.value) || 0))}
                            className="block w-full pl-11 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Existing Monthly Debt (AED)</label>
                        <div className="relative rounded-lg">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-slate-400 text-xs font-bold">AED</span>
                          </div>
                          <input
                            type="number"
                            value={existingDebt}
                            onChange={(e) => setExistingDebt(Math.max(0, parseInt(e.target.value) || 0))}
                            className="block w-full pl-11 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Summary labels */}
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="bg-indigo-50/30 border border-indigo-100/50 rounded-xl p-3 text-left">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Down Payment Cash Required</span>
                      <span className="text-sm font-extrabold text-indigo-700 block mt-0.5">AED {downPaymentAED.toLocaleString()}</span>
                    </div>
                    <div className="bg-emerald-50/30 border border-emerald-100/50 rounded-xl p-3 text-left">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Total Principal Loan Amount</span>
                      <span className="text-sm font-extrabold text-emerald-700 block mt-0.5">AED {mortgageResults.loanAmount.toLocaleString()}</span>
                    </div>
                  </div>

                </div>

                {/* RIGHT COLUMN: LIVE RESULTS */}
                <div className="md:col-span-5 bg-slate-50/30 border border-slate-100 rounded-3xl p-5 md:p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block font-mono">
                      02 / LIVE RESULTS
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                      Auto-updated
                    </span>
                  </div>

                  <div className="space-y-3">
                    
                    {/* EMI */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Monthly EMI</span>
                        <span className="text-xl font-black text-slate-900 block mt-0.5">AED {mortgageResults.monthlyEMI.toLocaleString()}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">Financing Installment</span>
                    </div>

                    {/* Total Interest */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Total Interest</span>
                        <span className="text-xl font-black text-rose-600 block mt-0.5">AED {mortgageResults.totalInterest.toLocaleString()}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">Over Term</span>
                    </div>

                    {/* Total Repayment */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Total Repayment</span>
                        <span className="text-xl font-black text-slate-900 block mt-0.5">AED {mortgageResults.totalRepayment.toLocaleString()}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">Principal + Interest</span>
                    </div>

                    {/* DTI */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Debt-To-Income (DTI)</span>
                        <span className="text-xl font-black text-indigo-600 block mt-0.5">{dti.toFixed(1)}%</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">of Monthly Income</span>
                    </div>

                    {/* Affordability Assessment */}
                    <div className="bg-white border border-slate-100 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">Affordability Assessment</span>
                        <span className={`text-sm font-extrabold block mt-1.5 ${
                          dti <= 35 ? 'text-emerald-600' : dti <= 50 ? 'text-amber-500' : 'text-rose-500'
                        }`}>{affordabilityText}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">Calculated DTI</span>
                    </div>

                  </div>

                  {/* Toggle Detailed Breakdown */}
                  <div className="pt-2">
                    <button
                      onClick={() => setShowDetailedMortgage(!showDetailedMortgage)}
                      className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                    >
                      <span>View Detailed Breakdown</span>
                      <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${showDetailedMortgage ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {showDetailedMortgage && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden mt-3"
                        >
                          <div className="p-4 bg-white border border-slate-100 rounded-2xl text-xs space-y-2.5">
                            <div className="flex justify-between py-1 border-b border-slate-50">
                              <span className="text-slate-400">Loan To Value (LTV):</span>
                              <span className="font-extrabold text-slate-800">{mortgageResults.ltv}%</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-50">
                              <span className="text-slate-400">Total Upfront Downpayment:</span>
                              <span className="font-extrabold text-slate-800">AED {downPaymentAED.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-50">
                              <span className="text-slate-400">Processing Fee ({processingFeePercent}%):</span>
                              <span className="font-extrabold text-slate-800">AED {mortgageResults.processingFeeAmount.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-50">
                              <span className="text-slate-400">Fixed Bank Fees:</span>
                              <span className="font-extrabold text-slate-800">AED {bankFee.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between py-1.5 pt-2 border-t border-slate-100 font-bold text-slate-900 bg-indigo-50/30 px-2 rounded-lg">
                              <span>Total Cash Needed on Closing:</span>
                              <span className="text-indigo-600">AED {(downPaymentAED + mortgageResults.processingFeeAmount + bankFee).toLocaleString()}</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>

              </div>
            )}

          </div>

        </div>

        {/* Sidebar Panel (Investment Summary and Continue Analysis) - col-span-3 */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* 5. INVESTMENT SUMMARY */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-5 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 rounded-full blur-xl pointer-events-none"></div>
            
            <div className="border-b border-slate-50 pb-2.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-slate-50 text-slate-600 border border-slate-100">
                <ShieldCheck className="w-3 h-3 text-slate-400" />
                Portfolio Summary
              </span>
              <h3 className="text-sm font-extrabold text-slate-900 mt-1">Investment Summary</h3>
            </div>

            {/* Stars Overall Rating Display */}
            <div className="text-center p-4 bg-slate-50/50 border border-slate-100 rounded-2xl space-y-2 relative">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 font-mono block">
                Overall Rating
              </span>
              
              <div className="flex items-center justify-center gap-0.5 text-amber-400">
                {decisionResults.investmentRating === 'Excellent' && (
                  <>
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </>
                )}
                {decisionResults.investmentRating === 'Moderate' && (
                  <>
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <Star className="w-4 h-4 text-slate-300" />
                  </>
                )}
                {decisionResults.investmentRating === 'High Risk' && (
                  <>
                    <Star className="w-4 h-4 fill-rose-500 text-rose-500" />
                    <Star className="w-4 h-4 fill-rose-500 text-rose-500" />
                    <Star className="w-4 h-4 text-slate-300" />
                    <Star className="w-4 h-4 text-slate-300" />
                    <Star className="w-4 h-4 text-slate-300" />
                  </>
                )}
              </div>

              <span className={`text-xs font-black block tracking-tight uppercase ${
                decisionResults.investmentRating === 'Excellent' ? 'text-emerald-600' : decisionResults.investmentRating === 'Moderate' ? 'text-indigo-600' : 'text-rose-600'
              }`}>
                {decisionResults.investmentRating === 'Excellent' ? 'Strong Opportunity' : decisionResults.investmentRating === 'Moderate' ? 'Solid Opportunity' : 'High Risk Setup'}
              </span>
            </div>

            {/* Quick stats list */}
            <div className="space-y-2.5 text-xs pt-1">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Expected ROI ({holdingPeriod} Yrs):</span>
                <span className="font-extrabold text-slate-800">{roiResults.roi}%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Net Yield:</span>
                <span className="font-extrabold text-slate-800">{netYield.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Annual Cash Flow:</span>
                <span className={`font-extrabold ${decisionResults.estimatedAnnualCashFlow >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                  AED {decisionResults.estimatedAnnualCashFlow.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Break-even:</span>
                <span className="font-extrabold text-slate-800">{breakEvenYears.toFixed(1)} Years</span>
              </div>
            </div>

            {/* Structured Recommendation Panel */}
            <div className={`p-4 rounded-xl border text-xs leading-relaxed font-medium ${
              decisionResults.investmentRating === 'Excellent'
                ? 'bg-emerald-50/50 border-emerald-100 text-slate-700'
                : decisionResults.investmentRating === 'Moderate'
                ? 'bg-indigo-50/50 border-indigo-100 text-slate-700'
                : 'bg-rose-50/50 border-rose-100 text-slate-700'
            }`}>
              <strong className="block text-[10px] font-extrabold uppercase mb-1 tracking-wider">
                Recommendation Advice:
              </strong>
              {decisionResults.investmentRating === 'Excellent' && (
                <span>This property shows strong rental yield and positive cash flow with good appreciation potential. Suitable for long-term rental income investors.</span>
              )}
              {decisionResults.investmentRating === 'Moderate' && (
                <span>Solid yields with manageable financing costs. Downside is well buffered, requiring standard deal monitoring. Suitable after reviewing assumptions.</span>
              )}
              {decisionResults.investmentRating === 'High Risk' && (
                <span>Financing obligations exceed expected rental income. Monthly cash flow is net-negative, demanding supplementary funding. Review assumptions.</span>
              )}
            </div>

            {/* Inner Ask AI Trigger */}
            <button
              onClick={handleDiscussWithAI}
              className="w-full inline-flex items-center justify-between py-2 px-3.5 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 text-[11px] font-bold rounded-xl transition-all cursor-pointer border border-indigo-100"
            >
              <span>Ask AI to Explain Results</span>
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
            </button>

          </div>

          {/* 6. CONTINUE YOUR ANALYSIS */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm text-left space-y-4">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono">
                Continue Analysis
              </h3>
            </div>

            <div className="space-y-2.5">
              
              {/* Action 1: Ask AI */}
              <button
                onClick={handleDiscussWithAI}
                className="w-full flex items-center justify-between p-3 bg-slate-50/50 hover:bg-indigo-50/30 border border-slate-100 hover:border-indigo-100 rounded-2xl text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block group-hover:text-indigo-600 transition-colors">Ask AI to Explain Results</span>
                    <span className="text-[9px] text-slate-400 block mt-0.5 font-medium">Get deeper insights and recommendations</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Action 2: Generate Report */}
              <button
                onClick={handleExportProspectus}
                className="w-full flex items-center justify-between p-3 bg-slate-50/50 hover:bg-indigo-50/30 border border-slate-100 hover:border-indigo-100 rounded-2xl text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center font-bold">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block group-hover:text-indigo-600 transition-colors">Generate Investment Report</span>
                    <span className="text-[9px] text-slate-400 block mt-0.5 font-medium">Create a professional investment report</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Action 3: Compare Another Property */}
              <button
                onClick={handleCompareAnother}
                className="w-full flex items-center justify-between p-3 bg-slate-50/50 hover:bg-indigo-50/30 border border-slate-100 hover:border-indigo-100 rounded-2xl text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
                    <LineChart className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block group-hover:text-emerald-600 transition-colors">Compare Another Property</span>
                    <span className="text-[9px] text-slate-400 block mt-0.5 font-medium">Evaluate and compare opportunities</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* 7. BOTTOM BANNER */}
      <div className="bg-indigo-50 border border-indigo-100/60 rounded-3xl p-4.5 flex flex-col md:flex-row items-center justify-between gap-4 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100/50 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center gap-3 relative z-10">
          <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse shrink-0" />
          <p className="text-xs font-medium text-slate-700 leading-relaxed">
            Need help interpreting these results? Ask our AI analyst for personalized insights and recommendations.
          </p>
        </div>
        <button
          onClick={handleDiscussWithAI}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 cursor-pointer active:scale-95 z-10 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          Ask AI to Explain
        </button>
      </div>

      {/* ================================================================ */}
      {/* METHODOLOGY & FORMULA EXPLANATIONS MODAL */}
      {/* ================================================================ */}
      <AnimatePresence>
        {showFormulaModal && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-[2rem] border border-slate-100 w-full max-w-xl shadow-2xl p-6 md:p-8 space-y-6 relative text-left">
              
              <button
                onClick={() => setShowFormulaModal(false)}
                className="absolute top-5 right-5 p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1.5 border-b border-slate-100 pb-3">
                <h3 className="text-sm font-extrabold text-slate-950 flex items-center gap-2">
                  <Calculator className="w-4.5 h-4.5 text-indigo-600" />
                  Financial Methodology & Formulas
                </h3>
                <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                  How calculations are computed
                </p>
              </div>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                
                {/* ROI Formulas */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide border-l-2 border-indigo-600 pl-2">
                    ROI Returns Forecast
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl space-y-1.5">
                      <span className="font-extrabold text-slate-800 block">Gross Rental Yield</span>
                      <code className="block font-mono text-[10px] bg-white p-1.5 rounded border border-slate-100 text-indigo-600">
                        Gross Yield = (Annual Rental Income ÷ Purchase Price) × 100
                      </code>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl space-y-1.5">
                      <span className="font-extrabold text-slate-800 block">Net Rental Yield</span>
                      <code className="block font-mono text-[10px] bg-white p-1.5 rounded border border-slate-100 text-indigo-600">
                        Net Yield = ((Annual Rent - OpEx) ÷ Purchase Price) × 100
                      </code>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl space-y-1.5">
                      <span className="font-extrabold text-slate-800 block">Total ROI (Cumulative Return)</span>
                      <code className="block font-mono text-[10px] bg-white p-1.5 rounded border border-slate-100 text-indigo-600">
                        Total ROI = ((Cumulative Net Rent + Capital Appreciation) ÷ Purchase Price) × 100
                      </code>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl space-y-1.5">
                      <span className="font-extrabold text-slate-800 block">Estimated Break-even</span>
                      <code className="block font-mono text-[10px] bg-white p-1.5 rounded border border-slate-100 text-indigo-600">
                        Break-even = Purchase Price ÷ Annual Net Rent (Excluding Appreciation)
                      </code>
                    </div>
                  </div>
                </div>

                {/* Mortgage Formulas */}
                <div className="space-y-2.5 pt-2">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide border-l-2 border-emerald-600 pl-2">
                    Mortgage Leverage Model
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl space-y-1.5">
                      <span className="font-extrabold text-slate-800 block">Equated Monthly Installment (EMI)</span>
                      <code className="block font-mono text-[10px] bg-white p-1.5 rounded border border-slate-100 text-indigo-600">
                        EMI = [P × r × (1+r)ⁿ] ÷ [(1+r)ⁿ - 1]
                      </code>
                      <p className="text-[10px] text-slate-400 font-medium">
                        Where: P = Loan Principal, r = Monthly Interest rate, n = Monthly Tenure (Years × 12).
                      </p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl space-y-1.5">
                      <span className="font-extrabold text-slate-800 block">Debt-To-Income (DTI) Ratio</span>
                      <code className="block font-mono text-[10px] bg-white p-1.5 rounded border border-slate-100 text-indigo-600">
                        DTI = ((EMI + Existing Debt) ÷ Monthly Income) × 100
                      </code>
                    </div>
                  </div>
                </div>

              </div>

              <button
                onClick={() => setShowFormulaModal(false)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl cursor-pointer"
              >
                Close Methodology Panel
              </button>

            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ================================================================ */}
      {/* 5. INTERACTIVE PROSPECTUS EXPORTER DIALOG */}
      {/* ================================================================ */}
      <AnimatePresence>
        {showProspectus && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 md:p-6 backdrop-blur-sm animate-fadeIn">
            
            <div className="bg-white rounded-[2.5rem] border border-slate-100 w-full max-w-4xl max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col text-left">
              
              {/* Header inside prospectus modal */}
              <div className="sticky top-0 bg-white border-b border-slate-100 px-6 md:px-8 py-5 flex items-center justify-between z-10">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/10">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-950">ACOT Platform Reports Engine</h3>
                    <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                      Institutional Grade Prospectus
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print / Save PDF
                  </button>
                  <button
                    onClick={() => setShowProspectus(false)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-xl transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Prospectus Document Body */}
              <div className="p-6 md:p-10 space-y-8 flex-1 text-slate-800 print:p-0">
                
                {/* Visual Cover Header */}
                <div className="border-b-4 border-slate-900 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block font-mono">
                      PROPERTY INVESTMENT BRIEF
                    </span>
                    <h1 className="text-3xl font-black text-slate-950 tracking-tight mt-1.5">
                      {activeCommunity.name} Prospectus
                    </h1>
                    <p className="text-xs text-slate-400 font-medium font-mono uppercase mt-1">
                      GEOGRAPHIC COORDINATE: DUBAI, UAE • {new Date().toLocaleDateString('en-GB')}
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">PREPARED BY</p>
                    <p className="text-xs font-extrabold text-slate-900 mt-0.5">ACOT Investor Platform</p>
                  </div>
                </div>

                {/* Executive Summary Callout */}
                <div className="bg-slate-50 p-6 rounded-2xl border-l-4 border-slate-900 space-y-2">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Executive Financial Summary
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {decisionResults.executiveSummary} This property exhibits strong fundamentals with an estimated annualized total return of {roiResults.annualizedReturn}% over a {holdingPeriod}-year holding cycle.
                  </p>
                </div>

                {/* Two Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  
                  {/* Column 1: Financial Model */}
                  <div className="space-y-5">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b-2 border-slate-100 pb-1.5 font-mono">
                      01 / ROI FORECAST MODEL
                    </h3>
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between py-1.5 border-b border-slate-50">
                        <span className="text-slate-500 font-medium">Target Purchase Price:</span>
                        <span className="font-extrabold text-slate-950">AED {purchasePrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-50">
                        <span className="text-slate-500 font-medium">Expected Annual Rent:</span>
                        <span className="font-extrabold text-slate-950">AED {annualRent.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-50">
                        <span className="text-slate-500 font-medium">Holding Period Cycle:</span>
                        <span className="font-extrabold text-slate-950">{holdingPeriod} Years</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-50">
                        <span className="text-slate-500 font-medium">Expected Appreciation Rate:</span>
                        <span className="font-extrabold text-slate-950">{expectedAppreciation}% p.a.</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-50">
                        <span className="text-slate-500 font-medium">Total Operating Expenses (OpEx):</span>
                        <span className="font-extrabold text-amber-600">AED {Math.round(roiResults.totalExpenses).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-t border-slate-100 font-bold text-slate-950 bg-slate-50/50 p-2 rounded-lg">
                        <span>Expected Net Return:</span>
                        <span className="text-emerald-600">AED {Math.round(roiResults.estimatedProfit).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Debt & Leverage */}
                  <div className="space-y-5">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b-2 border-slate-100 pb-1.5 font-mono">
                      02 / LEVERAGE & DEBT MODEL
                    </h3>
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between py-1.5 border-b border-slate-50">
                        <span className="text-slate-500 font-medium">Initial Downpayment ({downPaymentPercent}%):</span>
                        <span className="font-extrabold text-slate-950">AED {downPaymentAED.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-50">
                        <span className="text-slate-500 font-medium">Required Loan-To-Value (LTV):</span>
                        <span className="font-extrabold text-slate-950">{mortgageResults.ltv}%</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-50">
                        <span className="text-slate-500 font-medium">Total Mortgaged Borrowing:</span>
                        <span className="font-extrabold text-slate-950">AED {mortgageResults.loanAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-50">
                        <span className="text-slate-500 font-medium">Annual Financing Cost:</span>
                        <span className="font-extrabold text-rose-600">AED {(mortgageResults.monthlyEMI * 12).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-b border-slate-50">
                        <span className="text-slate-500 font-medium">Monthly Service Burden (EMI):</span>
                        <span className="font-extrabold text-slate-950">AED {mortgageResults.monthlyEMI.toLocaleString()}/mo</span>
                      </div>
                      <div className="flex justify-between py-1.5 border-t border-slate-100 font-bold text-slate-950 bg-slate-50/50 p-2 rounded-lg">
                        <span>Net Annual Cash Flow surplus:</span>
                        <span className={decisionResults.estimatedAnnualCashFlow >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                          AED {decisionResults.estimatedAnnualCashFlow.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Closing Legal Disclaimer */}
                <div className="border-t border-slate-200 pt-6 text-[10px] text-slate-400 font-medium leading-relaxed font-mono">
                  DISCLAIMER: This analysis is compiled on historical market transactions registered at the Dubai Land Department (DLD) and estimated banking interest benchmarks. Actual real estate returns, capital growth rates, and banking terms are subject to local monetary adjustments. This report does not constitute binding financial brokerage counsel.
                </div>

              </div>

            </div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
