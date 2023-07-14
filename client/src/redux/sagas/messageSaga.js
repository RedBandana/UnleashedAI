import { takeLatest, select, call, put } from 'redux-saga/effects';
import * as messageActions from '../actions/messageActions';
import * as messageService from '../../services/messageService';
import * as selectors from '../selectors/messageSelectors';

function* fetchMessagesSaga(action) {
  try {
    const { userId, chatIndex } = action.payload;
    const messages = yield call(messageService.fetchMessages, userId, chatIndex);
    yield put(messageActions.fetchMessagesSuccess(messages));
  } catch (error) {
    yield put(messageActions.fetchMessagesFailure(error.message));
  }
}

function* fetchMessageSaga(action) {
  try {
    const { userId, chatIndex, messageIndex } = action.payload;
    const message = yield select(selectors.fetchMessage);

    if (message && message.id === messageIndex) {
      yield put(messageActions.fetchMessageSuccess(message));
      return;
    }

    const response = yield call(
      messageService.fetchMessage,
      userId,
      chatIndex,
      messageIndex
    );
    const messageData = response.data;

    yield put(messageActions.fetchMessageSuccess(messageData));
  } catch (error) {
    yield put(messageActions.fetchMessageFailure(error.message));
  }
}

function* fetchChoicesSaga(action) {
  try {
    const { userId, chatIndex, messageIndex } = action.payload;
    const choices = yield call(
      messageService.fetchChoices,
      userId,
      chatIndex,
      messageIndex
    );
    yield put(messageActions.fetchChoicesSuccess(choices));
  } catch (error) {
    yield put(messageActions.fetchChoicesFailure(error.message));
  }
}

function* fetchChoiceSaga(action) {
  try {
    const { userId, chatIndex, messageIndex, choiceIndex } = action.payload;
    const choice = yield select(selectors.fetchChoice);

    if (choice && choice.id === choiceIndex) {
      yield put(messageActions.fetchChoiceSuccess(choice));
      return;
    }

    const response = yield call(
      messageService.fetchChoice,
      userId,
      chatIndex,
      messageIndex,
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
    const { message, userId, chatIndex } = action.payload;
    const newMessage = yield call(
      messageService.createMessage,
      message,
      userId,
      chatIndex
    );
    yield put(messageActions.createMessageSuccess(newMessage));
  } catch (error) {
    yield put(messageActions.createMessageFailure(error.message));
  }
}

function* deleteMessageSaga(action) {
  try {
    const { userId, chatIndex, messageIndex } = action.payload;
    yield call(messageService.deleteMessage, userId, chatIndex, messageIndex);
    yield put(messageActions.deleteMessageSuccess());
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