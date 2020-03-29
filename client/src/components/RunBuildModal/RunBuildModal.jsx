import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';

import { Modal } from 'components/Modal';
import { Form } from 'components/Form';
import { Input } from 'components/Input';
import { Button } from 'components/Button';

const RunBuildModal = memo(({ visible, onRunBuild, onCancel }) => {
  const [hash, setHash] = useState('');

  const onChangeHash = (event) => {
    setHash(event.target.value);
  };

  const onSubmit = () => {
    if (onRunBuild) {
      onRunBuild(hash);
    }
  };

  return (
    <Modal visible={visible}>
      <Form>
        <Form.Header
          title='New build'
          description='Enter the commit hash which you want to build.'
        />
        <Form.Fields>
          <Form.Field>
            <Input
              placeholder='Commit hash'
              value={hash}
              onChange={onChangeHash}
            />
          </Form.Field>
        </Form.Fields>
        <Form.Footer>
          <Button
            text='Run build'
            color='primary'
            size='big'
            onClick={onSubmit}
          />
          <Button
            text='Cancel'
            color='default'
            variant='outlined'
            size='big'
            onClick={onCancel}
          />
        </Form.Footer>
      </Form>
    </Modal>
  );
});

RunBuildModal.propTypes = {
  visible: PropTypes.bool,
  onRunBuild: PropTypes.func,
  onCancel: PropTypes.func,
};

RunBuildModal.defaultProps = {
  visible: false,
  onRunBuild: undefined,
  onCancel: undefined,
};

export { RunBuildModal };
