import Joi from "joi";
import multer from "multer";
import db from "../models/index.js";
import { streamManager } from "../services/streamManager.js";
import { scheduleJob, cancelJob } from "../services/scheduler.js";
const { Job } = db;

export const upload = multer({
  dest: "src/storage/uploads/",
  limits: { fileSize: 1024*1024*1024 }
}).single("video");

export const createSchema = Joi.object({
  platform: Joi.string().valid("youtube","facebook").required(),
  input: Joi.string().required(),
  loop: Joi.boolean().default(false),
  options: Joi.object({
    fps: Joi.number().min(10).max(120).optional(),
    width: Joi.number().min(320).max(3840).optional(),
    height: Joi.number().min(240).max(2160).optional(),
    videoBitrate: Joi.string().pattern(/^\d+k$/).optional(),
    audioBitrate: Joi.string().pattern(/^\d+k$/).optional(),
    keyint: Joi.number().min(10).max(300).optional()
  }).default({}),
  output: Joi.string().uri().required(),
  startAt: Joi.string().optional(),
  liveNow: Joi.boolean().default(false)
});

export const create = async (req,res)=>{
  const { platform, input, loop, options, output, startAt, liveNow } = req.body;
  const { timezone, device } = req.clientInfo;
  const job = streamManager.create({
    userId:req.user.id, platform, input, loop, options, outputs:[output],
    timezone, startAt:startAt||null, device
  });

  await Job.create({
    id:job.id, userId:req.user.id, platform, input,
    outputs: JSON.stringify([output]), status: job.status,
    timezone, startAt:startAt||null, device: JSON.stringify(device)
  });

  if(liveNow){
    try{ streamManager.start(job.id); job.status="running"; }
    catch(e){ return res.status(500).json({ok:false,message:e.message}); }
  } else if(startAt){
    scheduleJob(job.id, timezone, startAt); job.status="scheduled";
  }
  res.json({ ok:true, job });
};

export const list = async (req,res)=>{
  let jobs = streamManager.list();
  if(req.user.role!=="admin") jobs = jobs.filter(j=> j.userId===req.user.id);
  res.json({ ok:true, jobs });
};

export const detail = (req,res)=>{
  const job = streamManager.get(req.params.id);
  if(!job) return res.status(404).json({ok:false,message:"Not found"});
  if(req.user.role!=="admin" && job.userId!==req.user.id) return res.status(403).json({ok:false});
  res.json({ ok:true, job });
};

export const start = (req,res)=>{
  try{
    const job=streamManager.get(req.params.id);
    if(!job) return res.status(404).json({ok:false,message:"Not found"});
    if(req.user.role!=="admin" && job.userId!==req.user.id) return res.status(403).json({ok:false});
    streamManager.start(job.id);
    res.json({ ok:true, job: streamManager.get(job.id) });
  }catch(e){ res.status(400).json({ok:false,message:e.message}); }
};

export const stop = (req,res)=>{
  try{
    const job=streamManager.get(req.params.id);
    if(!job) return res.status(404).json({ok:false,message:"Not found"});
    if(req.user.role!=="admin" && job.userId!==req.user.id) return res.status(403).json({ok:false});
    streamManager.stop(job.id);
    res.json({ ok:true, job: streamManager.get(job.id) });
  }catch(e){ res.status(400).json({ok:false,message:e.message}); }
};

export const remove = (req,res)=>{
  try{
    const job=streamManager.get(req.params.id);
    if(!job) return res.status(404).json({ok:false,message:"Not found"});
    if(req.user.role!=="admin" && job.userId!==req.user.id) return res.status(403).json({ok:false});
    cancelJob(req.params.id);
    streamManager.remove(req.params.id);
    res.json({ ok:true, message:"Removed" });
  }catch(e){ res.status(400).json({ok:false,message:e.message}); }
};
