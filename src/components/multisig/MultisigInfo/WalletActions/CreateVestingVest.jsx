import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Form as BForm, InputGroup } from 'react-bootstrap';
import styled from 'styled-components';
import { FormLabel, FormSubmit } from '../../../styled/Forms';
import { useContractStateContext } from '../../../../store/contractContext';
import {
  bs58Validation,
  limitInputDecimals,
  convertMutezToXTZ,
} from '../../../../utils/helpers';
import useAPI from '../../../../hooks/useApi';
import { handleError } from '../../../../utils/errorsHandler';
import { useOperationsDispatchContext } from '../../../../store/operationsContext';
import {
  useUserStateContext,
  useUserDispatchContext,
} from '../../../../store/userContext';

const BtnMax = styled(Button).attrs({ variant: 'link' })`
  padding: 0;
  margin-right: 5px;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  color: ${({ theme }) => theme.blue};

  &:hover,
  &:focus {
    text-decoration: none;
    color: #249ac2;
  }
`;

const schema = (maxAmount = 0) =>
  Yup.object({
    vestingAddress: Yup.string()
      .required('Required')
      .matches('KT1', 'Tezos contract address must start with KT1')
      .matches(/^\S+$/, 'No spaces are allowed')
      .matches(/^[a-km-zA-HJ-NP-Z1-9]+$/, 'Invalid Tezos address')
      .length(36, 'Tezos address must be 36 characters long')
      .test('bs58check', 'Invalid checksum', (val) => bs58Validation(val)),
    amount: Yup.number()
      .required('Required')
      .max(maxAmount, `Maximum amount is ${maxAmount} XTZ`)
      .min(0.000001, `Minimum amount is 0.000001 XTZ`),
    // to: Yup.string()
    //   .required('Required')
    //   .matches('tz1|tz2|tz3', 'Tezos address must start with tz1, tz2, tz3')
    //   .matches(/^\S+$/, 'No spaces are allowed')
    //   .matches(/^[a-km-zA-HJ-NP-Z1-9]+$/, 'Invalid Tezos address')
    //   .length(36, 'Tezos address must be 36 characters long')
    //   .test('bs58check', 'Invalid checksum', (val) => bs58Validation(val)),
  });

const CreateVestingVest = ({ onCreate, onCancel }) => {
  const { createOperation } = useAPI();
  const { balance: balanceRaw, address } = useUserStateContext();
  const { getBalance } = useUserDispatchContext();
  const { contractAddress } = useContractStateContext();
  const { setOps } = useOperationsDispatchContext();

  useEffect(() => {
    getBalance(address);
  }, [getBalance, address]);

  const balanceConverted = useMemo(() => {
    return convertMutezToXTZ(balanceRaw?.balance);
  }, [balanceRaw]);

  const createVestingVest = async (
    { vestingAddress, amount },
    setSubmitting,
  ) => {
    try {
      const resp = await createOperation({
        contract_id: contractAddress,
        type: 'vesting_vest',
        vesting_id: vestingAddress,
        amount,
        // to,
      });
      console.log(resp);
      await setOps((prev) => {
        return [resp.data, ...prev];
      });
      onCreate();
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
        amount: '',
        // to: '',
      }}
      validationSchema={Yup.lazy(() => schema(balanceConverted))}
      onSubmit={(values, { setSubmitting }) => {
        createVestingVest(values, setSubmitting);
      }}
    >
      {({ errors, touched, isSubmitting, setFieldValue, setFieldTouched }) => (
        <Form>
          <BForm.Group controlId="vestingAddress">
            <FormLabel>Vesting address</FormLabel>
            <Field
              as={BForm.Control}
              type="text"
              name="vestingAddress"
              aria-label="vestingAddress"
              isInvalid={!!errors.vestingAddress && touched.vestingAddress}
              isValid={!errors.vestingAddress && touched.vestingAddress}
            />
            <ErrorMessage
              component={BForm.Control.Feedback}
              name="vestingAddress"
              type="invalid"
            />
          </BForm.Group>

          <BForm.Group controlId="amount">
            <FormLabel>Enter Amount</FormLabel>
            <InputGroup>
              <Field
                as={BForm.Control}
                type="number"
                name="amount"
                aria-label="amount"
                isInvalid={!!errors.amount && touched.amount}
                isValid={!errors.amount && touched.amount}
                step="0.000001"
                min="0"
                onKeyPress={(event) => limitInputDecimals(event, 6)}
              />

              <InputGroup.Append>
                <InputGroup.Text style={{ paddingTop: 0, paddingBottom: 0 }}>
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <BtnMax
                      onClick={() => {
                        setFieldValue('amount', balanceConverted);
                        setFieldTouched('amount', true, false);
                      }}
                    >
                      MAX
                    </BtnMax>
                    <span style={{ fontSize: '12px', marginBottom: '2px' }}>
                      {balanceConverted}
                    </span>
                  </span>
                </InputGroup.Text>
              </InputGroup.Append>

              <ErrorMessage
                component={BForm.Control.Feedback}
                name="amount"
                type="invalid"
              />
            </InputGroup>
          </BForm.Group>
          {/* <BForm.Group controlId="to"> */}
          {/*  <FormLabel>Recipient</FormLabel> */}
          {/*  <Field */}
          {/*    as={BForm.Control} */}
          {/*    type="text" */}
          {/*    name="to" */}
          {/*    aria-label="to" */}
          {/*    isInvalid={!!errors.to && touched.to} */}
          {/*    isValid={!errors.to && touched.to} */}
          {/*  /> */}
          {/*  <ErrorMessage */}
          {/*    component={BForm.Control.Feedback} */}
          {/*    name="to" */}
          {/*    type="invalid" */}
          {/*  /> */}
          {/* </BForm.Group> */}

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
