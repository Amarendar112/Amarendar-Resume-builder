import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ResumeScoreAnalyzer({ user, onBack, credits, useCredit }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [file, setFile] = useState(null);

  const startAnalysis = () => {
    if (credits <= 0) return alert("Out of tokens!");
    setAnalyzing(true);
    setResult(null);
    
    // Mock high-end analysis sequence
    setTimeout(() => {
      useCredit();
      setResult({
        score: 84,
        metrics: [
          { label: "ATS Compatibility", value: 92, status: "excellent" },
          { label: "Keyword Density", value: 78, status: "good" },
          { label: "Impact Verbs", value: 65, status: "needs-improvement" },
          { label: "Quantified Wins", value: 42, status: "critical" },
        ],
        feedback: [
          "Include 4+ technical keywords missing from current draft.",
          "Add measurable metrics (%, $, #) to 3 more bullet points.",
          "Shorten your bullet points to under 25 words each.",
          "Improve readability by removing legacy formatting elements."
        ],
        jobMatch: "Backend Developer at Stripe"
      });
      setAnalyzing(false);
    }, 3000);
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) setFile(f);
  };

  return (
    <div className="flex bg-[#05070a] min-h-screen text-white font-inter">
      <main className="flex-1 p-12 overflow-y-auto">
        <header className="flex items-center justify-between mb-16">
           <div className="flex items-center gap-6">
              <button onClick={onBack} className="p-3 rounded-2xl hover:bg-white/5 transition-colors text-slate-400">←</button>
              <div>
                 <h1 className="text-4xl font-black italic">AI Score <span className="text-indigo-500">Analyzer.</span></h1>
                 <p className="text-sm text-slate-500">How does your resume rank against the world's best companies?</p>
              </div>
           </div>
           
           <div className="token-counter px-6 py-3">
              <span className="text-indigo-400 font-bold">✨</span>
              <span className="text-sm font-black tracking-widest">{credits} TOKENS LEFT</span>
           </div>
        </header>

        <div className="max-w-4xl mx-auto">
           {!result && !analyzing ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-[48px] p-20 text-center border-white/5 relative overflow-hidden"
              >
                 <div className="relative z-10">
                    <div className="w-24 h-24 bg-indigo-600/10 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-10 shadow-2xl shadow-indigo-500/10">📈</div>
                    <h2 className="text-4xl font-black mb-6">Drop your resume here.</h2>
                    <p className="text-slate-400 mb-12 max-w-md mx-auto leading-relaxed">Our AI will perform a deep-scan to search for ATS bottlenecks, keyword gaps, and impact metrics.</p>
                    
                    <label className="btn-premium btn-primary px-12 py-5 text-lg font-black cursor-pointer inline-flex items-center gap-4">
                       {file ? `📄 ${file.name}` : "SELECT RESUME FILE"}
                       <input type="file" onChange={handleFile} className="hidden" accept=".pdf,.doc,.docx" />
                    </label>

                    {file && (
                      <motion.button 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={startAnalysis}
                        className="block mt-6 mx-auto text-indigo-400 font-black tracking-widest text-xs hover:text-indigo-300"
                      >
                         START AI DEEP-SCAN (1 TOKEN) →
                      </motion.button>
                    )}
                 </div>
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(99,102,241,0.05),transparent_70%)]" />
              </motion.div>
           ) : analyzing ? (
              <div className="text-center py-40">
                 <div className="relative w-24 h-24 mx-auto mb-12">
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-600/20" />
                    <motion.div 
                      className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                 </div>
                 <h2 className="text-2xl font-black tracking-widest uppercase mb-4 animate-pulse">Running Neural Analytics...</h2>
                 <p className="text-slate-500 italic max-w-xs mx-auto">Scoring against 1,200+ FAANG hiring patterns.</p>
              </div>
           ) : (
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="space-y-10"
             >
                <div className="grid grid-cols-3 gap-10">
                   <div className="col-span-1 glass rounded-[40px] p-10 flex flex-col items-center justify-center text-center">
                       <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-4">Master Score</span>
                       <div className="text-8xl font-black mb-2">{result.score}</div>
                       <div className="text-xs text-slate-500 font-bold bg-white/5 py-1 px-4 rounded-full">TOP 12% TARGETING</div>
                   </div>

                   <div className="col-span-2 glass rounded-[40px] p-10 space-y-6">
                      {result.metrics.map((m, i) => (
                        <div key={i} className="space-y-2">
                           <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                              <span className="text-slate-400">{m.label}</span>
                              <span className={m.value > 80 ? 'text-green-400' : 'text-indigo-400'}>{m.value}%</span>
                           </div>
                           <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${m.value}%` }}
                                transition={{ duration: 1, delay: i * 0.1 }}
                                className={`h-full ${m.value > 80 ? 'bg-green-500' : 'bg-indigo-600 shadow-[0_0_10px_rgba(99,102,241,0.5)]'}`}
                              />
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="glass rounded-[40px] p-12 border-white/5 bg-white/5">
                   <h3 className="text-2xl font-black mb-8 italic">AI Critical Interventions</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {result.feedback.map((f, i) => (
                        <div key={i} className="flex gap-4 items-start p-6 rounded-2xl bg-black/40 border border-white/5">
                           <span className="text-indigo-500 font-black">!</span>
                           <p className="text-sm text-slate-300 leading-relaxed">{f}</p>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="text-center pt-10">
                   <button onClick={() => setResult(null)} className="btn-premium btn-glass px-10 py-4 uppercase tracking-[0.2em] font-black text-[10px]">Analyze New Document</button>
                </div>
             </motion.div>
           )}
        </div>
      </main>

      {/* --- Infinite Mirror Glow Backgrounds --- */}
      <div className="fixed inset-0 pointer-events-none -z-10">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full" />
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full" />
      </div>
    </div>
  );
}
