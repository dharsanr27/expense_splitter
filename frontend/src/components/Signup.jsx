import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import API from "../api/axios";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const[email,setEmail]=useState("");
  // const[username,setUserName]=useState("");
 
  const[password,setPassword]=useState("");
  const handleEmail=event=>{setEmail(event.target.value)};
  // const handleUserName=event=>{setUserName(event.target.value)};
  const handlePassword=event=>{setPassword(event.target.value)};
    const handleSubmit = async (e)=>{
       e.preventDefault();
      const formData = new FormData(e.target);
        const username=formData.get("username");
        try{
           const response = await API.post("/users/register",
            {
             username,
            email,
            password
            });
          console.log(response.data); 
          navigate('/');
        }
        catch(error)
        {
          console.error(error);
        }
    }
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="username" type="username" placeholder="Username" />
            <Input type="email" placeholder="Email" onChange={handleEmail} value={email} />
            <Input type="password" placeholder="Password" onChange={handlePassword} value={password}/>
            <Button className="w-full">Sign Up</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;