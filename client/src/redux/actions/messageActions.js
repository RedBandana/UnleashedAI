import { createAction } from 'redux-actions';

export const fetchMessagesRequest = createAction('FETCH_MESSAGES_REQUEST');
export const fetchMessagesSuccess = createAction('FETCH_MESSAGES_SUCCESS');
export const fetchMessagesFailure = createAction('FETCH_MESSAGES_FAILURE');

export const fetchMessagesPageRequest = createAction('FETCH_MESSAGES_PAGE_REQUEST');
export const fetchMessagesPageSuccess = createAction('FETCH_MESSAGES_PAGE_SUCCESS');
export const fetchMessagesPageFailure = createAction('FETCH_MESSAGES_PAGE_FAILURE');

export const fetchMessageRequest = createAction('FETCH_MESSAGE_REQUEST');
export const fetchMessageSuccess = createAction('FETCH_MESSAGE_SUCCESS');
export const fetchMessageFailure = createAction('FETCH_MESSAGE_FAILURE');

export const fetchChoicesRequest = createAction('FETCH_CHOICES_REQUEST');
export const fetchChoicesSuccess = createAction('FETCH_CHOICES_SUCCESS');
export const fetchChoicesFailure = createAction('FETCH_CHOICES_FAILURE');

export const fetchChoiceRequest = createAction('FETCH_CHOICE_REQUEST');
export const fetchChoiceSuccess = createAction('FETCH_CHOICE_SUCCESS');
export const fetchChoiceFailure = createAction('FETCH_CHOICE_FAILURE');

export const createMessageRequest = createAction('CREATE_MESSAGE_REQUEST');
export const createMessageSuccess = createAction('CREATE_MESSAGE_SUCCESS');
export const createMessageFailure = createAction('CREATE_MESSAGE_FAILURE');

export const deleteMessageRequest = createAction('DELETE_MESSAGE_REQUEST');
export const deleteMessageSuccess = createAction('DELETE_MESSAGE_SUCCESS');
export const deleteMessageFailure = createAction('DELETE_MESSAGE_FAILURE');

export const clearMessagesSuccess = createAction('CLEAR_MESSAGES_SUCCESS');
export const setCanReceiveMessage = createAction('SET_CAN_RECEIVE_MESSAGE');
