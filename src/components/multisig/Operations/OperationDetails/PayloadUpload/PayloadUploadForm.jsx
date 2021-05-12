import React from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button, Form as BForm } from 'react-bootstrap';
import { FormLabel, FormSubmit } from '../../../../styled/Forms';
import useAPI from '../../../../../hooks/useApi';
import { handleError } from '../../../../../utils/errorsHandler';
import { isHex } from '../../../../../utils/helpers';
import { useContractStateContext } from '../../../../../store/contractContext';

const schema = Yup.object({
  payload: Yup.string()
    .required('Required')
    .test('isHex', 'Payload must be in hex format', (val) => isHex(val)),
  pubKey: Yup.string().required('Required'),
});

const PayloadUploadForm = ({ operationID, onUpload, onCancel }) => {
  const { contractAddress } = useContractStateContext();
  const { sendSignature } = useAPI();

  const onSubmit = async ({ payload, pubKey }, setSubmitting) => {
    try {
      setSubmitting(true);
      await sendSignature(operationID, {
        type: 'reject',
        contract_id: contractAddress,
        pub_key: payload,
        signature: pubKey,
      });
      onUpload();
    } catch (e) {
      handleError(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        payload: '',
        pubKey: '',
      }}
      validationSchema={schema}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit(values, setSubmitting);
      }}
    >
      {({ touched, errors, isSubmitting, handleBlur, handleChange }) => (
        <Form>
          <BForm.Group>
            <FormLabel>Payload</FormLabel>
            <BForm.Control
              as="textarea"
              rows={3}
              name="payload"
              aria-label="payload"
              autoComplete="off"
              isInvalid={!!errors.payload && touched.payload}
              isValid={!errors.payload && touched.payload}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            <ErrorMessage
              component={BForm.Control.Feedback}
              name="payload"
              type="invalid"
            />
          </BForm.Group>

          <BForm.Group>
            <FormLabel>Public key</FormLabel>
            <Field
              as={BForm.Control}
              type="text"
              name="pubKey"
              aria-label="pubKey"
              autoComplete="off"
              isInvalid={!!errors.pubKey && touched.pubKey}
              isValid={!errors.pubKey && touched.pubKey}
            />
            <ErrorMessage
              component={BForm.Control.Feedback}
              name="pubKey"
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

PayloadUploadForm.propTypes = {
  operationID: PropTypes.string.isRequired,
  onUpload: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default PayloadUploadForm;
