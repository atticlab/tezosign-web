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
            Number of parts the vested funds are split into. Each part gets
            unvested upon hitting the set time interval.
          </Tooltip>
        }
      >
        <FormLabel>Vested parts number</FormLabel>
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
