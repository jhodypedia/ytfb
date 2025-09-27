import { UAParser } from "ua-parser-js";
export const detectClient = (req,res,next)=>{
  const parser = new UAParser(req.headers["user-agent"]);
  req.clientInfo = { device: parser.getResult(), timezone: req.headers["x-timezone"] || "UTC" };
  next();
};
