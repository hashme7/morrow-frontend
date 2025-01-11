import axios from "axios";

// Create an instance specifically for login-related requests
const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');
  if(accessToken){
    config.headers.Authorization = `Bearer ${accessToken}` ;
  }
  return config;
},(error)=>{
  return Promise.reject(error);
});
export { api };
