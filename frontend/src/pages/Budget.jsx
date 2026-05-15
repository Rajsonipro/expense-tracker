import { useState, useEffect } from 'react';
import api from '../utils/api';
import { AlertCircle, CheckCircle, Target } from 'lucide-react';
import { formatINR } from '../utils/formatters';

const Budget = () => {
  const [budget, setBudget] = useState(null);
  const [limitAmount, setLimitAmount] = useState('');
  
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const fetchBudget = async () => {
    try {
      const { data } = await api.get(`/api/budget?month=${currentMonth}&year=${currentYear}`);
      setBudget(data);
      if(data) setLimitAmount(data.limitAmount);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBudget();
  }, []);

  const handleSetBudget = async (e) => {
    e.preventDefault();
    try {
        await api.post('/api/budget', {
            month: currentMonth,
            year: currentYear,
            limitAmount: Number(limitAmount)
        });
        fetchBudget();
    } catch (error) {
        console.error(error);
        alert(`Failed to set budget limit: ${error.response?.data?.message || error.message}`);
    }
  };

  const percentage = budget ? Math.min((budget.spentAmount / budget.limitAmount) * 100, 100) : 0;
  const isWarning = percentage >= 80;
  const isDanger = percentage >= 100;

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Monthly Budget</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">{monthNames[currentMonth - 1]} {currentYear} • Manage your spending limits</p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 p-8 rounded-2xl shadow-sm border border-blue-200 dark:border-slate-700">
        <form onSubmit={handleSetBudget} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Monthly Budget Limit</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-slate-400 dark:text-slate-500">₹</span>
              <input 
                type="number" 
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition text-lg font-semibold"
                value={limitAmount}
                onChange={(e) => setLimitAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
          </div>
          <button type="submit" className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition font-semibold shadow-lg">
             Set Limit
          </button>
        </form>
      </div>

      {budget && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Spent</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{formatINR(budget.spentAmount)}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Limit</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{formatINR(budget.limitAmount)}</p>
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <span className={`text-lg font-bold ${isDanger ? 'text-rose-600 dark:text-rose-400' : isWarning ? 'text-orange-600 dark:text-orange-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {percentage.toFixed(0)}% of Budget Used
              </span>
              <span className="text-slate-600 dark:text-slate-400 font-semibold">
                {formatINR(Math.max(0, budget.limitAmount - budget.spentAmount))} Remaining
              </span>
            </div>
            
            <div className="w-full h-6 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 rounded-full ${isDanger ? 'bg-gradient-to-r from-rose-500 to-rose-600' : isWarning ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 'bg-gradient-to-r from-emerald-500 to-emerald-600'}`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>

          {/* Status Alerts */}
          {isWarning && !isDanger && (
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 p-4 rounded-lg flex items-center gap-3">
              <AlertCircle size={24} className="text-orange-600 dark:text-orange-400 flex-shrink-0" />
              <div>
                <p className="font-semibold text-orange-900 dark:text-orange-300">Caution: Budget Limit Approaching</p>
                <p className="text-sm text-orange-700 dark:text-orange-200 mt-1">You've used {percentage.toFixed(0)}% of your monthly budget.</p>
              </div>
            </div>
          )}
          
          {isDanger && (
            <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 p-4 rounded-lg flex items-center gap-3">
              <AlertCircle size={24} className="text-rose-600 dark:text-rose-400 flex-shrink-0" />
              <div>
                <p className="font-semibold text-rose-900 dark:text-rose-300">Alert: Budget Exceeded</p>
                <p className="text-sm text-rose-700 dark:text-rose-200 mt-1">You've exceeded your monthly budget by {formatINR(budget.spentAmount - budget.limitAmount)}.</p>
              </div>
            </div>
          )}

          {!isWarning && !isDanger && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-4 rounded-lg flex items-center gap-3">
              <CheckCircle size={24} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <div>
                <p className="font-semibold text-emerald-900 dark:text-emerald-300">Great! You're On Track</p>
                <p className="text-sm text-emerald-700 dark:text-emerald-200 mt-1">You have {formatINR(budget.limitAmount - budget.spentAmount)} left to spend this month.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Budget;
