import { createAction } from 'redux-actions';

export const fetchUsersRequest = createAction('FETCH_USERS_REQUEST');
export const fetchUsersSuccess = createAction('FETCH_USERS_SUCCESS');
export const fetchUsersFailure = createAction('FETCH_USERS_FAILURE');

export const fetchUserRequest = createAction('FETCH_USER_REQUEST');
export const fetchUserSuccess = createAction('FETCH_USER_SUCCESS');
export const fetchUserFailure = createAction('FETCH_USER_FAILURE');

export const createUserRequest = createAction('CREATE_USER_REQUEST');
export const createUserSuccess = createAction('CREATE_USER_SUCCESS');
export const createUserFailure = createAction('CREATE_USER_FAILURE');
