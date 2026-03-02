import api from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const getCurrentCampaign = createAsyncThunk(
  "currentCampaign",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/campaign?status=active");
      return response?.data?.data;
    } catch (error) {
      toast.error(error?.message || "Internal Server Error");
      return rejectWithValue(error?.message || "Internal Server error");
    }
  },
);
