import React from 'react';
import { ErrorMessage, Field, useFormikContext } from 'formik';
import { Form as BForm, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FormLabel } from '../../../../styled/Forms';

const InputDelegateAdmin = () => {
  const { errors, touched } = useFormikContext();

  return (
    <BForm.Group>
      <OverlayTrigger
        overlay={
          <Tooltip>
            The address that sets and changes the delegate/baker for a vesting
            contract.
          </Tooltip>
        }
      >
        <FormLabel>Delegate admin address</FormLabel>
      </OverlayTrigger>
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
