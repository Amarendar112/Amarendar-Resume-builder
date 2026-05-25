import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ResumeDoc } from "./TemplateDoc";
import { SAMPLE } from "./constants";
import { 
  auth, 
  googleProvider, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  updatePassword,
  isFirebaseConfigured
} from "./firebase";
import { signInWithPopup } from "firebase/auth";
import logoImg from "./assets/skillsiniq-logo.svg";
const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

export default function LandingPage({ onLoginSuccess }) {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authStep, setAuthStep] = useState("input");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isFormValid = isEmailValid && (authMode === "login" ? password.length > 0 : true);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let savedEmail = window.localStorage.getItem("emailForSignIn");
      if (!savedEmail) savedEmail = window.prompt("Please provide your email for confirmation");
      if (savedEmail) handleMagicLink(savedEmail);
    }
  }, []);

  const handleMagicLink = async (emailToUse) => {
    setLoading(true);
    try {
      await signInWithEmailLink(auth, emailToUse, window.location.href);
      setEmail(emailToUse);
      setAuthStep("set-password");
      setShowAuth(true);
      window.localStorage.removeItem("emailForSignIn");
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!isEmailValid) return;
    if (!isFirebaseConfigured) {
      onLoginSuccess();
      return;
    }
    setLoading(true);
    setError("");
    try {
      await sendSignInLinkToEmail(auth, email.trim(), { url: window.location.origin, handleCodeInApp: true });
      window.localStorage.setItem('emailForSignIn', email.trim());
      setAuthStep("success");
      setMessage("Verification link sent! Please check your email.");
    } catch (err) {
      setError(err.code === "auth/quota-exceeded" ? "Daily limit reached. Use Google instead." : err.message);
    }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isFirebaseConfigured) {
      onLoginSuccess();
      return;
    }
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      onLoginSuccess();
    } catch { setError("Invalid credentials. Please try again."); }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    if (!isFirebaseConfigured) {
      onLoginSuccess();
      return;
    }
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) onLoginSuccess();
    } catch (err) { setError(err.message); }
  };

  // ── STYLES ──────────────────────────────────────────────────────────────────
  const S = {
    root: {
      minHeight: "100vh",
      background: "linear-gradient(-45deg, #05070a, #0a0d1a, #10122a, #0b0f19)",
      backgroundSize: "400% 400%",
      animation: "bgMove 14s ease infinite",
      color: "#f8fafc",
      fontFamily: "'Inter', system-ui, sans-serif",
      overflowX: "hidden",
    },
    nav: {
      position: "fixed",
      top: 0, left: 0, right: 0,
      height: 68,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 40px",
      background: "rgba(5,7,10,0.7)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      zIndex: 100,
    },
    logo: {
      display: "flex",
      alignItems: "center",
      gap: 10,
    },
    logoBox: {
      width: 36, height: 36,
      background: "linear-gradient(135deg,#6366f1,#a855f7)",
      borderRadius: 10,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 900, fontSize: 18,
    },
    logoText: {
      fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em",
    },
    navLinks: {
      display: "flex", alignItems: "center", gap: 32,
    },
    navLink: {
      fontSize: 14, fontWeight: 600, color: "#94a3b8",
      textDecoration: "none", cursor: "pointer",
      background: "none", border: "none", padding: 0,
      transition: "color 0.2s",
    },
    navActions: {
      display: "flex", alignItems: "center", gap: 12,
    },
    btnLogin: {
      background: "none", border: "1px solid rgba(255,255,255,0.12)",
      color: "#cbd5e1", fontWeight: 700, fontSize: 13,
      padding: "8px 18px", borderRadius: 10, cursor: "pointer",
      transition: "all 0.2s",
    },
    btnCta: {
      background: "linear-gradient(135deg,#6366f1,#a855f7)",
      color: "#fff", fontWeight: 800, fontSize: 13,
      padding: "9px 20px", borderRadius: 10, cursor: "pointer",
      border: "none", boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
      transition: "all 0.2s",
    },
    hero: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "120px 40px 80px",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 60,
      alignItems: "center",
    },
    heroBadge: {
      display: "inline-flex", alignItems: "center", gap: 8,
      background: "rgba(99,102,241,0.1)",
      border: "1px solid rgba(99,102,241,0.25)",
      borderRadius: 999, padding: "5px 14px",
      color: "#818cf8", fontSize: 10, fontWeight: 800,
      letterSpacing: "0.1em", textTransform: "uppercase",
      marginBottom: 24,
    },
    heroDot: {
      width: 6, height: 6, borderRadius: "50%",
      background: "#6366f1",
    },
    heroTitle: {
      fontSize: "clamp(40px, 5vw, 64px)",
      fontWeight: 900,
      lineHeight: 1.05,
      letterSpacing: "-0.03em",
      marginBottom: 24,
      color: "#fff",
    },
    heroGradText: {
      background: "linear-gradient(90deg, #818cf8, #c084fc, #22d3ee)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
    heroSub: {
      fontSize: 17, color: "#94a3b8", lineHeight: 1.7,
      maxWidth: 440, marginBottom: 36,
    },
    heroBtn: {
      background: "linear-gradient(135deg,#6366f1,#a855f7)",
      color: "#fff", fontWeight: 800, fontSize: 16,
      padding: "14px 36px", borderRadius: 14, cursor: "pointer",
      border: "none", boxShadow: "0 8px 30px rgba(99,102,241,0.4)",
      display: "inline-flex", alignItems: "center", gap: 8,
    },
    heroVisual: {
      display: "flex", justifyContent: "center", alignItems: "center",
      position: "relative",
    },
    mockCard: {
      width: 340, height: 460,
      background: "#0f172a",
      borderRadius: 24,
      border: "1px solid rgba(255,255,255,0.08)",
      overflow: "hidden",
      boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
      transform: "perspective(1000px) rotateY(-8deg) rotateX(4deg)",
      transition: "transform 0.6s ease",
    },
    mockImg: {
      width: "100%", height: "100%", objectFit: "cover", opacity: 0.85,
    },
    mockGlow: {
      position: "absolute", inset: 0, pointerEvents: "none",
      background: "radial-gradient(ellipse at center, rgba(99,102,241,0.15) 0%, transparent 70%)",
    },
    // ── Modal ────────────────────────────────────────────────────────────────
    overlay: {
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.85)",
      backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px",
    },
    modal: {
      width: "100%", maxWidth: 440,
      background: "rgba(10,13,26,0.95)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 28,
      padding: "44px 40px",
      position: "relative",
    },
    closeBtn: {
      position: "absolute", top: 16, right: 16,
      width: 32, height: 32, borderRadius: "50%",
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.08)",
      color: "#94a3b8", fontSize: 16, cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
    },
    modalTitle: {
      fontSize: 32, fontWeight: 900, color: "#fff",
      letterSpacing: "-0.02em", marginBottom: 6,
    },
    modalSub: {
      fontSize: 14, color: "#94a3b8", marginBottom: 32,
    },
    inputWrap: {
      position: "relative", marginBottom: 16,
    },
    inputField: {
      width: "100%",
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 12,
      padding: "14px 16px",
      color: "#fff",
      fontSize: 15,
      outline: "none",
      fontFamily: "'Inter', sans-serif",
      transition: "border-color 0.2s",
      boxSizing: "border-box",
    },
    submitBtn: {
      width: "100%",
      background: "linear-gradient(135deg,#6366f1,#a855f7)",
      color: "#fff", fontWeight: 800, fontSize: 15,
      padding: "14px", borderRadius: 12, cursor: "pointer",
      border: "none", marginBottom: 12,
      boxShadow: "0 4px 20px rgba(99,102,241,0.3)",
      transition: "all 0.2s",
    },
    submitBtnDisabled: {
      opacity: 0.45, cursor: "not-allowed",
      filter: "grayscale(0.4)",
    },
    divider: {
      display: "flex", alignItems: "center", gap: 12, margin: "16px 0",
    },
    divLine: { flex: 1, height: 1, background: "rgba(255,255,255,0.08)" },
    divText: { fontSize: 10, fontWeight: 800, color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase" },
    googleBtn: {
      width: "100%",
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 12, padding: "13px",
      color: "#fff", fontWeight: 700, fontSize: 14,
      cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
      marginBottom: 20, transition: "all 0.2s",
    },
    switchBtn: {
      background: "none", border: "none",
      color: "#818cf8", fontWeight: 700, fontSize: 14,
      cursor: "pointer", textAlign: "center",
      display: "block", width: "100%",
      padding: "4px 0",
    },
    eyeBtn: {
      position: "absolute", right: 14, top: "50%",
      transform: "translateY(-50%)",
      background: "none", border: "none",
      color: "#64748b", cursor: "pointer",
      display: "flex", alignItems: "center",
    },
    errorBox: {
      background: "rgba(239,68,68,0.08)",
      border: "1px solid rgba(239,68,68,0.2)",
      borderRadius: 10, padding: "10px 14px",
      color: "#f87171", fontSize: 13, marginBottom: 16,
    },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes bgMove { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes floatAnim { 0%,100%{transform:perspective(1000px) rotateY(-8deg) rotateX(4deg) translateY(0)} 50%{transform:perspective(1000px) rotateY(-8deg) rotateX(4deg) translateY(-12px)} }
        .hero-card { animation: floatAnim 6s ease-in-out infinite; }
        .hero-card:hover { transform: perspective(1000px) rotateY(0deg) rotateX(0deg) !important; transition: transform 0.6s ease !important; animation: none !important; }
        input:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.15) !important; }
        button:hover { opacity: 0.92; }
        .navlink-hover:hover { color: #fff !important; }
        .google-btn:hover { background: rgba(255,255,255,0.08) !important; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-visual { display: none !important; }
          .nav-links { display: none !important; }
          .hero-title { font-size: 40px !important; }
          .modal-inner { padding: 32px 24px !important; }
        }
      `}</style>

      <div style={S.root}>
        {/* NAV */}
        <nav style={S.nav}>
          <div style={S.logo}>
            <div style={{ width: 170, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
              <img src={logoImg} alt="SkillSyniq Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'left center' }} />
            </div>
          </div>
          <div className="nav-links" style={S.navLinks}>
            <button className="navlink-hover" style={S.navLink}>Features</button>
            <button className="navlink-hover" style={S.navLink}>Templates</button>
            <button className="navlink-hover" style={S.navLink}>Pricing</button>
          </div>
          <div style={S.navActions}>
            <button style={S.btnLogin} onClick={() => { setAuthMode("login"); setShowAuth(true); }}>Log In</button>
            <button style={S.btnCta} onClick={() => { setAuthMode("signup"); setShowAuth(true); }}>Get Started</button>
          </div>
        </nav>

        {/* HERO */}
        <div className="hero-grid" style={S.hero}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div style={S.heroBadge}>
              <div style={{...S.heroDot, animation:"pulse 2s infinite"}} />
              NEW · LinkedIn AI Optimizer
            </div>
            <h1 className="hero-title" style={S.heroTitle}>
              Build Job-Winning<br />
              <span style={S.heroGradText}>Resumes with AI.</span>
            </h1>
            <p style={S.heroSub}>
              ATS-optimized, AI-crafted resumes in seconds. SkillSyniq uses advanced GPT models to highlight your strengths and land you more interviews.
            </p>
            <button
              style={S.heroBtn}
              onClick={() => { setAuthMode("signup"); setShowAuth(true); }}
            >
              Get Started Free →
            </button>
          </motion.div>

          <div className="hero-visual" style={S.heroVisual}>
            <div style={S.mockGlow} />
            {/* Properly scaled A4 resume preview */}
            <div className="hero-card" style={{
              ...S.mockCard,
              /* outer container = visual scaled size: 340px wide */
              /* A4 = 794px wide, scale = 340/794 ≈ 0.428 */
              /* scaled height = 1123 * 0.428 ≈ 481px, but we cap at 460 with overflow:hidden */
              width: 340,
              height: 460,
              overflow: "hidden",
              position: "relative",
              background: "white",
            }}>
              <div style={{
                width: 794,
                minHeight: 1123,
                transform: "scale(0.428)",
                transformOrigin: "top left",
                pointerEvents: "none",
                userSelect: "none",
              }}>
                <ResumeDoc data={SAMPLE} tid="minimal" />
              </div>
              {/* Fade out bottom */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: 120,
                background: "linear-gradient(to bottom, transparent, #0f172a)",
                pointerEvents: "none",
              }} />
              {/* Subtle border overlay */}
              <div style={{
                position: "absolute", inset: 0,
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 24,
                pointerEvents: "none",
              }} />
            </div>
          </div>

        </div>

        {/* AUTH MODAL */}
        <AnimatePresence>
          {showAuth && (
            <motion.div
              style={S.overlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => { if (e.target === e.currentTarget) setShowAuth(false); }}
            >
              <motion.div
                className="modal-inner"
                style={S.modal}
                initial={{ scale: 0.93, opacity: 0, y: 24 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.93, opacity: 0, y: 24 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                <button style={S.closeBtn} onClick={() => setShowAuth(false)}>✕</button>

                {authStep === "success" ? (
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                    <h2 style={{ ...S.modalTitle, marginBottom: 12 }}>Check your email</h2>
                    <p style={{ ...S.modalSub, marginBottom: 32 }}>{message}</p>
                    <button style={S.submitBtn} onClick={() => { setShowAuth(false); setAuthStep("input"); }}>Done</button>
                  </div>
                ) : (
                  <>
                    <h2 style={S.modalTitle}>{authMode === "login" ? "Welcome back." : "Get started."}</h2>
                    <p style={S.modalSub}>{authMode === "login" ? "Login to your account." : "Create your account for free."}</p>

                    <form onSubmit={authMode === "login" ? handleLogin : handleEmailAuth}>
                      <div style={S.inputWrap}>
                        <input
                          type="email"
                          placeholder="Email Address"
                          required
                          style={S.inputField}
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                        />
                      </div>

                      {authMode === "login" && (
                        <div style={{ ...S.inputWrap, position: "relative" }}>
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            required
                            style={{ ...S.inputField, paddingRight: 44 }}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                          />
                          <button type="button" style={S.eyeBtn} onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                          </button>
                        </div>
                      )}

                      {error && <div style={S.errorBox}>⚠ {error}</div>}

                      <button
                        type="submit"
                        disabled={loading || !isFormValid}
                        style={{ ...S.submitBtn, ...((!isFormValid || loading) ? S.submitBtnDisabled : {}) }}
                      >
                        {loading ? "Please wait…" : (authMode === "login" ? "Login" : "Sign up with Email")}
                      </button>

                      <div style={S.divider}>
                        <div style={S.divLine} />
                        <span style={S.divText}>OR</span>
                        <div style={S.divLine} />
                      </div>

                      <button type="button" className="google-btn" style={S.googleBtn} onClick={handleGoogleLogin}>
                        <svg width="18" height="18" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c3.11 0 5.72-1.03 7.63-2.81l-3.57-2.77c-1.01.68-2.31 1.08-4.06 1.08-3.12 0-5.77-2.11-6.72-4.96H1.54v2.87C3.44 20.21 7.42 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.28 13.54a7.22 7.22 0 0 1 0-4.58V6.09H1.54a11.96 11.96 0 0 0 0 11.82l3.74-2.87z"/>
                          <path fill="#EA4335" d="M12 4.45c1.69 0 3.21.58 4.41 1.72l3.32-3.32C17.71 1.05 15.11 0 12 0 7.42 0 3.44 2.79 1.54 6.09l3.74 2.87c.95-2.85 3.6-4.96 6.72-4.96z"/>
                        </svg>
                        Continue with Google
                      </button>

                      <button
                        type="button"
                        style={S.switchBtn}
                        onClick={() => { setAuthMode(authMode === "login" ? "signup" : "login"); setError(""); }}
                      >
                        {authMode === "login" ? "No account? Create one for free" : "Already have an account? Log in"}
                      </button>
                    </form>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
