import React from 'react';
import { ErrorMessage, Field, useFormikContext } from 'formik';
import { Form as BForm, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FormLabel } from '../../../../styled/Forms';

const InputUnvestedPartsAmount = () => {
  const { errors, touched } = useFormikContext();

  return (
    <BForm.Group>
      <OverlayTrigger
        overlay={
          <Tooltip>
            The number of parts the vesting contract balance will be divided
            into.
          </Tooltip>
        }
      >
        <FormLabel>Number of unvested parts</FormLabel>
      </OverlayTrigger>

      <Field
        as={BForm.Control}
        type="number"
        name="parts"
        aria-label="parts"
        autoComplete="off"
        min="1"
        isInvalid={!!errors.parts && touched.parts}
        isValid={!errors.parts && touched.parts}
      />

      <ErrorMessage
        component={BForm.Control.Feedback}
        name="parts"
        type="invalid"
      />
    </BForm.Group>
  );
};

export default InputUnvestedPartsAmount;
