import React from 'react';
import { ErrorMessage, Field, useFormikContext } from 'formik';
import { Form as BForm } from 'react-bootstrap';
import FormLabelWithTooltip from '../../../../FormLabelWithTooltip';

const InputUnvestedPartsAmount = () => {
  const { errors, touched } = useFormikContext();

  return (
    <BForm.Group>
      <FormLabelWithTooltip
        labelTxt="Vested parts number"
        tooltipTxt="Number of parts the vested funds are split into. Each part gets
            unvested upon hitting the set time interval."
      />

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
