import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/users/`;

export const fetchMessages = async (userId, chatIndex) => {
  try {
    const response = await axios.fetch(`${API_URL}/${userId}/chats/${chatIndex}/messages`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export const fetchMessage = async (userId, chatIndex, messageIndex) => {
  try {
    const response = await axios.fetch(`${API_URL}/${userId}/chats/${chatIndex}/messages/${messageIndex}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export const fetchChoices = async (userId, chatIndex, messageIndex) => {
  try {
    const response = await axios.fetch(`${API_URL}/${userId}/chats/${chatIndex}/messages/${messageIndex}/choices`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export const fetchChoice = async (userId, chatIndex, messageIndex, choiceIndex) => {
  try {
    const response = await axios.fetch(`${API_URL}/${userId}/chats/${chatIndex}/messages/${messageIndex}/choices/${choiceIndex}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export const createMessage = async (payload, userId, chatIndex, userChoices) => {
  try {
    const response = await axios.post(`${API_URL}/${userId}/chats/${chatIndex}/messages`, userChoices);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data);
  }
};

export const deleteMessage = async (userId, chatIndex, messageIndex) => {
  try {
    await axios.delete(`${API_URL}/${userId}/chats/${chatIndex}/messages/${messageIndex}`);
  } catch (error) {
    throw new Error(error.response.data);
  }
};
