import React from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Button, Form as BForm } from 'react-bootstrap';
import { FormLabel, FormSubmit } from '../../../../styled/Forms';
import PayloadType from '../PayloadDownload/PayloadType';
import useAPI from '../../../../../hooks/useApi';
import { useContractStateContext } from '../../../../../store/contractContext';
import { handleError } from '../../../../../utils/errorsHandler';
import { bs58Validation } from '../../../../../utils/helpers';
import payloadTypeSchema from '../../../../../utils/schemas/payloadTypeSchema';

const schema = Yup.object({
  payloadType: payloadTypeSchema,
  signature: Yup.string()
    .required('Required')
    .test('bs58check', 'Invalid checksum', (val) => bs58Validation(val)),
  pubKey: Yup.string()
    .required('Required')
    .test('bs58check', 'Invalid checksum', (val) => bs58Validation(val)),
});

const PayloadUploadForm = ({
  operationID,
  approveDisabled,
  rejectDisabled,
  onUpload,
  onCancel,
}) => {
  const { contractAddress } = useContractStateContext();
  const { sendSignature } = useAPI();

  const onSubmit = async ({ payloadType, signature, pubKey }, resetForm) => {
    try {
      await sendSignature(operationID, {
        type: payloadType,
        contract_id: contractAddress,
        pub_key: pubKey,
        signature,
      });

      resetForm();
      onUpload();
    } catch (e) {
      handleError(e);
    }
  };

  return (
    <Formik
      initialValues={{
        payloadType: '',
        signature: '',
        pubKey: '',
      }}
      validationSchema={schema}
      onSubmit={async (values, { resetForm }) => {
        await onSubmit(values, resetForm);
      }}
    >
      {({ touched, errors, isSubmitting, handleBlur, handleChange }) => (
        <Form>
          <PayloadType
            approveDisabled={approveDisabled}
            rejectDisabled={rejectDisabled}
          />

          <BForm.Group>
            <FormLabel>Signature</FormLabel>
            <BForm.Control
              as="textarea"
              rows={3}
              name="signature"
              aria-label="signature"
              autoComplete="off"
              isInvalid={!!errors.signature && touched.signature}
              isValid={!errors.signature && touched.signature}
              onBlur={handleBlur}
              onChange={handleChange}
            />
            <ErrorMessage
              component={BForm.Control.Feedback}
              name="signature"
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
  approveDisabled: PropTypes.bool.isRequired,
  rejectDisabled: PropTypes.bool.isRequired,
  onUpload: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default PayloadUploadForm;
