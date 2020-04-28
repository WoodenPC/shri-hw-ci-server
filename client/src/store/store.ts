import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';

import { settingsReducer, buildHistoryReducer } from './reducers';

const rootReducer = combineReducers({
  settings: settingsReducer,
  buildHistory: buildHistoryReducer,
});

// создание стора для клиента
export const createClientStore = () => {
  const composeEnhancers =
    (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
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

export type RootState = ReturnType<typeof rootReducer>;
