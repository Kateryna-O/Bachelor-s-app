// import axios from 'axios';
// import { refreshUser } from '../redux/auth/operations';
// import { store } from '../redux/store.js';

// export const API = axios.create({
//   baseURL: 'http://localhost:3000',
//   withCredentials: true,
// });

// API.interceptors.request.use(
//   config => {
//     const state = store.getState();
//     const token = state.auth.token;

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   error => Promise.reject(error)
// );

// API.interceptors.response.use(
//   response => response,
//   async error => {
//     const originalRequest = error.config; // can use directly error.config._retry
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         await store.dispatch(refreshUser());
//       } catch (refreshError) {
//         API.defaults.headers.common.Authorization = '';
//         window.location.href = '/login';
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );
import axios from 'axios';
import { refreshUser } from '../redux/auth/operations';

let reduxStore; // сюди збережемо store

// функція, яка дозволить передати store після його створення
export const setStore = storeInstance => {
  reduxStore = storeInstance;
};

export const API = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

API.interceptors.request.use(
  config => {
    if (!reduxStore) return config;

    const state = reduxStore.getState();
    const token = state.auth.token;

    // Публічні маршрути, які не потребують токена
    const publicRoutes = ['/register', '/signup', '/login'];
    const isPublic = publicRoutes.some(route => config.url.includes(route));

    // Додати токен, тільки якщо це не публічний маршрут
    if (token && !isPublic) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error)
);

API.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        await reduxStore.dispatch(refreshUser());
        return API(originalRequest); // повторити запит
      } catch (refreshError) {
        API.defaults.headers.common.Authorization = '';
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
