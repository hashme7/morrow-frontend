import axios from 'axios';


const userApi = axios.create({
  baseURL: "https://morrow.hashim-dev007.online/user",
  withCredentials: true,
});

  export default userApi;