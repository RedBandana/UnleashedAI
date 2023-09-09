import { handleActions } from 'redux-actions';
import * as action from '../actions/userActions';

const initialState = {
  user: null,
  loading: false,
  error: null,
  updateDone: false,
  emailSent: false,
};

const userReducer = handleActions(
  {
    [action.fetchUserRequest]: (state) => ({
      ...state,
      loading: true,
      error: null,
    }),
    [action.fetchUserSuccess]: (state, { payload }) => ({
      ...state,
      user: payload,
      loading: false,
      error: null,
    }),
    [action.fetchUserFailure]: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload,
    }),
    [action.registerUserRequest]: (state) => ({
      ...state,
      loading: true,
      error: null,
    }),
    [action.registerUserSuccess]: (state, { payload }) => ({
      ...state,
      user: payload,
      loading: false,
      error: null,
    }),
    [action.registerUserFailure]: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload,
    }),
    [action.loginUserRequest]: (state) => ({
      ...state,
      loading: true,
      error: null,
    }),
    [action.loginUserSuccess]: (state, { payload }) => ({
      ...state,
      user: payload,
      loading: false,
      error: null,
    }),
    [action.loginUserFailure]: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload,
    }),
    [action.updateUserRequest]: (state) => ({
      ...state,
      loading: true,
      error: null,
      updateDone: false,
    }),
    [action.updateUserSuccess]: (state, { payload }) => ({
      ...state,
      user: payload,
      loading: false,
      error: null,
      updateDone: true,
    }),
    [action.updateUserFailure]: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload,
      updateDone: false,
    }),
    [action.createGuestRequest]: (state) => ({
      ...state,
      loading: true,
      error: null,
    }),
    [action.createGuestSuccess]: (state, { payload }) => ({
      ...state,
      user: payload,
      loading: false,
      error: null,
    }),
    [action.createGuestFailure]: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload,
    }),
    [action.forgotPasswordRequest]: (state) => ({
      ...state,
      emailSent: false,
      loading: true,
      error: null,
    }),
    [action.forgotPasswordSuccess]: (state, { payload }) => ({
      ...state,
      emailSent: true,
      loading: false,
      error: null,
    }),
    [action.forgotPasswordFailure]: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload,
    }),
    [action.logoutUserSuccess]: (state) => ({
      ...state,
      user: null,
      loading: false,
      error: null,
      updateDone: false,
    }),
  },
  initialState
);

export default userReducer;