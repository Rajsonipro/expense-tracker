import { useState, useEffect } from 'react';
import api from '../utils/api';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatINR } from '../utils/formatters';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data } = await api.get('/api/transactions?limit=5');
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

  // Formatting for chart
  const chartData = [
    { name: 'Income', amount: totalIncome, fill: '#10B981' },
    { name: 'Expense', amount: totalExpense, fill: '#EF4444' }
  ];

  if (loading) return <div className="animate-pulse flex gap-4"><div className="h-32 bg-gradient-to-r from-slate-200 to-slate-100 rounded-2xl w-full"></div></div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Welcome back! Here's your financial overview.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Balance Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 p-8 rounded-2xl shadow-lg text-white relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-blue-100 font-medium">Total Balance</h3>
              <div className="bg-white/20 p-2 rounded-lg"><TrendingUp size={20} className="text-white"/></div>
            </div>
            <p className="text-4xl font-bold">{formatINR(balance)}</p>
            <p className="text-blue-100 text-sm mt-2">Your current balance</p>
          </div>
        </div>
        
        {/* Total Income Card */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 p-8 rounded-2xl shadow-lg text-white relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-emerald-100 font-medium">Total Income</h3>
              <div className="bg-white/20 p-2 rounded-lg"><ArrowUpRight size={20} className="text-white"/></div>
            </div>
            <p className="text-4xl font-bold">{formatINR(totalIncome)}</p>
            <p className="text-emerald-100 text-sm mt-2">Money received</p>
          </div>
        </div>

        {/* Total Expense Card */}
        <div className="bg-gradient-to-br from-rose-500 to-rose-600 dark:from-rose-600 dark:to-rose-700 p-8 rounded-2xl shadow-lg text-white relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-rose-100 font-medium">Total Expense</h3>
              <div className="bg-white/20 p-2 rounded-lg"><ArrowDownRight size={20} className="text-white"/></div>
            </div>
            <p className="text-4xl font-bold">{formatINR(totalExpense)}</p>
            <p className="text-rose-100 text-sm mt-2">Money spent</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Recent Transactions</h3>
          <div className="space-y-3">
            {transactions.slice(0, 5).map(t => (
              <div key={t._id} className="flex justify-between items-center p-4 border border-slate-100 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition duration-200">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">{t.title}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(t.date).toLocaleDateString()} • {t.category}</p>
                </div>
                <div className={`font-bold text-lg ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {t.type === 'income' ? '+' : '-'}{formatINR(t.amount)}
                </div>
              </div>
            ))}
            {transactions.length === 0 && <p className="text-slate-500 text-center py-8">No transactions recorded yet.</p>}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 h-[400px]">
          <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Overview</h3>
          {transactions.length > 0 ? (
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#64748b" />
                <Tooltip cursor={{fill: 'rgba(100, 116, 139, 0.1)'}} contentStyle={{borderRadius: '12px', border: 'none', backgroundColor: '#1e293b', color: '#fff'}} />
                <Bar dataKey="amount" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
             <div className="h-full flex items-center justify-center text-slate-500">Not enough data</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
