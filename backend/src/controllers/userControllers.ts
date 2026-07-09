import  bcrypt from "bcrypt";
import  jwt from "jsonwebtoken";
import { Request,Response } from "express";
import { createUser, getUserByEmail, getUserByName } from "../models/userModels";
import { User } from "../types/index";
//1.Registering user
interface RegisterRequestBody{
  username:string;
  email:string;
  password:string
}
interface BaseResponse<T>{ 
  success:boolean;
  message:string;
  data?:T
}
export async function handleRegisterUser(req:Request<{},BaseResponse<User>,RegisterRequestBody,{}>, res:Response<BaseResponse<User>>):Promise<void> {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({
        success: false,
        message: "All fields are required",
      });
      return
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser(username, email, hashedPassword);
     res.status(201).json({
      success: true,
      message: "user registered succesfully",
      data: newUser,
    });
  } catch (error) {
    console.error("erro in user register controller:", error);
     res.status(500).json({
      success: false,
      message: "something went wrong on the server",
    });
  }
}
//2.Login controller
interface LoginResponseBody<T,> extends BaseResponse<T>{
  
  token?:string;
}
type LoginRequestBody = Omit<RegisterRequestBody,"name">

export async function handleLoginUser(req:Request<{},LoginResponseBody<User>,LoginRequestBody,{}>, res:Response<LoginResponseBody<User>>):Promise<void> {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
       res
        .status(400)
        .json({ success: false, message: "Email and password required" });
        return;
    }
    const user = await getUserByEmail(email);
    if (!user) {
       res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
       res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
      return;
    }
    //JWT Generation happens
    const token = jwt.sign(
      {
        userId: user.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      },
    );
    console.log(token);
     res.status(200).json({
      success: true,
      message: "login succesful!",
      token: token,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error in login controller", error);
     res.status(500).json({
      success: false,
      message:"Something went wrong on server",
    }); 
  }
}
//3.get user by name
interface GetUserQuery{
  search?:string;
}

export async function handleGetUser(req:Request<{},BaseResponse<User[]>,{},GetUserQuery>, res:Response<BaseResponse<User[]>>):Promise<void>
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
    
