import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { Button } from 'react-bootstrap';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { FormSubmit } from '../../../styled/Forms';
import InputVestingAddress from './inputs/InputVestingAddress';
import InputBalance from './inputs/InputBalance';
import InputDelegateAdmin from './inputs/InputDelegateAdmin';
import InputVestingActivationDate from './inputs/InputVestingActivationDate';
import InputSecondsPerTick from './inputs/InputSecondsPerTick';
import InputXTZPerTick from './inputs/InputXTZPerTick';
import CheckboxExplanation from './inputs/CheckboxExplanation';
import useAPI from '../../../../hooks/useApi';
import useBalances from './useBalances';
import {
  convertXTZToMutez,
  getSecondsFromHHMMSS,
} from '../../../../utils/helpers';
import { handleError } from '../../../../utils/errorsHandler';
import { sendOrigination } from '../../../../plugins/beacon';
import tezosAddressSchema from '../../../../utils/schemas/tezosAddressSchema';
import balanceSchema from '../../../../utils/schemas/balanceSchema';

dayjs.extend(utc);

const schema = (maxAmount = 30000, maxTokensPerTick, minAmount = 0.000001) =>
  Yup.object({
    vestingAddress: tezosAddressSchema,
    delegateAddress: tezosAddressSchema,
    timestamp: Yup.string().required('Required'),
    secondsPerTick: Yup.string()
      .required('Required')
      .test('secondsCheck', 'Seconds cannot be 0', (val) => {
        return val !== '0:00';
      }),
    tokensPerTick: Yup.number()
      .required('Required')
      .max(maxTokensPerTick, `Maximum amount is ${maxTokensPerTick} XTZ`)
      .min(0.000001, `Minimum amount is ${0.000001} XTZ`),
    check: Yup.bool().oneOf([true], 'The terms must be accepted'),
    balance: balanceSchema(maxAmount, minAmount),
  });

const CreateVestingForm = ({ onSubmit, onCancel }) => {
  const { getVestingContractCode, initVesting } = useAPI();
  const [currentTokensPerTick, setCurrentTokensPerTick] = useState(null);
  const { balanceConverted, balanceInXTZ } = useBalances(currentTokensPerTick);

  const createVesting = async (
    {
      vestingAddress,
      delegateAddress,
      timestamp,
      secondsPerTick,
      tokensPerTick,
      balance,
    },
    setSubmitting,
  ) => {
    try {
      const respCode = await getVestingContractCode();

      const payload = {
        vesting_address: vestingAddress,
        delegate_admin: delegateAddress,
        timestamp: dayjs.utc(timestamp).unix().valueOf(),
        seconds_per_tick: getSecondsFromHHMMSS(secondsPerTick),
        tokens_per_tick: Number(convertXTZToMutez(tokensPerTick)),
      };
      const respStorage = await initVesting(payload);

      const script = { code: respCode.data, storage: respStorage.data };
      await sendOrigination(balance.toString(), script);
      onSubmit();
    } catch (e) {
      handleError(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        vestingAddress: '',
        delegateAddress: '',
        timestamp: '',
        secondsPerTick: '',
        tokensPerTick: '',
        check: false,
        balance: '',
      }}
      validationSchema={Yup.lazy((values) =>
        schema(balanceConverted, balanceInXTZ, values.tokensPerTick),
      )}
      onSubmit={(values, { setSubmitting }) => {
        createVesting(values, setSubmitting);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <InputVestingAddress />
          <InputDelegateAdmin />
          <InputVestingActivationDate />
          <InputSecondsPerTick />
          <InputXTZPerTick onChange={setCurrentTokensPerTick} />
          <CheckboxExplanation />
          <InputBalance maxBalance={balanceConverted} />

          <FormSubmit>
            <Button
              variant="danger"
              style={{ marginRight: '10px' }}
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Confirm
            </Button>
          </FormSubmit>
        </Form>
      )}
    </Formik>
  );
};

CreateVestingForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default CreateVestingForm;
