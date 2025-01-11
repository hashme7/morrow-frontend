import axios from "axios";

const taskApi = axios.create({
    baseURL: "http://localhost:8000/task",
    withCredentials:true,
})
export default taskApi;