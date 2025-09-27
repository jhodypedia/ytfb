export const validate=(schema,prop="body")=>(req,res,next)=>{
  const { value, error } = schema.validate(req[prop],{abortEarly:false,stripUnknown:true});
  if(error) return res.status(400).json({ok:false,message:"Validation error",details:error.details});
  req[prop]=value; next();
};
