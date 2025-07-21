import axios from 'axios';
import type { AxiosResponse } from 'axios';

// Create the instance
const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  withCredentials: true,
});

// 👉 Set token from localStorage (if exists and valid)
const token = localStorage.getItem('token');
if (token) {
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// ✅ Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: any) =>
    Promise.reject(
      (error.response && error.response.data) || 'Something went wrong!'
    )
);

export default axiosInstance;

export const endpoints = {
  auth: {
    me: "/auth/me",
    login: '/auth/login',
    logout: '/auth/logout',
  },
  team: {
    status: "/team/status",
    userTeam: "/team"
  },
  transfer: {
    players: '/transfer/sell',
    sell: '/transfer/sell',
    buy: '/transfer/buy',
    market: '/transfer/market'
  }
};
