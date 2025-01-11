import axios from "axios";
import { toast } from "react-hot-toast"; // Assuming you're using react-hot-toast for notifications

const loginApi = axios.create({
  baseURL: "http://localhost:8000", // Replace with your actual backend URL
  withCredentials: true,
});

loginApi.interceptors.response.use(
  (response) => {
    // Successful response
    return response;
  },
  (error) => {
    // Check for response errors
    if (error.response) {
      // Server responded with a status outside the 2xx range
      const statusCode = error.response.status;

      // Handle different HTTP status codes
      switch (statusCode) {
        case 400:
          // Bad Request - Likely invalid parameters
          // toast.error("Bad Request: Please check the input data.");
          console.log(`
            
            
            ldldldl




            
            `);
          
          toast("Please check the input data", {
            icon: "👏",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
          // window.location.href = '/login'
          break;

        case 401:
          // Unauthorized - Session expired or user not logged in
          toast("Unauthorized: Please log in.", {
            icon: "👏",
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            }
          });
          // Optionally, you can redirect to the login page here if needed:
          window.location.href = '/login';
          break;

        case 403:
          // Forbidden - User does not have the necessary permissions
          // toast.error(
          //   "Forbidden: You do not have permission to perform this action."
          // );
          break;

        case 404:
          // Not Found - Resource does not exist
          toast.error(
            "Not Found: The resource you are looking for does not exist."
          );
          break;

        case 500:
          // Internal Server Error - Something went wrong on the server
          toast.error(
            "Internal Server Error: Something went wrong. Please try again later."
          );
          break;

        case 502:
          // Bad Gateway - Server is down or unreachable
          toast.error("Bad Gateway: The server is temporarily unavailable.");
          break;

        case 503:
          // Service Unavailable - Server overloaded or under maintenance
          toast.error(
            "Service Unavailable: The server is currently down for maintenance."
          );
          break;

        case 504:
          // Gateway Timeout - The server timed out while processing the request
          toast.error("Gateway Timeout: The server took too long to respond.");
          break;

        default:
          // Default error handling
          toast.error(
            `Error ${statusCode}: ${
              error.response.data.message || "An unexpected error occurred."
            }`
          );
      }
    } else if (error.request) {
      console.log(error.request);
      // The request was made but no response was received (network error, CORS, etc.)
      toast.error("Network Error: No response from the server.");
    } else {
      // An error occurred in setting up the request
      toast.error(`Request Error: ${error.message}`);
    }

    // Return a rejected promise so the calling function can handle the error further if needed
    return Promise.reject(error);
  }
);

export default loginApi;
