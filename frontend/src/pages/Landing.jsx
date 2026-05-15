import { Link } from 'react-router-dom';
import { Zap, TrendingUp, PieChart, Shield, ArrowRight, CheckCircle } from 'lucide-react';

const Landing = () => {
  const features = [
    { icon: TrendingUp, title: 'Track Transactions', desc: 'Log income and expenses with categories' },
    { icon: PieChart, title: 'Analytics', desc: 'Visualize spending patterns' },
    { icon: Shield, title: 'Budget Control', desc: 'Set limits and monitor spending' },
    { icon: Zap, title: 'Export Data', desc: 'Download reports in CSV or PDF' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      {/* Header */}
      <header className="px-6 md:px-8 py-6 w-full border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg">
              <Zap size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">TrackIt</h1>
          </div>
          <div className="flex gap-4">
            <Link to="/login" className="px-6 py-2.5 font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition">
              Sign In
            </Link>
            <Link to="/register" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg shadow-blue-500/30 transition">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="max-w-4xl space-y-8">
          {/* Heading */}
          <div className="space-y-4">
            <div className="inline-block">
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
                💰 Smart Money Management
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Take Control of Your <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">Finances</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              TrackIt is a modern expense tracker that helps you understand your spending habits, set budgets, and achieve your financial goals with ease.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
            <Link to="/register" className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:shadow-lg hover:shadow-blue-500/40 text-white font-semibold rounded-lg transition duration-200">
              Start Free Now <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition">
              View Demo <Zap size={20} />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-12 border-t border-slate-200 dark:border-slate-800">
            <div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">100%</p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Free & Secure</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">Real-time</p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Analytics & Reports</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">Instant</p>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Setup in Seconds</p>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="px-6 md:px-8 py-20 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Powerful Features</h3>
            <p className="text-slate-600 dark:text-slate-400">Everything you need to manage your finances</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition">
                  <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Icon size={24} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="px-6 md:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-4xl font-bold text-slate-900 dark:text-white text-center mb-12">Why Choose TrackIt?</h3>
          
          <div className="space-y-4">
            {[
              'Intuitive interface designed for everyone',
              'Real-time expense tracking and analytics',
              'Beautiful charts and visualizations',
              'Export your data anytime',
              'Works on all devices',
              'Your data is always secure'
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <CheckCircle size={24} className="text-emerald-500 flex-shrink-0" />
                <span className="text-slate-900 dark:text-white font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-6 md:px-8 py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to take control?</h3>
          <p className="text-blue-100 mb-8">Join thousands of users who are already managing their finances smarter.</p>
          <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:shadow-lg transition">
            Create Account Free <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-8 py-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-600 dark:text-slate-400">
        <p>© 2024 TrackIt. All rights reserved. Your financial data, your privacy.</p>
      </footer>
    </div>
  );
};

export default Landing;
