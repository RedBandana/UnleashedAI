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
  createChatLoading: false,
  createChatError: null,
  deleteChatLoading: false,
  deleteChatError: null,
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
    [action.editChatSuccess]: (state, { payload }) => ({
      ...state,
      chat: payload,
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
      createChatLoading: true,
      createChatError: null,
    }),
    [action.createChatSuccess]: (state, { payload }) => ({
      ...state,
      chats: [...state.chats, payload],
      createChatLoading: false,
      createChatError: null,
    }),
    [action.createChatFailure]: (state, { payload }) => ({
      ...state,
      createChatLoading: false,
      createChatError: payload,
    }),
    [action.deleteChatRequest]: (state) => ({
      ...state,
      deleteChatLoading: true,
      deleteChatError: null,
    }),
    [action.deleteChatSuccess]: (state) => ({
      ...state,
      deleteChatLoading: false,
      deleteChatError: null,
    }),
    [action.deleteChatFailure]: (state, { payload }) => ({
      ...state,
      deleteChatLoading: false,
      deleteChatError: payload,
    }),
  },
  initialState
);

export default chatReducer;