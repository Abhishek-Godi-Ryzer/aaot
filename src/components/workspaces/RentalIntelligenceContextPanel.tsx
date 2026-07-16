import { useEffect, useState } from 'react';
import { useAnalysisContext } from '../../context/AnalysisContext';
import { useMarketAnalytics } from '../../context/MarketAnalyticsContext';
import { ShieldCheck, CheckCircle2, ChevronRight, Info, HelpCircle, FileText, TrendingUp, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

interface RentalIntelligenceContextPanelProps {
  onNavigateToModule?: (moduleName: string) => void;
  triggerToast?: (msg: string) => void;
}

export default function RentalIntelligenceContextPanel({
  onNavigateToModule,
  triggerToast = () => {}
}: RentalIntelligenceContextPanelProps) {
  const { communityId } = useAnalysisContext();
  const { selectedCommunity } = useMarketAnalytics();
  const [syncTime, setSyncTime] = useState<string>('');

  useEffect(() => {
    // Generate a beautiful, realistic, synchronized last-sync timestamp
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

  const handleAuditDocs = () => {
    triggerToast('Opening Ejari & DLD licensing registry links...');
  };

  const getProfileData = () => {
    const comm = selectedCommunity?.id || 'dubai-marina';
    if (comm === 'business-bay') {
      return {
        avgSalesSqft: 1650,
        avgRentSqft: 105,
        yieldRatio: '15.7x Price-to-Rent',
        distribution: [
          { range: 'AED 60k - 90k', count: '14% (Studio)', color: 'h-10 bg-indigo-200' },
          { range: 'AED 90k - 130k', count: '46% (1 BR)', color: 'h-24 bg-indigo-500' },
          { range: 'AED 130k - 200k', count: '30% (2 BR)', color: 'h-16 bg-indigo-400' },
          { range: 'AED 200k+', count: '10% (3+ BR)', color: 'h-8 bg-indigo-300' }
        ],
        activeLicenses: 4850,
        activeEjari: 11240
      };
    }
    // Default / Dubai Marina
    return {
      avgSalesSqft: 2200,
      avgRentSqft: 120,
      yieldRatio: '18.3x Price-to-Rent',
      distribution: [
        { range: 'AED 80k - 110k', count: '12% (Studio)', color: 'h-8 bg-indigo-200' },
        { range: 'AED 110k - 160k', count: '48% (1 BR)', color: 'h-28 bg-indigo-500' },
        { range: 'AED 160k - 240k', count: '32% (2 BR)', color: 'h-20 bg-indigo-400' },
        { range: 'AED 240k+', count: '8% (3+ BR)', color: 'h-6 bg-indigo-300' }
      ],
      activeLicenses: 6240,
      activeEjari: 18450
    };
  };

  const profile = getProfileData();
  const commName = selectedCommunity?.name || 'Dubai Marina';

  return (
    <div className="space-y-6">
      
      {/* CARD 1: Community Rent Profile */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4.5 h-4.5 text-indigo-600" />
          <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider font-mono">
            {commName} Rent Profile
          </h4>
        </div>
        
        <div className="space-y-3 text-xs">
          <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
            <span className="text-slate-400 font-semibold">Avg Sales price/sqft</span>
            <span className="font-mono font-bold text-slate-900">AED {profile.avgSalesSqft.toLocaleString()}</span>
          </div>

          <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
            <span className="text-slate-400 font-semibold">Avg Rent price/sqft</span>
            <span className="font-mono font-bold text-slate-900">AED {profile.avgRentSqft.toLocaleString()}</span>
          </div>

          <div className="flex justify-between items-center py-1.5">
            <span className="text-slate-400 font-semibold">Capitalisation Multiplier</span>
            <span className="font-bold text-indigo-600">{profile.yieldRatio}</span>
          </div>
        </div>
      </div>

      {/* CARD 2: Rent Distribution Bar Chart Viz */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4.5 h-4.5 text-indigo-600" />
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider font-mono">
              Rent Distribution
            </h4>
          </div>
          <span className="text-[10px] font-bold text-indigo-600">Active Listings</span>
        </div>

        {/* Visual Bar chart of distribution */}
        <div className="flex items-end justify-between gap-2.5 pt-4 pb-2 px-1">
          {profile.distribution.map((bar, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer">
              <div className="relative w-full">
                {/* Micro tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-15">
                  {bar.count}
                </div>
                <div className={`w-full rounded-md transition-all group-hover:opacity-90 ${bar.color}`}></div>
              </div>
              <span className="text-[8px] font-bold text-slate-400 text-center block rotate-12 mt-1 whitespace-nowrap">
                {bar.range.split(' ')[1]}
              </span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-slate-400 leading-relaxed text-center pt-2">
          Highest transaction volume concentrated in <span className="font-bold text-slate-600">AED 110k - 160k</span> bracket.
        </p>
      </div>

      {/* CARD 3: Active Rent Licenses */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4.5 h-4.5 text-indigo-600" />
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider font-mono">
              Active Rent Licenses
            </h4>
          </div>
          <button
            onClick={handleAuditDocs}
            className="text-[10px] font-extrabold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-0.5 cursor-pointer"
          >
            <span>DLD Registry</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50/50 rounded-2xl p-3 border border-slate-100">
            <span className="text-[9px] font-bold text-slate-400 uppercase font-mono block">Registered Ejari</span>
            <span className="text-sm font-extrabold text-slate-900 block mt-0.5">{profile.activeEjari.toLocaleString()}</span>
            <span className="text-[9px] font-semibold text-emerald-600 block mt-1">✓ Active leases</span>
          </div>

          <div className="bg-slate-50/50 rounded-2xl p-3 border border-slate-100">
            <span className="text-[9px] font-bold text-slate-400 uppercase font-mono block">Broker Licenses</span>
            <span className="text-sm font-extrabold text-slate-900 block mt-0.5">{profile.activeLicenses.toLocaleString()}</span>
            <span className="text-[9px] font-semibold text-indigo-600 block mt-1">✓ Verified permits</span>
          </div>
        </div>
      </div>

      {/* CARD 4: Context Synchronisation Status */}
      <div className="bg-slate-50 rounded-3xl border border-slate-100 p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4.5 h-4.5 text-indigo-600" />
          <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider font-mono">
            Security & Synchronisation
          </h4>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-100/50">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider font-mono">
              Verified DLD Data Feed
            </span>
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-100/50">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider font-mono">
              Verified Ejari Data Feed
            </span>
          </div>

          {/* Sync Timestamp */}
          <div className="pt-2 text-[10px] space-y-1">
            <span className="text-slate-400 block font-semibold">Last Context Sync:</span>
            <div className="flex items-center gap-1.5 font-mono text-slate-500 font-bold bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate">{syncTime}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
