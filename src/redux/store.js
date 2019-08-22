import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import './root-reducer';
import rootReducer from './root-reducer';

const middlewares = [logger];

const store = createStore(rootReducer, applyMiddleware(...middlewares));

export default store;