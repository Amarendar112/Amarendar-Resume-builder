import { useState, useRef, useEffect } from "react";
import { TEMPLATES } from "./constants";
import { LetterDoc } from "./TemplateDoc";

const Spinner = ({ size = 16 }) => (
  <span style={{ display: "inline-block", width: size, height: size, border: "2px solid currentColor", borderTop: "2px solid transparent", borderRadius: "50%", animation: "spin .7s linear infinite" }} />
);

const Input = ({ label, value, onChange, placeholder, type = "text", full = false, rows = 1 }) => (
  <div style={{ gridColumn: full ? "span 2" : "auto", display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
    <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>{label}</label>
    {rows > 1 ? (
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        style={{ padding: "10px 12px", fontSize: 14, border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", width: "100%", background: "white" }} />
    ) : (
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ padding: "10px 12px", fontSize: 14, border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", width: "100%", background: "white" }} />
    )}
  </div>
);

export default function CoverLetterBuilder({ user, onBack, credits, useCredit }) {
  const [data, setData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    location: "",
    title: "",
    targetCompany: "",
    targetRole: "",
    jobDesc: "",
    letterBody: "",
    tid: "minimal"
  });
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const sv = (k, v) => setData(d => ({ ...d, [k]: v }));

  const generateLetter = async () => {
    if (credits <= 0) {
      alert("You've run out of AI credits. Upgrade to Pro for unlimited access!");
      return;
    }
    setLoading(true);
    try {
      const prompt = `Write a professional, high-conversion cover letter.
      Candidate Name: ${data.name}
      Current Title: ${data.title}
      Target Company: ${data.targetCompany}
      Target Role: ${data.targetRole}
      Job Description Context: ${data.jobDesc.slice(0, 500)}
      Rules: 3-4 paragraphs, professional tone, focus on unique value proposition, avoid clichés. Output ONLY the letter body text.`;

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gpt-4o", messages: [{ role: "user", content: prompt }] })
      });
      const j = await res.json();
      const content = j.choices?.[0]?.message?.content?.trim() || "";
      sv("letterBody", content);
      useCredit();
    } catch (e) {
      console.error(e);
      alert("Failed to generate letter. Check your backend server and API key.");
    }
    setLoading(false);
  };

  const downloadPDF = async () => {
    setDownloading(true);
    try {
      if (!window.html2pdf) {
        const sc = document.createElement("script");
        sc.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
        document.head.appendChild(sc);
        await new Promise(r => sc.onload = r);
      }
      await window.html2pdf().set({
        margin: [10, 10, 10, 10],
        filename: `${data.name.replace(/\s+/g, '_')}_Cover_Letter.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
      }).from(letterRef.current).save();
    } catch (e) {
      alert("Export failed. Try printing to PDF instead.");
    }
    setDownloading(false);
  };

  return (
    <div className="builder-layout">
      <main className="builder-main">
        <header style={{ padding: "16px 40px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "white", position: "sticky", top: 0, zIndex: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={onBack} style={{ background: "none", fontSize: 18, color: "var(--text-secondary)" }}>←</button>
            <h1 style={{ fontSize: 18 }}>AI Cover Letter <span style={{ color: "var(--primary)", fontWeight: 500 }}>syniq</span></h1>
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f1f5f9", padding: "6px 12px", borderRadius: 20 }}>
               <span style={{ fontSize: 12, fontWeight: 800, color: "var(--primary)" }}>{credits}</span>
               <span style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Tokens</span>
            </div>
            <button onClick={downloadPDF} disabled={downloading} style={{ background: "var(--primary)", color: "white", padding: "8px 20px", borderRadius: "var(--radius-sm)", fontWeight: 700, border: "none" }}>
              {downloading ? <Spinner size={14} /> : "⬇ Download PDF"}
            </button>
          </div>
        </header>

        <div style={{ padding: "40px", maxWidth: 800, margin: "0 auto" }}>
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 20, marginBottom: 8 }}>Your Details</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, background: "white", padding: 24, borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
              <Input label="Full Name" value={data.name} onChange={v => sv("name", v)} />
              <Input label="Current Title" value={data.title} onChange={v => sv("title", v)} placeholder="eg. Marketing Manager" />
              <Input label="Email" value={data.email} onChange={v => sv("email", v)} />
              <Input label="Location" value={data.location} onChange={v => sv("location", v)} placeholder="City, Country" />
            </div>
          </section>

          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 20, marginBottom: 8 }}>Target Role</h2>
            <div style={{ background: "white", padding: 24, borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <Input label="Target Company" value={data.targetCompany} onChange={v => sv("targetCompany", v)} placeholder="eg. Google" />
                <Input label="Target Role" value={data.targetRole} onChange={v => sv("targetRole", v)} placeholder="eg. Senior Frontend Engineer" />
              </div>
              <Input label="Job Description (Optional)" value={data.jobDesc} onChange={v => sv("jobDesc", v)} rows={4} placeholder="Paste the JD here for better AI tailoring..." full />
              
              <button onClick={generateLetter} disabled={loading} style={{
                width: "100%", padding: 14, background: "var(--primary)", color: "white", borderRadius: "var(--radius-sm)", fontWeight: 700, fontSize: 15, marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 10
              }}>
                {loading ? <Spinner size={18} /> : "✨ Write Letter with AI"}
              </button>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: 20, marginBottom: 8 }}>Letter Content</h2>
            <div style={{ background: "white", padding: 24, borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
              <textarea value={data.letterBody} onChange={e => sv("letterBody", e.target.value)} rows={15} style={{ width: "100%", border: "1px solid #eee", padding: 16, borderRadius: 8, fontSize: 14, lineHeight: 1.6, background: "#fcfcfc" }} placeholder="Dear Hiring Manager..." />
            </div>
          </section>
        </div>
      </main>

      <aside className="builder-preview-aside">
        <div style={{ position: "absolute", top: 20, right: 20, zIndex: 10 }}>
          <div style={{ background: "white", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, boxShadow: "var(--shadow-sm)", color: "var(--text-secondary)" }}>
            LETTER PREVIEW
          </div>
        </div>
        <div style={{ padding: 20, display: "flex", gap: 10, justifyContent: "center", position: "absolute", bottom: 20, left: 0, right: 0, zIndex: 10 }}>
          {["minimal", "slate", "crimson"].map(t => (
            <button key={t} onClick={() => sv("tid", t)} style={{ padding: "6px 12px", background: data.tid === t ? "var(--primary)" : "white", color: data.tid === t ? "white" : "#444", border: "1px solid var(--border)", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
              {t.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="preview-container">
          <div className="preview-paper" style={{ transform: "scale(0.55)", transformOrigin: "center center", width: "210mm", minHeight: "297mm" }}>
            <LetterDoc data={data} tid={data.tid} />
          </div>
        </div>
      </aside>
    </div>
  );
}
