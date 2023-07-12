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
    const user = yield call(getUserById, action.payload);
    yield put(fetchUserSuccess(user));
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