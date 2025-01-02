import axios from "axios";

const API_BASE_URL = "http://146.103.50.26:4000"; // Update this if your backend URL changes

const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // Optional: Timeout for API requests
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiInstance;
