import { useState, FormEvent, useEffect, useRef, KeyboardEvent } from 'react';
import { Mail, CheckCircle2, ShieldAlert, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PagePath } from '../../types';

interface VerifyEmailProps {
  onNavigate: (path: PagePath) => void;
}

export default function VerifyEmail({ onNavigate }: VerifyEmailProps) {
  const { user, verifyOtp, error, clearError } = useAuth();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    clearError();
    setValidationError(null);
  }, []);

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Focus next input
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      const newOtp = [...otp];
      if (otp[index] === '' && index > 0) {
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handleResend = async () => {
    setResending(true);
    setResendSuccess(false);
    clearError();
    setValidationError(null);
    try {
      // Simulate API resend
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setResendSuccess(true);
    } catch {
      setValidationError('Failed to resend. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setValidationError('Please enter all 6 digits of the verification code.');
      return;
    }

    setLoading(true);
    try {
      await verifyOtp(otpCode);
      onNavigate('/select-role');
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
            <Mail className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Verify your Email
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            We sent a 6-digit verification code to
          </p>
          <p className="text-sm font-semibold text-gray-800 font-mono mt-0.5">
            {user?.email || 'your email address'}
          </p>
        </div>

        {/* Demo Guidelines */}
        <div className="p-3.5 bg-indigo-50/50 border border-indigo-100/40 rounded-2xl text-xs text-indigo-800 space-y-1">
          <p className="font-semibold flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            Sandbox Mode Instructions:
          </p>
          <p>Any 6-digit combination will succeed (e.g. 123456).</p>
          <p>Enter <code className="bg-indigo-100 px-1 py-0.5 rounded text-indigo-900">000000</code> to test the <strong>Invalid OTP error state</strong>.</p>
        </div>

        {/* Error Alerts */}
        {(validationError || error) && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-800 text-sm animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Verification Failed</p>
              <p className="text-xs text-red-700 mt-1">{validationError || error}</p>
            </div>
          </div>
        )}

        {/* Resend success alerts */}
        {resendSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-2.5 text-emerald-800 text-sm animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="font-medium">Verification code resent successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP inputs block */}
          <div className="flex justify-between gap-2 max-w-xs mx-auto">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                name="otp"
                maxLength={1}
                value={data}
                ref={(el) => {
                  if (el) inputRefs.current[index] = el;
                }}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={(e) => e.target.select()}
                className="w-11 h-12 text-center text-lg font-bold border border-gray-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-xl outline-none transition-all"
              />
            ))}
          </div>

          <div className="space-y-3">
            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying code...</span>
                </>
              ) : (
                <>
                  <span>Verify Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Resend OTP button */}
            <button
              type="button"
              disabled={resending || loading}
              onClick={handleResend}
              className="w-full text-center text-sm text-gray-500 hover:text-indigo-600 font-medium py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              {resending ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-gray-400" />
                  <span>Requesting new code...</span>
                </>
              ) : (
                <span>Resend OTP</span>
              )}
            </button>
          </div>
        </form>

        <div className="text-center pt-2 border-t border-gray-50">
          <button
            type="button"
            onClick={() => onNavigate('/login')}
            className="text-sm text-gray-500 hover:text-gray-800 font-medium transition-colors cursor-pointer"
          >
            Back to login
          </button>
        </div>

      </div>
    </div>
  );
}
