import { useState, useRef } from 'react';
import { Upload, Loader2, Check, X, Sparkles, ImagePlus, RefreshCw } from 'lucide-react';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

const ReceiptScanner = ({ isOpen, onClose, onTransactionAdded }) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [scannedData, setScannedData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const processFile = async (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    setLoading(true);
    setScannedData(null);

    const base64Reader = new FileReader();
    base64Reader.readAsDataURL(file);
    base64Reader.onloadend = async () => {
      try {
        const { data } = await api.post('/api/scan', { imageBase64: base64Reader.result });
        setScannedData(data);
      } catch (err) {
        console.error('Scan Error:', err);
        alert(err.response?.data?.message || 'Failed to scan receipt. Please try again.');
        setPreview(null);
      } finally {
        setLoading(false);
      }
    };
  };

  const handleFileChange = (e) => processFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) processFile(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post('/api/transactions', { ...scannedData, type: 'expense' });
      onTransactionAdded();
      onClose();
      setPreview(null);
      setScannedData(null);
    } catch (err) {
      alert('Failed to save transaction');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setPreview(null);
    setScannedData(null);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="modal-panel w-full max-w-sm"
      >
        {/* Header */}
        <div className="modal-header" style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(99,102,241,0.1))', borderBottomColor: 'rgba(168,85,247,0.15)' }}>
          <div className="flex items-center gap-3">
            <div className="icon-wrap-purple">
              <Sparkles size={16} className="text-purple-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">AI Receipt Scanner</h2>
              <p className="text-xs text-slate-500">Powered by Gemini</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={16} />
          </button>
        </div>

        <div className="modal-body space-y-4">
          {/* Upload Area */}
          {!preview && (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200 ${
                dragOver
                  ? 'border-purple-500 bg-purple-500/8'
                  : 'border-white/10 hover:border-purple-500/40 hover:bg-purple-500/5'
              }`}
            >
              <div className="icon-wrap-purple w-14 h-14 mx-auto mb-4">
                <ImagePlus size={22} className="text-purple-400" />
              </div>
              <p className="text-slate-300 font-semibold text-sm mb-1">
                {dragOver ? 'Drop it here!' : 'Click or drag & drop'}
              </p>
              <p className="text-slate-600 text-xs">JPEG, PNG, WEBP supported</p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
            </div>
          )}

          {/* Image Preview */}
          {preview && (
            <div className="relative rounded-xl overflow-hidden bg-[#0a0f1e]" style={{ aspectRatio: '4/3' }}>
              <img src={preview} alt="Receipt" className="w-full h-full object-contain" />
              {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
                  <div className="w-12 h-12 rounded-full border-2 border-purple-500/30 border-t-purple-500 animate-spin-slow mb-3" />
                  <p className="text-white text-sm font-semibold">Gemini is analyzing...</p>
                  <p className="text-slate-400 text-xs mt-1">Extracting receipt data</p>
                </div>
              )}
            </div>
          )}

          {/* Scanned Data */}
          <AnimatePresence>
            {scannedData && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                    <Check size={11} />
                  </div>
                  Receipt scanned successfully
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Merchant', value: scannedData.title },
                    { label: 'Amount', value: `₹${scannedData.amount}` },
                    { label: 'Category', value: scannedData.category },
                    { label: 'Date', value: scannedData.date },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">{label}</p>
                      <p className="text-sm font-bold text-white capitalize">{value || '—'}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Buttons */}
        {(preview || scannedData) && (
          <div className="modal-footer">
            <button
              onClick={handleReset}
              className="btn-secondary flex-1"
            >
              <RefreshCw size={14} /> Rescan
            </button>
            {scannedData && (
              <button
                onClick={handleSave}
                disabled={saving}
                className={`btn-primary flex-1 ${saving ? 'opacity-60 cursor-not-allowed' : ''}`}
                style={{ background: saving ? undefined : 'linear-gradient(135deg, #8b5cf6, #6366f1)', boxShadow: '0 4px 14px rgba(139,92,246,0.4)' }}
              >
                {saving ? (
                  <><Loader2 size={14} className="animate-spin-slow" /> Saving...</>
                ) : (
                  <><Check size={14} /> Confirm & Save</>
                )}
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ReceiptScanner;
