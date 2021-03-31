import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Form as BForm, InputGroup } from 'react-bootstrap';
import { FormLabel, FormSubmit } from '../../styled/Forms';
import BtnMax from '../../styled/BtnMax';
import { handleError } from '../../../utils/errorsHandler';
import { bs58Validation, limitInputDecimals } from '../../../utils/helpers';

const schema = (maxAmount = 30000) => {
  return Yup.object({
    amount: Yup.number()
      .required('Required')
      .max(maxAmount, `Maximum amount is ${maxAmount} XTZ`)
      .min(0.000001, `Minimum amount is 0.000001 XTZ`),
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
};

const balance = 10;

const VestingOperationForm = ({ operationType, onSubmit, onCancel }) => {
  const sendVestingOperation = async (values, setSubmitting) => {
    try {
      console.log('send');
      console.log(operationType);
      console.log(values);
      console.log(setSubmitting);
      console.log(onSubmit);
    } catch (e) {
      handleError(e);
    }
  };

  return (
    <Formik
      initialValues={{
        amount: '',
        to: '',
      }}
      validationSchema={Yup.lazy(() => schema(balance))}
      onSubmit={(values, { setSubmitting }) => {
        sendVestingOperation(values, setSubmitting);
      }}
    >
      {({ errors, touched, isSubmitting, setFieldValue, setFieldTouched }) => (
        <Form>
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
                step="0.001"
                min="0"
                onKeyPress={(event) => limitInputDecimals(event, 6)}
              />

              <InputGroup.Append>
                <InputGroup.Text style={{ paddingTop: 0, paddingBottom: 0 }}>
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <BtnMax
                      onClick={() => {
                        setFieldValue('amount', balance);
                        setFieldTouched('amount', true, false);
                      }}
                    >
                      MAX
                    </BtnMax>
                    <span style={{ fontSize: '12px', marginBottom: '2px' }}>
                      {balance}
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

VestingOperationForm.propTypes = {
  operationType: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default VestingOperationForm;
