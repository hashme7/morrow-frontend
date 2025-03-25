import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://morrow-backend.hashim-dev007.online",
  withCredentials: true,
});


export default api;
