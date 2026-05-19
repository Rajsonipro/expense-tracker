import { useState, useEffect } from 'react';
import api from '../utils/api';
import { CreditCard, Plus, Trash2, Calendar, AlertCircle, RefreshCw, X, Repeat } from 'lucide-react';
import { formatINR } from '../utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['Entertainment', 'Software', 'Health', 'Education', 'Utilities', 'Finance', 'Food', 'Other'];

const frequencyColors = {
  monthly: 'badge-blue',
  weekly: 'badge-amber',
  yearly: 'badge-purple',
};

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '', amount: '', frequency: 'monthly', nextBillingDate: '', category: 'Entertainment'
  });

  const fetchSubscriptions = async () => {
    try {
      const { data } = await api.get('/api/subscriptions');
      setSubscriptions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/api/subscriptions', formData);
      setShowModal(false);
      setFormData({ name: '', amount: '', frequency: 'monthly', nextBillingDate: '', category: 'Entertainment' });
      fetchSubscriptions();
    } catch (err) {
      alert('Failed to add subscription');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Remove this subscription?')) {
      await api.delete(`/api/subscriptions/${id}`);
      fetchSubscriptions();
    }
  };

  const totalMonthlyCost = subscriptions.reduce((acc, sub) => {
    if (sub.frequency === 'monthly') return acc + sub.amount;
    if (sub.frequency === 'weekly') return acc + sub.amount * 4;
    if (sub.frequency === 'yearly') return acc + sub.amount / 12;
    return acc;
  }, 0);

  const getDaysUntil = (dateStr) => {
    const today = new Date();
    const date = new Date(dateStr);
    const diff = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Subscriptions</h1>
          <p className="page-subtitle">Track and manage your recurring bills</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary text-sm"
        >
          <Plus size={16} /> Add Subscription
        </button>
      </div>

      {/* Summary Card */}
      <div className="stat-card-glow-blue p-6">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(99,102,241,0.1))', border: '1px solid rgba(99,102,241,0.3)' }}
          >
            <CreditCard size={22} className="text-indigo-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Monthly Commitment</p>
            <p className="text-3xl font-black text-white">{formatINR(totalMonthlyCost)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 mb-1">Active</p>
            <p className="text-2xl font-bold text-indigo-400">{subscriptions.length}</p>
          </div>
        </div>
        {subscriptions.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-slate-500">
            <AlertCircle size={13} className="text-amber-500" />
            <span>Review subscriptions regularly to avoid unnecessary charges</span>
          </div>
        )}
      </div>

      {/* Subscription Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-5">
              <div className="animate-shimmer h-5 w-32 rounded mb-3" />
              <div className="animate-shimmer h-3 w-20 rounded mb-4" />
              <div className="animate-shimmer h-7 w-24 rounded" />
            </div>
          ))}
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="card">
          <div className="empty-state py-20">
            <div className="empty-icon">
              <Repeat size={22} className="text-slate-600" />
            </div>
            <p className="text-slate-400 font-medium text-sm">No subscriptions tracked</p>
            <p className="text-slate-600 text-xs mt-1">Add your recurring bills to keep them organised</p>
            <button onClick={() => setShowModal(true)} className="btn-primary mt-5 text-sm">
              <Plus size={15} /> Add First Subscription
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {subscriptions.map((sub) => {
              const daysUntil = getDaysUntil(sub.nextBillingDate);
              const isUpcoming = daysUntil <= 7 && daysUntil >= 0;
              return (
                <motion.div
                  key={sub._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="card p-5 group relative hover:border-indigo-500/20 transition-all"
                >
                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(sub._id)}
                    className="absolute top-3 right-3 btn-danger p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    title="Remove"
                  >
                    <Trash2 size={13} />
                  </button>

                  <div className="mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                        <CreditCard size={15} className="text-indigo-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white text-sm truncate pr-6">{sub.name}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{sub.category}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-black text-white">{formatINR(sub.amount)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={frequencyColors[sub.frequency] || 'badge-blue'}>
                          <Repeat size={10} /> {sub.frequency}
                        </span>
                        {isUpcoming && (
                          <span className="badge-amber">
                            <AlertCircle size={10} /> Due soon
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Calendar size={11} />
                        <span>
                          {daysUntil === 0
                            ? 'Due today'
                            : daysUntil > 0
                              ? `${daysUntil}d left`
                              : `${Math.abs(daysUntil)}d ago`
                          }
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        {new Date(sub.nextBillingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="modal-panel"
          >
            <div className="modal-header">
              <div>
                <h2 className="text-base font-bold text-white">Track New Subscription</h2>
                <p className="text-xs text-slate-500 mt-0.5">Add a recurring bill to your tracker</p>
              </div>
              <button onClick={() => setShowModal(false)} className="btn-icon">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body space-y-4">
                <div>
                  <label className="input-label">Service / Company name</label>
                  <input
                    type="text"
                    placeholder="e.g., Netflix, Spotify, Gym"
                    required
                    className="input-field"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">Price (₹)</label>
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
                    <label className="input-label">Billing Cycle</label>
                    <select
                      className="select-field"
                      value={formData.frequency}
                      onChange={e => setFormData({ ...formData, frequency: e.target.value })}
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="input-label">Category</label>
                  <select
                    className="select-field"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="input-label">Next Billing Date</label>
                  <input
                    type="date"
                    required
                    className="input-field"
                    value={formData.nextBillingDate}
                    onChange={e => setFormData({ ...formData, nextBillingDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`btn-primary flex-1 ${submitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {submitting ? (
                    <><RefreshCw size={14} className="animate-spin-slow" /> Saving...</>
                  ) : (
                    'Start Tracking'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
