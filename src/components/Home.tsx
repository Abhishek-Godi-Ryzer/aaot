import { ArrowRight, ChevronRight, CheckCircle, Database, Shield, Zap, TrendingUp, BarChart3, Key, Brain, FileText, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import { PagePath } from '../types';

interface HomeProps {
  onNavigate: (path: PagePath) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  return (
    <div className="pt-24 font-sans">
      {/* 1. Hero Section */}
      <section className="relative bg-white pt-12 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 flex flex-col justify-center"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-xs font-semibold mb-6 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
                AI-NATIVE REAL ESTATE INTELLIGENCE
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-6">
                The Most Advanced Real Estate Intelligence Platform for <span className="text-indigo-600">Dubai</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg">
                Powered by official DLD data and AI intelligence to help investors, agents, and enterprises make smarter real estate decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => onNavigate('/login')}
                  className="group inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-medium px-7 py-3.5 rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
                >
                  Access Platform
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="inline-flex items-center justify-center bg-gray-50 text-gray-700 font-medium px-7 py-3.5 rounded-xl hover:bg-gray-100 active:scale-[0.98] transition-all border border-gray-200 cursor-pointer"
                >
                  Contact Sales
                </button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-7 relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-100 bg-gray-50">
                <img
                  src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80"
                  alt="Dubai Skyline with Burj Khalifa"
                  referrerPolicy="no-referrer"
                  className="w-full h-[460px] object-cover hover:scale-[1.01] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-gray-900/40 via-transparent to-transparent"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Platform Highlights */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-white p-8 rounded-2xl shadow-xs border border-gray-100/80"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Official Data</h3>
              <p className="text-gray-500 leading-relaxed">
                Direct integration with Dubai Land Department, Ejari, and RERA sources guarantees 100% verified facts.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-white p-8 rounded-2xl shadow-xs border border-gray-100/80"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI Intelligence</h3>
              <p className="text-gray-500 leading-relaxed">
                Generative AI models and predictive scoring provide instant deal scoring, rental analysis, and intelligence.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-white p-8 rounded-2xl shadow-xs border border-gray-100/80"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Enterprise Ready</h3>
              <p className="text-gray-500 leading-relaxed">
                Built with industry-grade security protocols, robust API systems, and custom report export engines.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Platform Modules Preview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-3 block">
              COMPREHENSIVE SUITE
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              One Unified Workspace. Six Powerful Modules.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: Transaction Intelligence */}
            <div className="group bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full">
              <div className="h-48 overflow-hidden bg-gray-50">
                <img
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80"
                  alt="Transaction Intelligence Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Transactions</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-grow">
                  Live transaction feeds with advanced filtering, closing-cost calculators, and historical sales trends.
                </p>
                <button
                  onClick={() => onNavigate('/solutions')}
                  className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 gap-1 mt-auto cursor-pointer"
                >
                  Explore <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Card 2: Market Analytics */}
            <div className="group bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full">
              <div className="h-48 overflow-hidden bg-gray-50">
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80"
                  alt="Market Analytics Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Market Intelligence</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-grow">
                  Community-specific deep analysis, price indexes, leadership boards, and historical trend engines.
                </p>
                <button
                  onClick={() => onNavigate('/solutions')}
                  className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 gap-1 mt-auto cursor-pointer"
                >
                  Explore <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Card 3: Rental Intelligence */}
            <div className="group bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full">
              <div className="h-48 overflow-hidden bg-gray-50">
                <img
                  src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=600&q=80"
                  alt="Rental Intelligence Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
                  <Key className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Rental Research</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-grow">
                  DLD Ejari performance logs, rental trend mapping, and gross/net property yield calculation tools.
                </p>
                <button
                  onClick={() => onNavigate('/solutions')}
                  className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 gap-1 mt-auto cursor-pointer"
                >
                  Explore <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Card 4: AI Intelligence Suite */}
            <div className="group bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full">
              <div className="h-48 overflow-hidden bg-gray-50">
                <img
                  src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80"
                  alt="AI Intelligence Suite Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
                  <Brain className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">AI Analyst</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-grow">
                  Conversational real estate analyst, automated AI deal scorer, and executive summaries.
                </p>
                <button
                  onClick={() => onNavigate('/ai-intelligence')}
                  className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 gap-1 mt-auto cursor-pointer"
                >
                  Explore <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Card 5: Reports Engine */}
            <div className="group bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full">
              <div className="h-48 overflow-hidden bg-gray-50">
                <img
                  src="https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80"
                  alt="Reports Engine Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Reports</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-grow">
                  Generate beautiful pre-built property intelligence reports, community briefs, and PDF summaries.
                </p>
                <button
                  onClick={() => onNavigate('/solutions')}
                  className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 gap-1 mt-auto cursor-pointer"
                >
                  Explore <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Card 6: Investor Tools */}
            <div className="group bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full">
              <div className="h-48 overflow-hidden bg-gray-50">
                <img
                  src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80"
                  alt="Investor Tools Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
                  <Settings className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Investor Tools</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-grow">
                  Sophisticated ROI, cash versus mortgage affordability models, and custom property comparison engines.
                </p>
                <button
                  onClick={() => onNavigate('/solutions')}
                  className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 gap-1 mt-auto cursor-pointer"
                >
                  Explore <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Trusted Data */}
      <section className="py-14 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">
            VERIFIED GOVERNMENT DATA CHANNELS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8 grayscale opacity-70">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-gray-700 font-sans">DUBAI LAND DEPARTMENT</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-gray-700 font-sans">EJARI</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-gray-700 font-sans">OQOOD</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-gray-700 font-sans">RERA COMPLIANT</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Final CTA */}
      <section className="py-24 bg-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-6">
            Start Making Smarter Real Estate Decisions
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed mb-10 max-w-xl mx-auto">
            Get instant access to real-time transactions, institutional-grade analytics, and custom AI insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('/login')}
              className="group inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-medium px-8 py-4 rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-md cursor-pointer"
            >
              Access Platform
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate('/contact')}
              className="inline-flex items-center justify-center bg-gray-50 text-gray-700 font-medium px-8 py-4 rounded-xl hover:bg-gray-100 active:scale-[0.98] transition-all border border-gray-200 cursor-pointer"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
