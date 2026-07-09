import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useTheme } from "./ThemeContext";
import "./Signup.css";
import API from "../api/axios";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const[email,setEmail]=useState("");
  // const[username,setUserName]=useState("");
 
  const[password,setPassword]=useState("");
  const {theme} = useTheme();
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
    <div className="Signup-app" data-theme={theme}>
      <Card className="w-[400px] shadow-xl border">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl p-2">Sign Up</CardTitle>
        </CardHeader>

        <CardContent className="space-y-5 p-6">
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