import React from 'react';
import { cn } from '@bem-react/classname';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { loadSettingsFromServerAsync } from 'store/actionsCreators/settings';

import { Header } from 'components/Header';
import { Footer } from 'components/Footer/Footer';
import { Button } from 'components/Button/Button';
import { Icon } from 'components/Icon/Icon';

const classes = cn('Page');

class MainPage extends React.PureComponent {
  openSettings = () => {
    console.log('openSettings');
    this.props.history.push('/settings');
  };

  async componentDidMount() {
    const { loadSettingsAsync, history, settings } = this.props;
    console.log(settings.isLoaded);
    if (!settings.isLoaded && (await loadSettingsAsync())) {
      history.push('/settings');
    }
  }

  render() {
    return (
      <div className={classes()}>
        <Header title='School CI server'>
          <Button
            text='Settings'
            color='secondary'
            icon={<Icon type='settings' />}
            onClick={this.openSettings}
          />
        </Header>
        <main className={classes('Main')}>
          <div className={classes('CenterLogoContainer')}>
            <Icon type='logo' />
            <p className={classes('CenterLogoContainerText')}>
              Configure repository connection and synchronization settings
            </p>
            <Button
              text='Open settings'
              color='primary'
              onClick={this.openSettings}
            />
          </div>
        </main>
        <Footer />
      </div>
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

const MainPageWithRouter = withRouter(MainPage);
const ConnectedMainPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(MainPageWithRouter);

export { ConnectedMainPage as MainPage };
