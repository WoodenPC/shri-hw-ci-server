import React from 'react';
import { cn } from '@bem-react/classname';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';

import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { Button } from 'components/Button';
import {
  Form,
  FormHeader,
  FormFields,
  FormField,
  FormFooter,
} from 'components/Form';
import { Input } from 'components/Input';

import { mapStateToProps, mapDispatchToProps } from './selectors';
import { withTranslation, WithTranslation } from 'react-i18next';

const connector = connect(mapStateToProps, mapDispatchToProps);

type SettingsPageProps = ConnectedProps<typeof connector> &
  RouteComponentProps &
  WithTranslation;

const classes = cn('Page');

class SettingsPage extends React.PureComponent<SettingsPageProps> {
  state = {
    repoName: '',
    buildCommand: '',
    mainBranch: '',
    period: 10,
    isLoading: false,
  };

  componentDidUpdate(prevProps: SettingsPageProps) {
    if (prevProps.settings !== this.props.settings) {
      this.getSettingsFromStore();
    }
  }

  changeRepoName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ repoName: event.target.value });
  };

  changeBuildCommand = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ buildCommand: event.target.value });
  };

  changeMainBranch = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ mainBranch: event.target.value });
  };

  changePeriod = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ period: +event.target.value });
  };

  getSettingsFromStore = () => {
    const { settings } = this.props;
    this.setState({
      repoName: settings.repoName,
      buildCommand: settings.buildCommand,
      mainBranch: settings.mainBranch,
      period: settings.period,
    });
  };

  componentDidMount() {
    this.getSettingsFromStore();
  }

  saveSettings = async () => {
    const { saveSettingsAsync, history, deleteBuildsHistory } = this.props;
    const { repoName, buildCommand, mainBranch, period } = this.state;
    this.setState({ isLoading: true });
    try {
      if (repoName === '' || buildCommand === '') {
        alert('Please fill requird fields');
        return;
      }

      if (period <= 0) {
        alert('Period must be greater than zeor');
        return;
      }

      let branch = mainBranch === '' ? 'master' : mainBranch;

      deleteBuildsHistory();
      const res = await saveSettingsAsync({
        repoName,
        buildCommand,
        mainBranch: branch,
        period,
      });
      if (!res) {
        alert('Cannot save settings');
        return;
      }
      // очищаем текущую историю билдов
      history.push('/buildHistory');
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
    const { t } = this.props;
    return (
      <div className={classes()}>
        <Header title={t('header.ciServer')} />
        <main className={classes('Main')}>
          <Form>
            <FormHeader
              title={t('settings')}
              description={t('mainPage.description')}
            />
            <FormFields>
              <FormField
                name='repository'
                label={t('settingsPage.githubRepo')}
                required
              >
                <Input
                  id='repoField'
                  placeholder='user-name/repo-name'
                  value={repoName}
                  onChange={this.changeRepoName}
                />
              </FormField>
              <FormField
                name='command'
                label={t('settingsPage.buildCommand')}
                required
              >
                <Input
                  id='commandField'
                  placeholder='npm ci && npm run build'
                  value={buildCommand}
                  onChange={this.changeBuildCommand}
                />
              </FormField>
              <FormField name='mainBranch' label={t('settingsPage.mainBranch')}>
                <Input
                  id='branchField'
                  placeholder='master'
                  value={mainBranch}
                  onChange={this.changeMainBranch}
                />
              </FormField>
              <FormField
                name='timing'
                label={t('settingsPage.syncEvery')}
                suffix={t('settingsPage.minutes')}
                row
              >
                <Input
                  id='periodField'
                  value={period}
                  onChange={this.changePeriod}
                  type='number'
                  placeholder='timing'
                  short
                />
              </FormField>
            </FormFields>
            <FormFooter>
              <Button
                text={t('save')}
                color='primary'
                size='big'
                onClick={this.saveSettings}
                disabled={isLoading}
              />
              <Button
                text={t('cancel')}
                color='secondary'
                size='big'
                onClick={this.cancel}
                disabled={isLoading}
              />
            </FormFooter>
          </Form>
        </main>
        <Footer />
      </div>
    );
  }
}

const PageWithTranslation = withTranslation()(SettingsPage);
const PageWithRouter = withRouter(PageWithTranslation);
const ConnectedPage = connector(PageWithRouter);

export { ConnectedPage as SettingsPage };
