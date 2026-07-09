import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {useState} from 'react';
import { useTheme } from "./ThemeContext";
import "./Login.css";
import API from "../api/axios";

function Login() {
    const{theme}=useTheme();
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
    localStorage.setItem("userId", String(response.data.data.id));
    localStorage.setItem("userName", response.data.data.username);

     console.log(response.data);
     navigate('/dashboard')
 }catch(error)
 {
    console.error(error);
 }

  

};
  return (
   <div className="Login-app" data-theme={theme}>
  <Card className="w-[400px] shadow-xl border">
    <CardHeader className="text-center pb-2">
      <CardTitle className="text-3xl p-2">
        Welcome Back
      </CardTitle>
      <p className="text-sm text-muted-foreground mt-2">
        Sign-in to continue to your account
      </p>
    </CardHeader>

    <CardContent className="space-y-5 p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={handleEmail}
        />

        <Input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={handlePassword}
        />

        <Button type="submit" className="w-full">
          Login
        </Button>

        <p className="text-center text-sm">
          Don't have an account?{" "}
          <a href="/signup" className="font-medium hover:underline">
            Sign Up
          </a>
        </p>
      </form>
    </CardContent>
  </Card>
</div>
  );
}

export default Login;


//  <div className="Login-app" data-theme={theme} >
//       <Card className="w-[350px]">
//         <CardHeader>
//           <CardTitle className="Login-logo">Login</CardTitle>
//         </CardHeader>

//         <CardContent>
//           <form onSubmit={handleSubmit}className="space-y-4">
//             <Input type="email" placeholder="Email" onChange={handleEmail}  value={email}/>
//             <Input type="password" placeholder="Password" onChange={handlePassword} value={password} />
//             <Button type="submit" className="w-full">Login</Button>
//             <p className="text-center">
//                 Don't have an account?<a href="/signup" className="hover:underline">Sign Up</a>
//             </p>
//           </form>
       
         
//         </CardContent>
//       </Card>
//     </div>