import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';

import {
  settingsReducer,
  buildHistoryReducer,
  buildDetailsReducer,
} from './reducers';

const rootReducer = combineReducers({
  settings: settingsReducer,
  buildHistory: buildHistoryReducer,
  buildDetails: buildDetailsReducer,
});

// создание стора для клиента
export const createClientStore = () => {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const middleWare =
    process.env.NODE_ENV === 'development'
      ? composeEnhancers(applyMiddleware(thunk))
      : applyMiddleware(thunk);

  return createStore(rootReducer, middleWare);
};

// создание стора для ssr
export const createServerStore = () => {
  const middleWare = applyMiddleware(thunk);
  return createStore(rootReducer, middleWare);
};