import React from 'react';
import { cn } from '@bem-react/classname';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { Button } from 'components/Button';
import { Icon } from 'components/Icon';
import { Card } from 'components/Card';
import { LogDetails } from 'components/LogDetails';
import { Spinner } from 'components/Spinner';

import * as actionCreators from 'store/actionsCreators/buildDetails';

const classes = cn('Page');

class BuildDetailsPage extends React.PureComponent {
  state = {
    isLoading: true,
    id: this.props.location.buildId,
    status: 'waiting',
    buildNumber: 0,
    branchName: '',
    commitMessage: '',
    commitHash: '',
    authorName: '',
    start: undefined,
    duration: 0,
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
        id,
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
    } finally {
      this.setState({ isLoading: false });
    }
  };

  async componentDidMount() {
    await this.loadBuildInfo();
  }

  async componentDidUpdate(prevProps) {
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
            text='Rebuild'
            icon={<Icon type='rebuild' />}
            color='secondary'
            onClick={this.rebuild}
          />
          <Button
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
                status={status && status.toLowerCase()}
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

const mapStateToProps = (store) => {
  const { settings } = store;
  return {
    repoName: settings.repoName,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    runRebuildAsync: actionCreators.runRebuildAsync(dispatch),
    loadBuildDetailsAsync: actionCreators.loadBuildDetailsAsync(dispatch),
    loadBuildLogsAsync: actionCreators.loadBuildLogsAsync(dispatch),
  };
};

const PageWithRouter = withRouter(BuildDetailsPage);
const ConnectedPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(PageWithRouter);

export { ConnectedPage as BuildDetailsPage };
