import { takeLatest, select, call, put } from 'redux-saga/effects';
import * as userActions from '../actions/userActions';
import * as userService from '../../services/userService';
import * as selectors from '../selectors/userSelectors';
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
    yield put(userActions.registerUserSuccess(newUser));
  } catch (error) {
    yield put(userActions.registerUserFailure(error.message));
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

function* userSaga() {
  yield takeLatest(userActions.fetchUserRequest().type, fetchUserSaga);
  yield takeLatest(userActions.registerUserRequest().type, registerUserSaga);
  yield takeLatest(userActions.loginUserRequest().type, loginUserSaga);
  yield takeLatest(userActions.createGuestRequest().type, createGuestSaga);
}

export default userSaga;