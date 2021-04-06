import React from 'react';
import PropTypes from 'prop-types';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Form as BForm } from 'react-bootstrap';
import { FormLabel, FormSubmit } from '../../styled/Forms';
import { useContractStateContext } from '../../../store/contractContext';
import { bs58Validation } from '../../../utils/helpers';
import useAPI from '../../../hooks/useApi';
import { handleError } from '../../../utils/errorsHandler';

const schema = Yup.object({
  vestingAddress: Yup.string()
    .required('Required')
    .matches(
      'tz1|tz2|tz3|KT1',
      'Tezos address must start with tz1, tz2, tz3, KT1',
    )
    .matches(/^\S+$/, 'No spaces are allowed')
    .matches(/^[a-km-zA-HJ-NP-Z1-9]+$/, 'Invalid Tezos address')
    .length(36, 'Tezos address must be 36 characters long')
    .test('bs58check', 'Invalid checksum', (val) => bs58Validation(val)),
  to: Yup.string()
    .required('Required')
    .matches(
      'tz1|tz2|tz3|KT1',
      'Tezos address must start with tz1, tz2, tz3, KT1',
    )
    .matches(/^\S+$/, 'No spaces are allowed')
    .matches(/^[a-km-zA-HJ-NP-Z1-9]+$/, 'Invalid Tezos address')
    .length(36, 'Tezos address must be 36 characters long')
    .test('bs58check', 'Invalid checksum', (val) => bs58Validation(val)),
});

const CreateVestingSetDelegate = ({ onCreate, onCancel }) => {
  const { contractAddress } = useContractStateContext();
  const { createOperation } = useAPI();

  const createVestingSetDelegate = async (
    { vestingAddress, to },
    setSubmitting,
  ) => {
    try {
      const resp = await createOperation({
        contract_id: contractAddress,
        type: 'vesting_set_delegate',
        vesting_id: vestingAddress,
        to,
      });
      console.log(resp);
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
        to: '',
      }}
      validationSchema={schema}
      onSubmit={(values, { setSubmitting }) => {
        createVestingSetDelegate(values, setSubmitting);
      }}
    >
      {({ errors, touched, isSubmitting }) => (
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
          <BForm.Group controlId="to">
            <FormLabel>Recipient</FormLabel>
            <Field
              as={BForm.Control}
              type="text"
              name="to"
              aria-label="to"
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
