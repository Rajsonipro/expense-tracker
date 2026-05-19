import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import {
  ArrowUpRight, ArrowDownRight, TrendingUp, Wallet,
  Plus, ArrowRight, Activity
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Cell
} from 'recharts';
import { formatINR } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1e293b] border border-white/8 rounded-xl px-4 py-3 shadow-xl text-sm">
        <p className="text-slate-400 mb-1">{label}</p>
        <p className="font-bold text-white">{formatINR(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const SkeletonCard = () => (
  <div className="stat-card-glow-blue animate-fade-up">
    <div className="animate-shimmer h-4 w-24 rounded mb-4" />
    <div className="animate-shimmer h-8 w-36 rounded" />
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data } = await api.get('/api/transactions');
        setTransactions(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

  // Last 6 months chart data
  const monthlyData = (() => {
    const months = {};
    transactions.forEach(t => {
      const d = new Date(t.date);
      const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      if (!months[key]) months[key] = { name: key, income: 0, expense: 0 };
      if (t.type === 'income') months[key].income += t.amount;
      else months[key].expense += t.amount;
    });
    return Object.values(months).slice(-6);
  })();

  const recentTx = transactions.slice(0, 5);

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="page-header">
          <div className="animate-shimmer h-7 w-40 rounded-xl mb-2" />
          <div className="animate-shimmer h-4 w-56 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Good morning, {user?.name?.split(' ')[0] || 'there'} 👋</h1>
          <p className="page-subtitle">Here's your financial snapshot for today</p>
        </div>
        <Link to="/transactions" className="btn-primary text-sm">
          <Plus size={16} /> Add Transaction
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Balance */}
        <div className="stat-card-glow-blue animate-fade-up" style={{ animationDelay: '0ms' }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Net Balance</p>
            </div>
            <div className="icon-wrap-blue">
              <Wallet size={16} className="text-indigo-400" />
            </div>
          </div>
          <p className={`text-2xl font-bold mb-1 ${balance >= 0 ? 'text-white' : 'text-rose-400'}`}>
            {formatINR(Math.abs(balance))}
          </p>
          <p className="text-xs text-slate-500">{balance >= 0 ? 'Positive balance' : 'Balance deficit'}</p>
          <div className="absolute bottom-0 right-0 w-24 h-24 rounded-tl-[48px] bg-indigo-500/4 -z-0" />
        </div>

        {/* Income */}
        <div className="stat-card-glow-green animate-fade-up" style={{ animationDelay: '60ms' }}>
          <div className="flex items-start justify-between mb-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Income</p>
            <div className="icon-wrap-green">
              <ArrowUpRight size={16} className="text-emerald-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-400 mb-1">{formatINR(totalIncome)}</p>
          <p className="text-xs text-slate-500">All time received</p>
        </div>

        {/* Expense */}
        <div className="stat-card-glow-red animate-fade-up" style={{ animationDelay: '120ms' }}>
          <div className="flex items-start justify-between mb-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Expenses</p>
            <div className="icon-wrap-red">
              <ArrowDownRight size={16} className="text-rose-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-rose-400 mb-1">{formatINR(totalExpense)}</p>
          <p className="text-xs text-slate-500">All time spent</p>
        </div>

        {/* Savings Rate */}
        <div className="stat-card-glow-purple animate-fade-up" style={{ animationDelay: '180ms' }}>
          <div className="flex items-start justify-between mb-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Savings Rate</p>
            <div className="icon-wrap-purple">
              <TrendingUp size={16} className="text-purple-400" />
            </div>
          </div>
          <p className={`text-2xl font-bold mb-1 ${savingsRate >= 20 ? 'text-purple-400' : savingsRate >= 0 ? 'text-amber-400' : 'text-rose-400'}`}>
            {savingsRate}%
          </p>
          <p className="text-xs text-slate-500">{savingsRate >= 20 ? 'Great savings!' : 'Of income saved'}</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Chart */}
        <div className="xl:col-span-2 card p-6 animate-fade-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-white">Income vs Expenses</h2>
              <p className="text-xs text-slate-500 mt-0.5">Monthly comparison</p>
            </div>
            <div className="icon-wrap-blue">
              <Activity size={16} className="text-indigo-400" />
            </div>
          </div>

          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData} barGap={4} barCategoryGap="28%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="name" stroke="#475569" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 6 }} />
                <Bar dataKey="income" name="Income" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={32} />
                <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[6, 6, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ height: 220 }}>
              <div className="empty-icon">
                <Activity size={20} className="text-slate-600" />
              </div>
              <p className="text-slate-500 text-sm">No chart data yet. Add transactions to get started.</p>
            </div>
          )}

          {/* Legend */}
          {monthlyData.length > 0 && (
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />
                Income
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-3 h-3 rounded-sm bg-rose-500 inline-block" />
                Expenses
              </div>
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="card p-6 animate-fade-up" style={{ animationDelay: '240ms' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-white">Recent Activity</h2>
              <p className="text-xs text-slate-500 mt-0.5">Last {recentTx.length} transactions</p>
            </div>
            <Link to="/transactions" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors">
              View all <ArrowRight size={12} />
            </Link>
          </div>

          {recentTx.length > 0 ? (
            <div className="space-y-2">
              {recentTx.map((t, i) => (
                <div
                  key={t._id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/3 transition-colors group"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      t.type === 'income'
                        ? 'bg-emerald-500/15 border border-emerald-500/20'
                        : 'bg-rose-500/15 border border-rose-500/20'
                    }`}
                  >
                    {t.type === 'income'
                      ? <ArrowUpRight size={14} className="text-emerald-400" />
                      : <ArrowDownRight size={14} className="text-rose-400" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{t.title}</p>
                    <p className="text-xs text-slate-500">{t.category} · {new Date(t.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</p>
                  </div>
                  <span className={`text-sm font-bold flex-shrink-0 ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatINR(t.amount)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <List size={20} className="text-slate-600" />
              </div>
              <p className="text-slate-500 text-sm">No transactions yet.</p>
              <Link to="/transactions" className="btn-primary mt-4 text-xs">
                <Plus size={14} /> Add your first
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-up" style={{ animationDelay: '280ms' }}>
        {[
          { label: 'View Analytics', desc: 'See spending patterns', path: '/analytics', color: 'indigo' },
          { label: 'Set Budget', desc: 'Control monthly spending', path: '/budget', color: 'amber' },
          { label: 'Subscriptions', desc: 'Track recurring bills', path: '/subscriptions', color: 'purple' },
        ].map(({ label, desc, path, color }) => (
          <Link
            key={path}
            to={path}
            className="card group p-4 flex items-center gap-4 hover:border-white/12 transition-all"
            style={{ borderColor: `rgba(var(--accent), 0.05)` }}
          >
            <div className={`icon-wrap-${color === 'amber' ? 'amber' : color === 'purple' ? 'purple' : 'blue'} flex-shrink-0`}>
              <ArrowRight size={16} className={color === 'amber' ? 'text-amber-400' : color === 'purple' ? 'text-purple-400' : 'text-indigo-400'} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{label}</p>
              <p className="text-xs text-slate-500">{desc}</p>
            </div>
            <ArrowRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
