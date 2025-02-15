import axios from "axios";
import { toast } from "react-hot-toast";
// https://morrow.hashim-dev007.online/
const loginApi = axios.create({
  baseURL: "https://morrow.hashim-dev007.online/auth",
  withCredentials: true,
});

loginApi.interceptors.response.use(
  (response) => {
    console.log(`
      
      `,
      response,
      `

      `)
    return response;
  },
  (error) => {
    if (error.response) {
      const statusCode = error.response.status;

      switch (statusCode) {
        case 400:
          // toast("Please check the input data", {
          //   icon: "👏",
          //   style: {
          //     borderRadius: "10px",
          //     background: "#333",
          //     color: "#fff",
          //   },
          // });
          break;

        case 401:
          toast("Unauthorized: Please log in.", {
            icon: "",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
          window.location.href = "/login";
          break;

        case 403:
          break;

        case 404:
          toast("Not Found: The resource you are looking for does not exist.", {
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
          break;

        case 500:
          toast(
            "Internal Server Error: Something went wrong. Please try again later.",
            {
              style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
              },
            }
          );  
          break;

        case 502:
          toast.error("Bad Gateway: The server is temporarily unavailable.");
          break;

        case 503:
          toast.error(
            "Service Unavailable: The server is currently down for maintenance."
          );
          break;

        case 504:
          toast.error("Gateway Timeout: The server took too long to respond.");
          break;

        default:
          toast.error(
            `Error ${statusCode}: ${
              error.response.data.message || "An unexpected error occurred."
            }`
          );
      }
    } else if (error.request) {
      console.log(error.request);
      toast("Unauthorized: Please log in.", {
        icon: "!",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
    } else {
      toast.error(`Request Error: ${error.message}`);
    }
    return Promise.reject(error);
  }
);

export default loginApi;
