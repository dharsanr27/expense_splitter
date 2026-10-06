import { Request,Response,NextFunction } from "express";
import {createSettlement } from "../models/settlementModel.js";
import redisClient from "../config/redis.js";
export async function handleCreateSettlement(req:Request,res:Response,next:NextFunction):Promise<void>
{
try{
    const {groupId,fromUserId,toUserId,amount}=req.body;
    const newSettlement = await createSettlement(groupId,fromUserId,toUserId,amount);
    await redisClient.del(`group:${groupId}:dashboard`);
       res.status(201).json(
        {
            success:true,
            message:"Settlement succesfully added",
            data:newSettlement
        }
    )

}
catch(error)
{
    console.error("Error in handleCreateSettlement controller:",error);
    next(error);

}
}