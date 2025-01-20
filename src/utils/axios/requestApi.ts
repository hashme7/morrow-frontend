import axios from 'axios';

const api = axios.create({
  baseURL: "https://morrow.hashim-dev007.online/user",
  withCredentials: true,
});


export default api;