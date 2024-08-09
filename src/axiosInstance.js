// src/axiosInstance.js

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
    const currentTime = Date.now() / 1000;
    console.log('Token expiration:', decodedToken.exp);
    console.log('Current time:', currentTime);
    return decodedToken.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      if (isTokenExpired(token)) {
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
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
    if (error.response && error.response.status === 401 && error.config.url !== '/api/login') {
      store.dispatch(logout());
      window.dispatchEvent(new CustomEvent('sessionExpired'));
      window.location.href = '/login?session_expired=true';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;