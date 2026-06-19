import  bcrypt from "bcrypt";
import  jwt from "jsonwebtoken";
import { Request,Response } from "express";
import { createUser, getUserByEmail, getUserByName } from "../models/userModels";
//1.Registering user
export async function handleRegisterUser(req:Request, res:Response):Promise<any> {
  try {
    //destructing
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //talk to the model to create the user
    const hashedPassword = await bcrypt.hash(password, 10); //what is the number 10 denotes
    const newUser = await createUser(username, email, hashedPassword);
    return res.status(201).json({
      success: true,
      message: "user registered succesfully",
      data: newUser,
    });
  } catch (error) {
    console.error("erro in user register controller:", error);
    return res.status(500).json({
      success: false,
      message: "something went wrong on the server",
    });
  }
}
//2.Login controller
export async function handleLoginUser(req:Request, res:Response):Promise<any> {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password required" });
    }
    //why we are adding the () for getUserByEmail ,does it not affect the code
    const user = await getUserByEmail(email);
    if (!user) {
      //what the diff btw 400 and 401
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    //how it gives the password of the user using user.pasword
    const isMatch = await bcrypt.compare(password, user.password);//try to test it
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
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
    return res.status(200).json({
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
    //why we don't need throw here
    return res.status(500).json({
      success: false,
      message: "Something went wrong on server",
    });
  }
}

export async function handleGetUser(req:Request, res:Response):Promise<any>
{
  try{
const {search} =req.query;
    if(typeof search !== 'string')
    {
      return res.json([]);
    }
    if(!search || search.trim()==='')
    {
      return res.json([]);
    }
    const newGetUser = await getUserByName(search);
    return res.status(201).json(
    {
        success:true,
        //modify this so that it should show group name in which the user joined task 1: pending
        message:"Succesfully retrieved username:",
        data: newGetUser
    }
);
  }
  catch(error)
  {
     console.error("Error in get user controller", error);
    //why we don't need throw here
    return res.status(500).json({
      success: false,
      message: "Something went wrong on server",
    });
  }
  }
    
