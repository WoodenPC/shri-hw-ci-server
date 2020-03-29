import React from 'react';
import { cn } from '@bem-react/classname';
import { withRouter } from 'react-router-dom';

import { Header } from 'components/Header';
import { Footer } from 'components/Footer';
import { Button } from 'components/Button';
import { Icon } from 'components/Icon';
import { Card } from 'components/Card';
import { LogDetails } from 'components/LogDetails';
import { Modal } from 'components/Modal';
import { Form } from 'components/Form';
import { Input } from 'components/Input';

const classes = cn('Page');

class BuildDetailsPage extends React.PureComponent {
  state = {
    modalVisible: false,
  };

  openSettings = () => {
    this.props.history.push('/settings');
  };

  openRebuildModal = () => {
    this.setState({
      modalVisible: true,
    });
  };

  runBuild = () => {
    // todo
    this.setState({ modalVisible: false });
  };

  cancel = () => {
    this.setState({ modalVisible: false });
  };

  render() {
    const { modalVisible } = this.state;
    return (
      <div className={classes()}>
        <Header title='philip1967/my-awesome-repo' color='black'>
          <Button
            text='Rebuild'
            icon={<Icon type='rebuild' />}
            color='secondary'
            onClick={this.openRebuildModal}
          />
          <Button
            icon={<Icon type='settings' />}
            color='secondary'
            onClick={this.openSettings}
          />
        </Header>
        <main className={classes('Main')}>
          <Modal visible={modalVisible}>
            <Form>
              <Form.Header
                title='New build'
                description='Enter the commit hash which you want to build.'
              />
              <Form.Fields>
                <Form.Field>
                  <Input placeholder='Commit hash' />
                </Form.Field>
              </Form.Fields>
              <Form.Footer>
                <Button
                  text='Run build'
                  color='primary'
                  size='big'
                  onClick={this.runBuild}
                />
                <Button
                  text='Cancel'
                  color='default'
                  variant='outlined'
                  size='big'
                  onClick={this.cancel}
                />
              </Form.Footer>
            </Form>
          </Modal>
          <Card
            status='fail'
            commitNumber={1368}
            title='add documentation for postgres scaler'
            branch='master'
            hash='9c9f0b9'
            who='Philip Kirkorov'
            time={{
              startTime: '21 янв, 03:06',
              duration: '1 ч 20 мин',
            }}
          />
          <LogDetails log='some log' />
        </main>
        <Footer />
      </div>
    );
  }
}

const BuildDetailsPageWithRouter = withRouter(BuildDetailsPage);

export { BuildDetailsPageWithRouter as BuildDetailsPage };
