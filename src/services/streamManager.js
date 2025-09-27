import { spawn } from "child_process";
import { nanoid } from "nanoid";
import dotenv from "dotenv";
import { buildFfmpegArgs } from "./ffmpegArgs.js";
dotenv.config();
const FFMPEG_BIN = process.env.FFMPEG_BIN || "ffmpeg";

class StreamManager{
  constructor(){ this.jobs=new Map(); }
  list(){ return Array.from(this.jobs.values()).map(j=>({...j, logs:undefined})); }
  get(id){ return this.jobs.get(id); }

  create({ userId, platform, input, loop=false, options={}, outputs=[], timezone, startAt, device }){
    const id=nanoid(10);
    const job={ id,userId,platform,input,loop,options,outputs,timezone,startAt:startAt||null,device,
      status:"idle",createdAt:new Date(),startedAt:null,stoppedAt:null,pid:null,process:null,logs:[] };
    this.jobs.set(id,job); return job;
  }

  start(id){
    const job=this.jobs.get(id); if(!job) throw new Error("Job not found");
    if(job.status==="running") throw new Error("Already running");
    const args=buildFfmpegArgs(job);
    const child=spawn(FFMPEG_BIN,args,{stdio:["ignore","pipe","pipe"]});
    job.process=child; job.pid=child.pid; job.status="running"; job.startedAt=new Date();
    child.stdout.on("data",d=>job.logs.push(d.toString()));
    child.stderr.on("data",d=>job.logs.push(d.toString()));
    child.on("close",code=>{ job.pid=null; job.stoppedAt=new Date(); if(job.status!=="stopped") job.status=code===0?"stopped":"error"; });
    child.on("error",()=>{ job.status="error"; });
    return job;
  }

  stop(id){
    const job=this.jobs.get(id);
    if(!job || job.status!=="running" || !job.process) throw new Error("Not running");
    job.process.kill("SIGINT"); job.status="stopped"; job.stoppedAt=new Date(); job.pid=null; return job;
  }

  remove(id){
    const job=this.jobs.get(id); if(!job) throw new Error("Not found");
    if(job.status==="running" && job.process) job.process.kill("SIGINT");
    this.jobs.delete(id); return true;
  }
}
export const streamManager = new StreamManager();
