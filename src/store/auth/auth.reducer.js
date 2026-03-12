import { createSlice } from "@reduxjs/toolkit";
import { adminDetails, adminLogin, resetPassword } from "./auth.service";

const initialState = {
  loginLoading: false,
  detailsLoading: false,
  details: {},
  error: null,
};

const authReducer = createSlice({
  name: "authReducer",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loginLoading = true;
      })
      .addCase(adminLogin.fulfilled, (state) => {
        state.loginLoading = false;
      })
      .addCase(adminLogin.rejected, (state, { payload }) => {
        state.loginLoading = false;
        state.error = payload;
      })
      .addCase(adminDetails.pending, (state) => {
        state.detailsLoading = true;
      })
      .addCase(adminDetails.fulfilled, (state, { payload }) => {
        state.detailsLoading = false;
        state.details = payload;
      })
      .addCase(adminDetails.rejected, (state, { payload }) => {
        state.detailsLoading = false;
        state.error = payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loginLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loginLoading = false;
      })
      .addCase(resetPassword.rejected, (state, { payload }) => {
        state.loginLoading = false;
        state.error = payload;
      }),
});

export default authReducer.reducer;
