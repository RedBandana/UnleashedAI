import { handleActions } from 'redux-actions';
import {
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,
  fetchUserRequest,
  fetchUserSuccess,
  fetchUserFailure,
  createUserRequest,
  createUserSuccess,
  createUserFailure,
} from '../actions/userActions';

const initialState = {
  users: [],
  user: null,
  loading: false,
  error: null,
  userLoading: null,
  userError: null,
  createUserLoading: false,
  createUserError: null,
};

const userReducer = handleActions(
  {
    [fetchUsersRequest]: (state) => ({
      ...state,
      loading: true,
      error: null,
    }),
    [fetchUsersSuccess]: (state, { payload }) => ({
      ...state,
      users: payload,
      loading: false,
      error: null,
    }),
    [fetchUsersFailure]: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload,
    }),
    [fetchUserRequest]: (state) => ({
      ...state,
      userLoading: true,
      userError: null,
    }),
    [fetchUserSuccess]: (state, { payload }) => ({
      ...state,
      user: payload,
      userLoading: false,
      userError: null,
    }),
    [fetchUserFailure]: (state, { payload }) => ({
      ...state,
      userLoading: false,
      userError: payload,
    }),
    [createUserRequest]: (state) => ({
      ...state,
      createUserLoading: true,
      createUserError: null,
    }),
    [createUserSuccess]: (state, { payload }) => ({
      ...state,
      users: [...state.users, payload],
      createUserLoading: false,
      createUserError: null,
    }),
    [createUserFailure]: (state, { payload }) => ({
      ...state,
      createUserLoading: false,
      createUserError: payload,
    }),
  },
  initialState
);

export default userReducer;