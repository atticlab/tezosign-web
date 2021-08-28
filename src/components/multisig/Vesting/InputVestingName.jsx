import React from 'react';
import { ErrorMessage, Field, useFormikContext } from 'formik';
import { Form as BForm } from 'react-bootstrap';
import FormLabelWithTooltip from '../../FormLabelWithTooltip';

const InputVestingName = () => {
  const { errors, touched } = useFormikContext();

  return (
    <BForm.Group>
      <FormLabelWithTooltip
        labelTxt="Vesting contract name"
        tooltipTxt="A name to be attributed with the contract."
      />

      <Field
        as={BForm.Control}
        type="text"
        name="name"
        aria-label="name"
        autoComplete="off"
        isInvalid={!!errors.name && touched.name}
        isValid={!errors.name && touched.name}
      />

      <ErrorMessage
        component={BForm.Control.Feedback}
        name="name"
        type="invalid"
      />
    </BForm.Group>
  );
};

export default InputVestingName;
