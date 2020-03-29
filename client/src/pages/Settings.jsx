import React from 'react';
import { cn } from '@bem-react/classname';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { Header } from 'components/Header/Header';
import { Footer } from 'components/Footer/Footer';
import { Button } from 'components/Button/Button';
import { Form } from 'components/Form/Form';
import { Input } from 'components/Input/Input';

import { setSettings } from 'store/actionsCreators/settings';

const classes = cn('Page');

class SettingsPage extends React.PureComponent {
  state = {
    repoName: '',
    buildCommand: '',
    mainBranch: '',
    period: 10,
    isLoading: false,
  };

  changeRepoName = (event) => {
    this.setState({ repoName: event.target.value });
  };

  changeBuildCommand = (event) => {
    this.setState({ buildCommand: event.target.value });
  };

  changeMainBranch = (event) => {
    this.setState({ mainBranch: event.target.value });
  };

  changePeriod = (event) => {
    this.setState({ period: event.target.value });
  };

  componentDidMount() {}

  saveSettings = () => {
    this.setState({ isLoading: true });
    try {
      // TODO
      this.props.history.push('/buildHistory');
    } finally {
      this.setState({ isLoading: false });
    }
  };

  cancel = () => {
    this.props.history.goBack();
  };

  render() {
    const {
      repoName,
      buildCommand,
      mainBranch,
      period,
      isLoading,
    } = this.state;
    return (
      <div className={classes()}>
        <Header title='Scool CI server' />
        <main className={classes('Main')}>
          <Form>
            <Form.Header
              title='Settings'
              description='Configure repository connection and synchronization settings.'
            />
            <Form.Fields>
              <Form.Field name='repository' label='GitHub repository' required>
                <Input
                  placeholder='user-name/repo-name'
                  value={repoName}
                  onChange={this.changeRepoName}
                />
              </Form.Field>
              <Form.Field name='command' label='Build command' required>
                <Input
                  placeholder='npm ci && npm run build'
                  value={buildCommand}
                  onChange={this.changeBuildCommand}
                />
              </Form.Field>
              <Form.Field name='mainBranch' label='Main branch'>
                <Input
                  placeholder='master'
                  value={mainBranch}
                  onChange={this.changeMainBranch}
                />
              </Form.Field>
              <Form.Field
                name='timing'
                label='Synchronize every'
                suffix='minutes'
                row
              >
                <Input
                  value={period}
                  onChange={this.changePeriod}
                  type='number'
                  short
                />
              </Form.Field>
            </Form.Fields>
            <Form.Footer>
              <Button
                text='Save'
                color='primary'
                size='big'
                onClick={this.saveSettings}
                disabled={isLoading}
              />
              <Button
                text='Cancel'
                color='secondary'
                size='big'
                onClick={this.cancel}
                disabled={isLoading}
              />
            </Form.Footer>
          </Form>
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
    setSettings: (settings) => dispatch(setSettings(settings)),
  };
};

const SettingsPageWithRouter = withRouter(SettingsPage);
const ConnectedSettingPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsPageWithRouter);

export { ConnectedSettingPage as SettingsPage };
