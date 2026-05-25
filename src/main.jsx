import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// ==========================================
// GLOBAL MOCK AI INTERCEPTOR (FREE DEPLOYMENT)
// ==========================================
// This blocks calls to /api/generate and simulates OpenAI gpt-4o responses in-browser.
// It allows deploying as a 100% free static site without any credit card or active backend.
// To use a real backend later, simply delete this block!
const originalFetch = window.fetch;
window.fetch = async function (input, init) {
  const url = typeof input === 'string' ? input : input.url;

  if (url.includes('/api/health')) {
    return {
      ok: true,
      status: 200,
      json: async () => ({
        status: "healthy",
        service: "SkillSyniq-Mock-Backend",
        api_key_configured: true
      })
    };
  }

  if (url.includes('/api/generate')) {
    const body = JSON.parse(init.body || '{}');
    const userPrompt = body.messages?.[0]?.content || '';
    
    // Simulate real network delay for a authentic AI feel
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    let mockContent = "";
    const promptLower = userPrompt.toLowerCase();
    
    if (promptLower.includes("summary")) {
      const name = userPrompt.match(/Name:\s*([^|]*)/)?.[1]?.trim() || "Candidate";
      const title = userPrompt.match(/Title:\s*([^|]*)/)?.[1]?.trim() || "Professional";
      const skills = userPrompt.match(/Skills:\s*([^\n]*)/)?.[1]?.trim() || "modern technologies";
      mockContent = `Results-driven ${title} with a proven track record of designing and implementing high-performance solutions. Expert in bridging complex technical challenges with elegant user interfaces to drive product success and measurable business value. Adept at leading collaborative development and scaling robust applications utilizing ${skills.slice(0, 100)}.`;
    } 
    else if (promptLower.includes("bullet") || promptLower.includes("rewrite")) {
      mockContent = `Engineered and integrated critical application components, boosting platform responsiveness by 32% and enhancing mobile UX.
Architected modular state management protocols, leading to a 20% reduction in client-side loading times across key user workflows.
Optimized API query latency and streamlined performance tracking metrics, resulting in a 15% increase in pipeline operational efficiency.`;
    }
    else if (promptLower.includes("skills") || promptLower.includes("suggest")) {
      mockContent = "React, JavaScript, TypeScript, Next.js, Node.js, HTML5, CSS3, Tailwind CSS, Redux, RESTful APIs, Git, Agile Development";
    }
    else if (promptLower.includes("ats score") || promptLower.includes("json")) {
      mockContent = `{"atsScore":93,"improvements":["Quantify project team lead sizes in experience bullets.","Include certifications or education degrees prominently."],"strengthNote":"Excellent structured formatting and highly relevant, ATS-friendly language."}`;
    }
    else if (promptLower.includes("cover letter")) {
      const name = userPrompt.match(/Name:\s*([^|]*)/)?.[1]?.trim() || "Candidate";
      const title = userPrompt.match(/Title:\s*([^|]*)/)?.[1]?.trim() || "Professional";
      mockContent = `Dear Hiring Team,

I am writing to express my enthusiastic interest in the ${title} opportunity. With a deep passion for building high-quality, user-focused applications and a proven track record of implementing clean, scalable architectures, I am confident in my ability to make a significant and immediate contribution to your engineering team.

In my previous roles, I have consistently focused on technical precision, performance optimization, and cross-functional collaboration. Whether design-system integration or backend routing, I pride myself on solving complex problems with scalable, elegant code.

I look forward to the possibility of discussing how my experience and technical skill set align with your team's upcoming goals and challenges.

Sincerely,
${name}`;
    }
    else if (promptLower.includes("resignation")) {
      mockContent = `Dear Management,

Please accept this letter as formal notification that I am resigning from my position. My last day will be two weeks from today.

I am incredibly grateful for the professional opportunities and supportive environment I have enjoyed during my tenure. Thank you for your guidance, and I wish the team continued success.

Sincerely,
Professional`;
    }
    else {
      mockContent = "This is a premium pre-generated mock AI response for offline mode. You can edit this text directly to customize your document!";
    }
    
    return {
      ok: true,
      status: 200,
      json: async () => ({
        choices: [{
          message: {
            content: mockContent
          }
        }]
      })
    };
  }
  
  return originalFetch.apply(this, arguments);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

