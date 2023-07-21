import { createAction } from 'redux-actions';

export const fetchChatsRequest = createAction('FETCH_CHATS_REQUEST');
export const fetchChatsSuccess = createAction('FETCH_CHATS_SUCCESS');
export const fetchChatsFailure = createAction('FETCH_CHATS_FAILURE');

export const fetchChatsPageRequest = createAction('FETCH_CHATS_PAGE_REQUEST');
export const fetchChatsPageSuccess = createAction('FETCH_CHATS_PAGE_SUCCESS');
export const fetchChatsPageFailure = createAction('FETCH_CHATS_PAGE_FAILURE');

export const fetchChatRequest = createAction('FETCH_CHAT_REQUEST');
export const fetchChatSuccess = createAction('FETCH_CHAT_SUCCESS');
export const fetchChatFailure = createAction('FETCH_CHAT_FAILURE');

export const editChatRequest = createAction('EDIT_CHAT_REQUEST');
export const editChatSuccess = createAction('EDIT_CHAT_SUCCESS');
export const editChatFailure = createAction('EDIT_CHAT_FAILURE');

export const createChatRequest = createAction('CREATE_CHAT_REQUEST');
export const createChatSuccess = createAction('CREATE_CHAT_SUCCESS');
export const createChatFailure = createAction('CREATE_CHAT_FAILURE');

export const deleteChatRequest = createAction('DELETE_CHAT_REQUEST');
export const deleteChatSuccess = createAction('DELETE_CHAT_SUCCESS');
export const deleteChatFailure = createAction('DELETE_CHAT_FAILURE');

export const clearChatsRequest = createAction('CLEAR_CHATS_REQUEST');
export const clearChatsSuccess = createAction('CLEAR_CHATS_SUCCESS');
export const clearChatsFailure = createAction('CLEAR_CHATS_FAILURE');