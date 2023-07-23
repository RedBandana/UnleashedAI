import { takeLatest, select, call, put } from 'redux-saga/effects';
import * as userActions from '../actions/userActions';
import * as userService from '../../services/userService';
import * as selectors from '../selectors/userSelectors';

function* fetchUserSaga(action) {
  try {
    const userId = action.payload;
    const user = yield select(selectors.fetchUserValue);

    if (user && user.id === userId) {
      yield put(userActions.fetchUserSuccess(user));
      return;
    }

    const response = yield call(userService.getCurrentUser);
    const userData = response.data;

    yield put(userActions.fetchUserSuccess(userData));
  } catch (error) {
    yield put(userActions.fetchUserFailure(error.message));
  }
}

function* createUserSaga(action) {
  try {
    const newUser = yield call(userService.createUser, action.payload);
    delete newUser.sessionToken;
    yield put(userActions.createUserSuccess(newUser));
  } catch (error) {
    yield put(userActions.createUserFailure(error.message));
  }
}

function* createGuestSaga(action) {
  try {
    const newUser = yield call(userService.createGuest, action.payload);
    delete newUser.sessionToken;
    yield put(userActions.createGuestSuccess(newUser));
  } catch (error) {
    yield put(userActions.createGuestFailure(error.message));
  }
}

function* userSaga() {
  yield takeLatest(userActions.fetchUserRequest().type, fetchUserSaga);
  yield takeLatest(userActions.createUserRequest().type, createUserSaga);
  yield takeLatest(userActions.createGuestRequest().type, createGuestSaga);
}

export default userSaga;