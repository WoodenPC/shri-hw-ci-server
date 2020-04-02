import { createStore, applyMiddleware, combineReducers } from 'redux';
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

const middleWare = applyMiddleware(thunk);

export const store = createStore(rootReducer, middleWare);
