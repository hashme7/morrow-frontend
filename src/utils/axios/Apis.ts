import axios from "axios";
const loginApi = axios.create({
  baseURL: "https://morrow.hashim-dev007.online",
  withCredentials: true,
});


export default loginApi;
