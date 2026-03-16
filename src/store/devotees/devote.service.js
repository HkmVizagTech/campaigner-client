import api from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "@/utils/toast";

export const getDevoteList = createAsyncThunk(
  "devoteList",
  async (search = null, { rejectWithValue }) => {
    let url = "/devote";
    if (search) {
      url += `?search=${search}`;
    }
    try {
      const response = await api.get(url);
      return response?.data?.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error");

      return rejectWithValue(
        error.response?.data?.message || "Internal Server Error",
      );
    }
  },
);

export const addDevote = createAsyncThunk(
  "addDevote",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/devote", formData);
      return response?.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error");

      return rejectWithValue(
        error.response?.data?.message || "Internal Server Error",
      );
    }
  },
);

export const deleteDevote = createAsyncThunk(
  "deleteDevote",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/devote/${id}`);
      return response?.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error");

      return rejectWithValue(
        error.response?.data?.message || "Internal Server Error",
      );
    }
  },
);

export const updateDevotee = createAsyncThunk(
  "updateDevotee",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/devote/${id}`, {
        devoteName: formData?.name,
        phoneNumber: formData?.phoneNumber,
        shortForm: formData?.shortForm,
      });
      return response?.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error");

      return rejectWithValue(
        error.response?.data?.message || "Internal Server Error",
      );
    }
  },
);

export const getSingleDevotee = createAsyncThunk(
  "singleDevotee",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/devote/${id}`);
      return response?.data?.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error");

      return rejectWithValue(
        error.response?.data?.message || "Internal Server Error",
      );
    }
  },
);
