import React from 'react';

export default function Landing({ onLaunch, onOpenLogin }) {
  return (
    <section id="landing-page" className="min-h-screen flex flex-col justify-center items-center text-center pt-24 px-4 pb-12">
      <div className="max-w-6xl mx-auto animate-enter">
        <div className="inline-block bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 py-1.5 text-white text-sm font-medium mb-6">✨ Empowering Rural India with AI</div>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">Financial Freedom <br/> in <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-yellow-300">Your Language</span></h1>
        <p className="text-lg md:text-2xl text-slate-100 mb-10 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md">Break the barrier. Master your finances. <br/> Instant translation, AI advice, and Expense Tracking.</p>

        <div className="flex flex-wrap justify-center gap-5 mb-20">
          <button onClick={() => onLaunch('translator')} className="bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-slate-50 transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3"><i className="fas fa-rocket"></i> Launch App</button>
          <button onClick={onOpenLogin} className="bg-white/10 backdrop-blur-md border border-white/40 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-white/20 transform hover:-translate-y-1 transition-all duration-300">User Login</button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          <div className="glass-panel p-6 rounded-3xl hover:bg-white/90 transition duration-300 cursor-pointer group" onClick={() => onLaunch('translator')}>
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300"><i className="fas fa-language text-xl text-green-600"></i></div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Voice Translator</h3>
            <p className="text-slate-600 text-sm">Instant translations for banking terms in your dialect.</p>
          </div>

          <div className="glass-panel p-6 rounded-3xl hover:bg-white/90 transition duration-300 cursor-pointer group" onClick={() => onLaunch('chatbot')}>
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300"><i className="fas fa-robot text-xl text-blue-600"></i></div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Sahayak Bot</h3>
            <p className="text-slate-600 text-sm">24/7 AI financial assistant for loans and schemes.</p>
          </div>

          <div className="glass-panel p-6 rounded-3xl hover:bg-white/90 transition duration-300 cursor-pointer group" onClick={() => onLaunch('blog')}>
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300"><i className="fas fa-book-reader text-xl text-purple-600"></i></div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Literacy Blog</h3>
            <p className="text-slate-600 text-sm">Learn money management with simple guides.</p>
          </div>

          <div className="glass-panel p-6 rounded-3xl hover:bg-white/90 transition duration-300 cursor-pointer group" onClick={() => onLaunch('ledger')}>
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition duration-300"><i className="fas fa-calculator text-xl text-orange-600"></i></div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Expense Ledger</h3>
            <p className="text-slate-600 text-sm">Track your daily farming expenses and savings easily.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
