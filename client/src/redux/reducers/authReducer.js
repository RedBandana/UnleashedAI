import { handleActions } from 'redux-actions';
import { loginRequest, loginFailure, loginSuccess } from '../actions/authActions';

const initialState = {
    user: null,
    loading: false,
    error: null,
  };

const authReducer = handleActions(
  {
    [loginRequest]: (state) => ({
      ...state,
      loading: true,
      error: null,
    }),
    [loginSuccess]: (state, { payload }) => ({
      ...state,
      user: payload,
      loading: false,
      error: null,
    }),
    [loginFailure]: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload,
    }),
  },
  initialState
);

export default authReducer;