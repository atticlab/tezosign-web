import React from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  Form as BForm,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import { FormLabel, FormSubmit } from '../../../styled/Forms';
import { sendTx } from '../../../../plugins/beacon';
import useAPI from '../../../../hooks/useApi';
import { bs58Validation } from '../../../../utils/helpers';
import { handleError } from '../../../../utils/errorsHandler';

const schema = Yup.object({
  to: Yup.string()
    .required(
      `This field cannot be empty. If you want to undelegate, click the button 'Undelegate'.`,
    )
    .matches('tz1|tz2|tz3', 'Tezos address must start with tz1, tz2, tz3')
    .matches(/^\S+$/, 'No spaces are allowed')
    .matches(/^[a-km-zA-HJ-NP-Z1-9]+$/, 'Invalid Tezos address')
    .length(36, 'Tezos address must be 36 characters long')
    .test('bs58check', 'Invalid checksum', (val) => bs58Validation(val)),
});

const VestingSetDelegateForm = ({ vestingAddress, onSubmit, onCancel }) => {
  const { sendVestingOperation } = useAPI();

  const sendVestingOperationRequest = async (type, { to }, resetForm) => {
    try {
      const resp = await sendVestingOperation({
        type,
        to,
      });

      const params = {
        ...resp.data,
        // TODO: Research value formats
        value: JSON.parse(resp.data.value),
      };

      await sendTx(0, vestingAddress, params);

      resetForm();
      onSubmit();
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
      validationSchema={schema}
      onSubmit={async (values, { resetForm }) => {
        await sendVestingOperationRequest(
          'vesting_set_delegate',
          values,
          resetForm,
        );
      }}
    >
      {({ errors, touched, isSubmitting, resetForm, setSubmitting }) => (
        <Form>
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
              autoComplete="off"
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

            <Button
              variant="info"
              style={{ marginRight: '10px' }}
              disabled={isSubmitting}
              onClick={async () => {
                setSubmitting(true);

                await sendVestingOperationRequest(
                  'vesting_set_delegate',
                  { to: '' },
                  resetForm,
                );

                setSubmitting(false);
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

VestingSetDelegateForm.propTypes = {
  vestingAddress: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default VestingSetDelegateForm;
