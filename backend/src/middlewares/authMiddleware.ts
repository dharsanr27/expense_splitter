import { Request,Response,NextFunction } from "express";
import { supabase } from "../lib/supabase.js";
    
export async function auth(req:Request,res:Response,next:NextFunction){
    
// console.time("auth");
    const authHeader = req.headers.authorization;//what it contain
    const token = authHeader?.split(' ')[1];//why ?
    if(!token){
        return res.status(401).json({error:'No token provided'});
    }
    const {data,error}= await supabase.auth.getUser(token);

    if(error || !data.user){
        return res.status(401).json({error:'Invalid or expired token'});
    }
//     const {
//   data: { session },
// } = await supabase.auth.getSession();

// console.log(session?.access_token);
    
    req.user = {userId:data.user.id};
    // console.log("AUTH:", req.user);
    next();
//  console.timeEnd("auth");   
}
