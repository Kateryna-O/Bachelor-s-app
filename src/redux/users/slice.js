import { createSlice } from '@reduxjs/toolkit';
import {
  addUsers,
  deleteUsers,
  fetchUserById,
  fetchUsers,
  updateUser,
} from './operations';

const initialState = {
  items: [],
  selectedUser: null,
  isLoading: false,
  error: '',
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  extraReducer: builder => {
    builder
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
      .addCase(deleteUsers.pending, state => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(deleteUsers.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.items = state.items.filter(users => users.id !== payload.id);
      })
      .addCase(deleteUsers.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(addUsers.pending, state => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(addUsers.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.items.push(payload);
      })
      .addCase(addUsers.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      })
      .addCase(updateUser.pending, state => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedUser = action.payload;
        const index = state.items.findIndex(user => user.id === updatedUser.id);
        if (index !== -1) {
          state.items[index] = updatedUser;
        }
        if (state.selectedUser && state.selectedUser.id === updatedUser.id) {
          state.selectedUser = updatedUser;
        }
        state.isLoading = false;
        state.error = '';
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const usersReduser = usersSlice.reducer;
