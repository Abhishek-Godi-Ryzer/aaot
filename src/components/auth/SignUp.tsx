import { useState, FormEvent, useEffect } from 'react';
import { Mail, Lock, User as UserIcon, ArrowRight, ShieldCheck, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PagePath } from '../../types';

interface SignUpProps {
  onNavigate: (path: PagePath) => void;
}

export default function SignUp({ onNavigate }: SignUpProps) {
  const { signup, error, clearError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    clearError();
    setValidationError(null);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (!name || !email || !password || !confirmPassword) {
      setValidationError('All fields are required.');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await signup(name, email, password);
      // Success, context automatically sets temp user session, navigate to email verification
      onNavigate('/verify-email');
    } catch (err: any) {
      // Handled by context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-6 flex items-center justify-center bg-gray-50/50">
      <div className="max-w-md w-full bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/40 p-6 md:p-8 space-y-6">
        
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Create your ACOT Account
          </h2>
          <p className="text-sm text-gray-500 mt-1.5">
            Begin onboarding to the Dubai real estate intelligence platform
          </p>
        </div>

        {/* Error Alerts */}
        {(validationError || error) && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-800 text-sm animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Signup Failed</p>
              <p className="text-xs text-red-700 mt-1">{validationError || error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 tracking-wider uppercase block">
              Full Name
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setValidationError(null);
                  clearError();
                }}
                placeholder="John Doe"
                className="w-full pl-11 pr-4 py-3 border border-gray-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-xl outline-none text-gray-800 text-sm transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 tracking-wider uppercase block">
              Work Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setValidationError(null);
                  clearError();
                }}
                placeholder="name@company.com"
                className="w-full pl-11 pr-4 py-3 border border-gray-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-xl outline-none text-gray-800 text-sm transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 tracking-wider uppercase block">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setValidationError(null);
                  clearError();
                }}
                placeholder="Min 6 characters"
                className="w-full pl-11 pr-4 py-3 border border-gray-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-xl outline-none text-gray-800 text-sm transition-all"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 tracking-wider uppercase block">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setValidationError(null);
                  clearError();
                }}
                placeholder="Repeat password"
                className="w-full pl-11 pr-4 py-3 border border-gray-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-xl outline-none text-gray-800 text-sm transition-all"
              />
            </div>
          </div>

          {/* Create Account Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Creating profile...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-50">
          <span className="text-sm text-gray-500">Already have an account? </span>
          <button
            type="button"
            onClick={() => onNavigate('/login')}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold transition-colors cursor-pointer"
          >
            Sign in
          </button>
        </div>

      </div>
    </div>
  );
}
