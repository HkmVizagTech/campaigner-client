import axios from "axios";
import { toast } from "@/utils/toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});
let isUnauthorizedHandled = false;
const handleUnauthorized = () => {
  if (isUnauthorizedHandled) return;

  isUnauthorizedHandled = true;

  toast.error("Session expired. Please sign in again.");

  sessionStorage.removeItem("token");

  setTimeout(() => {
    window.location.replace("/admin/login");
  }, 1500);
};

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (
      token &&
      token !== "null" &&
      token !== "undefined" &&
      !config.skipAuth
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error?.response) {
      return Promise.reject({
        message: "Network error",
        originalError: error,
      });
    }

    if (
      error.response.status === 401 &&
      window.location.pathname !== "/admin/login"
    ) {
      handleUnauthorized();
      return Promise.reject(error);
    }
    return Promise.reject(error);
  },
);

export default api;
