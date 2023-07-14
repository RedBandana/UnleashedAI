import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/users/`;

export const fetchChats = async (userId) => {
  try {
    const response = await axios.fetch(`${API_URL}/${userId}/chats`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export const fetchChat = async (userId, chatIndex) => {
  try {
    const response = await axios.fetch(`${API_URL}/${userId}/chats/${chatIndex}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export const editChat = async (payload, userId, chatIndex) => {
  try {
    const response = await axios.put(`${API_URL}/${userId}/chats/${chatIndex}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export const createChat = async (payload, userId) => {
  try {
    const response = await axios.post(`${API_URL}/${userId}/chats`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export const deleteChat = async (userId, chatIndex) => {
  try {
    await axios.delete(`${API_URL}/${userId}/chats/${chatIndex}`);
  } catch (error) {
    throw new Error(error.response.data);
  }
};
