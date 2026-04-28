import React, { useState } from 'react';
import { Header } from './components/Header';
import { AnalysisForm } from './components/AnalysisForm';
import { ResultView } from './components/ResultView';
import { HistoryView } from './components/HistoryView';
import { analyzeWebsite, analyzeContract } from './services/gemini';
import { AnalysisResult } from './types';
import { useHistory } from './hooks/useHistory';
import { Shield, Lock, Zap, MousePointer2 } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [activeView, setActiveView] = useState<'dashboard' | 'history' | 'about'>('dashboard');
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { history, addToHistory, getAnalysis, clearHistory } = useHistory();

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlParam = params.get('url');
    if (urlParam) {
      handleAnalyze({ type: 'website', value: urlParam });
      // Clear the URL parameter without refreshing
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleAnalyze = async (data: { type: 'website' | 'contract', value: string, fileName?: string }) => {
    setIsLoading(true);
    setCurrentResult(null);
    try {
      let result: AnalysisResult;
      if (data.type === 'website') {
        result = await analyzeWebsite(data.value);
      } else {
        result = await analyzeContract(data.value, data.fileName);
      }
      setCurrentResult(result);
      addToHistory(result);
    } catch (error) {
      console.error(error);
      alert("Analysis failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistoryItem = (id: string) => {
    const analysis = getAnalysis(id);
    if (analysis) {
      setCurrentResult(analysis);
      setActiveView('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#050B10] text-white relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-blue/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-blue/10 blur-[120px] rounded-full pointer-events-none"></div>

      <Header onNavigate={setActiveView} activeView={activeView} />
      
      <main className="relative z-10 mx-auto max-w-7xl px-4 pt-48 pb-12 sm:px-6 lg:px-8">
        {activeView === 'dashboard' && (
          <div className="space-y-24">
            {!currentResult && (
              <div className="text-left max-w-4xl space-y-8">
                <div className="space-y-2">
                  <h1 className="text-7xl md:text-8xl font-extrabold tracking-tight leading-[0.9]">
                    Understand what <br />
                    <span className="text-accent-blue relative">
                      you’re agreeing to.
                    </span>
                  </h1>
                </div>
                <p className="text-xl md:text-2xl text-white/60 leading-relaxed max-w-2xl font-medium">
                  Analyze Terms and Conditions, Privacy Policies, and Contracts instantly with advanced AI.
                </p>
                
                <div className="pt-4">
                  <button 
                    onClick={() => {
                        const el = document.getElementById('analyzer-form');
                        el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="rounded-xl bg-mint px-5 py-2.5 text-lg font-extrabold text-[#050B10] transition-all hover:scale-105 active:scale-95"
                  >
                    Start Analyzing
                  </button>
                </div>
              </div>
            )}

            {!currentResult && (
              <div id="analyzer-form" className="pt-24 scroll-mt-32">
                <AnalysisForm onAnalyze={handleAnalyze} isLoading={isLoading} />
              </div>
            )}
            
            {currentResult && (
              <div className="space-y-8">
                <button 
                  onClick={() => setCurrentResult(null)}
                  className="text-sm font-bold uppercase tracking-widest text-[#999999] hover:text-black transition-colors flex items-center gap-2"
                >
                  ← Back to analyzer
                </button>
                <ResultView result={currentResult} />
              </div>
            )}

            {!currentResult && <Features />}
          </div>
        )}

        {activeView === 'history' && (
          <HistoryView 
            items={history} 
            onSelectItem={handleSelectHistoryItem}
            onClear={clearHistory}
          />
        )}

        {activeView === 'about' && <About />}
      </main>

      <footer className="border-t border-white/10 bg-[#050B10] py-12 mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-white/20 text-sm font-medium">
          <p>© 2026 Clause<span className="text-mint font-bold">Lens</span>. Built with Google Gemini Intelligence.</p>
        </div>
      </footer>
    </div>
  );
}

function Features() {
  const features = [
    {
      title: "Extremely Fast",
      desc: "Get a comprehensive risk assessment in under 10 seconds.",
      icon: <Zap className="h-6 w-6" />,
      color: "text-accent-blue",
      bg: "bg-accent-blue/10"
    },
    {
      title: "Google Grounded",
      desc: "Uses real-time search data to verify current policy versions.",
      icon: <Shield className="h-6 w-6" />,
      color: "text-white",
      bg: "bg-white/10"
    },
    {
      title: "Privacy First",
      desc: "Your data is analyzed locally and never stored on third-party servers.",
      icon: <Lock className="h-6 w-6" />,
      color: "text-risk-low",
      bg: "bg-risk-low/10"
    },
    {
      title: "Chrome Extension",
      desc: "Analyze any site directly from your browser without leaving the tab.",
      icon: <MousePointer2 className="h-6 w-6" />,
      color: "text-mint",
      bg: "bg-mint/10"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-12">
      {features.map((f, i) => (
        <div key={i} className="group p-10 bg-[#0B1219] rounded-[40px] border border-white/10 space-y-6 transition-all hover:bg-[#121923] hover:-translate-y-2">
          <div className={cn("inline-flex p-4 rounded-2xl transition-transform group-hover:scale-110", f.bg, f.color)}>
            {f.icon}
          </div>
          <h3 className="text-2xl font-bold tracking-tight">{f.title}</h3>
          <p className="text-white/40 leading-relaxed font-medium">{f.desc}</p>
        </div>
      ))}
    </div>
  );
}

function About() {
  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">About Clause<span className="text-mint">Lens</span></h1>
        <p className="text-xl text-white/40 leading-relaxed italic">
          "Most people don't read the terms. We think they should know what's in them."
        </p>
        <p className="text-lg text-white/60 leading-relaxed font-medium">
          ClauseLens was born out of a simple frustration: the sheer length and complexity of modern legal documents. Whether it's a social media update or a business contract, we aim to provide immediate clarity so you can make informed decisions.
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold tracking-tight">How it works</h2>
        <div className="grid gap-6">
          <div className="p-8 bg-[#0B1219] rounded-[32px] border border-white/10 flex gap-6 items-start">
             <div className="h-10 w-10 flex items-center justify-center rounded-full bg-mint text-[#050B10] font-bold shrink-0">1</div>
             <div>
               <h3 className="text-xl font-bold mb-2">Input URL or Text</h3>
               <p className="text-white/40 font-medium">Give us the source document or a link to the policy page.</p>
             </div>
          </div>
          <div className="p-8 bg-[#0B1219] rounded-[32px] border border-white/10 flex gap-6 items-start">
             <div className="h-10 w-10 flex items-center justify-center rounded-full bg-mint text-[#050B10] font-bold shrink-0">2</div>
             <div>
               <h3 className="text-xl font-bold mb-2">AI Analysis</h3>
               <p className="text-white/40 font-medium">Gemini 3.1 Pro analyzes every clause, looking for invasive permissions, data sharing, or hidden fees.</p>
             </div>
          </div>
          <div className="p-8 bg-[#0B1219] rounded-[32px] border border-white/10 flex gap-6 items-start">
             <div className="h-10 w-10 flex items-center justify-center rounded-full bg-mint text-[#050B10] font-bold shrink-0">3</div>
             <div>
               <h3 className="text-xl font-bold mb-2">Instant Insight</h3>
               <p className="text-white/40 font-medium">View your risk score and a human-readable summary, translated into your preferred language.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
