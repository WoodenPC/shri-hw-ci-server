import React, { memo, useState } from 'react';

import { Modal } from 'components/Modal';
import {
  Form,
  FormHeader,
  FormFields,
  FormField,
  FormFooter,
} from 'components/Form';
import { Input } from 'components/Input';
import { Button } from 'components/Button';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

type RunBuildModalProps = {
  visible?: boolean;
  onRunBuild?: (hash: string) => void;
  onCancel?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const RunBuildModal: React.FC<RunBuildModalProps> = memo(
  ({ visible, onRunBuild, onCancel }) => {
    const [hash, setHash] = useState('');

    const onChangeHash = useCallback(
      (event) => {
        setHash(event.target.value);
      },
      [setHash]
    );

    const onSubmit = useCallback(() => {
      if (onRunBuild) {
        onRunBuild(hash);
      }
    }, [hash, onRunBuild]);

    const { t } = useTranslation();

    return (
      <Modal visible={visible}>
        <Form>
          <FormHeader
            title={t('newBuild')}
            description={t('runBuildModal.description')}
          />
          <FormFields>
            <FormField>
              <Input
                id='commitHashField'
                placeholder={t('runBuildModal.commitHash')}
                value={hash}
                onChange={onChangeHash}
              />
            </FormField>
          </FormFields>
          <FormFooter>
            <Button
              text={t('runBuild')}
              color='primary'
              size='big'
              onClick={onSubmit}
            />
            <Button
              text={t('cancel')}
              color='default'
              variant='outlined'
              size='big'
              onClick={onCancel}
            />
          </FormFooter>
        </Form>
      </Modal>
    );
  }
);

RunBuildModal.defaultProps = {
  visible: false,
};

export { RunBuildModal };
