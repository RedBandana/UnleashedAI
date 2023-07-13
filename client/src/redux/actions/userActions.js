import { createAction } from 'redux-actions';
import * as userService from '../../services/userService';

export const getUsersRequest = createAction('GET_USERS_REQUEST');
export const getUsersSuccess = createAction('GET_USERS_SUCCESS');
export const getUsersFailure = createAction('GET_USERS_FAILURE');

export const getUserRequest = createAction('GET_USER_REQUEST');
export const getUserSuccess = createAction('GET_USER_SUCCESS');
export const getUserFailure = createAction('GET_USER_FAILURE');

export const createUserRequest = createAction('CREATE_USER_REQUEST');
export const createUserSuccess = createAction('CREATE_USER_SUCCESS');
export const createUserFailure = createAction('CREATE_USER_FAILURE');

export const getUsers = () => async (dispatch) => {
  dispatch(getUsersRequest());
  try {
    const users = await userService.getUsers();
    dispatch(getUsersSuccess(users));
  } catch (error) {
    dispatch(getUsersFailure(error.message));
  }
};

export const getUser = (id) => async (dispatch) => {
  dispatch(getUserRequest());
  try {
    const user = await userService.getUser(id);
    dispatch(getUserSuccess(user));
  } catch (error) {
    dispatch(getUserFailure(error.message));
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