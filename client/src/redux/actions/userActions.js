import { createAction } from 'redux-actions';

export const fetchUserRequest = createAction('FETCH_USER_REQUEST');
export const fetchUserSuccess = createAction('FETCH_USER_SUCCESS');
export const fetchUserFailure = createAction('FETCH_USER_FAILURE');

export const registerUserRequest = createAction('CREATE_USER_REQUEST');
export const registerUserSuccess = createAction('CREATE_USER_SUCCESS');
export const registerUserFailure = createAction('CREATE_USER_FAILURE');

export const loginUserRequest = createAction('LOGIN_USER_REQUEST');
export const loginUserSuccess = createAction('LOGIN_USER_SUCCESS');
export const loginUserFailure = createAction('LOGIN_USER_FAILURE');

export const updateUserRequest = createAction('UPDATE_USER_REQUEST');
export const updateUserSuccess = createAction('UPDATE_USER_SUCCESS');
export const updateUserFailure = createAction('UPDATE_USER_FAILURE');

export const createGuestRequest = createAction('CREATE_GUEST_REQUEST');
export const createGuestSuccess = createAction('CREATE_GUEST_SUCCESS');
export const createGuestFailure = createAction('CREATE_GUEST_FAILURE');
