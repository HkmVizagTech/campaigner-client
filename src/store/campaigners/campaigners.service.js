import api from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "@/utils/toast";

export const getCampainer = createAsyncThunk(
  "getCampaigner",
  async (
    {
      id,
      page,
      pageSize,
      search,
      sort,
      status,
      campStatus,
      isDevotee = false,
      infiniteScroll = false,
    },
    { rejectWithValue, signal },
  ) => {
    let url;
    if (isDevotee) {
      url = `/campaigner/admin/${id}?status=${status}&page=${page}&pageSize=${pageSize}`;
    } else {
      url = `/campaigner/${id}?status=${status}&page=${page}&pageSize=${pageSize}`;
    }

    if (search) url += `&search=${search}`;
    if (sort) url += `&sort=${sort}`;
    if (campStatus) url += `&campStatus=${campStatus}`;

    try {
      const response = await api.get(url, { signal });

      return {
        ...response?.data?.data,
        infiniteScroll,
        page,
      };
    } catch (error) {
      if (signal.aborted || error?.name === "CanceledError") {
        throw error;
      }

      toast.error(error.response?.data?.message || "Internal Server Error");
      return rejectWithValue(
        error.response?.data?.message || "Internal Server error",
      );
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
      return rejectWithValue(
        error.response?.data?.message || "Internal Server error",
      );
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
      return rejectWithValue(
        error.response?.data?.message || "Internal Server error",
      );
    }
  },
);

export const getLastestDonors = createAsyncThunk(
  "lastestDonors",
  async ({ campId, slug }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/campaigner/latestDonors/${campId}/${slug}`,
      );
      return response?.data?.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error");
      return rejectWithValue(
        error.response?.data?.message || "Internal Server error",
      );
    }
  },
);

export const createCampaigner = createAsyncThunk(
  "createCampaigner",
  async ({ formData, skipAuth = false }, { rejectWithValue }) => {
    try {
      const response = await api.post("/campaigner", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        skipAuth,
      });

      return response?.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error");
      return rejectWithValue(
        error.response?.data?.message || "Internal Server error",
      );
    }
  },
);

export const updateCampaigner = createAsyncThunk(
  "updateCampaigner",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/campaigner/${id}`, formData);
      return response?.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error");
      return rejectWithValue(
        error.response?.data?.message || "Internal Server error",
      );
    }
  },
);

export const deleteCampaigner = createAsyncThunk(
  "deleteCampaigner",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/campaigner/${id}`);
      return response?.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error");
      return rejectWithValue(
        error.response?.data?.message || "Internal Server error",
      );
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
      return rejectWithValue(
        error.response?.data?.message || "Internal Server error",
      );
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
      return rejectWithValue(
        error.response?.data?.message || "Internal Server error",
      );
    }
  },
);
