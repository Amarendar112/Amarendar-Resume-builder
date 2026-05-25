import { useState } from "react";
import { motion } from "framer-motion";

const TIERS = [
  {
    name: "Free",
    price: "0",
    desc: "Perfect for testing the platform power.",
    features: ["1 ATS Resume", "AI Summary Generator", "Standard PDF Export", "Basic Community Support"],
    btn: "Get Started",
    accent: "#94a3b8",
  },
  {
    name: "Success Pro",
    price: "19",
    period: "month",
    desc: "The go-to choice for serious career climbers.",
    features: ["Unlimited AI Resumes", "Cover Letter AI Writer", "Interview AI Coach", "Neural Score Analytics", "Custom Visual Themes", "24/7 Priority Concierge"],
    btn: "Upgrade to Pro",
    accent: "#818cf8",
    popular: true,
  },
  {
    name: "Infinite",
    price: "149",
    desc: "One-time investment. Lifetime career mastery.",
    features: ["Everything in Pro", "Lifetime Tool Access", "Private Beta Features", "Manual Expert Review", "Job Search Automation"],
    btn: "Get Lifetime",
    accent: "#c084fc",
  },
];

export default function Pricing({ onBack, onSelect }) {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div style={{ minHeight: "100vh", background: "#05070a", color: "#f8fafc", fontFamily: "'Inter',sans-serif", position: "relative", overflowX: "hidden", paddingBottom: 80 }}>
      {/* Background glows */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: 0, left: "25%", width: 500, height: 500, background: "rgba(99,102,241,0.08)", filter: "blur(120px)", borderRadius: "50%" }} />
        <div style={{ position: "absolute", bottom: 0, right: "25%", width: 500, height: 500, background: "rgba(168,85,247,0.08)", filter: "blur(120px)", borderRadius: "50%" }} />
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 40px", position: "relative", zIndex: 1 }}>
        {/* Back btn */}
        <button
          onClick={onBack}
          style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748b", fontSize: 11, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 64, background: "none", border: "none", cursor: "pointer" }}
          onMouseEnter={e => e.currentTarget.style.color = "#fff"}
          onMouseLeave={e => e.currentTarget.style.color = "#64748b"}
        >
          ← Back to Workspace
        </button>

        {/* Hero text */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ fontSize: 10, fontWeight: 900, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 16 }}>Transparent Investment</div>
          <h1 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: 20 }}>
            Choose Your Path to<br />
            <span style={{ background: "linear-gradient(90deg, #818cf8, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Career Mastery.</span>
          </h1>
          <p style={{ fontSize: 16, color: "#94a3b8", maxWidth: 500, margin: "0 auto 40px", lineHeight: 1.65 }}>
            Join 12,000+ professionals who landed their dream jobs at Stripe, Google, and Meta using SkillSyniq Pro.
          </p>

          {/* Toggle */}
          <div style={{ display: "inline-flex", alignItems: "center", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 4 }}>
            <button
              onClick={() => setIsYearly(false)}
              style={{ padding: "8px 24px", borderRadius: 10, fontSize: 11, fontWeight: 900, background: !isYearly ? "#6366f1" : "transparent", color: !isYearly ? "#fff" : "#64748b", border: "none", cursor: "pointer", transition: "all 0.2s", letterSpacing: "0.06em" }}
            >
              MONTHLY
            </button>
            <button
              onClick={() => setIsYearly(true)}
              style={{ padding: "8px 24px", borderRadius: 10, fontSize: 11, fontWeight: 900, background: isYearly ? "#6366f1" : "transparent", color: isYearly ? "#fff" : "#64748b", border: "none", cursor: "pointer", transition: "all 0.2s", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 8 }}
            >
              YEARLY
              <span style={{ background: "rgba(34,197,94,0.1)", color: "#4ade80", fontSize: 9, fontWeight: 900, padding: "2px 7px", borderRadius: 99, border: "1px solid rgba(34,197,94,0.2)" }}>SAVE 20%</span>
            </button>
          </div>
        </motion.div>

        {/* 3-col grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, alignItems: "stretch" }}>
          {TIERS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                display: "flex",
                flexDirection: "column",
                background: t.popular ? "rgba(11,15,25,0.95)" : "rgba(17,24,39,0.6)",
                border: `1px solid ${t.popular ? "rgba(99,102,241,0.45)" : "rgba(255,255,255,0.07)"}`,
                borderRadius: 32,
                padding: "40px 32px",
                position: "relative",
                transform: t.popular ? "scale(1.03)" : "scale(1)",
                boxShadow: t.popular ? "0 25px 60px -15px rgba(99,102,241,0.2)" : "none",
                backdropFilter: "blur(16px)",
              }}
            >
              {t.popular && (
                <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: "#6366f1", color: "#fff", fontSize: 9, fontWeight: 900, padding: "5px 18px", borderRadius: 99, letterSpacing: "0.15em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                  MOST POPULAR
                </div>
              )}

              {/* Tier header */}
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: t.accent, marginBottom: 16, letterSpacing: "-0.01em" }}>{t.name}</h3>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 10 }}>
                  <span style={{ fontSize: 48, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1 }}>
                    ${isYearly && t.period ? Math.floor(Number(t.price) * 0.8) : t.price}
                  </span>
                  {t.period && <span style={{ fontSize: 10, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>/{t.period}</span>}
                </div>
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.55 }}>{t.desc}</p>
              </div>

              {/* CTA */}
              <button
                onClick={() => onSelect(t.name)}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 900,
                  border: "none",
                  cursor: "pointer",
                  marginBottom: 28,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  background: t.popular ? "linear-gradient(135deg,#6366f1,#a855f7)" : "rgba(255,255,255,0.05)",
                  color: "#fff",
                  boxShadow: t.popular ? "0 4px 20px rgba(99,102,241,0.35)" : "none",
                  border: t.popular ? "none" : "1px solid rgba(255,255,255,0.08)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.opacity = "0.9"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.opacity = "1"; }}
              >
                {t.btn.toUpperCase()}
              </button>

              {/* Features */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
                {t.features.map((f, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#94a3b8" }}>
                    <span style={{ color: t.popular ? "#818cf8" : "#64748b", fontWeight: 900, fontSize: 14, lineHeight: 1 }}>✓</span>
                    {f}
                  </div>
                ))}
              </div>

              {t.popular && (
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: 24, paddingTop: 16, textAlign: "center", fontSize: 9, fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Powered by SkillSyniq Neural AI
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Logos */}
        <div style={{ marginTop: 96, paddingTop: 48, borderTop: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
          <div style={{ fontSize: 9, fontWeight: 900, color: "#334155", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 32 }}>Billion-Dollar Experience Realized by</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 48, opacity: 0.15, flexWrap: "wrap", alignItems: "center", filter: "grayscale(1)" }}>
            {["Stripe", "Linear", "Framer", "Notion", "OpenAI"].map(name => (
              <span key={name} style={{ fontSize: 26, fontWeight: 900 }}>{name}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
