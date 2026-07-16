import { useAuth } from '../../context/AuthContext';
import { PagePath } from '../../types';
import { Shield, Sparkles, LogOut, ArrowRight, Server, Users } from 'lucide-react';

interface AdminWorkspaceProps {
  onNavigate: (path: PagePath) => void;
}

export default function AdminWorkspace({ onNavigate }: AdminWorkspaceProps) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onNavigate('/');
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 md:px-6 flex items-center justify-center bg-gray-50/50">
      <div className="max-w-2xl w-full bg-white rounded-3xl border border-gray-100 shadow-xl p-8 lg:p-12 text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-2xl"></div>
        
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
          <Shield className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            System Administrator Control
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Admin Workspace – Coming Soon
          </h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            Welcome, system administrator <strong>{user?.name || 'ACOT Admin'}</strong>. The global configuration panels, user permissions mapping, and server-side telemetry portals will be implemented in subsequent releases.
          </p>
        </div>

        {/* User context breakdown */}
        <div className="border-t border-b border-gray-100 py-6 my-4 text-left grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-gray-400 font-mono block">Administrator</span>
            <span className="text-sm font-bold text-gray-800">{user?.name}</span>
          </div>
          <div>
            <span className="text-xs text-gray-400 font-mono block">Access Level</span>
            <span className="text-sm font-bold text-indigo-700 flex items-center gap-1">
              <Server className="w-3.5 h-3.5" />
              Root Admin
            </span>
          </div>
          <div>
            <span className="text-xs text-gray-400 font-mono block">Organization</span>
            <span className="text-sm font-bold text-gray-800">{user?.company || 'ACOT Technologies'}</span>
          </div>
          <div>
            <span className="text-xs text-gray-400 font-mono block">Active Nodes</span>
            <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              2 / 2 Server Pools Online
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleLogout}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 hover:border-red-200 text-gray-700 hover:text-red-600 font-medium rounded-xl transition-all cursor-pointer bg-white"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out Account</span>
          </button>
          
          <button
            onClick={() => onNavigate('/')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-colors cursor-pointer"
          >
            <span>Back to Public Site</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
