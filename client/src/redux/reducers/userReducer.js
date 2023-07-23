import { handleActions } from 'redux-actions';
import * as action from '../actions/userActions';

const initialState = {
  user: null,
  loading: false,
  error: null,
  createUserLoading: false,
  createUserError: null,
  createGuestLoading: false,
  createGuestError: null,
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
    [action.createUserRequest]: (state) => ({
      ...state,
      createUserLoading: true,
      createUserError: null,
    }),
    [action.createUserSuccess]: (state, { payload }) => ({
      ...state,
      user: payload,
      createUserLoading: false,
      createUserError: null,
    }),
    [action.createUserFailure]: (state, { payload }) => ({
      ...state,
      createUserLoading: false,
      createUserError: payload,
    }),
    [action.createGuestRequest]: (state) => ({
      ...state,
      createGuestLoading: true,
      createGuestError: null,
    }),
    [action.createGuestSuccess]: (state, { payload }) => ({
      ...state,
      user: payload,
      createGuestLoading: false,
      createGuestError: null,
    }),
    [action.createGuestFailure]: (state, { payload }) => ({
      ...state,
      createGuestLoading: false,
      createGuestError: payload,
    }),
  },
  initialState
);

export default userReducer;