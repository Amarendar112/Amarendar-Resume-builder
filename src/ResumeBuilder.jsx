import { useState, useRef, useEffect } from "react";
import { SAMPLE, EMPTY, TEMPLATES, STEPS } from "./constants";
import { ResumeDoc } from "./TemplateDoc";
import { motion, AnimatePresence } from "framer-motion";
import logoImg from "./assets/skillsiniq-logo.svg";
// --- Premium UI Components (v2) ---

const Spinner = ({ size = 16, color = "currentColor" }) => (
  <motion.span 
    animate={{ rotate: 360 }}
    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
    style={{ 
      display: "inline-block", 
      width: size, 
      height: size, 
      border: `2px solid ${color}`, 
      borderTop: "2px solid transparent", 
      borderRadius: "50%" 
    }} 
  />
);

const PremiumInput = ({ label, value, onChange, placeholder, type = "text", full = false, rows = 1, icon }) => (
  <div className={`flex flex-col gap-2 mb-6 ${full ? 'col-span-2' : ''}`}>
    <div className="flex items-center justify-between">
      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{label}</label>
      {icon && <span className="text-slate-600">{icon}</span>}
    </div>
    {rows > 1 ? (
      <textarea 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        placeholder={placeholder} 
        rows={rows}
        className="input-premium min-h-[120px] resize-none"
      />
    ) : (
      <input 
        type={type} 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        placeholder={placeholder}
        className="input-premium"
      />
    )}
  </div>
);

const PremiumSectionHeader = ({ title, desc, aiAction, aiLoading, aiLabel }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
    <div className="max-w-xl">
      <h2 className="text-3xl font-black mb-2">{title}</h2>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
    {aiAction && (
      <button 
        onClick={aiAction} 
        disabled={aiLoading} 
        className="btn-premium btn-glass group"
      >
        {aiLoading ? <Spinner size={14} color="#6366f1" /> : <span className="group-hover:scale-125 transition-transform">✨</span>}
        <span className="font-bold">{aiLabel || "AI Suggest"}</span>
      </button>
    )}
  </div>
);

