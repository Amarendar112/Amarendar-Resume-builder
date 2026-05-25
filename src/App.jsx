import { useState, useEffect } from "react";
import { auth, isFirebaseConfigured } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import LandingPage from "./LandingPage";
import Dashboard from "./Dashboard";
import ResumeBuilder from "./ResumeBuilder";
import CoverLetterBuilder from "./CoverLetterBuilder";
import ResignationLetterBuilder from "./ResignationLetterBuilder";
import InterviewPractice from "./InterviewPractice";
import ResumeScoreAnalyzer from "./ResumeScoreAnalyzer";
import Pricing from "./Pricing";

export default function App() {
  const [user, setUser] = useState(undefined); // undefined = loading, null = logged out
  const [view, setView] = useState("dashboard"); // dashboard, resume, cover-letter, resignation, interview, pricing
  const [credits, setCredits] = useState(() => {
    const saved = localStorage.getItem("ai_credits");
    return saved !== null ? parseInt(saved) : 12;
  });

  useEffect(() => {
    localStorage.setItem("ai_credits", credits);
  }, [credits]);

  const useCredit = () => setCredits(c => Math.max(0, c - 1));

  // Listen for Firebase auth state changes
  useEffect(() => {
    if (!isFirebaseConfigured) {
      // Auto-log in Guest User instantly for offline/free deployment
      setUser({ email: "guest@example.com", displayName: "Guest User", uid: "mock-guest" });
      return;
    }

    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser || null);
    });
    return () => unsub();
  }, []);

  const handleLogout = () => {
    if (!isFirebaseConfigured) {
      setUser(null);
      return;
    }
    signOut(auth);
  };

  // Show loading splash while Firebase determines auth state
  if (user === undefined) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#030712" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 48, height: 48, border: "3px solid #3b82f6", borderTop: "3px solid transparent", borderRadius: "50%", animation: "spin .7s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: "#9ca3af", fontSize: 14 }}>Initializing SkillSyniq Pro…</p>
        </div>
        <style>{"@keyframes spin { to { transform: rotate(360deg); } }"}</style>
      </div>
    );
  }

  // Show landing page if not logged in
  if (!user) {
    return <LandingPage 
      onLoginSuccess={() => setView("dashboard")} 
      onGoPricing={() => setView("pricing")} 
    />;
  }

  // Router based on 'view' state
  return (
    <div className="app-container">
      {view === "dashboard" && (
        <Dashboard 
          user={user} 
          onLogout={handleLogout} 
          onSelectTool={(id) => setView(id)} 
          onGoPricing={() => setView("pricing")}
          credits={credits}
        />
      )}
      
      {view === "resume" && (
        <ResumeBuilder 
          user={user} 
          onBack={() => setView("dashboard")} 
          credits={credits}
          useCredit={useCredit}
        />
      )}

      {view === "cover-letter" && (
        <CoverLetterBuilder 
          user={user} 
          onBack={() => setView("dashboard")} 
          credits={credits}
          useCredit={useCredit}
        />
      )}

      {view === "resignation" && (
        <ResignationLetterBuilder 
          user={user} 
          onBack={() => setView("dashboard")} 
          credits={credits}
          useCredit={useCredit}
        />
      )}

      {view === "interview" && (
        <InterviewPractice 
          user={user} 
          onBack={() => setView("dashboard")} 
          credits={credits}
          useCredit={useCredit}
        />
      )}

      {view === "score" && (
        <ResumeScoreAnalyzer 
          user={user} 
          onBack={() => setView("dashboard")} 
          credits={credits}
          useCredit={useCredit}
        />
      )}

      {view === "pricing" && (
        <Pricing 
          onBack={() => setView(user ? "dashboard" : "landing")} 
          onSelect={() => alert("Payment gateway integration coming soon!")}
        />
      )}
    </div>
  );
}
