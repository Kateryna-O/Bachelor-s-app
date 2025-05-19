import { createSlice } from '@reduxjs/toolkit';
import {
  login,
  logout,
  refreshUser,
  register,
  resetPwd,
  sendResetEmail,
} from './operations.js';

const initialState = {
  user: {
    id: null,
    name: null,
    email: null,
    number: null,
    photo: null,
    aboutMe: null,
    dateOfBirth: null,
  },
  token: null,
  isLoading: false,
  isLoggedIn: false,
  isRefreshing: false,
};

const handlePending = state => {
  state.isLoading = true;
};

const authSlice = createSlice({
  name: 'auth',
  initialState,

  extraReducers: builder => {
    builder
      .addCase(register.pending, handlePending)
      .addCase(register.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        const user = payload?.data?.user;
        if (!user) {
          console.error('Login fulfilled but user data is missing:', payload);
          return;
        }
        const { _id, name, email, number, photo, aboutMe, dateOfBirth } =
          payload.data.user;

        state.user = {
          id: _id,
          name,
          email,
          number,
          photo,
          aboutMe,
          dateOfBirth,
        };
        state.token = payload.data.accessToken;
        state.isLoggedIn = true;
      })
      .addCase(register.rejected, state => {
        state.isLoading = false;
        state.isLoggedIn = false;
      })
      .addCase(login.pending, handlePending)
      .addCase(login.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        const user = payload?.data?.user;
        if (!user) {
          console.error('Login fulfilled but user data is missing:', payload);
          return;
        }
        const { _id, name, email, number, photo, aboutMe, dateOfBirth } =
          payload.data.user;

        state.user = {
          id: _id,
          name,
          email,
          number,
          photo,
          aboutMe,
          dateOfBirth,
        };
        state.token = payload.data.accessToken;
        state.isLoggedIn = true;
      })
      .addCase(login.rejected, state => {
        state.isLoading = false;
        state.isLoggedIn = false;
      })
      .addCase(logout.pending, handlePending)
      .addCase(logout.fulfilled, state => {
        state.isLoading = false;
        state.user = initialState.user;
        state.token = null;
        state.isLoggedIn = false;
      })
      .addCase(logout.rejected, state => {
        state.isLoggedIn = false;
      })
      .addCase(refreshUser.pending, state => {
        state.isRefreshing = true;
      })
      .addCase(refreshUser.fulfilled, (state, { payload }) => {
        const user = payload?.data?.user;
        if (!user) {
          console.error('Login fulfilled but user data is missing:', payload);
          return;
        }
        const { _id, name, email, number, photo, aboutMe, dateOfBirth } =
          payload.data.user;

        state.user = {
          id: _id,
          name,
          email,
          number,
          photo,
          aboutMe,
          dateOfBirth,
        };
        state.token = payload.data.accessToken;
        state.isLoggedIn = true;
        state.isRefreshing = false;
      })
      .addCase(refreshUser.rejected, state => {
        state.isLoggedIn = false;
        state.isLoading = false;
        state.isRefreshing = false;
        state.token = null;
      })
      .addCase(sendResetEmail.pending, handlePending)
      .addCase(sendResetEmail.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(sendResetEmail.rejected, state => {
        state.isLoading = false;
      })
      .addCase(resetPwd.pending, handlePending)
      .addCase(resetPwd.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(resetPwd.rejected, state => {
        state.isLoading = false;
      });
  },
});

export const authReducer = authSlice.reducer;
