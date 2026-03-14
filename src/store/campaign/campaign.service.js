import api from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "@/utils/toast";

export const getCurrentCampaign = createAsyncThunk(
  "currentCampaign",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/campaign?status=active");
      return response?.data?.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error");
      return rejectWithValue(
        error.response?.data?.message || "Internal Server error",
      );
    }
  },
);

export const getCampaignsList = createAsyncThunk(
  "campaginList",
  async (obj, { rejectWithValue }) => {
    const { page, pageSize, status, sort, search } = obj;
    let url = `/campaign/all-campagins?page=${page}`;

    if (pageSize) {
      url += `&pageSize=${pageSize}`;
    }

    if (status) {
      url += `&status=${status}`;
    }

    if (sort) {
      url += `&sort=${sort}`;
    }

    if (search?.trim()) {
      url += `&search=${search}`;
    }

    try {
      const response = await api.get(url);
      return response?.data?.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error");
      return rejectWithValue(
        error.response?.data?.message || "Internal Server error",
      );
    }
  },
);

export const createCampaign = createAsyncThunk(
  "createCampaign",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/campaign`, formData);
      return response?.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error");
      return rejectWithValue(
        error.response?.data?.message || "Internal Server error",
      );
    }
  },
);

export const updateCampaign = createAsyncThunk(
  "updateCampaign",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/campaign/${id}`, formData);
      return response?.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error");
      return rejectWithValue(
        error.response?.data?.message || "Internal Server error",
      );
    }
  },
);

export const getSingleCampaign = createAsyncThunk(
  "singleCampaign",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/campaign/${id}`);
      return response?.data?.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error");
      return rejectWithValue(
        error.response?.data?.message || "Internal Server error",
      );
    }
  },
);

export const deleteCampaign = createAsyncThunk(
  "deleteCampaign",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/campaign/${id}`);
      return response?.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error");
      return rejectWithValue(
        error.response?.data?.message || "Internal Server error",
      );
    }
  },
);
