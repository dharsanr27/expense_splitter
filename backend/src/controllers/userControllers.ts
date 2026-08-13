import  bcrypt from "bcrypt";
import  jwt from "jsonwebtoken";
import { Request,Response } from "express";
import { getUserByName } from "../models/userModels";
import { Profiles } from "../types/index";

interface BaseResponse<T>{ 
  success:boolean;
  message:string;
  data?:T
}

//3.get user by name
interface GetUserQuery{
  search?:string;
}

export async function handleGetUser(req:Request<{},BaseResponse<Profiles[]>,{},GetUserQuery>, res:Response<BaseResponse<Profiles[]>>):Promise<void>
{
  try{
const {search} =req.query;
    if(typeof search !== 'string')
     {
      res.json({ success: true, message: "No search term", data: [] });
      return;
    }
    if(!search || search.trim()==='')
    {
      res.json({ success: true, message: "No search term", data: [] });
      return;
    }
    const newGetUser = await getUserByName(search);
     res.status(201).json(
    {
        success:true,
        message:"Succesfully retrieved username:",
        data: newGetUser
    }
);
  }
  catch(error)
  {
     console.error("Error in get user controller", error);
     res.status(500).json({
      success: false,
      message: "Something went wrong on server",
    });
  }
  }
    
