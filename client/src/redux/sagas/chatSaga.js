import { takeLatest, select, call, put } from 'redux-saga/effects';
import * as chatActions from '../actions/chatActions';
import * as chatService from '../../services/chatService';
import * as selectors from '../selectors/chatSelectors';

function* fetchChatsSaga(action) {
  try {
    const userId = action.payload;
    const chats = yield call(chatService.fetchChats, userId);
    yield put(chatActions.fetchChatsSuccess(chats));
  } catch (error) {
    yield put(chatActions.fetchChatsFailure(error.message));
  }
}

function* fetchChatSaga(action) {
  try {
    const { userId, chatIndex } = action.payload;
    const chat = yield select(selectors.fetchChat);

    if (chat && chat.id === chatIndex) {
      yield put(chatActions.fetchChatSuccess(chat));
      return;
    }

    const response = yield call(chatService.fetchChat, userId, chatIndex);
    const chatData = response.data;

    yield put(chatActions.fetchChatSuccess(chatData));
  } catch (error) {
    yield put(chatActions.fetchChatFailure(error.message));
  }
}

function* editChatSaga(action) {
  try {
    const { chat, userId, chatIndex } = action.payload;
    const editedChat = yield call(chatService.editChat, chat, userId, chatIndex);
    yield put(chatActions.editChatSuccess(editedChat));
  } catch (error) {
    yield put(chatActions.editChatFailure(error.message));
  }
}

function* createChatSaga(action) {
  try {
    const { chat, userId } = action.payload;
    const newChat = yield call(chatService.createChat, chat, userId);
    yield put(chatActions.createChatSuccess(newChat));
  } catch (error) {
    yield put(chatActions.createChatFailure(error.message));
  }
}

function* deleteChatSaga(action) {
  try {
    const { userId, chatIndex } = action.payload;
    yield call(chatService.deleteChat, userId, chatIndex);
    yield put(chatActions.deleteChatSuccess());
  } catch (error) {
    yield put(chatActions.deleteChatFailure(error.message));
  }
}

function* chatSaga() {
  yield takeLatest(chatActions.fetchChatsRequest().type, fetchChatsSaga);
  yield takeLatest(chatActions.fetchChatRequest().type, fetchChatSaga);
  yield takeLatest(chatActions.editChatRequest().type, editChatSaga);
  yield takeLatest(chatActions.createChatRequest().type, createChatSaga);
  yield takeLatest(chatActions.deleteChatRequest().type, deleteChatSaga);
}

export default chatSaga;