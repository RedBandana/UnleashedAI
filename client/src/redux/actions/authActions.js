import { createAction } from 'redux-actions';
import * as authService from '../../services/authService';

export const loginRequest = createAction('LOGIN_REQUEST');
export const loginSuccess = createAction('LOGIN_SUCCESS');
export const loginFailure = createAction('LOGIN_FAILURE');


export const login = () => async (dispatch) => {
    dispatch(loginRequest());
    try {
      const user = await authService.login();
      dispatch(loginSuccess(user));
    } catch (error) {
      dispatch(loginFailure(error.message));
    }
  };