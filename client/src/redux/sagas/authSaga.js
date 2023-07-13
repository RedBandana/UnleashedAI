import { takeLatest, select, call, put } from 'redux-saga/effects';
import {
  loginRequest,
  loginSuccess,
  loginFailure
} from '../actions/authActions';
import * as authService from '../../services/authService';
import * as selector from '../selectors/authSelectors';

function* loginSaga() {
  try {
    // Check if the data is already present in the cache
    const user = yield select(selector.authUser);
    if (user) {
      // Data is already in the cache, skip the request and use the cached data
      yield put(loginSuccess(user));
      return;
    }

    // Make the server request
    const response = yield call(authService.login);
    const userData = response;

    // Store the data in the cache and update the Redux state
    yield put(loginSuccess(userData));
  } catch (error) {
    yield put(loginFailure(error.message));
  }
}

function* authSaga() {
  yield takeLatest(loginRequest().type, loginSaga);
  // Add other sagas for different actions if needed
}

export default authSaga;