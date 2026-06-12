import { Request, Response } from "express";

import {createGroup, addMemberToGroup} from "../models/groupModels";
//1.Group creation
export async function handleCreateGroup(req:Request,res:Response):Promise<any>
{
    try{
const {groupName,createdBy}= req.body;
if(!groupName || !createdBy)
{
  return  res.status(400).json(
        {
            success:false,
            message:"All fields are required"
        }
    );
}
    const newGroup = await createGroup(groupName,createdBy);
    //diff btw 201 and 200
    return res.status(201).json(
        {
            success:true,
            message:"Group created succesfully",
            data:newGroup
        }
    );

    }
    catch(error)
    {
        console.error("Error in group creation controller:",error);
        return res.status(500).json(
            {
                success:false,
                message:"something went wrong on the server"
            }
        );
    }
}
//2.Add members
export async function handleAddMember(req:Request,res:Response):Promise<any>
{
    try{
const {groupId,userId} = req.body;
//data validation
if(!groupId || !userId)
{
    //data validation status code 400
   return res.status(400).json(
        {
            success:false,
            message:"All fields are required"
        }
    )

}
const newMember = await addMemberToGroup(groupId,userId);
//status code:201 for successful post data the database
return res.status(201).json(
    {
        success:true,
        //modify this so that it should show group name in which the user joined task 1: pending
        message:"Succesfully added  to the group",
        data: newMember
    }
);
    }

catch(error)
{
    console.error("Error in add member to the group controller:",error);
   return res.status(500).json(
        {
            success:false,
            message:"Something went wrong in server"
        }
    );

}

}

module.exports = {handleCreateGroup,handleAddMember}