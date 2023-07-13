import { handleActions } from 'redux-actions';
import {
  getUsersRequest,
  getUsersSuccess,
  getUsersFailure,
  getUserRequest,
  getUserSuccess,
  getUserFailure,
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
    [getUsersRequest]: (state) => ({
      ...state,
      loading: true,
      error: null,
    }),
    [getUsersSuccess]: (state, { payload }) => ({
      ...state,
      users: payload,
      loading: false,
      error: null,
    }),
    [getUsersFailure]: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload,
    }),
    [getUserRequest]: (state) => ({
      ...state,
      userLoading: true,
      userError: null,
    }),
    [getUserSuccess]: (state, { payload }) => ({
      ...state,
      user: payload,
      userLoading: false,
      userError: null,
    }),
    [getUserFailure]: (state, { payload }) => ({
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