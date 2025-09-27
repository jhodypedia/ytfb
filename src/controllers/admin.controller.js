import { getAllSettings, setSetting } from "../services/settings.js";

export const getSettings = async (req,res)=>{
  res.json({ ok:true, settings: await getAllSettings() });
};

export const updateSetting = async (req,res)=>{
  const { key, value } = req.body;
  await setSetting(key,value);
  res.json({ ok:true, message:"Setting updated" });
};

// ✅ Public endpoint untuk login/register
export const publicSettings = async (req,res)=>{
  try {
    const settings = await getAllSettings();
    // fallback kalau kosong
    if (!settings) {
      return res.json({ ok:true, settings:{ enable_captcha:false } });
    }
    res.json({ ok:true, settings });
  } catch (err) {
    console.error("Error publicSettings:", err);
    res.status(500).json({ ok:false, message:"Gagal load settings" });
  }
};
