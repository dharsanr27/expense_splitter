import { NextFunction, Request, Response } from "express";

import {
  createGroup,
  addMemberToGroup,
  memberList,
  userGroups,
} from "../models/groupModels.js";
//1.Group creation
export async function handleCreateGroup(
  req: Request,
  res: Response,
next:NextFunction): Promise<void> {
  try {
    const { groupName } = req.body;
    
    const createdBy = req.user!.userId;

    const newGroup = await createGroup(groupName, createdBy);
    
     res.status(201).json({
      success: true,
      message: "Group created succesfully",
      data: newGroup,
    });
  } catch (error) {
    console.error("Error in group creation controller:", error);
  
    next(error);
  }
}
//2.Add members
export async function handleAddMember(
  req: Request,
  res: Response,
next:NextFunction): Promise<void> {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;
   
    const newMember = await addMemberToGroup(
      parseInt(groupId as string),
      userId,
    );
     res.status(201).json({
      success: true,
      
      message: "Succesfully added  to the group",
      data: newMember,
    });
    ``;
  } catch (error) {
    console.error("Error in add member to the group controller:", error);
   
    next(error);
  }
}
export async function handleMemberList(
  req: Request,
  res: Response,
next:NextFunction): Promise<void> {
  
  try {
    const { groupId } = req.params;
   
    const newMemberList = await memberList(parseInt(groupId as string)); 
    
     res.status(201).json({
      success: true,
      message: "Succesfully retrieved group member:",
      data: newMemberList,
    });
  } catch (error) {
    console.error("Error in the handle memberlist:", error);
    
     next(error);
  }
  
}
export async function handleUserGroups(
  req: Request,
  res: Response,
next:NextFunction): Promise<void> {
  try {
    const userId = req.user!.userId;
 
  
    const newUserGroup = await userGroups(userId);
     res.status(200).json({
      success: true,
      
      message: "Succesfully retrieved groups:",
      data: newUserGroup,
    });
  } catch (error) {
    console.error("Error in the handle userGroup controller:", error);
    
     next(error);
  }
}
