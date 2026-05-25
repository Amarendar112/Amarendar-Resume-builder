import { useState, useEffect, useRef } from "react";

const Spinner = ({ size = 16 }) => (
  <span style={{ display: "inline-block", width: size, height: size, border: "2px solid currentColor", borderTop: "2px solid transparent", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
);

export default function InterviewPractice({ user, onBack, credits, useCredit }) {
  const [stage, setStage] = useState("setup"); // setup, interviewing, feedback
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("Mid-level");
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join("");
        setUserAnswer(transcript);
      };
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      setUserAnswer("");
      recognitionRef.current?.start();
    }
    setIsRecording(!isRecording);
  };

  const startInterview = async () => {
    if (!role) return alert("Please enter a role");
    if (credits <= 0) return alert("You've run out of AI credits.");
    
    setLoading(true);
    try {
      const prompt = `Act as a professional interviewer for a ${role} (${experience}) position. Generate 3 distinct behavioral and technical interview questions relative to this role. Output ONLY a JSON array of strings: ["Q1", "Q2", "Q3"]`;
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gpt-4o", messages: [{ role: "user", content: prompt }] })
      });
      const j = await res.json();
      const qs = JSON.parse(j.choices?.[0]?.message?.content?.replace(/```json|```/g, "").trim() || "[]");
      setQuestions(qs);
      setStage("interviewing");
      useCredit();
    } catch (e) {
      alert("Failed to start. Check your backend server and API key.");
    }
    setLoading(false);
  };

  const submitAnswer = async () => {
    if (!userAnswer.trim()) return;
    setLoading(true);
    try {
      const prompt = `Question: ${questions[currentIndex]}
      User's Answer: ${userAnswer}
      Role: ${role}
      Evaluate this answer. Provide constructive feedback, a "Strong Point", and a "Coaching Note" (how to improve formatting). Respond ONLY in JSON: {"feedback": "...", "score": 1-10, "strongPoint": "...", "correction": "..."}`;
      
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gpt-4o", messages: [{ role: "user", content: prompt }] })
      });
      const j = await res.json();
      const fb = JSON.parse(j.choices?.[0]?.message?.content?.replace(/```json|```/g, "").trim() || "{}");
      setFeedback(fb);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer("");
      setFeedback(null);
    } else {
      setStage("finished");
    }
  };

  return (
    <div className="interview-container" style={{ minHeight: "100vh", background: "#f8fafc", padding: "40px 20px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <button onClick={onBack} style={{ background: "none", border: "none", color: "#64748b", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            ← Back to Dashboard
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "white", padding: "6px 12px", borderRadius: 20, boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)" }}>
             <span style={{ fontSize: 12, fontWeight: 800, color: "var(--primary)" }}>{credits}</span>
             <span style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Tokens</span>
          </div>
        </div>

        {stage === "setup" && (
          <div className="animate-fade" style={{ background: "white", padding: 32, borderRadius: 24, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ width: 64, height: 64, background: "var(--primary)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "white", fontSize: 32 }}>🎙️</div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a" }}>AI Interview Practice</h2>
              <p style={{ color: "#64748b", marginTop: 8 }}>Master your next interview with real-time AI feedback.</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#475569", marginBottom: 8, display: "block" }}>Target Role</label>
                <input value={role} onChange={e => setRole(e.target.value)} placeholder="eg. Senior Product Designer" style={{ width: "100%", padding: "14px", borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 15 }} />
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: "#475569", marginBottom: 8, display: "block" }}>Experience Level</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                  {["Junior", "Mid-level", "Senior"].map(l => (
                    <button key={l} onClick={() => setExperience(l)} style={{ padding: "12px", borderRadius: 10, border: experience === l ? "2px solid var(--primary)" : "1px solid #e2e8f0", background: experience === l ? "rgba(26, 115, 232, 0.05)" : "white", fontWeight: 700, cursor: "pointer", transition: "0.2s" }}>{l}</button>
                  ))}
                </div>
              </div>

              <button onClick={startInterview} disabled={loading} style={{ marginTop: 12, padding: "16px", background: "var(--primary)", color: "white", border: "none", borderRadius: 12, fontWeight: 800, fontSize: 16, cursor: "pointer" }}>
                {loading ? <Spinner size={20} /> : "Start Interview Room →"}
              </button>
            </div>
          </div>
        )}

        {stage === "interviewing" && (
          <div className="animate-fade">
             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "var(--primary)", background: "rgba(26, 115, 232, 0.1)", padding: "4px 12px", borderRadius: 20 }}>Question {currentIndex + 1} of {questions.length}</span>
                <div style={{ display: "flex", gap: 4 }}>
                   {questions.map((_, i) => <div key={i} style={{ width: 30, height: 4, borderRadius: 2, background: i <= currentIndex ? "var(--primary)" : "#e2e8f0" }} />)}
                </div>
             </div>

             <div style={{ background: "white", padding: 40, borderRadius: 24, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)", marginBottom: 24 }}>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", textAlign: "center", lineHeight: 1.4 }}>"{questions[currentIndex]}"</h3>
             </div>

             {!feedback ? (
               <div className="animate-fade" style={{ background: "white", padding: 24, borderRadius: 24, border: "1px solid #e2e8f0" }}>
                  <textarea value={userAnswer} onChange={e => setUserAnswer(e.target.value)} placeholder="Type or click the mic to speak your answer..." rows={6} style={{ width: "100%", border: "none", outline: "none", fontSize: 16, lineHeight: 1.6, resize: "none" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20, paddingTop: 20, borderTop: "1px solid #f1f5f9" }}>
                     <button onClick={toggleRecording} style={{ background: isRecording ? "#ef4444" : "#f1f5f9", color: isRecording ? "white" : "#475569", width: 48, height: 48, borderRadius: "50%", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                        {isRecording ? "⏹" : "🎤"}
                     </button>
                     <button onClick={submitAnswer} disabled={loading || !userAnswer.trim()} style={{ padding: "12px 24px", background: "var(--primary)", color: "white", border: "none", borderRadius: 12, fontWeight: 700, cursor: "pointer" }}>
                        {loading ? <Spinner size={16} /> : "Submit Answer"}
                     </button>
                  </div>
               </div>
             ) : (
               <div className="animate-slide-up" style={{ background: "#0f172a", padding: 32, borderRadius: 24, color: "white" }}>
                  <div style={{ display: "flex", gap: 20, marginBottom: 24 }}>
                     <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800 }}>{feedback.score}</div>
                     <div style={{ flex: 1 }}>
                        <h4 style={{ margin: 0, fontSize: 18, color: "#93c5fd" }}>AI Interview Coach</h4>
                        <p style={{ margin: "4px 0 0", color: "#94a3b8", fontSize: 14 }}>Real-time evaluation</p>
                     </div>
                  </div>

                  <p style={{ lineHeight: 1.6, color: "#e2e8f0", marginBottom: 24 }}>{feedback.feedback}</p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                     <div style={{ background: "rgba(34, 197, 94, 0.1)", padding: 16, borderRadius: 16 }}>
                        <div style={{ fontSize: 11, fontWeight: 900, color: "#4ade80", marginBottom: 4, textTransform: "uppercase" }}>Strength</div>
                        <div style={{ fontSize: 13, color: "#f0fdf4" }}>{feedback.strongPoint}</div>
                     </div>
                     <div style={{ background: "rgba(249, 115, 22, 0.1)", padding: 16, borderRadius: 16 }}>
                        <div style={{ fontSize: 11, fontWeight: 900, color: "#fb923c", marginBottom: 4, textTransform: "uppercase" }}>Coaching Note</div>
                        <div style={{ fontSize: 13, color: "#fff7ed" }}>{feedback.correction}</div>
                     </div>
                  </div>

                  <button onClick={nextQuestion} style={{ width: "100%", marginTop: 32, padding: "16px", background: "white", color: "#0f172a", border: "none", borderRadius: 12, fontWeight: 800, cursor: "pointer" }}>
                    {currentIndex < questions.length - 1 ? "Next Question →" : "View Results"}
                  </button>
               </div>
             )}
          </div>
        )}

        {stage === "finished" && (
          <div className="animate-fade" style={{ textAlign: "center", background: "white", padding: 48, borderRadius: 32, boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.1)" }}>
             <div style={{ fontSize: 64, marginBottom: 24 }}>🏆</div>
             <h2 style={{ fontSize: 32, fontWeight: 900, color: "#0f172a" }}>Interview Complete!</h2>
             <p style={{ color: "#64748b", maxWidth: 400, margin: "16px auto 32px", lineHeight: 1.6 }}>You've successfully completed the practice session for the <strong>{role}</strong> position. Keep practicing to build confidence.</p>
             <button onClick={onBack} style={{ padding: "16px 40px", background: "var(--primary)", color: "white", border: "none", borderRadius: 16, fontWeight: 800, fontSize: 16, cursor: "pointer" }}>Return to Dashboard</button>
          </div>
        )}
      </div>

      <style>{`
        .animate-slide-up { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}
