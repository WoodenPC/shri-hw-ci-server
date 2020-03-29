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
    isLoading: false,
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
      const newId = await runRebuildAsync({
        id,
        branchName,
        authorName,
        commitMessage,
        commitHash,
      });

      history.replace(`/buildDetails/${newId}`, {
        buildId: newId,
      });
    } finally {
      this.setState({ modalVisible: false });
    }
  };

  async componentDidMount() {
    const { location, loadBuildDetailsAsync, loadBuildLogsAsync } = this.props;
    const { state } = location;
    console.log(state);
    try {
      const detailsPromise = loadBuildDetailsAsync(state.buildId);
      const logsPromise = loadBuildLogsAsync(state.buildId);
      const [details, logs] = await Promise.all([detailsPromise, logsPromise]);
      this.setState({ logs, ...details });
    } finally {
      this.setState({ isLoading: true });
    }
  }

  render() {
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
        <Header title='philip1967/my-awesome-repo' color='black'>
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
          ) : (
            <Spinner />
          )}
        </main>
        <Footer />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    runRebuildAsync: actionCreators.runRebuildAsync(dispatch),
    loadBuildDetailsAsync: actionCreators.loadBuildDetailsAsync(dispatch),
    loadBuildLogsAsync: actionCreators.loadBuildLogsAsync(dispatch),
  };
};

const PageWithRouter = withRouter(BuildDetailsPage);
const ConnectedPage = connect(null, mapDispatchToProps)(PageWithRouter);

export { ConnectedPage as BuildDetailsPage };
