import React from 'react';
import { Switch, Route } from 'react-router-dom';

import {
  BuildDetailsPage,
  BuildHistoryPage,
  SettingsPage,
  MainPage,
} from './pages';

function App() {
  return (
    <Switch>
      <Route path='/settings' component={SettingsPage} />
      <Route path='/buildHistory' component={BuildHistoryPage} />
      <Route path='/buildDetails' component={BuildDetailsPage} />
      <Route path='/' component={MainPage} />
    </Switch>
  );
}

export default App;
