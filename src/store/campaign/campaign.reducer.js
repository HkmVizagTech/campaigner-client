import { createSlice } from "@reduxjs/toolkit";
import {
  createCampaign,
  deleteCampaign,
  getCampaignsList,
  getCurrentCampaign,
  getSingleCampaign,
  updateCampaign,
} from "./campaign.service";

const initialState = {
  campainLoading: false,
  campaginListLoading: false,
  createCampaignLoading: false,
  singleCampaignLoading: false,
  deleteCampaignLoading: false,
  singleCampaignDetails: {},
  campaginListArr: [],
  currentCampaign: {},
  total: 0,
  totalPages: 1,
  error: null,
};

const campaignReducer = createSlice({
  name: "campaignReducer",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(getCurrentCampaign.pending, (state) => {
        state.campainLoading = true;
      })
      .addCase(getCurrentCampaign.fulfilled, (state, { payload }) => {
        state.campainLoading = false;
        state.currentCampaign = payload;
      })
      .addCase(getCurrentCampaign.rejected, (state, { payload }) => {
        state.campainLoading = false;
        state.error = payload;
      })
      .addCase(getCampaignsList.pending, (state) => {
        state.campaginListLoading = true;
      })
      .addCase(getCampaignsList.fulfilled, (state, { payload }) => {
        state.campaginListLoading = false;
        state.campaginListArr = payload?.data;
        state.total = payload?.total;
        state.totalPages = payload?.totalPages;
      })
      .addCase(getCampaignsList.rejected, (state, { payload }) => {
        state.campaginListLoading = false;
        state.error = payload;
      })
      .addCase(createCampaign.pending, (state) => {
        state.createCampaignLoading = true;
      })
      .addCase(createCampaign.fulfilled, (state) => {
        state.createCampaignLoading = false;
      })
      .addCase(createCampaign.rejected, (state, { payload }) => {
        state.createCampaignLoading = false;
        state.error = payload;
      })
      .addCase(getSingleCampaign.pending, (state) => {
        state.singleCampaignLoading = true;
      })
      .addCase(getSingleCampaign.fulfilled, (state, { payload }) => {
        state.singleCampaignLoading = false;
        state.singleCampaignDetails = payload;
      })
      .addCase(getSingleCampaign.rejected, (state, { payload }) => {
        state.singleCampaignLoading = false;
        state.error = payload;
      })
      .addCase(updateCampaign.pending, (state) => {
        state.createCampaignLoading = true;
      })
      .addCase(updateCampaign.fulfilled, (state) => {
        state.createCampaignLoading = false;
      })
      .addCase(updateCampaign.rejected, (state, { payload }) => {
        state.createCampaignLoading = false;
        state.error = payload;
      })
      .addCase(deleteCampaign.pending, (state) => {
        state.deleteCampaignLoading = true;
      })
      .addCase(deleteCampaign.fulfilled, (state) => {
        state.deleteCampaignLoading = false;
      })
      .addCase(deleteCampaign.rejected, (state, { payload }) => {
        state.deleteCampaignLoading = false;
        state.error = payload;
      }),
});

export default campaignReducer.reducer;
