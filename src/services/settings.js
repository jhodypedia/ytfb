import db from "../models/index.js";
const { Setting } = db;

export async function getSetting(key, def=null){
  const row = await Setting.findOne({ where:{ key } });
  return row ? JSON.parse(row.value) : def;
}
export async function setSetting(key,value){
  await Setting.upsert({ key, value: JSON.stringify(value) });
}
export async function getAllSettings(){
  const rows = await Setting.findAll(); const out={};
  rows.forEach(r=> out[r.key]=JSON.parse(r.value));
  if(out.allow_register===undefined) out.allow_register=true;
  if(out.enable_captcha===undefined) out.enable_captcha=false;
  if(!out.captcha_providers) out.captcha_providers=[];
  if(!out.captcha_keys) out.captcha_keys={};
  return out;
}
