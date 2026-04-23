import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const apiClient = axios.create({
  baseURL: API_URL
});

export const buildAssetUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("blob:") || path.startsWith("data:")) return path;
  return `${BACKEND_URL}${path}`;
};

export async function apiFetch(endpoint, options = {}) {
  try {
    const response = await apiClient.request({
      url: endpoint,
      method: options.method || "GET",
      data: options.body,
      headers: options.headers
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Request failed");
  }
}

export { API_URL };
