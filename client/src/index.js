import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import './scss/main.scss';
import { App } from './App';

import {
  settingsReducer,
  buildHistoryReducer,
  buildDetailsReducer,
} from './store/reducers';

const rootReducer = combineReducers({
  settings: settingsReducer,
  buildHistory: buildHistoryReducer,
  buildDetails: buildDetailsReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleWare =
  process.env.NODE_ENV === 'development'
    ? composeEnhancers(applyMiddleware(thunk))
    : applyMiddleware(thunk);

const store = createStore(rootReducer, middleWare);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
