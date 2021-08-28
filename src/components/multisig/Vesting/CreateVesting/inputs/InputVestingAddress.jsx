import React from 'react';
import { Form as BForm } from 'react-bootstrap';
import { ErrorMessage, Field, useFormikContext } from 'formik';
import FormLabelWithTooltip from '../../../../FormLabelWithTooltip';

const InputVestingAddress = () => {
  const { errors, touched } = useFormikContext();

  return (
    <BForm.Group>
      <FormLabelWithTooltip
        labelTxt="Withdrawal address"
        tooltipTxt="The address to which the unvested XTZ is sent."
      />

      <Field
        as={BForm.Control}
        type="text"
        name="vestingAddress"
        aria-label="vestingAddress"
        autoComplete="off"
        isInvalid={!!errors.vestingAddress && touched.vestingAddress}
        isValid={!errors.vestingAddress && touched.vestingAddress}
      />

      <ErrorMessage
        component={BForm.Control.Feedback}
        name="vestingAddress"
        type="invalid"
      />
    </BForm.Group>
  );
};

export default InputVestingAddress;
