import { handleActions } from 'redux-actions';
import * as actions from '../actions/uiActions';

const initialState = {
  sidebarIsOpen: false,
  themeIsLight: true,
};

const uiReducer = handleActions(
  {
    [actions.toggleSidebar]: (state) => ({
      ...state,
      sidebarIsOpen: !state.sidebarIsOpen,
    }),
    [actions.setSidebarIsOpen]: (state, { payload }) => ({
      ...state,
      sidebarIsOpen: payload,
    }),
    [actions.toggleTheme]: (state) => ({
      ...state,
      themeIsLight: !state.themeIsLight,
    }),
    [actions.setThemeIsLight]: (state, { payload }) => ({
      ...state,
      themeIsLight: payload,
    }),
  },
  initialState
);

export default uiReducer;