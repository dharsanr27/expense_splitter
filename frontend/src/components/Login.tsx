import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {useState} from 'react';
import { useTheme } from "./ThemeContext";
import "./Login.css";
import {FcGoogle} from "react-icons/fc";
import { supabase } from "@/lib/supabase";
import type { ChangeEvent,SubmitEvent } from "react";


function Login() {
    const{theme}=useTheme();
    const navigate = useNavigate();
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const[err,setErr]=useState("");
    const handleEmail = ((event: ChangeEvent<HTMLInputElement>)=>{setEmail(event.target.value)});
    const handlePassword =((event: ChangeEvent<HTMLInputElement>)=>{setPassword(event.target.value)});
    //connection
//     const handle = async(e)=>

//     {
//    e.preventDefault()//why it is so important
    
//         const response1= await API.get("/ping");
       
//         console.log(response1.data);
//     }
    const handleSubmit = async (e:SubmitEvent<HTMLFormElement>) => {
        //what this e arguments denoting what it contains:task 1
  e.preventDefault();

 try{
//   if (!email.trim()) {
//     setErr("Email is required");
//     return;
// }
// if (!password.trim()) {
//     setErr("Password is required");
//     return;
// }
   const {  error } = await supabase.auth.signInWithPassword({ email, password });
   
   

    //  console.log(data);
     console.log(error);
    if(error)
    {
      setErr(`${error.message}`);
    }
    else{
      navigate('/dashboard');
    }
    
 }catch(error)
 {
    console.error(error);
 }
};
 const handleGoogleLogin = async () =>{
      
      const {error}= await supabase.auth.signInWithOAuth({
        provider:'google',
        options:{
          redirectTo:`${window.location.origin}/dashboard`
        }
      });
      const {data: {session}} = await supabase.auth.getSession();
    if(error)
    {
      setErr(error.message);
    }
    const userId = session?.user.id;
    console.log(userId);
      if(error) console.error(error.message);
    };
  return (
   <div className="Login-app min-h-screen flex items-center justify-center px-4" data-theme={theme}>
  <Card className="w-[400px] shadow-xl border">
    <CardHeader className="text-center pb-2">
      <CardTitle className="text-3xl p-2">
        Welcome Back
      </CardTitle>
      <p className="text-sm text-muted-foreground mt-2">
        Sign-in to continue to your account
      </p>
    </CardHeader>
    {err && (
  <p className=" text-center text-red-500 text-sm mt-2">
    {err}
  </p>
)}

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

        <Button type="submit" className=" bg-[#0F6B5C] hover:bg-[#0c5449] w-full cursor-pointer">
          Login
        </Button>
        <hr></hr>
        <Button type="button" onClick={handleGoogleLogin} className="w-full hover:underline cursor-pointer"><FcGoogle size={20} />Sign in with Google</Button>

        <p className="text-center text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium hover:underline">
            Sign Up
          </Link>
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
