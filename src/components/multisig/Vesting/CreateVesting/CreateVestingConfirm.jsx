import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';
import Card from '../../../styled/Card';
import { Bold, PreCode } from '../../../styled/Text';
import { FormSubmit } from '../../../styled/Forms';
import { sendOrigination } from '../../../../plugins/beacon';
import { handleError } from '../../../../utils/errorsHandler';
import { BtnTransparent } from '../../../styled/Btns';
import { dateFormat, unvestingIntervals } from '../../../../utils/constants';

const Ul = styled.ul`
  padding: 0;
  list-style-type: none;
`;

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
        <Ul>
          <li>
            {' '}
            <Bold>Withdrawal address: </Bold>
            {formData.vestingAddress}
          </li>
          <li>
            {' '}
            <Bold>Delegate admin address:</Bold> {formData.delegateAddress}
          </li>
          <li>
            {' '}
            <Bold>Delegate address: </Bold>
            {formData.delegate}
          </li>
          <li>
            <Bold>Vesting activation date:</Bold>{' '}
            {dayjs(formData.startDate).format(dateFormat)}
          </li>
          {isFormAdvanced ? (
            <>
              <li>
                <Bold>Time per tick:</Bold> {formData.secondsPerTick}
              </li>
              <li>
                <Bold>XTZ per tick:</Bold> {`${formData.tokensPerTick} XTZ`}
              </li>
            </>
          ) : (
            <>
              <li>
                <Bold>Number of unvested parts:</Bold> {formData.parts}
              </li>
              <li>
                <Bold>Unvesting interval: </Bold>
                {
                  unvestingIntervals.find(
                    (item) => item.value === formData.secondsPerTick,
                  ).label
                }
              </li>
              <li>
                <Bold>Vesting end date:</Bold>{' '}
                {dayjs(formData.endDate).format(dateFormat)}
              </li>
            </>
          )}
          <li>
            <Bold>Balance:</Bold> {`${formData.balance} XTZ`}
          </li>
          <li>
            <Bold>Vesting contract name:</Bold> {formData.name}{' '}
          </li>
        </Ul>
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
