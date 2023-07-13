import { combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { configureStore } from '@reduxjs/toolkit'
import { all } from 'redux-saga/effects';
import userReducer from '../reducers/userReducer';
import userSaga from '../sagas/userSaga';

// Combine all reducers into a root reducer
const rootReducer = combineReducers({
  user: userReducer,
  // Add other reducers here if needed
});

// Create the saga middleware
const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

// Create the root saga
function* rootSaga() {
  yield all([
    userSaga(),
    // Add other sagas here if needed
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