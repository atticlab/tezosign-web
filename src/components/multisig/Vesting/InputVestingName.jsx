import React from 'react';
import { ErrorMessage, Field, useFormikContext } from 'formik';
import { Form as BForm, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FormLabel } from '../../styled/Forms';

const InputVestingName = () => {
  const { errors, touched } = useFormikContext();

  return (
    <BForm.Group>
      <OverlayTrigger
        overlay={<Tooltip>A name to be attributed with the contract.</Tooltip>}
      >
        <FormLabel>Vesting contract name</FormLabel>
      </OverlayTrigger>

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
