import axios from "axios";
import { getConfiguration, removeToken, setToken } from "./utils";
import { Configuration } from "./types";
// import secureLocalStorage from "react-secure-storage";
const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1/`,
});
axiosClient.defaults.withCredentials = true;

axiosClient.interceptors.request.use((config) => {
  const conf = getConfiguration();
  config.headers.Authorization = `Bearer ${conf?.token}`;
  config.headers["X-LOCALE"] = conf?.language;
  return config;
});

let refreshTokenPromise: any = null;

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 403 Unauthorized
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const conf = getConfiguration();

      // If refreshTokenPromise is already running, wait for it
      if (!refreshTokenPromise) {
        refreshTokenPromise = refreshAccessToken(conf);
      }

      try {
        const newToken = await refreshTokenPromise;
        refreshTokenPromise = null; // Reset promise after completion
        // Update the failed request with the new token and retry
        axiosClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        refreshTokenPromise = null; // Reset promise on failure
        removeToken();
        window.location.href = `/login`; // Redirect to login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export async function refreshAccessToken(conf: Configuration | null) {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/v1/refresh-token`,
      {}, // Request body, usually empty, but can be filled if needed
      {
        withCredentials: true, // Ensure credentials (cookies) are included
        headers: {
          Authorization: `Bearer ${conf?.token}`, // Add Authorization header if required
          "X-LOCALE": conf?.language || "en", // Set the locale
        },
      }
    );
    const newToken = response.data.access_token;
    const newType = response.data.type.toLowerCase();
    setToken({
      token: newToken,
      type: newType,
    });
    return newToken;
  } catch (error: any) {
    throw error;
  }
}

export default axiosClient;
