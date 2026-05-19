import { useState, useEffect } from 'react';
import api from '../utils/api';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { TrendingUp, AlertTriangle, Sparkles, CheckCircle, PieChart as PieIcon } from 'lucide-react';
import { formatINR } from '../utils/formatters';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1e293b] border border-white/8 rounded-xl px-4 py-3 shadow-xl text-sm">
        <p className="text-slate-400 mb-1">{payload[0].name}</p>
        <p className="font-bold text-white">{formatINR(payload[0].value)}</p>
        <p className="text-xs text-slate-500">{(payload[0].payload.percent * 100).toFixed(1)}%</p>
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const [transactions, setTransactions] = useState([]);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/api/transactions');
        setTransactions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }

      try {
        const { data } = await api.get('/api/analytics/forecast');
        setForecast(data);
      } catch (err) {
        console.error('No forecast data');
      }
    };
    fetchData();
  }, []);

  const expenses = transactions.filter(t => t.type === 'expense');
  const income = transactions.filter(t => t.type === 'income');

  const categoryData = expenses.reduce((acc, curr) => {
    const existing = acc.find(item => item.name === curr.category);
    if (existing) existing.value += curr.amount;
    else acc.push({ name: curr.category, value: curr.amount });
    return acc;
  }, []);

  const totalExpenses = categoryData.reduce((sum, cat) => sum + cat.value, 0);
  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);

  // Category data with percentages
  const categoryDataWithPercent = categoryData
    .sort((a, b) => b.value - a.value)
    .map(d => ({ ...d, percent: totalExpenses > 0 ? d.value / totalExpenses : 0 }));

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="animate-shimmer h-7 w-40 rounded-xl mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="card p-6">
              <div className="animate-shimmer h-4 w-28 rounded mb-4" />
              <div className="animate-shimmer h-8 w-36 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="page-title">Analytics</h1>
        <p className="page-subtitle">Understand your spending patterns</p>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="stat-card-glow-red p-5">
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Expenses</p>
            <div className="icon-wrap-red">
              <TrendingUp size={15} className="text-rose-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{formatINR(totalExpenses)}</p>
          <p className="text-xs text-slate-500 mt-1">{categoryData.length} categories</p>
        </div>

        <div className="stat-card-glow-green p-5">
          <div className="flex items-start justify-between mb-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Income</p>
            <div className="icon-wrap-green">
              <TrendingUp size={15} className="text-emerald-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{formatINR(totalIncome)}</p>
          <p className="text-xs text-slate-500 mt-1">All time received</p>
        </div>

        {/* AI Forecast */}
        {forecast ? (
          <div className="stat-card-glow-purple p-5 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-5">
              <Sparkles size={80} />
            </div>
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Forecast</p>
              <div className="icon-wrap-purple">
                <Sparkles size={15} className="text-purple-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white relative">{formatINR(forecast.forecastedTotal)}</p>
            <div className="mt-2 relative">
              {forecast.status === 'Over Budget Projected' ? (
                <span className="badge-red">
                  <AlertTriangle size={11} /> Over Budget Projected
                </span>
              ) : (
                <span className="badge-green">
                  <CheckCircle size={11} /> On Track
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="stat-card-glow-purple p-5 flex flex-col justify-center items-center text-center">
            <Sparkles size={24} className="text-purple-500 mb-2" />
            <p className="text-xs text-slate-500">AI Forecast</p>
            <p className="text-slate-600 text-xs mt-1">Set a budget to unlock predictions</p>
          </div>
        )}
      </div>

      {expenses.length === 0 ? (
        <div className="card">
          <div className="empty-state py-20">
            <div className="empty-icon">
              <PieIcon size={22} className="text-slate-600" />
            </div>
            <p className="text-slate-400 font-medium text-sm">No expense data available</p>
            <p className="text-slate-600 text-xs mt-1">Start tracking expenses to see analytics</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Category Breakdown List */}
          <div className="card p-6">
            <h2 className="text-base font-semibold text-white mb-5">Category Breakdown</h2>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {categoryDataWithPercent.map((cat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                      />
                      <span className="font-medium text-slate-300">{cat.name}</span>
                    </div>
                    <span className="font-semibold text-white">{formatINR(cat.value)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${cat.percent * 100}%`,
                        backgroundColor: COLORS[idx % COLORS.length],
                        opacity: 0.8
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-600 text-right">{(cat.percent * 100).toFixed(1)}%</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pie Chart */}
          <div className="xl:col-span-2 card p-6">
            <h2 className="text-base font-semibold text-white mb-5">Expense Distribution</h2>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={categoryDataWithPercent}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={130}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryDataWithPercent.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      strokeWidth={0}
                      opacity={0.85}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-2 justify-center">
              {categoryDataWithPercent.slice(0, 6).map((cat, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  {cat.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
