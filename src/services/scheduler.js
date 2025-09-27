import schedule from "node-schedule";
import moment from "moment-timezone";
import { streamManager } from "./streamManager.js";

const scheduled = new Map();

export function scheduleJob(jobId, userTz, startTimeISO){
  const utcDate = moment.tz(startTimeISO, userTz).utc().toDate();
  const j = schedule.scheduleJob(utcDate, ()=>{ try{ streamManager.start(jobId); }catch{} });
  scheduled.set(jobId,j); return j;
}
export function cancelJob(jobId){
  if(scheduled.has(jobId)){ scheduled.get(jobId).cancel(); scheduled.delete(jobId); }
}
