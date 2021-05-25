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
import { bs58Validation } from '../../../../utils/helpers';
import useAPI from '../../../../hooks/useApi';
import { handleError } from '../../../../utils/errorsHandler';
import { useOperationsDispatchContext } from '../../../../store/operationsContext';
import useRequest from '../../../../hooks/useRequest';

const schema = (isWalletDelegateAdmin) =>
  Yup.object({
    vestingAddress: Yup.string()
      .required('Required')
      .matches('KT1', 'Tezos contract address must start with KT1')
      .matches(/^\S+$/, 'No spaces are allowed')
      .matches(/^[a-km-zA-HJ-NP-Z1-9]+$/, 'Invalid Tezos address')
      .length(36, 'Tezos address must be 36 characters long')
      .test('bs58check', 'Invalid checksum', (val) => bs58Validation(val)),
    to: Yup.string()
      .required(
        `This field cannot be empty. If you want to undelegate, click the button 'Undelegate'.`,
      )
      .matches('tz1|tz2|tz3', 'Tezos address must start with tz1, tz2, tz3')
      .matches(/^\S+$/, 'No spaces are allowed')
      .matches(/^[a-km-zA-HJ-NP-Z1-9]+$/, 'Invalid Tezos address')
      .length(36, 'Tezos address must be 36 characters long')
      .test('bs58check', 'Invalid checksum', (val) => bs58Validation(val))
      .test(
        'isDelegateAdmin',
        'Wallet address is not a delegate admin of the vesting contract',
        () => isWalletDelegateAdmin,
      ),
  });

const CreateVestingSetDelegate = ({ onCreate, onCancel }) => {
  const { contractAddress } = useContractStateContext();
  const { setOps } = useOperationsDispatchContext();
  const { createOperation, getVestingInfo } = useAPI();
  const {
    request: loadVestingInfo,
    resp: vestingInfo,
    isLoading: isVestingInfoLoading,
  } = useRequest(getVestingInfo);

  const isWalletDelegateAdmin = useMemo(() => {
    return (
      vestingInfo?.storage.delegate_admin === contractAddress &&
      !isVestingInfoLoading
    );
  }, [vestingInfo, contractAddress, isVestingInfoLoading]);

  const createVestingSetDelegate = async (
    { vestingAddress, to },
    resetForm,
  ) => {
    try {
      const resp = await createOperation({
        contract_id: contractAddress,
        type: 'vesting_set_delegate',
        vesting_id: vestingAddress,
        to,
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
        to: '',
      }}
      validationSchema={Yup.lazy(() => schema(isWalletDelegateAdmin))}
      onSubmit={async (values, { resetForm }) => {
        await createVestingSetDelegate(values, resetForm);
      }}
    >
      {({
        values,
        errors,
        touched,
        isSubmitting,
        resetForm,
        setSubmitting,
        setFieldValue,
        setFieldTouched,
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

          <BForm.Group controlId="to">
            <OverlayTrigger
              overlay={
                <Tooltip>
                  Delegate must be a valid baker address. Otherwise, a
                  transaction will fail.
                </Tooltip>
              }
            >
              <FormLabel>Delegate address</FormLabel>
            </OverlayTrigger>
            <Field
              as={BForm.Control}
              type="text"
              name="to"
              aria-label="to"
              autoComplete="off"
              disabled={!isWalletDelegateAdmin}
              isInvalid={!!errors.to && touched.to}
              isValid={!errors.to && touched.to}
            />
            <ErrorMessage
              component={BForm.Control.Feedback}
              name="to"
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

            <Button
              type="submit"
              variant="info"
              style={{ marginRight: '10px' }}
              disabled={isSubmitting}
              onClick={async () => {
                if (
                  !errors.vestingAddress &&
                  touched.vestingAddress &&
                  isWalletDelegateAdmin
                ) {
                  setSubmitting(true);
                  await createVestingSetDelegate(
                    { ...values, to: '' },
                    resetForm,
                  );
                  setSubmitting(false);
                }
              }}
            >
              Undelegate
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

CreateVestingSetDelegate.propTypes = {
  onCreate: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default CreateVestingSetDelegate;
