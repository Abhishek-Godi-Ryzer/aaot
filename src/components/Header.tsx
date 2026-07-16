import { useState, useEffect } from 'react';
import { Menu, X, Building2, ArrowRight } from 'lucide-react';
import { PagePath, NavItem } from '../types';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentPath: PagePath;
  onNavigate: (path: PagePath) => void;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Solutions', path: '/solutions' },
  { label: 'AI Intelligence', path: '/ai-intelligence' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export default function Header({ currentPath, onNavigate }: HeaderProps) {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      id="global-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => {
            onNavigate('/');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
            <Building2 className="w-5.5 h-5.5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900 font-sans">
            ACOT<span className="text-indigo-600">.</span>
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`text-sm font-medium transition-colors cursor-pointer relative py-1 ${
                currentPath === item.path
                  ? 'text-indigo-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {item.label}
              {currentPath === item.path && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Desktop CTA Actions */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-500 font-sans">
                Welcome, <strong className="text-gray-800 font-semibold">{user.name.split(' ')[0]}</strong>
              </span>
              <button
                onClick={() => {
                  const correctWorkspace = `/${user.role}` as PagePath;
                  onNavigate(correctWorkspace);
                }}
                className="group inline-flex items-center gap-1.5 bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-sm cursor-pointer"
              >
                <span>Go to Workspace</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onNavigate('/login')}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={() => onNavigate('/login')}
                className="group inline-flex items-center gap-1.5 bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-sm cursor-pointer"
              >
                Access Platform
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg animate-fadeIn">
          <div className="px-6 py-6 flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  onNavigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className={`text-left text-base font-medium py-2 border-b border-gray-50 transition-colors ${
                  currentPath === item.path ? 'text-indigo-600' : 'text-gray-600'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="flex flex-col gap-3 pt-4">
              {user ? (
                <>
                  <p className="text-xs text-gray-400 font-mono text-center">
                    Logged in as <strong>{user.email}</strong>
                  </p>
                  <button
                    onClick={() => {
                      const correctWorkspace = `/${user.role}` as PagePath;
                      onNavigate(correctWorkspace);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-center bg-indigo-600 text-white text-sm font-medium py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    Go to Workspace
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      onNavigate('/login');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-center text-sm font-medium text-gray-700 hover:text-gray-900 py-3 border border-gray-200 rounded-xl transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('/login');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-center bg-indigo-600 text-white text-sm font-medium py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
                  >
                    Access Platform
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
