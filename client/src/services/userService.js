import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/users`;

const fetchUsers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

const fetchUser = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

const createUser = async (userData) => {
  try {
    const response = await axios.post(API_URL, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export { fetchUsers, fetchUser, createUser }
