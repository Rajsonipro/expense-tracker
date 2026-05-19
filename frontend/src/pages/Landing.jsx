import { Link } from 'react-router-dom';
import { Zap, TrendingUp, PieChart, Shield, ArrowRight, CheckCircle, Sparkles, CreditCard } from 'lucide-react';

const features = [
  { icon: TrendingUp, title: 'Smart Tracking', desc: 'Log income and expenses with intelligent categorization', color: 'indigo' },
  { icon: PieChart, title: 'Deep Analytics', desc: 'Visualize spending patterns with beautiful charts', color: 'emerald' },
  { icon: Shield, title: 'Budget Control', desc: 'Set limits and get alerts before you overspend', color: 'amber' },
  { icon: Sparkles, title: 'AI Powered', desc: 'Scan receipts and get financial insights with AI', color: 'purple' },
  { icon: CreditCard, title: 'Subscriptions', desc: 'Track and manage all your recurring bills', color: 'rose' },
  { icon: Zap, title: 'Export Reports', desc: 'Download your financial data as CSV or PDF', color: 'cyan' },
];

const colorMap = {
  indigo: { bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.25)', text: '#818cf8' },
  emerald: { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)', text: '#34d399' },
  amber: { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)', text: '#fbbf24' },
  purple: { bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.25)', text: '#c084fc' },
  rose: { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.25)', text: '#fb7185' },
  cyan: { bg: 'rgba(6,182,212,0.12)', border: 'rgba(6,182,212,0.25)', text: '#22d3ee' },
};

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#050911]" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* Ambient glow orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>

      {/* Header */}
      <header style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 40, background: 'rgba(5,9,17,0.8)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)', borderRadius: '10px', padding: '6px', boxShadow: '0 4px 12px rgba(99,102,241,0.4)' }}>
              <Zap size={18} color="white" />
            </div>
            <span style={{ fontSize: '18px', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>TrackIt</span>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Link to="/login" style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 500, textDecoration: 'none', padding: '8px 16px', borderRadius: '10px', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = 'white'}
              onMouseLeave={e => e.target.style.color = '#94a3b8'}
            >
              Sign In
            </Link>
            <Link to="/register"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                color: 'white',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
                padding: '9px 20px',
                borderRadius: '10px',
                boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
              }}
            >
              Get Started →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '80px 24px 60px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '800px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '100px', padding: '6px 16px', marginBottom: '32px' }}>
            <Sparkles size={14} color="#818cf8" />
            <span style={{ color: '#818cf8', fontSize: '13px', fontWeight: 600 }}>AI-Powered Finance Management</span>
          </div>

          <h1 style={{ fontSize: 'clamp(40px, 8vw, 72px)', fontWeight: 900, color: 'white', lineHeight: 1.08, letterSpacing: '-0.04em', marginBottom: '24px' }}>
            Take Control of<br />
            <span style={{ background: 'linear-gradient(135deg, #818cf8, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Your Finances
            </span>
          </h1>
          <p style={{ fontSize: '18px', color: '#64748b', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto 40px' }}>
            TrackIt is the modern expense tracker built for clarity. Understand your spending, set budgets, and plan smarter — all in one place.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'linear-gradient(135deg, #6366f1, #818cf8)',
              color: 'white', fontWeight: 700, textDecoration: 'none',
              padding: '14px 28px', borderRadius: '12px',
              boxShadow: '0 6px 24px rgba(99,102,241,0.45)',
              fontSize: '15px'
            }}>
              Start for Free <ArrowRight size={17} />
            </Link>
            <Link to="/login" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#cbd5e1', fontWeight: 600, textDecoration: 'none',
              padding: '14px 28px', borderRadius: '12px',
              fontSize: '15px',
              backdropFilter: 'blur(8px)'
            }}>
              Sign In
            </Link>
          </div>

          {/* Trust stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginTop: '64px', paddingTop: '48px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {[
              { val: '100%', label: 'Free & Secure' },
              { val: 'Real-time', label: 'Analytics & Reports' },
              { val: 'AI', label: 'Receipt Scanning' },
            ].map(({ val, label }) => (
              <div key={label}>
                <p style={{ fontSize: '24px', fontWeight: 800, color: 'white', marginBottom: '4px' }}>{val}</p>
                <p style={{ fontSize: '13px', color: '#64748b' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Features */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p style={{ color: '#6366f1', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Features</p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>Everything you need</h2>
          <p style={{ color: '#64748b', marginTop: '12px', fontSize: '16px' }}>A complete toolkit for financial clarity</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {features.map(({ icon: Icon, title, desc, color }) => {
            const c = colorMap[color];
            return (
              <div key={title} style={{
                background: 'rgba(17, 24, 39, 0.8)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '16px',
                padding: '24px',
                backdropFilter: 'blur(8px)',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.boxShadow = `0 4px 24px ${c.bg}`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: c.bg, border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Icon size={20} color={c.text} />
                </div>
                <h3 style={{ fontWeight: 700, color: 'white', marginBottom: '8px', fontSize: '15px' }}>{title}</h3>
                <p style={{ color: '#64748b', fontSize: '13px', lineHeight: 1.6 }}>{desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why section */}
      <section style={{ background: 'rgba(17,24,39,0.4)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '80px 24px', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'white', textAlign: 'center', marginBottom: '40px', letterSpacing: '-0.03em' }}>Why TrackIt?</h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            {[
              'Beautiful, intuitive interface designed for everyone',
              'Real-time expense tracking across all categories',
              'AI-powered receipt scanning — just snap & save',
              'Smart AI financial advisor in your pocket',
              'Set monthly budgets with visual progress tracking',
              'Export your data as CSV or PDF anytime',
            ].map((item, idx) => (
              <div key={idx} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '14px 18px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px'
              }}>
                <CheckCircle size={18} color="#10b981" strokeWidth={2.5} />
                <span style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 500 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{
          maxWidth: '600px', margin: '0 auto',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(16,185,129,0.06))',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '24px', padding: '56px 40px'
        }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'white', marginBottom: '12px', letterSpacing: '-0.03em' }}>Ready to get started?</h2>
          <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '15px' }}>
            Join thousands managing their finances smarter with TrackIt.
          </p>
          <Link to="/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'linear-gradient(135deg, #6366f1, #818cf8)',
            color: 'white', fontWeight: 700, textDecoration: 'none',
            padding: '14px 32px', borderRadius: '12px',
            boxShadow: '0 6px 24px rgba(99,102,241,0.45)',
            fontSize: '15px'
          }}>
            Create Free Account <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '24px', textAlign: 'center', color: '#334155', fontSize: '13px' }}>
        © 2025 TrackIt. All rights reserved. Your financial data, your privacy.
      </footer>
    </div>
  );
};

export default Landing;
