import { createAction } from 'redux-actions';

export const toggleSidebar = createAction('TOGGLE_SIDEBAR');
export const setSidebarIsOpen = createAction('SET_SIDEBAR');
export const toggleTheme = createAction('TOGGLE_THEME');
export const setThemeIsLight = createAction('SET_THEME');
export const toggleSettings = createAction('TOGGLE_SETTINGS_VISIBILITY');
export const setSettingsIsOpen = createAction('SET_SETTINGS_VISIBILITY');
export const setSettings = createAction('SET_SETTINGS');
export const setChatSelectedIndex = createAction('SET_CHAT_INDEX');
export const setUserSettingsIsOpen = createAction('SET_USER_SETTINGS_VISIBILITY');
export const setPremiumDialogIsOpen = createAction('SET_PREMIUM_DIALOG_VISIBILITY');
export const setIsMobile = createAction('SET_MOBILE');
export const setReply = createAction('SET_REPLY');
