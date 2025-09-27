import jwt from "jsonwebtoken";
export const auth = (roles=[])=>{
  if(typeof roles==="string") roles=[roles];
  return (req,res,next)=>{
    const h=req.headers.authorization||""; const t=h.startsWith("Bearer ")?h.slice(7):null;
    if(!t) return res.status(401).json({ok:false,message:"No token"});
    try{
      const d=jwt.verify(t,process.env.JWT_SECRET);
      req.user=d;
      if(roles.length && !roles.includes(d.role)) return res.status(403).json({ok:false,message:"Forbidden"});
      next();
    }catch{ return res.status(401).json({ok:false,message:"Unauthorized"}); }
  };
};
