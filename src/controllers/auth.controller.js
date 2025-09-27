import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../models/index.js";
import { getSetting } from "../services/settings.js";
const { User } = db;

export const register = async (req,res)=>{
  const { username, password } = req.body;
  const allow = await getSetting("allow_register", true);
  if(!allow) return res.status(403).json({ok:false,message:"Registrasi ditutup"});
  const hash = await bcrypt.hash(password, 12);
  const user = await User.create({ username, password: hash, role: "user" });
  res.json({ ok:true, user:{ id:user.id, username:user.username, role:user.role } });
};

export const login = async (req,res)=>{
  const { username, password } = req.body;
  const user = await User.findOne({ where:{ username } });
  if(!user) return res.status(400).json({ok:false,message:"User tidak ditemukan"});
  const ok = await bcrypt.compare(password, user.password);
  if(!ok) return res.status(400).json({ok:false,message:"Password salah"});
  const token = jwt.sign({ id:user.id, role:user.role, username:user.username }, process.env.JWT_SECRET, { expiresIn:"1d" });
  res.json({ ok:true, token, role:user.role, username:user.username });
};
