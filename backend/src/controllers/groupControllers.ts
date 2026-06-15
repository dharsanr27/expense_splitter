import { Request, Response } from "express";

import {createGroup, addMemberToGroup,memberList, userGroups} from "../models/groupModels";
//1.Group creation
export async function handleCreateGroup(req:Request,res:Response):Promise<any>
{
    try{
const {groupName}= req.body;
const  createdBy=req.user.userId;
if(!groupName || !createdBy)
{
    console.log("DEBUG: groupName is:", groupName);
    console.log("DEBUG: createdBy (req.user.userId) is:", createdBy);
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
        const {groupId} = req.params;
const {userId} = req.body;
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
const newMember = await addMemberToGroup(parseInt(groupId as string),userId);//why we are doing the parseint for everytime we use params
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
export async function handleMemberList(req:Request,res:Response):Promise<any> {
    try{
        const {groupId} = req.params;
        if(!groupId)
{
    //data validation status code 400
   return res.status(400).json(
        {
            success:false,
            message:"All fields are required"
        }
    )

}
const newMemberList = await memberList(parseInt(groupId as string));//task:when ever we are getting from req.param why we do this is it professional

return res.status(201).json(
    {
        success:true,
        //modify this so that it should show group name in which the user joined task 1: pending
        message:"Succesfully retrieved group members:",
        data: newMemberList
    }
);
    }
    catch(error)
    {
         console.error("Error in the handle memberlist:",error);
   return res.status(500).json(
        {
            success:false,
            message:"Something went wrong in server"
        }
    );
    }
    
}
export async function  handleUserGroups(req:Request,res:Response):Promise<any>
{
try{
    const  userId=req.user.userId;
    console.log("DEBUG: Raw userId from token:", userId, "Type:", typeof userId);
    if(!userId)
{
    //data validation status code 400
   return res.status(400).json(
        {
            success:false,
            message:"You should login first"
        }
    )

}
const newUserGroup = await userGroups(userId);
return res.status(201).json(
    {
        success:true,
        //modify this so that it should show group name in which the user joined task 1: pending
        message:"Succesfully retrieved groups:",
        data: newUserGroup
    }
);

}
catch(error)
{
           console.error("Error in the handle userGroup controller:",error);
   return res.status(500).json(
        {
            success:false,
            message:"Something went wrong in server"
        }
    );
}
}