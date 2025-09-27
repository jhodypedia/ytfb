import { streamManager } from "../services/streamManager.js";
export const userStats = (req,res)=>{
  const jobs = streamManager.list().filter(j=> j.userId === req.user.id);
  const total=jobs.length, running=jobs.filter(j=>j.status==="running").length,
        scheduled=jobs.filter(j=>j.status==="scheduled").length, stopped=jobs.filter(j=>j.status==="stopped").length;
  const monthly={}; jobs.forEach(j=>{ const d=new Date(j.createdAt); const k=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`; monthly[k]=(monthly[k]||0)+1; });
  res.json({ ok:true, total, running, scheduled, stopped, monthly });
};
