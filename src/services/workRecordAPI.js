import axios from "axios";
import { isTokenExpired } from "../utils/Auth";

const API_BASE_URL = "http://localhost:8080";

// Create axios instance with common configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("Token exists:", !!token);
    console.log("Token expired:", token ? isTokenExpired(token) : "No token");

    if (token && !isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Added Authorization header");
    } else {
      console.log("No valid token available");
    }
    console.log("Request config:", {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
apiClient.interceptors.response.use(
  (response) => {
    console.log("Response received:", {
      status: response.status,
      data: response.data,
      url: response.config.url,
    });
    return response;
  },
  (error) => {
    console.error("Response error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url,
    });

    if (error.response?.status === 401) {
      // Token expired or invalid
      console.log("Unauthorized - removing token and redirecting");
      localStorage.removeItem("token");
      window.location.href = "/auth/signin";
    }
    return Promise.reject(error);
  }
);

// Work Records API
export const workRecordAPI = {
  // Create a new work record
  createWorkRecord: async (workRecordData) => {
    const response = await apiClient.post("/api/work-records", workRecordData);
    return response.data;
  },

  // Update an existing work record
  updateWorkRecord: async (workRecordId, workRecordData) => {
    const response = await apiClient.put(
      `/api/work-records/${workRecordId}`,
      workRecordData
    );
    return response.data;
  },

  // Delete a work record
  deleteWorkRecord: async (workRecordId) => {
    await apiClient.delete(`/api/work-records/${workRecordId}`);
  },

  // Get work record by ID
  getWorkRecordById: async (workRecordId) => {
    const response = await apiClient.get(`/api/work-records/${workRecordId}`);
    return response.data;
  },

  // Get work record by date
  getWorkRecordByDate: async (date) => {
    const response = await apiClient.get(`/api/work-records/date/${date}`);
    return response.data;
  },

  // Get all work records for the authenticated intern
  getAllWorkRecords: async () => {
    const response = await apiClient.get("/api/work-records");
    return response.data;
  },

  // Get work records by date range
  getWorkRecordsByDateRange: async (startDate, endDate) => {
    const response = await apiClient.get("/api/work-records/date-range", {
      params: { startDate, endDate },
    });
    return response.data;
  },

  // Get work records by month
  getWorkRecordsByMonth: async (year, month) => {
    const response = await apiClient.get(
      `/api/work-records/month/${year}/${month}`
    );
    return response.data;
  },

  // Get work record statistics
  getWorkRecordStats: async () => {
    const response = await apiClient.get("/api/work-records/stats");
    return response.data;
  },

  // Get work record statistics by month
  getWorkRecordStatsByMonth: async (year, month) => {
    const response = await apiClient.get(
      `/api/work-records/stats/${year}/${month}`
    );
    return response.data;
  },

  // Check if work record exists for a date
  hasWorkRecordForDate: async (date) => {
    const response = await apiClient.get(`/api/work-records/exists/${date}`);
    return response.data;
  },
};

export default apiClient;
