import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { App } from './App';

import './utils/i18n/i18n';
import { createClientStore } from './store/store';

import * as serviceWorker from './workers/initCache';
import { registerPushWorker } from './workers/initPush';

const store = createClientStore();

const requestNotificationPermission = async () => {
  const permission = await window.Notification.requestPermission();
  console.log(permission);
  // value of permission can be 'granted', 'default', 'denied'
  if (permission !== 'granted') {
    console.log('Permission not granted for Notification');
  }
};

ReactDOM.hydrate(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

const registerWorkers = async () => {
  try {
    serviceWorker.register();
    await registerPushWorker();
    await requestNotificationPermission();
  } catch (e) {
    console.log(e);
  }
};

registerWorkers();
