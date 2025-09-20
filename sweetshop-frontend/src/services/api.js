import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",  // your Django backend
});

// 🔑 Add Authorization header if token exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
