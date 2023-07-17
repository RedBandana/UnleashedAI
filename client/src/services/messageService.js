import axios from 'axios';

const API_URL = `http://127.0.0.1:3000/api/users`;

export const fetchMessages = async (userId, chatId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}/chats/${chatId}/messages`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export const fetchMessage = async (userId, chatId, messageId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}/chats/${chatId}/messages/${messageId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export const fetchChoices = async (userId, chatId, messageId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}/chats/${chatId}/messages/${messageId}/choices`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export const fetchChoice = async (userId, chatId, messageId, choiceIndex) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}/chats/${chatId}/messages/${messageId}/choices/${choiceIndex}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export const createMessage = async (userId, chatId, message) => {
  try {
    const response = await axios.post(`${API_URL}/${userId}/chats/${chatId}/messages`, message);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export const deleteMessage = async (userId, chatId, messageId) => {
  try {
    await axios.delete(`${API_URL}/${userId}/chats/${chatId}/messages/${messageId}`);
  } catch (error) {
    throw new Error(error.response.data);
  }
};
