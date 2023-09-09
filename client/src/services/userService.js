import axios from 'axios';
import { getHttpResponseConfig } from '../utils/functions';

const API_URL = `${process.env.REACT_APP_API_URL}/users`;

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    const message = error.response.data.message ?? error.message;
    throw new Error(message);
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
  } catch (error) {
    const message = error.response.data.message ?? error.message;
    throw new Error(message);
  }
};

export const updateUser = async (userData) => {
  try {
    const response = await axios.put(`${API_URL}/me`, userData, getHttpResponseConfig());
    return response.data;
  } catch (error) {
    const message = error.response.data.message ?? error.message;
    throw new Error(message);
  }
};

export const createGuest = async () => {
  try {
    const response = await axios.post(`${API_URL}/guests`);
    return response.data;
  } catch (error) {
    const message = error.response.data.message ?? error.message;
    throw new Error(message);
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/me`, getHttpResponseConfig());
    return response.data;
  } catch (error) {
    const message = error.response.data.message ?? error.message;
    throw new Error(message);
  }
};

export const forgetPassword = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password`, userData, getHttpResponseConfig());
    return response.data;
  } catch (error) {
    const message = error.response.data.message ?? error.message;
    throw new Error(message);
  }
};
