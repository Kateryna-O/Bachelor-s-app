import { createAsyncThunk } from '@reduxjs/toolkit';
import { API } from '../../helpers/axios.js';
import { setTempEmail } from './slice.js';

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

// export const login = createAsyncThunk(
//   'auth/login',
//   async (loginData, thunkAPI) => {
//     try {
//       const { data } = await API.post('/auth/login', loginData);
//       setAuthHeader(data.data.accessToken);
//       return data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );
export const login = createAsyncThunk(
  'auth/login',
  async (loginData, thunkAPI) => {
    try {
      const { data } = await API.post('/auth/login', loginData);
      const accessToken = data?.data?.accessToken;
      const requires2FA = data?.data?.requires2FA;
      const email = data?.data?.email;

      // Якщо токен є — все нормально, користувач залогінився
      if (accessToken) {
        setAuthHeader(accessToken);
        return data.data;
      }

      // Якщо токена нема, але user повернутий — значить треба 2FA
      if (requires2FA && email) {
        thunkAPI.dispatch(setTempEmail(email));
        return data.data; // Повертаємо user без токена
      }

      // fallback
      return thunkAPI.rejectWithValue('Невідомий формат відповіді сервера');
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
export const verify2FA = createAsyncThunk(
  'auth/verify2FA',
  async ({ email, code }, thunkAPI) => {
    console.log('🧪 sending verify2FA request:', { email, code });
    try {
      const { data } = await API.post('/auth/verify-2fa', { email, code });
      setAuthHeader(data.data.accessToken);
      return data.data;
    } catch (err) {
      console.error('❌ verify2FA error:', err.response?.data || err.message);
      return thunkAPI.rejectWithValue(err.message || '2FA failed');
    }
  }
);
