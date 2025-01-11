import axios from 'axios';

const loginApi = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

loginApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized, redirecting to login...");
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default loginApi;
