import { useState, useEffect } from 'react';
import { SubscriptionPlan, PagePath } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, ArrowRight, RefreshCw, AlertCircle, Check } from 'lucide-react';

interface SubscriptionSelectionProps {
  onNavigate: (path: PagePath) => void;
}

export default function SubscriptionSelection({ onNavigate }: SubscriptionSelectionProps) {
  const { user, selectSubscription, error, clearError } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    clearError();
    // Pre-select plan matching user role if applicable or existing plan
    if (user?.subscription) {
      setSelectedPlan(user.subscription);
    } else if (user?.role === 'agent') {
      setSelectedPlan('agent');
    } else if (user?.role === 'investor') {
      setSelectedPlan('pro');
    } else {
      setSelectedPlan('free');
    }
  }, [user]);

  const handleContinue = async () => {
    if (!selectedPlan) return;
    setLoading(true);
    try {
      await selectSubscription(selectedPlan);
      onNavigate('/setup-profile');
    } catch {
      // Handled by context
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      id: 'free' as SubscriptionPlan,
      name: 'Free Starter',
      description: 'Access essential Dubai real estate indices, standard tracking, and primary statistics.',
      price: '$0',
      period: 'forever',
      features: [
        'Dubai Area Price Indexes',
        'Basic Real Estate Watchlist',
        '1 Active Prediction Model',
        'Community Forum Access',
      ],
    },
    {
      id: 'pro' as SubscriptionPlan,
      name: 'Investor Pro',
      description: 'Institutional-grade investment tracking, cashflow predictive analytics, and predictive indexes.',
      price: '$149',
      period: 'per month',
      badge: 'Best value for Investors',
      features: [
        'All Free Starter features',
        'Unlimited AI Prediction Models',
        'Interactive Dubai Heatmaps',
        'Cashflow & ROI Forecasting Tools',
        'Priority API Data Access',
      ],
    },
    {
      id: 'agent' as SubscriptionPlan,
      name: 'Agent Premium',
      description: 'Engineered for top brokers to automate off-plan pipelines, export white-label reports, and track leads.',
      price: '$199',
      period: 'per month',
      badge: 'Best for Brokers',
      features: [
        'Unlimited Area Watchlists',
        'Off-Plan Feeds & Transaction History',
        'White-Label Report Builder',
        'Interactive Client Showcases',
        'Lead Pipeline & Analytics CRM',
      ],
    },
    {
      id: 'enterprise' as SubscriptionPlan,
      name: 'Enterprise Plus',
      description: 'Tailored for real estate developers, funds, and massive brokerages requiring dedicated nodes.',
      price: 'Custom',
      period: 'billed annually',
      features: [
        'All Premium & Pro features',
        'Custom Dedicated AI Models',
        'Dedicated Cloud Storage & Nodes',
        'Unlimited Team Seats',
        'Dedicated Client Success Manager',
      ],
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-6 flex items-center justify-center bg-gray-50/50">
      <div className="max-w-6xl w-full bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/40 p-6 md:p-8 lg:p-12 space-y-8 animate-fadeIn">
        
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight animate-slideUp">
            Select your Subscription
          </h2>
          <p className="text-sm text-gray-500">
            ACOT provides robust tools scaling precisely with your professional workload. Choose a subscription to activate your sandbox.
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-800 text-sm animate-fadeIn max-w-lg mx-auto">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Subscription Failed</p>
              <p className="text-xs text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`text-left p-6 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between h-[480px] group ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/15 shadow-lg shadow-indigo-100/20 ring-1 ring-indigo-500/20'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/20 hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      {plan.badge && (
                        <span className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100/25 mb-1.5 inline-block">
                          {plan.badge}
                        </span>
                      )}
                      <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">
                        {plan.name}
                      </h3>
                    </div>
                    <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-300'
                    }`}>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                    {plan.description}
                  </p>

                  <div className="mb-6 flex items-baseline">
                    <span className="text-3xl font-extrabold text-gray-900">{plan.price}</span>
                    <span className="text-xs text-gray-400 font-mono ml-1">/{plan.period}</span>
                  </div>

                  <div className="border-t border-gray-100 pt-5 space-y-3">
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                        <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100/40">
                  <div className={`w-full text-center py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200/50'
                  }`}>
                    {isSelected ? 'Plan Activated' : 'Choose Plan'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-50">
          <span className="text-xs text-gray-400 font-mono">
            Selected workspace role: <strong className="text-gray-600 uppercase text-[10px]">{user?.role}</strong>
          </span>
          <button
            onClick={handleContinue}
            disabled={!selectedPlan || loading}
            className="w-full md:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-100 disabled:text-gray-400 text-white font-medium rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Activating license...</span>
              </>
            ) : (
              <>
                <span>Continue to Profile Setup</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
