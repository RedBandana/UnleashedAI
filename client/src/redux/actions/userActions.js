import { createAction } from 'redux-actions';

export const fetchUserRequest = createAction('FETCH_USER_REQUEST');
export const fetchUserSuccess = createAction('FETCH_USER_SUCCESS');
export const fetchUserFailure = createAction('FETCH_USER_FAILURE');

export const createUserRequest = createAction('CREATE_USER_REQUEST');
export const createUserSuccess = createAction('CREATE_USER_SUCCESS');
export const createUserFailure = createAction('CREATE_USER_FAILURE');

export const createGuestRequest = createAction('CREATE_GUEST_REQUEST');
export const createGuestSuccess = createAction('CREATE_GUEST_SUCCESS');
export const createGuestFailure = createAction('CREATE_GUEST_FAILURE');
