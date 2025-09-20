import axios from "axios";

// Create Axios instance
const API = axios.create({
  baseURL: "http://127.0.0.1:8000",  // Django backend
  withCredentials: true,             // for session auth if needed
  headers: {
    "Content-Type": "application/json",
  },
});

// Add Authorization header if token exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access"); // JWT token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Optional: Response interceptor to catch 401 globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized! Redirect to login if needed.");
      // You can also trigger logout or redirect here
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
