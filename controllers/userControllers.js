const bcrypt = require("bcrypt");
const { createUser, getUserByEmail } = require("../models/userModels.js");
//1.Registering user
async function handleRegisterUser(req, res) {
  try {
    //destructing
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    //if password present how will you handle it for safety
    //talk to the model to create the user
    const hashedPassword = await bcrypt.hash(password, 10);
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
async function handleLoginUser(req, res) {
  try{
    const {email,password} = req.body;
    if(!email || !password)
    {
      return res.status(400).json({success: false,message:"Email and password required"});
    }
    //why we are adding the () for getUserByEmail ,does it not affect the code
    const user = await getUserByEmail(email);
    if(!user)
    {
      //what the diff btw 400 and 401
      return res.status(401).json(
        {
          success: false,
          message:"Invalid credentials"
        }
      )
    }
    //how it gives the password of the user using user.pasword
    const  isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch)
    {
      res.status(401).json(
        {
          success:false,
          message:"Invalid credentials"
        }
      );
    }
    res.status(200).json(
      {
        success: true,
        message:"login succesful!",
        data:
        {
          id:user.id,
          username:user.username,
          email:user.email
        }
      }
    );
  }
  catch(error){
    console.error("Error in login controller",error);
    //why we don't need throw here
    res.status(500).json(
      {
        success:false,
        message:"Something went wrong on server"
      }
    );

  }

}
module.exports = { handleRegisterUser,handleLoginUser };
