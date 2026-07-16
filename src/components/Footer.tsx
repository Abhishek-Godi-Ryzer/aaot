import { Building2, Linkedin, Twitter, Youtube, Globe } from 'lucide-react';
import { PagePath } from '../types';

interface FooterProps {
  onNavigate: (path: PagePath) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer id="global-footer" className="bg-gray-50 border-t border-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <button
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2.5 group mb-4 cursor-pointer text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-gray-900">
                ACOT<span className="text-indigo-600">.</span>
              </span>
            </button>
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed mb-6">
              ACOT is an AI-powered Dubai real estate intelligence platform, delivering institutional-grade analytics, transaction feeds, and AI insights.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-sm transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-sm transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-sm transition-all"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Platform Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => onNavigate('/solutions')}
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors text-left cursor-pointer"
                >
                  Solutions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/ai-intelligence')}
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors text-left cursor-pointer"
                >
                  AI Intelligence
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/pricing')}
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors text-left cursor-pointer"
                >
                  Pricing Plans
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/login')}
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors text-left cursor-pointer font-medium text-indigo-600"
                >
                  Access Platform
                </button>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors text-left cursor-pointer"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors text-left cursor-pointer"
                >
                  Contact
                </button>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors text-left block"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors text-left block"
                >
                  News & Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors block"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors block"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors block"
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold bg-indigo-50 px-2 py-1 rounded-md w-fit">
                  <Globe className="w-3.5 h-3.5" />
                  Dubai, UAE
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-200/60 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} ACOT. All rights reserved. Powered by official DLD data.</p>
          <div className="flex items-center gap-6">
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-gray-600 transition-colors">
              Privacy Policy
            </a>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-gray-600 transition-colors">
              Terms of Service
            </a>
            <span className="text-gray-300">|</span>
            <span>Dubai Silicon Oasis, UAE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
