import api from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const getCampainer = createAsyncThunk(
  "getCampaigner",
  async ({ id, page, pageSize, search, sort, status }, { rejectWithValue }) => {
    let url = `/campaigner/${id}?status=${status}&page=${page}&pageSize=${pageSize}`;

    if (search) {
      url += `&search=${search}`;
    }

    if (sort) {
      url += `&sort=${sort}`;
    }

    try {
      const response = await api.get(url);
      return response?.data?.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error");
      return rejectWithValue(error.response?.data?.message || "Internal Server error");
    }
  },
);

export const getSingleCampaignerDetails = createAsyncThunk(
  "singleDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/campaigner/details/${id}`);
      return response?.data?.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error");
      return rejectWithValue(error.response?.data?.message || "Internal Server error");
    }
  },
);

export const getTopDonors = createAsyncThunk(
  "topdonors",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/campaigner/topdonors/${id}`);
      return response?.data?.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error");
      return rejectWithValue(error.response?.data?.message || "Internal Server error");
    }
  },
);

export const getLastestDonors = createAsyncThunk(
  "lastestDonors",
  async ({ campId, campaignerId }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/campaigner/latestDonors/${campId}/${campaignerId}`,
      );
      return response?.data?.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error");
      return rejectWithValue(error.response?.data?.message || "Internal Server error");
    }
  },
);

export const createCampaigner = createAsyncThunk(
  "createCampaigner",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/campaigner", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response?.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error");
      return rejectWithValue(error.response?.data?.message || "Internal Server error");
    }
  },
);

// Temple Devotes
export const getTempleDevotesList = createAsyncThunk(
  "devotesList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/devote");
      return response?.data?.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error");
      return rejectWithValue(error.response?.data?.message || "Internal Server error");
    }
  },
);

// Media
export const getMediaList = createAsyncThunk(
  "mediaList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/media");
      return response?.data?.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error");
      return rejectWithValue(error.response?.data?.message || "Internal Server error");
    }
  },
);
