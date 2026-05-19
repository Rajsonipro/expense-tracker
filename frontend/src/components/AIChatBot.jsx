import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles, ChevronDown } from 'lucide-react';
import api from '../utils/api';

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: "Hi! I'm your AI Financial Co-Pilot. Ask me anything about your spending, budgets, or financial goals! 🚀"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage = { role: 'user', text: query };
    setMessages(prev => [...prev, userMessage]);
    const sentQuery = query;
    setQuery('');
    setIsLoading(true);

    try {
      const response = await api.post('/api/chat', { query: sentQuery });
      setMessages(prev => [...prev, { role: 'bot', text: response.data.text }]);
    } catch (error) {
      const serverError = error.response?.data?.message || error.message || 'Check your connection';
      setMessages(prev => [...prev, { role: 'bot', text: `⚠️ ${serverError}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = ['Analyze my spending', 'Am I over budget?', 'Show top expenses'];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
              width: '360px',
              height: '520px',
              background: '#0d1321',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '20px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(99,102,241,0.1)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(99,102,241,0.08))',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '34px', height: '34px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(99,102,241,0.4)'
                }}>
                  <Sparkles size={16} color="white" />
                </div>
                <div>
                  <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'white', lineHeight: 1 }}>Financial Co-Pilot</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '3px' }}>
                    <span style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                    <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>AI ONLINE</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}
              >
                <ChevronDown size={14} />
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
                >
                  <div style={{ display: 'flex', gap: '8px', maxWidth: '85%', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                    {/* Avatar */}
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: msg.role === 'user'
                        ? 'linear-gradient(135deg, #6366f1, #818cf8)'
                        : 'rgba(255,255,255,0.06)',
                      border: msg.role === 'bot' ? '1px solid rgba(255,255,255,0.08)' : 'none',
                    }}>
                      {msg.role === 'user'
                        ? <User size={13} color="white" />
                        : <Bot size={13} color="#818cf8" />
                      }
                    </div>

                    {/* Bubble */}
                    <div style={{
                      padding: '10px 13px',
                      borderRadius: msg.role === 'user' ? '14px 4px 14px 14px' : '4px 14px 14px 14px',
                      fontSize: '13px',
                      lineHeight: 1.6,
                      background: msg.role === 'user'
                        ? 'linear-gradient(135deg, #6366f1, #818cf8)'
                        : 'rgba(255,255,255,0.05)',
                      border: msg.role === 'bot' ? '1px solid rgba(255,255,255,0.06)' : 'none',
                      color: msg.role === 'user' ? 'white' : '#cbd5e1',
                      boxShadow: msg.role === 'user' ? '0 4px 12px rgba(99,102,241,0.3)' : 'none',
                    }}>
                      {msg.text}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div style={{ display: 'flex', gap: '8px', maxWidth: '85%' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Bot size={13} color="#818cf8" />
                  </div>
                  <div style={{ padding: '10px 14px', borderRadius: '4px 14px 14px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '5px', alignItems: 'center' }}>
                    {[0, 1, 2].map(i => (
                      <span
                        key={i}
                        style={{
                          width: '6px', height: '6px', borderRadius: '50%',
                          background: '#6366f1', display: 'inline-block',
                          animation: `bounce 1.2s ${i * 0.2}s infinite`
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick prompts */}
            {messages.length <= 1 && (
              <div style={{ paddingLeft: '16px', paddingRight: '16px', paddingBottom: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {quickPrompts.map(p => (
                  <button
                    key={p}
                    onClick={() => { setQuery(p); inputRef.current?.focus(); }}
                    style={{
                      fontSize: '11px', fontWeight: 600, color: '#818cf8',
                      background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                      borderRadius: '20px', padding: '4px 12px', cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSend} style={{ padding: '12px 14px', borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)', flexShrink: 0 }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Ask anything..."
                  style={{
                    flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px', padding: '9px 14px', fontSize: '13px', color: 'white',
                    outline: 'none', caretColor: '#6366f1',
                    fontFamily: 'Inter, sans-serif'
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(99,102,241,0.4)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
                <button
                  type="submit"
                  disabled={isLoading || !query.trim()}
                  style={{
                    width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                    background: query.trim() && !isLoading ? 'linear-gradient(135deg, #6366f1, #818cf8)' : 'rgba(255,255,255,0.06)',
                    border: 'none', cursor: query.trim() && !isLoading ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', transition: 'all 0.2s',
                    boxShadow: query.trim() && !isLoading ? '0 4px 10px rgba(99,102,241,0.4)' : 'none',
                    opacity: isLoading ? 0.5 : 1
                  }}
                >
                  {isLoading ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={15} />}
                </button>
              </div>
              <p style={{ textAlign: 'center', fontSize: '10px', color: '#334155', marginTop: '8px' }}>
                Powered by Gemini 2.0 Flash
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '52px', height: '52px',
          background: isOpen
            ? 'rgba(17,24,39,0.9)'
            : 'linear-gradient(135deg, #6366f1, #818cf8)',
          border: isOpen ? '1px solid rgba(255,255,255,0.1)' : 'none',
          borderRadius: '16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: isOpen
            ? '0 4px 20px rgba(0,0,0,0.4)'
            : '0 6px 24px rgba(99,102,241,0.5)',
          color: 'white',
          position: 'relative',
        }}
        aria-label="Toggle AI chat"
      >
        <AnimatePresence mode="wait">
          {isOpen
            ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} style={{ display: 'flex' }}><X size={20} /></motion.div>
            : <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} style={{ display: 'flex' }}><Sparkles size={20} /></motion.div>
          }
        </AnimatePresence>

        {/* Notification dot */}
        {!isOpen && (
          <span style={{ position: 'absolute', top: '-3px', right: '-3px', width: '14px', height: '14px', borderRadius: '50%', background: '#10b981', border: '2px solid #050911', fontSize: '8px', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            1
          </span>
        )}
      </motion.button>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default AIChatBot;
