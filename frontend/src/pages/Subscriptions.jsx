import { useState, useEffect } from 'react';
import api from '../utils/api';
import { CreditCard, Plus, Trash2, Calendar, Clock, AlertCircle } from 'lucide-react';
import { formatINR } from '../utils/formatters';
import { motion, AnimatePresence } from 'framer-motion';

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
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
    try {
      await api.post('/api/subscriptions', formData);
      setShowModal(false);
      setFormData({ name: '', amount: '', frequency: 'monthly', nextBillingDate: '', category: 'Entertainment' });
      fetchSubscriptions();
    } catch (err) {
      alert('Failed to add subscription');
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Remove this subscription?')) {
      await api.delete(`/api/subscriptions/${id}`);
      fetchSubscriptions();
    }
  };

  const totalMonthlyCost = subscriptions.reduce((acc, sub) => {
    if(sub.frequency === 'monthly') return acc + sub.amount;
    if(sub.frequency === 'weekly') return acc + (sub.amount * 4);
    if(sub.frequency === 'yearly') return acc + (sub.amount / 12);
    return acc;
  }, 0);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Subscriptions</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Track and manage your recurring bills</p>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-indigo-200 dark:hover:shadow-none transition font-medium"
        >
          <Plus size={20} /> Add Subscription
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-xl">
              <CreditCard className="text-indigo-600" size={24} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Monthly Commitment</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatINR(totalMonthlyCost)}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
               <AlertCircle size={16} className="text-amber-500" />
               <span>You have {subscriptions.length} active subscriptions</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AnimatePresence>
            {subscriptions.map((sub) => (
              <motion.div 
                key={sub._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 group hover:border-indigo-300 dark:hover:border-indigo-700 transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{sub.name}</h3>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded">
                      {sub.frequency}
                    </span>
                  </div>
                  <button onClick={() => handleDelete(sub._id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition opacity-0 group-hover:opacity-100">
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar size={14} />
                      Next: {new Date(sub.nextBillingDate).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{formatINR(sub.amount)}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {subscriptions.length === 0 && !loading && (
             <div className="col-span-full py-12 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                <Clock size={40} className="mx-auto mb-3 text-slate-300" />
                <p className="text-slate-500">No subscriptions tracked yet.</p>
             </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-700"
          >
            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Track New Subscription</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company/Service</label>
                <input type="text" placeholder="e.g., Netflix, Gym" required className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price (₹)</label>
                  <input type="number" placeholder="0" required className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Billing Cycle</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition" value={formData.frequency} onChange={e => setFormData({...formData, frequency: e.target.value})}>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Next Billing Date</label>
                <input type="date" required className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition" value={formData.nextBillingDate} onChange={e => setFormData({...formData, nextBillingDate: e.target.value})} />
              </div>

              <div className="flex gap-3 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-xl transition font-bold">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-violet-700 text-white rounded-xl transition font-bold shadow-lg shadow-indigo-100 dark:shadow-none">Start Tracking</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
