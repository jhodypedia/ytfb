import bcrypt from "bcrypt";
import db from "../models/index.js";
const { User } = db;

export const updateUsername = async (req,res)=>{
  await User.update({ username:req.body.username }, { where:{ id:req.user.id } });
  res.json({ ok:true, message:"Username updated" });
};

export const updatePassword = async (req,res)=>{
  const { oldPassword, newPassword } = req.body;
  const user = await User.findByPk(req.user.id);
  const match = await bcrypt.compare(oldPassword, user.password);
  if(!match) return res.status(400).json({ok:false,message:"Password lama salah"});
  const hash = await bcrypt.hash(newPassword, 12);
  await User.update({ password:hash }, { where:{ id:req.user.id } });
  res.json({ ok:true, message:"Password updated" });
};
