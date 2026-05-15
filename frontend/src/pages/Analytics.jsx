import { useState, useEffect } from 'react';
import api from '../utils/api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { TrendingUp, AlertTriangle, Sparkles } from 'lucide-react';
import { formatINR } from '../utils/formatters';

const Analytics = () => {
  const [transactions, setTransactions] = useState([]);
  const [forecast, setForecast] = useState(null);
  
  useEffect(() => {
    const fetchTransactions = async () => {
      const { data } = await api.get('/api/transactions');
      setTransactions(data);
    };
    
    const fetchForecast = async () => {
      try {
        const { data } = await api.get('/api/analytics/forecast');
        setForecast(data);
      } catch (err) {
        console.error("No forecast data");
      }
    };

    fetchTransactions();
    fetchForecast();
  }, []);

  const expenses = transactions.filter(t => t.type === 'expense');
  
  // Group by category
  const categoryData = expenses.reduce((acc, curr) => {
    const existing = acc.find(item => item.name === curr.category);
    if (existing) {
      existing.value += curr.amount;
    } else {
      acc.push({ name: curr.category, value: curr.amount });
    }
    return acc;
  }, []);

  const totalExpenses = categoryData.reduce((sum, cat) => sum + cat.value, 0);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Expense Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Analyze your spending patterns by category and see AI predictions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categoryData.length > 0 && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 p-6 rounded-xl border border-blue-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-3 rounded-lg">
                <TrendingUp size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Total Expenses</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{formatINR(totalExpenses)}</p>
              </div>
            </div>
          </div>
        )}

        {forecast && (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-indigo-950 dark:to-purple-900 p-6 rounded-xl border border-purple-200 dark:border-indigo-800 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10">
              <Sparkles size={100} />
            </div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="bg-purple-600 p-3 rounded-lg shadow-lg">
                <Sparkles size={24} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-purple-700 dark:text-purple-300">AI Spending Forecast (End of Month)</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{formatINR(forecast.forecastedTotal)}</p>
                  {forecast.status === 'Over Budget Projected' && (
                    <span className="text-xs font-bold text-red-500 flex items-center gap-1 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full">
                      <AlertTriangle size={12}/> Over Budget!
                    </span>
                  )}
                  {forecast.status === 'On Track' && (
                    <span className="text-xs font-bold text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                       On Track
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Category Breakdown</h2>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {categoryData.sort((a,b) => b.value - a.value).map((cat, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{cat.name}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{formatINR(cat.value)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Expense Distribution</h2>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
               <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatINR(value)} contentStyle={{borderRadius: '12px', border: 'none', backgroundColor: '#1e293b', color: '#fff'}} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500">No expense data available</div>
          )}
        </div>
      </div>

      {expenses.length === 0 && (
        <div className="text-center py-16 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <p className="text-slate-500 dark:text-slate-400 text-lg">No expenses recorded yet. Start tracking to see analytics!</p>
        </div>
      )}
    </div>
  );
};

export default Analytics;
