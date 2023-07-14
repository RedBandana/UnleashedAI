import { takeLatest, select, call, put } from 'redux-saga/effects';
import * as userActions from '../actions/userActions';
import * as userService from '../../services/userService';
import * as selectors from '../selectors/userSelectors';

function* fetchUsersSaga(action) {
  try {
    const { page, count } = action.payload;
    const users = yield call(userService.fetchUsers, page, count);
    yield put(userActions.fetchUsersSuccess(users));
  } catch (error) {
    yield put(userActions.fetchUsersFailure(error.message));
  }
}

function* fetchUserSaga(action) {
  try {
    const userId = action.payload;
    const user = yield select(selectors.fetchUser);

    if (user && user.id === userId) {
      yield put(userActions.fetchUserSuccess(user));
      return;
    }

    const response = yield call(userService.fetchUser, userId);
    const userData = response.data;

    yield put(userActions.fetchUserSuccess(userData));
  } catch (error) {
    yield put(userActions.fetchUserFailure(error.message));
  }
}

function* createUserSaga(action) {
  try {
    const newUser = yield call(userService.createUser, action.payload);
    yield put(userActions.createUserSuccess(newUser));
  } catch (error) {
    yield put(userActions.createUserFailure(error.message));
  }
}

function* userSaga() {
  yield takeLatest(userActions.fetchUsersRequest().type, fetchUsersSaga);
  yield takeLatest(userActions.fetchUserRequest().type, fetchUserSaga);
  yield takeLatest(userActions.createUserRequest().type, createUserSaga);
}

export default userSaga;