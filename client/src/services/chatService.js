import axios from 'axios';
import { getHttpResponseConfig } from '../utils/functions';

const API_URL = `${process.env.REACT_APP_API_URL}/users`;

export const fetchChats = async (userId, page, count) => {
  try {
    const response = await axios.get(`${API_URL}/me/chats?page=${page}&count=${count}`, getHttpResponseConfig());
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchChat = async (userId, chatId) => {
  try {
    const response = await axios.get(`${API_URL}/me/chats/${chatId}`, getHttpResponseConfig());
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const editChat = async (userId, chatId, chat) => {
  try {
    const response = await axios.put(`${API_URL}/me/chats/${chatId}`, chat, getHttpResponseConfig());
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createChat = async (userId) => {
  try {
    const response = await axios.post(`${API_URL}/me/chats`, null, getHttpResponseConfig());
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteChat = async (userId, chatId) => {
  try {
    await axios.delete(`${API_URL}/me/chats/${chatId}`, getHttpResponseConfig());
  } catch (error) {
    throw new Error(error.message);
  }
};

export const clearChats = async (userId) => {
  try {
    await axios.delete(`${API_URL}/me/chats`, getHttpResponseConfig());
  } catch (error) {
    throw new Error(error.message);
  }
};
