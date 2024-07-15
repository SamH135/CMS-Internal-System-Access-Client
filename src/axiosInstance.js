// axiosInstance.js

import axios from 'axios';
import store from './redux/store';
import { logout } from './redux/actions/authActions';
import { jwtDecode } from 'jwt-decode';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.exp < Date.now() / 1000;
  } catch (error) {
    return true;
  }
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      if (isTokenExpired(token)) {
        store.dispatch(logout());
        window.dispatchEvent(new CustomEvent('sessionExpired'));
      } else {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      store.dispatch(logout());
      window.dispatchEvent(new CustomEvent('sessionExpired'));
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;