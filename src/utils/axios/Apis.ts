import axios from "axios";
// https://morrow.hashim-dev007.online/
const loginApi = axios.create({
  baseURL: "https://morrow.hashim-dev007.online",
  withCredentials: true,
});


export default loginApi;
