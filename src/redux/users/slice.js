// src/redux/users/slice.js
import { createSlice } from '@reduxjs/toolkit';
import {
  fetchUsers,
  fetchUserById,
  addUsers,
  deleteUsers,
  updateUser,
} from '../../redux/users/operations.js';

const initialState = {
  items: [],
  selectedUser: null,
  isLoading: false,
  error: '',
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  extraReducers: builder => {
    builder
      // Fetch all users
      .addCase(fetchUsers.pending, state => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch user by ID
      .addCase(fetchUserById.pending, state => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add user
      .addCase(addUsers.pending, state => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(addUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.push(action.payload);
      })
      .addCase(addUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete user
      .addCase(deleteUsers.pending, state => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(deleteUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(
          user => user._id !== action.payload._id
        );
      })
      .addCase(deleteUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update user
      .addCase(updateUser.pending, state => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedUser = action.payload;
        const index = state.items.findIndex(
          user => user._id === updatedUser._id
        );
        if (index !== -1) {
          state.items[index] = updatedUser;
        }
        if (state.selectedUser && state.selectedUser._id === updatedUser._id) {
          state.selectedUser = updatedUser;
        }
        state.error = '';
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const usersReducers = usersSlice.reducer;
