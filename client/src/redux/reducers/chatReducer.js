import { handleActions } from 'redux-actions';
import * as action from '../actions/chatActions';

const initialState = {
  chats: [],
  chat: null,
  loading: false,
  error: null,
  chatLoading: null,
  chatError: null,
  editChatLoading: false,
  editChatError: null,
  createChat: false,
  createChatLoading: false,
  createChatError: null,
  deleteChat: false,
  deleteChatLoading: false,
  deleteChatError: null,
  clearChatsLoading: false,
  clearChatsError: null,
};

const chatReducer = handleActions(
  {
    [action.fetchChatsRequest]: (state) => ({
      ...state,
      loading: true,
      error: null,
    }),
    [action.fetchChatsSuccess]: (state, { payload }) => ({
      ...state,
      chats: payload,
      loading: false,
      error: null,
    }),
    [action.fetchChatsFailure]: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload,
    }),
    [action.fetchChatRequest]: (state) => ({
      ...state,
      chatLoading: true,
      chatError: null,
    }),
    [action.fetchChatSuccess]: (state, { payload }) => ({
      ...state,
      chat: payload,
      chatLoading: false,
      chatError: null,
    }),
    [action.fetchChatFailure]: (state, { payload }) => ({
      ...state,
      chatLoading: false,
      chatError: payload,
    }),
    [action.editChatRequest]: (state) => ({
      ...state,
      editChatLoading: true,
      editChatError: null,
    }),
    [action.editChatSuccess]: (state) => ({
      ...state,
      editChatLoading: false,
      editChatError: null,
    }),
    [action.editChatFailure]: (state, { payload }) => ({
      ...state,
      editChatLoading: false,
      editChatError: payload,
    }),
    [action.createChatRequest]: (state) => ({
      ...state,
      createChat: false,
      createChatLoading: true,
      createChatError: null,
    }),
    [action.createChatSuccess]: (state, { payload }) => ({
      ...state,
      chats: [...state.chats, payload],
      createChat: true,
      createChatLoading: false,
      createChatError: null,
    }),
    [action.createChatFailure]: (state, { payload }) => ({
      ...state,
      createChat: false,
      createChatLoading: false,
      createChatError: payload,
    }),
    [action.deleteChatRequest]: (state) => ({
      ...state,
      deleteChat: false,
      deleteChatLoading: true,
      deleteChatError: null,
    }),
    [action.deleteChatSuccess]: (state) => ({
      ...state,
      chat: null,
      deleteChat: true,
      deleteChatLoading: false,
      deleteChatError: null,
    }),
    [action.deleteChatFailure]: (state, { payload }) => ({
      ...state,
      deleteChat: false,
      deleteChatLoading: false,
      deleteChatError: payload,
    }),
    [action.clearChatsRequest]: (state) => ({
      ...state,
      clearChatsLoading: true,
      clearChatsError: null,
    }),
    [action.clearChatsSuccess]: (state) => ({
      ...state,
      chats: [],
      chat: null,
      clearChatsLoading: false,
      clearChatsError: null,
    }),
    [action.clearChatsFailure]: (state, { payload }) => ({
      ...state,
      clearChatsLoading: false,
      clearChatsError: payload,
    }),
  },
  initialState
);

export default chatReducer;