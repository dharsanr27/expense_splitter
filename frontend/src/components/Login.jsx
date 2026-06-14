import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {useState} from 'react';

import API from "../api/axios";

function Login() {
const navigate = useNavigate();
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const handleEmail = ((event)=>{setEmail(event.target.value)});
    const handlePassword =((event)=>{setPassword(event.target.value)});
    //connection
//     const handle = async(e)=>

//     {
//    e.preventDefault()//why it is so important
    
//         const response1= await API.get("/ping");
       
//         console.log(response1.data);
//     }
    const handleSubmit = async (e) => {
        //what this e arguments denoting what it contains:task 1
  e.preventDefault();

 try{
    const response = await API.post("/users/login",{
        email,
        password
    });
    localStorage.setItem("token",response.data.token);
     console.log(response.data);
     navigate('/dashboard')
 }catch(error)
 {
    console.error(error);
 }

  

};
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}className="space-y-4">
            <Input type="email" placeholder="Email" onChange={handleEmail}  value={email}/>
            <Input type="password" placeholder="Password" onChange={handlePassword} value={password} />
            <Button type="submit" className="w-full">Login</Button>
            <p className="text-center">
                Don't have an account?<a href="/signup" className="hover:underline">Sign Up</a>
            </p>
          </form>
       
         
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;