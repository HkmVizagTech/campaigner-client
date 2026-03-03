import { createSlice } from "@reduxjs/toolkit";
import {
  addNewSeva,
  deleteSeva,
  getSevaList,
  getSingleSevaDetails,
  updateSeva,
} from "./seva.service";

const initialState = {
  sevaLoading: false,
  addSevaLoading: false,
  deleteLoading: false,
  getSingleSevaLoading: false,
  error: null,
  sevaList: [],
  getSingleSeva: {},
};

export const sevaReducer = createSlice({
  name: "sevaReducer",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(getSevaList.pending, (state) => {
        state.sevaLoading = true;
      })
      .addCase(getSevaList.fulfilled, (state, { payload }) => {
        state.sevaLoading = false;
        state.sevaList = payload;
      })
      .addCase(getSevaList.rejected, (state, { payload }) => {
        state.error = payload;
        state.sevaLoading = false;
      })
      .addCase(addNewSeva.pending, (state) => {
        state.addSevaLoading = true;
      })
      .addCase(addNewSeva.fulfilled, (state) => {
        state.addSevaLoading = false;
      })
      .addCase(addNewSeva.rejected, (state, { payload }) => {
        state.addSevaLoading = false;
        state.error = payload;
      })
      .addCase(deleteSeva.pending, (state) => {
        state.deleteLoading = true;
      })
      .addCase(deleteSeva.fulfilled, (state) => {
        state.deleteLoading = false;
      })
      .addCase(deleteSeva.rejected, (state, { payload }) => {
        state.deleteLoading = false;
        state.error = payload;
      })
      .addCase(updateSeva.pending, (state) => {
        state.addSevaLoading = true;
      })
      .addCase(updateSeva.fulfilled, (state) => {
        state.addSevaLoading = false;
      })
      .addCase(updateSeva.rejected, (state, { payload }) => {
        state.addSevaLoading = false;
        state.error = payload;
      })
      .addCase(getSingleSevaDetails.pending, (state) => {
        state.getSingleSevaLoading = true;
      })
      .addCase(getSingleSevaDetails.fulfilled, (state, { payload }) => {
        state.getSingleSevaLoading = false;
        state.getSingleSeva = payload;
      })
      .addCase(getSingleSevaDetails.rejected, (state, { payload }) => {
        state.getSingleSevaLoading = false;
        state.error = payload;
      }),
});

export default sevaReducer.reducer;
