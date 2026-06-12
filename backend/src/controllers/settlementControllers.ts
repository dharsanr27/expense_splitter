import { Request,Response } from "express";
import {createSettlement } from "../models/settlementModel";
export async function handleCreateSettlement(req:Request,res:Response):Promise<any>
{
try{
    const {groupId,fromUserId,toUserId,amount}=req.body;
    if(!groupId || !fromUserId || !toUserId || !amount)
    {
       return res.status(401).json(
            {
                success:false,
                message:"All fields are required"
            }
        )
    }
    const newSettlement = await createSettlement(groupId,fromUserId,toUserId,amount);
     return  res.status(201).json(
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
    return res.status(500).json(
        {
            success:false,
            message:"Something went wrong on server"
        }
    )

}
}