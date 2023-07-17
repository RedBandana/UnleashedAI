import { takeLatest, select, call, put } from 'redux-saga/effects';
import { fetchChoiceValue, fetchMessageValue, fetchMessagesValue } from '../selectors/messageSelectors';
import * as messageActions from '../actions/messageActions';
import * as messageService from '../../services/messageService';

function* fetchMessagesSaga(action) {
  try {
    const { userId, chatId } = action.payload;
    const messages = yield call(messageService.fetchMessages, userId, chatId);
    yield put(messageActions.fetchMessagesSuccess(messages));
  } catch (error) {
    yield put(messageActions.fetchMessagesFailure(error.message));
  }
}

function* fetchMessageSaga(action) {
  try {
    const { userId, chatId, messageId } = action.payload;
    const message = yield select(fetchMessageValue);

    if (message && message.id === messageId) {
      yield put(messageActions.fetchMessageSuccess(message));
      return;
    }

    const response = yield call(
      messageService.fetchMessage,
      userId,
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
    const { userId, chatId, messageId } = action.payload;
    const choices = yield call(
      messageService.fetchChoices,
      userId,
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
    const { userId, chatId, messageId, choiceIndex } = action.payload;
    const choice = yield select(fetchChoiceValue);

    if (choice && choice.id === choiceIndex) {
      yield put(messageActions.fetchChoiceSuccess(choice));
      return;
    }

    const response = yield call(
      messageService.fetchChoice,
      userId,
      chatId,
      messageId,
      choiceIndex
    );
    const choiceData = response.data;

    yield put(messageActions.fetchChoiceSuccess(choiceData));
  } catch (error) {
    yield put(messageActions.fetchChoiceFailure(error.message));
  }
}

function* createMessageSaga(action) {
  try {
    const { userId, chatId, message } = action.payload;
    const newMessage = yield call(
      messageService.createMessage,
      userId,
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
    const { userId, chatId, messageId } = action.payload;
    yield call(messageService.deleteMessage, userId, chatId, messageId);

    const messages = yield select(fetchMessagesValue);
    const newMessages = [...messages];
    newMessages.splice(chatId, 1);

    yield put(messageActions.deleteMessageSuccess(messages));
  } catch (error) {
    yield put(messageActions.deleteMessageFailure(error.message));
  }
}

function* messageSaga() {
  yield takeLatest(messageActions.fetchMessagesRequest().type, fetchMessagesSaga);
  yield takeLatest(messageActions.fetchMessageRequest().type, fetchMessageSaga);
  yield takeLatest(messageActions.fetchChoicesRequest().type, fetchChoicesSaga);
  yield takeLatest(messageActions.fetchChoiceRequest().type, fetchChoiceSaga);
  yield takeLatest(messageActions.createMessageRequest().type, createMessageSaga);
  yield takeLatest(messageActions.deleteMessageRequest().type, deleteMessageSaga);
}

export default messageSaga;