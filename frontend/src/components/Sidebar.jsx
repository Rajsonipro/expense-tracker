import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, List, PieChart, Wallet, LogOut, Zap, CreditCard, Menu, X, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { name: 'Dashboard', path: '/dashboard', icon: Home },
  { name: 'Transactions', path: '/transactions', icon: List },
  { name: 'Analytics', path: '/analytics', icon: PieChart },
  { name: 'Budget', path: '/budget', icon: Wallet },
  { name: 'Subscriptions', path: '/subscriptions', icon: CreditCard },
];

const Sidebar = () => {
  const { pathname } = useLocation();
  const { logout, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-white/5 flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)', boxShadow: '0 4px 12px rgba(99,102,241,0.4)' }}
        >
          <Zap size={18} className="text-white" />
        </div>
        <div>
          <span className="text-base font-bold text-white tracking-tight">TrackIt</span>
          <p className="text-[10px] text-slate-500 font-medium tracking-widest uppercase leading-tight">Finance</p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Menu</p>
        {navLinks.map(({ name, path, icon: Icon }) => {
          const isActive = pathname === path;
          return (
            <Link
              key={name}
              to={path}
              onClick={() => setMobileOpen(false)}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                isActive
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {isActive && (
                <div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(99,102,241,0.08))',
                    border: '1px solid rgba(99,102,241,0.25)',
                  }}
                />
              )}
              <div
                className={`relative w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                  isActive
                    ? 'bg-indigo-500 shadow-[0_2px_8px_rgba(99,102,241,0.5)]'
                    : 'bg-white/5 group-hover:bg-white/8'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'} />
              </div>
              <span className="relative">{name}</span>
              {isActive && (
                <ChevronRight size={14} className="relative ml-auto text-indigo-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="px-3 pb-4 border-t border-white/5 pt-3 space-y-1">
        {/* User avatar */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/3 border border-white/5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#6366f1,#a78bfa)' }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
            <p className="text-[10px] text-slate-500 truncate">{user?.email || ''}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/8 transition-all"
        >
          <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center flex-shrink-0">
            <LogOut size={14} />
          </div>
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 bg-[#111827] border border-white/8 rounded-xl flex items-center justify-center text-slate-300 shadow-xl"
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed left-0 top-0 bottom-0 z-50 w-64 bg-[#0d1321] border-r border-white/5 transition-transform duration-300 ease-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 hover:text-white"
        >
          <X size={16} />
        </button>
        <NavContent />
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 h-screen bg-[#0d1321] border-r border-white/5 flex-shrink-0 sticky top-0">
        <NavContent />
      </aside>
    </>
  );
};

export default Sidebar;
