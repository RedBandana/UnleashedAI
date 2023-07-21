import { handleActions } from 'redux-actions';
import * as actions from '../actions/uiActions';

const initialState = {
  sidebarIsOpen: false,
  settingsIsOpen: false,
  settings: null,
  themeIsLight: true,
  chatSelectedIndex: 0,
  messagesPage: 1,
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
    [actions.toggleSettings]: (state) => ({
      ...state,
      settingsIsOpen: !state.settingsIsOpen,
    }),
    [actions.setSettingsIsOpen]: (state, { payload }) => ({
      ...state,
      settingsIsOpen: payload,
    }),
    [actions.setSettings]: (state, { payload }) => ({
      ...state,
      settings: payload,
    }),
    [actions.setChatSelectedIndex]: (state, { payload }) => ({
      ...state,
      chatSelectedIndex: payload,
    }),
    [actions.SetMessagesPage]: (state, { payload }) => ({
      ...state,
      messagesPage: payload,
    }),
  },
  initialState
);

export default uiReducer;