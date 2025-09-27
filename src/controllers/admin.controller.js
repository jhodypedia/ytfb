import { getAllSettings, setSetting } from "../services/settings.js";
export const getSettings = async (req,res)=>{ res.json({ ok:true, settings: await getAllSettings() }); };
export const updateSetting = async (req,res)=>{
  const { key, value } = req.body;
  await setSetting(key,value);
  res.json({ ok:true, message:"Setting updated" });
};
