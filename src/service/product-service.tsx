import axios from "axios";

const API_BASE_URL = "https://production.doca.love/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getUsers = async () => {
  try {
    const response = await apiClient.get("/users");
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
