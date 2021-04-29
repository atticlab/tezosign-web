import React from 'react';
import { Form as BForm, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ErrorMessage, Field, useFormikContext } from 'formik';
import { FormLabel } from '../../../../styled/Forms';

const InputVestingAddress = () => {
  const { errors, touched } = useFormikContext();

  return (
    <BForm.Group>
      <OverlayTrigger
        overlay={
          <Tooltip>
            The address where a withdrawn amount of XTZ from a vesting contract
            is sent.
          </Tooltip>
        }
      >
        <FormLabel>Withdrawal address</FormLabel>
      </OverlayTrigger>
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
