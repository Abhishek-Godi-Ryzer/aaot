import { ArrowRight, Compass, Eye, ShieldCheck, Heart, Sparkles, Building, Globe, Layers } from 'lucide-react';
import { PagePath } from '../types';

interface AboutProps {
  onNavigate: (path: PagePath) => void;
}

export default function About({ onNavigate }: AboutProps) {
  const values = [
    {
      title: 'Trust & Verification',
      desc: 'Built on verified data from official government departments to guarantee absolute accuracy.',
      icon: <ShieldCheck className="w-6 h-6 text-indigo-600" />,
    },
    {
      title: 'AI Innovation',
      desc: 'Advancing the state of the art in algorithmic scoring and real estate natural language models.',
      icon: <Sparkles className="w-6 h-6 text-indigo-600" />,
    },
    {
      title: 'Absolute Clarity',
      desc: 'Simplifying complex transaction layers and cyclical indicators into beautiful, actionable formats.',
      icon: <Compass className="w-6 h-6 text-indigo-600" />,
    },
    {
      title: 'Client Centered',
      desc: 'Enabling sustainable wealth building and real estate success across all sectors.',
      icon: <Heart className="w-6 h-6 text-indigo-600" />,
    },
  ];

  const metrics = [
    { label: 'Official Data Sources', val: '10+' },
    { label: 'Data Points Analyzed Daily', val: '1M+' },
    { label: 'Professionals Empowered', val: '5K+' },
    { label: 'Reports Generated', val: '50K+' },
    { label: 'Trusted & Compliant', val: '100%' },
  ];

  return (
    <div className="pt-24 font-sans">
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-3 block">
                ABOUT ACOT
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 leading-[1.15] mb-6">
                Intelligence That Powers <span className="text-indigo-600">Confident</span> Real Estate Decisions.
              </h1>
              <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-xl">
                ACOT transforms official real estate data from Dubai into trusted intelligence that professionals rely on to analyze, decide and grow.
              </p>
            </div>
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-gray-50">
                <img
                  src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80"
                  alt="Dubai Skyscraper Architecture"
                  referrerPolicy="no-referrer"
                  className="w-full h-[320px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Mission Card */}
            <div className="bg-white p-10 rounded-2xl border border-gray-100 shadow-xs flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-500 leading-relaxed text-sm sm:text-base max-w-md">
                To make real estate intelligence accessible, accurate and actionable for every decision maker in the Dubai market.
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-white p-10 rounded-2xl border border-gray-100 shadow-xs flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6">
                <Eye className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-500 leading-relaxed text-sm sm:text-base max-w-md">
                To be the most trusted real estate intelligence platform that drives transparency, growth and smart investments across the region.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2 block">
              OUR BELIEFS
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              What We Stand For
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((val, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xs flex flex-col items-center text-center hover:border-gray-200 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-6">
                  {val.icon}
                </div>
                <h3 className="text-md font-bold text-gray-900 mb-2">{val.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact / Metrics */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2 block">
              MARKET SCALE
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Our Impact
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-5xl mx-auto">
            {metrics.map((metric, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs text-center"
              >
                <span className="text-3xl sm:text-4xl font-extrabold text-indigo-600 block mb-2">
                  {metric.val}
                </span>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Building the Future of Real Estate Intelligence
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed mb-8 max-w-md mx-auto">
            We combine technology and official data to create intelligence that moves the market forward.
          </p>
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
