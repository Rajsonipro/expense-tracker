import { useState, useRef } from 'react';
import { Camera, Upload, Loader2, Check, X, Sparkles } from 'lucide-react';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

const ReceiptScanner = ({ isOpen, onClose, onTransactionAdded }) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [scannedData, setScannedData] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    setLoading(true);
    setScannedData(null);

    try {
      const base64Reader = new FileReader();
      base64Reader.readAsDataURL(file);
      base64Reader.onloadend = async () => {
        try {
          const base64Data = base64Reader.result;
          const { data } = await api.post('/api/scan', { imageBase64: base64Data });
          setScannedData(data);
        } catch (err) {
          console.error('Scan Error:', err);
          alert(err.response?.data?.message || 'Failed to scan receipt. Please try again.');
        } finally {
          setLoading(false);
        }
      };
    } catch (err) {
      console.error('FileReader Error:', err);
      alert('Failed to read file');
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await api.post('/api/transactions', {
        ...scannedData,
        type: 'expense'
      });
      onTransactionAdded();
      onClose();
      // Reset
      setPreview(null);
      setScannedData(null);
    } catch (err) {
      console.error(err);
      alert('Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md overflow-hidden"
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-gradient-to-r from-purple-500 to-indigo-600">
          <div className="flex items-center gap-2 text-white">
            <Sparkles size={20} />
            <h2 className="text-xl font-bold">AI Receipt Scanner</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full text-white transition">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {!preview && !scannedData && (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-12 text-center hover:border-purple-500 dark:hover:border-purple-400 cursor-pointer transition group"
            >
              <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition">
                <Upload size={28} className="text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-slate-700 dark:text-slate-300 font-semibold mb-1">Click to upload receipt</p>
              <p className="text-slate-500 text-sm">JPEG, PNG supported</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>
          )}

          {preview && (
            <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
              <img src={preview} alt="Receipt" className="max-h-full object-contain" />
              {loading && (
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white">
                  <Loader2 size={40} className="animate-spin mb-2" />
                  <p className="font-medium">Gemini is analyzing...</p>
                </div>
              )}
            </div>
          )}

          <AnimatePresence>
            {scannedData && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 pt-2"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Merchant</p>
                    <p className="font-bold text-slate-900 dark:text-white capitalize">{scannedData.title}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Amount</p>
                    <p className="font-bold text-slate-900 dark:text-white">₹{scannedData.amount}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Category</p>
                    <p className="font-bold text-slate-900 dark:text-white">{scannedData.category}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg">
                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Date</p>
                    <p className="font-bold text-slate-900 dark:text-white">{scannedData.date}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => {setPreview(null); setScannedData(null);}} 
                    className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                  >
                    Rescan
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-purple-200 dark:shadow-none hover:translate-y-[-2px] transition disabled:opacity-50"
                  >
                    Confirm & Save
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ReceiptScanner;
