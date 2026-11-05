import pool from "../config/database.js";
import { Request, Response, NextFunction } from "express";
import { supabase } from "../lib/supabase.js";
export async function verifyGroupMember(req:Request, res:Response, next:NextFunction) {
  
   
    const groupId = req.params.groupId;
    const authHeader = req.headers.authorization;
    if (!authHeader) {
    res.status(401).json({
        message: "Authorization header is required"
    });
    return;
}
    const token = authHeader.split(" ")[1];
    
    const {data: {user},error} = await supabase.auth.getUser(token);
   

if (error || !user) {
  return res.status(401).json({ message: "Invalid token" });
}
    const userId =user.id;
    
    const result = await pool.query(
        `SELECT 1
         FROM group_members
         WHERE group_id = $1
         AND user_id = $2`,
        [groupId, userId]
    );
    
    if (result.rows.length === 0) {
        return res.status(403).json({
            message: "Access denied"
        });
    }

    next();
    
}