import { createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '../../helpers/axios.js';

// import { persistor } from '../../redux/store.js';

const setAuthHeader = token => {
  API.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const clearAuthHeader = () => {
  API.defaults.headers.common.Authorization = '';
};

export const register = createAsyncThunk(
  'auth/register',
  async (registerData, thunkAPI) => {
    try {
      await API.post('/auth/register', registerData);
      const loginData = {
        email: registerData.email,
        password: registerData.password,
      };
      const { data } = await API.post('/auth/login', loginData);
      setAuthHeader(data.data.accessToken);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (loginData, thunkAPI) => {
    try {
      const { data } = await API.post('/auth/login', loginData);
      setAuthHeader(data.data.accessToken);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    const { data } = await API.post('/auth/logout');
    // await persistor.purge();
    clearAuthHeader();

    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const refreshUser = createAsyncThunk(
  'auth/refresh',
  async (_, thunkAPI) => {
    try {
      const { data } = await API.post('/auth/refresh');
      setAuthHeader(data.data.accessToken);
      return data;
    } catch (error) {
      clearAuthHeader();
      return thunkAPI.rejectWithValue(error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { auth } = getState();
      if (!auth.token) {
        return false;
      }
    },
  }
);

export const sendResetEmail = createAsyncThunk(
  'auth/sendResetEmail',
  async (email, thunkAPI) => {
    try {
      const { data } = await API.post('/auth/request-reset-email', email);
      return data;
    } catch (error) {
      thunkAPI.rejectWithValue(error);
    }
  }
);

export const resetPwd = createAsyncThunk(
  'auth/resetPwd',
  async (token, thunkAPI) => {
    try {
      const response = await API.post('/auth/reset-password', token);
      return response;
    } catch (error) {
      thunkAPI.rejectWithValue(error);
    }
  }
);
