import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { loadSettingsFromServerAsync } from 'store/actionsCreators/settings';

import {
  BuildDetailsPage,
  BuildHistoryPage,
  SettingsPage,
  MainPage,
} from './pages';

class App extends React.PureComponent {
  async componentDidMount() {
    const { loadSettingsAsync, history, settings } = this.props;
    console.log(settings.isLoaded);
    if (!settings.isLoaded && !(await loadSettingsAsync())) {
      history.push('/settings');
    } else {
      history.push('/buildHistory');
    }
  }
  render() {
    return (
      <Switch>
        <Route path='/settings' component={SettingsPage} />
        <Route path='/buildHistory' component={BuildHistoryPage} />
        <Route path='/buildDetails/:buildId' component={BuildDetailsPage} />
        <Route path='/' component={MainPage} />
      </Switch>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    settings: store.settings,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadSettingsAsync: loadSettingsFromServerAsync(dispatch),
  };
};

const AppWithRouter = withRouter(App);

const ConnectedApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppWithRouter);

export { ConnectedApp as App };