const StepIndicator = ({ currentStep, setStep, isLight }) => (
  <div className={`flex items-center gap-2 mb-12 p-2 rounded-2xl border backdrop-blur-md sticky top-24 z-30 ${isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-white/5 border-white/5'}`}>
    {STEPS.map((st, i) => {
      const isActive = currentStep === i;
      const isPast = currentStep > i;
      return (
        <button 
          key={st} 
          onClick={() => setStep(i)} 
          className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all flex-1 min-w-0 ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
        >
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border ${isActive ? 'bg-white text-indigo-600 border-white' : isPast ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-transparent border-slate-700'}`}>
            {isPast ? "✓" : i + 1}
          </div>
          <span className={`text-[11px] font-black uppercase tracking-widest truncate hidden lg:block ${isActive ? '' : isLight ? 'text-slate-500' : 'text-slate-400'}`}>{st}</span>
          {isActive && (
            <motion.div 
               layoutId="step-glow"
               className="absolute inset-0 rounded-xl bg-white/10 blur-[10px] -z-10"
            />
          )}
        </button>
      );
    })}
  </div>
);

export default function ResumeBuilder({ user, onBack, credits, useCredit }) {
  const [step, setStep] = useState(0);
  const [tid, setTid] = useState("minimal");
  const [data, setData] = useState(JSON.parse(JSON.stringify(EMPTY)));
  const [loading, setLoading] = useState(false);
  const [aiField, setAiField] = useState(null);
  const [aiLog, setAiLog] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [showJD, setShowJD] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [atsResult, setAtsResult] = useState(null);
  const resumeRef = useRef();

  const tidToGlow = {
    minimal: "indigo",
    executive: "blue",
    emerald: "green",
    bold: "purple",
    slate: "slate",
    crimson: "red",
    darksidebar: "slate",
    classic: "slate",
    photobanner: "slate",
  };

  const accentColor = tidToGlow[tid] || "indigo";

  // Data helpers
  const sv = (k, v) => setData(d => ({ ...d, [k]: v }));
  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => sv("photo", reader.result);
    reader.readAsDataURL(file);
  };
  const setExp = (i, k, v) => setData(d => { const e = [...d.experience]; e[i] = { ...e[i], [k]: v }; return { ...d, experience: e }; });
  const setEB = (i, j, v) => setData(d => { const e = [...d.experience]; const b = [...e[i].bullets]; b[j] = v; e[i] = { ...e[i], bullets: b }; return { ...d, experience: e }; });
  const addExp = () => setData(d => ({ ...d, experience: [...d.experience, { company: "", role: "", start: "", end: "", current: false, bullets: ["", "", ""] }] }));
  const remExp = i => setData(d => ({ ...d, experience: d.experience.filter((_, idx) => idx !== i) }));
  const addEB = i => setData(d => { const e = [...d.experience]; e[i] = { ...e[i], bullets: [...e[i].bullets, ""] }; return { ...d, experience: e }; });
  const remEB = (i, j) => setData(d => { const e = [...d.experience]; e[i] = { ...e[i], bullets: e[i].bullets.filter((_, k) => k !== j) }; return { ...d, experience: e }; });
  const setEdu = (i, k, v) => setData(d => { const e = [...d.education]; e[i] = { ...e[i], [k]: v }; return { ...d, education: e }; });
  const addEdu = () => setData(d => ({ ...d, education: [...d.education, { school: "", degree: "", field: "", year: "", gpa: "" }] }));
  const remEdu = i => setData(d => ({ ...d, education: d.education.filter((_, idx) => idx !== i) }));
  
  // AI Logice
  const ai = async (prompt, max = 700) => {
    if (credits <= 0) { setAiLog("⚠ Out of AI Credits"); throw new Error("No credits left"); }
    const res = await fetch("/api/generate", {
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "gpt-4o", max_tokens: max, messages: [{ role: "user", content: prompt }] })
    });
    const j = await res.json();
    if (j.error) { setAiLog(`⚠ ${j.error}`); throw new Error(j.error); }
    useCredit();
    return j.choices?.[0]?.message?.content?.trim() || "";
  };

  const parseBullets = t => t.split("\n").filter(b => b.trim()).map(b => b.replace(/^[-•*›▸\d.):\s]+/, "").trim()).filter(b => b.length > 4);

  const aiSummary = async () => {
    setLoading(true); setAiField("summary"); setAiLog("Writing summary…");
    try {
      const jd = jobDesc.trim().length > 50 ? `\nTarget job:\n${jobDesc.slice(0, 400)}` : "";
      const t = await ai(`Write a 3-4 sentence professional resume summary.\nName: ${data.name || "candidate"} | Title: ${data.title || "professional"}\nExperience: ${data.experience.filter(e => e.company).map(e => `${e.role} at ${e.company}`).join("; ") || "not specified"}\nSkills: ${data.skills || "not listed"}${jd}\nRules: ATS-optimized, include 5+ keywords, mention measurable impact.`, 350);
      sv("summary", t); setAiLog("✓ Summary written");
    } catch (e) { setAiLog("Error: " + e.message); }
    setLoading(false); setAiField(null);
  };

  const aiBullets = async (i) => {
    setLoading(true); setAiField("b" + i); setAiLog("Enhancing bullets…");
    try {
      const exp = data.experience[i];
      const jd = jobDesc.trim().length > 50 ? `\nJob context:\n${jobDesc.slice(0, 300)}` : "";
      const t = await ai(`Rewrite these resume bullets to be strong and ATS-optimized.\nRole: ${exp.role || "role"} at ${exp.company || "company"}\nCurrent: ${exp.bullets.filter(b => b.trim()).join(" | ") || "none"}${jd}\nOutput exactly 3 bullets, one per line, no prefix symbols.`, 280);
      const bullets = parseBullets(t).slice(0, 4);
      if (bullets.length) setData(d => { const e = [...d.experience]; e[i] = { ...e[i], bullets }; return { ...d, experience: e }; });
      setAiLog("✓ Bullets enhanced");
    } catch (e) { setAiLog("Error: " + e.message); }
    setLoading(false); setAiField(null);
  };

  const aiSkills = async () => {
    setLoading(true); setAiField("skills"); setAiLog("Suggesting skills…");
    try {
      const jd = jobDesc.trim().length > 50 ? `\nTarget job:\n${jobDesc.slice(0, 300)}` : "";
      const t = await ai(`Suggest 15-20 relevant professional skills. Output ONLY a comma-separated list.\nTitle: ${data.title || "professional"}${jd}`, 180);
      const newS = t.replace(/\n/g, ",").split(",").map(s => s.trim()).filter(s => s.length > 1);
      sv("skills", [...new Set([...(data.skills || "").split(",").map(s => s.trim()), ...newS])].filter(s => s).join(", "));
      setAiLog("✓ Skills added");
    } catch (e) { setAiLog("Error: " + e.message); }
    setLoading(false); setAiField(null);
  };

  const aiOptimize = async () => {
    setLoading(true); setAiField("optimize"); setAiLog("Full AI Overhaul in progress...");
    try {
        const jd = jobDesc.trim().length > 50 ? `\nTarget job:\n${jobDesc.slice(0, 400)}` : "";
        const s = await ai(`Write a perfect ATS summary.\nTitle: ${data.title} | Name: ${data.name}${jd}`, 350);
        sv("summary", s);
        for (let i = 0; i < data.experience.length; i++) {
            if (!data.experience[i].company) continue;
            setAiLog(`Optimizing ${data.experience[i].company}...`);
            const exp = data.experience[i];
            const t = await ai(`Maximize ATS for these bullets.\nRole: ${exp.role} at ${exp.company}${jd}`, 260);
            const bullets = parseBullets(t).slice(0, 4);
            if (bullets.length) setData(d => { const e = [...d.experience]; e[i] = { ...e[i], bullets }; return { ...d, experience: e }; });
        }
        setAiLog("Scoring...");
        const sc = await ai(`Score this resume for ATS. Respond ONLY with valid JSON:\n{"atsScore":<60-99>,"improvements":["fix1","fix2"],"strengthNote":"one positive sentence"}\nresume context: ${data.name}, ${data.title}${jd}`, 280);
        try { setAtsResult(JSON.parse(sc.replace(/```json|```/g, "").trim())); } catch (e) { setAtsResult({ atsScore: 88, improvements: ["Quantify impact in bullets"], strengthNote: "Strong profile!" }); }
        setAiLog("✓ Optimized!");
        setStep(5);
    } catch (e) {}
    setLoading(false); setAiField(null);
  };

  const downloadPDF = async () => {
    setDownloading(true);
    try {
      await new Promise((res, rej) => {
        if (window.html2pdf) { res(); return; }
        const sc = document.createElement("script");
        sc.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
        sc.onload = res; sc.onerror = rej; document.head.appendChild(sc);
      });
      await window.html2pdf().set({
        margin: [6, 6, 6, 6], filename: `${data.name || "resume"}_resume.pdf`,
        image: { type: "jpeg", quality: 0.99 }, html2canvas: { scale: 3, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
      }).from(resumeRef.current).save();
    } catch (e) { alert("Downloading failed. Please use Print as workaround."); }
    setDownloading(false);
  };

  return (
    <div className={`flex h-screen overflow-hidden font-inter ${step === 0 ? 'bg-[#f0f4f8]' : 'bg-[#05070a] text-white'}`}>
      {/* --- Main Workflow Editor --- */}
      <main className="flex-1 overflow-y-auto relative pb-32">
        {/* --- Sticky Header --- */}
        <header className={`fixed top-0 left-0 right-0 z-[100] h-20 backdrop-blur-xl flex items-center justify-between ${step === 0 ? 'bg-white/90 border-b border-slate-200' : 'bg-[#05070a]/80 border-b border-white/5'}`} style={{ right: step === 0 ? 0 : "450px", padding: "0 40px" }}>
            <div className="flex items-center gap-4">
                <button onClick={onBack} className={`p-2 rounded-xl transition-colors ${step === 0 ? 'hover:bg-slate-100 text-slate-600' : 'hover:bg-white/5 text-slate-400'}`}>←</button>
                <div style={{ width: 170, height: 46, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                    <img src={logoImg} alt="SkillSyniq Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'left center' }} />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="token-counter px-4 py-2">
                    <span className="text-indigo-400">✨</span>
                    <span className="text-xs font-black">{credits} TOKENS</span>
                </div>
                <button 
                  onClick={() => setShowJD(!showJD)}
                  className={`btn-premium ${showJD ? 'bg-indigo-600 text-white' : 'btn-glass'} px-6 py-2.5 text-xs font-black`}
                >
                  🎯 {showJD ? 'HIDE JD' : 'TAILOR TO JD'}
                </button>
            </div>
        </header>

        <div style={{ maxWidth: step === 0 ? 1100 : 860, margin: "0 auto", padding: "100px 40px 40px" }}>
          {/* --- Job Description Panel --- */}
          <AnimatePresence>
            {showJD && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-12"
              >
                <div className="glass rounded-3xl p-8 border-indigo-500/20 bg-indigo-500/5">
                   <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-black italic">Job Description Context</h3>
                      <button className="text-[10px] font-black text-indigo-400 tracking-widest uppercase hover:underline">Analysis Tools Coming Soon</button>
                   </div>
                   <textarea 
                    value={jobDesc}
                    onChange={e => setJobDesc(e.target.value)}
                    placeholder="Paste the job description here for AI tailoring..."
                    className="input-premium h-32 bg-indigo-500/5 border-indigo-500/20 focus:border-indigo-500 focus:bg-indigo-500/10 placeholder:text-indigo-900/50"
                   />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <StepIndicator currentStep={step} setStep={setStep} isLight={step === 0} />

          {/* --- Step Contents --- */}
          <motion.div 
            key={step}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {step === 0 && (
              <div>
                <style>{`
                  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                  .tg-wrap { background: #f8fafc; min-height: 100vh; }
                  .tg-card { position: relative; cursor: pointer; border-radius: 16px; overflow: hidden; background: #fff; box-shadow: 0 4px 20px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.06); transition: all 0.25s cubic-bezier(0.4,0,0.2,1); border: 2.5px solid transparent; }
                  .tg-card:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(0,0,0,0.16), 0 4px 12px rgba(0,0,0,0.08); }
                  .tg-card.sel { border-color: #4f46e5; box-shadow: 0 0 0 4px rgba(79,70,229,0.18), 0 12px 32px rgba(0,0,0,0.12); }
                  .tg-card .tg-hover { position: absolute; inset: 0; opacity: 0; transition: opacity 0.25s; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; }
                  .tg-card:hover .tg-hover, .tg-card.sel .tg-hover { opacity: 1; }
                  .tg-use-btn { background: #fff; color: #111; font-weight: 800; font-size: 12.5px; padding: 10px 24px; border-radius: 999px; border: none; cursor: pointer; box-shadow: 0 4px 16px rgba(0,0,0,0.18); transition: transform 0.15s; white-space: nowrap; letter-spacing: 0.01em; }
                  .tg-use-btn:hover { transform: scale(1.04); }
                  .tg-card-label { padding: 12px 14px 14px; background: #fff; border-top: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; }
                  .tg-card-name { font-size: 13px; font-weight: 700; color: #0f172a; }
                  .tg-card-desc { font-size: 11px; color: #94a3b8; margin-top: 1px; }
                  .tg-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
                  .tg-preview { overflow: hidden; position: relative; }
                `}</style>

                {/* Header */}
                <div style={{ marginBottom: 32, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                  <div>
                    <h2 style={{ fontFamily: "Inter,sans-serif", color: "#0f172a", fontSize: 28, fontWeight: 900, marginBottom: 6, letterSpacing: "-0.02em" }}>Choose your template</h2>
                    <p style={{ color: "#64748b", fontSize: 14, fontFamily: "Inter,sans-serif" }}>Pick a design that fits your style. You can switch anytime.</p>
                  </div>
                  <span style={{ background: "#4f46e5", color: "#fff", fontWeight: 700, fontSize: 12, padding: "5px 14px", borderRadius: 999, fontFamily: "Inter,sans-serif" }}>
                    {TEMPLATES.length} Templates
                  </span>
                </div>

                {/* Color accent filters */}
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 32, flexWrap: "wrap" }}>
                  {[
                    { label: "All", color: null, accent: "#4f46e5" },
                    { label: "Dark", color: "#1a1a1a" },
                    { label: "Navy", color: "#1e3a5f" },
                    { label: "Blue", color: "#3b82f6" },
                    { label: "Teal", color: "#14b8a6" },
                    { label: "Green", color: "#16a34a" },
                    { label: "Red", color: "#ef4444" },
                    { label: "Purple", color: "#8b5cf6" },
                    { label: "Gold", color: "#b7871a" },
                  ].map((c, i) => (
                    <button key={i} title={c.label} style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "6px 14px",
                      borderRadius: 999,
                      background: i === 0 ? "#4f46e5" : "#fff",
                      border: i === 0 ? "2px solid #4f46e5" : "2px solid #e2e8f0",
                      cursor: "pointer",
                      fontFamily: "Inter,sans-serif",
                      fontSize: 12, fontWeight: 700,
                      color: i === 0 ? "#fff" : "#475569",
                      transition: "all 0.15s",
                    }}>
                      {c.color && <span style={{ width: 10, height: 10, borderRadius: "50%", background: c.color, display: "inline-block" }} />}
                      {c.label}
                    </button>
                  ))}
                </div>

                {/* Template grid — 2 cols, larger scale for readable text */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 28 }}>
                  {TEMPLATES.map((t, idx) => {
                    const isSel = tid === t.id;
                    return (
                      <div key={t.id} className={`tg-card ${isSel ? "sel" : ""}`} onClick={() => setTid(t.id)}>
                        {/* Preview area — full A4 aspect ratio */}
                        <div className="tg-preview" style={{ aspectRatio: "210/297", width: "100%" }}>
                          <div style={{
                            position: "absolute", top: 0, left: 0,
                            width: 794,
                            transform: "scale(0.60)",
                            transformOrigin: "top left",
                            pointerEvents: "none",
                            userSelect: "none",
                          }}>
                            <ResumeDoc data={SAMPLE} tid={t.id} isSelection />
                          </div>

                          {/* Bottom fade to mask any blank space */}
                          <div style={{
                            position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
                            background: "linear-gradient(to top, rgba(255,255,255,0.97) 0%, transparent 100%)",
                            pointerEvents: "none", zIndex: 2,
                          }} />

                          {/* Hover overlay */}
                          <div className="tg-hover" style={{
                            background: `linear-gradient(135deg, ${t.uiAccent}ee 0%, ${t.uiAccent}88 100%)`,
                            zIndex: 3,
                          }}>
                            <button className="tg-use-btn" onClick={(e) => { e.stopPropagation(); setTid(t.id); setStep(1); }}>
                              Use This Template →
                            </button>
                            {isSel && (
                              <span style={{ background: "rgba(255,255,255,0.25)", color: "#fff", fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 999, letterSpacing: "0.06em" }}>
                                ✓ SELECTED
                              </span>
                            )}
                          </div>

                          {/* Popular badge */}
                          {idx < 5 && (
                            <div style={{
                              position: "absolute", top: 10, right: 10, zIndex: 4,
                              background: "#fff", color: t.uiAccent,
                              fontWeight: 800, fontSize: 9.5,
                              padding: "3px 9px", borderRadius: 999,
                              letterSpacing: "0.06em", textTransform: "uppercase",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                            }}>★ Popular</div>
                          )}
                        </div>

                        {/* Card label */}
                        <div className="tg-card-label">
                          <div>
                            <div className="tg-card-name">{t.name}</div>
                            <div className="tg-card-desc">{t.desc}</div>
                          </div>
                          <span className="tg-dot" style={{ background: t.uiAccent }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}


            {step === 1 && (
              <div>
                <PremiumSectionHeader title="Profile Basics." desc="Enter your core contact information. Your first impression starts here." />
                
                <div className="glass rounded-[40px] p-10 border-white/5 mb-8 flex items-center gap-10">
                   <div className="relative group">
                      <div className="w-24 h-24 rounded-[32px] bg-slate-900 border border-white/10 flex items-center justify-center text-3xl overflow-hidden shadow-2xl relative z-10">
                         {data.photo ? <img src={data.photo} className="w-full h-full object-cover" /> : "👤"}
                         <input type="file" onChange={handlePhoto} className="absolute inset-0 opacity-0 cursor-pointer" />
                         <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] font-black uppercase transition-opacity">Change</div>
                      </div>
                      <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full -z-0 group-hover:bg-indigo-500/40 transition-all" />
                   </div>
                   <div>
                      <h4 className="text-xl font-black mb-1">Brand Identity</h4>
                      <p className="text-sm text-slate-500 mb-4">Professional headshots increase response rates by 40%.</p>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-10 h-5 rounded-full transition-all relative ${data.showPhoto ? 'bg-indigo-600' : 'bg-slate-800'}`}>
                           <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${data.showPhoto ? 'left-6' : 'left-1'}`} />
                        </div>
                        <input type="checkbox" checked={data.showPhoto} onChange={e => sv("showPhoto", e.target.checked)} className="hidden" />
                        <span className="text-xs font-bold text-slate-400 group-hover:text-white">Show on resume</span>
                      </label>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-x-8">
                  <PremiumInput label="Full Name" value={data.name} onChange={v => sv("name", v)} placeholder="John Doe" full />
                  <PremiumInput label="Current Title" value={data.title} onChange={v => sv("title", v)} placeholder="Senior Software Engineer" full />
                  <PremiumInput label="Email" value={data.email} onChange={v => sv("email", v)} placeholder="john@example.com" />
                  <PremiumInput label="Phone" value={data.phone} onChange={v => sv("phone", v)} placeholder="+1 (555) 000-0000" />
                  <PremiumInput label="Location" value={data.location} onChange={v => sv("location", v)} placeholder="San Francisco, CA" />
                  <PremiumInput label="LinkedIn" value={data.linkedin} onChange={v => sv("linkedin", v)} placeholder="linkedin.com/in/johndoe" />
                  <PremiumInput label="Personal Site" value={data.website} onChange={v => sv("website", v)} placeholder="johndoe.dev" full />
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <PremiumSectionHeader title="Expertise." desc="List your work history and project success stories. AI can help optimize your impact." />
                
                {data.experience.map((exp, i) => (
                  <motion.div 
                    key={i} 
                    layout
                    className="glass rounded-[40px] p-10 border-white/5 mb-10 group"
                  >
                    <div className="flex items-center justify-between mb-8">
                       <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">XP BLOCK #{i+1}</span>
                       <div className="flex gap-4">
                          <button onClick={() => aiBullets(i)} className="text-[10px] font-black text-indigo-400 tracking-widest hover:text-indigo-300">✨ AI OPTIMIZE</button>
                          {data.experience.length > 1 && (
                            <button onClick={() => remExp(i)} className="text-[10px] font-black text-red-500/50 hover:text-red-500 tracking-widest">REMOVE</button>
                          )}
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-8">
                       <PremiumInput label="Organization" value={exp.company} onChange={v => setExp(i, "company", v)} placeholder="Tech Corp" full />
                       <PremiumInput label="Last Position" value={exp.role} onChange={v => setExp(i, "role", v)} placeholder="Lead Frontend" full />
                       <PremiumInput label="Start" value={exp.start} onChange={v => setExp(i, "start", v)} placeholder="Jan 2022" />
                       <PremiumInput label="End" value={exp.end} onChange={v => setExp(i, "end", v)} placeholder="Current" />
                    </div>

                    <div className="mt-8">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4 block">Measurable achievements</label>
                        {exp.bullets.map((b, j) => (
                          <div key={j} className="flex gap-4 mb-4 items-center group/item">
                             <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full group-hover/item:scale-150 transition-transform" />
                             <input 
                               value={b} 
                               onChange={e => setEB(i, j, e.target.value)} 
                               placeholder="I increased pipeline efficiency by 22% using..."
                               className="flex-1 bg-transparent border-none focus:outline-none text-sm text-slate-300 placeholder:text-slate-700 font-medium"
                             />
                             <button onClick={() => remEB(i, j)} className="opacity-0 group-hover/item:opacity-100 p-2 text-slate-600 hover:text-white">✕</button>
                          </div>
                        ))}
                        <button onClick={() => addEB(i)} className="text-[10px] font-black text-indigo-500 tracking-widest mt-4">+ ADD ACHIEVEMENT</button>
                    </div>
                  </motion.div>
                ))}
                <button onClick={addExp} className="w-full py-10 rounded-[40px] border-2 border-dashed border-white/5 text-slate-500 font-black tracking-widest text-xs hover:border-white/10 hover:text-slate-400 transition-all">
                  + ADD WORK EXPERIENCE
                </button>
              </div>
            )}

            {step === 3 && (
               <div>
                 <PremiumSectionHeader title="Education." desc="List your formal training and certifications. Keep it high-level but impactful." />
                 {data.education.map((edu, i) => (
                    <motion.div key={i} layout className="glass rounded-[40px] p-10 border-white/5 mb-10">
                       <div className="flex items-center justify-between mb-8">
                          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">ACADEMIC BLOCK #{i+1}</span>
                          {data.education.length > 1 && (
                            <button onClick={() => remEdu(i)} className="text-[10px] font-black text-red-500/50 hover:text-red-500 tracking-widest">REMOVE</button>
                          )}
                       </div>
                       <div className="grid grid-cols-2 gap-x-8">
                          <PremiumInput label="Institution" value={edu.school} onChange={v => setEdu(i, "school", v)} placeholder="Harvard University" full />
                          <PremiumInput label="Major / Degree" value={edu.degree} onChange={v => setEdu(i, "degree", v)} placeholder="Master of Computer Science" full />
                          <PremiumInput label="Year" value={edu.year} onChange={v => setEdu(i, "year", v)} placeholder="2024" />
                          <PremiumInput label="GPA / Honors" value={edu.gpa} onChange={v => setEdu(i, "gpa", v)} placeholder="3.9 / 4.0 (Dean's List)" />
                       </div>
                    </motion.div>
                 ))}
                 <button onClick={addEdu} className="w-full py-10 rounded-[40px] border-2 border-dashed border-white/5 text-slate-500 font-black tracking-widest text-xs hover:border-white/10 hover:text-slate-400 transition-all">
                  + ADD EDUCATION HISTORY
                 </button>
               </div>
            )}

            {step === 4 && (
              <div>
                <PremiumSectionHeader 
                  title="Final Polish." 
                  desc="A summary is your elevator pitch. Skills are your raw tools. Let AI write the perfect pitch." 
                  aiAction={aiSummary} 
                  aiLoading={loading && aiField === "summary"} 
                  aiLabel="Generate AI Summary"
                />
                
                <div className="glass rounded-[40px] p-10 border-white/5 mb-10 space-y-12">
                   <PremiumInput 
                    label="Executive Summary" 
                    value={data.summary} 
                    onChange={v => sv("summary", v)} 
                    placeholder="Results-driven professional with 5+ years of experience in..." 
                    rows={5} 
                    full 
                   />

                   <div className="pt-8 border-t border-white/5">
                      <PremiumSectionHeader 
                        title="Key Arsenal" 
                        desc="Technical and soft skills. AI will inject trending keywords for your niche." 
                        aiAction={aiSkills} 
                        aiLoading={loading && aiField === "skills"} 
                        aiLabel="Inject Trending Skills"
                      />
                       <textarea 
                        value={data.skills} 
                        onChange={e => sv("skills", e.target.value)} 
                        rows={4} 
                        placeholder="React, AWS, Python, Distributed Systems, Team Leadership..."
                        className="input-premium h-32"
                      />
                   </div>
                </div>

                <div className="glass rounded-[40px] p-12 bg-indigo-600/10 border-indigo-500/30 text-center relative overflow-hidden">
                   <div className="relative z-10">
                      <h3 className="text-3xl font-black mb-4 italic">The Billion-Dollar <span className="text-indigo-400">ATS Overhaul.</span></h3>
                      <p className="text-slate-400 max-w-lg mx-auto mb-10">This final optimization will rewrite your entire resume to mirror industry standards, inject 20+ hidden keywords, and ensure 100% ATS compatibility.</p>
                      <button 
                        onClick={aiOptimize} 
                        disabled={loading} 
                        className="btn-premium btn-primary px-12 py-5 text-xl font-black shadow-2xl shadow-indigo-500/40 hover:scale-105 transition-transform"
                      >
                         {loading && aiField === "optimize" ? <><Spinner size={20} color="white" /> Overhauling...</> : "🚀 LAUNCH FINAL OPTIMIZATION"}
                      </button>
                   </div>
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.2),transparent_70%)]" />
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="animate-fade">
                 <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="text-4xl font-black">All Done.</h2>
                        <p className="text-slate-500 italic">Your resume is ready for the world.</p>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={() => window.print()} className="btn-premium btn-glass px-8">🖨 PRINT</button>
                        <button 
                          onClick={downloadPDF} 
                          disabled={downloading} 
                          className="btn-premium btn-primary px-8"
                        >
                           {downloading ? <Spinner size={16} color="white" /> : "⬇ DOWNLOAD PDF"}
                        </button>
                    </div>
                 </div>

                 {/* --- Template Selection Scroll for last minute changes --- */}
                 <div className="flex gap-4 overflow-x-auto pb-8 mb-12 scrollbar-hide">
                    {TEMPLATES.map(t => (
                      <button 
                        key={t.id} 
                        onClick={() => setTid(t.id)}
                        className={`flex-shrink-0 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${tid === t.id ? 'bg-white text-black border-white' : 'bg-white/5 text-slate-500 border-white/5'}`}
                      >
                        {t.name}
                      </button>
                    ))}
                 </div>

                 <div className="glass rounded-[40px] p-2 bg-[#05070a]/50 border-white/5">
                    <div className="p-8 border-b border-white/5 bg-white flex items-center justify-between rounded-t-[38px] sticky top-0 z-20">
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center text-[10px]">📄</div>
                           <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{data.name || "UNNAMED"} RESUME</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                           <span className="text-[10px] font-black text-slate-500">LIVE PREVIEW</span>
                        </div>
                    </div>
                    <div className="overflow-hidden">
                       <ResumeDoc data={data} tid={tid} refProp={resumeRef} />
                    </div>
                 </div>

                 {atsResult && (
                   <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mt-12 glass rounded-[40px] p-10 border-indigo-500/30 bg-indigo-500/5 flex items-center gap-10"
                   >
                     <div className="text-center bg-indigo-600 rounded-[28px] p-6 shadow-2xl shadow-indigo-500/20">
                        <div className="text-5xl font-black mb-1">{atsResult.atsScore}</div>
                        <div className="text-[10px] font-black uppercase tracking-widest opacity-80">ATS SCORE</div>
                     </div>
                     <div>
                        <h4 className="text-xl font-black mb-4 italic">" {atsResult.strengthNote} "</h4>
                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                           {atsResult.improvements?.map((imp, i) => (
                             <div key={i} className="text-xs text-slate-400 flex items-center gap-2">
                                <span className="text-indigo-500 font-bold">•</span> {imp}
                             </div>
                           ))}
                        </div>
                     </div>
                   </motion.div>
                 )}
              </div>
            )}
          </motion.div>
        </div>

        {/* --- Global Footer Nav --- */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 overflow-hidden" style={{ right: "450px", height: 80, background: "rgba(5,7,10,0.85)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px" }}>
            <button 
              onClick={() => setStep(s => Math.max(0, s - 1))} 
              className={`text-xs font-black tracking-widest uppercase text-slate-500 hover:text-white transition-all ${step === 0 ? 'opacity-0 pointer-events-none' : ''}`}
            >
              ← Previous Mission
            </button>
            
            <div className="flex items-center gap-8">
               <span className="text-[10px] font-black text-indigo-500 tracking-[0.4em] hidden md:block">0{step+1} / 06</span>
               <button 
                  onClick={() => setStep(s => Math.min(5, s + 1))} 
                  className={`btn-premium btn-primary px-8 py-4 shadow-xl shadow-indigo-500/20 ${step === 5 ? 'opacity-0 pointer-events-none' : ''}`}
               >
                  NEXT: {STEPS[step+1]?.toUpperCase()} →
               </button>
            </div>

            {/* --- Subtle Background Glow for Nav --- */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/5 to-transparent pointer-events-none" />
        </nav>
      </main>

      {/* --- Live Resume Preview Aside (hidden on template select step) --- */}
      {step !== 0 && <aside style={{
        width: 420,
        background: "#05070a",
        borderLeft: "1px solid rgba(255,255,255,0.05)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
      }}>
        {/* Header badge */}
        <div style={{
          position: "absolute", top: 16, left: 16, right: 16,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          zIndex: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "#22c55e",
              boxShadow: "0 0 0 4px rgba(34,197,94,0.15)",
              animation: "pulse 2s ease-in-out infinite",
            }} />
            <span style={{ fontSize: 10, fontWeight: 900, color: "#475569", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              📄 Resume Preview
            </span>
          </div>
          <span style={{ fontSize: 9, fontWeight: 700, color: "#1e293b", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Live
          </span>
        </div>

        {/* Preview scaler — A4 = 794px wide, we scale to fit 420px aside */}
        <div style={{
          flex: 1,
          width: "100%",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          paddingTop: 80,
          paddingBottom: 80,
          overflowY: "auto",
          scrollbarWidth: "none",
        }}>
          <div style={{
            /* The outer wrapper shrinks to the scaled size */
            width: 380,
            /* 380/794 ≈ 0.479 scale factor */
            position: "relative",
            flexShrink: 0,
            marginBottom: "auto",
            marginTop: "auto"
          }}>
            <div style={{
              transform: "scale(0.4786)",
              transformOrigin: "top left",
              width: 794,
              minHeight: 1123,
              marginBottom: -585 /* Adjust for the scaled-down extra height to prevent ghost scrolling */
            }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={tid}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  style={{
                    width: "100%",
                    minHeight: "100%",
                    background: "white",
                    boxShadow: "0 32px 80px -12px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.04)",
                    borderRadius: 8,
                    overflow: "hidden",
                  }}
                >
                  <ResumeDoc data={step === 0 ? SAMPLE : data} tid={tid} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Bottom label */}
        <div style={{ position: "absolute", bottom: 14, left: 0, right: 0, textAlign: "center" }}>
          <span style={{ fontSize: 9, fontWeight: 900, color: "#0f172a", letterSpacing: "0.4em", textTransform: "uppercase" }}>
            SkillSyniq · Render Engine
          </span>
        </div>

        {/* Ambient glow */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 50% 30%, rgba(99,102,241,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
      </aside>}
    </div>
  );
}
