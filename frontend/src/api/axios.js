import axios from 'axios';

//base URL
const  API = axios.create({
    baseURL:'https://expense-splitter-api-nxou.onrender.com/api'
});
//attached the request interceptor
API.interceptors.request.use((config)=>
{
const token = localStorage.getItem('token');
if(token)

    {
        config.headers.Authorization = `Bearer ${token}`;
     

    }
    return config;
},(error)=>
{
return Promise.reject(error)
}
    
);
export default API;
