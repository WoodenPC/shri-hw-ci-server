import React from 'react';
import { Switch, Route, withRouter, RouteComponentProps } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { Dispatch } from 'redux';

import './scss/main.scss';

import { loadSettingsFromServerAsync } from 'store/actionsCreators/settings';

import {
  BuildDetailsPage,
  BuildHistoryPage,
  SettingsPage,
  MainPage,
} from './pages';

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    loadSettingsAsync: loadSettingsFromServerAsync(dispatch),
  };
};

const connector = connect(null, mapDispatchToProps);

type AppProps = ConnectedProps<typeof connector> & RouteComponentProps;

class App extends React.PureComponent<AppProps> {
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

const AppWithRouter = withRouter(App);

const ConnectedApp = connector(AppWithRouter);

export { ConnectedApp as App };
