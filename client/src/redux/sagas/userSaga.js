import { takeLatest, call, put } from 'redux-saga/effects';
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
import {
  getAllUsers,
  getUserById,
  createUser as createUserApi
} from '../services/userService';

function* fetchUsersSaga() {
  try {
    const users = yield call(getAllUsers);
    yield put(fetchUsersSuccess(users));
  } catch (error) {
    yield put(fetchUsersFailure(error.message));
  }
}

function* fetchUserSaga(action) {
  try {
    const userId = action.payload;

    // Check if the data is already present in the cache
    const user = yield select(getUser);
    if (user && user.id === userId) {
      // Data is already in the cache, skip the request and use the cached data
      yield put(fetchUserSuccess(user));
      return;
    }

    // Check if a request is already in progress
    const loading = yield select(getUserLoading);
    if (loading) {
      // A request is already in progress, wait for it to complete
      return;
    }

    // Make the server request
    const response = yield call(getUserById, userId);
    const userData = response.data;

    // Store the data in the cache and update the Redux state
    yield put(fetchUserSuccess(userData));
  } catch (error) {
    yield put(fetchUserFailure(error.message));
  }
}

function* createUserSaga(action) {
  try {
    const newUser = yield call(createUserApi, action.payload);
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