import React from 'react';
import { ErrorMessage, Field, useFormikContext } from 'formik';
import { Form as BForm } from 'react-bootstrap';
import FormLabelWithTooltip from '../../../../FormLabelWithTooltip';

const InputDelegateAdmin = () => {
  const { errors, touched } = useFormikContext();

  return (
    <BForm.Group>
      <FormLabelWithTooltip
        labelTxt="Delegate admin address"
        tooltipTxt="The address that sets and changes the delegate/baker for a vesting
            contract."
      />

      <Field
        as={BForm.Control}
        type="text"
        name="delegateAddress"
        aria-label="delegateAddress"
        autoComplete="off"
        isInvalid={!!errors.delegateAddress && touched.delegateAddress}
        isValid={!errors.delegateAddress && touched.delegateAddress}
      />

      <ErrorMessage
        component={BForm.Control.Feedback}
        name="delegateAddress"
        type="invalid"
      />
    </BForm.Group>
  );
};

export default InputDelegateAdmin;
