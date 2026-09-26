import api from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "@/utils/toast";

export const adminLogin = createAsyncThunk(
  "adminlogin",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/login`, formData);
      if (response?.data?.data?.token) {
        sessionStorage.setItem("token", response?.data?.data?.token);
      }
      return response?.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error");
      return rejectWithValue(
        error.response?.data?.message || "Internal Server error",
      );
    }
  },
);

export const adminDetails = createAsyncThunk(
  "details",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/");
      return response?.data?.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error");
      return rejectWithValue(
        error.response?.data?.message || "Internal Server error",
      );
    }
  },
);

export const resetPassword = createAsyncThunk(
  "reset-password",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/reset-password", formData);
      return response?.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error");
      return rejectWithValue(
        error.response?.data?.message || "Internal Server error",
      );
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "forgot-password",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/forgot-password", formData);
      toast.success(response?.data?.message || "OTP sent");
      return response?.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error");
      return rejectWithValue(
        error.response?.data?.message || "Internal Server error",
      );
    }
  },
);

export const resetPasswordWithOtp = createAsyncThunk(
  "reset-password-otp",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/reset-password-otp", formData);
      return response?.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error");
      return rejectWithValue(
        error.response?.data?.message || "Internal Server error",
      );
    }
  },
);
