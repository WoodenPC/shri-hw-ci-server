import React from 'react';
import { cn } from '@bem-react/classname';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';

import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { Button } from 'components/Button';
import { Icon } from 'components/Icon';
import { Card } from 'components/Card';
import { LogDetails } from 'components/LogDetails';
import { Spinner } from 'components/Spinner';

import { mapStateToProps, mapDispatchToProps } from './selectors';
import { BuildStatus } from 'interfaces/data.intfs';

const connector = connect(mapStateToProps, mapDispatchToProps);
const classes = cn('Page');

type BuildDetailsProps = ConnectedProps<typeof connector> & RouteComponentProps;

class BuildDetailsPage extends React.PureComponent<BuildDetailsProps> {
  state = {
    isLoading: true,
    id: this.props.location.buildId,
    status: BuildStatus.Waiting,
    buildNumber: 0,
    branchName: '',
    commitMessage: '',
    commitHash: '',
    authorName: '',
    start: '',
    duration: 0,
    logs: '',
  };

  openSettings = () => {
    this.props.history.push('/settings');
  };

  rebuild = async () => {
    const { runRebuildAsync, history } = this.props;
    const {
      id,
      branchName,
      authorName,
      commitMessage,
      commitHash,
    } = this.state;
    try {
      const data = await runRebuildAsync({
        branchName,
        authorName,
        commitMessage,
        commitHash,
      });

      history.push(`/build/${data.id}`, {
        buildId: data.id,
      });
    } catch (e) {
      console.log(e);
    }
  };

  loadBuildInfo = async () => {
    const { match, loadBuildDetailsAsync, loadBuildLogsAsync } = this.props;
    const { params } = match;
    try {
      this.setState({ isLoading: true });
      const detailsPromise = loadBuildDetailsAsync(params.buildId);
      const logsPromise = loadBuildLogsAsync(params.buildId);
      const [details, logs] = await Promise.all([detailsPromise, logsPromise]);
      this.setState({ logs, ...details });
    } catch (e) {
      console.log('error', e);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  async componentDidMount() {
    await this.loadBuildInfo();
  }

  async componentDidUpdate(prevProps: BuildDetailsProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      await this.loadBuildInfo();
    }
  }

  render() {
    const { repoName } = this.props;
    const {
      id,
      status,
      buildNumber,
      branchName,
      commitMessage,
      commitHash,
      authorName,
      start,
      duration,
      isLoading,
      logs,
    } = this.state;
    return (
      <div className={classes()}>
        <Header title={repoName} color='black'>
          <Button
            dataTestId='rebuildCurrent'
            text='Rebuild'
            icon={<Icon type='rebuild' />}
            color='secondary'
            onClick={this.rebuild}
          />
          <Button
            dataTestId='goToSettingsPage'
            icon={<Icon type='settings' />}
            color='secondary'
            onClick={this.openSettings}
          />
        </Header>
        <main className={classes('Main')}>
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              <Card
                id={id}
                status={status}
                buildNumber={buildNumber}
                title={commitMessage}
                branch={branchName}
                hash={commitHash}
                who={authorName}
                start={start}
                duration={duration}
              />
              <LogDetails log={logs} />
            </>
          )}
        </main>
        <Footer />
      </div>
    );
  }
}

const PageWithRouter = withRouter(BuildDetailsPage);
const ConnectedPage = connector(PageWithRouter);

export { ConnectedPage as BuildDetailsPage };
