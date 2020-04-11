import React from 'react';
import { cn } from '@bem-react/classname';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { List } from 'components/List';
import { Button } from 'components/Button';
import { Icon } from 'components/Icon';
import { Card } from 'components/Card';
import { RunBuildModal } from 'components/RunBuildModal';
import { Spinner } from 'components/Spinner';

import * as actionCreators from 'store/actionsCreators/buildHistory';

const classes = cn('Page');

class BuildHistoryPage extends React.PureComponent {
  state = {
    modalVisible: false,
    isLoading: false,
  };

  async componentDidMount() {
    const { buildsLoaded } = this.props;
    if (!buildsLoaded) {
      await this.loadMoreBuilds();
    }
  }

  loadMoreBuilds = async () => {
    const { offset, limit } = this.props;
    const pageYOffset = window.pageYOffset;
    this.setState({ isLoading: true });
    try {
      await this.props.loadBuildsAsync(offset, limit);
    } finally {
      this.setState({ isLoading: false });
      console.log(this.state.scrollY);
      window.scrollTo(0, pageYOffset);
    }
  };

  runBuild = async (commitHash) => {
    const { runBuildAsync } = this.props;
    try {
      const result = await runBuildAsync(commitHash);
      if (!result) {
        alert('Cannot create new build. Please check settings');
      }
    } catch (e) {
      console.log(e);
      alert('Cannot create new build. Please check settings');
    } finally {
      this.setState({
        modalVisible: false,
      });
    }
  };

  openModal = () => {
    this.setState({ modalVisible: true });
  };

  cancel = () => {
    this.setState({ modalVisible: false });
  };

  showMoreClick = async () => {
    await this.loadMoreBuilds();
  };

  openBuildDetails = ({ buildId }) => {
    this.props.history.push(`/build/${buildId}`, {
      buildId,
    });
  };

  openSettings = () => {
    this.props.history.push('/settings');
  };

  render() {
    const { builds, repoName } = this.props;
    const { modalVisible, isLoading } = this.state;
    return (
      <div className={classes()}>
        <Header title={repoName} color='black'>
          <Button
            text='Run build'
            icon={<Icon type='play' />}
            color='secondary'
            onClick={this.openModal}
          />
          <Button
            icon={<Icon type='settings' />}
            color='secondary'
            onClick={this.openSettings}
          />
        </Header>
        <main className={classes('Main')}>
          <RunBuildModal
            visible={modalVisible}
            onRunBuild={this.runBuild}
            onCancel={this.cancel}
          />
          <List onShowMore={this.showMoreClick}>
            {isLoading ? (
              <Spinner />
            ) : (
              builds.map(
                ({
                  id,
                  status,
                  buildNumber,
                  branchName,
                  commitMessage,
                  commitHash,
                  authorName,
                  start,
                  duration,
                }) => (
                  <List.Item key={id}>
                    <Card
                      id={id}
                      status={status.toLowerCase()}
                      buildNumber={buildNumber}
                      title={commitMessage}
                      branch={branchName}
                      hash={commitHash}
                      who={authorName}
                      onClick={this.openBuildDetails}
                      start={start}
                      duration={duration}
                    />
                  </List.Item>
                )
              )
            )}
          </List>
        </main>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  const { builds, offset, limit } = store.buildHistory;
  const { repoName } = store.settings;
  return {
    builds,
    offset,
    limit,
    repoName,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadBuildsAsync: actionCreators.loadBuildsAsync(dispatch),
    runBuildAsync: actionCreators.runBuildAsync(dispatch),
  };
};

const PageWithRouter = withRouter(BuildHistoryPage);
const ConnectedPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(PageWithRouter);

export { ConnectedPage as BuildHistoryPage };
