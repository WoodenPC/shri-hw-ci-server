import React from 'react';
import { cn } from '@bem-react/classname';
import { useTranslation } from 'react-i18next';

import { Link } from 'components/Link';

const classes = cn('Footer');

const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();
  console.log(i18n.language);
  return (
    <footer className={classes()}>
      <div className={classes('Inner')}>
        <div className={classes('Menu')}>
          <Link text={t('footer.support')} classMix={classes('Link')} />
          <Link text={t('footer.learning')} classMix={classes('Link')} />
          <Link text={t('footer.language')} classMix={classes('Link')}></Link>
        </div>
        <div className={classes('Author')}>&copy; 2020 Arslanov Rasul</div>
      </div>
    </footer>
  );
};

export { Footer };
