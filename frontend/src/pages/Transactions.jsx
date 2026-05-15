import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Plus, Download, Trash2, Sparkles } from 'lucide-react';
import { formatINR } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import ReceiptScanner from '../components/ReceiptScanner';

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [formData, setFormData] = useState({
    title: '', amount: '', type: 'expense', category: '', date: '', note: ''
  });
  
  // Filters
  const [typeFilter, setTypeFilter] = useState('');
  const [sortFilter, setSortFilter] = useState('newest');

  const fetchTransactions = async () => {
    try {
      const { data } = await api.get(`/api/transactions?type=${typeFilter}&sort=${sortFilter}`);
      setTransactions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [typeFilter, sortFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
    console.log('User from auth:', user);
    
    try {
      console.log('Sending transaction data to API...');
      const response = await api.post('/api/transactions', formData);
      console.log('Transaction created successfully:', response.data);
      
      setShowModal(false);
      setFormData({ title: '', amount: '', type: 'expense', category: '', date: '', note: '' });
      fetchTransactions();
    } catch (error) {
      console.error('Error creating transaction:', error);
      console.error('Error response:', error.response?.data);
      alert(`Failed to create transaction: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this transaction?')) {
      await api.delete(`/api/transactions/${id}`);
      fetchTransactions();
    }
  };

  const downloadCSV = async () => {
    window.open('http://localhost:5001/api/transactions/export/csv', '_blank');
  };

  const downloadPDF = async () => {
    window.open('http://localhost:5001/api/transactions/export/pdf', '_blank');
  };

  return (
    <div className="space-y-8">
      {!user && (
        <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
          <p className="font-medium">Please log in to manage your transactions.</p>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Transactions</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Manage and track all your transactions</p>
        </div>
        {user && (
          <div className="flex gap-3">
             <button 
              onClick={() => setShowScanner(true)} 
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl transition shadow-lg font-medium"
            >
              <Sparkles size={20} /> AI Scan
            </button>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl transition shadow-lg font-medium">
              <Plus size={20} /> Add Manual
            </button>
          </div>
        )}
      </div>

      <ReceiptScanner 
        isOpen={showScanner} 
        onClose={() => setShowScanner(false)} 
        onTransactionAdded={fetchTransactions} 
      />

      <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <select onChange={e => setTypeFilter(e.target.value)} className="flex-1 bg-slate-50 dark:bg-slate-700 dark:text-white border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-2.5 outline-none hover:border-slate-300 focus:ring-2 focus:ring-blue-500 transition">
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select onChange={e => setSortFilter(e.target.value)} className="flex-1 bg-slate-50 dark:bg-slate-700 dark:text-white border border-slate-200 dark:border-slate-600 rounded-lg px-4 py-2.5 outline-none hover:border-slate-300 focus:ring-2 focus:ring-blue-500 transition">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Amount</option>
          <option value="lowest">Lowest Amount</option>
        </select>
        <div className="flex gap-2">
          <button onClick={downloadCSV} className="p-3 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 text-emerald-600 rounded-lg transition font-medium text-sm" title="Export CSV">
            <Download size={18} />
          </button>
          <button onClick={downloadPDF} className="p-3 bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/30 dark:hover:bg-rose-900/50 text-rose-600 rounded-lg transition font-medium text-sm" title="Export PDF">
            <Download size={18} />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-b border-slate-200 dark:border-slate-700">
              <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Date</th>
              <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Description</th>
              <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Category</th>
              <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Amount</th>
              <th className="p-4 font-semibold text-slate-700 dark:text-slate-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {!loading && transactions.map(t => (
              <tr key={t._id} className="border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition duration-150">
                <td className="p-4 text-slate-600 dark:text-slate-400 font-medium">{new Date(t.date).toLocaleDateString('en-IN')}</td>
                <td className="p-4 text-slate-900 dark:text-white font-medium">{t.title}</td>
                <td className="p-4"><span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">{t.category}</span></td>
                <td className={`p-4 font-bold text-lg ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {t.type === 'income' ? '+' : '-'}{formatINR(t.amount)}
                </td>
                <td className="p-4">
                  <button onClick={() => handleDelete(t._id)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && transactions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400 text-lg">No transactions found</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && user && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Add New Transaction</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <input type="text" placeholder="e.g., Groceries, Salary" required className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Amount (₹)</label>
                <input type="number" placeholder="0" required className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
                  <select className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <input type="text" placeholder="e.g., Food" required className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date</label>
                <input type="date" required className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Note (Optional)</label>
                <input type="text" placeholder="Add a note..." className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition" value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} />
              </div>

              <div className="flex gap-3 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition font-medium">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition font-medium">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
