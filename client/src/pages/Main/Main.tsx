import React from 'react';
import { cn } from '@bem-react/classname';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { Header } from 'components/Header';
import { Footer } from 'components/Footer/Footer';
import { Button } from 'components/Button/Button';
import { Icon } from 'components/Icon/Icon';
import { withTranslation, WithTranslation } from 'react-i18next';

const classes = cn('Page');

type MainPageProps = RouteComponentProps & WithTranslation;

class MainPage extends React.PureComponent<MainPageProps> {
  openSettings = () => {
    this.props.history.push('/settings');
  };

  render() {
    const { t } = this.props;
    return (
      <div className={classes()}>
        <Header title={t('header.ciServer')}>
          <Button
            text={t('settings')}
            color='secondary'
            icon={<Icon type='settings' />}
            onClick={this.openSettings}
          />
        </Header>
        <main className={classes('Main')}>
          <div className={classes('CenterLogoContainer')}>
            <Icon type='logo' />
            <p className={classes('CenterLogoContainerText')}>
              {t('mainPage.description')}
            </p>
            <Button
              text={t('mainPage.openSettings')}
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

const PageWithRouter = withRouter(MainPage);
const PageWithTranslation = withTranslation()(PageWithRouter);

export { PageWithTranslation as MainPage };
