import api from "@/api/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getDonations = createAsyncThunk(
  "donations/getDonations",
  async (obj, { rejectWithValue }) => {
    const { page, pageSize, id, campId, search, sevaId, isPrasadam } = obj;

    let url = `/donations?page=${page}&pageSize=${pageSize}`;

    if (id) {
      url += `&id=${id}`;
    }

    if (campId && campId !== "all") {
      url += `&campId=${campId}`;
    }

    if (sevaId && sevaId !== "all") {
      url += `&sevaId=${sevaId}`;
    }

    if (search?.trim()) {
      url += `&search=${search}`;
    }

    if (isPrasadam) {
      url += `&isPrasadam=${isPrasadam}`;
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

export const getDonorDetailsObj = createAsyncThunk(
  "donorDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/donations/${id}`);
      return response?.data?.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal Server Error");
      return rejectWithValue(
        error.response?.data?.message || "Internal Server Error",
      );
    }
  },
);
