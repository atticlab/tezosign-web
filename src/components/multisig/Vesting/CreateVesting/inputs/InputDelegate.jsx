import React from 'react';
import { ErrorMessage, Field, useFormikContext } from 'formik';
import { Form as BForm } from 'react-bootstrap';
import { FormLabel } from '../../../../styled/Forms';

const InputDelegate = () => {
  const { errors, touched } = useFormikContext();

  return (
    <BForm.Group>
      <FormLabel>Delegate address</FormLabel>

      <Field
        as={BForm.Control}
        type="text"
        name="delegate"
        aria-label="delegate"
        autoComplete="off"
        isInvalid={!!errors.delegate && touched.delegate}
        isValid={!errors.delegate && touched.delegate}
      />

      <ErrorMessage
        component={BForm.Control.Feedback}
        name="delegate"
        type="invalid"
      />
    </BForm.Group>
  );
};

export default InputDelegate;
