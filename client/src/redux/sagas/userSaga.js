import { takeLatest, select, call, put } from 'redux-saga/effects';
import {
  getUsersRequest,
  getUsersSuccess,
  getUsersFailure,
  getUserRequest,
  getUserSuccess,
  getUserFailure,
  createUserRequest,
  createUserSuccess,
  createUserFailure
} from '../actions/userActions';
import * as userService from '../../services/userService';
import * as selector from '../selectors/userSelectors';

function* getUsersSaga() {
  try {
    const users = yield call(userService.getUsers);
    yield put(getUsersSuccess(users));
  } catch (error) {
    yield put(getUsersFailure(error.message));
  }
}

function* getUserSaga(action) {
  try {
    const userId = action.payload;

    // Check if the data is already present in the cache
    const user = yield select(selector.getUser);
    if (user && user.id === userId) {
      // Data is already in the cache, skip the request and use the cached data
      yield put(getUserSuccess(user));
      return;
    }

    // Check if a request is already in progress
    const loading = yield select(selector.getUserLoading);
    if (loading) {
      // A request is already in progress, wait for it to complete
      return;
    }

    // Make the server request
    const response = yield call(userService.getUser, userId);
    const userData = response.data;

    // Store the data in the cache and update the Redux state
    yield put(getUserSuccess(userData));
  } catch (error) {
    yield put(getUserFailure(error.message));
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
  yield takeLatest(getUsersRequest.type, getUsersSaga);
  yield takeLatest(getUserRequest.type, getUserSaga);
  yield takeLatest(createUserRequest.type, createUserSaga);
  // Add other sagas for different actions if needed
}

export default userSaga;