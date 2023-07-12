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

const getChatById = async (userId, chatIndex) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}/chats/${chatIndex}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

const getChatMessages = async (userId, chatIndex) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}/chats/${chatIndex}/messages`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

const getMessageById = async (userId, chatIndex, messageIndex) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}/chats/${chatIndex}/messages/${messageIndex}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

const getMessageChoices = async (userId, chatIndex, messageIndex) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}/chats/${chatIndex}/messages/${messageIndex}/choices`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

const getChoiceById = async (userId, chatIndex, messageIndex, choiceId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}/chats/${chatIndex}/messages/${messageIndex}/choices/${choiceId}`);
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

const createMessage = async (userId, chatIndex, userChoices) => {
  try {
    const response = await axios.post(`${API_URL}/${userId}/chats/${chatIndex}/message`, userChoices);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

const deleteChat = async (userId, chatIndex) => {
  try {
    await axios.delete(`${API_URL}/${userId}/chats/${chatIndex}`);
  } catch (error) {
    throw new Error(error.response.data);
  }
};

const deleteMessage = async (userId, chatIndex, messageIndex) => {
  try {
    await axios.delete(`${API_URL}/${userId}/chats/${chatIndex}/message/${messageIndex}`);
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