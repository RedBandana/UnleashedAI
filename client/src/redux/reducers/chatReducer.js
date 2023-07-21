import { handleActions } from 'redux-actions';
import * as action from '../actions/chatActions';

const initialState = {
  chats: [],
  chat: null,
  loading: false,
  error: null,
  chatLoading: null,
  chatError: null,
  chatsPageReceived: false,
  editChatReceived: false,
  editChatLoading: false,
  editChatError: null,
  createChatReceived: false,
  createChatLoading: false,
  createChatError: null,
  deleteChatReceived: false,
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
    [action.fetchChatsPageRequest]: (state) => ({
      ...state,
      chatsPageReceived: false,
      loading: true,
      error: null,
    }),
    [action.fetchChatsPageSuccess]: (state, { payload }) => ({
      ...state,
      chats: [...state.chats, ...payload],
      chatsPageReceived: true,
      loading: false,
      error: null,
    }),
    [action.fetchChatsPageFailure]: (state, { payload }) => ({
      ...state,
      chatsPageReceived: false,
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
      createChatReceived: false,
      createChatLoading: true,
      createChatError: null,
    }),
    [action.createChatSuccess]: (state, { payload }) => ({
      ...state,
      chats: [payload, ...state.chats],
      chat: payload,
      createChatReceived: true,
      createChatLoading: false,
      createChatError: null,
    }),
    [action.createChatFailure]: (state, { payload }) => ({
      ...state,
      createChatReceived: false,
      createChatLoading: false,
      createChatError: payload,
    }),
    [action.deleteChatRequest]: (state) => ({
      ...state,
      deleteChatReceived: false,
      deleteChatLoading: true,
      deleteChatError: null,
    }),
    [action.deleteChatSuccess]: (state) => ({
      ...state,
      chat: null,
      deleteChatReceived: true,
      deleteChatLoading: false,
      deleteChatError: null,
    }),
    [action.deleteChatFailure]: (state, { payload }) => ({
      ...state,
      deleteChatReceived: false,
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
      deleteChatReceived: true,
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