import { Link, useLocation } from 'react-router-dom';
import { Home, List, PieChart, Wallet, LogOut, Zap, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { pathname } = useLocation();
  const { logout, user } = useAuth();

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Transactions', path: '/transactions', icon: List },
    { name: 'Analytics', path: '/analytics', icon: PieChart },
    { name: 'Budget', path: '/budget', icon: Wallet },
    { name: 'Subscriptions', path: '/subscriptions', icon: CreditCard },
  ];

  return (
    <div className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 h-full flex flex-col shadow-sm">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg">
            <Zap size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">TrackIt</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Finance Manager</p>
          </div>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">👋 Welcome back,<br/><span className="font-semibold text-slate-900 dark:text-slate-200">{user?.name}</span></p>
      </div>

      <nav className="flex-1 mt-6 px-3 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.path;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30' 
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
              }`}
            >
              <Icon size={20} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-3 w-full text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors font-medium"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
