import { createAction } from 'redux-actions';

export const toggleSidebar = createAction('TOGGLE_SIDEBAR');
export const setSidebarIsOpen = createAction('SET_SIDEBAR');
export const toggleTheme = createAction('TOGGLE_THEME');
export const setThemeIsLight = createAction('SET_THEME');
export const toggleSettings = createAction('TOGGLE_SETTINGS_VISIBILITY');
export const setSettingsIsOpen = createAction('SET_SETTINGS_VISIBILITY');
export const setSettings = createAction('SET_SETTINGS');
export const setChatSelectedIndex = createAction('SET_CHAT_INDEX');