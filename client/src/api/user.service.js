import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/users`;

const getAllUsers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const getUserById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

const createUser = async (userData) => {
  const response = await axios.post(API_URL, userData);
  return response.data;
};

export { getAllUsers, getUserById, createUser }
