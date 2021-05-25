import React from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import { Form, Formik } from 'formik';
import { Button } from 'react-bootstrap';
import { FormSubmit } from '../../../styled/Forms';
import InputVestingAddress from './inputs/InputVestingAddress';
import InputBalance from './inputs/InputBalance';
import InputDelegateAdmin from './inputs/InputDelegateAdmin';
import InputVestingActivationDate from './inputs/InputVestingActivationDate';
import SelectUnvestingInterval from './inputs/SelectUnvestingInterval';
import InputUnvestedPartsAmount from './inputs/InputUnvestedPartsAmount';
import InputVestingEndDate from './inputs/InputVestingEndDate';
import useBalances from './useBalances';
import useAPI from '../../../../hooks/useApi';
import { handleError } from '../../../../utils/errorsHandler';
import { convertXTZToMutez } from '../../../../utils/helpers';
import { tezosAddressSchema } from '../../../../utils/schemas/tezosAddressSchema';
import balanceSchema from '../../../../utils/schemas/balanceSchema';
import { secondsPerTickSchema } from './createVestingSchemas';
import { sendOrigination } from '../../../../plugins/beacon';
import { unvestingIntervals } from '../../../../utils/constants';

const calcTokensPerTick = (balance, parts) => {
  if (typeof balance !== 'number' || typeof parts !== 'number') return null;
  return convertXTZToMutez(balance) / parts;
};

const schema = (maxAmount, minAmount = 0.000001) =>
  Yup.object({
    vestingAddress: tezosAddressSchema,
    delegateAddress: tezosAddressSchema,
    startDate: Yup.string().required('Required'),
    parts: Yup.number()
      .required('Required')
      .integer('Value must be an integer')
      .min(1, 'Minimum value is 1')
      .max(
        Number.MAX_SAFE_INTEGER,
        `Maximum value is ${Number.MAX_SAFE_INTEGER}`,
      )
      .test(
        'isEndDateValid',
        'Vesting end date is invalid due to this number of parts',
        // eslint-disable-next-line func-names
        function (val) {
          return dayjs
            .unix(this.parent.startDate && dayjs(this.parent.startDate).unix())
            .add(val * this.parent.secondsPerTick, 'second')
            .isValid();
        },
      )
      .test(
        'balanceCheck',
        'Balance cannot be evenly divided by this number of parts',
        // eslint-disable-next-line func-names
        function (val) {
          return Number.isInteger(calcTokensPerTick(this.parent.balance, val));
        },
      ),
    secondsPerTick: secondsPerTickSchema,
    endDate: Yup.string().required('Required'),
    balance: balanceSchema(maxAmount, minAmount),
  });

const CreateVestingFormSimple = ({ onSubmit, onCancel }) => {
  const { getVestingContractCode, initVesting } = useAPI();
  const { balanceInXTZ } = useBalances();

  const createVesting = async (
    {
      vestingAddress,
      delegateAddress,
      startDate,
      secondsPerTick,
      balance,
      parts,
    },
    resetForm,
  ) => {
    try {
      const respCode = await getVestingContractCode();

      const payload = {
        vesting_address: vestingAddress,
        delegate_admin: delegateAddress,
        timestamp: dayjs.utc(startDate).unix().valueOf(),
        seconds_per_tick: secondsPerTick,
        tokens_per_tick: calcTokensPerTick(balance, parts),
      };
      const respStorage = await initVesting(payload);

      const script = { code: respCode.data, storage: respStorage.data };
      await sendOrigination(balance.toString(), script);

      resetForm();
      onSubmit();
    } catch (e) {
      handleError(e);
    }
  };

  return (
    <Formik
      initialValues={{
        vestingAddress: '',
        delegateAddress: '',
        startDate: '',
        parts: '',
        secondsPerTick: unvestingIntervals[0].value,
        endDate: '',
        balance: '',
      }}
      validationSchema={Yup.lazy(() => schema(balanceInXTZ))}
      onSubmit={async (values, { resetForm }) => {
        await createVesting(values, resetForm);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <InputVestingAddress />
          <InputDelegateAdmin />
          <InputVestingActivationDate />
          <InputUnvestedPartsAmount />
          <SelectUnvestingInterval defaultValue={unvestingIntervals[0]} />
          <InputVestingEndDate />
          <InputBalance maxBalance={balanceInXTZ} />

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

CreateVestingFormSimple.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default CreateVestingFormSimple;
