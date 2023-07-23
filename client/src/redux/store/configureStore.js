import { combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { configureStore } from '@reduxjs/toolkit'
import { all } from 'redux-saga/effects';
import userReducer from '../reducers/userReducer';
import userSaga from '../sagas/userSaga';
import chatReducer from '../reducers/chatReducer';
import messageReducer from '../reducers/messageReducer';
import chatSaga from '../sagas/chatSaga';
import messageSaga from '../sagas/messageSaga';
import uiReducer from '../reducers/uiReducer';
import uiSaga from '../sagas/uiSaga';

// Combine all reducers into a root reducer
const rootReducer = combineReducers({
  users: userReducer,
  chats: chatReducer,
  messages: messageReducer,
  ui: uiReducer,
});

// Create the saga middleware
const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

// Create the root saga
function* rootSaga() {
  yield all([
    userSaga(),
    chatSaga(),
    messageSaga(),
    uiSaga(),
  ]);
}

// Create the Redux store with the root reducer and middleware
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middleware),
})

// Run the root saga
sagaMiddleware.run(rootSaga);

export default store;