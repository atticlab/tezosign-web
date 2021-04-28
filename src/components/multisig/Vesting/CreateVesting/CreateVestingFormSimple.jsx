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
import InputDateRange from './inputs/InputDateRange';
import InputUnvestedPartsAmount from './inputs/InputUnvestedPartsAmount';
import useBalances from './useBalances';
import useAPI from '../../../../hooks/useApi';
import { handleError } from '../../../../utils/errorsHandler';
import tezosAddressSchema from '../../../../utils/schemas/tezosAddressSchema';
import balanceSchema from '../../../../utils/schemas/balanceSchema';
import { convertXTZToMutez } from '../../../../utils/helpers';

const calcSecondsPerTick = (rangeStart, rangeEnd, parts) => {
  const start = dayjs(rangeStart).unix();
  const end = dayjs(rangeEnd).unix();
  return (end - start) / parts;
};
const calcTokensPerTick = (balance, parts) => {
  return convertXTZToMutez(balance) / parts;
};

const schema = (maxAmount, minAmount = 0.000001) =>
  Yup.object({
    vestingAddress: tezosAddressSchema,
    delegateAddress: tezosAddressSchema,
    balance: balanceSchema(maxAmount, minAmount),
    startDate: Yup.string().required('Required'),
    endDate: Yup.string().required('Required'),
    parts: Yup.number()
      .required('Required')
      .integer('Value must be an integer')
      .min(1, 'Minimum value is 1')
      .max(
        Number.MAX_SAFE_INTEGER,
        `Maximum value is ${Number.MAX_SAFE_INTEGER}`,
      )
      .test(
        'balanceCheck',
        'Balance cannot be evenly divided by this number of parts',
        // eslint-disable-next-line func-names
        function (val) {
          return Number.isInteger(calcTokensPerTick(this.parent.balance, val));
        },
      )
      .test(
        'secondsCheck',
        'Vesting period cannot be evenly divided by this number of parts',
        // eslint-disable-next-line func-names
        function (val) {
          return Number.isInteger(
            calcSecondsPerTick(this.parent.startDate, this.parent.endDate, val),
          );
        },
      ),
  });

const CreateVestingFormSimple = ({ onSubmit, onCancel }) => {
  const { getVestingContractCode, initVesting } = useAPI();
  const { balanceInXTZ } = useBalances();

  const createVesting = async (fields, setSubmitting) => {
    try {
      setSubmitting(true);
      // eslint-disable-next-line no-unused-vars
      const respCode = await getVestingContractCode();
      await initVesting();
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
        startDate: '',
        endDate: '',
        balance: '',
        parts: '',
      }}
      validationSchema={Yup.lazy(() => schema(balanceInXTZ))}
      onSubmit={(values, { setSubmitting }) => {
        createVesting(values, setSubmitting);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <InputVestingAddress />
          <InputDelegateAdmin />
          <InputBalance maxBalance={balanceInXTZ} />
          <InputDateRange />
          <InputUnvestedPartsAmount />

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
