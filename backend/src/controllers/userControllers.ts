
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { getUserByName } from "../models/userModels.js";
import { Profiles } from "../types/index.js";

interface BaseResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

//3.get user by name
interface GetUserQuery {
  search?: string;
}

export async function handleGetUser(
  req: Request<{}, BaseResponse<Profiles[]>, {}, GetUserQuery>,
  res: Response<BaseResponse<Profiles[]>>,
  next: NextFunction,
): Promise<void> {
  try {
    const { search } = req.query;
    if (typeof search !== "string") {
     res.status(400).json({
      success:false,
        message: "Search query is required"
    });
    return;
}

    const newGetUser = await getUserByName(search);
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
