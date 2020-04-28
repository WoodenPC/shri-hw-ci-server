import React from 'react';
import { cn } from '@bem-react/classname';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';

import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { List, ListItem } from 'components/List';
import { Button } from 'components/Button';
import { Icon } from 'components/Icon';
import { Card } from 'components/Card';
import { RunBuildModal } from 'components/RunBuildModal';
import { Spinner } from 'components/Spinner';

import { mapStateToProps, mapDispatchToProps } from './selectors';

const connector = connect(mapStateToProps, mapDispatchToProps);

type BuildHistoryPageProps = ConnectedProps<typeof connector> & RouteComponentProps;

const classes = cn('Page');

class BuildHistoryPage extends React.PureComponent<BuildHistoryPageProps> {
  state = {
    modalVisible: false,
    isLoading: false,
  };

  async componentDidMount() {
    const { builds } = this.props;
    if (builds.length === 0) {
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
      window.scrollTo(0, pageYOffset);
    }
  };

  runBuild = async (commitHash: string) => {
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

  openBuildDetails = ({ buildId }: { buildId: string }) => {
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
            dataTestId='openRunBuildModal'
            text='Run build'
            icon={<Icon type='play' />}
            color='secondary'
            onClick={this.openModal}
          />
          <Button
            dataTestId='goToSettingsPage'
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
                  <ListItem key={id}>
                    <Card
                      id={id}
                      status={status}
                      buildNumber={buildNumber}
                      title={commitMessage}
                      branch={branchName}
                      hash={commitHash}
                      who={authorName}
                      onClick={this.openBuildDetails}
                      start={start}
                      duration={duration}
                    />
                  </ListItem>
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

const PageWithRouter = withRouter(BuildHistoryPage);
const ConnectedPage = connector(PageWithRouter);

export { ConnectedPage as BuildHistoryPage };
