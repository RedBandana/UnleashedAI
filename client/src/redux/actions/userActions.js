import { createAction } from 'redux-actions';
import * as userService from '../../services/userService';

export const fetchUsersRequest = createAction('FETCH_USERS_REQUEST');
export const fetchUsersSuccess = createAction('FETCH_USERS_SUCCESS');
export const fetchUsersFailure = createAction('FETCH_USERS_FAILURE');

export const fetchUserRequest = createAction('FETCH_USER_REQUEST');
export const fetchUserSuccess = createAction('FETCH_USER_SUCCESS');
export const fetchUserFailure = createAction('FETCH_USER_FAILURE');

export const createUserRequest = createAction('CREATE_USER_REQUEST');
export const createUserSuccess = createAction('CREATE_USER_SUCCESS');
export const createUserFailure = createAction('CREATE_USER_FAILURE');

export const fetchUsers = () => async (dispatch) => {
  dispatch(fetchUsersRequest());
  try {
    const users = await userService.fetchUsers();
    dispatch(fetchUsersSuccess(users));
  } catch (error) {
    dispatch(fetchUsersFailure(error.message));
  }
};

export const fetchUser = (id) => async (dispatch) => {
  dispatch(fetchUserRequest());
  try {
    const user = await userService.fetchUser(id);
    dispatch(fetchUserSuccess(user));
  } catch (error) {
    dispatch(fetchUserFailure(error.message));
  }
};

export const createUser = (userData) => async (dispatch) => {
  dispatch(createUserRequest());
  try {
    const newUser = await userService.createUser(userData);
    dispatch(createUserSuccess(newUser));
  } catch (error) {
    dispatch(createUserFailure(error.message));
  }
};