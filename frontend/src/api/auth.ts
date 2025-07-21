import axiosInstance, { endpoints } from '../utils/axios';
import { withToast } from '../utils/toastify';

// Sign In
export const signIn = async (data: { email: string; password: string }) => {
  const response = await withToast(axiosInstance.post(endpoints.auth.login, data), "Failed to Sign In")
  return response.data;
};

// Logout
export const logout = async () => {
  try {
    const response = await axiosInstance.post(endpoints.auth.logout);
    return response.data;
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

// Get Logged-in User Profile
export const getProfile = async () => {
  try {
    const response = await axiosInstance.get(endpoints.auth.me);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};
