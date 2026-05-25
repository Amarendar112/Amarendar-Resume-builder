import React from "react";

const has = s => s && s.trim().length > 0;

function ExpBlock({e, accent, small, isSelection}){
  return(
    <div style={{marginBottom:12}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",flexWrap:"wrap",gap:4}}>
        <span style={{fontWeight:700,fontSize:small?10.5:12, color: "#111"}}>{e.role||"Job Title"}</span>
        <span style={{fontSize:9.5, fontWeight: 500, color:"#666"}}>{e.start}{e.start&&(e.end||e.current)?" – ":""}{e.current?"Present":e.end}</span>
      </div>
      <div style={{color:accent,fontSize:10,marginBottom:4,fontWeight:600, textTransform: "uppercase", letterSpacing: "0.02em"}}>{e.company}</div>
      <ul style={{margin:0,paddingLeft:16}}>
        {e.bullets.filter(b=>b.trim()).map((b,j)=><li key={j} style={{marginBottom:3,color:"#333",fontSize:small?10:10.5,lineHeight:1.6}}>{b}</li>)}
      </ul>
    </div>
  );
}

function ProjBlock({p, accent, small, isSelection}){
  return(
    <div style={{marginBottom:12}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",flexWrap:"wrap",gap:4}}>
        <span style={{fontWeight:700,fontSize:small?10.5:11.5, color: "#111"}}>{p.title}</span>
        <span style={{fontSize:9.5, fontWeight: 500, color:"#666"}}>{p.period}</span>
      </div>
      {p.tech&&<div style={{color:accent,fontSize:9.5,fontWeight: 600, marginBottom:3}}>{p.tech}</div>}
      <ul style={{margin:0,paddingLeft:16}}>
        {p.bullets.filter(b=>b.trim()).map((b,j)=><li key={j} style={{marginBottom:3,color:"#333",fontSize:small?10:10.5,lineHeight:1.6}}>{b}</li>)}
      </ul>
    </div>
  );
}

function EduBlock({e, small, isSelection}){
  return(
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
      <div>
        <div style={{fontWeight:700,fontSize:small?10.5:12, color: "#111"}}>{e.school}</div>
        <div style={{color:"#444",fontSize:small?9.5:10.5, fontWeight: 500}}>{e.degree}{e.field?` in ${e.field}`:""}{e.gpa?` | GPA: ${e.gpa}`:""}</div>
      </div>
      <div style={{fontSize:10, fontWeight: 500, color:"#666",flexShrink:0}}>{e.year}</div>
    </div>
  );
}

function SkillsBlock({skills, small, color = "#444", isSelection}) {
  if(!skills) return null;
  if(skills.includes(":")) {
    const lines = skills.split(/[\n\r]/).filter(l => l.trim());
    return (
      <div style={{marginTop: 4}}>
        {lines.map((line, i) => {
          const parts = line.split(":");
          if(parts.length > 1) {
            return (
              <div key={i} style={{marginBottom: 4, fontSize: small ? 9 : 10.2, lineHeight: 1.4, color}}>
                <span style={{fontWeight: 700}}>{parts[0].trim()}:</span> {parts[1].split(/[,;]/).map(s => s.trim()).filter(s => s).join(" • ")}
              </div>
            );
          }
          return <div key={i} style={{marginBottom: 4, fontSize: small ? 9 : 10.2, lineHeight: 1.4, color}}>{line}</div>;
        })}
      </div>
    );
  }
  return (
    <div style={{fontSize: small ? 9 : 10.2, color, lineHeight: 1.6, marginTop: 4}}>
      {skills.split(/[,;]/).map((s, i, arr) => (
        <React.Fragment key={i}>
          {s.trim()}
          {i < arr.length - 1 && arr[i+1]?.trim() && <span style={{margin: "0 8px", color: "#999"}}>•</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

function SidebarSec({title,color,children}){
  return(
    <div style={{marginBottom:14}}>
      <div style={{fontSize:8,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.14em",color,borderBottom:`1px solid ${color}40`,paddingBottom:3,marginBottom:6}}>{title}</div>
      {children}
    </div>
  );
}

export function ResumeDoc({data:d, tid, refProp, isSelection}){
  const expList = d.experience.filter(e=>has(e.company));
  const eduList = d.education.filter(e=>has(e.school));
  const projList = (d.projects||[]).filter(p=>has(p.title));
  const base = {
    background: "#fff",
    color: "#111",
    fontSize: 11.5,
    lineHeight: 1.6,
    width: "794px",
    minHeight: "1123px",
    boxSizing: "border-box",
    overflow: "hidden",
    position: "relative"
  };

  if(tid==="minimal") return(
    <div ref={refProp} style={{...base,fontFamily:"Georgia, serif",padding:"48px 54px"}}>
      <div style={{borderBottom:"1px solid #111",paddingBottom:16,marginBottom:20, display: "flex", justifyContent: "space-between", alignItems: "flex-start"}}>
        <div>
          <div style={{fontSize:26,fontWeight:700,letterSpacing:"-0.02em", color: "#000"}}>{d.name||"Your Name"}</div>
          <div style={{fontSize:13,fontWeight: 500, color:"#444",marginTop:4}}>{d.title}</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:"12px 18px",marginTop:10,fontSize:10,color:"#555"}}>
            {d.email&&<span style={{display:"flex",alignItems:"center",gap:4}}>{d.email}</span>}
            {d.phone&&<span style={{display:"flex",alignItems:"center",gap:4}}>{d.phone}</span>}
            {d.location&&<span style={{display:"flex",alignItems:"center",gap:4}}>{d.location}</span>}
            {d.linkedin&&<span style={{display:"flex",alignItems:"center",gap:4}}>{d.linkedin}</span>}
          </div>
        </div>
        {d.showPhoto && d.photo && <div style={{width: 75, height: 75, borderRadius: 4, overflow: "hidden", border: "1px solid #eee", flexShrink: 0, marginLeft: 20}}><img src={d.photo} style={{width: "100%", height: "100%", objectFit: "cover"}} /></div>}
      </div>
      {has(d.summary)&&<><div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:"#000",marginBottom:8,marginTop:16}}>Professional Summary</div><p style={{margin:"0 0 16px",color:"#333",lineHeight:1.7,textAlign:"justify", fontSize: 10.5}}>{d.summary}</p></>}
      {expList.length>0&&<><div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:"#000",marginBottom:10,marginTop:16}}>Experience</div>{expList.map((e,i)=><ExpBlock key={i} e={e} accent="#111" isSelection={isSelection}/>)}</>}
      {projList.length>0&&<><div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:"#000",marginBottom:10,marginTop:16}}>Key Projects</div>{projList.map((p,i)=><ProjBlock key={i} p={p} accent="#111" isSelection={isSelection}/>)}</>}
      {has(d.skills)&&<><div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:"#000",marginBottom:8,marginTop:16}}>Skills</div><SkillsBlock skills={d.skills} color="#333" isSelection={isSelection}/></>}
      {eduList.length>0&&<><div style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:"#000",marginBottom:8,marginTop:16}}>Education</div>{eduList.map((e,i)=><EduBlock key={i} e={e} isSelection={isSelection}/>)}</>}
    </div>
  );

  if(tid==="executive") return(
    <div ref={refProp} style={{...base,fontFamily:"'Inter', sans-serif",display:"flex",minHeight:"1123px"}}>
      <div style={{width:220,background:"#0f172a",color:"#f8fafc",padding:"40px 24px",flexShrink:0}}>
        {d.showPhoto && d.photo && <div style={{width: 90, height: 90, borderRadius: "50%", overflow: "hidden", border: "3px solid #334155", margin: "0 auto 24px", background: "#fff"}}><img src={d.photo} style={{width: "100%", height: "100%", objectFit: "cover"}} /></div>}
        <div style={{fontSize:18,fontWeight:800,lineHeight:1.2,marginBottom:6,wordBreak:"break-word", letterSpacing: "-0.01em"}}>{d.name||"Your Name"}</div>
        <div style={{fontSize:10,fontWeight: 600, color:"#94a3b8",marginBottom:24,textTransform: "uppercase", letterSpacing: "0.05em"}}>{d.title}</div>
        <SidebarSec title="Contact" color="#3b82f6">
          <div style={{display: "flex", flexDirection: "column", gap: 6}}>
            {d.email&&<div style={{fontSize:9,wordBreak:"break-all", fontWeight: 500}}>{d.email}</div>}
            {d.phone&&<div style={{fontSize:9, fontWeight: 500}}>{d.phone}</div>}
            {d.location&&<div style={{fontSize:9, fontWeight: 500}}>{d.location}</div>}
            {d.linkedin&&<div style={{fontSize:9,wordBreak:"break-all", fontWeight: 500}}>{d.linkedin}</div>}
          </div>
        </SidebarSec>
        {has(d.skills)&&<SidebarSec title="Expertise" color="#3b82f6"><SkillsBlock skills={d.skills} color="#f1f5f9" small/></SidebarSec>}
        {has(d.languages)&&<SidebarSec title="Languages" color="#3b82f6"><div style={{fontSize:9.5, fontWeight: 500}}>{d.languages}</div></SidebarSec>}
        {has(d.certifications)&&<SidebarSec title="Certifications" color="#3b82f6"><div style={{fontSize:9.5, fontWeight: 500}}>{d.certifications}</div></SidebarSec>}
      </div>
      <div style={{flex:1,padding:"44px 34px", background: "#fcfcfc"}}>
        {has(d.summary)&&<><div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.1em",color:"#0f172a",borderBottom:"2px solid #e2e8f0",paddingBottom:4,marginBottom:12}}>Profile</div><p style={{margin:"0 0 20px",fontSize:10.5,lineHeight:1.7,color:"#334155", textAlign: "justify"}}>{d.summary}</p></>}
        {expList.length>0&&<><div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.1em",color:"#0f172a",borderBottom:"2px solid #e2e8f0",paddingBottom:4,marginBottom:12,marginTop:20}}>Professional Experience</div>{expList.map((e,i)=><ExpBlock key={i} e={e} accent="#1e3a5f" small/>)}</>}
        {projList.length>0&&<><div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.1em",color:"#0f172a",borderBottom:"2px solid #e2e8f0",paddingBottom:4,marginBottom:12,marginTop:20}}>Representative Projects</div>{projList.map((p,i)=><ProjBlock key={i} p={p} accent="#1e3a5f" small/>)}</>}
        {eduList.length>0&&<><div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.1em",color:"#0f172a",borderBottom:"2px solid #e2e8f0",paddingBottom:4,marginBottom:12,marginTop:20}}>Education</div>{eduList.map((e,i)=><EduBlock key={i} e={e} small/>)}</>}
      </div>
    </div>
  );

  if(tid==="emerald") return(
    <div ref={refProp} style={{...base,fontFamily:"'Inter', sans-serif"}}>
      <div style={{background:"#064e3b",color:"#fff",padding:"30px 42px", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div>
          <div style={{fontSize:24,fontWeight:800, letterSpacing: "-0.01em"}}>{d.name||"Your Name"}</div>
          <div style={{fontSize:11,fontWeight: 600, color:"#6ee7b7",marginTop:4, textTransform: "uppercase", letterSpacing: "0.05em"}}>{d.title}</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:20,marginTop:10,fontSize:10,color:"#a7f3d0"}}>
            {d.email&&<span>✉ {d.email}</span>}{d.phone&&<span>☎ {d.phone}</span>}
            {d.location&&<span>⚲ {d.location}</span>}
          </div>
        </div>
        {d.showPhoto && d.photo && <div style={{width: 70, height: 70, borderRadius: "50%", overflow: "hidden", border: "2px solid #059669", flexShrink: 0, background: "#fff"}}><img src={d.photo} style={{width: "100%", height: "100%", objectFit: "cover"}} /></div>}
      </div>
      <div style={{padding:"28px 42px"}}>
        {["Summary","Experience","Projects","Skills","Education"].map(sec=>{
          const titles = {Summary: "Professional Summary", Experience: "Experience", Projects: "Key Projects", Skills: "Expertise", Education: "Education"};
          if(sec==="Summary"&&!has(d.summary)) return null;
          if(sec==="Experience"&&!expList.length) return null;
          if(sec==="Projects"&&!projList.length) return null;
          if(sec==="Skills"&&!has(d.skills)) return null;
          if(sec==="Education"&&!eduList.length) return null;
          return(<div key={sec}>
            <div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.1em",borderBottom:"2px solid #064e3b",color:"#064e3b",paddingBottom:4,marginBottom:12,marginTop:20}}>{titles[sec]}</div>
            {sec==="Summary"&&<p style={{margin:"0 0 16px",color:"#374151",lineHeight:1.7, fontSize: 10.5, textAlign: "justify"}}>{d.summary}</p>}
            {sec==="Experience"&&expList.map((e,i)=><ExpBlock key={i} e={e} accent="#059669"/>)}
            {sec==="Projects"&&projList.map((p,i)=><ProjBlock key={i} p={p} accent="#059669"/>)}
            {sec==="Skills"&&<SkillsBlock skills={d.skills} color="#374151"/>}
            {sec==="Education"&&eduList.map((e,i)=><EduBlock key={i} e={e}/>)}
          </div>);
        })}
      </div>
    </div>
  );

  if(tid==="bold") return(
    <div ref={refProp} style={{...base,fontFamily:"Arial,sans-serif",padding:"30px 40px"}}>
      <div style={{marginBottom:18, display: "flex", justifyContent: "space-between", alignItems: "flex-end"}}>
        <div>
          <div style={{fontSize:26,fontWeight:900,letterSpacing:"-0.03em",textTransform:"uppercase",color:"#000"}}>{d.name||"YOUR NAME"}</div>
          <div style={{fontSize:12,fontWeight:700,color:"#f59e0b",textTransform:"uppercase",letterSpacing:"0.14em",marginTop:2}}>{d.title}</div>
        </div>
        {d.showPhoto && d.photo && <div style={{width: 80, height: 80, overflow: "hidden", border: "3px solid #000", flexShrink: 0}}><img src={d.photo} style={{width: "100%", height: "100%", objectFit: "cover"}} /></div>}
      </div>
      <div style={{height:3,background:"#000",margin:"9px 0 8px"}}/>
      <div style={{display:"flex",flexWrap:"wrap",gap:18,fontSize:10,color:"#666"}}>
        {d.email&&<span>{d.email}</span>}{d.phone&&<span>{d.phone}</span>}
        {d.location&&<span>{d.location}</span>}{d.linkedin&&<span>{d.linkedin}</span>}
      </div>
      {has(d.summary)&&<><div style={{background:"#000",color:"#fff",padding:"3px 8px",fontSize:8.5,fontWeight:900,letterSpacing:"0.12em",marginBottom:7,marginTop:12,display:"inline-block"}}>SUMMARY</div><p style={{margin:"0 0 14px",color:"#333",lineHeight:1.65}}>{d.summary}</p></>}
      {expList.length>0&&<><div style={{background:"#000",color:"#fff",padding:"3px 8px",fontSize:8.5,fontWeight:900,letterSpacing:"0.12em",marginBottom:8,marginTop:14,display:"inline-block"}}>EXPERIENCE</div>{expList.map((e,i)=><ExpBlock key={i} e={e} accent="#f59e0b"/>)}</>}
      {projList.length>0&&<><div style={{background:"#000",color:"#fff",padding:"3px 8px",fontSize:8.5,fontWeight:900,letterSpacing:"0.12em",marginBottom:8,marginTop:14,display:"inline-block"}}>PROJECTS</div>{projList.map((p,i)=><ProjBlock key={i} p={p} accent="#f59e0b"/>)}</>}
      {has(d.skills)&&<><div style={{background:"#000",color:"#fff",padding:"3px 8px",fontSize:8.5,fontWeight:900,letterSpacing:"0.12em",marginBottom:7,marginTop:14,display:"inline-block"}}>SKILLS</div><SkillsBlock skills={d.skills} color="#333"/></>}
      {eduList.length>0&&<><div style={{background:"#000",color:"#fff",padding:"3px 8px",fontSize:8.5,fontWeight:900,letterSpacing:"0.12em",marginBottom:7,marginTop:14,display:"inline-block"}}>EDUCATION</div>{eduList.map((e,i)=><EduBlock key={i} e={e}/>)}</>}
    </div>
  );

  if(tid==="slate") return(
    <div ref={refProp} style={{...base,fontFamily:"'Inter', sans-serif"}}>
      <div style={{background:"#0f172a",color:"#f8fafc",padding:"32px 42px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {d.showPhoto && d.photo && <div style={{width: 70, height: 70, borderRadius: 12, overflow: "hidden", border: "2px solid #334155", flexShrink: 0}}><img src={d.photo} style={{width: "100%", height: "100%", objectFit: "cover"}} /></div>}
          <div>
            <div style={{fontSize:24,fontWeight:800, letterSpacing: "-0.01em"}}>{d.name||"Your Name"}</div>
            <div style={{fontSize:11,fontWeight: 600, color:"#94a3b8",marginTop:4, textTransform: "uppercase", letterSpacing: "0.05em"}}>{d.title}</div>
          </div>
        </div>
        <div style={{fontSize:10,fontWeight: 500, color:"#94a3b8",textAlign:"right",lineHeight:1.6}}>
          {d.email&&<div>{d.email}</div>}
          {d.phone&&<div>{d.phone}</div>}
          {d.location&&<div>{d.location}</div>}
        </div>
      </div>
      <div style={{padding:"28px 42px"}}>
        {has(d.summary)&&<><div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.1em",borderBottom:"2px solid #e2e8f0",color:"#0f172a",paddingBottom:4,marginBottom:12}}>Professional Summary</div><p style={{margin:"0 0 16px",color:"#475569",lineHeight:1.7, fontSize: 10.5}}>{d.summary}</p></>}
        {expList.length>0&&<><div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.1em",borderBottom:"2px solid #e2e8f0",color:"#0f172a",paddingBottom:4,marginBottom:12,marginTop:20}}>Experience</div>{expList.map((e,i)=><ExpBlock key={i} e={e} accent="#334155"/>)}</>}
        {projList.length>0&&<><div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.1em",borderBottom:"2px solid #e2e8f0",color:"#0f172a",paddingBottom:4,marginBottom:12,marginTop:20}}>Projects</div>{projList.map((p,i)=><ProjBlock key={i} p={p} accent="#334155"/>)}</>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:32,marginTop:20}}>
          <div>{has(d.skills)&&<><div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.1em",borderBottom:"2px solid #e2e8f0",color:"#0f172a",paddingBottom:4,marginBottom:12}}>Expertise</div><SkillsBlock skills={d.skills} color="#475569" small/></>}</div>
          <div>{eduList.length>0&&<><div style={{fontSize:10,fontWeight:800,textTransform:"uppercase",letterSpacing:"0.1em",borderBottom:"2px solid #e2e8f0",color:"#0f172a",paddingBottom:4,marginBottom:12}}>Education</div>{eduList.map((e,i)=><EduBlock key={i} e={e}/>)}</>}</div>
        </div>
      </div>
    </div>
  );

  if(tid==="crimson") return(
    <div ref={refProp} style={{...base,fontFamily:"'Times New Roman',serif",padding:"30px 40px"}}>
      <div style={{borderLeft:"5px solid #991b1b",paddingLeft:14,marginBottom:16, display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div>
          <div style={{fontSize:22,fontWeight:700}}>{d.name||"Your Name"}</div>
          <div style={{fontSize:11,color:"#991b1b",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginTop:2}}>{d.title}</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:14,marginTop:7,fontSize:10,color:"#666"}}>{d.email&&<span>{d.email}</span>}{d.phone&&<span>{d.phone}</span>}{d.location&&<span>{d.location}</span>}{d.linkedin&&<span>{d.linkedin}</span>}</div>
        </div>
        {d.showPhoto && d.photo && <div style={{width: 70, height: 70, borderRadius: 4, overflow: "hidden", border: "1px solid #fca5a5", flexShrink: 0}}><img src={d.photo} style={{width: "100%", height: "100%", objectFit: "cover"}} /></div>}
      </div>
      {has(d.summary)&&<><div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",borderBottom:"1px solid #fca5a5",color:"#991b1b",paddingBottom:2,marginBottom:7}}>Professional Summary</div><p style={{margin:"0 0 12px",color:"#333",lineHeight:1.7}}>{d.summary}</p></>}
      {expList.length>0&&<><div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",borderBottom:"1px solid #fca5a5",color:"#991b1b",paddingBottom:2,marginBottom:7,marginTop:12}}>Work Experience</div>{expList.map((e,i)=><ExpBlock key={i} e={e} accent="#991b1b"/>)}</>}
      {projList.length>0&&<><div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",borderBottom:"1px solid #fca5a5",color:"#991b1b",paddingBottom:2,marginBottom:7,marginTop:12}}>Projects</div>{projList.map((p,i)=><ProjBlock key={i} p={p} accent="#991b1b"/>)}</>}
      {has(d.skills)&&<><div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",borderBottom:"1px solid #fca5a5",color:"#991b1b",paddingBottom:2,marginBottom:7,marginTop:12}}>Technical Skills</div><SkillsBlock skills={d.skills} color="#333"/></>}
      {eduList.length>0&&<><div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",borderBottom:"1px solid #fca5a5",color:"#991b1b",paddingBottom:2,marginBottom:7,marginTop:12}}>Education</div>{eduList.map((e,i)=><EduBlock key={i} e={e}/>)}</>}
    </div>
  );

  if(tid==="teal") return(
    <div ref={refProp} style={{...base,fontFamily:"Verdana,sans-serif",display:"flex",minHeight:800}}>
      <div style={{width:178,background:"#134e4a",color:"#f0fdfa",padding:"24px 14px",flexShrink:0}}>
        {d.showPhoto && d.photo && <div style={{width: 70, height: 70, borderRadius: "50%", overflow: "hidden", border: "2px solid #5eead4", margin: "0 auto 16px", background: "#fff"}}><img src={d.photo} style={{width: "100%", height: "100%", objectFit: "cover"}} /></div>}
        <div style={{textAlign:"center",marginBottom:16}}>
          <div style={{width:46,height:46,borderRadius:"50%",background:"#0f766e",margin:"0 auto 8px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:700,color:"#fff"}}>{(d.name||"?").charAt(0)}</div>
          <div style={{fontSize:12,fontWeight:700,lineHeight:1.3}}>{d.name||"Your Name"}</div>
          <div style={{fontSize:9,color:"#5eead4",marginTop:2,fontStyle:"italic"}}>{d.title}</div>
        </div>
        <SidebarSec title="Contact" color="#5eead4">
          {d.email&&<div style={{fontSize:8.5,marginBottom:2,wordBreak:"break-all"}}>{d.email}</div>}
          {d.phone&&<div style={{fontSize:8.5,marginBottom:2}}>{d.phone}</div>}
          {d.location&&<div style={{fontSize:8.5,marginBottom:2}}>{d.location}</div>}
        </SidebarSec>
        {has(d.skills)&&<SidebarSec title="Skills" color="#5eead4"><SkillsBlock skills={d.skills} color="#f0fdfa" small/></SidebarSec>}
        {eduList.length>0&&<SidebarSec title="Education" color="#5eead4">{eduList.map((e,i)=><div key={i} style={{marginBottom:5}}><div style={{fontSize:9,fontWeight:700}}>{e.school}</div><div style={{fontSize:8,color:"#99f6e4"}}>{e.degree}</div><div style={{fontSize:8,color:"#5eead4"}}>{e.year}</div></div>)}</SidebarSec>}
        {has(d.languages)&&<SidebarSec title="Languages" color="#5eead4"><div style={{fontSize:8.5}}>{d.languages}</div></SidebarSec>}
      </div>
      <div style={{flex:1,padding:"24px 18px"}}>
        {has(d.summary)&&<><div style={{fontSize:8.5,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",borderBottom:"1px solid #5eead4",color:"#0f766e",paddingBottom:2,marginBottom:6}}>About Me</div><p style={{margin:"0 0 12px",fontSize:10,lineHeight:1.65,color:"#374151"}}>{d.summary}</p></>}
        {expList.length>0&&<><div style={{fontSize:8.5,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",borderBottom:"1px solid #5eead4",color:"#0f766e",paddingBottom:2,marginBottom:6,marginTop:10}}>Experience</div>{expList.map((e,i)=><ExpBlock key={i} e={e} accent="#0f766e" small/>)}</>}
        {projList.length>0&&<><div style={{fontSize:8.5,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",borderBottom:"1px solid #5eead4",color:"#0f766e",paddingBottom:2,marginBottom:6,marginTop:10}}>Projects</div>{projList.map((p,i)=><ProjBlock key={i} p={p} accent="#0f766e" small/>)}</>}
        {has(d.achievements)&&<><div style={{fontSize:8.5,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",borderBottom:"1px solid #5eead4",color:"#0f766e",paddingBottom:2,marginBottom:6,marginTop:10}}>Achievements</div><p style={{margin:"0",fontSize:10,color:"#374151"}}>{d.achievements}</p></>}
      </div>
    </div>
  );

  if(tid==="mono") return(
    <div ref={refProp} style={{...base,fontFamily:"'Courier New',monospace",padding:"26px 34px",background:"#fafaf9"}}>
      <div style={{borderBottom:"2px dashed #a3a3a3",paddingBottom:11,marginBottom:14, display: "flex", justifyContent: "space-between", alignItems: "flex-start"}}>
        <div>
          <div style={{fontSize:17,fontWeight:700,letterSpacing:"0.04em"}}>{d.name||"Your Name"}</div>
          <span style={{fontSize:10,fontWeight:700,color:"#a3e635",background:"#18181b",padding:"2px 8px",borderRadius:3,display:"inline-block",marginTop:3}}>{d.title||"// title"}</span>
          <div style={{display:"flex",flexWrap:"wrap",gap:14,marginTop:7,fontSize:9.5,color:"#737373"}}>{d.email&&<span>// {d.email}</span>}{d.phone&&<span>// {d.phone}</span>}{d.location&&<span>// {d.location}</span>}</div>
        </div>
        {d.showPhoto && d.photo && <div style={{width: 60, height: 60, borderRadius: 4, overflow: "hidden", border: "1px solid #a3a3a3", flexShrink: 0, filter: "grayscale(100%)"}}><img src={d.photo} style={{width: "100%", height: "100%", objectFit: "cover"}} /></div>}
      </div>
      {has(d.summary)&&<><div style={{fontSize:10,fontWeight:700,color:"#a3e635",marginBottom:5,marginTop:12}}>{"/* summary */"}</div><p style={{margin:"0 0 12px",color:"#404040",lineHeight:1.65,fontSize:10.5}}>{d.summary}</p></>}
      {expList.length>0&&<><div style={{fontSize:10,fontWeight:700,color:"#a3e635",marginBottom:6,marginTop:12}}>{"/* experience */"}</div>{expList.map((e,i)=><ExpBlock key={i} e={e} accent="#16a34a"/>)}</>}
      {projList.length>0&&<><div style={{fontSize:10,fontWeight:700,color:"#a3e635",marginBottom:6,marginTop:12}}>{"/* projects */"}</div>{projList.map((p,i)=><ProjBlock key={i} p={p} accent="#16a34a"/>)}</>}
      {has(d.skills)&&<><div style={{fontSize:10,fontWeight:700,color:"#a3e635",marginBottom:5,marginTop:12}}>{"/* skills */"}</div><SkillsBlock skills={d.skills} color="#404040"/></>}
      {eduList.length>0&&<><div style={{fontSize:10,fontWeight:700,color:"#a3e635",marginBottom:6,marginTop:12}}>{"/* education */"}</div>{eduList.map((e,i)=><div key={i} style={{marginBottom:7}}><div style={{fontSize:11,fontWeight:700}}>{e.school}</div><div style={{fontSize:9.5,color:"#737373"}}>{e.degree} · {e.year}{e.gpa?` · GPA: ${e.gpa}`:""}</div></div>)}</>}
    </div>
  );

  if(tid==="elegant") return(
    <div ref={refProp} style={{...base,fontFamily:"'Palatino Linotype',serif",padding:"30px 44px"}}>
      <div style={{textAlign:"center",marginBottom:16}}>
        <div style={{fontSize:24,fontWeight:400,letterSpacing:"0.12em",textTransform:"uppercase"}}>{d.name||"Your Name"}</div>
        <div style={{fontSize:10.5,color:"#78716c",letterSpacing:"0.2em",textTransform:"uppercase",marginTop:3}}>{d.title}</div>
        <div style={{width:50,height:1,background:"#d97706",margin:"9px auto"}}/>
        <div style={{display:"flex",justifyContent:"center",flexWrap:"wrap",gap:18,fontSize:10,color:"#78716c"}}>{d.email&&<span>{d.email}</span>}{d.phone&&<span>{d.phone}</span>}{d.location&&<span>{d.location}</span>}{d.linkedin&&<span>{d.linkedin}</span>}</div>
        {d.showPhoto && d.photo && <div style={{width: 80, height: 80, borderRadius: "50%", overflow: "hidden", border: "1px solid #d97706", margin: "16px auto 0", padding: 3}}><img src={d.photo} style={{width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover"}} /></div>}
      </div>
      {["summary","experience","projects","skills","education"].map(sec=>{
        const titles={summary:"Profile",experience:"Professional Experience",projects:"Notable Projects",skills:"Expertise",education:"Education"};
        if(sec==="summary"&&!has(d.summary)) return null;
        if(sec==="experience"&&!expList.length) return null;
        if(sec==="projects"&&!projList.length) return null;
        if(sec==="skills"&&!has(d.skills)) return null;
        if(sec==="education"&&!eduList.length) return null;
        return(<div key={sec}>
          <div style={{textAlign:"center",margin:"14px 0 8px"}}>
            <div style={{fontSize:9.5,letterSpacing:"0.2em",textTransform:"uppercase",color:"#d97706",fontWeight:400}}>{titles[sec]}</div>
            <div style={{height:1,background:"linear-gradient(90deg,transparent,#d97706,transparent)",marginTop:4}}/>
          </div>
          {sec==="summary"&&<p style={{margin:"0 0 12px",color:"#44403c",lineHeight:1.8,textAlign:"justify",fontStyle:"italic"}}>{d.summary}</p>}
          {sec==="experience"&&expList.map((e,i)=><ExpBlock key={i} e={e} accent="#d97706"/>)}
          {sec==="projects"&&projList.map((p,i)=><ProjBlock key={i} p={p} accent="#d97706"/>)}
          {sec==="skills"&&<SkillsBlock skills={d.skills} color="#44403c"/>}
          {sec==="education"&&eduList.map((e,i)=><EduBlock key={i} e={e}/>)}
        </div>);
      })}
    </div>
  );

  if(tid==="violet") return(
    <div ref={refProp} style={{...base,fontFamily:"'Segoe UI',sans-serif"}}>
      <div style={{background:"linear-gradient(135deg,#4c1d95,#7c3aed)",color:"#fff",padding:"26px 34px", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
        <div>
          <div style={{fontSize:21,fontWeight:700}}>{d.name||"Your Name"}</div>
          <div style={{fontSize:11,color:"#c4b5fd",marginTop:2}}>{d.title}</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:16,marginTop:9,fontSize:10,color:"#ddd8fe"}}>{d.email&&<span>✉ {d.email}</span>}{d.phone&&<span>☎ {d.phone}</span>}{d.location&&<span>⚲ {d.location}</span>}{d.linkedin&&<span>{d.linkedin}</span>}</div>
        </div>
        {d.showPhoto && d.photo && <div style={{width: 65, height: 65, borderRadius: 12, overflow: "hidden", border: "2px solid #ddd8fe", flexShrink: 0}}><img src={d.photo} style={{width: "100%", height: "100%", objectFit: "cover"}} /></div>}
      </div>
      <div style={{padding:"18px 34px"}}>
        {has(d.summary)&&<><div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",borderBottom:"2px solid #7c3aed",color:"#7c3aed",paddingBottom:2,marginBottom:7}}>About</div><p style={{margin:"0 0 12px",color:"#374151",lineHeight:1.65}}>{d.summary}</p></>}
        {expList.length>0&&<><div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",borderBottom:"2px solid #7c3aed",color:"#7c3aed",paddingBottom:2,marginBottom:7,marginTop:12}}>Experience</div>{expList.map((e,i)=><ExpBlock key={i} e={e} accent="#7c3aed"/>)}</>}
        {projList.length>0&&<><div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",borderBottom:"2px solid #7c3aed",color:"#7c3aed",paddingBottom:2,marginBottom:7,marginTop:12}}>Projects</div>{projList.map((p,i)=><ProjBlock key={i} p={p} accent="#7c3aed"/>)}</>}
        <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:18,marginTop:12}}>
          <div>{has(d.skills)&&<><div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",borderBottom:"2px solid #7c3aed",color:"#7c3aed",paddingBottom:2,marginBottom:7}}>Skills</div><SkillsBlock skills={d.skills} color="#374151" small/></>}</div>
          <div>
            {eduList.length>0&&<><div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",borderBottom:"2px solid #7c3aed",color:"#7c3aed",paddingBottom:2,marginBottom:7}}>Education</div>{eduList.map((e,i)=><EduBlock key={i} e={e} small/>)}</>}
            {has(d.certifications)&&<><div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",borderBottom:"2px solid #7c3aed",color:"#7c3aed",paddingBottom:2,marginBottom:7,marginTop:8}}>Certifications</div><p style={{margin:"0",fontSize:10,color:"#374151"}}>{d.certifications}</p></>}
          </div>
        </div>
        {has(d.achievements)&&<><div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",borderBottom:"2px solid #7c3aed",color:"#7c3aed",paddingBottom:2,marginBottom:7,marginTop:12}}>Achievements</div><p style={{margin:"0",color:"#374151",fontSize:11,lineHeight:1.7}}>{d.achievements}</p></>}
      </div>
    </div>
  );

  if(tid==="faang") return(
    <div ref={refProp} style={{...base,fontFamily:"'Times New Roman', Times, serif",padding:"40px 48px",color:"#000",lineHeight:1.4}}>
      <div style={{textAlign:"center",marginBottom:12}}>
        <div style={{fontSize:24,fontWeight:700,textTransform:"uppercase",letterSpacing:"1px"}}>{d.name||"FIRSTNAME LASTNAME"}</div>
        <div style={{fontSize:10,marginTop:4}}>
          {d.phone&&<span>{d.phone}</span>}
          {d.phone&&d.location&&<span style={{margin:"0 6px"}}>◊</span>}
          {d.location&&<span>{d.location}</span>}
        </div>
        <div style={{fontSize:10,marginTop:2,color:"#1a56cc"}}>
          {d.email&&<span>{d.email}</span>}
          {d.email&&d.linkedin&&<span style={{margin:"0 6px",color:"#000"}}>◊</span>}
          {d.linkedin&&<span>{d.linkedin}</span>}
          {d.website&&<span style={{margin:"0 6px",color:"#000"}}>◊</span>}
          {d.website&&<span>{d.website}</span>}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html:`
        .faang-sec { font-size: 11px; font-weight: 700; text-transform: uppercase; border-bottom: 1px solid #000; padding-bottom: 2px; margin-bottom: 6px; margin-top: 12px; }
        .faang-exp { margin-bottom: 8px; }
        .faang-exp-head { display: flex; justify-content: space-between; align-items: baseline; }
        .faang-exp-title { font-weight: 700; font-size: 11px; }
        .faang-exp-date { font-size: 10px; }
        .faang-exp-sub { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px; }
        .faang-exp-comp { font-size: 10.5px; font-style: italic; }
        .faang-exp-loc { font-size: 10px; font-style: italic; }
        .faang-ul { margin: 0; padding-left: 18px; }
        .faang-li { font-size: 10px; margin-bottom: 2px; }
      `}} />

      {has(d.summary)&&<><div className="faang-sec">Objective</div><div style={{fontSize:10.5}}>{d.summary}</div></>}

      {eduList.length>0&&<><div className="faang-sec">Education</div>{eduList.map((e,i)=>(
        <div key={i} className="faang-exp">
          <div className="faang-exp-head">
            <span className="faang-exp-title">{e.degree}{e.field?` in ${e.field}`:""}{e.school?`, ${e.school}`:""}</span>
            <span className="faang-exp-date">{e.year}</span>
          </div>
          {e.gpa&&<div className="faang-exp-comp">GPA: {e.gpa}</div>}
        </div>
      ))}</>}

      {has(d.skills)&&<><div className="faang-sec">Skills</div><div style={{fontSize:10.5}}>{d.skills.split(/[;,]/).map(s=>s.trim()).join(", ")}</div></>}

      {expList.length>0&&<><div className="faang-sec">Experience</div>{expList.map((e,i)=>(
        <div key={i} className="faang-exp">
          <div className="faang-exp-head">
            <span className="faang-exp-title">{e.role}</span>
            <span className="faang-exp-date">{e.start}{e.start&&(e.end||e.current)?" - ":""}{e.current?"Present":e.end}</span>
          </div>
          <div className="faang-exp-sub">
            <span className="faang-exp-comp">{e.company}</span>
            {e.location&&<span className="faang-exp-loc">{e.location}</span>}
          </div>
          <ul className="faang-ul">
            {e.bullets.filter(b=>b.trim()).map((b,j)=><li key={j} className="faang-li">{b}</li>)}
          </ul>
        </div>
      ))}</>}

      {projList.length>0&&<><div className="faang-sec">Projects</div>{projList.map((p,i)=>(
        <div key={i} className="faang-exp">
          <div style={{fontSize:10.5}}>
            <span style={{fontWeight:700}}>{p.title}</span> {p.tech&&<span style={{fontStyle:"italic"}}>| {p.tech}</span>}
          </div>
          <ul className="faang-ul">
            {p.bullets.filter(b=>b.trim()).map((b,j)=><li key={j} className="faang-li">{b}</li>)}
          </ul>
        </div>
      ))}</>}

      {has(d.achievements)&&<><div className="faang-sec">Extra-Curricular Activities / Leadership</div><div style={{fontSize:10.5,whiteSpace:"pre-wrap"}}>{d.achievements}</div></>}
    </div>
  );

  if(tid==="google") return(
    <div ref={refProp} style={{...base,fontFamily:"'Roboto', 'Inter', sans-serif",padding:"40px 48px",color:"#3c4043"}}>
      <div style={{display:"flex",alignItems:"center",marginBottom:24}}>
        {d.showPhoto && d.photo && <div style={{width: 64, height: 64, borderRadius: "50%", overflow: "hidden", marginRight: 24, flexShrink: 0}}><img src={d.photo} style={{width: "100%", height: "100%", objectFit: "cover"}} /></div>}
        <div style={{flex:1}}>
          <div style={{fontSize:28,fontWeight:400,color:"#202124"}}>{d.name||"Your Name"}</div>
          <div style={{fontSize:14,color:"#1a73e8",marginTop:4}}>{d.title}</div>
        </div>
        <div style={{fontSize:11,textAlign:"right",color:"#5f6368"}}>
          {d.email&&<div>{d.email}</div>}
          {d.phone&&<div>{d.phone}</div>}
          {d.location&&<div>{d.location}</div>}
          {d.linkedin&&<div>{d.linkedin}</div>}
        </div>
      </div>
      
      {has(d.summary)&&<><div style={{fontSize:13,fontWeight:500,color:"#1a73e8",marginBottom:8}}>Summary</div><p style={{fontSize:11,lineHeight:1.6,marginBottom:24}}>{d.summary}</p></>}
      
      {expList.length>0&&<><div style={{fontSize:13,fontWeight:500,color:"#1a73e8",marginBottom:12}}>Experience</div>{expList.map((e,i)=>(
        <div key={i} style={{marginBottom:16,display:"flex"}}>
          <div style={{width:120,flexShrink:0,fontSize:10.5,color:"#5f6368"}}>{e.start}{e.start&&(e.end||e.current)?" — ":""}{e.current?"Present":e.end}</div>
          <div>
            <div style={{fontWeight:500,fontSize:12,color:"#202124"}}>{e.role}</div>
            <div style={{fontSize:11,color:"#1a73e8",marginBottom:6}}>{e.company}</div>
            <ul style={{margin:0,paddingLeft:16,fontSize:11,lineHeight:1.5}}>
              {e.bullets.filter(b=>b.trim()).map((b,j)=><li key={j} style={{marginBottom:4}}>{b}</li>)}
            </ul>
          </div>
        </div>
      ))}</>}
      
      <div style={{display:"flex",gap:32,marginTop:8}}>
        <div style={{flex:1}}>
          {eduList.length>0&&<><div style={{fontSize:13,fontWeight:500,color:"#1a73e8",marginBottom:12}}>Education</div>{eduList.map((e,i)=>(
            <div key={i} style={{marginBottom:12}}>
              <div style={{fontWeight:500,fontSize:11.5,color:"#202124"}}>{e.degree}</div>
              <div style={{fontSize:11,color:"#5f6368"}}>{e.school}</div>
              <div style={{fontSize:10.5,color:"#80868b"}}>{e.year}</div>
            </div>
          ))}</>}
        </div>
        <div style={{flex:1}}>
          {has(d.skills)&&<><div style={{fontSize:13,fontWeight:500,color:"#1a73e8",marginBottom:12}}>Skills</div><div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {d.skills.split(/[;,]/).filter(s=>s.trim()).map((s,i)=>(
              <span key={i} style={{background:"#f1f3f4",color:"#3c4043",padding:"4px 10px",borderRadius:16,fontSize:10.5,fontWeight:500}}>{s.trim()}</span>
            ))}
          </div></>}
        </div>
      </div>
    </div>
  );

  if(tid==="amazon") return(
    <div ref={refProp} style={{...base,fontFamily:"'Amazon Ember', Arial, sans-serif",padding:"36px 44px"}}>
      <div style={{borderBottom:"3px solid #232F3E",paddingBottom:16,marginBottom:20}}>
        <div style={{fontSize:26,fontWeight:800,color:"#232F3E"}}>{d.name||"Your Name"}</div>
        <div style={{fontSize:13,color:"#e47911",fontWeight:700,marginTop:2}}>{d.title}</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:16,marginTop:8,fontSize:10.5,color:"#555"}}>
          {d.email&&<span>Email: {d.email}</span>}
          {d.phone&&<span>Phone: {d.phone}</span>}
          {d.location&&<span>Location: {d.location}</span>}
        </div>
      </div>
      <div style={{display:"flex",gap:24}}>
        <div style={{flex:2}}>
          {has(d.summary)&&<><div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",color:"#232F3E",marginBottom:8}}>Customer-Obsessed Summary</div><p style={{fontSize:11,lineHeight:1.6,marginBottom:20}}>{d.summary}</p></>}
          
          {expList.length>0&&<><div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",color:"#232F3E",marginBottom:12}}>Professional Experience</div>{expList.map((e,i)=>(
            <div key={i} style={{marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
                <span style={{fontSize:12,fontWeight:700,color:"#232F3E"}}>{e.role}</span>
                <span style={{fontSize:10,color:"#666"}}>{e.start} - {e.end||"Present"}</span>
              </div>
              <div style={{fontSize:11,color:"#e47911",fontWeight:700,marginBottom:6}}>{e.company}</div>
              <ul style={{margin:0,paddingLeft:16,fontSize:11,lineHeight:1.6}}>
                {e.bullets.filter(b=>b.trim()).map((b,j)=><li key={j} style={{marginBottom:4}}>{b}</li>)}
              </ul>
            </div>
          ))}</>}
        </div>
        <div style={{flex:1}}>
          {has(d.skills)&&<><div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",color:"#232F3E",marginBottom:8}}>Core Competencies</div><ul style={{paddingLeft:14,fontSize:10.5,lineHeight:1.8,marginBottom:20,color:"#444"}}>{d.skills.split(/[;,]/).filter(s=>s.trim()).map((s,i)=><li key={i}>{s.trim()}</li>)}</ul></>}
          
          {eduList.length>0&&<><div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",color:"#232F3E",marginBottom:8}}>Basic Qualifications</div>{eduList.map((e,i)=>(
            <div key={i} style={{marginBottom:10,fontSize:10.5,color:"#444",lineHeight:1.5}}>
              <div style={{fontWeight:700,color:"#232F3E"}}>{e.degree}</div>
              <div>{e.school}</div>
              <div>{e.year}</div>
            </div>
          ))}</>}
        </div>
      </div>
    </div>
  );

  if(tid==="microsoft") return(
    <div ref={refProp} style={{...base,fontFamily:"'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",padding:"40px 48px",color:"#333"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",borderBottom:"2px solid #0078D4",paddingBottom:16,marginBottom:20}}>
        <div>
          <div style={{fontSize:28,fontWeight:600,color:"#000",marginBottom:4}}>{d.name||"Your Name"}</div>
          <div style={{fontSize:14,color:"#0078D4",fontWeight:600}}>{d.title}</div>
        </div>
        <div style={{textAlign:"right",fontSize:10.5,color:"#666",lineHeight:1.6}}>
          {d.email&&<div>{d.email}</div>}
          {d.phone&&<div>{d.phone}</div>}
          {d.location&&<div>{d.location}</div>}
          {d.linkedin&&<div>{d.linkedin}</div>}
        </div>
      </div>
      
      {has(d.summary)&&<><div style={{fontSize:12,fontWeight:600,textTransform:"uppercase",color:"#0078D4",marginBottom:8}}>Professional Summary</div><p style={{fontSize:11,lineHeight:1.6,marginBottom:20}}>{d.summary}</p></>}
      
      {expList.length>0&&<><div style={{fontSize:12,fontWeight:600,textTransform:"uppercase",color:"#0078D4",marginBottom:12}}>Work Experience</div>{expList.map((e,i)=>(
        <div key={i} style={{marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
            <div style={{fontSize:12,fontWeight:600,color:"#000"}}>{e.role}</div>
            <div style={{fontSize:10.5,color:"#666",fontWeight:600}}>{e.start} - {e.end||"Present"}</div>
          </div>
          <div style={{fontSize:11,color:"#0078D4",marginBottom:8}}>{e.company}</div>
          <ul style={{margin:0,paddingLeft:16,fontSize:11,lineHeight:1.5}}>
            {e.bullets.filter(b=>b.trim()).map((b,j)=><li key={j} style={{marginBottom:4}}>{b}</li>)}
          </ul>
        </div>
      ))}</>}
      
      {eduList.length>0&&<><div style={{fontSize:12,fontWeight:600,textTransform:"uppercase",color:"#0078D4",marginBottom:12}}>Education</div>{eduList.map((e,i)=>(
        <div key={i} style={{marginBottom:12,display:"flex",justifyContent:"space-between"}}>
          <div>
            <div style={{fontWeight:600,fontSize:11.5,color:"#000"}}>{e.degree}</div>
            <div style={{fontSize:11,color:"#666"}}>{e.school}</div>
          </div>
          <div style={{fontSize:10.5,color:"#666",fontWeight:600}}>{e.year}</div>
        </div>
      ))}</>}
      
      {has(d.skills)&&<><div style={{fontSize:12,fontWeight:600,textTransform:"uppercase",color:"#0078D4",marginBottom:8}}>Skills & Technologies</div><div style={{fontSize:11,lineHeight:1.6,color:"#333"}}>{d.skills}</div></>}
    </div>
  );

  if(tid==="apple") return(
    <div ref={refProp} style={{...base,fontFamily:"-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif",padding:"48px 56px",backgroundColor:"#fff",color:"#1d1d1f"}}>
      <div style={{textAlign:"center",marginBottom:40}}>
        <div style={{fontSize:32,fontWeight:600,letterSpacing:"-0.02em",marginBottom:8}}>{d.name||"Your Name"}</div>
        <div style={{fontSize:14,color:"#86868b",fontWeight:400,letterSpacing:"-0.01em"}}>{d.title}</div>
        <div style={{display:"flex",justifyContent:"center",gap:24,marginTop:16,fontSize:11,color:"#515154"}}>
          {d.email&&<span>{d.email}</span>}
          {d.phone&&<span>{d.phone}</span>}
          {d.location&&<span>{d.location}</span>}
        </div>
      </div>
      
      {has(d.summary)&&<div style={{marginBottom:32,textAlign:"center",padding:"0 20px"}}><p style={{fontSize:12,lineHeight:1.7,color:"#1d1d1f"}}>{d.summary}</p></div>}
      
      {expList.length>0&&<div style={{marginBottom:32}}><div style={{fontSize:10,fontWeight:600,color:"#86868b",textTransform:"uppercase",letterSpacing:"0.05em",borderBottom:"1px solid #d2d2d7",paddingBottom:8,marginBottom:16}}>Experience</div>{expList.map((e,i)=>(
        <div key={i} style={{marginBottom:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:4}}>
            <div style={{fontSize:13,fontWeight:600,color:"#1d1d1f"}}>{e.company}</div>
            <div style={{fontSize:11,color:"#86868b"}}>{e.start} — {e.end||"Present"}</div>
          </div>
          <div style={{fontSize:12,color:"#515154",marginBottom:8}}>{e.role}</div>
          <ul style={{margin:0,paddingLeft:16,fontSize:11.5,lineHeight:1.6,color:"#1d1d1f"}}>
            {e.bullets.filter(b=>b.trim()).map((b,j)=><li key={j} style={{marginBottom:4}}>{b}</li>)}
          </ul>
        </div>
      ))}</div>}
      
      <div style={{display:"flex",gap:40}}>
        <div style={{flex:1}}>
          {eduList.length>0&&<div style={{marginBottom:32}}><div style={{fontSize:10,fontWeight:600,color:"#86868b",textTransform:"uppercase",letterSpacing:"0.05em",borderBottom:"1px solid #d2d2d7",paddingBottom:8,marginBottom:16}}>Education</div>{eduList.map((e,i)=>(
            <div key={i} style={{marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:600,color:"#1d1d1f"}}>{e.school}</div>
              <div style={{fontSize:11.5,color:"#515154",marginTop:2}}>{e.degree}</div>
              <div style={{fontSize:11,color:"#86868b",marginTop:2}}>{e.year}</div>
            </div>
          ))}</div>}
        </div>
        <div style={{flex:1}}>
          {has(d.skills)&&<div><div style={{fontSize:10,fontWeight:600,color:"#86868b",textTransform:"uppercase",letterSpacing:"0.05em",borderBottom:"1px solid #d2d2d7",paddingBottom:8,marginBottom:16}}>Skills</div><div style={{fontSize:11.5,lineHeight:1.7,color:"#1d1d1f"}}>{d.skills.split(/[;,]/).map(s=>s.trim()).join(" • ")}</div></div>}
        </div>
      </div>
    </div>
  );

  if(tid==="meta") return(
    <div ref={refProp} style={{...base,fontFamily:"Helvetica, Arial, sans-serif",padding:"40px",backgroundColor:"#fff",color:"#1c1e21"}}>
      <div style={{display:"flex",gap:24,marginBottom:24,alignItems:"center"}}>
        <div style={{width:80,height:80,backgroundColor:"#1877f2",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:32,fontWeight:700,flexShrink:0}}>{d.name ? d.name.charAt(0) : "M"}</div>
        <div style={{flex:1}}>
          <div style={{fontSize:28,fontWeight:700,color:"#1c1e21",marginBottom:4}}>{d.name||"Your Name"}</div>
          <div style={{fontSize:16,color:"#1877f2",fontWeight:600}}>{d.title}</div>
        </div>
        <div style={{fontSize:11,color:"#606770",textAlign:"right",lineHeight:1.6}}>
          {d.email&&<div>{d.email}</div>}
          {d.phone&&<div>{d.phone}</div>}
          {d.location&&<div>{d.location}</div>}
        </div>
      </div>
      
      {has(d.summary)&&<div style={{marginBottom:20}}><p style={{fontSize:12,lineHeight:1.5,color:"#1c1e21"}}>{d.summary}</p></div>}
      
      {expList.length>0&&<div style={{marginBottom:24}}><div style={{fontSize:14,fontWeight:700,color:"#1877f2",borderBottom:"2px solid #e4e6eb",paddingBottom:4,marginBottom:12}}>Experience</div>{expList.map((e,i)=>(
        <div key={i} style={{marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}>
            <div style={{fontSize:13,fontWeight:700,color:"#1c1e21"}}>{e.role}</div>
            <div style={{fontSize:11,color:"#606770",fontWeight:600}}>{e.start} - {e.end||"Present"}</div>
          </div>
          <div style={{fontSize:12,color:"#606770",marginBottom:8}}>{e.company}</div>
          <ul style={{margin:0,paddingLeft:16,fontSize:11.5,lineHeight:1.5,color:"#1c1e21"}}>
            {e.bullets.filter(b=>b.trim()).map((b,j)=><li key={j} style={{marginBottom:4}}>{b}</li>)}
          </ul>
        </div>
      ))}</div>}
      
      <div style={{display:"flex",gap:24}}>
        <div style={{flex:1}}>
          {has(d.skills)&&<div><div style={{fontSize:14,fontWeight:700,color:"#1877f2",borderBottom:"2px solid #e4e6eb",paddingBottom:4,marginBottom:12}}>Skills</div><div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {d.skills.split(/[;,]/).filter(s=>s.trim()).map((s,i)=>(
              <span key={i} style={{backgroundColor:"#e7f3ff",color:"#1877f2",padding:"4px 8px",borderRadius:6,fontSize:11,fontWeight:600}}>{s.trim()}</span>
            ))}
          </div></div>}
        </div>
        <div style={{flex:1}}>
          {eduList.length>0&&<div><div style={{fontSize:14,fontWeight:700,color:"#1877f2",borderBottom:"2px solid #e4e6eb",paddingBottom:4,marginBottom:12}}>Education</div>{eduList.map((e,i)=>(
            <div key={i} style={{marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:700,color:"#1c1e21"}}>{e.degree}</div>
              <div style={{fontSize:11.5,color:"#606770",marginTop:2}}>{e.school}</div>
              <div style={{fontSize:11,color:"#606770",marginTop:2,fontWeight:600}}>{e.year}</div>
            </div>
          ))}</div>}
        </div>
      </div>
    </div>
  );

  if(tid==="stanford") return(
    <div ref={refProp} style={{...base,fontFamily:"'Palatino Linotype', 'Book Antiqua', Palatino, serif",padding:"44px 50px",backgroundColor:"#fff",color:"#333"}}>
      <div style={{textAlign:"center",marginBottom:24}}>
        <div style={{fontSize:28,fontWeight:700,color:"#8c1515",marginBottom:4,textTransform:"uppercase",letterSpacing:"1px"}}>{d.name||"Your Name"}</div>
        <div style={{fontSize:11,color:"#333"}}>
          {d.phone&&<span>{d.phone}</span>}{d.phone&&d.email&&<span> | </span>}{d.email&&<span>{d.email}</span>}{d.email&&d.linkedin&&<span> | </span>}{d.linkedin&&<span>{d.linkedin}</span>}
        </div>
      </div>
      
      {has(d.summary)&&<><div style={{fontSize:12,fontWeight:700,color:"#8c1515",borderBottom:"1px solid #8c1515",paddingBottom:2,marginBottom:8}}>PROFESSIONAL SUMMARY</div><p style={{fontSize:11,lineHeight:1.5,marginBottom:20}}>{d.summary}</p></>}
      
      {eduList.length>0&&<><div style={{fontSize:12,fontWeight:700,color:"#8c1515",borderBottom:"1px solid #8c1515",paddingBottom:2,marginBottom:12}}>EDUCATION</div>{eduList.map((e,i)=>(
        <div key={i} style={{marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
            <span style={{fontWeight:700,fontSize:11.5}}>{e.school}</span>
            <span style={{fontSize:10.5}}>{e.year}</span>
          </div>
          <div style={{fontSize:11,fontStyle:"italic"}}>{e.degree} {e.gpa?`| GPA: ${e.gpa}`:""}</div>
        </div>
      ))}</>}
      
      {expList.length>0&&<><div style={{fontSize:12,fontWeight:700,color:"#8c1515",borderBottom:"1px solid #8c1515",paddingBottom:2,marginBottom:12}}>EXPERIENCE</div>{expList.map((e,i)=>(
        <div key={i} style={{marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:4}}>
            <span style={{fontWeight:700,fontSize:11.5}}>{e.company}</span>
            <span style={{fontSize:10.5}}>{e.start} - {e.end||"Present"}</span>
          </div>
          <div style={{fontSize:11,fontStyle:"italic",marginBottom:6}}>{e.role} {e.location?`| ${e.location}`:""}</div>
          <ul style={{margin:0,paddingLeft:16,fontSize:11,lineHeight:1.4}}>
            {e.bullets.filter(b=>b.trim()).map((b,j)=><li key={j} style={{marginBottom:2}}>{b}</li>)}
          </ul>
        </div>
      ))}</>}
      
      {has(d.skills)&&<><div style={{fontSize:12,fontWeight:700,color:"#8c1515",borderBottom:"1px solid #8c1515",paddingBottom:2,marginBottom:8}}>SKILLS & INTERESTS</div><div style={{fontSize:11,lineHeight:1.5}}>{d.skills}</div></>}
    </div>
  );

  if(tid==="oxford") return(
    <div ref={refProp} style={{...base,fontFamily:"Georgia, serif",padding:"48px 56px",backgroundColor:"#fdfdfc",color:"#111827"}}>
      <div style={{borderLeft:"4px solid #002147",paddingLeft:24,marginBottom:32}}>
        <div style={{fontSize:36,fontWeight:400,letterSpacing:"-0.02em",color:"#002147",marginBottom:8}}>{d.name||"Your Name"}</div>
        <div style={{fontSize:14,color:"#4b5563",fontStyle:"italic"}}>{d.title}</div>
      </div>
      
      <div style={{display:"flex",gap:40}}>
        <div style={{width:"30%",flexShrink:0}}>
          <div style={{fontSize:11,lineHeight:1.8,color:"#4b5563",marginBottom:32}}>
            {d.email&&<div style={{marginBottom:4}}>{d.email}</div>}
            {d.phone&&<div style={{marginBottom:4}}>{d.phone}</div>}
            {d.location&&<div style={{marginBottom:4}}>{d.location}</div>}
            {d.linkedin&&<div style={{marginBottom:4}}>{d.linkedin}</div>}
          </div>
          
          {has(d.skills)&&<><div style={{fontSize:10,fontWeight:700,color:"#002147",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:12}}>Core Expertise</div><ul style={{listStyleType:"none",padding:0,margin:0,fontSize:11,lineHeight:1.8,color:"#4b5563"}}>
            {d.skills.split(/[;,]/).filter(s=>s.trim()).map((s,i)=><li key={i}>{s.trim()}</li>)}
          </ul></>}
        </div>
        
        <div style={{width:"70%"}}>
          {has(d.summary)&&<><div style={{fontSize:12,fontWeight:700,color:"#002147",textTransform:"uppercase",letterSpacing:"0.05em",borderBottom:"1px solid #e5e7eb",paddingBottom:8,marginBottom:12}}>Profile</div><p style={{fontSize:11.5,lineHeight:1.7,color:"#374151",marginBottom:24}}>{d.summary}</p></>}
          
          {expList.length>0&&<><div style={{fontSize:12,fontWeight:700,color:"#002147",textTransform:"uppercase",letterSpacing:"0.05em",borderBottom:"1px solid #e5e7eb",paddingBottom:8,marginBottom:16}}>Experience</div>{expList.map((e,i)=>(
            <div key={i} style={{marginBottom:24}}>
              <div style={{fontSize:13,fontWeight:400,color:"#111827"}}>{e.role}</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:8}}>
                <div style={{fontSize:11.5,fontStyle:"italic",color:"#4b5563"}}>{e.company}</div>
                <div style={{fontSize:10.5,color:"#6b7280"}}>{e.start} — {e.end||"Present"}</div>
              </div>
              <ul style={{margin:0,paddingLeft:16,fontSize:11.5,lineHeight:1.6,color:"#374151"}}>
                {e.bullets.filter(b=>b.trim()).map((b,j)=><li key={j} style={{marginBottom:6}}>{b}</li>)}
              </ul>
            </div>
          ))}</>}
          
          {eduList.length>0&&<><div style={{fontSize:12,fontWeight:700,color:"#002147",textTransform:"uppercase",letterSpacing:"0.05em",borderBottom:"1px solid #e5e7eb",paddingBottom:8,marginBottom:16}}>Education</div>{eduList.map((e,i)=>(
            <div key={i} style={{marginBottom:16}}>
              <div style={{fontSize:12.5,fontWeight:400,color:"#111827"}}>{e.school}</div>
              <div style={{fontSize:11.5,color:"#4b5563",marginTop:2}}>{e.degree}</div>
              <div style={{fontSize:10.5,color:"#6b7280",marginTop:2}}>{e.year}</div>
            </div>
          ))}</>}
        </div>
      </div>
    </div>
  );

  if(tid==="nordic") return(
    <div ref={refProp} style={{...base,fontFamily:"Inter, -apple-system, sans-serif",padding:"50px",backgroundColor:"#fff",color:"#334155"}}>
      <div style={{marginBottom:40}}>
        <div style={{fontSize:32,fontWeight:300,letterSpacing:"-0.03em",color:"#0f172a",marginBottom:8}}>{d.name||"Your Name"}</div>
        <div style={{fontSize:13,fontWeight:500,color:"#64748b",textTransform:"uppercase",letterSpacing:"0.15em"}}>{d.title}</div>
      </div>
      
      <div style={{display:"grid",gap:48,gridTemplateColumns:"1fr 2fr"}}>
        <div>
          <div style={{marginBottom:32}}>
            <div style={{fontSize:9,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.2em",marginBottom:12}}>Contact</div>
            <div style={{fontSize:11,lineHeight:2,color:"#475569"}}>
              {d.email&&<div>{d.email}</div>}
              {d.phone&&<div>{d.phone}</div>}
              {d.location&&<div>{d.location}</div>}
              {d.linkedin&&<div>{d.linkedin}</div>}
            </div>
          </div>
          
          {has(d.skills)&&<div style={{marginBottom:32}}>
            <div style={{fontSize:9,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.2em",marginBottom:12}}>Skills</div>
            <div style={{fontSize:11,lineHeight:1.8,color:"#475569"}}>{d.skills.split(/[;,]/).map(s=>s.trim()).join("\n")}</div>
          </div>}
          
          {eduList.length>0&&<div>
            <div style={{fontSize:9,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.2em",marginBottom:12}}>Education</div>
            {eduList.map((e,i)=>(
              <div key={i} style={{marginBottom:16}}>
                <div style={{fontSize:11,fontWeight:500,color:"#0f172a"}}>{e.degree}</div>
                <div style={{fontSize:10.5,color:"#64748b",marginTop:2}}>{e.school}</div>
                <div style={{fontSize:10,color:"#94a3b8",marginTop:2}}>{e.year}</div>
              </div>
            ))}
          </div>}
        </div>
        
        <div>
          {has(d.summary)&&<div style={{marginBottom:40}}>
            <p style={{fontSize:13,lineHeight:1.7,fontWeight:300,color:"#0f172a"}}>{d.summary}</p>
          </div>}
          
          {expList.length>0&&<div>
            {expList.map((e,i)=>(
              <div key={i} style={{marginBottom:32,position:"relative",paddingLeft:24,borderLeft:"1px solid #e2e8f0"}}>
                <div style={{position:"absolute",left:-3.5,top:4,width:6,height:6,borderRadius:"50%",backgroundColor:"#cbd5e1"}}></div>
                <div style={{fontSize:10,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>{e.start} — {e.end||"Present"}</div>
                <div style={{fontSize:14,fontWeight:500,color:"#0f172a",marginBottom:2}}>{e.role}</div>
                <div style={{fontSize:12,color:"#64748b",marginBottom:12}}>{e.company}</div>
                <ul style={{margin:0,paddingLeft:16,fontSize:11.5,lineHeight:1.6,color:"#475569"}}>
                  {e.bullets.filter(b=>b.trim()).map((b,j)=><li key={j} style={{marginBottom:6}}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>}
        </div>
      </div>
    </div>
  );

  if(tid==="berlin") return(
    <div ref={refProp} style={{...base,fontFamily:"'Helvetica Neue', Helvetica, Arial, sans-serif",padding:0,backgroundColor:"#fff",color:"#111"}}>
      <div style={{backgroundColor:"#1c1c1e",color:"#fff",padding:"48px 56px",display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
        <div>
          <div style={{fontSize:36,fontWeight:800,letterSpacing:"-0.03em",textTransform:"uppercase",lineHeight:1}}>{d.name||"Your Name"}</div>
          <div style={{fontSize:14,color:"#a1a1aa",fontWeight:600,marginTop:8,letterSpacing:"0.05em",textTransform:"uppercase"}}>{d.title}</div>
        </div>
        <div style={{textAlign:"right",fontSize:10.5,color:"#a1a1aa",lineHeight:1.6,fontWeight:500}}>
          {d.email&&<div>{d.email}</div>}
          {d.phone&&<div>{d.phone}</div>}
          {d.location&&<div>{d.location}</div>}
        </div>
      </div>
      
      <div style={{padding:"40px 56px"}}>
        {has(d.summary)&&<div style={{marginBottom:32}}>
          <p style={{fontSize:13,lineHeight:1.6,fontWeight:500,color:"#3f3f46"}}>{d.summary}</p>
        </div>}
        
        {expList.length>0&&<div style={{marginBottom:32}}>
          <div style={{fontSize:18,fontWeight:800,textTransform:"uppercase",letterSpacing:"-0.02em",marginBottom:16,paddingBottom:8,borderBottom:"2px solid #e4e4e7"}}>Experience</div>
          {expList.map((e,i)=>(
            <div key={i} style={{marginBottom:24}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:4}}>
                <div style={{fontSize:14,fontWeight:800,color:"#18181b"}}>{e.role}</div>
                <div style={{fontSize:11,fontWeight:600,color:"#71717a",backgroundColor:"#f4f4f5",padding:"2px 8px",borderRadius:4}}>{e.start} - {e.end||"Present"}</div>
              </div>
              <div style={{fontSize:12,fontWeight:600,color:"#52525b",marginBottom:12}}>{e.company}</div>
              <ul style={{margin:0,paddingLeft:16,fontSize:11.5,lineHeight:1.6,color:"#3f3f46"}}>
                {e.bullets.filter(b=>b.trim()).map((b,j)=><li key={j} style={{marginBottom:4}}>{b}</li>)}
              </ul>
            </div>
          ))}
        </div>}
        
        <div style={{display:"flex",gap:40}}>
          <div style={{flex:1}}>
            {eduList.length>0&&<div>
              <div style={{fontSize:18,fontWeight:800,textTransform:"uppercase",letterSpacing:"-0.02em",marginBottom:16,paddingBottom:8,borderBottom:"2px solid #e4e4e7"}}>Education</div>
              {eduList.map((e,i)=>(
                <div key={i} style={{marginBottom:16}}>
                  <div style={{fontSize:12,fontWeight:800,color:"#18181b"}}>{e.degree}</div>
                  <div style={{fontSize:11,color:"#52525b",marginTop:4}}>{e.school}</div>
                  <div style={{fontSize:10.5,fontWeight:600,color:"#71717a",marginTop:4}}>{e.year}</div>
                </div>
              ))}
            </div>}
          </div>
          <div style={{flex:1}}>
             {has(d.skills)&&<div><div style={{fontSize:18,fontWeight:800,textTransform:"uppercase",letterSpacing:"-0.02em",marginBottom:16,paddingBottom:8,borderBottom:"2px solid #e4e4e7"}}>Skills</div><div style={{fontSize:11.5,lineHeight:1.7,color:"#3f3f46",fontWeight:500}}>{d.skills}</div></div>}
          </div>
        </div>
      </div>
    </div>
  );

  if(tid==="dubai") return(
    <div ref={refProp} style={{...base,fontFamily:"'Cinzel', 'Times New Roman', serif",padding:"48px 56px",backgroundColor:"#fff",color:"#111"}}>
      <div style={{textAlign:"center",marginBottom:32,position:"relative",paddingBottom:24}}>
        <div style={{position:"absolute",bottom:0,left:"20%",right:"20%",height:1,background:"linear-gradient(90deg, transparent, #b8860b, transparent)"}}></div>
        <div style={{fontSize:36,fontWeight:700,letterSpacing:"0.1em",color:"#000",textTransform:"uppercase",marginBottom:8}}>{d.name||"Your Name"}</div>
        <div style={{fontSize:12,color:"#b8860b",letterSpacing:"0.2em",textTransform:"uppercase"}}>{d.title}</div>
        <div style={{display:"flex",justifyContent:"center",gap:24,marginTop:16,fontSize:10,color:"#666",fontFamily:"Helvetica, sans-serif",letterSpacing:"0.05em"}}>
          {d.email&&<span>{d.email}</span>}
          {d.phone&&<span>{d.phone}</span>}
          {d.location&&<span>{d.location}</span>}
        </div>
      </div>
      
      {has(d.summary)&&<div style={{marginBottom:32,textAlign:"center"}}>
        <p style={{fontSize:11,lineHeight:1.8,color:"#333",fontFamily:"Georgia, serif",fontStyle:"italic",padding:"0 24px"}}>{d.summary}</p>
      </div>}
      
      {expList.length>0&&<div style={{marginBottom:32}}>
        <div style={{textAlign:"center",marginBottom:20}}>
          <span style={{fontSize:14,fontWeight:700,letterSpacing:"0.1em",color:"#b8860b",textTransform:"uppercase",background:"#fff",padding:"0 16px"}}>Professional Experience</span>
        </div>
        {expList.map((e,i)=>(
          <div key={i} style={{marginBottom:24}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:4}}>
              <div style={{fontSize:14,fontWeight:700,color:"#000"}}>{e.company}</div>
              <div style={{fontSize:10,color:"#666",fontFamily:"Helvetica, sans-serif"}}>{e.start} - {e.end||"Present"}</div>
            </div>
            <div style={{fontSize:12,color:"#b8860b",marginBottom:8,fontStyle:"italic"}}>{e.role}</div>
            <ul style={{margin:0,paddingLeft:16,fontSize:11,lineHeight:1.6,color:"#333",fontFamily:"Georgia, serif"}}>
              {e.bullets.filter(b=>b.trim()).map((b,j)=><li key={j} style={{marginBottom:6}}>{b}</li>)}
            </ul>
          </div>
        ))}
      </div>}
      
      <div style={{display:"flex",gap:48}}>
        <div style={{flex:1}}>
          {eduList.length>0&&<div>
            <div style={{textAlign:"center",marginBottom:16}}>
              <span style={{fontSize:14,fontWeight:700,letterSpacing:"0.1em",color:"#b8860b",textTransform:"uppercase"}}>Education</span>
            </div>
            {eduList.map((e,i)=>(
              <div key={i} style={{marginBottom:16,textAlign:"center"}}>
                <div style={{fontSize:12,fontWeight:700,color:"#000"}}>{e.degree}</div>
                <div style={{fontSize:11,color:"#666",marginTop:4,fontFamily:"Georgia, serif",fontStyle:"italic"}}>{e.school}</div>
                <div style={{fontSize:10,color:"#999",marginTop:4,fontFamily:"Helvetica, sans-serif"}}>{e.year}</div>
              </div>
            ))}
          </div>}
        </div>
        <div style={{flex:1}}>
          {has(d.skills)&&<div>
            <div style={{textAlign:"center",marginBottom:16}}>
              <span style={{fontSize:14,fontWeight:700,letterSpacing:"0.1em",color:"#b8860b",textTransform:"uppercase"}}>Competencies</span>
            </div>
            <div style={{fontSize:11,lineHeight:1.8,color:"#333",fontFamily:"Georgia, serif",textAlign:"center"}}>{d.skills.split(/[;,]/).map(s=>s.trim()).join(" • ")}</div>
          </div>}
        </div>
      </div>
    </div>
  );

  if(tid==="mba") return(
    <div ref={refProp} style={{...base,fontFamily:"'Garamond', 'Times New Roman', serif",padding:"48px",backgroundColor:"#fff",color:"#333"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",borderBottom:"2px solid #1e3a5f",paddingBottom:12,marginBottom:20}}>
        <div>
          <div style={{fontSize:28,fontWeight:700,color:"#1e3a5f",textTransform:"uppercase",letterSpacing:"1px"}}>{d.name||"Your Name"}</div>
        </div>
        <div style={{fontSize:10,color:"#666",textAlign:"right"}}>
          {d.phone&&<span style={{marginLeft:12}}>{d.phone}</span>}
          {d.email&&<span style={{marginLeft:12}}>{d.email}</span>}
          {d.linkedin&&<span style={{marginLeft:12}}>{d.linkedin}</span>}
        </div>
      </div>
      
      {expList.length>0&&<div style={{marginBottom:24}}>
        <div style={{fontSize:12,fontWeight:700,color:"#1e3a5f",textTransform:"uppercase",letterSpacing:"1px",marginBottom:12}}>Professional Experience</div>
        {expList.map((e,i)=>(
          <div key={i} style={{marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
              <div style={{fontSize:13,fontWeight:700,color:"#000"}}>{e.company}</div>
              <div style={{fontSize:11,color:"#333"}}>{e.location}</div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:6}}>
              <div style={{fontSize:12,fontStyle:"italic",color:"#333"}}>{e.role}</div>
              <div style={{fontSize:11,color:"#333"}}>{e.start} - {e.end||"Present"}</div>
            </div>
            <ul style={{margin:0,paddingLeft:16,fontSize:11,lineHeight:1.5,color:"#333"}}>
              {e.bullets.filter(b=>b.trim()).map((b,j)=><li key={j} style={{marginBottom:4}}>{b}</li>)}
            </ul>
          </div>
        ))}
      </div>}
      
      {eduList.length>0&&<div style={{marginBottom:24}}>
        <div style={{fontSize:12,fontWeight:700,color:"#1e3a5f",textTransform:"uppercase",letterSpacing:"1px",marginBottom:12}}>Education</div>
        {eduList.map((e,i)=>(
          <div key={i} style={{marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
              <div style={{fontSize:13,fontWeight:700,color:"#000"}}>{e.school}</div>
              <div style={{fontSize:11,color:"#333"}}>{e.location}</div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:4}}>
              <div style={{fontSize:12,fontStyle:"italic",color:"#333"}}>{e.degree}</div>
              <div style={{fontSize:11,color:"#333"}}>{e.year}</div>
            </div>
            {e.gpa&&<div style={{fontSize:11,color:"#333"}}>GPA: {e.gpa}</div>}
          </div>
        ))}
      </div>}
      
      {has(d.skills)&&<div>
        <div style={{fontSize:12,fontWeight:700,color:"#1e3a5f",textTransform:"uppercase",letterSpacing:"1px",marginBottom:8}}>Additional Information</div>
        <div style={{fontSize:11,lineHeight:1.6,color:"#333"}}><span style={{fontWeight:700}}>Skills:</span> {d.skills}</div>
        {has(d.languages)&&<div style={{fontSize:11,lineHeight:1.6,color:"#333"}}><span style={{fontWeight:700}}>Languages:</span> {d.languages}</div>}
      </div>}
    </div>
  );

  if(tid==="fintech") return(
    <div ref={refProp} style={{...base,fontFamily:"'Inter', 'Graphik', sans-serif",padding:"48px",backgroundColor:"#f8fafc",color:"#334155"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:32}}>
        <div>
          <div style={{fontSize:28,fontWeight:800,letterSpacing:"-0.03em",color:"#0f172a"}}>{d.name||"Your Name"}</div>
          <div style={{fontSize:13,fontWeight:600,color:"#0ea5e9",marginTop:4}}>{d.title}</div>
        </div>
        <div style={{textAlign:"right",fontSize:10,color:"#64748b",fontWeight:500,lineHeight:1.7}}>
          {d.email&&<div>{d.email}</div>}
          {d.phone&&<div>{d.phone}</div>}
          {d.location&&<div>{d.location}</div>}
        </div>
      </div>
      
      <div style={{display:"grid",gap:32,gridTemplateColumns:"2fr 1fr"}}>
        <div>
          {has(d.summary)&&<><div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",color:"#0f172a",marginBottom:8}}>Profile</div><p style={{fontSize:11.5,lineHeight:1.6,color:"#475569",marginBottom:24}}>{d.summary}</p></>}
          
          {expList.length>0&&<><div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",color:"#0f172a",marginBottom:12}}>Experience</div>{expList.map((e,i)=>(
            <div key={i} style={{marginBottom:20}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:4}}>
                <div style={{fontSize:14,fontWeight:700,color:"#0f172a"}}>{e.role}</div>
                <div style={{fontSize:10.5,fontWeight:600,color:"#0ea5e9"}}>{e.start} - {e.end||"Present"}</div>
              </div>
              <div style={{fontSize:12,fontWeight:500,color:"#64748b",marginBottom:8}}>{e.company}</div>
              <ul style={{margin:0,paddingLeft:16,fontSize:11.5,lineHeight:1.5,color:"#475569"}}>
                {e.bullets.filter(b=>b.trim()).map((b,j)=><li key={j} style={{marginBottom:6}}>{b}</li>)}
              </ul>
            </div>
          ))}</>}
        </div>
        
        <div>
          {has(d.skills)&&<div style={{marginBottom:24}}>
            <div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",color:"#0f172a",marginBottom:12}}>Skills</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {d.skills.split(/[;,]/).filter(s=>s.trim()).map((s,i)=>(
                <div key={i} style={{backgroundColor:"#e0f2fe",color:"#0284c7",padding:"6px 12px",borderRadius:4,fontSize:11,fontWeight:600}}>{s.trim()}</div>
              ))}
            </div>
          </div>}
          
          {eduList.length>0&&<div>
            <div style={{fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em",color:"#0f172a",marginBottom:12}}>Education</div>
            {eduList.map((e,i)=>(
              <div key={i} style={{marginBottom:16,backgroundColor:"#fff",border:"1px solid #e2e8f0",padding:"12px",borderRadius:6}}>
                <div style={{fontSize:12,fontWeight:700,color:"#0f172a"}}>{e.degree}</div>
                <div style={{fontSize:11,color:"#64748b",marginTop:4}}>{e.school}</div>
                <div style={{fontSize:10,fontWeight:600,color:"#94a3b8",marginTop:4}}>{e.year}</div>
              </div>
            ))}
          </div>}
        </div>
      </div>
    </div>
  );

  if(tid==="creative") return(
    <div ref={refProp} style={{...base,fontFamily:"'Outfit', sans-serif",padding:"48px 56px",backgroundColor:"#fff",color:"#222"}}>
      <div style={{display:"flex",gap:40}}>
        <div style={{width:"30%",flexShrink:0,borderRight:"3px solid #E67E22",paddingRight:32}}>
          {d.showPhoto && d.photo && <div style={{width: 120, height: 120, borderRadius:"30% 70% 70% 30% / 30% 30% 70% 70%", overflow: "hidden", marginBottom: 24, boxShadow:"8px 8px 0 rgba(230,126,34,0.2)"}}><img src={d.photo} style={{width: "100%", height: "100%", objectFit: "cover"}} /></div>}
          <div style={{fontSize:32,fontWeight:900,color:"#111",lineHeight:1,marginBottom:12,letterSpacing:"-0.03em"}}>{d.name||"Your Name"}</div>
          <div style={{fontSize:14,fontWeight:700,color:"#E67E22",marginBottom:24}}>{d.title}</div>
          
          <div style={{fontSize:11,lineHeight:1.8,color:"#555",marginBottom:32,fontWeight:500}}>
            {d.email&&<div>{d.email}</div>}
            {d.phone&&<div>{d.phone}</div>}
            {d.location&&<div>{d.location}</div>}
            {d.website&&<div style={{fontWeight:700,color:"#E67E22",marginTop:8}}>{d.website}</div>}
          </div>
          
          {has(d.skills)&&<div>
            <div style={{fontSize:14,fontWeight:900,textTransform:"uppercase",color:"#111",marginBottom:12}}>Skills</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {d.skills.split(/[;,]/).filter(s=>s.trim()).map((s,i)=>(
                <span key={i} style={{border:"2px solid #E67E22",color:"#E67E22",padding:"4px 8px",borderRadius:20,fontSize:10,fontWeight:800,textTransform:"uppercase"}}>{s.trim()}</span>
              ))}
            </div>
          </div>}
        </div>
        
        <div style={{width:"70%"}}>
          {has(d.summary)&&<div style={{marginBottom:40}}>
            <div style={{fontSize:20,fontWeight:900,letterSpacing:"-0.03em",color:"#111",marginBottom:12}}>Profile</div>
            <p style={{fontSize:12,lineHeight:1.6,color:"#444",fontWeight:500}}>{d.summary}</p>
          </div>}
          
          {expList.length>0&&<div style={{marginBottom:40}}>
            <div style={{fontSize:20,fontWeight:900,letterSpacing:"-0.03em",color:"#111",marginBottom:20}}>Experience</div>
            {expList.map((e,i)=>(
              <div key={i} style={{marginBottom:24,position:"relative"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:4}}>
                  <div style={{fontSize:14,fontWeight:800,color:"#111"}}>{e.role}</div>
                  <div style={{fontSize:11,fontWeight:700,color:"#E67E22"}}>{e.start} - {e.end||"Present"}</div>
                </div>
                <div style={{fontSize:12,fontWeight:700,color:"#666",marginBottom:8}}>{e.company}</div>
                <ul style={{margin:0,paddingLeft:16,fontSize:11.5,lineHeight:1.6,color:"#444",fontWeight:500}}>
                  {e.bullets.filter(b=>b.trim()).map((b,j)=><li key={j} style={{marginBottom:4}}>{b}</li>)}
                </ul>
              </div>
            ))}
          </div>}
          
          {eduList.length>0&&<div>
            <div style={{fontSize:20,fontWeight:900,letterSpacing:"-0.03em",color:"#111",marginBottom:20}}>Education</div>
            {eduList.map((e,i)=>(
              <div key={i} style={{marginBottom:16}}>
                <div style={{fontSize:13,fontWeight:800,color:"#111"}}>{e.degree}</div>
                <div style={{fontSize:12,fontWeight:500,color:"#666",marginTop:4}}>{e.school}</div>
                <div style={{fontSize:11,fontWeight:700,color:"#E67E22",marginTop:4}}>{e.year}</div>
              </div>
            ))}
          </div>}
        </div>
      </div>
    </div>
  );

  if(tid==="devops") return(
    <div ref={refProp} style={{...base,fontFamily:"Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",padding:"48px",backgroundColor:"#0f172a",color:"#e2e8f0"}}>
      <div style={{border:"1px solid #334155",padding:"24px",borderRadius:8,marginBottom:24,backgroundColor:"#1e293b"}}>
        <div style={{color:"#16a34a",fontSize:12,marginBottom:8}}>root@localhost:~$ whoami</div>
        <div style={{fontSize:28,fontWeight:700,color:"#fff",marginBottom:8}}>{d.name||"sudo_user"}</div>
        <div style={{color:"#38bdf8",fontSize:14,marginBottom:16}}>&gt; {d.title}</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:24,fontSize:11,color:"#94a3b8"}}>
          {d.email&&<span><span style={{color:"#f472b6"}}>Email:</span> {d.email}</span>}
          {d.phone&&<span><span style={{color:"#f472b6"}}>Tel:</span> {d.phone}</span>}
          {d.location&&<span><span style={{color:"#f472b6"}}>Loc:</span> {d.location}</span>}
        </div>
      </div>
      
      {has(d.summary)&&<div style={{marginBottom:24}}>
        <div style={{color:"#16a34a",fontSize:12,marginBottom:8}}>root@localhost:~$ cat /var/log/summary.txt</div>
        <p style={{fontSize:11.5,lineHeight:1.6,color:"#cbd5e1"}}>{d.summary}</p>
      </div>}
      
      {expList.length>0&&<div style={{marginBottom:24}}>
        <div style={{color:"#16a34a",fontSize:12,marginBottom:16}}>root@localhost:~$ docker ps -a | grep experience</div>
        {expList.map((e,i)=>(
          <div key={i} style={{marginBottom:20,borderLeft:"2px solid #38bdf8",paddingLeft:16}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{color:"#bae6fd",fontWeight:700,fontSize:13}}>{e.role} @ {e.company}</span>
              <span style={{color:"#64748b",fontSize:11}}>[{e.start} - {e.end||"present"}]</span>
            </div>
            <ul style={{margin:0,paddingLeft:16,fontSize:11,lineHeight:1.5,color:"#94a3b8"}}>
              {e.bullets.filter(b=>b.trim()).map((b,j)=><li key={j} style={{marginBottom:4}}><span style={{color:"#16a34a"}}>&gt;</span> {b}</li>)}
            </ul>
          </div>
        ))}
      </div>}
      
      <div style={{display:"flex",gap:32}}>
        <div style={{flex:1}}>
          {has(d.skills)&&<div>
            <div style={{color:"#16a34a",fontSize:12,marginBottom:12}}>root@localhost:~$ npm list --depth=0</div>
            <div style={{fontSize:11,color:"#cbd5e1",lineHeight:1.8}}>
              {d.skills.split(/[;,]/).filter(s=>s.trim()).map((s,i)=>(
                <div key={i}>├── <span style={{color:"#facc15"}}>{s.trim()}</span></div>
              ))}
            </div>
          </div>}
        </div>
        <div style={{flex:1}}>
          {eduList.length>0&&<div>
            <div style={{color:"#16a34a",fontSize:12,marginBottom:12}}>root@localhost:~$ ls -l /opt/education</div>
            {eduList.map((e,i)=>(
              <div key={i} style={{marginBottom:12,fontSize:11}}>
                <div style={{color:"#f87171"}}>-rw-r--r-- 1 root root {e.year}</div>
                <div style={{color:"#fff",fontWeight:700,marginTop:2}}>{e.degree}</div>
                <div style={{color:"#94a3b8"}}>{e.school}</div>
              </div>
            ))}
          </div>}
        </div>
      </div>
    </div>
  );


  // ─── DARK SIDEBAR (Kelly Blackwell style) ───────────────────────────────────
  if(tid==="darksidebar") {
    const initials = (d.name||"?").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
    const skillList = (d.skills||"").split(/[,;]/).map(s=>s.trim()).filter(s=>s);
    return (
      <div ref={refProp} style={{...base,fontFamily:"'Segoe UI',Arial,sans-serif",display:"flex",padding:0}}>
        {/* Sidebar */}
        <div style={{width:200,background:"#1a1a1a",color:"#f5f5f5",padding:"28px 16px",flexShrink:0,display:"flex",flexDirection:"column",gap:0}}>
          {/* Avatar circle */}
          <div style={{width:80,height:80,borderRadius:"50%",background:"#333",border:"3px solid #555",margin:"0 auto 12px",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            {d.showPhoto && d.photo
              ? <img src={d.photo} style={{width:"100%",height:"100%",objectFit:"cover"}} />
              : <span style={{fontSize:26,fontWeight:700,color:"#ccc"}}>{initials}</span>}
          </div>
          {/* Name + title */}
          <div style={{textAlign:"center",marginBottom:20}}>
            <div style={{fontSize:14,fontWeight:700,lineHeight:1.3,wordBreak:"break-word"}}>{d.name||"Your Name"}</div>
            <div style={{fontSize:9.5,color:"#aaa",marginTop:3,fontStyle:"italic"}}>{d.title}</div>
          </div>
          {/* Contact */}
          <div style={{marginBottom:16}}>
            <div style={{fontSize:8,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",color:"#888",borderBottom:"1px solid #444",paddingBottom:3,marginBottom:7}}>Details</div>
            {d.email&&<div style={{fontSize:8.5,marginBottom:4,wordBreak:"break-all",color:"#ddd"}}>{d.email}</div>}
            {d.phone&&<div style={{fontSize:8.5,marginBottom:4,color:"#ddd"}}>{d.phone}</div>}
            {d.location&&<div style={{fontSize:8.5,marginBottom:4,color:"#ddd"}}>{d.location}</div>}
            {d.linkedin&&<div style={{fontSize:8.5,marginBottom:4,wordBreak:"break-all",color:"#aaa"}}>{d.linkedin}</div>}
          </div>
          {/* Skills */}
          {skillList.length>0&&(
            <div style={{marginBottom:16}}>
              <div style={{fontSize:8,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",color:"#888",borderBottom:"1px solid #444",paddingBottom:3,marginBottom:7}}>Skills</div>
              {skillList.slice(0,12).map((s,i)=>(
                <div key={i} style={{marginBottom:5}}>
                  <div style={{fontSize:8.5,color:"#d0d0d0",marginBottom:2}}>{s}</div>
                  <div style={{height:3,background:"#444",borderRadius:99}}>
                    <div style={{height:"100%",width:`${70+Math.floor((i*17)%30)}%`,background:"#777",borderRadius:99}}/>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Languages */}
          {has(d.languages)&&(
            <div>
              <div style={{fontSize:8,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.12em",color:"#888",borderBottom:"1px solid #444",paddingBottom:3,marginBottom:7}}>Languages</div>
              <div style={{fontSize:8.5,color:"#ccc"}}>{d.languages}</div>
            </div>
          )}
        </div>
        {/* Main */}
        <div style={{flex:1,padding:"28px 22px",background:"#fff",color:"#111"}}>
          {has(d.summary)&&<>
            <div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.14em",color:"#333",borderBottom:"2px solid #ddd",paddingBottom:3,marginBottom:7}}>Summary</div>
            <p style={{margin:"0 0 14px",fontSize:10.5,lineHeight:1.65,color:"#444"}}>{d.summary}</p>
          </>}
          {expList.length>0&&<>
            <div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.14em",color:"#333",borderBottom:"2px solid #ddd",paddingBottom:3,marginBottom:8,marginTop:14}}>Experience</div>
            {expList.map((e,i)=>(
              <div key={i} style={{marginBottom:11}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
                  <span style={{fontWeight:700,fontSize:11}}>{e.role}</span>
                  <span style={{fontSize:9,color:"#888"}}>{e.start}{e.start&&(e.end||e.current)?" – ":""}{e.current?"Current":e.end}</span>
                </div>
                <div style={{fontSize:10,color:"#555",marginBottom:3,fontStyle:"italic"}}>{e.company}</div>
                <ul style={{margin:0,paddingLeft:14}}>
                  {e.bullets.filter(b=>b.trim()).map((b,j)=><li key={j} style={{fontSize:10,lineHeight:1.5,color:"#333",marginBottom:2}}>{b}</li>)}
                </ul>
              </div>
            ))}
          </>}
          {eduList.length>0&&<>
            <div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.14em",color:"#333",borderBottom:"2px solid #ddd",paddingBottom:3,marginBottom:7,marginTop:14}}>Education</div>
            {eduList.map((e,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <div>
                  <div style={{fontWeight:700,fontSize:11}}>{e.school}</div>
                  <div style={{fontSize:10,color:"#555"}}>{e.degree}{e.gpa?` · GPA: ${e.gpa}`:""}</div>
                </div>
                <div style={{fontSize:9,color:"#888"}}>{e.year}</div>
              </div>
            ))}
          </>}
          {projList.length>0&&<>
            <div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.14em",color:"#333",borderBottom:"2px solid #ddd",paddingBottom:3,marginBottom:8,marginTop:14}}>Projects</div>
            {projList.map((p,i)=><ProjBlock key={i} p={p} accent="#333"/>)}
          </>}
        </div>
      </div>
    );
  }

  // ─── CLASSIC (Howard Jones lawyer style) ─────────────────────────────────────
  if(tid==="classic") {
    return (
      <div ref={refProp} style={{...base,fontFamily:"'Palatino Linotype','Book Antiqua',Palatino,Georgia,serif",padding:"36px 48px",color:"#111"}}>
        {/* Centered header */}
        <div style={{textAlign:"center",marginBottom:18}}>
          <div style={{fontSize:28,fontWeight:700,letterSpacing:"0.04em",marginBottom:3}}>{d.name||"Your Name"}</div>
          <div style={{fontSize:12,color:"#444",marginBottom:6}}>{d.title}</div>
          <div style={{display:"flex",justifyContent:"center",flexWrap:"wrap",gap:16,fontSize:10,color:"#555"}}>
            {d.location&&<span>{d.location}</span>}
            {d.phone&&<span>{d.phone}</span>}
            {d.email&&<span>{d.email}</span>}
            {d.linkedin&&<span>{d.linkedin}</span>}
          </div>
        </div>
        <div style={{height:1.5,background:"#666",marginBottom:14}}/>

        {has(d.summary)&&<>
          <div style={{fontSize:9.5,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.14em",color:"#333",marginBottom:6}}>Summary</div>
          <p style={{margin:"0 0 14px",fontSize:11,lineHeight:1.75,color:"#333",textAlign:"justify"}}>{d.summary}</p>
          <div style={{height:"0.5px",background:"#ccc",marginBottom:14}}/>
        </>}

        {expList.length>0&&<>
          <div style={{fontSize:9.5,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.14em",color:"#333",marginBottom:8}}>Experience</div>
          {expList.map((e,i)=>(
            <div key={i} style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:1}}>
                <div style={{fontWeight:700,fontSize:11.5}}>{e.role}</div>
                <div style={{fontSize:10,color:"#666",flexShrink:0,marginLeft:8}}>{e.start}{e.start&&(e.end||e.current)?" – ":""}{e.current?"Present":e.end}</div>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:4}}>
                <div style={{fontSize:10.5,fontStyle:"italic",color:"#555"}}>{e.company}</div>
              </div>
              <ul style={{margin:0,paddingLeft:16}}>
                {e.bullets.filter(b=>b.trim()).map((b,j)=><li key={j} style={{fontSize:10.5,lineHeight:1.6,color:"#333",marginBottom:3}}>{b}</li>)}
              </ul>
            </div>
          ))}
          <div style={{height:"0.5px",background:"#ccc",marginBottom:14}}/>
        </>}

        {eduList.length>0&&<>
          <div style={{fontSize:9.5,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.14em",color:"#333",marginBottom:8}}>Education</div>
          {eduList.map((e,i)=>(
            <div key={i} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
                <span style={{fontWeight:700,fontSize:11.5}}>{e.degree}{e.field?` in ${e.field}`:""}</span>
                <span style={{fontSize:10,color:"#666"}}>{e.year}</span>
              </div>
              <div style={{fontSize:10.5,fontStyle:"italic",color:"#555"}}>{e.school}{e.gpa?` · GPA: ${e.gpa}`:""}</div>
            </div>
          ))}
          <div style={{height:"0.5px",background:"#ccc",marginBottom:14}}/>
        </>}

        {has(d.skills)&&<>
          <div style={{fontSize:9.5,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.14em",color:"#333",marginBottom:6}}>Skills</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:"4px 12px",fontSize:10.5,color:"#333",lineHeight:1.8}}>
            {d.skills.split(/[,;]/).map(s=>s.trim()).filter(s=>s).map((s,i,arr)=>(
              <span key={i}>{s}{i<arr.length-1?" ·":""}</span>
            ))}
          </div>
        </>}

        {projList.length>0&&<>
          <div style={{height:"0.5px",background:"#ccc",margin:"14px 0"}}/>
          <div style={{fontSize:9.5,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.14em",color:"#333",marginBottom:8}}>Projects</div>
          {projList.map((p,i)=><ProjBlock key={i} p={p} accent="#333"/>)}
        </>}
      </div>
    );
  }

  // ─── PHOTO BANNER (Samantha Williams analyst style) ──────────────────────────
  if(tid==="photobanner") {
    const initials = (d.name||"?").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
    return (
      <div ref={refProp} style={{...base,fontFamily:"'Segoe UI',Arial,sans-serif",padding:0,color:"#111"}}>
        {/* Top banner */}
        <div style={{background:"#e8e8e6",padding:"20px 28px",display:"flex",alignItems:"center",gap:20,minHeight:90}}>
          {/* Photo / initials */}
          <div style={{width:70,height:70,borderRadius:"50%",border:"2px solid #bbb",overflow:"hidden",flexShrink:0,background:"#ccc",display:"flex",alignItems:"center",justifyContent:"center"}}>
            {d.showPhoto && d.photo
              ? <img src={d.photo} style={{width:"100%",height:"100%",objectFit:"cover"}} />
              : <span style={{fontSize:22,fontWeight:700,color:"#666"}}>{initials}</span>}
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:22,fontWeight:700,letterSpacing:"-0.01em",marginBottom:3}}>{d.name||"Your Name"}</div>
            <div style={{fontSize:11,color:"#555",marginBottom:5}}>{d.title}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:"4px 16px",fontSize:9.5,color:"#666"}}>
              {d.location&&<span>{d.location}</span>}
              {d.phone&&<span>{d.phone}</span>}
              {d.email&&<span>{d.email}</span>}
              {d.linkedin&&<span>{d.linkedin}</span>}
            </div>
          </div>
        </div>

        {/* Two-column body */}
        <div style={{display:"flex",padding:"20px 28px",gap:24}}>
          {/* Left column */}
          <div style={{width:"38%",flexShrink:0}}>
            {has(d.summary)&&<>
              <div style={{fontSize:8.5,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.14em",color:"#333",borderBottom:"1.5px solid #ccc",paddingBottom:3,marginBottom:7}}>Summary</div>
              <p style={{fontSize:10,lineHeight:1.65,color:"#444",marginBottom:14}}>{d.summary}</p>
            </>}

            {has(d.skills)&&<>
              <div style={{fontSize:8.5,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.14em",color:"#333",borderBottom:"1.5px solid #ccc",paddingBottom:3,marginBottom:7}}>Skills</div>
              <div style={{marginBottom:14}}>
                {d.skills.split(/[,;]/).map(s=>s.trim()).filter(s=>s).map((s,i)=>(
                  <div key={i} style={{fontSize:9.5,color:"#333",marginBottom:4,paddingLeft:8,borderLeft:"2px solid #bbb"}}>{s}</div>
                ))}
              </div>
            </>}

            {eduList.length>0&&<>
              <div style={{fontSize:8.5,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.14em",color:"#333",borderBottom:"1.5px solid #ccc",paddingBottom:3,marginBottom:7}}>Education</div>
              {eduList.map((e,i)=>(
                <div key={i} style={{marginBottom:10}}>
                  <div style={{fontSize:11,fontWeight:700}}>{e.school}</div>
                  <div style={{fontSize:9.5,color:"#555"}}>{e.degree}</div>
                  <div style={{fontSize:9,color:"#888"}}>{e.year}{e.gpa?` · GPA: ${e.gpa}`:""}</div>
                </div>
              ))}
            </>}

            {has(d.languages)&&<>
              <div style={{fontSize:8.5,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.14em",color:"#333",borderBottom:"1.5px solid #ccc",paddingBottom:3,marginBottom:6,marginTop:12}}>Languages</div>
              <div style={{fontSize:9.5,color:"#444"}}>{d.languages}</div>
            </>}
          </div>

          {/* Right column */}
          <div style={{flex:1}}>
            {expList.length>0&&<>
              <div style={{fontSize:8.5,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.14em",color:"#333",borderBottom:"1.5px solid #ccc",paddingBottom:3,marginBottom:8}}>Experience</div>
              {expList.map((e,i)=>(
                <div key={i} style={{marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
                    <span style={{fontWeight:700,fontSize:11.5}}>{e.role}</span>
                    <span style={{fontSize:9,color:"#888",flexShrink:0,marginLeft:6}}>{e.start}{e.start&&(e.end||e.current)?" – ":""}{e.current?"Present":e.end}</span>
                  </div>
                  <div style={{fontSize:10,color:"#555",marginBottom:4,fontStyle:"italic"}}>{e.company}</div>
                  <ul style={{margin:0,paddingLeft:14}}>
                    {e.bullets.filter(b=>b.trim()).map((b,j)=><li key={j} style={{fontSize:10,lineHeight:1.55,color:"#333",marginBottom:2}}>{b}</li>)}
                  </ul>
                </div>
              ))}
            </>}

            {projList.length>0&&<>
              <div style={{fontSize:8.5,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.14em",color:"#333",borderBottom:"1.5px solid #ccc",paddingBottom:3,marginBottom:8,marginTop:4}}>Projects</div>
              {projList.map((p,i)=><ProjBlock key={i} p={p} accent="#555" small/>)}
            </>}

            {has(d.certifications)&&<>
              <div style={{fontSize:8.5,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.14em",color:"#333",borderBottom:"1.5px solid #ccc",paddingBottom:3,marginBottom:6,marginTop:12}}>Certifications</div>
              <div style={{fontSize:10,color:"#444"}}>{d.certifications}</div>
            </>}
          </div>
        </div>
      </div>
    );
  }

  return null;

}

export function LetterDoc({ data: d, tid, refProp, type = "Cover Letter" }) {
  const base = { background: "#fff", color: "#111", fontSize: 11, lineHeight: 1.6 };
  const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // Modern Style
  if (tid === "minimal" || tid === "violet" || tid === "emerald") {
    return (
      <div ref={refProp} style={{ ...base, fontFamily: "Inter, sans-serif", padding: "50px 60px", minHeight: "297mm" }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, color: "#0f172a" }}>{d.name || "Your Name"}</h1>
          <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>{d.title}</p>
          <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 11, color: "#94a3b8" }}>
            {d.email && <span>{d.email}</span>}
            {d.phone && <span>{d.phone}</span>}
            {d.location && <span>{d.location}</span>}
          </div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#0f172a" }}>{date}</div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>Hiring Manager / Recipient</div>
          <div style={{ fontSize: 11, color: "#475569" }}>{d.targetCompany || "Target Company"}</div>
          <div style={{ fontSize: 11, color: "#475569" }}>{d.targetLocation || "Company Location"}</div>
        </div>

        <div style={{ whiteSpace: "pre-wrap", color: "#334155", fontSize: 11.5, textAlign: "justify" }}>
          {d.letterBody || "Your AI generated letter content will appear here..."}
        </div>

        <div style={{ marginTop: 48 }}>
          <p style={{ fontSize: 11, margin: 0 }}>Sincerely,</p>
          <p style={{ fontSize: 13, fontWeight: 700, margin: "8px 0 0", color: "#0f172a" }}>{d.name || "Your Name"}</p>
        </div>
      </div>
    );
  }

  // Classic Style
  return (
    <div ref={refProp} style={{ ...base, fontFamily: "Georgia, serif", padding: "60px 70px", minHeight: "297mm" }}>
      <div style={{ textAlign: "center", borderBottom: "1px solid #eee", paddingBottom: 24, marginBottom: 40 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0, textTransform: "uppercase", letterSpacing: "1px" }}>{d.name || "Your Name"}</h1>
        <div style={{ fontSize: 10, color: "#666", marginTop: 8, display: "flex", justifyContent: "center", gap: 20 }}>
          {d.email && <span>{d.email}</span>}
          {d.phone && <span>{d.phone}</span>}
          {d.location && <span>{d.location}</span>}
        </div>
      </div>

      <div style={{ marginBottom: 24, fontSize: 11 }}>{date}</div>

      <div style={{ marginBottom: 32, fontSize: 11 }}>
        <strong>Hiring Manager</strong><br />
        {d.targetCompany || "Target Company"}<br />
        {d.targetLocation || ""}
      </div>

      <p style={{ marginBottom: 20, fontSize: 11 }}>Dear Hiring Manager,</p>

      <div style={{ whiteSpace: "pre-wrap", color: "#111", fontSize: 11, textAlign: "justify", lineHeight: 1.7 }}>
        {d.letterBody || "Your AI generated letter content will appear here..."}
      </div>

      <div style={{ marginTop: 48, fontSize: 11 }}>
        <p style={{ margin: 0 }}>Best Regards,</p>
        <p style={{ fontWeight: 700, margin: "12px 0 0" }}>{d.name || "Your Name"}</p>
      </div>
    </div>
  );
}
