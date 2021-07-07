import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button } from 'react-bootstrap';
import Card from '../../../styled/Card';
import { Bold, PreCode } from '../../../styled/Text';
import { FormSubmit } from '../../../styled/Forms';
import { sendOrigination } from '../../../../plugins/beacon';
import { handleError } from '../../../../utils/errorsHandler';
import { BtnTransparent } from '../../../styled/Btns';
import { dateFormat, unvestingIntervals } from '../../../../utils/constants';
import { toHHMMSS } from '../../../../utils/helpers';

const copy = () => toast.success('Payload copied!');

const CreateVestingConfirm = ({
  script,
  formData,
  isFormAdvanced,
  onSubmit,
  onBack,
}) => {
  const code = useMemo(() => {
    if (!script) return '';
    return JSON.stringify(script, null, 2);
  }, [script]);

  const createVesting = async () => {
    const { delegate, balance } = formData;

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
      <div>
        <BtnTransparent style={{ marginBottom: '10px' }} onClick={onBack}>
          Back
        </BtnTransparent>
      </div>

      <div>
        <Bold>Summary:</Bold>
        <ul>
          <li>Withdrawal address: {formData.vestingAddress}</li>
          <li>Delegate admin address: {formData.delegateAddress}</li>
          <li>Delegate address: {formData.delegate}</li>
          <li>
            Vesting activation date:{' '}
            {dayjs(formData.startDate).format(dateFormat)}
          </li>
          {isFormAdvanced ? (
            <>
              <li>Time per tick: {toHHMMSS(formData.secondsPerTick)}</li>
              <li>XTZ per tick: {`${formData.tokensPerTick} XTZ`}</li>
            </>
          ) : (
            <>
              <li>Number of unvested parts: {formData.parts}</li>
              <li>
                Unvesting interval:{' '}
                {
                  unvestingIntervals.find(
                    (item) => item.value === formData.secondsPerTick,
                  ).label
                }
              </li>
              <li>
                Vesting end date: {dayjs(formData.endDate).format(dateFormat)}
              </li>
            </>
          )}
          <li>Balance: {`${formData.balance} XTZ`}</li>
          <li>Vesting contract name: {formData.name} </li>
        </ul>
      </div>

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
  script: PropTypes.shape({
    code: PropTypes.arrayOf(PropTypes.object),
    storage: PropTypes.objectOf(PropTypes.any),
  }).isRequired,
  formData: PropTypes.objectOf(PropTypes.any).isRequired,
  isFormAdvanced: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default CreateVestingConfirm;
