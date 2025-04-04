import { takeLatest, call, put } from 'redux-saga/effects';
import * as userActions from '../actions/userActions';
import * as userService from '../../services/userService';
import { setGuestSessionCookie, setUserSessionCookie } from '../../utils/functions';

function* fetchUserSaga() {
  try {
    const user = yield call(userService.getCurrentUser);
    yield put(userActions.fetchUserSuccess(user));
  } catch (error) {
    yield put(userActions.fetchUserFailure(error.message));
  }
}

function* registerUserSaga(action) {
  try {
    const newUser = yield call(userService.registerUser, action.payload);
    setUserSessionCookie(newUser.sessionToken);
    delete newUser.sessionToken;
    yield put(userActions.registerUserSuccess(newUser));
  } catch (error) {
    yield put(userActions.registerUserFailure(error.message));
  }
}

function* loginUserSaga(action) {
  try {
    const newUser = yield call(userService.loginUser, action.payload);
    setUserSessionCookie(newUser.sessionToken);
    delete newUser.sessionToken;
    yield put(userActions.loginUserSuccess(newUser));
  } catch (error) {
    yield put(userActions.loginUserFailure(error.message));
  }
}

function* updateUserSaga(action) {
  try {
    const newUser = yield call(userService.updateUser, action.payload);
    yield put(userActions.updateUserSuccess(newUser));
  } catch (error) {
    yield put(userActions.updateUserFailure(error.message));
  }
}

function* createGuestSaga() {
  try {
    const guest = yield call(userService.createGuest);
    setGuestSessionCookie(guest.sessionToken);
    delete guest.sessionToken;
    yield put(userActions.createGuestSuccess(guest));
  } catch (error) {
    yield put(userActions.createGuestFailure(error.message));
  }
}

function* forgotPasswordSaga(action) {
  try {
    const payload = yield call(userService.forgetPassword, action.payload);
    yield put(userActions.forgotPasswordSuccess(payload));
  } catch (error) {
    yield put(userActions.forgotPasswordFailure(error.message));
  }
}

function* resetPasswordSaga(action) {
  try {
    const newUser = yield call(userService.resetPassword, action.payload);
    setUserSessionCookie(newUser.sessionToken);
    delete newUser.sessionToken;
    yield put(userActions.resetPasswordSuccess(newUser));
  } catch (error) {
    yield put(userActions.resetPasswordFailure(error.message));
  }
}

function* userSaga() {
  yield takeLatest(userActions.fetchUserRequest().type, fetchUserSaga);
  yield takeLatest(userActions.registerUserRequest().type, registerUserSaga);
  yield takeLatest(userActions.loginUserRequest().type, loginUserSaga);
  yield takeLatest(userActions.updateUserRequest().type, updateUserSaga);
  yield takeLatest(userActions.createGuestRequest().type, createGuestSaga);
  yield takeLatest(userActions.forgotPasswordRequest().type, forgotPasswordSaga);
  yield takeLatest(userActions.resetPasswordRequest().type, resetPasswordSaga);
}

export default userSaga;