import axios from 'axios';
import { getHttpResponseConfig } from '../utils/functions';

const API_URL = `${process.env.REACT_APP_API_URL}/users`;

export const fetchMessages = async (userId, chatId, page, count) => {
  try {
    const response = await axios.get(`${API_URL}/me/chats/${chatId}/messages?page=${page}&count=${count}`, getHttpResponseConfig());
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchMessage = async (userId, chatId, messageId) => {
  try {
    const response = await axios.get(`${API_URL}/me/chats/${chatId}/messages/${messageId}`, getHttpResponseConfig());
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchChoices = async (userId, chatId, messageId) => {
  try {
    const response = await axios.get(`${API_URL}/me/chats/${chatId}/messages/${messageId}/choices`, getHttpResponseConfig());
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchChoice = async (userId, chatId, messageId, choiceIndex) => {
  try {
    const response = await axios.get(`${API_URL}/me/chats/${chatId}/messages/${messageId}/choices/${choiceIndex}`, getHttpResponseConfig());
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createMessage = async (userId, chatId, message) => {
  try {
    const response = await axios.post(`${API_URL}/me/chats/${chatId}/messages`, message, getHttpResponseConfig());
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteMessage = async (userId, chatId, messageId) => {
  try {
    await axios.delete(`${API_URL}/me/chats/${chatId}/messages/${messageId}`, getHttpResponseConfig());
  } catch (error) {
    throw new Error(error.message);
  }
};
