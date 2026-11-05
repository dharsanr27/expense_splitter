import { NextFunction, Request, Response } from "express";
import { getUserByName } from "../models/userModels.js";


export async function handleGetUser(
  req: Request,
  // res: Response<BaseResponse<Profiles[]>>,
   res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { groupId } = req.params;
    const { search } = req.query;
    if (typeof search !== "string") {
     res.status(400).json({
      success:false,
        message: "Search query is required"
    });
    return;
}

    const newGetUser = await getUserByName(parseInt(groupId as string),search);
    res.status(201).json({
      success: true,
      message: "Succesfully retrieved username:",
      data: newGetUser,
    });
  } catch (error) {
    console.error("Error in get user controller", error);

    next(error);
  }
}
