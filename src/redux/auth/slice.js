import { createSlice } from '@reduxjs/toolkit';
import {
  login,
  logout,
  refreshUser,
  register,
  resetPwd,
  sendResetEmail,
  verify2FA,
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
    twoFactorCode: null,
    twoFactorExpires: null,
    isTwoFactorVerified: false,
    publicKey: null,
  },
  token: null,
  isLoading: false,
  isLoggedIn: false,
  isRefreshing: false,
  tempEmail: null, // ⬅️ додано для зберігання email під час 2FA
};

const handlePending = state => {
  state.isLoading = true;
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // ⬇️ додаємо екшн для тимчасового зберігання email (коли 2FA активна)
    setTempEmail(state, action) {
      state.tempEmail = action.payload;
    },
    clearTempEmail(state) {
      state.tempEmail = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(register.pending, handlePending)
      .addCase(register.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        const user = payload?.data?.user;
        if (!user) return;
        const { _id, name, email, number, photo, aboutMe, dateOfBirth } = user;

        state.user = {
          ...state.user,
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
        state.isLoggedIn = false;
      })

      .addCase(login.pending, handlePending)
      .addCase(login.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        const user = payload?.data?.user;
        if (!user) return;
        const {
          _id,
          name,
          email,
          number,
          photo,
          aboutMe,
          dateOfBirth,
          isTwoFactorVerified,
          publicKey,
        } = user;

        // Якщо 2FA активна, не видаємо токен одразу
        if (!isTwoFactorVerified) {
          state.tempEmail = email;
          state.token = null;
          state.isLoggedIn = false;
        } else {
          state.user = {
            ...state.user,
            id: _id,
            name,
            email,
            number,
            photo,
            aboutMe,
            dateOfBirth,
            isTwoFactorVerified,
            publicKey,
          };
          state.token = payload.data.accessToken;
          state.isLoggedIn = true;
          state.tempEmail = null;
        }
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
        if (!user) return;
        const { _id, name, email, number, photo, aboutMe, dateOfBirth } = user;

        state.user = {
          ...state.user,
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
      })

      // ✅ 2FA
      .addCase(verify2FA.pending, handlePending)
      .addCase(verify2FA.fulfilled, (state, { payload }) => {
        const user = payload?.user;
        if (!user) return;

        const { _id, name, email, number, photo, aboutMe, dateOfBirth } = user;

        state.user = {
          ...state.user,
          id: _id,
          name,
          email,
          number,
          photo,
          aboutMe,
          dateOfBirth,
          isTwoFactorVerified: true,
        };
        state.token = payload.accessToken;
        state.isLoggedIn = true;
        state.tempEmail = null;
        state.isLoading = false;
      })
      .addCase(verify2FA.rejected, state => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.tempEmail = null;
      });
  },
});

export const { setTempEmail, clearTempEmail } = authSlice.actions;
export const authReducer = authSlice.reducer;
