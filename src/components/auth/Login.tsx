import { useState, useEffect, FormEvent } from 'react';
import { Mail, Lock, ArrowRight, ShieldCheck, Sparkles, Building2, UserCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PagePath } from '../../types';

interface LoginProps {
  onNavigate: (path: PagePath) => void;
}

export default function Login({ onNavigate }: LoginProps) {
  const { login, user, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showNetworkErrorOption, setShowNetworkErrorOption] = useState(false);

  // Clear errors when entering page
  useEffect(() => {
    clearError();
    setValidationError(null);
  }, []);

  const handleUseDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setValidationError(null);
    clearError();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (!email) {
      setValidationError('Email address is required.');
      return;
    }
    if (!password) {
      setValidationError('Password is required.');
      return;
    }

    setLoading(true);
    try {
      const loggedInUser = await login(email, password, rememberMe);
      // Navigate based on setupStage or role
      if (loggedInUser.setupStage !== 'completed') {
        if (loggedInUser.setupStage === 'email-verification') {
          onNavigate('/verify-email');
        } else if (loggedInUser.setupStage === 'role-selection') {
          onNavigate('/select-role');
        } else if (loggedInUser.setupStage === 'subscription-selection') {
          onNavigate('/select-subscription');
        } else if (loggedInUser.setupStage === 'profile-setup') {
          onNavigate('/setup-profile');
        }
      } else {
        // Logged in successfully & setup complete, navigate to workspace
        if (loggedInUser.role === 'investor') {
          onNavigate('/investor');
        } else if (loggedInUser.role === 'agent') {
          onNavigate('/agent');
        } else if (loggedInUser.role === 'admin') {
          onNavigate('/admin');
        }
      }
    } catch (err: any) {
      // Handled by context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-6 flex items-center justify-center bg-gray-50/50">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/40 p-6 md:p-8 lg:p-12">
        
        {/* Left Column - Marketing & Demos */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                <Sparkles className="w-3.5 h-3.5" />
                Dubai RE Intelligence
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 font-sans leading-tight">
              ACOT Real Estate <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                Intelligence Platform
              </span>
            </h1>
            <p className="mt-4 text-gray-500 text-base leading-relaxed max-w-lg">
              Institutional-grade market data, predictive AI models, and custom portfolio management engineered specifically for the Dubai real estate market.
            </p>

            {/* Premium Visual representation of Dubai Market data */}
            <div className="mt-8 p-6 bg-gradient-to-tr from-indigo-50/40 to-violet-50/30 border border-indigo-100/50 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200/20 rounded-full blur-2xl"></div>
              <div className="relative flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                    AED
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 font-mono">DUBAI INDEX</div>
                    <div className="text-sm font-bold text-gray-800">Q3 Real Estate Forecast</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-emerald-600 font-medium font-mono">+12.4% YoY</div>
                  <div className="text-sm font-bold text-gray-900">AED 3,450/sq ft</div>
                </div>
              </div>

              {/* Decorative mini bar chart */}
              <div className="flex items-end gap-1.5 h-16 pt-2">
                <div className="w-full bg-indigo-100 rounded-t h-[40%] transition-all duration-500"></div>
                <div className="w-full bg-indigo-200 rounded-t h-[55%] transition-all duration-500"></div>
                <div className="w-full bg-indigo-300 rounded-t h-[48%] transition-all duration-500"></div>
                <div className="w-full bg-indigo-400 rounded-t h-[70%] transition-all duration-500"></div>
                <div className="w-full bg-indigo-600 rounded-t h-[90%] transition-all duration-500"></div>
              </div>
            </div>
          </div>

          {/* Demo Workspaces Cards Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 tracking-wider uppercase flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-indigo-600" />
                Demo workspaces
              </h3>
              <button 
                type="button" 
                onClick={() => setShowNetworkErrorOption(!showNetworkErrorOption)}
                className="text-xs text-gray-400 hover:text-indigo-600 transition-colors flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                {showNetworkErrorOption ? "Hide Demo Settings" : "Simulate Server Issue"}
              </button>
            </div>

            {showNetworkErrorOption && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-1">
                <p className="font-semibold">Simulate Server Error Option:</p>
                <p>To view the full <strong>Mock Network Error</strong> handling in action, use the email <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900">error@acot.demo</code> with any password.</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Investor Workspace Demo Card */}
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col justify-between hover:border-indigo-100 hover:shadow-md transition-all">
                <div>
                  <div className="text-xs font-bold text-indigo-700 bg-indigo-50/60 px-2 py-0.5 rounded-md inline-block mb-2">
                    Investor
                  </div>
                  <div className="text-xs text-gray-500 font-mono mb-1 truncate" title="investor@acot.demo">
                    investor@acot.demo
                  </div>
                  <div className="text-xs text-gray-400 font-mono mb-3">
                    pass: Acot@123
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleUseDemoAccount('investor@acot.demo', 'Acot@123')}
                  className="w-full text-center py-2 bg-white border border-gray-200 hover:border-indigo-600 hover:text-indigo-600 text-gray-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Use Account
                </button>
              </div>

              {/* Agent Workspace Demo Card */}
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col justify-between hover:border-indigo-100 hover:shadow-md transition-all">
                <div>
                  <div className="text-xs font-bold text-indigo-700 bg-indigo-50/60 px-2 py-0.5 rounded-md inline-block mb-2">
                    Agent
                  </div>
                  <div className="text-xs text-gray-500 font-mono mb-1 truncate" title="agent@acot.demo">
                    agent@acot.demo
                  </div>
                  <div className="text-xs text-gray-400 font-mono mb-3">
                    pass: Acot@123
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleUseDemoAccount('agent@acot.demo', 'Acot@123')}
                  className="w-full text-center py-2 bg-white border border-gray-200 hover:border-indigo-600 hover:text-indigo-600 text-gray-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Use Account
                </button>
              </div>

              {/* Admin Workspace Demo Card */}
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col justify-between hover:border-indigo-100 hover:shadow-md transition-all">
                <div>
                  <div className="text-xs font-bold text-indigo-700 bg-indigo-50/60 px-2 py-0.5 rounded-md inline-block mb-2">
                    Admin
                  </div>
                  <div className="text-xs text-gray-500 font-mono mb-1 truncate" title="admin@acot.demo">
                    admin@acot.demo
                  </div>
                  <div className="text-xs text-gray-400 font-mono mb-3">
                    pass: Acot@123
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleUseDemoAccount('admin@acot.demo', 'Acot@123')}
                  className="w-full text-center py-2 bg-white border border-gray-200 hover:border-indigo-600 hover:text-indigo-600 text-gray-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Use Account
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Authentication Card */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto space-y-6">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                Welcome Back
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Enter your professional credentials to access your dashboard
              </p>
            </div>

            {/* Error alerts */}
            {(validationError || error) && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-800 text-sm animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Login Failure</p>
                  <p className="text-xs text-red-700 mt-1">{validationError || error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 tracking-wider uppercase block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (validationError) setValidationError(null);
                      clearError();
                    }}
                    placeholder="name@company.com"
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-xl outline-none text-gray-800 text-sm transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700 tracking-wider uppercase block">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => onNavigate('/forgot-password')}
                    className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors font-medium cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (validationError) setValidationError(null);
                      clearError();
                    }}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 rounded-xl outline-none text-gray-800 text-sm transition-all"
                  />
                </div>
              </div>

              {/* Remember Me checkbox */}
              <div className="flex items-center justify-between py-1">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                  />
                  <span>Remember Me</span>
                </label>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Signing in securely...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="flex-shrink mx-4 text-xs text-gray-400 font-mono uppercase tracking-widest">or</span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>

            {/* Continue with Google (UI only) */}
            <button
              type="button"
              onClick={() => {
                // UI only google signup
                alert("Google Sign-In integration interface is active. Real OAuth credential popup is pending environment setup.");
              }}
              className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer text-sm"
            >
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Create Account Link */}
            <div className="text-center pt-2">
              <span className="text-sm text-gray-500">New to ACOT? </span>
              <button
                type="button"
                onClick={() => onNavigate('/signup')}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold transition-colors cursor-pointer"
              >
                Create an account
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
