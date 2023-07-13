import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/login`;

const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};
