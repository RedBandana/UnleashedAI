import { handleActions } from 'redux-actions';
import * as action from '../actions/messageActions';

const initialState = {
  messages: [],
  message: null,
  choices: [],
  choice: null,
  loading: false,
  error: null,
  messageLoading: null,
  messageError: null,
  choicesLoading: false,
  choicesError: null,
  choiceLoading: false,
  choiceError: null,
  createMessageLoading: false,
  createMessageError: null,
  deleteMessageLoading: false,
  deleteMessageError: null,
};

const messageReducer = handleActions(
  {
    [action.fetchMessagesRequest]: (state) => ({
      ...state,
      loading: true,
      error: null,
    }),
    [action.fetchMessagesSuccess]: (state, { payload }) => ({
      ...state,
      messages: payload,
      loading: false,
      error: null,
    }),
    [action.fetchMessagesFailure]: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload,
    }),
    [action.fetchMessageRequest]: (state) => ({
      ...state,
      messageLoading: true,
      messageError: null,
    }),
    [action.fetchMessageSuccess]: (state, { payload }) => ({
      ...state,
      message: payload,
      messageLoading: false,
      messageError: null,
    }),
    [action.fetchMessageFailure]: (state, { payload }) => ({
      ...state,
      messageLoading: false,
      messageError: payload,
    }),
    [action.fetchChoicesRequest]: (state) => ({
      ...state,
      choicesLoading: true,
      choicesError: null,
    }),
    [action.fetchChoicesSuccess]: (state, { payload }) => ({
      ...state,
      choices: payload,
      choicesLoading: false,
      choicesError: null,
    }),
    [action.fetchChoicesFailure]: (state, { payload }) => ({
      ...state,
      choicesLoading: false,
      choicesError: payload,
    }),
    [action.fetchChoiceRequest]: (state) => ({
      ...state,
      choiceLoading: true,
      choiceError: null,
    }),
    [action.fetchChoiceSuccess]: (state, { payload }) => ({
      ...state,
      choice: payload,
      choiceLoading: false,
      choiceError: null,
    }),
    [action.fetchChoiceFailure]: (state, { payload }) => ({
      ...state,
      choiceLoading: false,
      choiceError: payload,
    }),
    [action.createMessageRequest]: (state) => ({
      ...state,
      createMessageLoading: true,
      createMessageError: null,
    }),
    [action.createMessageSuccess]: (state, { payload }) => ({
      ...state,
      messages: [...state.messages, payload],
      createMessageLoading: false,
      createMessageError: null,
    }),
    [action.createMessageFailure]: (state, { payload }) => ({
      ...state,
      createMessageLoading: false,
      createMessageError: payload,
    }),
    [action.deleteMessageRequest]: (state) => ({
      ...state,
      deleteMessageLoading: true,
      deleteMessageError: null,
    }),
    [action.deleteMessageSuccess]: (state, {payload}) => ({
      ...state,
      messages: payload,
      deleteMessageLoading: false,
      deleteMessageError: null,
    }),
    [action.deleteMessageFailure]: (state, { payload }) => ({
      ...state,
      deleteMessageLoading: false,
      deleteMessageError: payload,
    }),
  },
  initialState
);

export default messageReducer;