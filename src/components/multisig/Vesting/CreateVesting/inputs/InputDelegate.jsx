import React from 'react';
import { ErrorMessage, Field, useFormikContext } from 'formik';
import { Form as BForm } from 'react-bootstrap';
import FormLabelWithTooltip from '../../../../FormLabelWithTooltip';

const InputDelegate = () => {
  const { errors, touched } = useFormikContext();

  return (
    <BForm.Group>
      <FormLabelWithTooltip
        labelTxt="Delegate address"
        tooltipTxt="The baker that a vesting contract delegates its funds to."
      />

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
