import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  Form as BForm,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import VestingsSelect from './VestingsSelect';
import { FormLabel, FormSubmit } from '../../../styled/Forms';
import { useContractStateContext } from '../../../../store/contractContext';
import { useOperationsDispatchContext } from '../../../../store/operationsContext';
import useAPI from '../../../../hooks/useApi';
import useRequest from '../../../../hooks/useRequest';
import { handleError } from '../../../../utils/errorsHandler';
import {
  bs58Validation,
  limitInputDecimals,
  convertMutezToXTZ,
  convertXTZToMutez,
} from '../../../../utils/helpers';

const schema = (minAmount = 0.000001) =>
  Yup.object({
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
    amount: Yup.number()
      .required('Required')
      .min(minAmount, `Minimum amount is ${minAmount} XTZ`),
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
      validationSchema={Yup.lazy(() => schema(tokensPerTickInXTZ))}
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
            <OverlayTrigger
              overlay={
                <Tooltip>
                  Single unlock iteration of a certain amount of XTZ. The period
                  is defined by &quot;Seconds per tick&quot;, the amount of XTZ
                  is defined by &quot;XTZ per tick&quot;.
                </Tooltip>
              }
            >
              <FormLabel>Ticks</FormLabel>
            </OverlayTrigger>
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
            <OverlayTrigger
              overlay={
                <Tooltip>
                  Withdrawal amount. It must be evenly divided by &quot;XTZ per
                  tick&quot;, so that ticks are always an integer. The minimum
                  equals &quot;XTZ per tick&quot;. Usually, the maximum equals
                  the withdrawal limit. In case the withdrawal limit is greater
                  than the balance on the vesting contract, the allowed maximum
                  is the closest to the balance number which is evenly divided
                  by &quot;XTZ per tick&quot;.
                </Tooltip>
              }
            >
              <FormLabel>Amount</FormLabel>
            </OverlayTrigger>

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
              disabled={
                isVestingInfoLoading || !values.vestingAddress || !tokensPerTick
              }
              onKeyPress={(event) => limitInputDecimals(event, 6)}
              onBlur={(e) => {
                handleBlur(e);
                setFieldValue(
                  'batches',
                  convertXTZToMutez(values.amount) / tokensPerTick,
                );
                setFieldTouched('batches', true, false);
              }}
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
