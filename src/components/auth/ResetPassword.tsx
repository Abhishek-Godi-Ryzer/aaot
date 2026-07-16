import { useState, FormEvent, useEffect } from 'react';
import { Lock, ArrowRight, ShieldAlert, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PagePath } from '../../types';

interface ResetPasswordProps {
  onNavigate: (path: PagePath) => void;
}

export default function ResetPassword({ onNavigate }: ResetPasswordProps) {
  const { resetEmail, resetPassword, setResetEmail, error, clearError } = useAuth();
  const [emailInput, setEmailInput] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // If there's a stored resetEmail, use it. Otherwise, allow entering it.
  useEffect(() => {
    clearError();
    setValidationError(null);
    if (resetEmail) {
      setEmailInput(resetEmail);
    }
  }, [resetEmail]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (!emailInput) {
      setValidationError('Please specify the email to reset.');
      return;
    }

    if (!password || !confirmPassword) {
      setValidationError('Please enter and confirm your new password.');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      // Set the reset email in context if it was typed manually
      if (!resetEmail) {
        setResetEmail(emailInput);
      }
      await resetPassword(password);
      setSuccess(true);
      setTimeout(() => {
        onNavigate('/login');
      }, 2000);
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
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Reset Password
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Create a secure, fresh password for your professional account
          </p>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-3 text-emerald-800 text-sm animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Password Reset Successful!</p>
              <p className="text-xs text-emerald-700 mt-1">Your credentials have been updated. Redirecting to sign in...</p>
            </div>
          </div>
        )}

        {/* Error Alerts */}
        {(validationError || error) && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-800 text-sm animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Reset Failed</p>
              <p className="text-xs text-red-700 mt-1">{validationError || error}</p>
            </div>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Target Email (disabled if came from Forgot Password flow) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 tracking-wider uppercase block">
                Account Email Address
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                disabled={!!resetEmail}
                placeholder="name@company.com"
                className="w-full px-4 py-3 border border-gray-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-xl outline-none text-gray-800 text-sm transition-all disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-100"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 tracking-wider uppercase block">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setValidationError(null);
                  clearError();
                }}
                placeholder="Min 6 characters"
                className="w-full px-4 py-3 border border-gray-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-xl outline-none text-gray-800 text-sm transition-all"
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 tracking-wider uppercase block">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setValidationError(null);
                  clearError();
                }}
                placeholder="Repeat password"
                className="w-full px-4 py-3 border border-gray-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-xl outline-none text-gray-800 text-sm transition-all"
              />
            </div>

            {/* Reset Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Resetting credentials...</span>
                </>
              ) : (
                <>
                  <span>Reset Password</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-gray-50">
          <button
            type="button"
            onClick={() => onNavigate('/login')}
            className="text-sm text-gray-500 hover:text-indigo-600 font-semibold transition-colors cursor-pointer"
          >
            Back to login
          </button>
        </div>

      </div>
    </div>
  );
}
