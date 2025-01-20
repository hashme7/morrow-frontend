import axios from "axios";

const taskApi = axios.create({
  baseURL: "https://morrow.hashim-dev007.online/task",
  withCredentials: true,
});
export default taskApi;