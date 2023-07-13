import { createAction } from 'redux-actions';
import { authUser } from '../selectors/authSelector';

export const loginRequest = createAction('LOGIN_REQUEST');
export const loginSuccess = createAction('LOGIN_SUCCESS');
export const loginFailure = createAction('LOGIN_FAILURE');


export const login = () => async (dispatch) => {
    dispatch(loginRequest());
    try {
      const users = await authUser.login();
      dispatch(loginSuccess(users));
    } catch (error) {
      dispatch(loginFailure(error.message));
    }
  };