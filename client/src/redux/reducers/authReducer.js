import { handleActions } from 'redux-actions';
import { loginRequest, loginFailure, loginSuccess, loginRequestSent } from '../actions/authActions';

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const authReducer = handleActions(
  {
    [loginRequest]: () => (initialState),
    [loginRequestSent]: (state) => ({
      ...state,
      loading: true,
      error: null,
    }),
    [loginSuccess]: (state, { payload }) => ({
      ...state,
      user: payload,
      requestSent: false,
      loading: false,
      error: null,
    }),
    [loginFailure]: (state, { payload }) => ({
      ...state,
      requestSent: false,
      loading: false,
      error: payload,
    }),
  },
  initialState
);

export default authReducer;