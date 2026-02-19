import axios from "axios";
import { API_BASE_URL } from "./api";

const AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include cookies in requests
});

export default AxiosInstance;
