import React, { useState } from "react";
import { motion } from "framer-motion";
import logoImg from "./assets/skillsiniq-logo.svg";
export default function Dashboard({ user, onLogout, onSelectTool, onGoPricing, credits }) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const tools = [
    { id: "resume",       title: "AI Resume Builder",      desc: "Create an ATS-optimized resume in minutes with our advanced AI.",        icon: "📄", featured: true },
    { id: "cover-letter", title: "Cover Letter Writer",    desc: "Generate a perfectly tailored cover letter for any job description.",     icon: "✉️" },
    { id: "interview",    title: "Interview AI Coach",     desc: "Practice with our AI and get real-time coaching on your answers.",        icon: "🎙️" },
    { id: "score",        title: "Resume Score Analyzer",  desc: "Get a deep-dive analysis of your resume and see how it ranks.",           icon: "📈", isNew: true },
  ];

  const navItems = [
    { icon: "📊", label: "Dashboard",        id: "dashboard",    onClick: () => setActiveTab("dashboard") },
    { icon: "📄", label: "Resumes",           id: "resume",       onClick: () => onSelectTool("resume") },
    { icon: "✉️", label: "Cover Letters",    id: "cover-letter", onClick: () => onSelectTool("cover-letter") },
    { icon: "🎙️", label: "Interview Prep",  id: "interview",    onClick: () => onSelectTool("interview") },
  ];

  const advancedItems = [
    { icon: "💎", label: "Upgrade to Pro",   badge: "PRO", onClick: onGoPricing },
    { icon: "⚙️", label: "Account Settings", onClick: () => {} },
  ];

  const sideW = collapsed ? 80 : 256;

  const S = {
    root: { display: "flex", height: "100vh", background: "#05070a", color: "#f8fafc", fontFamily: "'Inter',sans-serif", overflow: "hidden" },
    sidebar: { width: sideW, minWidth: sideW, height: "100vh", background: "#0b0f19", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", flexShrink: 0, position: "relative", transition: "width 0.3s ease, min-width 0.3s ease", overflow: "hidden" },
    logoArea: { padding: collapsed ? "24px 0" : "24px 20px", display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", gap: 10 },
    logoBox: { width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#fff", flexShrink: 0 },
    collapseBtn: { position: "absolute", right: -12, top: 72, width: 24, height: 24, borderRadius: "50%", background: "#6366f1", border: "2px solid #05070a", color: "#fff", fontSize: 11, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10 },
    sectionLabel: { padding: collapsed ? "12px 0" : "12px 20px", fontSize: 9, fontWeight: 900, color: "#475569", textTransform: "uppercase", letterSpacing: "0.12em", textAlign: collapsed ? "center" : "left", whiteSpace: "nowrap", overflow: "hidden" },
    navItem: (active) => ({ display: "flex", alignItems: "center", gap: collapsed ? 0 : 12, padding: collapsed ? "10px 0" : "10px 20px", margin: "2px 8px", borderRadius: 10, background: active ? "rgba(99,102,241,0.1)" : "transparent", color: active ? "#818cf8" : "#94a3b8", fontWeight: 600, fontSize: 14, cursor: "pointer", transition: "all 0.15s", justifyContent: collapsed ? "center" : "flex-start", whiteSpace: "nowrap", overflow: "hidden" }),
    userArea: { borderTop: "1px solid rgba(255,255,255,0.05)", padding: collapsed ? "12px 0" : "12px 16px", background: "rgba(0,0,0,0.2)", display: "flex", alignItems: "center", gap: 10, justifyContent: collapsed ? "center" : "flex-start" },
    avatar: { width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, flexShrink: 0 },
    main: { flex: 1, overflowY: "auto", background: "#05070a", display: "flex", flexDirection: "column" },
    header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", height: 64, background: "rgba(5,7,10,0.85)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.05)", position: "sticky", top: 0, zIndex: 40, flexShrink: 0 },
    tokenBadge: { display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 99, padding: "6px 16px", fontSize: 13, fontWeight: 700 },
    ctaBtn: { background: "linear-gradient(135deg,#6366f1,#a855f7)", color: "#fff", fontWeight: 800, fontSize: 13, padding: "9px 20px", borderRadius: 10, border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(99,102,241,0.3)" },
    content: { maxWidth: 960, margin: "0 auto", padding: "44px 40px", width: "100%" },
    heroTitle: { fontSize: 38, fontWeight: 900, marginBottom: 10, lineHeight: 1.1, letterSpacing: "-0.02em" },
    heroSub: { fontSize: 15, color: "#94a3b8", maxWidth: 480, lineHeight: 1.65 },
    toolGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 48 },
    toolCard: (featured) => ({ background: featured ? "rgba(99,102,241,0.05)" : "rgba(255,255,255,0.02)", border: `1px solid ${featured ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.06)"}`, borderRadius: 22, padding: 26, cursor: "pointer", transition: "all 0.2s ease" }),
    cardIcon: { width: 44, height: 44, background: "rgba(255,255,255,0.05)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 14 },
    emptyBox: { background: "rgba(17,24,39,0.7)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 24, padding: "72px 40px", textAlign: "center" },
  };

  return (
    <div style={S.root}>
      {/* ── Sidebar ── */}
      <aside style={S.sidebar}>
        {/* Logo */}
        <div style={{ ...S.logoArea, overflow: 'hidden' }}>
          <div style={{ width: collapsed ? 40 : 170, height: 46, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexShrink: 0, transition: 'width 0.3s ease' }}>
            <div style={{ minWidth: 170, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
              <img src={logoImg} alt="SkillSyniq Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'left center' }} />
            </div>
          </div>
        </div>

        {/* Collapse toggle */}
        <button style={S.collapseBtn} onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? "›" : "‹"}
        </button>

        {/* Nav */}
        <nav style={{ flex: 1, paddingTop: 4 }}>
          <div style={S.sectionLabel}>Main</div>
          {navItems.map(item => (
            <div
              key={item.id}
              style={S.navItem(activeTab === item.id)}
              onClick={item.onClick}
              onMouseEnter={e => { if (activeTab !== item.id) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#fff"; }}}
              onMouseLeave={e => { if (activeTab !== item.id) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8"; }}}
            >
              <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </div>
          ))}

          <div style={{ ...S.sectionLabel, marginTop: 8 }}>Advanced</div>
          {advancedItems.map((item, i) => (
            <div
              key={i}
              style={S.navItem(false)}
              onClick={item.onClick}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#94a3b8"; }}
            >
              <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
              {!collapsed && item.badge && (
                <span style={{ background: "linear-gradient(135deg,#f59e0b,#d97706)", color: "#fff", fontSize: 8, fontWeight: 900, padding: "2px 6px", borderRadius: 99, textTransform: "uppercase" }}>{item.badge}</span>
              )}
            </div>
          ))}
        </nav>

        {/* User */}
        <div style={S.userArea}>
          <div style={S.avatar}>{(user?.email || "U")[0].toUpperCase()}</div>
          {!collapsed && (
            <>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email?.split('@')[0]}</div>
                <div style={{ fontSize: 9, fontWeight: 900, color: "#818cf8", textTransform: "uppercase", letterSpacing: "0.08em" }}>Free Plan</div>
              </div>
              <button onClick={onLogout} style={{ color: "#64748b", fontSize: 16, padding: 4 }} title="Logout">🚪</button>
            </>
          )}
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={S.main}>
        {/* Header */}
        <header style={S.header}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700 }}>Hello, {user?.email?.split('@')[0]}!</h2>
            <span style={{ fontSize: 13, color: "#64748b" }}>Welcome to your workspace.</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={S.tokenBadge}>
              <span style={{ color: "#818cf8" }}>✨</span>
              <span>{credits}</span>
              <span style={{ fontSize: 9, fontWeight: 900, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>Tokens</span>
            </div>
            <button onClick={onGoPricing} style={S.ctaBtn}>Upgrade</button>
          </div>
        </header>

        {/* Content */}
        <div style={S.content}>
          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 44 }}>
            <div style={{ fontSize: 10, fontWeight: 900, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>SkillSyniq Professional Suite</div>
            <h1 style={S.heroTitle}>Ready to Land Your<br />Next Big Opportunity?</h1>
            <p style={S.heroSub}>Choose an AI tool to get started. All resumes are ATS-optimized and professionally formatted.</p>
          </motion.div>

          {/* Tool grid */}
          <div style={S.toolGrid}>
            {tools.map((tool, idx) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                onClick={() => onSelectTool(tool.id)}
                style={S.toolCard(tool.featured)}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 20px 40px -10px rgba(0,0,0,0.6)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = tool.featured ? "rgba(99,102,241,0.3)" : "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={S.cardIcon}>{tool.icon}</div>
                  {tool.featured && <span style={{ background: "#6366f1", color: "#fff", fontSize: 9, fontWeight: 900, padding: "3px 10px", borderRadius: 99, textTransform: "uppercase", letterSpacing: "0.08em" }}>Popular</span>}
                  {tool.isNew && <span style={{ background: "#06b6d4", color: "#fff", fontSize: 9, fontWeight: 900, padding: "3px 10px", borderRadius: 99, textTransform: "uppercase", letterSpacing: "0.08em" }}>New</span>}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{tool.title} →</h3>
                <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{tool.desc}</p>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: 14 }}>
                  <span>AI-Powered Generator</span>
                  <span style={{ color: "#818cf8" }}>1 Credit</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Documents */}
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 20 }}>Your Documents</h2>
            <div style={S.emptyBox}>
              <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.12 }}>📄</div>
              <h3 style={{ fontSize: 18, fontWeight: 900, marginBottom: 8 }}>No documents yet.</h3>
              <p style={{ color: "#94a3b8", marginBottom: 24, maxWidth: 340, margin: "0 auto 24px" }}>Create your first ATS-optimized resume and take the first step towards your dream career.</p>
              <button
                onClick={() => onSelectTool("resume")}
                style={{ background: "linear-gradient(135deg,#6366f1,#a855f7)", color: "#fff", fontWeight: 800, fontSize: 14, padding: "12px 28px", borderRadius: 12, border: "none", cursor: "pointer", boxShadow: "0 4px 20px rgba(99,102,241,0.3)" }}
              >
                Create Your First Resume
              </button>
            </div>
          </div>
        </div>

        <footer style={{ padding: "24px 40px", borderTop: "1px solid rgba(255,255,255,0.04)", textAlign: "center", color: "#334155", fontSize: 12 }}>
          © 2026 SkillSyniq Pro AI Suite.
        </footer>
      </main>
    </div>
  );
}
