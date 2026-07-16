import { useState, useEffect } from 'react';
import { UserRole, PagePath } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Shield, Sparkles, Briefcase, UserCheck, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';

interface RoleSelectionProps {
  onNavigate: (path: PagePath) => void;
}

export default function RoleSelection({ onNavigate }: RoleSelectionProps) {
  const { user, selectRole, error, clearError } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    clearError();
    if (user?.role) {
      setSelectedRole(user.role);
    }
  }, [user]);

  const handleContinue = async () => {
    if (!selectedRole) return;
    setLoading(true);
    try {
      await selectRole(selectedRole);
      onNavigate('/select-subscription');
    } catch {
      // Handled by context
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      id: 'investor' as UserRole,
      title: 'Investor',
      description: 'Institutional-grade market tracking, predictive cashflow modeling, and private portfolio optimization in Dubai.',
      icon: Sparkles,
      badge: 'Most Popular',
    },
    {
      id: 'agent' as UserRole,
      title: 'Agent',
      description: 'Broker tools, client intelligence management, live off-plan feeds, and automated property comparisons.',
      icon: Briefcase,
    },
    {
      id: 'admin' as UserRole,
      title: 'Admin',
      description: 'Full administrative access to telemetry, databases, system security configurations, and user accounts.',
      icon: Shield,
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-6 flex items-center justify-center bg-gray-50/50">
      <div className="max-w-3xl w-full bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/40 p-6 md:p-8 lg:p-12 space-y-8">
        
        <div className="text-center max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <UserCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            Choose your Workspace
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            ACOT offers tailored workspaces depending on your professional capacity in Dubai real estate. Select your primary role below.
          </p>
        </div>

        {/* Error alert */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-800 text-sm animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Role Selection Failed</p>
              <p className="text-xs text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Roles list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`text-left p-6 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between h-64 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/15 shadow-md shadow-indigo-100/30'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Icon className="w-5.5 h-5.5" />
                    </div>
                    {role.badge && (
                      <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100/20">
                        {role.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{role.title}</h3>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">{role.description}</p>
                </div>

                <div className="flex items-center gap-1.5 mt-4">
                  <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center ${
                    isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'
                  }`}>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <span className={`text-xs font-bold ${
                    isSelected ? 'text-indigo-700' : 'text-gray-400'
                  }`}>
                    {isSelected ? 'Selected' : 'Select workspace'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-50">
          <span className="text-xs text-gray-400 font-mono">
            User: {user?.email}
          </span>
          <button
            onClick={handleContinue}
            disabled={!selectedRole || loading}
            className="w-full md:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-100 disabled:text-gray-400 text-white font-medium rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Configuring role...</span>
              </>
            ) : (
              <>
                <span>Continue to Subscriptions</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
