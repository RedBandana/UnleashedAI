import axios from 'axios';
import { getHttpResponseConfig } from '../utils/functions';

const API_URL = `http://127.0.0.1:3000/api/users`;

export const createUser = async (userData) => {
  try {
    const response = await axios.post(API_URL, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export const createGuest = async () => {
  try {
    const response = await axios.post(`${API_URL}/guests`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/me`, getHttpResponseConfig());
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};