// src/redux/users/operations.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '../../helpers/axios';

export const fetchUsers = createAsyncThunk(
  'users/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await API.get('/users');
      return response.data.data.data; // Важливо!
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchUserById = createAsyncThunk(
  'users/fetchById',
  async (userId, thunkAPI) => {
    try {
      const response = await API.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addUsers = createAsyncThunk(
  'users/addUser',
  async (users, thunkAPI) => {
    try {
      const response = await API.post('/users', users);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteUsers = createAsyncThunk(
  'users/deleteUser',
  async (id, thunkAPI) => {
    try {
      const response = await API.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, updates }, thunkAPI) => {
    try {
      const response = await API.patch(`/users/${id}`, updates);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
