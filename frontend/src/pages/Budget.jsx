import { useState, useEffect } from 'react';
import api from '../utils/api';
import { AlertCircle, CheckCircle, Target, TrendingUp, RefreshCw } from 'lucide-react';
import { formatINR } from '../utils/formatters';

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const Budget = () => {
  const [budget, setBudget] = useState(null);
  const [limitAmount, setLimitAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const fetchBudget = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/budget?month=${currentMonth}&year=${currentYear}`);
      setBudget(data);
      if (data) setLimitAmount(data.limitAmount);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudget();
  }, []);

  const handleSetBudget = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/api/budget', {
        month: currentMonth,
        year: currentYear,
        limitAmount: Number(limitAmount)
      });
      await fetchBudget();
    } catch (error) {
      console.error(error);
      alert(`Failed to set budget limit: ${error.response?.data?.message || error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const percentage = budget ? Math.min((budget.spentAmount / budget.limitAmount) * 100, 100) : 0;
  const isWarning = percentage >= 80 && percentage < 100;
  const isDanger = percentage >= 100;
  const remaining = budget ? Math.max(0, budget.limitAmount - budget.spentAmount) : 0;

  const progressColor = isDanger
    ? '#ef4444'
    : isWarning
      ? '#f59e0b'
      : '#10b981';

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="page-title">Monthly Budget</h1>
        <p className="page-subtitle">{monthNames[currentMonth - 1]} {currentYear} · Control your spending limits</p>
      </div>

      {/* Set Budget Card */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="icon-wrap-blue">
            <Target size={16} className="text-indigo-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Set Budget Limit</h2>
            <p className="text-xs text-slate-500">Define your monthly spending cap</p>
          </div>
        </div>
        <form onSubmit={handleSetBudget} className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="input-label">Monthly limit</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm pointer-events-none">₹</span>
              <input
                type="number"
                required
                min="0"
                className="input-field pl-8"
                value={limitAmount}
                onChange={e => setLimitAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className={`btn-primary whitespace-nowrap ${submitting ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {submitting ? (
              <><RefreshCw size={15} className="animate-spin-slow" /> Saving...</>
            ) : (
              <><Target size={15} /> {budget ? 'Update' : 'Set'} Limit</>
            )}
          </button>
        </form>
      </div>

      {/* Budget Overview */}
      {loading ? (
        <div className="card p-6 space-y-4">
          <div className="animate-shimmer h-4 w-32 rounded" />
          <div className="animate-shimmer h-10 w-full rounded-xl" />
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <div key={i} className="animate-shimmer h-16 rounded-xl" />)}
          </div>
        </div>
      ) : budget ? (
        <div className="space-y-4 animate-fade-up">
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="card p-4 text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Spent</p>
              <p className="text-lg font-bold text-rose-400">{formatINR(budget.spentAmount)}</p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Remaining</p>
              <p className={`text-lg font-bold ${remaining > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {formatINR(remaining)}
              </p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Limit</p>
              <p className="text-lg font-bold text-white">{formatINR(budget.limitAmount)}</p>
            </div>
          </div>

          {/* Progress Card */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-white">Budget Progress</p>
                <p className="text-xs text-slate-500 mt-0.5">{monthNames[currentMonth - 1]} {currentYear}</p>
              </div>
              <div className={`text-2xl font-black ${isDanger ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-emerald-400'}`}>
                {percentage.toFixed(0)}%
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mb-3">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${percentage}%`,
                  background: `linear-gradient(90deg, ${progressColor}aa, ${progressColor})`,
                  boxShadow: `0 0 10px ${progressColor}50`
                }}
              />
            </div>

            <div className="flex justify-between text-xs text-slate-600">
              <span>₹0</span>
              <span>{formatINR(budget.limitAmount)}</span>
            </div>
          </div>

          {/* Status Alert */}
          {isDanger ? (
            <div className="alert-danger">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-300">Budget Exceeded!</p>
                <p className="text-rose-400/80 text-xs mt-0.5">
                  You've overspent by {formatINR(budget.spentAmount - budget.limitAmount)} this month.
                </p>
              </div>
            </div>
          ) : isWarning ? (
            <div className="alert-warning">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-300">Approaching Limit</p>
                <p className="text-amber-400/80 text-xs mt-0.5">
                  You've used {percentage.toFixed(0)}% of your budget. Only {formatINR(remaining)} left.
                </p>
              </div>
            </div>
          ) : (
            <div className="alert-success">
              <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-300">On Track!</p>
                <p className="text-emerald-400/80 text-xs mt-0.5">
                  Great progress. You have {formatINR(remaining)} remaining for this month.
                </p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="card">
          <div className="empty-state py-16">
            <div className="empty-icon">
              <TrendingUp size={22} className="text-slate-600" />
            </div>
            <p className="text-slate-400 font-medium text-sm">No budget set yet</p>
            <p className="text-slate-600 text-xs mt-1">Set a monthly limit above to start tracking</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budget;
