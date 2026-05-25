export const SAMPLE = {
  name:"Alex Morgan", email:"alex.morgan@email.com", phone:"+1 (555) 234-5678",
  location:"San Francisco, CA", linkedin:"linkedin.com/in/alexmorgan", website:"alexmorgan.dev",
  title:"Senior Software Engineer",
  summary:"Analytical and results-driven Software Engineer with over 8 years of experience in building scalable, high-performance web applications and distributed systems. Expert in full-stack development with a deep understanding of modern JavaScript frameworks, cloud infrastructure, and CI/CD automation. Proven track record of leading cross-functional teams to deliver critical product features that drive user engagement and business growth. Passionate about clean code, mentoring engineers, and implementing architecture that balances immediate needs with long-term maintainability.",
  experience:[
    {company:"Stripe",role:"Senior Software Engineer",start:"Mar 2022",end:"",current:true,
     bullets:["Architected microservices handling 2M+ daily transactions, reducing API latency by 40%.",
              "Led a cross-functional team of 6 engineers to rebuild the primary payment dashboard, increasing user retention by 28%.",
              "Implemented automated CI/CD pipelines using GitHub Actions, cutting production deployment time from 45 min to under 8 min.",
              "Enforced high quality standards through rigorous code reviews and the introduction of comprehensive unit and integration testing."]},
    {company:"Airbnb",role:"Software Engineer II",start:"Jan 2020",end:"Feb 2022",current:false,
     bullets:["Built a shared React component library that was adopted by 12 product teams, standardizing design across the organization.",
              "Optimized search ranking algorithms through A/B testing, resulting in a 15% improvement in booking conversion rates.",
              "Collaborated with UX designers to implement accessible components, ensuring compliance with WCAG 2.1 AA standards.",
              "Mentored 3 junior developers through 1:1 sessions and structured pair-programming workshops."]},
    {company:"Techflow Inc.",role:"Full Stack Developer",start:"Jun 2017",end:"Dec 2019",current:false,
     bullets:["Developed and maintained customer-facing web applications using Vue.js and Express.js, serving over 100k monthly active users.",
              "Redesigned the database schema for the legacy CRM system, improving query performance by 60% for large-scale data reports.",
              "Successfully integrated third-party APIs for real-time inventory tracking and automated email notifications."]}],
  education:[
    {school:"UC Berkeley",degree:"B.S. Computer Science",field:"Computer Science",year:"2019",gpa:"3.8"},
    {school:"Stanford Center for Professional Development",degree:"Certificate",field:"Advanced Software Systems",year:"2021",gpa:""}],
  skills:"Front-End: JavaScript (ES6+), TypeScript, React, Next.js, Vue, Tailwind CSS, Material UI; Back-End: Node.js, Express, Go, Python, GraphQL, REST APIs; Infrastructure: AWS (S3, EC2, Lambda), Docker, Kubernetes, Terraform, CI/CD; Database: PostgreSQL, Redis, MongoDB, ElasticSearch; Tools: Git, GitHub, Jira, Figma, Postman",
  certifications:"AWS Solutions Architect — Associate (2023) · Google Cloud Professional Developer · Certified Scrum Master (CSM)",
  languages:"English (Native), Spanish (Conversational), French (Basic)",
  achievements:"Keynote Speaker at ReactConf 2023 · Top Open Source Contributor (2.4k GitHub stars) · winner HackSF 2022 Innovation Award · Author of 'Modern Web Patterns' technical blog",
  photo: "",
  showPhoto: false,
  projects:[
    {title:"OpenMetrics — OSS Monitoring",period:"2023–Present",tech:"Go, Prometheus, Grafana, Docker",
     bullets:["Created an open-source infrastructure monitoring tool that gained significant traction with 2,400+ GitHub stars.",
              "Designed a highly flexible plugin architecture supporting 40+ integrations with major cloud providers.",
              "Built a real-time alerting system that integrates with Slack and PagerDuty for immediate incident response."]},
    {title:"Nexus Analytics Dashboard",period:"2021",tech:"React, Node.js, Victory.js, AWS",
     bullets:["Developed a comprehensive analytics dashboard for visualizing large batches of real-time server telemetry data.",
              "Implemented complex data visualizations and drill-down reports for infrastructure health monitoring."]}]
};

