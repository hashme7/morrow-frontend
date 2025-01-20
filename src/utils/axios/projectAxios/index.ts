import axios from "axios";
import toast from "react-hot-toast";

const projectAxios = axios.create({
  baseURL: "https://morrow.hashim-dev007.online/project",
  withCredentials: true,
});

projectAxios.interceptors.response.use((response) => {
    return response;
  },
    (error) => {
        if (error.response) {
            const statusCode = error.response.status;
            switch (statusCode) {
              case 500:
                toast(
                  "Internal Server Error(project): Something went wrong. Please try again later.",
                    {
                      icon:"*",
                    style: {
                      borderRadius: "10px",
                      background: "#333",
                      color: "#fff",
                    },
                  }
                );
                break;
            }
        }
    }
)
export default projectAxios;