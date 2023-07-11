import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/users/`;

const getAllChats = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}/chats`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

const getChatById = async (userId, chatId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}/chats/${chatId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

const getChatMessages = async (userId, chatId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}/chats/${chatId}/messages`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

const getMessageById = async (userId, chatId, messageId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}/chats/${chatId}/messages/${messageId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

const getMessageChoices = async (userId, chatId, messageId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}/chats/${chatId}/messages/${messageId}/choices`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

const getChoiceById = async (userId, chatId, messageId, choiceId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}/chats/${chatId}/messages/${messageId}/choices/${choiceId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

const createChat = async (userId) => {
  try {
    const response = await axios.post(`${API_URL}/${userId}/chats`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

const createMessage = async (userId, chatId, userChoices) => {
  try {
    const response = await axios.post(`${API_URL}/${userId}/chats/${chatId}/message`, userChoices);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

const deleteChat = async (userId, chatId) => {
  try {
    await axios.delete(`${API_URL}/${userId}/chats/${chatId}`);
  } catch (error) {
    throw new Error(error.response.data);
  }
};

const deleteMessage = async (userId, chatId, messageId) => {
  try {
    await axios.delete(`${API_URL}/${userId}/chats/${chatId}/message/${messageId}`);
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export {
  getAllChats,
  getChatById,
  getChatMessages,
  getMessageById,
  getMessageChoices,
  getChoiceById,
  createChat,
  createMessage,
  deleteChat,
  deleteMessage,
};