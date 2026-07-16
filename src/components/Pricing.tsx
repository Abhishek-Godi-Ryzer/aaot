import { useState } from 'react';
import { Check, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { PagePath } from '../types';

interface PricingProps {
  onNavigate: (path: PagePath) => void;
}

export default function Pricing({ onNavigate }: PricingProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const plans = [
    {
      name: 'Free',
      price: '0',
      desc: 'Explore ACOT and basic Dubai real estate data.',
      benefits: [
        'Basic Market Access',
        'Limited AI Queries (10 / mo)',
        'Community Support',
        'Standard Data (7 Days History)',
      ],
      button: 'Get Started',
      popular: false,
    },
    {
      name: 'Pro',
      price: '179',
      desc: 'For individual investors and serious market explorers.',
      benefits: [
        'All Intelligence Modules',
        'AI Analyst (Unlimited Queries)',
        'Pre-built Reports (Unlimited)',
        'Watchlists (Unlimited)',
        'Data History (1 Year)',
        'Email Support',
      ],
      button: 'Start Pro',
      popular: true,
    },
    {
      name: 'Agent',
      price: '349',
      desc: 'For real estate agents and property professionals.',
      benefits: [
        'Everything in Pro',
        'Client Reports (Branded & Customizable)',
        'Agent Branding (Your Logo & Profile)',
        'Property Alerts (Unlimited)',
        'Priority Support',
      ],
      button: 'Choose Agent',
      popular: false,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      desc: 'For agencies, developers, banks and large teams.',
      benefits: [
        'Everything in Agent',
        'Unlimited Users',
        'Enterprise Dashboard',
        'API Access',
        'Dedicated Support',
        'Onboarding & Training',
      ],
      button: 'Contact Sales',
      popular: false,
    },
  ];

  const faqs = [
    {
      q: 'Can I upgrade or downgrade my plan anytime?',
      a: 'Yes, you can easily change your subscription plan directly from your workspace billing dashboard. Changes take effect on the next billing cycle.',
    },
    {
      q: 'Can I cancel my subscription anytime?',
      a: 'Yes, subscriptions are billed monthly with no lock-in contract. You can cancel your subscription at any time with a single click.',
    },
    {
      q: 'Is support included in all plans?',
      a: 'We offer standard community support for the Free tier, email support for the Pro tier, and premium priority support with dedicated account managers for Agent and Enterprise users.',
    },
    {
      q: 'How does Enterprise pricing work?',
      a: 'Our Enterprise plan is tailored to the exact scale, database requirements, and custom API limits of your agency or bank. Get in touch with our team for a personalized demo.',
    },
  ];

  return (
    <div className="pt-24 font-sans">
      {/* Hero Section */}
      <section className="bg-white py-16 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-3 block">
            PRICING PLANS
          </span>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed max-w-xl mx-auto">
            Choose the plan that fits your real estate intelligence needs.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-8 border transition-all duration-300 flex flex-col justify-between h-full ${
                  plan.popular
                    ? 'border-indigo-600 bg-white shadow-xl relative'
                    : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-xs'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                )}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-xs text-gray-400 mb-6 min-h-[32px]">{plan.desc}</p>
                  
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-xs font-semibold text-gray-400">AED</span>
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    {plan.price !== 'Custom' && (
                      <span className="text-xs text-gray-400 ml-1">/ month</span>
                    )}
                  </div>

                  <ul className="space-y-3.5 mb-8">
                    {plan.benefits.map((benefit, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-3 text-xs text-gray-600">
                        <div className="w-4 h-4 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => onNavigate('/login')}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    plan.popular
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {plan.button}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple FAQ */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2 block">
              QUESTIONS & ANSWERS
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-semibold text-gray-900 text-sm sm:text-base">
                    {faq.q}
                  </span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 border-t border-gray-50 pt-4 text-sm text-gray-500 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to start your intelligence journey?
          </h2>
          <button
            onClick={() => onNavigate('/login')}
            className="group inline-flex items-center gap-2 bg-indigo-600 text-white font-medium px-8 py-3.5 rounded-xl hover:bg-indigo-700 transition-all cursor-pointer shadow-sm"
          >
            Get Started
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
}
