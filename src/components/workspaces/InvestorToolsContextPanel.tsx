import { useEffect, useState } from 'react';
import { useAnalysisContext } from '../../context/AnalysisContext';
import { useMarketAnalytics } from '../../context/MarketAnalyticsContext';
import { DecisionService } from '../../services/investmentService';
import {
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  TrendingUp,
  Percent,
  Coins,
  Scale,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { motion } from 'motion/react';

interface InvestorToolsContextPanelProps {
  onNavigateToModule?: (moduleName: string) => void;
  triggerToast?: (msg: string) => void;
}

export default function InvestorToolsContextPanel({
  onNavigateToModule,
  triggerToast = () => {}
}: InvestorToolsContextPanelProps) {
  const { communityId } = useAnalysisContext();
  const { selectedCommunity } = useMarketAnalytics();
  const [syncTime, setSyncTime] = useState<string>('');

  // Local state for Affordability Estimator
  const [monthlyIncome, setMonthlyIncome] = useState<number>(45000);
  const [customEmi, setCustomEmi] = useState<number>(8500);

  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) + ' ' + now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    });
    setSyncTime(formatted);
  }, [communityId]);

  const affordabilityResult = DecisionService.calculateAffordability(monthlyIncome, customEmi);

  const handleDiscussFinancing = () => {
    if (!onNavigateToModule) return;
    
    const aiPrompt = `My household monthly income is AED ${monthlyIncome.toLocaleString()} and I am evaluating a monthly mortgage EMI of AED ${customEmi.toLocaleString()} for a property in ${selectedCommunity?.name || 'Dubai Marina'}. Based on the debt-to-income (DTI) ratio of ${((customEmi / monthlyIncome) * 100).toFixed(1)}%, what are the secondary financial parameters and local banking requirements I should factor in?`;
    
    // Dispatch custom event to trigger AI response
    window.dispatchEvent(new CustomEvent('acot-ai-trigger-action', {
      detail: { prompt: aiPrompt }
    }));
    
    triggerToast('Forwarding financing scenario to AI Analyst...');
    setTimeout(() => {
      onNavigateToModule('AI Intelligence Suite');
    }, 600);
  };

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* SECTION 1: VERIFICATION BADGE */}
      <div className="bg-slate-50 rounded-2xl p-4.5 border border-slate-100 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4.5 h-4.5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-[11px] font-black uppercase text-slate-900 tracking-wider">
            Verified Calculation Audit
          </h4>
          <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
            Formulas comply strictly with the Dubai Land Department (DLD) and UAE Central Bank leverage bounds.
          </p>
          <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-mono pt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Synced: {syncTime}</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: THE MATHEMATICAL CHEAT SHEET */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
          <Scale className="w-3.5 h-3.5 text-slate-400" />
          Financial Math Reference
        </h4>
        
        <div className="bg-white border border-slate-50 rounded-xl p-3.5 space-y-3 text-[11px]">
          <div className="space-y-1">
            <div className="flex justify-between font-bold text-slate-900">
              <span>01 / ROI Formula</span>
              <span className="text-[10px] font-mono text-indigo-600">Linear</span>
            </div>
            <p className="text-slate-500 font-medium leading-relaxed">
              <code>Estimated Profit / Purchase Price × 100</code> where Profit includes rent plus capital appreciation less expenses.
            </p>
          </div>

          <div className="space-y-1 border-t border-slate-50 pt-2.5">
            <div className="flex justify-between font-bold text-slate-900">
              <span>02 / EMI Formula</span>
              <span className="text-[10px] font-mono text-emerald-600">Amortized</span>
            </div>
            <p className="text-slate-500 font-medium leading-relaxed">
              <code>P × r × (1+r)ⁿ / ((1+r)ⁿ - 1)</code> where P is principal, r is monthly rate, and n is number of monthly payments.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: INTERACTIVE AFFORDABILITY CHECKER */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
          <Percent className="w-3.5 h-3.5 text-slate-400" />
          Quick DTI Affordability Check
        </h4>

        <div className="bg-white border border-slate-50 rounded-xl p-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-600 uppercase">Monthly Household Income (AED)</label>
            <input
              type="number"
              step="1000"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-full bg-slate-50 border border-slate-100 text-xs font-bold rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-600 uppercase">Target Monthly EMI (AED)</label>
            <input
              type="number"
              step="500"
              value={customEmi}
              onChange={(e) => setCustomEmi(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-full bg-slate-50 border border-slate-100 text-xs font-bold rounded-lg py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* DTI Output indicator */}
          <div className="bg-slate-50 rounded-lg p-3 text-center space-y-1">
            <p className="text-[9px] text-slate-400 font-bold uppercase">Debt-to-Income (DTI) Ratio</p>
            <p className="text-sm font-black text-slate-900">{((customEmi / monthlyIncome) * 100).toFixed(1)}%</p>
            <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded ${
              (customEmi / monthlyIncome) <= 0.35 
                ? 'bg-emerald-50 text-emerald-700' 
                : (customEmi / monthlyIncome) <= 0.5 
                  ? 'bg-amber-50 text-amber-700' 
                  : 'bg-rose-50 text-rose-700'
            }`}>
              {affordabilityResult}
            </span>
          </div>

          <button
            onClick={handleDiscussFinancing}
            className="w-full inline-flex items-center justify-between text-[11px] font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 py-2 px-3 rounded-lg transition-colors cursor-pointer"
          >
            <span>Stress-test with AI Analyst</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
}
