import { takeLatest, select, call, put } from 'redux-saga/effects';
import { fetchChatsValue } from '../selectors/chatSelectors';
import * as chatActions from '../actions/chatActions';
import * as chatService from '../../services/chatService';

function* fetchChatsSaga(action) {
  try {
    const { userId } = action.payload;
    const chats = yield call(chatService.fetchChats, userId);
    yield put(chatActions.fetchChatsSuccess(chats));
  } catch (error) {
    yield put(chatActions.fetchChatsFailure(error.message));
  }
}

function* fetchChatSaga(action) {
  try {
    const { userId, chatIndex } = action.payload;
    const chat = yield call(chatService.fetchChat, userId, chatIndex);
    yield put(chatActions.fetchChatSuccess(chat));
  } catch (error) {
    yield put(chatActions.fetchChatFailure(error.message));
  }
}

function* editChatSaga(action) {
  try {
    const { chat, userId, chatIndex } = action.payload;
    const editedChat = yield call(chatService.editChat, userId, chatIndex, chat);
    yield put(chatActions.fetchChatSuccess(editedChat));
    
    const chats = yield select(fetchChatsValue);
    const newChats = [...chats];
    const updatedChat = {
      ...newChats[chatIndex],
      title: editedChat.title
    };
    newChats[chatIndex] = updatedChat;
    yield put(chatActions.fetchChatsSuccess(newChats));

    yield put(chatActions.editChatSuccess());
  } catch (error) {
    yield put(chatActions.editChatFailure(error.message));
  }
}

function* createChatSaga(action) {
  try {
    const { userId } = action.payload;
    const newChat = yield call(chatService.createChat, userId);
    yield put(chatActions.createChatSuccess(newChat));
  } catch (error) {
    yield put(chatActions.createChatFailure(error.message));
  }
}

function* deleteChatSaga(action) {
  try {
    const { userId, chatIndex } = action.payload;
    yield call(chatService.deleteChat, userId, chatIndex);
    
    const chats = yield select(fetchChatsValue);
    const newChats = [...chats];
    newChats.splice(chatIndex, 1);
    yield put(chatActions.fetchChatsSuccess(newChats));

    yield put(chatActions.deleteChatSuccess());
  } catch (error) {
    yield put(chatActions.deleteChatFailure(error.message));
  }
}

function* clearChatsSaga(action) {
  try {
    const { userId } = action.payload;
    yield call(chatService.clearChats, userId);
    yield put(chatActions.clearChatsSuccess());
  } catch (error) {
    yield put(chatActions.clearChatsFailure(error.message));
  }
}

function* chatSaga() {
  yield takeLatest(chatActions.fetchChatsRequest().type, fetchChatsSaga);
  yield takeLatest(chatActions.fetchChatRequest().type, fetchChatSaga);
  yield takeLatest(chatActions.editChatRequest().type, editChatSaga);
  yield takeLatest(chatActions.createChatRequest().type, createChatSaga);
  yield takeLatest(chatActions.deleteChatRequest().type, deleteChatSaga);
  yield takeLatest(chatActions.clearChatsRequest().type, clearChatsSaga);
}

export default chatSaga;