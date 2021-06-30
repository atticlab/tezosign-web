import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button } from 'react-bootstrap';
import Card from '../../../styled/Card';
import { Bold, PreCode } from '../../../styled/Text';
import { FormSubmit } from '../../../styled/Forms';
import { sendOrigination } from '../../../../plugins/beacon';
import { handleError } from '../../../../utils/errorsHandler';

const copy = () => toast.success('Payload copied!');

const CreateVestingConfirm = ({ script, balance, delegate, onSubmit }) => {
  const code = useMemo(() => {
    if (!script) return '';
    return JSON.stringify(script, null, 2);
  }, [script]);

  const createVesting = async () => {
    try {
      const resp = await sendOrigination(
        balance ? balance.toString() : 0,
        script,
        delegate,
      );

      onSubmit(resp.transactionHash);
    } catch (e) {
      handleError(e);
    }
  };

  return (
    <div>
      <Bold>Code:</Bold>
      <Card>
        <Card.Body style={{ padding: '2px 5px', overflow: 'auto' }}>
          <PreCode>{code}</PreCode>
        </Card.Body>
      </Card>

      <FormSubmit>
        <CopyToClipboard text={code}>
          <Button style={{ marginRight: '10px' }} onClick={copy}>
            Copy code
          </Button>
        </CopyToClipboard>
        <Button onClick={createVesting}>Confirm</Button>
      </FormSubmit>
    </div>
  );
};

CreateVestingConfirm.propTypes = {
  script: PropTypes.objectOf(
    PropTypes.shape({
      code: PropTypes.arrayOf(PropTypes.object),
      storage: PropTypes.objectOf(PropTypes.any),
    }),
  ).isRequired,
  balance: PropTypes.number.isRequired,
  delegate: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default CreateVestingConfirm;
