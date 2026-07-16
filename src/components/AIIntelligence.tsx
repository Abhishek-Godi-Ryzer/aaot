import { ArrowRight, Sparkles, MessageSquare, Target, FileText, CheckCircle } from 'lucide-react';
import { PagePath } from '../types';

interface AIIntelligenceProps {
  onNavigate: (path: PagePath) => void;
}

export default function AIIntelligence({ onNavigate }: AIIntelligenceProps) {
  const journey = [
    { step: 'Ask', desc: 'Ask about any area, building, or historical index in plain natural language.' },
    { step: 'Analyze', desc: 'ACOT AI scans billions of data points to evaluate yields and risk scores.' },
    { step: 'Generate', desc: 'Instantly compile a custom investment deck, briefing sheet, or PDF.' },
  ];

  const cards = [
    {
      title: 'Conversational AI Analyst',
      desc: 'Ask complex queries like "Which buildings in Dubai Marina yield over 7.5% net?" and get instant data-backed answers.',
      img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      icon: <MessageSquare className="w-5 h-5 text-indigo-600" />,
    },
    {
      title: 'AI Deal Scorer',
      desc: 'Evaluate and score properties from 1-100 based on transaction history, price/sqft, and forward projections.',
      img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      icon: <Target className="w-5 h-5 text-indigo-600" />,
    },
    {
      title: 'AI Report Generator',
      desc: 'Generate institutional-grade investment prospectus reports, market briefs, and community profiles in seconds.',
      img: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80',
      icon: <FileText className="w-5 h-5 text-indigo-600" />,
    },
  ];

  return (
    <div className="pt-24 font-sans">
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-3 block">
                AI INTELLIGENCE
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 leading-[1.15] mb-6">
                Meet <span className="text-indigo-600">ACOT AI</span> — Your Real Estate Intelligence Partner
              </h1>
              <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-xl">
                Ask questions. Get insights. Generate professional reports with trusted Dubai real estate data.
              </p>
              <div className="flex">
                <button
                  onClick={() => onNavigate('/login')}
                  className="group inline-flex items-center gap-2 bg-indigo-600 text-white font-medium px-6 py-3 rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-sm cursor-pointer"
                >
                  Experience ACOT AI
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-gray-50 p-2 flex items-center justify-center min-h-[340px]">
                {/* Visual Representation of AI Bot */}
                <div className="absolute inset-0 bg-linear-to-tr from-indigo-50/50 via-white to-indigo-50/20"></div>
                <div className="relative text-center p-8 flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/20 mb-6">
                    <Sparkles className="w-10 h-10 animate-pulse" />
                  </div>
                  <div className="bg-white px-5 py-3 rounded-xl shadow-xs border border-gray-100 text-sm font-semibold text-gray-800">
                    "Analyzing Dubai Marina transaction feeds..."
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Journey */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2 block">
              ALGORITHMIC WORKFLOW
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              The AI Intelligence Journey
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {journey.map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xs relative">
                <span className="absolute top-6 right-8 text-4xl font-extrabold text-gray-100 select-none">
                  0{idx + 1}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{item.step}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Three Cards */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cards.map((card, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full"
              >
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={card.img}
                    alt={card.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/25 to-transparent"></div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center mb-4">
                    {card.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-grow">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beautiful Report Preview */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2 block">
              INSTANT PDF EXPORTS
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Institutional-Grade Intelligence Reports
            </h2>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xl max-w-3xl mx-auto p-8">
            {/* Simulation of a premium report layout */}
            <div className="border-b border-gray-100 pb-6 mb-6 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  A
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">ACOT AI Intelligence Report</h4>
                  <p className="text-[10px] text-gray-400">Generated on July 14, 2026</p>
                </div>
              </div>
              <div className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">
                Score: 92/100 • Strong Buy
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
                  EXECUTIVE SUMMARY
                </span>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Based on transactional volume from the Dubai Land Department and historical rent patterns, properties in Dubai Marina show high rental demand with projected net yields exceeding 7.2% for the current quarter.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                  <span className="text-xs text-gray-400 block mb-1">Avg. Price / Sqft</span>
                  <span className="text-lg font-bold text-gray-900">AED 1,654</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                  <span className="text-xs text-gray-400 block mb-1">Average Gross Yield</span>
                  <span className="text-lg font-bold text-indigo-600">8.1%</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                  <span className="text-xs text-gray-400 block mb-1">Market Velocity</span>
                  <span className="text-lg font-bold text-gray-900">High</span>
                </div>
              </div>
            </div>
            <div className="text-center mt-6 text-xs text-gray-400">
              Figure: Simulated ACOT Real Estate Prospectus
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Unlock AI-Native Real Estate Analytics Today
          </h2>
          <button
            onClick={() => onNavigate('/login')}
            className="group inline-flex items-center gap-2 bg-indigo-600 text-white font-medium px-8 py-3.5 rounded-xl hover:bg-indigo-700 transition-all cursor-pointer shadow-sm"
          >
            Experience ACOT AI
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
}
