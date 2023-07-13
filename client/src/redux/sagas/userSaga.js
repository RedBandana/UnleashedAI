import { takeLatest, select, call, put } from 'redux-saga/effects';
import {
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,
  fetchUserRequest,
  fetchUserSuccess,
  fetchUserFailure,
  createUserRequest,
  createUserSuccess,
  createUserFailure
} from '../actions/userActions';
import * as userService from '../../services/userService';
import * as selector from '../selectors/userSelectors';

function* fetchUsersSaga() {
  try {
    const users = yield call(userService.fetchUsers);
    yield put(fetchUsersSuccess(users));
  } catch (error) {
    yield put(fetchUsersFailure(error.message));
  }
}

function* fetchUserSaga(action) {
  try {
    const userId = action.payload;

    // Check if the data is already present in the cache
    const user = yield select(selector.fetchUser);
    if (user && user.id === userId) {
      // Data is already in the cache, skip the request and use the cached data
      yield put(fetchUserSuccess(user));
      return;
    }

    // Check if a request is already in progress
    const loading = yield select(selector.fetchUserLoading);
    if (loading) {
      // A request is already in progress, wait for it to complete
      return;
    }

    // Make the server request
    const response = yield call(userService.fetchUser, userId);
    const userData = response.data;

    // Store the data in the cache and update the Redux state
    yield put(fetchUserSuccess(userData));
  } catch (error) {
    yield put(fetchUserFailure(error.message));
  }
}

function* createUserSaga(action) {
  try {
    const newUser = yield call(userService.createUser, action.payload);
    yield put(createUserSuccess(newUser));
  } catch (error) {
    yield put(createUserFailure(error.message));
  }
}

function* userSaga() {
  yield takeLatest(fetchUsersRequest.type, fetchUsersSaga);
  yield takeLatest(fetchUserRequest.type, fetchUserSaga);
  yield takeLatest(createUserRequest.type, createUserSaga);
  // Add other sagas for different actions if needed
}

export default userSaga;