import { handleActions } from 'redux-actions';
import * as action from '../actions/authActions';

const initialState = {
  user: null,
  loading: false,
  error: null,
};

const authReducer = handleActions(
  {
    [action.loginRequest]: (state) => ({
      ...state,
      loading: true,
      error: null,
    }),
    [action.loginSuccess]: (state, { payload }) => ({
      ...state,
      user: payload,
      loading: false,
      error: null,
    }),
    [action.loginFailure]: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload,
    }),
  },
  initialState
);

export default authReducer;