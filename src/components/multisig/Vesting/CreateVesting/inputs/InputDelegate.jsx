import React from 'react';
import { ErrorMessage, Field, useFormikContext } from 'formik';
import { Form as BForm, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FormLabel } from '../../../../styled/Forms';

const InputDelegate = () => {
  const { errors, touched } = useFormikContext();

  return (
    <BForm.Group>
      <OverlayTrigger
        overlay={
          <Tooltip>
            The baker that a vesting contract delegates its funds to.
          </Tooltip>
        }
      >
        <FormLabel>Delegate address</FormLabel>
      </OverlayTrigger>

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
