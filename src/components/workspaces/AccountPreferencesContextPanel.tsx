import { useState } from 'react';
import {
  UserCheck,
  CheckCircle,
  Download,
  AlertOctagon,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Database,
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';

interface AccountPreferencesContextPanelProps {
  onNavigateToModule?: (moduleName: string) => void;
  triggerToast?: (message: string) => void;
}

export default function AccountPreferencesContextPanel({ onNavigateToModule, triggerToast }: AccountPreferencesContextPanelProps) {
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  const handleDownloadData = () => {
    if (triggerToast) {
      triggerToast('Compiling secure package. Export of GDPR dossier has been initiated... Download starting soon.');
    }
  };

  const handleContactSupport = () => {
    if (triggerToast) {
      triggerToast('Opening direct support channel to ACOT Client Relations...');
    }
  };

  return (
    <div className="space-y-5" id="account-preferences-context-panel">
      {/* CARD 1: ACCOUNT SUMMARY */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full blur-2xl opacity-45"></div>
        
        <div className="relative z-10 space-y-3.5">
          <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-indigo-600" />
            Account Summary
          </h3>

          <div className="space-y-2.5 divide-y divide-slate-50 text-xs">
            <div className="flex items-center justify-between py-1.5 first:pt-0">
              <span className="text-slate-400 font-medium">Account Type</span>
              <span className="font-extrabold text-slate-900">Investor</span>
            </div>
            
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-400 font-medium">Member Since</span>
              <span className="font-extrabold text-slate-900">Jan 12, 2026</span>
            </div>

            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-400 font-medium">Account Status</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100/30 uppercase tracking-wider">
                Active
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-400 font-medium">Verification Status</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100/30 uppercase tracking-wider flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3 fill-emerald-50" />
                Verified
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 last:pb-0">
              <span className="text-slate-400 font-medium">Last Login</span>
              <span className="font-semibold text-slate-500">Today, 09:30 AM</span>
            </div>
          </div>
        </div>
      </div>

      {/* CARD 2: CONNECTED DATA SOURCES (READ ONLY SUMMARY) */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-sm">
        <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-indigo-600" />
          Connected Data Sources
        </h3>

        <div className="space-y-3">
          {[
            { name: 'Dubai Land Department (DLD)' },
            { name: 'Ejari Rental Registry' },
            { name: 'Oqood (Dubai REST)' },
            { name: 'RERA' }
          ].map(source => (
            <div key={source.name} className="flex items-center justify-between text-xs text-slate-600">
              <span>{source.name}</span>
              <CheckCircle className="w-4 h-4 fill-emerald-50 text-emerald-600 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* CARD 3: QUICK ACTIONS */}
      <div className="bg-white rounded-3xl border border-slate-100 p-5 space-y-3 shadow-sm">
        <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
          Quick Actions
        </h3>

        <div className="space-y-2.5">
          {/* Download */}
          <button
            onClick={handleDownloadData}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-2.5 text-xs text-slate-700 font-bold">
              <Download className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
              <span>Download My Data</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* Deactivate */}
          <button
            onClick={() => setShowDeactivateModal(true)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-100 hover:border-rose-100 transition-all text-left group cursor-pointer"
          >
            <div className="flex items-center gap-2.5 text-xs text-rose-600 font-bold">
              <ShieldAlert className="w-4 h-4 text-rose-400 group-hover:text-rose-600" />
              <span>Deactivate Account</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>
      </div>

      {/* CARD 4: SUPPORT / NEED HELP */}
      <div className="bg-indigo-900 rounded-[2rem] p-6 space-y-3.5 shadow-sm text-white relative overflow-hidden">
        <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-indigo-600 rounded-full opacity-30 blur-xl"></div>
        
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-indigo-200">
            <HelpCircle className="w-4 h-4" />
            <span>Need Help?</span>
          </div>
          <p className="text-xs text-indigo-100 leading-relaxed">
            If you need assistance configuring preferences or credentials, our dedicated investor relations support team is on standby to help you.
          </p>
          <button
            onClick={handleContactSupport}
            className="inline-flex items-center gap-1.5 text-xs font-black text-white hover:text-indigo-200 transition-colors pt-1"
          >
            <span>Contact Support</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* DEACTIVATE CONFIRMATION DIALOG MODAL */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-[2rem] border border-slate-100 w-full max-w-md p-6 space-y-6 shadow-2xl relative">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-slate-900">Deactivate Account Confirmation</h3>
                <p className="text-xs text-slate-400 leading-normal">
                  Are you sure you want to temporarily deactivate your account? Your saved watchlists, custom thresholds, and preferences will be preserved, but you will be securely logged out immediately.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeactivateModal(false);
                  if (triggerToast) triggerToast('Account deactivation sequence initialized securely.');
                }}
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold transition-all active:scale-98"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
