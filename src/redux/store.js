import { createStore, applyMiddleware } from 'redux';

import logger from 'redux-logger'

import rootReducer from './root-reducer';
import { persistStore } from 'redux-persist';


const middleswares = []
// const middleswares = [logger]

const store = createStore(rootReducer, applyMiddleware(...middleswares))

const persistor = persistStore(store)

export {persistor, store}
