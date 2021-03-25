import React from 'react';
import PropTypes from 'prop-types';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Form as BForm } from 'react-bootstrap';
import { FormLabel, FormSubmit } from '../../styled/Forms';
import { bs58Validation } from '../../../utils/helpers';

const schema = Yup.object({
  name: Yup.string()
    .required('Required')
    .max(32, 'At most 32 characters')
    .matches(/^[\w ]*$/, 'Only latin characters and numbers are allowed')
    .matches(/^[\w]+( [\w]+)*$/, 'Unnecessary spaces'),
  address: Yup.string()
    .required('Required')
    .matches(
      'tz1|tz2|tz3|KT1',
      'Tezos contract address must start with tz1, tz2, tz3 or KT1',
    )
    .matches(/^\S+$/, 'No spaces are allowed')
    .matches(/^[a-km-zA-HJ-NP-Z1-9]+$/, 'Invalid Tezos address')
    .length(36, 'Tezos address must be 36 characters long')
    .test('bs58check', 'Invalid checksum', (val) => bs58Validation(val)),
  balance: Yup.number()
    .required('Required')
    .min(1, 'Minimum balance is 1')
    .max(10, 'Maximum balance is 10'),
});

const VestingEditor = ({ name, address, balance, onCancel }) => {
  return (
    <Formik
      initialValues={{
        name,
        address,
        balance,
      }}
      validationSchema={schema}
      onSubmit={(values, { setSubmitting }) => {
        console.log(values);
        console.log(setSubmitting);
      }}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form>
          <BForm.Group>
            <FormLabel>Vesting contract name</FormLabel>
            <Field
              as={BForm.Control}
              type="text"
              name="name"
              aria-label="name"
              isInvalid={!!errors.name && touched.name}
              isValid={!errors.name && touched.name}
            />

            <ErrorMessage
              component={BForm.Control.Feedback}
              name="name"
              type="invalid"
            />
          </BForm.Group>

          <BForm.Group>
            <FormLabel>Contract address</FormLabel>

            <Field
              as={BForm.Control}
              type="text"
              name="address"
              aria-label="address"
              isInvalid={!!errors.address && touched.address}
              isValid={!errors.address && touched.address}
            />

            <ErrorMessage
              component={BForm.Control.Feedback}
              name="address"
              type="invalid"
            />
          </BForm.Group>

          <BForm.Group>
            <FormLabel>Balance</FormLabel>

            <Field
              as={BForm.Control}
              type="number"
              max="10"
              min="0"
              name="balance"
              aria-label="balance"
              isInvalid={!!errors.balance && touched.balance}
              isValid={!errors.balance && touched.balance}
            />

            <ErrorMessage
              component={BForm.Control.Feedback}
              name="balance"
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

VestingEditor.propTypes = {
  name: PropTypes.string,
  address: PropTypes.string,
  balance: PropTypes.number,
  onCancel: PropTypes.func.isRequired,
};
VestingEditor.defaultProps = {
  name: '',
  address: '',
  balance: 0,
};

export default VestingEditor;
