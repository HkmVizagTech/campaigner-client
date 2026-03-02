import api from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const getSevaList = createAsyncThunk(
  "sevaList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/seva");

      return response?.data?.data;
    } catch (error) {
      toast.error(error?.message || "Internal Server Error");
      return rejectWithValue(error?.message || "Internal Server error");
    }
  },
);

export const addNewSeva = createAsyncThunk(
  "newSeva",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/seva/add", formData);

      return response?.data;
    } catch (error) {
      toast.error(error?.message || "Internal Server Error");
      return rejectWithValue(error?.message || "Internal Server error");
    }
  },
);

export const deleteSeva = createAsyncThunk(
  "deleteSeva",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/seva/${id}`);
      return response?.data;
    } catch (error) {
      toast.error(error?.message || "Internal Server Error");
      return rejectWithValue(error?.message || "Internal Server Error");
    }
  },
);

export const updateSeva = createAsyncThunk(
  "updateSeva",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/seva/${id}`, formData);
      return response?.data;
    } catch (error) {
      toast.error(error?.message || "Internal Server Error");
      return rejectWithValue(error?.message || "Internal Server Error");
    }
  },
);
