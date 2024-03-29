import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Form as BForm } from 'react-bootstrap';
import FormLabelWithTooltip from '../../../FormLabelWithTooltip';
import VestingsSelect from './VestingsSelect';
import { FormLabel, FormSubmit } from '../../../styled/Forms';
import { useContractStateContext } from '../../../../store/contractContext';
import { useOperationsDispatchContext } from '../../../../store/operationsContext';
import useAPI from '../../../../hooks/useApi';
import useRequest from '../../../../hooks/useRequest';
import { handleError } from '../../../../utils/errorsHandler';
import { bs58Validation, convertMutezToXTZ } from '../../../../utils/helpers';

const schema = Yup.object({
  vestingAddress: Yup.string()
    .required('Required')
    .matches('KT1', 'Tezos contract address must start with KT1')
    .matches(/^\S+$/, 'No spaces are allowed')
    .matches(/^[a-km-zA-HJ-NP-Z1-9]+$/, 'Invalid Tezos address')
    .length(36, 'Tezos address must be 36 characters long')
    .test('bs58check', 'Invalid checksum', (val) => bs58Validation(val)),
  batches: Yup.number()
    .required('Required')
    .integer('Ticks must be an integer')
    .min(1, `Minimum number of batches is 1`),
});

const CreateVestingVest = ({ onCreate, onCancel }) => {
  const { createOperation, getVestingInfo } = useAPI();
  const { contractAddress } = useContractStateContext();
  const { setOps } = useOperationsDispatchContext();
  const {
    request: loadVestingInfo,
    resp: vestingInfo,
    isLoading: isVestingInfoLoading,
  } = useRequest(getVestingInfo);

  const tokensPerTick = useMemo(() => {
    return vestingInfo?.storage.tokens_per_tick || 0;
  }, [vestingInfo]);

  const tokensPerTickInXTZ = useMemo(() => {
    return convertMutezToXTZ(tokensPerTick);
  }, [tokensPerTick]);

  const createVestingVest = async ({ vestingAddress, batches }, resetForm) => {
    try {
      const resp = await createOperation({
        contract_id: contractAddress,
        type: 'vesting_vest',
        vesting_id: vestingAddress,
        ticks: batches,
      });

      await setOps((prev) => {
        return [resp.data, ...prev];
      });

      resetForm();
      onCreate();
    } catch (e) {
      handleError(e);
    }
  };

  return (
    <Formik
      initialValues={{
        vestingAddress: '',
        batches: '',
        amount: '',
      }}
      validationSchema={schema}
      onSubmit={async (values, { resetForm }) => {
        await createVestingVest(values, resetForm);
      }}
    >
      {({
        values,
        errors,
        touched,
        isSubmitting,
        setFieldValue,
        setFieldTouched,
        handleBlur,
      }) => (
        <Form>
          <BForm.Group controlId="vestingAddress">
            <FormLabel>Vesting address</FormLabel>
            <VestingsSelect
              isTouched={Boolean(touched.vestingAddress)}
              isInvalid={Boolean(
                !!errors.vestingAddress && touched.vestingAddress,
              )}
              isValid={Boolean(
                !errors.vestingAddress && touched.vestingAddress,
              )}
              onChange={async (value) => {
                setFieldValue('vestingAddress', value.value);
                await loadVestingInfo(value.value);
                setFieldTouched('vestingAddress', true);
              }}
              onBlur={() => {
                setFieldTouched('vestingAddress', true);
              }}
            />
            <ErrorMessage
              component={BForm.Control.Feedback}
              name="vestingAddress"
              type="invalid"
            />
          </BForm.Group>

          <BForm.Group controlId="batches">
            <FormLabelWithTooltip
              labelTxt="Ticks"
              tooltipTxt='Single unlock iteration of a certain amount of XTZ. The period
                  is defined by "Time per tick", the amount of XTZ is
                  defined by "XTZ per tick".'
            />

            <Field
              as={BForm.Control}
              type="number"
              name="batches"
              aria-label="batches"
              min="0"
              autoComplete="off"
              isInvalid={!!errors.batches && touched.batches}
              isValid={!errors.batches && touched.batches}
              disabled={
                isVestingInfoLoading || !values.vestingAddress || !tokensPerTick
              }
              onBlur={(e) => {
                handleBlur(e);
                setFieldValue(
                  'amount',
                  convertMutezToXTZ(values.batches * tokensPerTick),
                );
                setFieldTouched('amount', true, false);
              }}
            />

            <ErrorMessage
              component={BForm.Control.Feedback}
              name="batches"
              type="invalid"
            />
          </BForm.Group>

          <BForm.Group controlId="amount">
            <FormLabelWithTooltip
              labelTxt="Amount"
              tooltipTxt='Withdrawal amount. It must be evenly divided by "XTZ per
                  tick", so that ticks are always an integer. The minimum
                  equals "XTZ per tick". Usually, the maximum equals
                  the withdrawal limit. In case the withdrawal limit is greater
                  than the balance on the vesting contract, the allowed maximum
                  is the closest to the balance number which is evenly divided
                  by "XTZ per tick".'
            />

            <Field
              as={BForm.Control}
              type="number"
              name="amount"
              aria-label="amount"
              step={tokensPerTickInXTZ}
              min={tokensPerTickInXTZ}
              autoComplete="off"
              isInvalid={!!errors.amount && touched.amount}
              isValid={!errors.amount && touched.amount}
              disabled
            />

            <ErrorMessage
              component={BForm.Control.Feedback}
              name="amount"
              type="invalid"
            />
          </BForm.Group>

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

CreateVestingVest.propTypes = {
  onCreate: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default CreateVestingVest;
