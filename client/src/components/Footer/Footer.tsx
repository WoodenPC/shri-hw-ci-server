import React from 'react';
import { cn } from '@bem-react/classname';
import { useTranslation } from 'react-i18next';

import i18next from 'utils/i18n/i18n';

import { Link } from 'components/Link';

const classes = cn('Footer');

const changeLanguage = (event: React.MouseEvent) => {
  event.preventDefault();
  if (i18next.language === 'ru') {
    i18next.changeLanguage('en');
  } else {
    i18next.changeLanguage('ru');
  }
};

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className={classes()}>
      <div className={classes('Inner')}>
        <div className={classes('Menu')}>
          <Link text={t('footer.support')} classMix={classes('Link')} />
          <Link text={t('footer.learning')} classMix={classes('Link')} />
          <Link
            text={t('footer.language')}
            classMix={classes('Link')}
            onClick={changeLanguage}
          ></Link>
        </div>
        <div className={classes('Author')}>&copy; 2020 Arslanov Rasul</div>
      </div>
    </footer>
  );
};

export { Footer };
