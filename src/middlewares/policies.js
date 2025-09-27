import { getSetting } from "../services/settings.js";

export async function checkRegisterAllowed(req,res,next){
  const allow = await getSetting("allow_register", true);
  if(!allow) return res.status(403).json({ok:false,message:"Registrasi ditutup"});
  next();
}

export async function verifyCaptcha(req,res,next){
  const enabled = await getSetting("enable_captcha", false);
  if(!enabled) return next();
  const providers = await getSetting("captcha_providers", []);
  const keys = await getSetting("captcha_keys", {});
  const token = req.body.captchaToken;
  if(!token) return res.status(400).json({ok:false,message:"Captcha tidak ditemukan"});

  let verified=false;
  for(const p of providers){
    try{
      if(p==="recaptcha"){
        const resp=await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${keys?.recaptcha?.secret}&response=${token}`,{method:"POST"});
        const json=await resp.json(); if(json.success) verified=true;
      }
      if(p==="hcaptcha"){
        const resp=await fetch("https://hcaptcha.com/siteverify",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:`secret=${keys?.hcaptcha?.secret}&response=${token}`});
        const json=await resp.json(); if(json.success) verified=true;
      }
      if(p==="turnstile"){
        const resp=await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:`secret=${keys?.turnstile?.secret}&response=${token}`});
        const json=await resp.json(); if(json.success) verified=true;
      }
    }catch{} // ignore one provider failure
  }
  if(!verified) return res.status(400).json({ok:false,message:"Captcha gagal diverifikasi"});
  next();
}
