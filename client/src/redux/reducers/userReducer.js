import { handleActions } from 'redux-actions';
import * as action from '../actions/userActions';

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
    [action.fetchUsersRequest]: (state) => ({
      ...state,
      loading: true,
      error: null,
    }),
    [action.fetchUsersSuccess]: (state, { payload }) => ({
      ...state,
      users: payload,
      loading: false,
      error: null,
    }),
    [action.fetchUsersFailure]: (state, { payload }) => ({
      ...state,
      loading: false,
      error: payload,
    }),
    [action.fetchUserRequest]: (state) => ({
      ...state,
      userLoading: true,
      userError: null,
    }),
    [action.fetchUserSuccess]: (state, { payload }) => ({
      ...state,
      user: payload,
      userLoading: false,
      userError: null,
    }),
    [action.fetchUserFailure]: (state, { payload }) => ({
      ...state,
      userLoading: false,
      userError: payload,
    }),
    [action.createUserRequest]: (state) => ({
      ...state,
      createUserLoading: true,
      createUserError: null,
    }),
    [action.createUserSuccess]: (state, { payload }) => ({
      ...state,
      users: [...state.users, payload],
      createUserLoading: false,
      createUserError: null,
    }),
    [action.createUserFailure]: (state, { payload }) => ({
      ...state,
      createUserLoading: false,
      createUserError: payload,
    }),
  },
  initialState
);

export default userReducer;