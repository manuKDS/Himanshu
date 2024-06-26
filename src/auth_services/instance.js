import axios from "axios";
import { hasCookie, getCookie } from "cookies-next";
const baseURL = process.env.API_SERVER;

let headers = {};

let validToken = hasCookie("token");

if (!validToken) {
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

const getToken = getCookie("token");

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    Authorization: `Bearer ${getToken}`,
  },
});

// // 3. Check error code 401
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return error;
  }
);
export default axiosInstance;
