import pool from "../config/database";
import { Request, Response, NextFunction } from "express";
import { supabase } from "../lib/supabase";
export async function verifyGroupMember(req:Request, res:Response, next:NextFunction) {
  
    console.time("verify");
    const groupId = req.params.groupId;
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
     console.log(token)
    console.time("getUser");
    const {data: {user},error} = await supabase.auth.getUser(token);
    console.timeEnd("getUser");
    // console.log("user:", user); know user_id
// console.log("error:", error);

if (error || !user) {
  return res.status(401).json({ message: "Invalid token" });
}
    const userId =user.id;
    console.time("Dbss");
    const result = await pool.query(
        `SELECT 1
         FROM group_members
         WHERE group_id = $1
         AND user_id = $2`,
        [groupId, userId]
    );
    console.timeEnd("Dbss");
     console.log(result.rows.length);
    if (result.rows.length === 0) {
        return res.status(403).json({
            message: "Access denied"
        });
    }

    next();
    console.timeEnd("verify");
}