import { supabase } from "@/lib/supabase";
import axios from "axios";


//base URL
const API = axios.create({
  // baseURL:'https://expense-splitter-api-nxou.onrender.com/api'
  baseURL: "http://localhost:3000/api",
});
//attached the request interceptor
API.interceptors.request.use(
  async(config) => {
    const{data:{session},
  }=await supabase.auth.getSession();
  
  
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
export default API;
