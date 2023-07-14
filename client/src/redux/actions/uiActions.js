import { createAction } from 'redux-actions';

export const toggleSidebar = createAction('SIDEBAR_TOGGLE');
export const setSidebarIsOpen = createAction('SIDEBAR_SET');
export const toggleTheme = createAction('THEME_TOGGLE');
export const setThemeIsLight = createAction('THEME_SET');