import { takeLatest, select, call, put } from 'redux-saga/effects';
import * as authActions from '../actions/authActions';
import * as authService from '../../services/authService';
import * as selectors from '../selectors/authSelectors';

function* loginSaga() {
  try {
    const user = yield select(selectors.authUser);
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