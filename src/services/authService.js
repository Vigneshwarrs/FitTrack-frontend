import api from "../utils/api";

export const login = (username, password) => {
  return api.post(`/auth/login`, { email: username, password });
};

export const register = (data) => {
  return api.post(`/auth/register`, data);
};

export const forgotPassword = (username) => {
  return api.post(`/auth/forgot-password`, { username });
};

export const resetPassword = (token, password) => {
  return api.post(`/auth/reset-password/${token}`, { password });
};

export const activateUser = (token) => {
  return api.get(`/auth/activate/${token}`);
}