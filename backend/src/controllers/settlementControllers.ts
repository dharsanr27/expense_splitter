import { Request,Response } from "express";
import {createSettlement } from "../models/settlementModel";
export async function handleCreateSettlement(req:Request,res:Response):Promise<void>
{
try{
    const {groupId,fromUserId,toUserId,amount}=req.body;
    if(!groupId || !fromUserId || !toUserId || !amount)
    {
        res.status(401).json(
            {
                success:false,
                message:"All fields are required"
            }
        );
        return;
    }
    const newSettlement = await createSettlement(groupId,fromUserId,toUserId,amount);
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
     res.status(500).json(
        {
            success:false,
            message:"Something went wrong on server"
        }
    )

}
}