export const EMPTY = {
  name:"",email:"",phone:"",location:"",linkedin:"",website:"",title:"",summary:"",
  photo: "",
  showPhoto: false,
  experience:[{company:"",role:"",start:"",end:"",current:false,bullets:["","",""]}],
  education:[{school:"",degree:"",field:"",year:"",gpa:""}],
  skills:"",certifications:"",languages:"",achievements:"",
  projects:[{title:"",period:"",tech:"",bullets:["",""]}]
};

export const ATS_KW=["Python","JavaScript","React","Node.js","MongoDB","REST API","Git","GitHub","Agile","Machine Learning","SQL","TypeScript","Docker","AWS","CI/CD","Full Stack","Backend","Frontend","API","Data Analysis","Leadership","Communication","Cloud","Database","Version Control","Problem Solving"];

export const TEMPLATES = [
  {id:"minimal",name:"Minimal",desc:"Clean serif, timeless",uiAccent:"#00ffc8"},
  {id:"executive",name:"Executive",desc:"Navy sidebar, corporate",uiAccent:"#3b82f6"},
  {id:"emerald",name:"Emerald",desc:"Green header, modern",uiAccent:"#10b981"},
  {id:"bold",name:"Bold",desc:"High contrast, typographic",uiAccent:"#f59e0b"},
  {id:"slate",name:"Slate",desc:"Dark header, clean split",uiAccent:"#94a3b8"},
  {id:"crimson",name:"Crimson",desc:"Red accent, sharp border",uiAccent:"#ef4444"},
  {id:"teal",name:"Teal",desc:"Two-column with avatar",uiAccent:"#14b8a6"},
  {id:"mono",name:"Mono",desc:"Dev aesthetic, monospace",uiAccent:"#a3e635"},
  {id:"elegant",name:"Elegant",desc:"Centered, editorial lines",uiAccent:"#d97706"},
  {id:"violet",name:"Violet",desc:"Gradient header, creative",uiAccent:"#8b5cf6"},
  {id:"faang",name:"FAANG Classic",desc:"ATS-perfect, blue links",uiAccent:"#1a56cc"},
  {id:"google",name:"Google",desc:"Material design, skill tags",uiAccent:"#4285F4"},
  {id:"amazon",name:"Amazon",desc:"Compact, metrics-forward",uiAccent:"#FF9900"},
  {id:"microsoft",name:"Microsoft",desc:"Fluent design, clean blue",uiAccent:"#0078D4"},
  {id:"apple",name:"Apple",desc:"Ultra minimal, premium space",uiAccent:"#555"},
  {id:"meta",name:"Meta",desc:"Bold header, modern edge",uiAccent:"#1877F2"},
  {id:"stanford",name:"Stanford",desc:"Academic serif, red accent",uiAccent:"#8C1C13"},
  {id:"oxford",name:"Oxford",desc:"Classic navy, formal serif",uiAccent:"#002147"},
  {id:"nordic",name:"Nordic",desc:"Scandi minimal, thin lines",uiAccent:"#64748b"},
  {id:"berlin",name:"Berlin",desc:"Dark header, bold modern",uiAccent:"#1C1C1E"},
  {id:"dubai",name:"Dubai",desc:"Gold luxury, premium serif",uiAccent:"#B8860B"},
  {id:"mba",name:"MBA Pro",desc:"Two-column, business elite",uiAccent:"#1e3a5f"},
  {id:"fintech",name:"FinTech",desc:"Teal clean, metrics driven",uiAccent:"#0ea5e9"},
  {id:"creative",name:"Creative Pro",desc:"Orange accent, bold edge",uiAccent:"#E67E22"},
  {id:"devops",name:"Dev & Ops",desc:"Green tech, tag-style skills",uiAccent:"#16a34a"},
  {id:"darksidebar",name:"Dark Sidebar",desc:"Black sidebar, circular avatar",uiAccent:"#222222"},
  {id:"classic",name:"Classic",desc:"Centered header, lawyer style",uiAccent:"#333333"},
  {id:"photobanner",name:"Photo Banner",desc:"Top photo strip, two-column",uiAccent:"#6b7280"},
];

export const STEPS = ["Template","Profile","Experience","Education","Skills","Preview"];
