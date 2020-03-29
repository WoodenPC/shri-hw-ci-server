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
    this.setState({ isLoading: true });
    try {
      await this.props.loadBuildsAsync(offset, limit);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  runBuild = () => {};

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
    this.props.history.push(`/buildDetails/${buildId}`, {
      buildId,
    });
  };

  openSettings = () => {
    this.props.history.push('/settings');
  };

  render() {
    const { builds } = this.props;
    const { modalVisible, isLoading } = this.state;
    return (
      <div className={classes()}>
        <Header title='philip1967/my-awesome-repo' color='black'>
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
  const { builds, offset, limit, buildsLoaded } = store.buildHistory;
  return {
    builds,
    offset,
    limit,
    buildsLoaded,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadBuildsAsync: actionCreators.loadBuildsAsync(dispatch),
  };
};

const PageWithRouter = withRouter(BuildHistoryPage);
const ConnectedPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(PageWithRouter);

export { ConnectedPage as BuildHistoryPage };
