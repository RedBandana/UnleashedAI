import { takeLatest, select, call, put } from 'redux-saga/effects';
import { fetchMessageValue, fetchMessagesValue } from '../selectors/messageSelectors';
import * as messageActions from '../actions/messageActions';
import * as messageService from '../../services/messageService';

function* fetchMessagesSaga(action) {
  try {
    const { chatId, page, count } = action.payload;
    const messages = yield call(messageService.fetchMessages, chatId, page, count);
    yield put(messageActions.fetchMessagesSuccess(messages));
  } catch (error) {
    yield put(messageActions.fetchMessagesFailure(error.message));
  }
}

function* fetchMessagesPageSaga(action) {
  try {
    const { chatId, page, count } = action.payload;
    const messages = yield call(messageService.fetchMessages, chatId, page, count);
    yield put(messageActions.fetchMessagesPageSuccess(messages));
  } catch (error) {
    yield put(messageActions.fetchMessagesPageFailure(error.message));
  }
}

function* fetchMessageSaga(action) {
  try {
    const { chatId, messageId } = action.payload;
    const message = yield select(fetchMessageValue);

    if (message && message.id === messageId) {
      yield put(messageActions.fetchMessageSuccess(message));
      return;
    }

    const response = yield call(
      messageService.fetchMessage,
      chatId,
      messageId
    );
    const messageData = response.data;

    yield put(messageActions.fetchMessageSuccess(messageData));
  } catch (error) {
    yield put(messageActions.fetchMessageFailure(error.message));
  }
}

function* fetchChoicesSaga(action) {
  try {
    const { chatId, messageId } = action.payload;
    const choices = yield call(
      messageService.fetchChoices,
      chatId,
      messageId
    );
    yield put(messageActions.fetchChoicesSuccess(choices));
  } catch (error) {
    yield put(messageActions.fetchChoicesFailure(error.message));
  }
}

function* fetchChoiceSaga(action) {
  try {
    const { chatId, messageId, choiceIndex } = action.payload;

    const choice = yield call(
      messageService.fetchChoice,
      chatId,
      messageId,
      choiceIndex
    );

    const messages = yield select(fetchMessagesValue);
    const index = messages.findIndex(m => m.id === messageId);
    const updateMessage = {
      ...messages[index],
      content: choice,
      choiceIndex: choiceIndex
    };
    const newMessages = [...messages];
    newMessages[index] = updateMessage;

    const payload = { content: choice, messageId: messageId, choiceIndex: choiceIndex }

    yield put(messageActions.fetchMessagesSuccess(newMessages));
    yield put(messageActions.fetchChoiceSuccess(payload));
  } catch (error) {
    yield put(messageActions.fetchChoiceFailure(error.message));
  }
}

function* createMessageSaga(action) {
  try {
    const { chatId, message } = action.payload;
    const newMessage = yield call(
      messageService.createMessage,
      chatId,
      message
    );
    yield put(messageActions.createMessageSuccess(newMessage));
  } catch (error) {
    yield put(messageActions.createMessageFailure(error.message));
  }
}

function* deleteMessageSaga(action) {
  try {
    const { chatId, messageId } = action.payload;
    yield call(messageService.deleteMessage, chatId, messageId);

    const messages = yield select(fetchMessagesValue);
    const index = messages.findIndex(m => m.id === messageId);
    const newMessages = [...messages];
    newMessages.splice(index, 1);

    yield put(messageActions.deleteMessageSuccess(messages));
  } catch (error) {
    yield put(messageActions.deleteMessageFailure(error.message));
  }
}

function* messageSaga() {
  yield takeLatest(messageActions.fetchMessagesRequest().type, fetchMessagesSaga);
  yield takeLatest(messageActions.fetchMessagesPageRequest().type, fetchMessagesPageSaga);
  yield takeLatest(messageActions.fetchMessageRequest().type, fetchMessageSaga);
  yield takeLatest(messageActions.fetchChoicesRequest().type, fetchChoicesSaga);
  yield takeLatest(messageActions.fetchChoiceRequest().type, fetchChoiceSaga);
  yield takeLatest(messageActions.createMessageRequest().type, createMessageSaga);
  yield takeLatest(messageActions.deleteMessageRequest().type, deleteMessageSaga);
}

export default messageSaga;