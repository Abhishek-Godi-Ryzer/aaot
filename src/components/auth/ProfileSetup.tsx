import { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PagePath } from '../../types';
import { Sparkles, Phone, Building2, Globe, ArrowRight, RefreshCw, AlertCircle, CheckSquare } from 'lucide-react';

interface ProfileSetupProps {
  onNavigate: (path: PagePath) => void;
}

export default function ProfileSetup({ onNavigate }: ProfileSetupProps) {
  const { user, setupProfile, error, clearError } = useAuth();
  
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [country, setCountry] = useState('United Arab Emirates');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [preferredCurrency, setPreferredCurrency] = useState('AED');
  const [preferredUnit, setPreferredUnit] = useState('sq_ft');
  
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    clearError();
    setValidationError(null);
    if (user) {
      setFullName(user.name || '');
      setCompany(user.company || '');
      if (user.country) setCountry(user.country);
      setPhoneNumber(user.phoneNumber || '');
      if (user.preferredCurrency) setPreferredCurrency(user.preferredCurrency);
      if (user.preferredUnit) setPreferredUnit(user.preferredUnit);
    }
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (!fullName) {
      setValidationError('Full Name is required.');
      return;
    }
    if (!phoneNumber) {
      setValidationError('Phone number is required for sandbox verification.');
      return;
    }
    if (!country) {
      setValidationError('Please select or specify your primary country.');
      return;
    }

    setLoading(true);
    try {
      const updatedUser = await setupProfile({
        company,
        country,
        phoneNumber,
        preferredCurrency,
        preferredUnit,
      });

      // Complete! Navigate to appropriate workspace
      if (updatedUser.role === 'investor') {
        onNavigate('/investor');
      } else if (updatedUser.role === 'agent') {
        onNavigate('/agent');
      } else if (updatedUser.role === 'admin') {
        onNavigate('/admin');
      }
    } catch (err: any) {
      // Handled by context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-6 flex items-center justify-center bg-gray-50/50">
      <div className="max-w-2xl w-full bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/40 p-6 md:p-8 lg:p-12 space-y-8 animate-fadeIn">
        
        <div className="text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <CheckSquare className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Complete your Profile Setup
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Fine-tune metrics and preferences to tailor your Dubai Real Estate workspace experience.
          </p>
        </div>

        {/* Error Alerts */}
        {(validationError || error) && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-800 text-sm animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Setup Failed</p>
              <p className="text-xs text-red-700 mt-1">{validationError || error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 tracking-wider uppercase block">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Sarah Jenkins"
                className="w-full px-4 py-3 border border-gray-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-xl outline-none text-gray-800 text-sm transition-all"
              />
            </div>

            {/* Company */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 tracking-wider uppercase block">
                Company Name
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Alpha Capital LLC"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-xl outline-none text-gray-800 text-sm transition-all"
                />
              </div>
            </div>

            {/* Country */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 tracking-wider uppercase block">
                Primary Country
              </label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="United Arab Emirates"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-xl outline-none text-gray-800 text-sm transition-all"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 tracking-wider uppercase block">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+971 50 123 4567"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-xl outline-none text-gray-800 text-sm transition-all"
                />
              </div>
            </div>

            {/* Preferred Currency */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 tracking-wider uppercase block">
                Preferred Currency
              </label>
              <select
                value={preferredCurrency}
                onChange={(e) => setPreferredCurrency(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-xl outline-none text-gray-800 text-sm transition-all bg-white"
              >
                <option value="AED">AED (United Arab Emirates Dirham)</option>
                <option value="USD">USD (United States Dollar)</option>
                <option value="EUR">EUR (Euro)</option>
                <option value="GBP">GBP (British Pound Sterling)</option>
              </select>
            </div>

            {/* Preferred Area Unit */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 tracking-wider uppercase block">
                Area Metric Unit
              </label>
              <select
                value={preferredUnit}
                onChange={(e) => setPreferredUnit(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-xl outline-none text-gray-800 text-sm transition-all bg-white"
              >
                <option value="sq_ft">Square Feet (sq ft)</option>
                <option value="sq_m">Square Meters (sq m)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-4 bg-indigo-50/20 border border-indigo-100/30 rounded-2xl">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500 text-white text-[10px] font-bold">i</span>
            <p className="text-xs text-gray-500 leading-relaxed">
              Activating your license installs high-frequency index endpoints. You can change these workspace parameters anytime inside your user preferences dashboard.
            </p>
          </div>

          {/* Action Button */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-50">
            <span className="text-xs text-gray-400 font-mono">
              Activated plan: <strong className="text-indigo-600 uppercase text-[10px]">{user?.subscription}</strong>
            </span>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Activating Sandbox...</span>
                </>
              ) : (
                <>
                  <span>Complete Setup</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
