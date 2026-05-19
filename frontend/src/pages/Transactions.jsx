import { useState, useEffect } from 'react';
import api from '../utils/api';
import {
  Plus, Download, Trash2, Sparkles, Filter,
  ArrowUpRight, ArrowDownRight, List, X, FileText
} from 'lucide-react';
import { formatINR } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import ReceiptScanner from '../components/ReceiptScanner';

const CATEGORIES = [
  'Food & Dining', 'Shopping', 'Transportation', 'Entertainment',
  'Health', 'Education', 'Utilities', 'Rent', 'Salary', 'Other'
];

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '', amount: '', type: 'expense', category: '', date: '', note: ''
  });

  const [typeFilter, setTypeFilter] = useState('');
  const [sortFilter, setSortFilter] = useState('newest');

  const fetchTransactions = async () => {
    setLoading(true);
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
    setSubmitting(true);
    try {
      await api.post('/api/transactions', formData);
      setShowModal(false);
      setFormData({ title: '', amount: '', type: 'expense', category: '', date: '', note: '' });
      fetchTransactions();
    } catch (error) {
      console.error('Error creating transaction:', error);
      alert(`Failed to create transaction: ${error.response?.data?.message || error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await api.delete(`/api/transactions/${id}`);
      fetchTransactions();
    }
  };

  const downloadCSV = async () => {
    try {
      const response = await api.get('/api/transactions/export/csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transactions.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('Failed to export CSV');
    }
  };

  const downloadPDF = async () => {
    try {
      const response = await api.get('/api/transactions/export/pdf', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transactions.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert('Failed to export PDF');
    }
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle">Manage and track all your spending</p>
        </div>
        {user && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowScanner(true)}
              className="btn text-sm px-4 py-2.5 text-purple-300 border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 hover:border-purple-500/50 transition-all"
            >
              <Sparkles size={15} className="text-purple-400" />
              AI Scan
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary text-sm"
            >
              <Plus size={16} /> Add Manual
            </button>
          </div>
        )}
      </div>

      {/* Receipt Scanner */}
      <ReceiptScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onTransactionAdded={fetchTransactions}
      />

      {/* Summary Row */}
      {transactions.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="stat-card-glow-green p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Income</p>
            <p className="text-xl font-bold text-emerald-400">{formatINR(totalIncome)}</p>
          </div>
          <div className="stat-card-glow-red p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Expenses</p>
            <p className="text-xl font-bold text-rose-400">{formatINR(totalExpense)}</p>
          </div>
        </div>
      )}

      {/* Filters bar */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex items-center gap-2 text-slate-500 flex-shrink-0">
          <Filter size={15} />
          <span className="text-xs font-semibold uppercase tracking-wider">Filter</span>
        </div>
        <div className="flex flex-wrap gap-3 flex-1">
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="select-field text-sm flex-1 min-w-[130px] max-w-[180px]"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            value={sortFilter}
            onChange={e => setSortFilter(e.target.value)}
            className="select-field text-sm flex-1 min-w-[150px] max-w-[200px]"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
        </div>
        <div className="flex gap-2 ml-auto">
          <button
            onClick={downloadCSV}
            className="btn-icon flex items-center gap-1.5 text-xs text-emerald-400 border-emerald-500/30 bg-emerald-500/8 hover:bg-emerald-500/15 hover:border-emerald-500/40"
            title="Export CSV"
          >
            <Download size={14} />
            <span className="hidden sm:inline">CSV</span>
          </button>
          <button
            onClick={downloadPDF}
            className="btn-icon flex items-center gap-1.5 text-xs text-rose-400 border-rose-500/30 bg-rose-500/8 hover:bg-rose-500/15 hover:border-rose-500/40"
            title="Export PDF"
          >
            <FileText size={14} />
            <span className="hidden sm:inline">PDF</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="space-y-0">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-4 py-4 border-b border-white/5">
                <div className="animate-shimmer w-9 h-9 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="animate-shimmer h-4 w-40 rounded" />
                  <div className="animate-shimmer h-3 w-24 rounded" />
                </div>
                <div className="animate-shimmer h-5 w-20 rounded" />
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="empty-state py-20">
            <div className="empty-icon">
              <List size={22} className="text-slate-600" />
            </div>
            <p className="text-slate-400 font-medium text-sm">No transactions found</p>
            <p className="text-slate-600 text-xs mt-1">Try adjusting filters or add a new transaction</p>
            {user && (
              <button onClick={() => setShowModal(true)} className="btn-primary mt-5 text-sm">
                <Plus size={15} /> Add Transaction
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t, i) => (
                    <tr
                      key={t._id}
                      className="animate-fade-up"
                      style={{ animationDelay: `${i * 30}ms` }}
                    >
                      <td className="text-slate-500 text-xs">
                        {new Date(t.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              t.type === 'income'
                                ? 'bg-emerald-500/15 border border-emerald-500/20'
                                : 'bg-rose-500/15 border border-rose-500/20'
                            }`}
                          >
                            {t.type === 'income'
                              ? <ArrowUpRight size={13} className="text-emerald-400" />
                              : <ArrowDownRight size={13} className="text-rose-400" />
                            }
                          </div>
                          <span className="font-medium text-slate-200 text-sm">{t.title}</span>
                        </div>
                      </td>
                      <td>
                        <span className="badge-blue">{t.category}</span>
                      </td>
                      <td>
                        <span className={t.type === 'income' ? 'badge-green' : 'badge-red'}>
                          {t.type}
                        </span>
                      </td>
                      <td>
                        <span className={`font-bold text-sm ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {t.type === 'income' ? '+' : '-'}{formatINR(t.amount)}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDelete(t._id)}
                          className="btn-danger p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-white/5">
              {transactions.map((t) => (
                <div key={t._id} className="flex items-center gap-3 px-4 py-4 hover:bg-white/3 transition-colors">
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
                    <p className="text-xs text-slate-500">
                      {t.category} · {new Date(t.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {t.type === 'income' ? '+' : '-'}{formatINR(t.amount)}
                    </span>
                    <button onClick={() => handleDelete(t._id)} className="btn-danger p-1.5 rounded-lg">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Add Transaction Modal */}
      {showModal && user && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-panel animate-fade-up w-full max-w-md">
            <div className="modal-header">
              <div>
                <h2 className="text-base font-bold text-white">Add Transaction</h2>
                <p className="text-xs text-slate-500 mt-0.5">Record a new income or expense</p>
              </div>
              <button onClick={() => setShowModal(false)} className="btn-icon">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body space-y-4">
                {/* Type toggle */}
                <div>
                  <label className="input-label">Type</label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-xl border border-white/8">
                    {['expense', 'income'].map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: t })}
                        className={`py-2.5 rounded-lg text-sm font-semibold transition-all ${
                          formData.type === t
                            ? t === 'expense'
                              ? 'bg-rose-500 text-white shadow-lg'
                              : 'bg-emerald-500 text-white shadow-lg'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {t === 'expense' ? '↓ Expense' : '↑ Income'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="input-label">Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Groceries, Monthly Salary"
                    required
                    className="input-field"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">Amount (₹)</label>
                    <input
                      type="number"
                      placeholder="0"
                      required
                      min="0"
                      className="input-field"
                      value={formData.amount}
                      onChange={e => setFormData({ ...formData, amount: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="input-label">Date</label>
                    <input
                      type="date"
                      required
                      className="input-field"
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="input-label">Category</label>
                  <select
                    required
                    className="select-field"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="input-label">Note <span className="text-slate-600 normal-case">(optional)</span></label>
                  <input
                    type="text"
                    placeholder="Add a note..."
                    className="input-field"
                    value={formData.note}
                    onChange={e => setFormData({ ...formData, note: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`btn-primary flex-1 ${submitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {submitting ? 'Saving...' : 'Save Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
