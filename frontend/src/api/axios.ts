
import { supabase } from "@/lib/supabase";
import axios from "axios";

//base URL
const API = axios.create({
  // baseURL: "https://expense-splitter-api-nxou.onrender.com/api",
  baseURL:import.meta.env.VITE_API_BASE_URL,
});
//attached the request interceptor
API.interceptors.request.use(
  async (config) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

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
