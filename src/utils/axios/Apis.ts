import axios from "axios";
const api = axios.create({
  baseURL: "https://morrow-backend.hashim-dev007.online",
  withCredentials: true,
});


export default api;
