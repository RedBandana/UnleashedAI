import { createAction } from 'redux-actions';

export const loginRequest = createAction('LOGIN_REQUEST');
export const loginRequestSent = createAction('LOGIN_REQUEST_SENT');
export const loginSuccess = createAction('LOGIN_SUCCESS');
export const loginFailure = createAction('LOGIN_FAILURE');