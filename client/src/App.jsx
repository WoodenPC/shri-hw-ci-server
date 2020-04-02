import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import './scss/main.scss';

import { loadSettingsFromServerAsync } from 'store/actionsCreators/settings';

import {
  BuildDetailsPage,
  BuildHistoryPage,
  SettingsPage,
  MainPage,
} from './pages';

class App extends React.PureComponent {
  async componentDidMount() {
    const { loadSettingsAsync, history } = this.props;
    if (!(await loadSettingsAsync())) {
      history.push('/settings');
    } else {
      if (history.location.pathname === '/') {
        history.push('/buildHistory');
      }
    }
  }
  render() {
    return (
      <Switch>
        <Route path='/settings' component={SettingsPage} />
        <Route path='/buildHistory' component={BuildHistoryPage} />
        <Route path='/build/:buildId' component={BuildDetailsPage} />
        <Route path='/' component={MainPage} />
      </Switch>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    loadSettingsAsync: loadSettingsFromServerAsync(dispatch),
  };
};

const AppWithRouter = withRouter(App);

const ConnectedApp = connect(null, mapDispatchToProps)(AppWithRouter);

export { ConnectedApp as App };
