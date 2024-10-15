import { applyMiddleware, createStore } from 'redux';
import { thunk } from 'redux-thunk'; // Use named import
import rootReducer from './authReducer';

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
