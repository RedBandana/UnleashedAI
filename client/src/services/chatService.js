import axios from 'axios';

const API_URL = `http://127.0.0.1:3000/api/users`;

export const fetchChats = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}/chats`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export const fetchChat = async (userId, chatIndex) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}/chats/${chatIndex}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export const editChat = async (userId, chatIndex, chat) => {
  try {
    const response = await axios.put(`${API_URL}/${userId}/chats/${chatIndex}`, chat);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export const createChat = async (userId) => {
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

export const clearChats = async (userId) => {
  try {
    await axios.delete(`${API_URL}/${userId}/chats`);
  } catch (error) {
    throw new Error(error.response.data);
  }
};
