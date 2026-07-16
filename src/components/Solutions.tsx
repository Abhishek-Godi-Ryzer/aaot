import { ArrowRight, ChevronRight, CheckCircle2, Server, Database, Brain, Sparkles, User, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { PagePath } from '../types';

interface SolutionsProps {
  onNavigate: (path: PagePath) => void;
}

export default function Solutions({ onNavigate }: SolutionsProps) {
  const roles = [
    {
      title: 'Investors',
      desc: 'Discover high-yield opportunities and build smarter portfolios.',
      img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Agents',
      desc: 'Access market data, create reports, and close deals faster.',
      img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Agencies',
      desc: 'Manage your team, track performance and grow your market share.',
      img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Banks & Funds',
      desc: 'Make data-driven lending and investment decisions.',
      img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Developers',
      desc: 'Track market demand, competition and project performance.',
      img: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Researchers',
      desc: 'Access reliable data and trends for research & media.',
      img: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const capabilities = [
    'Transactions',
    'Market Intelligence',
    'Maps',
    'Rental Research',
    'AI Analyst',
    'Reports',
    'Investor Tools',
  ];

  return (
    <div className="pt-24 font-sans">
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-3 block">
                SOLUTIONS THAT MATTER
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 leading-[1.15] mb-6">
                Intelligence that powers better <span className="text-indigo-600">real estate</span> decisions.
              </h1>
              <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-xl">
                Trusted data. Smarter insights. Confident outcomes.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => onNavigate('/login')}
                  className="group inline-flex items-center gap-1.5 bg-indigo-600 text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-sm cursor-pointer"
                >
                  Access Platform
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-gray-50 p-2">
                <img
                  src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80"
                  alt="Dubai Marina Real Estate Market"
                  referrerPolicy="no-referrer"
                  className="rounded-xl w-full h-[320px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Uses ACOT */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2 block">
              BUILT FOR EVERY PROFESSIONAL
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              One Platform. Many Solutions.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roles.map((role, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full"
              >
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={role.img}
                    alt={role.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{role.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-grow">
                    {role.desc}
                  </p>
                  <button
                    onClick={() => onNavigate('/login')}
                    className="group inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700 gap-1.5 mt-auto cursor-pointer"
                  >
                    Explore <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Government Data Flow */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2 block">
              POWERED BY OFFICIAL SOURCES
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              From Official Data to Actionable Intelligence
            </h2>
          </div>

          <div className="relative flex flex-col md:flex-row items-stretch justify-between gap-6 md:gap-4 p-8 bg-gray-50 rounded-2xl border border-gray-100">
            {/* Step 1 */}
            <div className="flex-1 bg-white p-6 rounded-xl border border-gray-100 flex flex-col items-center text-center shadow-xs">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4 font-bold text-sm">
                1
              </div>
              <h3 className="text-md font-bold text-gray-900 mb-1">Official Data</h3>
              <p className="text-xs text-gray-400">Verified inputs from DLD, Ejari & RERA</p>
            </div>

            {/* Connection Arrow */}
            <div className="flex items-center justify-center text-gray-300 py-2 md:py-0">
              <ArrowRight className="w-6 h-6 rotate-90 md:rotate-0" />
            </div>

            {/* Step 2 */}
            <div className="flex-1 bg-indigo-600 p-6 rounded-xl text-white flex flex-col items-center text-center shadow-md">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white mb-4 font-bold text-sm">
                2
              </div>
              <h3 className="text-md font-bold mb-1">ACOT Intelligence</h3>
              <p className="text-xs text-indigo-100">Real-time analysis & AI processing</p>
            </div>

            {/* Connection Arrow */}
            <div className="flex items-center justify-center text-gray-300 py-2 md:py-0">
              <ArrowRight className="w-6 h-6 rotate-90 md:rotate-0" />
            </div>

            {/* Step 3 */}
            <div className="flex-1 bg-white p-6 rounded-xl border border-gray-100 flex flex-col items-center text-center shadow-xs">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4 font-bold text-sm">
                3
              </div>
              <h3 className="text-md font-bold text-gray-900 mb-1">Decision Intelligence</h3>
              <p className="text-xs text-gray-400">Accurate yields & high-confidence deals</p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Capabilities */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2 block">
              OUR CAPABILITIES
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Platform Features Overview
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {capabilities.map((cap, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs text-center flex flex-col items-center justify-center min-h-[110px]"
              >
                <CheckCircle2 className="w-5.5 h-5.5 text-indigo-600 mb-2.5" />
                <span className="text-sm font-semibold text-gray-900">{cap}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Accelerate Your Dubai Real Estate Journey?
          </h2>
          <button
            onClick={() => onNavigate('/login')}
            className="group inline-flex items-center gap-2 bg-indigo-600 text-white font-medium px-8 py-3.5 rounded-xl hover:bg-indigo-700 transition-all cursor-pointer shadow-sm"
          >
            Access Platform
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
}
