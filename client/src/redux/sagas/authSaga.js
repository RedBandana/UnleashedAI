import { takeLatest, select, call, put } from 'redux-saga/effects';
import { authUserValue } from '../selectors/authSelectors';
import * as authActions from '../actions/authActions';
import * as authService from '../../services/authService';

function* loginSaga() {
  try {
    const user = yield select(authUserValue);
    if (user) {
      yield put(authActions.loginSuccess(user));
      return;
    }

    const response = yield call(authService.login);
    const userData = response;

    yield put(authActions.loginSuccess(userData));
  } catch (error) {
    yield put(authActions.loginFailure(error.message));
  }
}

function* authSaga() {
  yield takeLatest(authActions.loginRequest().type, loginSaga);
}

export default authSaga;